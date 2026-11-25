import {readFileSync} from 'node:fs';
import {createTrait} from './traits.mjs';
const rows=(db,q,...a)=>db.prepare(q).all(...a),run=(db,q,...a)=>db.prepare(q).run(...a);

export function migrateOriginTraits(db){
 db.exec(readFileSync(new URL('./migrations/015_origin_traits.sql',import.meta.url),'utf8'));
 // Reutiliza las definiciones y los ids: también las fichas con concesiones antiguas
 // resuelven una sola copia del Rasgo. Nunca se modifica el registro de progresión.
 for(const link of rows(db,'SELECT ld.*,dr.rasgo_id FROM linajes_dotes ld JOIN dotes d ON d.id=ld.dote_id JOIN dotes_rasgos dr ON dr.dote_id=d.id WHERE d.solo_concesion_inicial=1')){
  run(db,'INSERT OR IGNORE INTO linajes_rasgos VALUES(?,?)',link.linaje_id,link.rasgo_id);
  run(db,'UPDATE dotes SET rasgo_origen_id=? WHERE id=?',link.rasgo_id,link.dote_id);
  run(db,"UPDATE acciones SET tipo='Rasgo' WHERE id IN (SELECT accion_id FROM rasgos_acciones WHERE rasgo_id=?)",link.rasgo_id);
 }
 run(db,'DELETE FROM linajes_dotes WHERE dote_id IN (SELECT id FROM dotes WHERE rasgo_origen_id IS NOT NULL)');
 for(const l of rows(db,'SELECT * FROM linajes')){
  const bonuses=rows(db,'SELECT * FROM linajes_skills WHERE linaje_id=?',l.id);
  if(!bonuses.length)continue;
  const choice=rows(db,'SELECT * FROM linajes_elecciones WHERE linaje_id=?',l.id);
  const rid=createTrait(db,{nombre:'Adaptación de origen: '+l.nombre,descripcion:`Bonos de creación propios de ${l.nombre}. Se aplican una sola vez al crear la ficha.`+(choice.length?' Incluye elegir el bono de combate indicado por el linaje.':''),modificadores:bonuses.map(b=>({tipo:'BonoSkill',skill_id:b.skill_id,valor:b.bono,fase:'Creacion'}))});
  run(db,'UPDATE rasgos SET codigo=? WHERE id=?','origen_linaje_'+l.id,rid);
  run(db,'INSERT OR IGNORE INTO linajes_rasgos VALUES(?,?)',l.id,rid);
  run(db,'UPDATE linajes_skills SET rasgo_id=? WHERE linaje_id=?',rid,l.id);
  run(db,'UPDATE linajes_elecciones SET rasgo_id=? WHERE linaje_id=?',rid,l.id);
 }
 for(const d of rows(db,'SELECT * FROM dedicaciones WHERE disponible_demo=1')){
  const professions=rows(db,'SELECT p.* FROM profesiones p JOIN dedicaciones_profesiones dp ON dp.profesion_id=p.id WHERE dp.dedicacion_id=?',d.id);
  const floors=rows(db,'SELECT * FROM dedicaciones_skills WHERE dedicacion_id=?',d.id);
  const fixed=floors.filter(g=>!professions.some(p=>p.skill_id===g.skill_id));
  const rid=createTrait(db,{nombre:'Formación de origen: '+d.nombre,descripcion:d.descripcion+(professions.length?' Concede el Rasgo de oficio aprendido correspondiente a tu elección.':''),modificadores:fixed.map(g=>({tipo:'MinimoSkill',skill_id:g.skill_id,valor:g.minimo,fase:'Creacion'}))});
  run(db,'UPDATE rasgos SET codigo=? WHERE id=?','origen_dedicacion_'+d.id,rid);
  run(db,'INSERT INTO dedicaciones_rasgos VALUES(?,?)',d.id,rid);
  for(const g of floors)run(db,'UPDATE dedicaciones_skills SET rasgo_id=? WHERE dedicacion_id=? AND skill_id=?',professions.find(p=>p.skill_id===g.skill_id)?.rasgo_id??rid,d.id,g.skill_id);
 }
 for(const n of rows(db,'SELECT * FROM nacimientos WHERE disponible_demo=1')){
  const rid=createTrait(db,{nombre:'Nacimiento: '+n.nombre,descripcion:n.descripcion,modificadores:[]});
  run(db,'UPDATE rasgos SET codigo=? WHERE id=?','origen_nacimiento_'+n.id,rid);
  run(db,'INSERT INTO nacimientos_rasgos VALUES(?,?)',n.id,rid);
 }
 if(rows(db,'PRAGMA foreign_key_check').length)throw Error('Referencias inválidas al catalogar Rasgos de origen');
 run(db,'INSERT INTO schema_migrations(version) VALUES(15)');
}
