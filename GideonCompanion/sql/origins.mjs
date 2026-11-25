import {readFileSync} from 'node:fs';
import {createTrait} from './traits.mjs';
const rows=(db,q,...a)=>db.prepare(q).all(...a),one=(db,q,...a)=>db.prepare(q).get(...a),run=(db,q,...a)=>db.prepare(q).run(...a);
const insert=(db,t,v)=>Number(run(db,`INSERT INTO ${t}(${Object.keys(v).join(',')}) VALUES(${Object.keys(v).map(()=>'?').join(',')})`,...Object.values(v)).lastInsertRowid);
export const originContent=JSON.parse(readFileSync(new URL('../content/Origenes/catalogo_demo.json',import.meta.url),'utf8'));
export function migrateOrigins(db){
 db.exec(readFileSync(new URL('./migrations/014_origins_professions.sql',import.meta.url),'utf8'));
 for(const [name,description] of Object.entries(originContent.oficios)){
  const skill=one(db,'SELECT id FROM all_skills WHERE nombre=?',name)?.id??insert(db,'all_skills',{nombre:name,codigo:'oficio_'+name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\W+/g,'_'),tipo:'Extra',descripcion:description});
  const trait=createTrait(db,{nombre:'Oficio aprendido: '+name,descripcion:description+' Permite realizar tiradas propias y mejorar esa habilidad con las reglas de progresión. Puede ser requisito de dotes generales.',modificadores:[{tipo:'MinimoSkill',skill_id:skill,valor:50,fase:'Creacion'}]});
  insert(db,'profesiones',{nombre:name,descripcion:description,skill_id:skill,rasgo_id:trait,minimo_inicial:50});
 }
 for(const d of originContent.dedicaciones){
  const id=one(db,'SELECT id FROM dedicaciones WHERE nombre=?',d.nombre)?.id??insert(db,'dedicaciones',{nombre:d.nombre,descripcion:d.descripcion});
  run(db,'UPDATE dedicaciones SET descripcion=?,disponible_demo=1 WHERE id=?',d.descripcion,id);
  // Valores de catálogo para fichas nuevas; no se recalculan las skills anteriores.
  run(db,'DELETE FROM dedicaciones_skills WHERE dedicacion_id=?',id);
  for(const [name,value] of d.garantias??[]){const sk=one(db,'SELECT id FROM all_skills WHERE nombre=?',name);run(db,'INSERT INTO dedicaciones_skills VALUES(?,?,?,5)',id,sk.id,value);}
  for(const name of d.oficios){const profession=one(db,'SELECT * FROM profesiones WHERE nombre=?',name);run(db,'INSERT INTO dedicaciones_profesiones VALUES(?,?)',id,profession.id);
   if(d.oficios.length===1)run(db,'INSERT INTO dedicaciones_skills VALUES(?,?,?,5)',id,profession.skill_id,50);
  }
  for(const [i,q] of (d.preguntas??[]).entries())run(db,'INSERT INTO dedicaciones_preguntas(dedicacion_id,numero,pregunta,fuente) VALUES(?,?,?,?) ON CONFLICT(dedicacion_id,numero) DO UPDATE SET pregunta=excluded.pregunta,fuente=excluded.fuente',id,i+1,q,'Catálogo de demo '+originContent.revision);
  if(d.preguntas)run(db,'UPDATE dedicaciones SET preguntas_orientativas=? WHERE id=?',d.preguntas.map((q,i)=>(i+1)+'. '+q).join('\n'),id);
 }
 for(const n of originContent.nacimientos){
  const id=one(db,'SELECT id FROM nacimientos WHERE nombre=?',n.nombre)?.id;
  if(!id)throw Error('Nacimiento no encontrado: '+n.nombre);
  run(db,'UPDATE nacimientos SET descripcion=?,disponible_demo=1 WHERE id=?',n.descripcion,id);
  n.preguntas.forEach((q,i)=>run(db,'INSERT INTO nacimientos_preguntas(nacimiento_id,numero,pregunta) VALUES(?,?,?)',id,i+1,q));
 }
 run(db,'INSERT INTO schema_migrations(version) VALUES(14)');
}
export function validateOriginAnswers(c,b){
 const values=b.respuestas_nacimiento??{};if(!values||typeof values!=='object'||Array.isArray(values))throw Error('Respuestas de nacimiento inválidas');
 const result=[];
 for(const [id,value] of Object.entries(values)){
  const q=(c.nacimientos_preguntas??[]).find(q=>String(q.id)===id&&q.nacimiento_id===b.nacimiento_id);if(!q)throw Error('La pregunta no pertenece al Nacimiento elegido');
  if(typeof value!=='string'||value.length>2000)throw Error('Cada respuesta de nacimiento debe tener hasta 2000 caracteres');
  if(value.trim())result.push({pregunta_id:q.id,pregunta_original:q.pregunta,respuesta:value.trim()});
 }return result;
}
