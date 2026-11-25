import {readFileSync} from 'node:fs';
import {createTrait} from './traits.mjs';
const rows=(db,q,...a)=>db.prepare(q).all(...a),one=(db,q,...a)=>db.prepare(q).get(...a),run=(db,q,...a)=>db.prepare(q).run(...a);

export function migratePathTraits(db){
 for(const cr of rows(db,'SELECT * FROM clases_rasgos')){
  let rid=cr.rasgo_id;
  if(!one(db,"SELECT 1 FROM rasgos WHERE id=? AND tipo='Capacidad'",rid??null)){
   rid=createTrait(db,{nombre:cr.nombre,descripcion:cr.descripcion});
   run(db,'UPDATE clases_rasgos SET rasgo_id=? WHERE id=?',rid,cr.id);
  }
  const actions=rows(db,'SELECT accion_id FROM clases_rasgos_acciones WHERE clase_rasgo_id=?',cr.id).map(a=>a.accion_id);
  for(const id of new Set([cr.accion_id,...actions].filter(Boolean)))run(db,'INSERT OR IGNORE INTO rasgos_acciones VALUES(?,?)',rid,id);
  if(cr.xp_clase_requerida<0||!Number.isSafeInteger(cr.xp_clase_requerida)||(cr.es_insignia&&cr.xp_clase_requerida!==0))throw Error('Revisar el umbral de XP del Rasgo de Senda: '+cr.nombre);
 }
 db.exec(readFileSync(new URL('./migrations/016_path_traits.sql',import.meta.url),'utf8'));
 run(db,'INSERT OR IGNORE INTO schema_migrations(version) VALUES(16)');
}

export function linkPathTrait(db,b){
 if(!b||typeof b!=='object'||Array.isArray(b)||Object.keys(b).some(k=>!['clase_id','rasgo_id','xp_requerida','inicial'].includes(k)))throw Error('Vínculo de Rasgo de Senda inválido');
 for(const field of ['clase_id','rasgo_id'])if(!Number.isSafeInteger(b[field])||b[field]<1)throw Error('Senda o Rasgo inválido');
 if(!Number.isSafeInteger(b.xp_requerida)||b.xp_requerida<0)throw Error('Indica el umbral de XP dedicada; 0 para un Rasgo inicial');
 if(b.inicial!=null&&typeof b.inicial!=='boolean')throw Error('Inicial debe ser verdadero o falso');
 const initial=b.inicial??b.xp_requerida===0;
 if(initial&&b.xp_requerida!==0)throw Error('Un Rasgo inicial requiere 0 XP dedicada');
 if(!one(db,'SELECT 1 FROM clases WHERE id=?',b.clase_id))throw Error('Senda inexistente');
 const r=one(db,"SELECT * FROM rasgos WHERE id=? AND tipo='Capacidad'",b.rasgo_id);if(!r)throw Error('El Rasgo debe ser una capacidad existente');
 if(!initial&&one(db,"SELECT 1 FROM rasgos_modificadores WHERE rasgo_id=? AND fase='Creacion'",r.id))throw Error('Un Rasgo de progresión debe usar modificadores de fase Siempre');
 const id=Number(run(db,'INSERT INTO clases_rasgos(clase_id,rasgo_id,nombre,descripcion,xp_clase_requerida,es_insignia) VALUES(?,?,?,?,?,?)',b.clase_id,r.id,r.nombre,r.descripcion,b.xp_requerida,Number(initial)).lastInsertRowid);
 return one(db,'SELECT * FROM v_rasgos_senda_catalogo WHERE id=?',id);
}

