import test from 'node:test';
import assert from 'node:assert/strict';
import {openDatabase,character,catalogue,createCharacter,transaction,makeServer} from './server.mjs';
import {addInventory} from './equipment.mjs';
import {assignGear} from './market.mjs';
import {useArtifact} from './artifacts.mjs';
import {skillRoll} from './magic.mjs';
import {fixtureFetch} from './http-fixture.mjs';
import {artifactEquipment} from '../js/artifact-equipment.js';
import {ATTRIBUTE_ORDER,FIXED_VALUES} from '../js/creation-rules.js';
import {initialTraitChoices} from '../js/trait-choices-ui.js';
const one=(db,q,...a)=>db.prepare(q).get(...a);
const add=(db,name,p=1)=>addInventory(db,p,{artefacto_id:one(db,'SELECT id FROM artefactos_arcanos WHERE nombre=?',name).id});
const use=(db,id,operacion,extra={})=>transaction(db,()=>useArtifact(db,character(db,1),{inventario_id:id,operacion,...extra}));
const item=(db,id)=>character(db,1).inventario.find(i=>i.id===id);
function hold(db,id){for(const i of character(db,1).inventario.filter(i=>i.equipado))assignGear(db,1,i.id,{ubicacion:'Mochila'});assignGear(db,1,id,{ubicacion:'Mano principal'});}

test('catálogo, elección inicial, oro por Senda y entrega de cada artefacto',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),choice=c.elecciones_rasgos.find(e=>e.tipo==='Artefacto');
  assert.deepEqual(choice.opciones.map(a=>a.nombre),['Blunderblaze','Varita del Amanecer','Mastín de Huesos']);
  const attrs=c.skills.filter(s=>s.tipo==='Atributo').sort((a,b)=>ATTRIBUTE_ORDER.indexOf(a.nombre)-ATTRIBUTE_ORDER.indexOf(b.nombre));
  for(const artifact of choice.opciones){
   const b={nombre:'Prueba '+artifact.nombre,clase_id:c.clases.find(s=>s.nombre==='Senda del Arcanista').id,linaje_id:c.linajes.find(l=>l.codigo==='hijos_del_sol').id,dedicacion_id:c.dedicaciones[0].id,nacimiento_id:c.nacimientos[0].id,atributos:Object.fromEntries(attrs.map((a,i)=>[a.id,FIXED_VALUES[i]])),pools:{}};
   c.skills.filter(s=>s.tipo==='Habilidad'&&s.combate).slice(0,4).forEach((s,i)=>b.pools[s.id]=[20,15,10,5][i]);c.skills.filter(s=>s.tipo==='Habilidad'&&!s.combate).slice(0,3).forEach((s,i)=>b.pools[s.id]=[20,20,10][i]);
   b.elecciones_rasgos=Object.fromEntries(initialTraitChoices(c,b).map(q=>[q.codigo,q.tipo==='Artefacto'?artifact.id:q.opciones.find(o=>!o.bloqueada).id]));
   const p=transaction(db,()=>createCharacter(db,b));assert.equal(p.oro,100);assert.equal(p.xp_gastada,0);
   assert.equal(p.inventario.filter(i=>i.artefacto_id).length,1);assert.equal(p.inventario.find(i=>i.artefacto_id).cargas_actuales,one(db,'SELECT cargas_maximas n FROM artefactos_arcanos WHERE id=?',artifact.referencia_id).n);
   assert.match(artifactEquipment(p,c),/Artefactos arcanos/);assert.match(artifactEquipment(p,c),/data-artifact-op/);
  }
  assert.equal(c.clases.find(s=>s.nombre==='Senda del Berserker').oro_inicial,200);
  assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
 }finally{db.close();}
});

test('Blunderblaze: ataque consume una carga incluso al fallar; gasto autoritativo y recarga diaria',()=>{
 const db=openDatabase(':memory:');try{
  const id=add(db,'Blunderblaze');hold(db,id);
  const a=character(db,1).equipo.ataques.find(a=>a.item_id===id);assert(a.equipado);assert.equal(a.dano_base,Math.floor(character(db,1).skills.find(s=>s.nombre==='Voluntad').valor/10)+1);
  transaction(db,()=>skillRoll(db,character(db,1),{ataque:id},()=>99));assert.equal(item(db,id).cargas_actuales,5);
  const mana=character(db,1).mana_consumido;use(db,id,'recargar_mana',{cantidad:1,coste:0});assert.equal(item(db,id).cargas_actuales,6);assert.equal(character(db,1).mana_consumido,mana+1);
  db.prepare('UPDATE inventario SET cargas_actuales=0 WHERE id=?').run(id);use(db,id,'recarga_natural',{condicion:true,dia:'Día 1'});assert.equal(item(db,id).cargas_actuales,6);
  db.prepare('UPDATE inventario SET cargas_actuales=0 WHERE id=?').run(id);assert.throws(()=>use(db,id,'recarga_natural',{condicion:true,dia:'Día 1'}),/día/);
  assert.throws(()=>use(db,id,'recargar_mana',{cantidad:-1}));assert.throws(()=>use(db,id,'recargar_mana',{cantidad:99}));assert.equal(item(db,id).cargas_actuales,0);
  assert.throws(()=>transaction(db,()=>skillRoll(db,character(db,1),{ataque:id},()=>20)),/arma/);
 }finally{db.close();}
});

test('Varita y Mastín: activación, luz, destello, minutos y condiciones de recarga',()=>{
 const db=openDatabase(':memory:');try{
  const wand=add(db,'Varita del Amanecer');hold(db,wand);use(db,wand,'luz');assert.equal(item(db,wand).cargas_actuales,4);assert.equal(item(db,wand).artefacto_activo,1);
  use(db,wand,'destello');assert.equal(item(db,wand).cargas_actuales,1);assert.throws(()=>use(db,wand,'destello'),/Cargas/);use(db,wand,'apagar');assert.equal(item(db,wand).artefacto_activo,0);
  const skull=add(db,'Mastín de Huesos');hold(db,skull);assert(!character(db,1).equipo.ataques.find(a=>a.item_id===skull).equipado);
  use(db,skull,'manifestar');assert.equal(item(db,skull).cargas_actuales,2);assert(character(db,1).equipo.ataques.find(a=>a.item_id===skull).equipado);
  transaction(db,()=>skillRoll(db,character(db,1),{ataque:skull},()=>21));assert.equal(item(db,skull).cargas_actuales,2);
  use(db,skull,'minuto');assert.equal(item(db,skull).cargas_actuales,1);assert.throws(()=>use(db,skull,'recarga_natural',{condicion:true}),/inactivo/);
  use(db,skull,'apagar');use(db,skull,'recarga_natural',{condicion:true});assert.equal(item(db,skull).cargas_actuales,2);
  assert.throws(()=>use(db,skull,'recarga_natural',{condicion:false}),/Confirma/);
 }finally{db.close();}
});

test('API de artefactos verifica propietario y persiste cargas',async t=>{
 const db=openDatabase(':memory:'),id=add(db,'Varita del Amanecer');hold(db,id);
 const server=makeServer(db);await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(async()=>{await new Promise(r=>server.close(r));db.close();});
 const fetch=fixtureFetch(db),url=`http://127.0.0.1:${server.address().port}/api/personajes/1/artefactos`;
 const post=body=>fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 let response=await post({inventario_id:id,operacion:'destello',coste:0});assert.equal(response.status,200);assert.equal((await response.json()).inventario.find(i=>i.id===id).cargas_actuales,2);
 response=await post({inventario_id:id+999,operacion:'destello'});assert.equal(response.status,400);assert.equal(item(db,id).cargas_actuales,2);
});
