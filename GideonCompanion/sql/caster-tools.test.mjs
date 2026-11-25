import test from 'node:test';
import assert from 'node:assert/strict';
import {openDatabase,character,transaction,catalogue,addProgress,makeServer} from './server.mjs';
import {spellOperation,skillRoll} from './magic.mjs';
import {recordTraitChoice} from './trait-choices.mjs';
import {fixtureFetch} from './http-fixture.mjs';
import {pathSummary,pathTraitsSheet} from '../js/path-ui.js';
const one=(db,q,...a)=>db.prepare(q).get(...a);
function book(db){
 const id=one(db,"SELECT id FROM dotes WHERE nombre='La Herramienta Correcta'").id;
 if(!character(db,1).adquisiciones.some(a=>a.dote_id===id))db.prepare("INSERT INTO progresion(personaje_id,change,tipo,dote_id,xp_gastada,origen) VALUES(1,'Add','Adquisicion',?,0,'Prueba')").run(id);
 const choice=character(db,1).elecciones_rasgos.find(e=>e.codigo==='herramienta');
 if(choice.valor!==null)db.prepare("DELETE FROM personajes_elecciones_rasgos WHERE personaje_id=1 AND codigo='herramienta'").run();
 recordTraitChoice(db,character(db,1),{codigo:'herramienta',valor:'Libro de Conjuros'},()=>{});
 return character(db,1);
}
const config=p=>({accion:'Comenzar',efecto_id:p.componentes.efectos[0].id,medium_id:p.componentes.mediums[0].id,shape_id:p.componentes.shapes[0].id,efecto_pl:4,duracion_pl:0,mods:[],herramienta:'Herramienta',componentes_disponibles:true});
const cast=(db,b,dado=31)=>transaction(db,()=>spellOperation(db,character(db,1),b,()=>dado));
const weave=(db,dado)=>cast(db,{accion:'Tejer',canalizacion_id:character(db,1).magia.activa.id,componentes_disponibles:true},dado);

test('Libro: reemplaza avance, cobra 1 Stamina y limita la repetición por turno',()=>{
 const db=openDatabase(':memory:');try{
  const p=book(db);cast(db,config(p));const original=weave(db,31);assert.equal(original.progreso,3);
  const result=cast(db,{accion:'Repetir con Libro',tirada_id:original.id},99);
  assert.equal(result.progreso,0);assert.equal(character(db,1).stamina_gastada,p.stamina_gastada+1);assert.equal(character(db,1).herramienta_lanzador.libro_disponible,false);
  assert.equal(JSON.parse(one(db,'SELECT resultado FROM tiradas WHERE id=?',original.id).resultado).reemplazada_por,result.id);
  const next=weave(db,31);assert.throws(()=>cast(db,{accion:'Repetir con Libro',tirada_id:next.id},21),/turno/);
  cast(db,{accion:'Nuevo turno',turno_actual:1});assert.throws(()=>cast(db,{accion:'Nuevo turno',turno_actual:1}),/cambió/);
  const nextTurn=weave(db,41);cast(db,{accion:'Repetir con Libro',tirada_id:nextTurn.id},31);assert.equal(character(db,1).stamina_gastada,p.stamina_gastada+2);
 }finally{db.close();}
});

test('Libro puede repetir una tirada que completó el conjuro sin duplicar Maná ni daño crónico',()=>{
 const db=openDatabase(':memory:');try{
  const p=book(db);db.prepare('UPDATE personajes SET mana_consumido=8 WHERE id=1').run();cast(db,config(character(db,1)));
  const original=weave(db,0);assert(original.completado);assert.equal(character(db,1).mana_consumido,12);assert(character(db,1).dano_cronico>0);
  const result=cast(db,{accion:'Repetir con Libro',tirada_id:original.id},99);assert.equal(result.completado,false);
  const after=character(db,1);assert.equal(after.mana_consumido,8);assert.equal(after.dano_cronico,p.dano_cronico);assert(after.magia.activa);assert.equal(after.stamina_gastada,1);
 }finally{db.close();}
});

test('sin Libro, sin herramienta, sin Stamina o con una tirada posterior no se permite repetir',()=>{
 const db=openDatabase(':memory:');try{
  cast(db,config(character(db,1)));const noBook=weave(db,31);assert.throws(()=>cast(db,{accion:'Repetir con Libro',tirada_id:noBook.id}),/disponible/);
  book(db);cast(db,{accion:'Interrumpir',canalizacion_id:character(db,1).magia.activa.id});cast(db,{...config(character(db,1)),herramienta:'Sin herramienta'});
  const noTool=weave(db,31);assert.throws(()=>cast(db,{accion:'Repetir con Libro',tirada_id:noTool.id}),/disponible/);
  cast(db,{accion:'Interrumpir',canalizacion_id:character(db,1).magia.activa.id});cast(db,config(character(db,1)));const normal=weave(db,31);
  db.prepare('UPDATE personajes SET stamina_gastada=999 WHERE id=1').run();assert.throws(()=>cast(db,{accion:'Repetir con Libro',tirada_id:normal.id}),/Stamina insuficiente/);
  db.prepare('UPDATE personajes SET stamina_gastada=0 WHERE id=1').run();transaction(db,()=>skillRoll(db,character(db,1),{skill_id:character(db,1).skills[0].id},()=>21));assert.throws(()=>cast(db,{accion:'Repetir con Libro',tirada_id:normal.id}),/disponible/);
  assert.equal(character(db,1).stamina_gastada,0);
 }finally{db.close();}
});

test('catálogo de herramientas, Rasgos sin compra en XP y distancias persistidas convertidas',()=>{
 const db=openDatabase(':memory:');try{
  const p=book(db),c=catalogue(db);assert.deepEqual(c.elecciones_rasgos.find(e=>e.tipo==='Herramienta').opciones.map(o=>o.nombre),['Libro de Conjuros','Bastón','Espada']);
  const xp=p.xp_gastada;assert.throws(()=>transaction(db,()=>addProgress(db,1,{tipo:'Adquisicion',rasgo_id:p.rasgos[0].id,xp_gastada:100})));assert.equal(character(db,1).xp_gastada,xp);
  assert.match(one(db,"SELECT reglas_json FROM artefactos_arcanos WHERE nombre='Blunderblaze'").reglas_json,/1.2 unidades/);
  assert(!/\b\d+\s*(ft|pies|feet)\b/.test(one(db,"SELECT descripcion FROM dotes WHERE nombre='La Herramienta Correcta'").descripcion));
  assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
 }finally{db.close();}
});

test('API de repetición del Libro rechaza la segunda repetición y conserva el recurso',async t=>{
 const db=openDatabase(':memory:');book(db);cast(db,config(character(db,1)));const roll=weave(db,31);
 const server=makeServer(db,{random100:()=>41});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(async()=>{await new Promise(r=>server.close(r));db.close();});
 const fetch=fixtureFetch(db),url=`http://127.0.0.1:${server.address().port}/api/personajes/1/conjuros`,body={accion:'Repetir con Libro',tirada_id:roll.id};
 let r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});assert.equal(r.status,200);assert.equal((await r.json()).personaje.stamina_gastada,1);
 r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});assert.equal(r.status,400);assert.equal(character(db,1).stamina_gastada,1);
});
