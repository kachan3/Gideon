import {pathContent} from './paths.mjs';
import {ensurePathTraits} from './player-copy.mjs';
import {playerText} from '../js/player-text.js';
import {readFileSync} from 'node:fs';
import {coreTexts, key, plain} from './core-texts.mjs';
import {unmark} from '../js/reference-format.js';

const catalogs = {
  estados_alterados:['estado'], dotes:['dote','rasgo'], linajes:['linaje'], clases:['senda'],
  clases_rasgos:['rasgo'], rasgos:['rasgo','linaje','nacimiento','dedicacion','oficio','dano','senda'],
  acciones:['accion','maniobra','truco','rasgo','dote'], all_skills:['habilidad','atributo','oficio'],
  dedicaciones:['dedicacion'], profesiones:['oficio'], nacimientos:['nacimiento'],
  epifanias:['epifania'], efectos:['efecto'], misticas:['mistica'], trucos:['truco'],
  mediums:['medium'], shapes:['shape'], duraciones:['duracion'], artefactos_arcanos:['artefacto'], hierophant_passives:['plegaria'],
  armas:['arma'], ventajas_arma:['propiedad'], limitaciones_arma:['propiedad'],
  items_base:['objeto','escudo'], armaduras:['armadura'], items_magicos:['objeto']
};
const displayText = text => plain(text).replace(/^#{1,6}\s+/gm,'').replace(/^>\s?/gm,'')
  .replace(/^\s*\|[-:| ]+\|\s*$/gm,'').replace(/\n{3,}/g,'\n\n').trim();
const nameAliases = {'Conocimiento Mágico':'C. Magico','Escudo Torre':'Torre','¡A Cubierto!':'¡A CUBIERTO!'};

export function synchronizeCore(db) {
  db.exec(readFileSync(new URL('./migrations/039_referencias.sql',import.meta.url),'utf8'));
  ensurePathTraits(db,pathContent.sendas);
  const {docs,atoms,extraFields}=coreTexts(db);
  const names = new Map();
  for(const a of atoms.values()) for(const alias of a.aliases) names.set(a.kind+':'+key(alias),a);
  const fields=[...extraFields];
  for(const [table,kinds] of Object.entries(catalogs)) {
    const field=['mediums','shapes','duraciones'].includes(table)?'efecto_base':'descripcion';
    for(const row of db.prepare('SELECT * FROM '+table).all()) {
      row.nombre??=row.intervalo;
      if(row.condicion_especial || row.archivada || /ejemplo|placeholder/i.test(row.nombre)) continue;
      let name=nameAliases[row.nombre]??row.nombre;
      if(table==='rasgos') name=name.replace(/^(?:Adaptación de origen|Formación de origen|Oficio aprendido|Nacimiento): /,'');
      // A parameterized Multiuso variant has its own damage types.
      const tag=table==='rasgos'&&row.tipo==='Etiqueta';
      const atomForTag=names.get('etiqueta:'+key('Etiqueta '+name))??(name==='Reacción'?names.get('regla:'+key(name)):undefined);
      let atom=tag?atomForTag:kinds.map(k=>names.get(k+':'+key(name))).find(Boolean);
      if(atom&&!tag) atom.aliases.add(row.nombre);
      let value=atom?displayText(atom.texto):playerText(row[field]);
      if (!value) continue;
      if (!atom && row.disponible_demo!==0 && !['rasgos','clases_rasgos'].includes(table)) {
        // Keep usable catalogue-only entries linkable without claiming a Core source.
        const id=kinds[0]+'-'+key(name);
        atom=atoms.get(id);
        if(!atom) {
          const body=table==='armas'?[row.categoria_balance,row.tipo,row.tipo_dano,value].filter(Boolean).join('\n'):value;
          atom={id,kind:kinds[0],nombre:name,texto:body,source:'',aliases:new Set([name])};
          atoms.set(id,atom);
        }
      }
      fields.push({table,id:row.id,field,name:row.nombre,atom,value,old:row[field]});
    }
  }
  const aliases=[...atoms.values()].flatMap(a=>[...a.aliases].filter(s=>s.length>=2).map(alias=>({alias,regla_id:a.id})));
  // Only these derived tables are rebuilt. All character and gameplay IDs survive.
  db.exec('DELETE FROM alias_reglas; DELETE FROM reglas_atomicas; DELETE FROM documentos_reglas; DELETE FROM textos_catalogo;');
  const insertAtom=db.prepare('INSERT INTO reglas_atomicas VALUES(?,?,?)');
  for(const a of atoms.values()) insertAtom.run(a.id,a.nombre,displayText(unmark(a.texto)));
  const insertAlias=db.prepare('INSERT OR IGNORE INTO alias_reglas VALUES(?,?)');
  for(const {alias,regla_id} of aliases) insertAlias.run(alias,regla_id);
  const insertDoc=db.prepare('INSERT INTO documentos_reglas VALUES(?,?,?,?)');
  for(const d of docs.filter(d=>d.publish!==false)) {
    // Keep Markdown headings and URLs intact for existing section navigation.
    const text=unmark(d.texto);
    insertDoc.run(d.id,d.titulo,d.grupo,text);
  }
  const insertField=db.prepare('INSERT INTO textos_catalogo VALUES(?,?,?,?,?)');
  for(const f of fields) {
    const {table,id,field,atom,value}=f;
    const source=f.source??atom?.source??'';
    if(f.old!==value) db.prepare('UPDATE '+table+' SET '+field+'=? WHERE id=? AND '+field+' IS NOT ?').run(value,id,value);
    insertField.run(table,id,field,source,unmark(value));
  }
  db.prepare('INSERT OR IGNORE INTO schema_migrations(version) VALUES(39)').run();
}

export function referenceCatalogue(db) {
  return {
    reglas:db.prepare('SELECT * FROM reglas_atomicas').all(),
    aliases:db.prepare('SELECT alias,regla_id FROM alias_reglas').all(),
    textos:db.prepare("SELECT DISTINCT texto FROM textos_catalogo WHERE instr(texto,'[[')>0").all().map(r=>r.texto)
  };
}
export function casterToolDescription(db,name) {
  if(!db.prepare("SELECT 1 FROM sqlite_schema WHERE name='reglas_atomicas'").get())return;
  const entry=db.prepare('SELECT texto FROM reglas_atomicas WHERE id=?').get('herramienta-'+key(name));
  return entry&&unmark(entry.texto);
}
