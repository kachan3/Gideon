import {readFileSync, readdirSync} from 'node:fs';
import {posix} from 'node:path';
import {rulebook} from './rulebook.mjs';
import {normalizeName} from '../js/reference-format.js';

const root = new URL('../../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
export const plain = text => text.replace(/<a [^>]*><\/a>/g,'').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1')
  .replace(/\*\*|__|\x60/g,'').replace(/\*([^*\n]+)\*/g,'$1').trim();
export const key = text => normalizeName(text).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const title = text => plain(text.replace(/\s+\*\(.+$/,'')).replace(/^\d+(?:\.\d+)*[.)]?\s+/, '').trim();
const short = name => name.replace(/\s+\([^)]*\).*$/, '').replace(/[.:]+$/, '').trim();
const clean = text => text.replace(/^\s*---\s*$/gm,'').trim();

// Keep whole sections (including subordinate mechanics), whole list entries
// (including their indented effects), and the headers belonging to each row.
function parse(doc) {
  const lines = doc.texto.split('\n');
  const sections = [], items = [], rows = [];
  let header = [], stack = [];
  for (let i=0;i<lines.length;i++) {
    const line = lines[i];
    const h = line.match(/^(#{1,6})\s+(.+)/);
    if (h) {
      while (stack.length && stack.at(-1).level >= h[1].length) stack.pop().end = i;
      const section = {name:title(h[2]), raw:h[2], level:h[1].length, start:i, end:lines.length};
      sections.push(section); stack.push(section);
    }
    if (line.startsWith('|')) {
      const cells = line.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
      if (!i || !lines[i-1].startsWith('|')) header=cells;
      else if (!cells.every(c=>/^:?-+:?$/.test(c)) && cells.length===header.length)
        rows.push({name:plain(cells[0]), cells, header, section:stack.at(-1)?.name});
    }
    const item = line.match(/^(?:[-*] |\d+\. )?\*\*(.+?)\*\*([^\n]*)$/);
    if (!item) continue;
    let end=i+1;
    while (end<lines.length && (!lines[end].trim() || /^(?: {2,}|\t)/.test(lines[end]))) end++;
    items.push({name:short(plain(item[1])), body:clean([item[2].replace(/^\s*[.:—–-]\s*/,''), ...lines.slice(i+1,end)].join('\n')), section:stack.at(-1)?.name});
  }
  for (const s of sections) s.body=clean(lines.slice(s.start+1,s.end).join('\n'));
  return {...doc, sections, items, rows};
}
function documents(db) {
  const docs=new Map(rulebook.map(d=>[d.id,{...d,texto:d.texto.replace(/\r\n/g,'\n')}]));
  function add(id,grupo,publish=true) {
    if (docs.has(id)) return;
    const texto=read(id);
    docs.set(id,{id,grupo,texto,titulo:texto.match(/^# (.+)$/m)?.[1]??posix.basename(id,'.md'),publish});
  }
  const content='20_Contenido/';
  for (const dir of readdirSync(new URL(content,root)).filter(n=>n.startsWith('Senda_'))) {
    for (const file of readdirSync(new URL(content+dir+'/',root)).filter(n=>n.endsWith('.md')&&!n.includes('_00_'))) add(content+dir+'/'+file,dir.replace('_',' '));
  }
  for (const file of ['Herramientas_del_Lanzador','Accion_Denme_Algo_de_Tiempo']) add(content+file+'.md','Magia y referencias');
  const existing=new Set(db.prepare('SELECT nombre FROM epifanias UNION SELECT nombre FROM dotes').all().map(r=>key(r.nombre)));
  for (const file of readdirSync(new URL(content+'Dotes/',root))) {
    if (!file.endsWith('.md') || file==='Index.md') continue;
    const draft=file.startsWith('_esqueleto_');
    if (!draft || existing.has(key(file.replace(/^_esqueleto_/,'').slice(0,-3)))) add(content+'Dotes/'+file,'Dotes',!draft);
  }
  return [...docs.values()].map(parse);
}

export function coreTexts(db) {
  const docs=documents(db), atoms=new Map(), extraFields=[];
  function add(kind,name,text,doc,aliases=[],replace=false) {
    name=name.trim(); text=clean(text);
    if (!name || !text || !key(name)) return;
    const id=kind+'-'+key(name);
    if (!atoms.has(id)||replace) atoms.set(id,{id,kind,nombre:name,texto:text,source:doc.id,aliases:new Set([name,...aliases].filter(Boolean))});
    return atoms.get(id);
  }
  const find = filename => docs.find(d=>d.id.endsWith('/'+filename+'.md'));
  const section = (doc,pattern) => doc.sections.find(s=>pattern.test(s.name));
  const textRow = r => r.cells.slice(1).map((v,i)=>r.cells.length===2?v:r.header[i+1]+': '+v).filter(Boolean).join('\n');
  const addRow = (kind,r,d,name=r.name) => add(kind,name,textRow(r),d);
  const byKind = (kind,name) => atoms.get(kind+'-'+key(name));
  const states=find('Core_18_Estados_Alterados'), damage=find('Dano_y_Defensas'), fear=find('Core_19_Miedo_y_Coraje');
  const stateAliases = {Aturdimiento:['aturdido','aturdida','aturdidos','aturdidas','aturido','aturida'], 'Inmovilizado':['inmovilizada'], Hemorragia:['hemorragias']};
  for (const i of states.items.filter(i=>i.body&&i.section==='ESTADOS ALTERADOS')) {
    let name=i.name, body=i.body, source=states;
    const link=body.match(/\]\(([^)#]*)(?:#([^)]+))?\)/);
    if (link && /^(?:Ver |Consultá |Su condición|Reglas trasladadas)/i.test(body)) {
      const target=link[1]?find(posix.basename(link[1],'.md')):states;
      const dest=target?.sections.find(s=>key(s.name)===key(link[2]??name));
      if (dest) {source=target;body=dest.body;}
    }
    if (name.startsWith('Miedo')) {name='Miedo';source=fear;body=section(fear,/Efecto Global/).body;}
    if (name==='Envenenado') {source=find('Reglas_de_Venenos_y_Antidotos');body=section(source,/El Estado Envenenado/).body;}
    const aliases=[...(stateAliases[name]??[])];
    if (name.endsWith('o')) aliases.push(name+'s',name.slice(0,-1)+'a',name.slice(0,-1)+'as');
    add('estado',name,body,source,aliases);
  }
  for(const s of states.sections.filter(s=>s.level===2&&!/^ESTADOS/i.test(s.name))) add('estado',short(s.name),s.body,states,stateAliases[short(s.name)],true);
  for (const [,n,name,body] of fear.texto.matchAll(/^- \*\*Nivel (\d) \(([^)]+)\):\*\* (.+)$/gm))
    add('estado',name,body,fear,['Miedo '+n]);
  for (const r of damage.rows.filter(r=>plain(r.header[0])==='Tipo de daño'&&r.header[1]==='Mitigación')) addRow('dano',r,damage);
  for(const i of damage.items.filter(i=>['Física','Energética','Melee','Proyectil','Área de efecto','Directo','Debilidad','Resistencia','Afinidad','Protección','Frágil'].includes(i.name))) {
    const category=['Física','Energética'].includes(i.name);
    add(category?'fuente':['Melee','Proyectil','Área de efecto','Directo'].includes(i.name)?'medio':'defensa',i.name,i.body,damage,category?[i.name.slice(0,-1)+'o']:[]);
  }
  for (const d of docs) {
    if (d.id.includes('/Linajes_Jugables/')) {
      const names=d.titulo.split(' / ');
      add('linaje',names[0],d.sections[0].body,d,names.slice(1));
      for(const line of d.texto.split('\n')) {
        const m=line.match(/(?:^|^\- |\. )\*\*([^*:]+):\*\*\s*(.+)/);
        if(m&&!/Escalado Vital|Bonos de creación/.test(m[1])) add('rasgo',m[1],m[2],d);
      }
    }
    if(d.id.includes('/Dotes/')&&!d.id.endsWith('/Index.md')) {
      const name=d.sections[0].name;
      const epifania=/\*\*Tipo:\*\* Epifanía/i.test(d.texto)||db.prepare('SELECT 1 FROM epifanias WHERE nombre=?').get(name);
      add(epifania?'epifania':'dote',name,d.sections[0].body,d,[short(name),...name.split(' / ')]);
      if (epifania) for(const s of d.sections.slice(1)) {
        const m=s.name.match(/^(Truco|Mística)\s*[—–-]\s*(.+)/);
        if(m) add(m[1]==='Truco'?'truco':'mistica',m[2],s.body,d);
        else if (db.prepare('SELECT 1 FROM efectos WHERE nombre=?').get(s.name)) {
          const shared=d.sections.find(x=>/^(Reglas compartidas|Parámetros compartidos|Mecánica — Predicción)/.test(x.name));
          add('efecto',s.name,[s.body,shared?.body].filter(Boolean).join('\n\n'),d);
        }
      }
      const decay=d.texto.match(/^ {4}- \*\*Force Decay[^\n]*\n((?: {6}.+(?:\n|$))+)/m);
      if(decay) add('efecto','Force Decay',decay[1],d);
    }
  }
  const actions=find('Acciones_Genericas'), equip=find('Core_14_Equipamiento'), smith=find('DMs_Blacksmit'), magic=find('Core_13_Sistema_de_Magia_y_Energia');
  for(const r of actions.rows.filter(r=>r.header[0]==='Acción')) addRow('accion',r,actions);
  for(const s of actions.sections.filter(s=>s.level===2)) {
    const n=s.name.split(/ [—–-] /)[0].replace(/\s+\(.*$/,'');
    if(s.body&&!/^(Notación|Resolución|Acciones con|Otras acciones)/.test(n)) add('accion',n,s.body,actions,[],true);
  }
  const reactive=find('Reacciones_Defensivas');
  for(const i of reactive.items.filter(i=>/ · /.test(i.name))) add('maniobra',i.name.split(' · ')[0],i.body,reactive);
  for(const i of equip.items.filter(i=>i.section==='Propiedades de las Armas')) add('propiedad',i.name,i.body,equip);
  for(const r of smith.rows.filter(r=>r.header[0]==='Arma'&&r.header[1]==='Propiedades')) addRow('arma',r,smith,short(r.name));
  for(const r of smith.rows.filter(r=>r.header[0]==='Desventaja'&&r.header[1]==='Penalización al ataque')) addRow('propiedad',r,smith);
  for(const s of smith.sections.filter(s=>/^Special Training|^Torpe/.test(s.name))) add('propiedad',s.name.split(/ [—(]/)[0],s.body,smith);
  for(const r of equip.rows.filter(r=>r.header[0]==='Base')) add('escudo',r.name,textRow(r),equip,r.name==='Torre'?['Escudo Torre']:[]);
  for(const r of equip.rows.filter(r=>r.header[1]==='Especialidad')) {
    const base=db.prepare('SELECT nombre FROM bases_armadura WHERE categoria=? AND especialidad=?').get(r.name,plain(r.cells[1]));
    if(base) add('armadura',base.nombre,textRow(r)+'\n\n'+equip.texto.match(/^Protección por tipo = .*$/m)[0],equip);
  }
  for(const r of magic.rows.filter(r=>r.header[0]==='Intervalo')) addRow('duracion',r,magic);
  for(const r of magic.rows.filter(r=>r.section==='Concentración'&&r.header[0]==='Nivel')) {
    const parameter=r.name==='Demandante'?magic.texto.match(/^\*\*Demandante\(X\).*$/m)?.[0]:'';
    add('concentracion','Concentración '+r.name,[textRow(r),parameter].filter(Boolean).join('\n\n'),magic,r.name==='Ligera'?[]:[r.name]);
  }
  const toughness=damage.texto.match(/^\*\*Dureza\*\*[^\n]*\n> [^\n]+/m);
  if(toughness)add('defensa','Dureza',toughness[0],damage);
  for(const r of magic.rows.filter(r=>r.header[0]==='Ejemplo de Efecto')) {
    const id=db.prepare('SELECT id FROM efectos WHERE nombre=?').get(short(r.name))?.id;
    const atom=byKind('efecto',short(r.name));
    if(id&&atom) {
      extraFields.push({table:'efectos',id,field:'efecto_base',value:plain(r.cells[3]),atom,source:magic.id});
      // Cost and scaling belong to the effect segment. Keep separate duration
      // and maintenance paragraphs in the complete description.
      const scaling=atom.texto.split('\n').filter(line=>/\bPL\b/i.test(line)&&
        !/duraci[oó]n|mantenimiento|medium|shape|^\s*\||esqueleto/i.test(line)).map(line=>plain(line.replace(/^\s*[-*]\s+/,'')));
      extraFields.push({table:'efectos',id,field:'escalado_texto',value:scaling.join('\n')||plain(r.cells[2]),atom,source:scaling.length?atom.source:magic.id});
    }
  }
  for(const s of equip.sections.filter(s=>/^(Botiquín|Medallón de Moonstone)$/.test(s.name))) add('objeto',s.name,s.body,equip);
  for(const s of find('Herramientas_del_Lanzador').sections.filter(s=>s.level===2)) add('herramienta',s.name,s.body,find('Herramientas_del_Lanzador'));
  for(const r of magic.rows.filter(r=>['Medium','Shape'].includes(r.header[0])&&!r.name.includes('ESQUELETO'))) {
    const extra=r.name==='Touch'?section(magic,/^Touch \(Toque\)/)?.body:'';
    add(r.header[0].toLowerCase(),r.name,[textRow(r),extra].filter(Boolean).join('\n\n'),magic,[r.name.replace(' radio)',')'),...(r.name==='Touch'?['Toque']:[])]);
  }
  const skills=find('Atributos_y_Habilidades'), origins=find('Origenes_y_Oficios_Demo'), creation=find('Creacion_de_Personaje');
  for(const r of skills.rows.filter(r=>/habilidad/i.test(r.header[0])&&r.header[1]==='Descripción')) addRow('habilidad',r,skills);
  for(const i of skills.items.filter(i=>i.section==='Descripción de atributos y habilidades hijas'&&i.body)) add('atributo',i.name,i.body,skills);
  for(const r of origins.rows.filter(r=>r.header[0]==='Nacimiento')) addRow('nacimiento',r,origins);
  for(const [table,parent,d] of [['dedicaciones_preguntas','dedicaciones',creation],['nacimientos_preguntas','nacimientos',origins]]) {
    const fk=table==='dedicaciones_preguntas'?'dedicacion_id':'nacimiento_id';
    for(const row of db.prepare('SELECT q.id,q.numero,p.nombre FROM '+table+' q JOIN '+parent+' p ON p.id=q.'+fk+' WHERE p.disponible_demo=1').all()){
      const s=d.sections.find(s=>s.name===row.nombre);
      const question=s?.body.match(new RegExp('^'+row.numero+'\\. (¿[^\\n]+)','m'))?.[1].replace(/\s*\(\*\)\s*$/,'');
      if(question) extraFields.push({table,id:row.id,field:'pregunta',value:question,source:d.id});
    }
  }
  for(const r of origins.rows.filter(r=>r.header[0]==='Dedicación')) {
    const summary=creation.sections.find(s=>s.name===r.name)?.body.split('**Preguntas:**')[0].trim();
    add('dedicacion',r.name,[summary,textRow(r)].filter(Boolean).join('\n\n'),origins);
  }
  for(const i of origins.items.filter(i=>i.section==='Uso durante la partida')) for(const name of i.name.split(' / ')) add('oficio',name,i.body,origins);
  for(const d of docs.filter(d=>d.id.includes('/Senda_'))) {
    for(const s of d.sections) {
      const n=short(s.name.replace(/^Insignia \d+ [—–-] /,'').replace(/^Herencia de Lanzador$/,'Herencia'));
      if (/^Plegaria Diaria [—–-] /.test(n.replace(/^[A-Z]\. /,''))) add('plegaria',n.split(/ [—–-] /).at(-1),s.body,d);
      if (d.id.includes('Epifanias_y_Artefactos') && s.level===4&&/^(Blunderblaze|Varita del Amanecer|Mastín de Huesos)$/.test(n)) add('artefacto',n,s.body,d);
      if (db.prepare("SELECT 1 FROM clases_rasgos WHERE nombre=? UNION SELECT 1 FROM rasgos WHERE nombre=? AND tipo='Capacidad' UNION SELECT 1 FROM dotes WHERE nombre=?").get(n,n,n)) add('rasgo',n,s.body,d);
    }
    if(d.id.includes('Dogmas_del_Bien')) for(const i of d.items.filter(i=>i.body)) {
      const n=i.name.replace(/\s*\(\*?.*$/,'');
      if(db.prepare('SELECT 1 FROM acciones WHERE nombre=?').get(n)) add('accion',n,i.body,d);
    }
  }
  // Named rule sections in the split modules, including effects absent from the
  // playable catalogue. Never use the archived Core 11 summary as a definition.
  for(const d of docs.filter(d=>d.id.startsWith('10_Reglas/')&&!/Core_11|Index\.md/.test(d.id))) {
    for(const s of d.sections.filter(s=>s.body&&s.level>1&&!s.body.startsWith('#')&&!/ESQUELETO|^Ejemplo|históric|eliminad/i.test(s.name))) {
      if (s.name.length>75||s.name.length<3||/^(Procedimiento|Efectos|Componentes|Duración|Mecánica|Ejemplos?)$/i.test(s.name)) continue;
      if ([...atoms.values()].some(a=>a.source===d.id&&key(a.nombre)===key(short(s.name)))) continue;
      const local=s.body.split(/^#{1,6} /m)[0].trim();
      if(local) add('regla',s.name,local,d,[short(s.name)]);
    }
  }
  const paths=find('Core_12_Sendas_Mecanicas');
  const tagRule=origins.texto.match(/Las etiquetas de clasificación[^.\n]+\./)?.[0];
  for(const {nombre} of db.prepare('SELECT nombre FROM clases').all()) {
    const name=nombre.split(' ').at(-1);
    const s=paths.sections.find(s=>short(s.name)===name);
    if(s) add('senda',nombre,s.body,paths);
    if(tagRule) add('etiqueta','Etiqueta '+name,tagRule,origins);
  }
  if(tagRule) for(const name of ['Dríade','Abdríade',...db.prepare('SELECT nombre FROM linajes').all().map(r=>r.nombre)])
    add('etiqueta','Etiqueta '+name,tagRule,origins);
  const schoolTags={Ivganny:'Mental',Naial:'Emocional',Cronibor:'Temporal',Ignamor:'Termodinámico',Yrgramar:'Necrótico',Gelmir:'Físico'};
  for(const r of magic.rows.filter(r=>r.header[0]==='Flujo'&&schoolTags[r.name]))
    add('etiqueta','Etiqueta '+schoolTags[r.name],r.name+' — '+r.cells[1],magic);
  const classTag=section(creation,/El Rasgo «Clase»/);
  if(classTag) add('etiqueta','Etiqueta Clase',classTag.body,creation);
  const explicit=[
    ['rasgo','Atributo Honor','Honor_01_Atributo_Honor',/^Mecánica$/],
    ['rasgo','Elegir un Dogma','Hierofante_01_Habilidades_Insignia',/Selección de Dogma/],
    ['accion','Defensa reactiva','Reacciones_Defensivas',/^Requisitos y enfoque$/],
    ['accion','Combo','Combos',/^Combos/],
    ['estado','Airborne','Combate_Aereo',/^Airborne/],
    ['regla','Veneno','Reglas_de_Venenos_y_Antidotos',/^Contadores de Veneno/],
    ['regla','Ventaja','Modificadores_a_las_Tiradas',/^Ventaja y Desventaja/],
    ['regla','Desventaja','Modificadores_a_las_Tiradas',/^Ventaja y Desventaja/],
    ['regla','Exigencia','Modificadores_a_las_Tiradas',/^Exigencia y Salvataje/],
    ['regla','Salvataje','Modificadores_a_las_Tiradas',/^Exigencia y Salvataje/],
  ];
  for(const [kind,name,file,pattern] of explicit) {
    const d=find(file), s=section(d,pattern);
    if(s) add(kind,name,s.body,d,[],true);
  }
  const venom=find('Reglas_de_Venenos_y_Antidotos');
  const resistant=venom.rows.find(r=>r.name==='Resistente al Veneno');
  if(resistant) add('rasgo','Resistencia al veneno para dríades',textRow(resistant),venom);
  const omen=find('Inspiracion_y_Omen');
  add('regla','Omen',omen.sections[0].body,omen,['Inspiración']);
  const economy=find('Acciones_y_Reacciones');
  for(const [name,start,aliases] of [['Reacción','Al terminar tu turno',['Reacciones']],['Punto de Acción','**Dentro de iniciativa**',['PA']],['Acción gratuita','Además, disponés',['Acciones gratuitas']]]) {
    const paragraph=economy.texto.split('\n\n').find(p=>p.startsWith(start));
    if(paragraph) add('regla',name,paragraph,economy,aliases);
  }
  const difficulty=find('Modificadores_a_las_Tiradas');
  for(const r of difficulty.rows.filter(r=>r.header[0]==='Circunstancia')) {
    // "Normal" alone also describes attributes, equipment and movement.
    const name=r.name==='Normal'?'Dificultad Normal':r.name;
    add('dificultad',name,r.header[1]+': '+r.cells[1],difficulty);
  }
  const cover=find('Coberturas');
  for(const r of cover.rows.filter(r=>r.header[0]==='Nivel de Cobertura')) addRow('regla',r,cover,short(r.name));
  const tired=find('Cansancio');
  add('estado','Cansancio / Agotamiento',tired.sections[0].body,tired,['Cansancio','Agotamiento'],true);
  for(const r of find('Vida_y_Salud').rows.filter(r=>r.header[1]==='Umbral')) addRow('regla',r,find('Vida_y_Salud'));
  for(const d of docs.filter(d=>d.id.startsWith('10_Reglas/')&&!/Core_11|Index\.md/.test(d.id))) {
    if([...atoms.values()].some(a=>a.source===d.id&&key(a.nombre)===key(d.titulo))) continue;
    const intro=d.sections[0]?.body.split(/^#{1,6} /m)[0].split('\n')
      .filter(l=>!/^>.*(?:Separado para revisión|Revisión parcial|Módulo extraído)/i.test(l)).join('\n').trim();
    const body=intro || d.sections.find(s=>s.level>1&&s.body&&!s.body.startsWith('#'))?.body;
    if(body) add('tema',d.titulo,body,d);
  }
  for(const a of atoms.values()) {
    if(a.kind==='estado' && /(?:ado|ido|oso)$/.test(a.nombre)) {
      for(const ending of ['a','os','as']) a.aliases.add(a.nombre.slice(0,-1)+ending);
    }
    if(a.kind==='dano') a.aliases.add('daño '+a.nombre.toLowerCase());
  }
  return {docs,atoms,extraFields};
}
