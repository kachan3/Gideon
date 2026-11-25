import test from 'node:test';
import assert from 'node:assert/strict';
import {openDatabase,catalogue,createCharacter,character,transaction,addProgress} from './server.mjs';
import {professionGuarantees,selectedProfession} from '../js/profession-rules.js';
import {creationSkills,FIXED_VALUES,ATTRIBUTE_ORDER} from '../js/creation-rules.js';
import {lineageBonuses} from '../js/lineage-rules.js';

function payload(c,name){
 const attrs=c.skills.filter(s=>s.tipo==='Atributo').sort((a,b)=>ATTRIBUTE_ORDER.indexOf(a.nombre)-ATTRIBUTE_ORDER.indexOf(b.nombre)),b={nombre:'Oficio '+name,clase_id:c.clases[0].id,dedicacion_id:c.dedicaciones.find(d=>d.nombre===name).id,linaje_id:c.linajes.find(l=>l.codigo==='hijos_del_sol').id,nacimiento_id:c.nacimientos[0].id,atributos:Object.fromEntries(attrs.map((a,i)=>[a.id,FIXED_VALUES[i]])),pools:{}};
 c.skills.filter(s=>s.tipo==='Habilidad'&&s.combate).slice(0,4).forEach((s,i)=>b.pools[s.id]=[20,15,10,5][i]);c.skills.filter(s=>s.tipo==='Habilidad'&&!s.combate).slice(0,3).forEach((s,i)=>b.pools[s.id]=[20,20,10][i]);return b;
}
test('ocho Dedicaciones y ocho Nacimientos, con preguntas y habilidades garantizadas',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db);assert.equal(c.dedicaciones.length,8);assert.equal(c.nacimientos.length,8);assert(c.dedicaciones.some(d=>d.nombre==='Cazador'));assert(!c.dedicaciones.some(d=>d.nombre==='Mercenario'));
  for(const d of c.dedicaciones){assert.equal(c.dedicaciones_preguntas.filter(q=>q.dedicacion_id===d.id).length,4);const b=payload(c,d.nombre),options=c.dedicaciones_profesiones.filter(o=>o.dedicacion_id===d.id);if(options.length>1)b.profesion_id=options[0].profesion_id;assert(professionGuarantees(c,b).length>0);}
  for(const n of c.nacimientos){assert.equal(c.nacimientos_preguntas.filter(q=>q.nacimiento_id===n.id).length,4);assert.equal(n.rangos_demo_vigentes,0);}
 }finally{db.close();}
});
test('Artesano elige un oficio y obtiene 50 en una habilidad propia, sin consumir pools',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),b=payload(c,'Artesano');assert.throws(()=>transaction(db,()=>createCharacter(db,b)),/oficio aprendido/);
  const allowed=c.dedicaciones_profesiones.filter(o=>o.dedicacion_id===b.dedicacion_id).map(o=>c.profesiones.find(p=>p.id===o.profesion_id));assert.deepEqual(allowed.map(p=>p.nombre).sort(),['Herrería','Carpintería','Joyería','Cerrajería','Albañilería'].sort());
  for(const o of allowed){const body={...b,profesion_id:o.id},p=transaction(db,()=>createCharacter(db,body));assert.equal(p.skills.find(s=>s.id===o.skill_id).valor,50);assert(p.rasgos.some(r=>r.id===o.rasgo_id));assert.equal(p.profesiones[0].nombre,o.nombre);assert.equal(p.xp_gastada,0);assert.equal(character(db,p.id).skills.find(s=>s.id===o.skill_id).valor,50);}
  assert.throws(()=>transaction(db,()=>createCharacter(db,{...b,profesion_id:c.profesiones.find(p=>p.nombre==='Comercio').id})),/no pertenece/);
 }finally{db.close();}
});
test('un oficio puede mejorar y servir de requisito a un dote general',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),o=c.profesiones.find(p=>p.nombre==='Herrería'),b={...payload(c,'Artesano'),profesion_id:o.id},p=transaction(db,()=>createCharacter(db,b));
  db.prepare('UPDATE personajes SET xp_total=3 WHERE id=?').run(p.id);
  const feat=Number(db.prepare("INSERT INTO dotes(nombre,descripcion,costo_xp) VALUES('Dote de prueba: forja avanzada','Prueba de requisitos',1)").run().lastInsertRowid);db.prepare('INSERT INTO requisitos_dotes(dote_id,skill_id,valor_minimo) VALUES(?,?,60)').run(feat,o.skill_id);
  assert.throws(()=>addProgress(db,p.id,{tipo:'Adquisicion',dote_id:feat}),/Requisitos/);
  addProgress(db,p.id,{tipo:'Skill',skill_id:o.skill_id,valor:10,xp_gastada:1});const after=addProgress(db,p.id,{tipo:'Adquisicion',dote_id:feat});assert.equal(after.skills.find(s=>s.id===o.skill_id).valor,60);assert.equal(after.xp_gastada,2);
 }finally{db.close();}
});
test('preguntas de Nacimiento se guardan separadas y rechazan respuestas de otra selección',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),b=payload(c,'Médico'),q=c.nacimientos_preguntas.find(q=>q.nacimiento_id===b.nacimiento_id),other=c.nacimientos_preguntas.find(q=>q.nacimiento_id!==b.nacimiento_id);
  const p=transaction(db,()=>createCharacter(db,{...b,respuestas_nacimiento:{[q.id]:'Una comunidad de prueba'}}));assert.equal(p.origen_trasfondo[0].respuesta,'Una comunidad de prueba');assert.equal(p.trasfondo.length,0);assert.equal(p.skills.find(s=>s.nombre==='Medicina').valor,50);
  assert.throws(()=>transaction(db,()=>createCharacter(db,{...b,respuestas_nacimiento:{[other.id]:'Ajena'}})),/no pertenece/);
  const legacy=db.prepare("SELECT id FROM dedicaciones WHERE nombre='Mercenario'").get();assert.throws(()=>transaction(db,()=>createCharacter(db,{...b,dedicacion_id:legacy.id})),/no está disponible/);
  assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
 }finally{db.close();}
});
