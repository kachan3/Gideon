import {readFileSync} from 'node:fs';

const root=new URL('../../',import.meta.url);
const index=readFileSync(new URL('10_Reglas/Index.md',root),'utf8').split('## Contenido en revisión')[0];
export const rulebook=[];
const isSkeleton=value=>/_esqueleto/i.test(value.replace(/\\_/g,'_'));
function addRule({id,titulo,grupo,texto}){
 const heading=texto.match(/^#\s+(.+)$/m)?.[1]??'';
 if([id,titulo,heading].some(isSkeleton))return;
 // Oculta también las entradas pendientes de los índices mostrados en mesa.
 texto=texto.split(/\r?\n/).filter(line=>!/^\s*[-*]\s+\[[^\]]+\]\([^)]+\)/.test(line)||!isSkeleton(line)).join('\n');
 rulebook.push({id,titulo,grupo,texto});
}
let grupo='';
for(const line of index.split(/\r?\n/)){
 if(line.startsWith('## ')){grupo=line.slice(3);continue;}
 const match=line.match(/^- \[([^\]]+)\]\(([^)]+\.md)\)/);
 if(!match)continue;
 const [,titulo,path]=match;
 const file=new URL(path,new URL('10_Reglas/',root));
 const id=file.href.slice(root.href.length);
 addRule({id,titulo,grupo,texto:readFileSync(file,'utf8')});
}
for(const [indexId,grupo] of [['20_Contenido/Dotes/Index.md','Dotes'],['20_Contenido/Linajes_Jugables.md','Linajes']]){
 const catalogo=rulebook.find(d=>d.id===indexId);
 for(const [,titulo,path] of catalogo.texto.matchAll(/^- \[([^\]]+)\]\(([\w/.-]+\.md)\)/gm)){
  if(path.startsWith('..'))continue;
  const file=new URL(path,new URL(indexId,root)),id=file.href.slice(root.href.length);
  if(!rulebook.some(d=>d.id===id))addRule({id,titulo,grupo,texto:readFileSync(file,'utf8')});
 }
}

export function updateGenericActions(db){
 const doc=rulebook.find(d=>d.id==='10_Reglas/Acciones_Genericas.md');
 const clean=s=>s.replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/\*\*|\x60/g,'').trim();
 const upsert=db.prepare(`INSERT INTO acciones(nombre,tipo,nro_acciones_pa,coste_texto,descripcion)
   VALUES(?,'Generica',?,?,?) ON CONFLICT(nombre) DO UPDATE SET nro_acciones_pa=excluded.nro_acciones_pa,
   coste_texto=excluded.coste_texto,descripcion=excluded.descripcion WHERE acciones.tipo='Generica'`);
 const parts=doc.texto.split(/^## /m);
 for(const part of parts.filter(p=>p.startsWith('Acciones con rasgo')||p.startsWith('Otras acciones genéricas'))){
  for(const [,nombre,coste,descripcion] of part.matchAll(/^\| (?:<a [^>]*><\/a>)?\*\*([^*]+)\*\* \| ([^|]+) \| ([^|]+) \|/gm)){
   const label=clean(coste),pa=Number(label.match(/(\d+) PA/)?.[1]??0);
   upsert.run(nombre,pa,label,clean(descripcion));
  }
 }
 for(const [heading,name,coste,pa] of [
  ['Preparar acción','Preparar acción','1 PA',1],['Levantar objeto voluminoso','Levantar objeto voluminoso','1 PA',1],
  ['Arrastrar y empujar','Arrastrar y empujar','1 PA',1],['Sacudirse','Sacudirse','1 PA',1],
  ['Aplicar torniquete','Aplicar torniquete','1 PA',1],['Vendar','Vendar','10 minutos',0],['Meditar','Meditar','Por hora completa',0],
  ['Ayudar','Ayudar','2 PA',2],['Evadir','Evadir','Turno Completo',3],['Escape','Escape','Turno Completo',3]
 ]){
  const section=parts.find(p=>p.startsWith(heading));
  upsert.run(name,pa,coste,clean(section.slice(section.indexOf('\n')+1)));
 }
 db.prepare("UPDATE acciones SET coste_texto='Según la maniobra',descripcion=? WHERE nombre='Defensa reactiva'").run(
  clean(rulebook.find(d=>d.id==='10_Reglas/Reacciones_Defensivas.md').texto.split('##')[0].split('\n').slice(1).join('\n')));
}
