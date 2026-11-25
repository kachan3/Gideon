import {readFileSync} from 'node:fs';
export const pathContent=JSON.parse(readFileSync(new URL('../content/Sendas/sendas.json',import.meta.url),'utf8'));
const rows=(db,q,...a)=>db.prepare(q).all(...a),one=(db,q,...a)=>db.prepare(q).get(...a),run=(db,q,...a)=>db.prepare(q).run(...a);
const insert=(db,t,v)=>Number(run(db,`INSERT INTO ${t}(${Object.keys(v).join(',')}) VALUES(${Object.keys(v).map(()=>'?').join(',')})`,...Object.values(v)).lastInsertRowid);
export function reconcilePaths(db){
 const structured=Boolean(one(db,"SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='rasgo_senda_definicion_insert'"));
 for(const path of pathContent.sendas){
  const id=one(db,'SELECT id FROM clases WHERE nombre=?',path.nombre)?.id;if(!id)throw Error('Senda no encontrada: '+path.nombre);
  const legacyActions=rows(db,'SELECT accion_id FROM clases_rasgos_acciones WHERE clase_rasgo_id IN (SELECT id FROM clases_rasgos WHERE clase_id=?)',id).map(r=>r.accion_id);
  // El historial de progresión es inmutable: se conserva cualquier concesión
  // histórica, pero se retira el vínculo de base para personajes nuevos.
  run(db,'DELETE FROM clases_dotes WHERE clase_id=?',id);
  run(db,'DELETE FROM clases_rasgos_acciones WHERE clase_rasgo_id IN (SELECT id FROM clases_rasgos WHERE clase_id=?)',id);
  run(db,'DELETE FROM personajes_clases_rasgos WHERE clase_rasgo_id IN (SELECT id FROM clases_rasgos WHERE clase_id=?)',id);
  run(db,'DELETE FROM clases_rasgos WHERE clase_id=?',id);
  run(db,'DELETE FROM clases_origen WHERE clase_id=?',id);
  run(db,'UPDATE clases SET disponible_demo=1,descripcion=? WHERE id=?',path.descripcion,id);
  insert(db,'clases_origen',{clase_id:id,fuente:path.fuente,elecciones:JSON.stringify(path.elecciones),notas:JSON.stringify(path.notas)});
  run(db,'INSERT OR REPLACE INTO contenido_fuentes VALUES(?,?,?,0)','clases',id,path.fuente);
  for(const feat of path.dotes??[]){
   let featId=one(db,'SELECT id FROM dotes WHERE nombre=?',feat.nombre)?.id;
   if(!featId)featId=insert(db,'dotes',{nombre:feat.nombre,tipo:'Senda',clase_id:id,costo_xp:0,descripcion:feat.descripcion,solo_concesion_senda:1});
   else run(db,'UPDATE dotes SET descripcion=? WHERE id=?',feat.descripcion,featId);
   run(db,'INSERT OR IGNORE INTO clases_dotes VALUES(?,?)',id,featId);
  }
  let firstTrait=null;
  for(const trait of path.rasgos){
   const required=trait.xp_requerida;
   if(!Number.isSafeInteger(required)||required<0)throw Error('Falta un umbral de XP de Senda válido: '+trait.nombre);
   const initial=Number(trait.inicial??required===0);
   let rasgo_id=null;
   if(structured){
    rasgo_id=one(db,"SELECT id FROM rasgos WHERE nombre=? AND tipo='Capacidad'",trait.nombre)?.id??insert(db,'rasgos',{nombre:trait.nombre,descripcion:trait.descripcion,tipo:'Capacidad'});
    run(db,'UPDATE rasgos SET descripcion=? WHERE id=?',trait.descripcion,rasgo_id);
   }
   const traitId=insert(db,'clases_rasgos',{clase_id:id,rasgo_id,nombre:trait.nombre,descripcion:trait.descripcion,es_insignia:initial,xp_clase_requerida:required});
   for(const name of trait.acciones??[]){
    const action=one(db,'SELECT id FROM acciones WHERE nombre=?',name);if(!action)throw Error('Acción de Rasgo de Senda inexistente: '+name);
    run(db,'INSERT OR IGNORE INTO clases_rasgos_acciones VALUES(?,?)',traitId,action.id);
    if(rasgo_id)run(db,'INSERT OR IGNORE INTO rasgos_acciones VALUES(?,?)',rasgo_id,action.id);
   }
   if(!firstTrait)firstTrait={id:traitId,rasgo_id};
  }
  if(firstTrait)for(const action of legacyActions){
   run(db,'INSERT OR IGNORE INTO clases_rasgos_acciones VALUES(?,?)',firstTrait.id,action);
   if(firstTrait.rasgo_id)run(db,'INSERT OR IGNORE INTO rasgos_acciones VALUES(?,?)',firstTrait.rasgo_id,action);
  }
 }
 if(rows(db,'PRAGMA foreign_key_check').length)throw Error('Referencias inválidas al cargar Sendas');
}
export function migratePaths(db){
 db.exec(readFileSync(new URL('./migrations/011_paths.sql',import.meta.url),'utf8'));
 reconcilePaths(db);
 run(db,'INSERT INTO schema_migrations(version) VALUES(11)');
}

export function migrateValor(db){
 const path=pathContent.sendas.find(s=>s.nombre==='Senda del Valor');
 const {id:claseId}=one(db,'SELECT id FROM clases WHERE nombre=?',path.nombre);
 const getLink=name=>one(db,`SELECT id,rasgo_id FROM v_rasgos_senda_catalogo
   WHERE clase_id=? AND es_insignia=1 AND nombre=?`,claseId,name);
 const legacyDanza=getLink('Danza de Golpes / Espíritu Incansable');
 for(const trait of path.rasgos){
  const link=getLink(trait.nombre)??(trait.nombre==='Danza de Golpes'?legacyDanza:null);
  if(link){
   run(db,'UPDATE rasgos SET nombre=?,descripcion=? WHERE id=?',trait.nombre,trait.descripcion,link.rasgo_id);
   run(db,'UPDATE clases_rasgos SET nombre=?,descripcion=? WHERE id=?',trait.nombre,trait.descripcion,link.id);
   continue;
  }
  const rasgoId=one(db,"SELECT id FROM rasgos WHERE tipo='Capacidad' AND nombre=?",trait.nombre)?.id
   ??insert(db,'rasgos',{nombre:trait.nombre,descripcion:trait.descripcion,tipo:'Capacidad'});
  run(db,'UPDATE rasgos SET descripcion=? WHERE id=?',trait.descripcion,rasgoId);
  insert(db,'clases_rasgos',{clase_id:claseId,rasgo_id:rasgoId,nombre:trait.nombre,
   descripcion:trait.descripcion,es_insignia:1,xp_clase_requerida:0});
 }
 const reaction=getLink('Reacción Rápida');
 if(reaction){
  run(db,'DELETE FROM clases_rasgos_acciones WHERE clase_rasgo_id=?',reaction.id);
  run(db,'DELETE FROM personajes_clases_rasgos WHERE clase_rasgo_id=?',reaction.id);
  run(db,'DELETE FROM clases_rasgos WHERE id=?',reaction.id);
 }
 const feat=one(db,`SELECT d.id FROM dotes d JOIN clases_dotes cd ON cd.dote_id=d.id
   WHERE cd.clase_id=? AND d.nombre='Entrenamiento Superior' AND d.solo_concesion_senda=1`,claseId);
 if(feat){
  // Retira la antigua concesión de creación y conserva su registro en el historial.
  run(db,`INSERT INTO progresion(personaje_id,change,tipo,dote_id,adquisicion_id,origen,notas)
    SELECT p.personaje_id,'Subtract','Retiro',p.dote_id,p.id,'Actualización de Senda',
      'Entrenamiento Superior pasa a ser un Rasgo inicial.'
    FROM v_adquisiciones_activas p JOIN personajes_clases pc ON pc.personaje_id=p.personaje_id
    WHERE pc.clase_id=? AND p.dote_id=? AND p.origen='Creación' AND p.xp_invertida=0`,claseId,feat.id);
  run(db,'DELETE FROM clases_dotes WHERE clase_id=? AND dote_id=?',claseId,feat.id);
 }
 run(db,'UPDATE clases_origen SET elecciones=?,notas=? WHERE clase_id=?',
   JSON.stringify(path.elecciones),JSON.stringify(path.notas),claseId);
 run(db,'INSERT INTO schema_migrations(version) VALUES(20)');
}

export function migrateSombra(db){
 const path=pathContent.sendas.find(s=>s.nombre==='Senda de la Sombra');
 const {id:claseId}=one(db,'SELECT id FROM clases WHERE nombre=?',path.nombre);
 const legacyNames={'Sentidos Tétricos':'Sentidos Nulos','Artes Sombrías':'Arte Sombría inicial'};
 for(const trait of path.rasgos){
  const link=one(db,`SELECT id,rasgo_id FROM v_rasgos_senda_catalogo WHERE clase_id=? AND nombre IN (?,?)`,
    claseId,trait.nombre,legacyNames[trait.nombre]??trait.nombre);
  run(db,'UPDATE rasgos SET nombre=?,descripcion=? WHERE id=?',trait.nombre,trait.descripcion,link.rasgo_id);
  run(db,`UPDATE clases_rasgos SET nombre=?,descripcion=?,es_insignia=?,xp_clase_requerida=? WHERE id=?`,
    trait.nombre,trait.descripcion,Number(trait.xp_requerida===0),trait.xp_requerida,link.id);
 }
 run(db,'UPDATE clases_origen SET elecciones=? WHERE clase_id=?',JSON.stringify(path.elecciones),claseId);
 run(db,'INSERT INTO schema_migrations(version) VALUES(23)');
}

export function migrateBerserker(db){
 const path=pathContent.sendas.find(s=>s.nombre==='Senda del Berserker');
 const trait=path.rasgos.find(r=>r.nombre==='Fuerza Aliota');
 const {id:claseId}=one(db,'SELECT id FROM clases WHERE nombre=?',path.nombre);
 const existing=one(db,'SELECT id FROM v_rasgos_senda_catalogo WHERE clase_id=? AND nombre=?',claseId,trait.nombre);
 if(!existing){
  const rasgoId=one(db,"SELECT id FROM rasgos WHERE tipo='Capacidad' AND nombre=?",trait.nombre)?.id
   ??insert(db,'rasgos',{nombre:trait.nombre,descripcion:trait.descripcion,tipo:'Capacidad'});
  insert(db,'clases_rasgos',{clase_id:claseId,rasgo_id:rasgoId,nombre:trait.nombre,
   descripcion:trait.descripcion,es_insignia:0,xp_clase_requerida:trait.xp_requerida});
 }
 run(db,'INSERT INTO schema_migrations(version) VALUES(40)');
}
