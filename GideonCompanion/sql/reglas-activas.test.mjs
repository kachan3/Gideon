import test from 'node:test';
import assert from 'node:assert/strict';
import {openDatabase,character,transaction,makeServer} from './server.mjs';
import {fixtureFetch} from './http-fixture.mjs';
import {changeInventory,addInventory} from './equipment.mjs';
import {resolveRoll} from '../js/roll-rules.js';
import {creationSkills} from '../js/creation-rules.js';
import {skillRoll} from './magic.mjs';

test('orden de resolución según los ejemplos del reglamento',()=>{
 for(const [dado,valor,opts,success,ne,nf,supera] of [
  [4,40,{dificultad:2},true,0,0,false],
  [4,40,{ventaja:2,dificultad:2},true,2,0,true],
  [91,40,{desventaja:2,salvataje:2},false,0,3,false],
  [95,100,{salvataje:5,dificultad:5},true,5,0,true],
  [99,100,{salvataje:9},false,0,10,false],
  [99,100,{ventaja:3,desventaja:2,salvataje:9,dificultad:9},true,9,0,true]
 ]){
  const r=resolveRoll(dado,valor,opts);
  assert.deepEqual([r.exito,r.ne,r.nf,r.supera],[success,ne,nf,supera]);
 }
 const config={skills:[{id:1,tipo:'Atributo'},{id:2,tipo:'Habilidad',padre_id:1}],atributos:{1:40},garantias:[{skill_id:2,minimo:50}]};
 assert.deepEqual([0,10,15].map(n=>creationSkills({...config,pools:{2:n}}).totals[2]),[50,50,60]);
});

test('dados de decenas, Omen y marcas se resuelven una sola vez',()=>{
 const db=openDatabase(':memory:');
 try{
  const p=character(db,1),skill=p.skills.find(s=>s.nombre==='Fuerza'),b={skill_id:skill.id,decenas_extra:1,omen:true};
  const draws=[98,12],start=skillRoll(db,p,b,()=>draws.shift());
  assert.deepEqual(start.dados,[98,18]);
  assert.equal(character(db,p.id).omen_actual,p.omen_actual);
  const choice={...b,clave:start.clave,eleccion:0};
  const r=transaction(db,()=>skillRoll(db,p,choice));
  assert.equal(r.exito,true);assert.equal(r.ne,9);
  assert.equal(character(db,p.id).omen_actual,p.omen_actual-1);
  assert.throws(()=>transaction(db,()=>skillRoll(db,p,choice)),/elección/);
  skillRoll(db,p,{skill_id:skill.id},()=>97);
  assert.deepEqual(character(db,p.id).entrenamiento.marcas,[]);
  skillRoll(db,p,{skill_id:skill.id,solicitada_dm:true},()=>97);
  assert.deepEqual(character(db,p.id).entrenamiento.marcas,[skill.id]);
 }finally{db.close();}
});

test('ocupación de manos, carga y soporte del arma',()=>{
 const db=openDatabase(':memory:');
 try{
  const p=character(db,1),sword=p.inventario.find(i=>i.arma),shield=db.prepare("SELECT id FROM items_base WHERE nombre='Escudo'").get();
  assert.equal(sword.mano,'Principal');
  const shieldId=addInventory(db,1,{item_base_id:shield.id,equipado:true,mano:'Secundaria'});
  assert.throws(()=>changeInventory(db,1,sword.id,{mano:'Secundaria'}),/ocupada/);
  changeInventory(db,1,shieldId,{transportado:false});
  db.prepare('UPDATE armas SET manos=2 WHERE id=?').run(sword.arma_id);
  changeInventory(db,1,sword.id,{mano:'Secundaria'});
  assert.throws(()=>addInventory(db,1,{item_base_id:shield.id,equipado:true,mano:'Principal'}),/ocupada/);
  const ctx=character(db,1);
  const value=n=>ctx.skills.find(s=>s.nombre===n).valor;
  assert.equal(ctx.equipo.peso_personal,5*Math.floor((value('Fuerza')+value('Vitalidad'))*ctx.linaje.escalado_vital/10));
  assert.equal(ctx.equipo.carga_dedicada,value('Carga')*2);
 }finally{db.close();}
});

test('entrenamiento, daño y descanso por los endpoints de la ficha',async t=>{
 const db=openDatabase(':memory:'),server=makeServer(db);
 await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(async()=>{await new Promise(r=>server.close(r));db.close();});
 const url='http://127.0.0.1:'+server.address().port+'/api/personajes/1/',fetch=fixtureFetch(db);
 const post=async(route,b)=>{const r=await fetch(url+route,{method:'POST',body:JSON.stringify(b)});assert.equal(r.status,200);return r.json();};
 const initial=character(db,1),mh=initial.derivados.mh;
 let p=await post('dano',{cantidad:mh,modo:'Final',tipo_dano:'Toxinas',zona:'Brazo izquierdo',ne_impacto:5});
 assert.equal(p.heridas_graves,1);assert.equal(p.heridas_mortales,1);assert.equal(p.bloque_grave,mh/4);
 assert.equal(p.ultimo_impacto.ne_impacto,5);assert.equal(p.derivados.estado,'Agonizando');
 const vit=p.skills.find(s=>s.nombre==='Vitalidad');
 assert(p.entrenamiento.marcas.includes(vit.id));
 p=await post('entrenamiento',{skills:[vit.id]});
 const attempt=p.entrenamiento.intentos[0];assert.equal(p.xp_disponible,initial.xp_disponible-1);
 if(!attempt.mejora)p=await post('entrenamiento',{asegurar:attempt.id});
 assert(!p.entrenamiento.marcas.includes(vit.id));
 assert(p.skills.find(s=>s.id===vit.id).valor>vit.valor);assert.equal(p.bloque_grave,mh/4);
 const prev=p.heridas_actuales;p=await post('descanso',{tipo:'Largo',dia:4});assert.equal(p.heridas_actuales,prev);
 p=await post('descanso',{tipo:'Curación natural',dia:4});assert.equal(p.heridas_actuales,prev-1);
 p=await post('dano',{cantidad:999,tipo_dano:'Toxinas',modo:'Omen'});assert.equal(p.heridas_actuales,prev-1);
});
