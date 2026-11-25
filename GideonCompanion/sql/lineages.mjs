import {readFileSync} from 'node:fs';
import {lineageSummary} from '../js/lineage-rules.js';
import {traitCondition} from '../js/trait-rules.js';
const rows=(db,q,...a)=>db.prepare(q).all(...a),one=(db,q,...a)=>db.prepare(q).get(...a),run=(db,q,...a)=>db.prepare(q).run(...a);
const insert=(db,t,v)=>Number(run(db,`INSERT INTO ${t}(${Object.keys(v).join(',')}) VALUES(${Object.keys(v).map(()=>'?').join(',')})`,...Object.values(v)).lastInsertRowid);
export const lineageContent=JSON.parse(readFileSync(new URL('../content/Linajes/linajes.json',import.meta.url),'utf8'));
const SOURCE='Core: linajes ratificados '+lineageContent.revision;
const source=(db,table,id)=>run(db,'INSERT OR REPLACE INTO contenido_fuentes VALUES(?,?,?,0)',table,id,SOURCE);

export function migrateLineages(db){
 db.exec(readFileSync(new URL('./migrations/010_lineages.sql',import.meta.url),'utf8'));
 const skill=name=>{const s=one(db,"SELECT * FROM all_skills WHERE nombre=? AND tipo='Habilidad'",name);if(!s)throw Error('Habilidad canónica no encontrada: '+name);return s;};
 for(const line of lineageContent.linajes){
  let l=one(db,'SELECT id FROM linajes WHERE nombre=?',line.nombre);
  const id=l?.id??insert(db,'linajes',{nombre:line.nombre});
  run(db,'UPDATE linajes SET codigo=?,descripcion=?,escalado_vital=?,movimiento_terrestre=? WHERE id=?',line.codigo,line.descripcion,line.escalado_vital,line.movimiento,id);source(db,'linajes',id);
  run(db,'DELETE FROM linajes_skills WHERE linaje_id=?',id);
  for(const [name,bonus] of line.bonos)run(db,'INSERT INTO linajes_skills VALUES(?,?,?)',id,skill(name).id,bonus);
  if(line.eleccion){const e=line.eleccion,gid=insert(db,'linajes_elecciones',{linaje_id:id,codigo:e.codigo,nombre:e.nombre,bono:e.bono});
   for(const s of rows(db,"SELECT s.* FROM all_skills s JOIN all_skills p ON p.id=s.padre_id WHERE s.tipo='Habilidad' AND p.nombre IN ('Melee','Proyectiles','Arcana')"))run(db,'INSERT INTO linajes_elecciones_opciones VALUES(?,?)',gid,s.id);
  }
  for(const name of ['Dríade',line.nombre,...(line.codigo==='hijos_del_bosque'?['Abdríade']:[])]){
   const tag=one(db,'SELECT id FROM rasgos WHERE nombre=?',name)?.id??insert(db,'rasgos',{nombre:name,descripcion:'Etiqueta de especie o linaje; no es una capacidad adquirible.'});
   run(db,'INSERT OR IGNORE INTO linajes_rasgos VALUES(?,?)',id,tag);
  }
  for(const feat of line.rasgos??line.dotes){
   const did=one(db,'SELECT id FROM dotes WHERE nombre=?',feat.nombre)?.id??insert(db,'dotes',{nombre:feat.nombre,descripcion:feat.descripcion});
   run(db,"UPDATE dotes SET descripcion=?,tipo='Linaje',costo_xp=0,linaje_requerido_id=?,solo_concesion_inicial=1 WHERE id=?",feat.descripcion,id,did);
   run(db,'INSERT OR IGNORE INTO linajes_dotes VALUES(?,?)',id,did);source(db,'dotes',did);
   for(const [type,target,value,unit] of feat.efectos)insert(db,'dotes_efectos',{dote_id:did,tipo:type,objetivo:target,valor:value,unidad:unit});
   if(feat.accion){const a=feat.accion,aid=one(db,'SELECT id FROM acciones WHERE nombre=?',a.nombre)?.id??insert(db,'acciones',{nombre:a.nombre,descripcion:a.descripcion,tipo:'Dote',coste_mana:a.mana});
    run(db,'INSERT OR IGNORE INTO dotes_acciones VALUES(?,?)',did,aid);source(db,'acciones',aid);
   }
  }
  for(const item of line.equipo??[]){const iid=one(db,'SELECT id FROM items_base WHERE nombre=?',item.nombre)?.id??insert(db,'items_base',{nombre:item.nombre,descripcion:item.descripcion,categoria:'Regalo cultural'});
   run(db,'INSERT INTO linajes_equipo_inicial VALUES(?,?,?,?)',id,iid,item.cantidad,Number(item.opcional));source(db,'items_base',iid);
  }
 }
 // Actualiza capacidades sin reconstruir ni sobrescribir las skills de fichas previas.
 for(const p of rows(db,'SELECT id FROM personajes'))grantLineage(db,p.id,{legacy:true});
 if(rows(db,'PRAGMA foreign_key_check').length)throw Error('Referencias inválidas al migrar los linajes');
 run(db,'INSERT INTO schema_migrations(version) VALUES(10)');
}

export function initialLineageXP(db,lineageId){
 if(one(db,"SELECT name FROM sqlite_master WHERE name='rasgos_modificadores'"))return one(db,"SELECT COALESCE(SUM(valor),0) n FROM rasgos_modificadores WHERE tipo='XPInicial' AND rasgo_id IN (SELECT rasgo_id FROM linajes_rasgos WHERE linaje_id=? UNION SELECT dr.rasgo_id FROM dotes_rasgos dr JOIN linajes_dotes ld ON ld.dote_id=dr.dote_id WHERE ld.linaje_id=?)",lineageId,lineageId).n;
 if(!one(db,"SELECT name FROM sqlite_master WHERE name='dotes_efectos'"))return 0;
 return one(db,"SELECT COALESCE(SUM(e.valor),0) n FROM dotes_efectos e JOIN linajes_dotes ld ON ld.dote_id=e.dote_id WHERE ld.linaje_id=? AND e.tipo='XPInicial'",lineageId).n;
}

export function grantLineage(db,personId,{legacy=false,moonstone=true}={}){
 if(!one(db,"SELECT name FROM sqlite_master WHERE name='personajes_linaje_revision'"))return;
 if(one(db,'SELECT 1 FROM personajes_linaje_revision WHERE personaje_id=?',personId))return;
 const p=one(db,'SELECT * FROM personajes WHERE id=?',personId);
 for(const d of rows(db,'SELECT dote_id FROM linajes_dotes WHERE linaje_id=?',p.linaje_id)){
  if(!one(db,'SELECT 1 FROM v_adquisiciones_activas WHERE personaje_id=? AND dote_id=?',personId,d.dote_id))insert(db,'progresion',{personaje_id:personId,change:'Add',tipo:'Adquisicion',dote_id:d.dote_id,xp_gastada:0,origen:'Linaje inicial',notas:SOURCE});
 }
 for(const item of rows(db,'SELECT * FROM linajes_equipo_inicial WHERE linaje_id=?',p.linaje_id))if(!item.opcional||moonstone){
  if(!one(db,'SELECT 1 FROM inventario WHERE personaje_id=? AND item_base_id=?',personId,item.item_base_id))insert(db,'inventario',{personaje_id:personId,item_base_id:item.item_base_id,cantidad:item.cantidad});
 }
 insert(db,'personajes_linaje_revision',{personaje_id:personId,revision:lineageContent.revision,skills_anteriores:Number(legacy)});
}

export function applyLineage(db,p){
 if(!one(db,"SELECT name FROM sqlite_master WHERE name='dotes_efectos'"))return;
 const effects=p.rasgos?p.rasgos.flatMap(r=>r.modificadores.filter(m=>m.fase==='Siempre'&&traitCondition(m.condicion,p)).map(m=>({...m,fuente:r.nombre,objetivo:p.skills.find(s=>s.id===m.skill_id)?.nombre??m.objetivo}))):rows(db,'SELECT e.*,d.nombre fuente FROM dotes_efectos e JOIN dotes d ON d.id=e.dote_id JOIN v_adquisiciones_activas a ON a.dote_id=d.id WHERE a.personaje_id=?',p.id);
 p.capacidades_linaje=lineageSummary(p,effects);
 p.linaje_revision=one(db,'SELECT * FROM personajes_linaje_revision WHERE personaje_id=?',p.id);
 p.creacion_skills=rows(db,'SELECT skill_id,detalle FROM personajes_creacion_skills WHERE personaje_id=?',p.id).map(s=>({skill_id:s.skill_id,...JSON.parse(s.detalle)}));
 p.elecciones_linaje=rows(db,'SELECT * FROM personajes_elecciones_linaje WHERE personaje_id=?',p.id);
 if(p.equipo)p.equipo.defensas.push(...effects.filter(e=>['Mitigacion','Resistencia','Debilidad'].includes(e.tipo)).map(e=>({categoria:e.tipo,tipo_dano:e.objetivo,valor:e.valor,fuente:e.fuente,descripcion:'Modificador de rasgo'})));
 for(const a of p.acciones)a.usable_linaje=Boolean(a.coste_mana&&(p.rasgos?.some(r=>r.origenes?.includes('Linaje')&&r.acciones.some(ra=>ra.id===a.id))||p.adquisiciones.some(g=>g.elemento?.solo_concesion_inicial&&g.elemento?.linaje_requerido_id===p.linaje_id&&one(db,'SELECT 1 FROM dotes_acciones WHERE dote_id=? AND accion_id=?',g.dote_id,a.id))));
}
