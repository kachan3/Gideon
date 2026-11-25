import {readFileSync} from 'node:fs';
import {TRAIT_TYPES,TRAIT_CONDITIONS} from '../js/trait-rules.js';
const rows=(db,q,...a)=>db.prepare(q).all(...a),one=(db,q,...a)=>db.prepare(q).get(...a),run=(db,q,...a)=>db.prepare(q).run(...a);
const insert=(db,t,v)=>Number(run(db,`INSERT INTO ${t}(${Object.keys(v).join(',')}) VALUES(${Object.keys(v).map(()=>'?').join(',')})`,...Object.values(v)).lastInsertRowid);
export function createTrait(db,b){
 if(!b||typeof b!=='object'||Array.isArray(b)||Object.keys(b).some(k=>!['nombre','descripcion','tipo','regla_texto','modificadores','acciones'].includes(k)))throw Error('Definición de rasgo inválida');
 if(typeof b.nombre!=='string'||!b.nombre.trim()||b.nombre.length>120||typeof b.descripcion!=='string'||b.descripcion.length>5000)throw Error('Nombre o descripción de rasgo inválidos');
 const kind=b.tipo??'Capacidad',mods=b.modificadores??[],actions=b.acciones??[];
 if(!['Etiqueta','Capacidad'].includes(kind)||!Array.isArray(mods)||!Array.isArray(actions)||mods.length>100||actions.length>50)throw Error('Definición de rasgo inválida');
 if(kind==='Etiqueta'&&(mods.length||actions.length))throw Error('Una etiqueta no concede modificadores ni acciones');
 if(typeof (b.regla_texto??'')!=='string'||(b.regla_texto??'').length>5000)throw Error('Texto de regla inválido');
 for(const m of mods){
  if(!m||!TRAIT_TYPES.includes(m.tipo)||!TRAIT_CONDITIONS.includes(m.condicion??'Siempre')||!['Creacion','Siempre'].includes(m.fase??'Siempre')||!Number.isFinite(m.valor)||Math.abs(m.valor)>9999)throw Error('Modificador de rasgo inválido');
  if(Object.keys(m).some(k=>!['tipo','skill_id','objetivo','valor','unidad','fase','condicion','descripcion'].includes(k)))throw Error('El modificador contiene propiedades no admitidas');
  if(m.skill_id!=null&&(!Number.isSafeInteger(m.skill_id)||!one(db,'SELECT 1 FROM all_skills WHERE id=?',m.skill_id)))throw Error('Skill o atributo del rasgo inexistente');
  if(typeof (m.objetivo??'')!=='string'||(m.objetivo??'').length>120||typeof (m.unidad??'')!=='string'||(m.unidad??'').length>30||typeof (m.descripcion??'')!=='string'||(m.descripcion??'').length>2000)throw Error('Detalle de modificador inválido');
 }
 for(const id of actions)if(!Number.isSafeInteger(id)||!one(db,'SELECT 1 FROM acciones WHERE id=?',id))throw Error('Acción del rasgo inexistente');
 const id=insert(db,'rasgos',{nombre:b.nombre.trim(),descripcion:b.descripcion,tipo:kind,regla_texto:b.regla_texto??''});
 for(const m of mods)insert(db,'rasgos_modificadores',{rasgo_id:id,tipo:m.tipo,skill_id:m.skill_id??null,objetivo:m.objetivo??'',valor:m.valor,unidad:m.unidad??'',fase:m.fase??(m.tipo==='XPInicial'?'Creacion':'Siempre'),condicion:m.condicion??'Siempre',descripcion:m.descripcion??''});
 for(const aid of new Set(actions))run(db,'INSERT INTO rasgos_acciones VALUES(?,?)',id,aid);
 return id;
}

export function migrateTraits(db){
 db.exec(readFileSync(new URL('./migrations/013_traits.sql',import.meta.url),'utf8'));
 for(const d of rows(db,'SELECT DISTINCT d.* FROM dotes d JOIN dotes_efectos e ON e.dote_id=d.id')){
  const effects=rows(db,'SELECT * FROM dotes_efectos WHERE dote_id=?',d.id);
  const modifiers=effects.map(e=>{const sid=['TiradaNE','Salvataje'].includes(e.tipo)?one(db,'SELECT id FROM all_skills WHERE nombre=?',e.objetivo)?.id:null;return {tipo:e.tipo,objetivo:e.objetivo,valor:e.valor,unidad:e.unidad,descripcion:e.descripcion,skill_id:sid,fase:e.tipo==='XPInicial'?'Creacion':'Siempre'};});
  const trait=createTrait(db,{nombre:d.nombre,descripcion:d.descripcion,modificadores:modifiers,acciones:rows(db,'SELECT accion_id FROM dotes_acciones WHERE dote_id=?',d.id).map(a=>a.accion_id)});
  run(db,'UPDATE rasgos SET codigo=? WHERE id=?','dote_'+d.id,trait);run(db,'INSERT INTO dotes_rasgos VALUES(?,?)',d.id,trait);
 }
 for(const r of rows(db,'SELECT * FROM clases_rasgos')){
  const trait=createTrait(db,{nombre:r.nombre,descripcion:r.descripcion,acciones:r.accion_id?[r.accion_id]:[]});
  if(r.rasgo_id&&one(db,"SELECT 1 FROM rasgos WHERE id=? AND tipo='Etiqueta'",r.rasgo_id))run(db,'INSERT OR IGNORE INTO clases_tags VALUES(?,?)',r.clase_id,r.rasgo_id);
  run(db,'UPDATE clases_rasgos SET rasgo_id=? WHERE id=?',trait,r.id);run(db,'UPDATE rasgos SET codigo=? WHERE id=?','senda_'+r.id,trait);
 }
 reconcileOriginTraitGrants(db);
 run(db,'INSERT INTO schema_migrations(version) VALUES(13)');
}

export function reconcileOriginTraitGrants(db){
 run(db,'INSERT OR IGNORE INTO linajes_rasgos SELECT ld.linaje_id,dr.rasgo_id FROM linajes_dotes ld JOIN dotes_rasgos dr ON dr.dote_id=ld.dote_id');
 run(db,'DELETE FROM linajes_dotes');
}

export function activeTraits(db,p){
 const ids=new Map(),origins=new Map(),grant=(id,source,origin)=>{if(!id)return;if(!ids.has(id))ids.set(id,new Set());ids.get(id).add(source);if(origin){if(!origins.has(id))origins.set(id,new Set());origins.get(id).add(origin);}};
 for(const r of rows(db,'SELECT rasgo_id FROM linajes_rasgos WHERE linaje_id=?',p.linaje_id))grant(r.rasgo_id,p.linaje?.nombre??'Linaje','Linaje');
 for(const d of p.dedicaciones??[])for(const r of rows(db,'SELECT rasgo_id FROM dedicaciones_rasgos WHERE dedicacion_id=?',d.id))grant(r.rasgo_id,d.nombre,'Dedicación');
 for(const n of p.nacimientos??[])for(const r of rows(db,'SELECT rasgo_id FROM nacimientos_rasgos WHERE nacimiento_id=?',n.id))grant(r.rasgo_id,n.nombre,'Nacimiento');
 for(const profession of p.profesiones??[])grant(profession.rasgo_id,profession.nombre,'Oficio');
 for(const a of p.adquisiciones??[])if(a.dote_id)for(const r of rows(db,'SELECT rasgo_id FROM dotes_rasgos WHERE dote_id=?',a.dote_id))grant(r.rasgo_id,a.elemento.nombre);
 const pathTraits=p.rasgos_senda?p.rasgos_senda.filter(r=>r.activo):rows(db,'SELECT cr.*,c.nombre senda FROM clases_rasgos cr JOIN personajes_clases pc ON pc.clase_id=cr.clase_id JOIN clases c ON c.id=cr.clase_id WHERE pc.personaje_id=? AND (cr.es_insignia=1 OR EXISTS(SELECT 1 FROM personajes_clases_rasgos pr WHERE pr.personaje_id=? AND pr.clase_rasgo_id=cr.id))',p.id,p.id);
 for(const r of pathTraits)grant(r.rasgo_id,r.senda);
 for(const question of p.elecciones_senda??[]){
  const option=question.opciones.find(o=>o.id===question.opcion_id);
  if(option)grant(option.rasgo_id,question.texto);
 }
 for(const r of rows(db,'SELECT * FROM personajes_rasgos WHERE personaje_id=?',p.id))grant(r.rasgo_id,r.fuente);
 return [...ids].map(([id,sources])=>{const r=one(db,"SELECT * FROM rasgos WHERE id=? AND tipo='Capacidad'",id);return r?{...r,fuentes:[...sources],origenes:[...(origins.get(id)??[])],sendas:pathTraits.filter(t=>t.rasgo_id===id).map(t=>({clase_id:t.clase_id,nombre:t.senda,xp_requerida:t.xp_requerida??t.xp_clase_requerida,xp_dedicada:t.xp_dedicada??0,inicial:Boolean(t.es_insignia)})),modificadores:rows(db,'SELECT * FROM rasgos_modificadores WHERE rasgo_id=?',id),acciones:rows(db,'SELECT a.* FROM acciones a JOIN rasgos_acciones ra ON ra.accion_id=a.id WHERE ra.rasgo_id=?',id)}:null;}).filter(Boolean);
}
