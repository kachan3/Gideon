import {fixtureFetch,TEST_CATALOGUE_TOKEN} from './http-fixture.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {openDatabase,makeServer,character,transaction,recordRest} from './server.mjs';
import {skillRoll,spellOperation,spendResource} from './magic.mjs';
import {resolveRoll,rollIndex} from '../js/roll-rules.js';
import {spellPlan} from '../js/magic-rules.js';
test('d100: bandas, capicúas, NE/NF, circunstancias y dificultad',()=>{
 assert.equal(resolveRoll(0,0).ne,10);assert.equal(resolveRoll(0,0).critico,'Portento');
 assert.equal(resolveRoll(4,-30).exito,true);assert.equal(resolveRoll(4,-30).ne,0);
 assert.equal(resolveRoll(97,130).nf,7);assert.equal(resolveRoll(99,130).nf,10);
 assert.equal(resolveRoll(33,40).ne,10);assert.equal(resolveRoll(55,40).nf,10);
 assert.equal(resolveRoll(40,40).exito,true);assert.equal(resolveRoll(41,40).nf,1);
 assert.equal(resolveRoll(28,40).ne,2);assert.equal(resolveRoll(28,40,{dificultad:3}).supera,false);
 assert.equal(resolveRoll(28,40,{ne:-3,nf:5}).ne,0);
 assert.equal(resolveRoll(52,40,{nf:-3}).exito,false);
 assert.equal(rollIndex(60,40).find(x=>x.circunstancia==='Fácil').exito,true);
 assert.equal(rollIndex(60,40).find(x=>x.circunstancia==='Normal').exito,false);
 for(let dado=0;dado<100;dado++){assert.equal(rollIndex(dado,40).length,8);const r=resolveRoll(dado,40);assert(r.ne>=0&&r.nf>=0);assert.equal(r.exito,dado<=5||(dado<95&&dado<=40));}
});
const config=p=>({accion:'Comenzar',efecto_id:p.componentes.efectos[0].id,medium_id:p.componentes.mediums[0].id,shape_id:p.componentes.shapes[0].id,efecto_pl:4,duracion_pl:0,mods:[],herramienta:'Herramienta',componentes_disponibles:true});
test('Spellweave persistente: avance, salvamento, pérdidas, pago único e interrupción',()=>{
 const db=openDatabase(':memory:');try{
  let p=character(db,1);const cast=b=>transaction(db,()=>spellOperation(db,character(db,1),b,()=>b.testDado));
  cast(config(p));let active=character(db,1).magia.activa;assert.equal(active.plan.pl,6);assert.equal(character(db,1).mana_consumido,0);
  const weave=dado=>cast({accion:'Tejer',canalizacion_id:active.id,componentes_disponibles:true,testDado:dado});
  let r=weave(31);assert.equal(r.progreso,3);assert.equal(r.mana_pagado,0);
  r=weave(51);assert.equal(r.progreso,3);assert.equal(r.delta,0);
  r=weave(58);assert.equal(r.progreso,0);assert.equal(r.delta,-4);
  r=weave(31);assert.equal(r.progreso,3);r=weave(31);assert.equal(r.completado,true);assert.equal(r.mana_pagado,4);
  p=character(db,1);assert.equal(p.mana_consumido,4);assert.equal(p.magia.activa,null);assert.equal(p.magia.historial[0].estado,'Completado');assert.equal(p.magia.tiradas.length,5);
  assert.throws(()=>weave(0),/ya no está activa/);assert.equal(character(db,1).mana_consumido,4);
  cast(config(p));active=character(db,1).magia.activa;
  r=cast({accion:'Tejer',canalizacion_id:active.id,componentes_disponibles:false,testDado:0});assert.match(r.aviso,/interrumpida/);assert.equal(character(db,1).mana_consumido,4);
  assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
 }finally{db.close();}
});
test('validación de componentes, PL, herramientas, flujos y maná',()=>{
 const db=openDatabase(':memory:');try{
  const p=character(db,1),b=config(p);assert.throws(()=>spellPlan(p,{...b,efecto_id:999}),/desconocido/);assert.throws(()=>spellPlan(p,{...b,efecto_pl:5}),/PL/);
  assert.throws(()=>spellPlan(p,{...b,herramienta:'Hechicero'}),/rasgo/);assert.throws(()=>spellPlan(p,{...b,mods:[999]}),/desconocido/);
  const effect=p.componentes.efectos[0];effect.escuela='Ignamor + Gelmir';p.skills.find(s=>s.nombre==='Gelmir').valor=20;assert.equal(spellPlan(p,b).valor,20);
  assert.throws(()=>spendResource(db,p,'Mana',45),/insuficiente/);assert.throws(()=>spendResource(db,p,'Stamina',5),/insuficiente/);
  transaction(db,()=>spendResource(db,p,'Mana',10));const after=character(db,1);assert.equal(after.dano_cronico,2);assert.equal(after.derivados.mana_max,42);assert.equal(after.derivados.mana_actual,32);
  assert.throws(()=>spendResource(db,after,'Mana',35),/insuficiente/);assert.equal(character(db,1).mana_consumido,10);
  const unarmed=skillRoll(db,after,{ataque:'desarmado'},()=>31);assert.equal(unarmed.dano,7);assert.equal(unarmed.indice.length,8);
 }finally{db.close();}
});
test('PL por segmento y modificadores escalables: suma, límites y configuración persistida',()=>{
 const db=openDatabase(':memory:');try{
  const cone=db.prepare("SELECT id FROM shapes WHERE nombre='Cono — ejemplo provisional'").get().id,ep=character(db,1).adquisiciones.find(a=>a.epifania_id).epifania_id;
  db.prepare('INSERT OR IGNORE INTO epifanias_shapes VALUES(?,?)').run(ep,cone);
  const p=character(db,1),b={...config(p),shape_id:cone,efecto_pl:2,medium_pl:3,shape_pl:2};
  p.componentes.mods=[{id:999,nombre:'Mod escalable',coste_pl:1,pl_escalable:1,escalado_texto:'Cada PL extra añade un salto.'},{id:998,nombre:'Mod fijo',coste_pl:1,pl_escalable:0}];
  let plan=spellPlan(p,{...b,mods:[{id:999,pl:3},{id:998,pl:1}]});assert.equal(plan.pl,11);assert.equal(plan.coste_mana,8);assert.equal(plan.config.medium_pl,3);assert.equal(plan.config.shape_pl,2);assert.deepEqual(plan.config.mods,[{id:999,pl:3},{id:998,pl:1}]);assert.equal(spellPlan(p,plan.config).pl,11);
  assert.throws(()=>spellPlan(p,{...b,medium_pl:0}),/PL/);assert.throws(()=>spellPlan(p,{...b,shape_pl:5}),/PL/);assert.throws(()=>spellPlan(p,{...b,mods:[{id:998,pl:2}]}),/PL/);assert.throws(()=>spellPlan(p,{...b,mods:[{id:999,pl:0}]}),/PL/);assert.throws(()=>spellPlan(p,{...b,mods:[{id:999,pl:1},{id:999,pl:2}]}),/inválidos/);
  p.componentes.efectos[0].intervalo_duracion='Minutos';plan=spellPlan(p,{...b,duracion_pl:3});assert.equal(plan.pl,10);assert.equal(plan.config.duracion_pl,3);
  // Las canalizaciones anteriores a la ampliación conservan los mínimos de catálogo.
  p.componentes.efectos[0].intervalo_duracion='Instantánea';assert.equal(spellPlan(p,config(p)).pl,6);
  transaction(db,()=>spellOperation(db,character(db,1),{...b,componentes_disponibles:true}));const a=character(db,1).magia.activa;assert.equal(a.plan.pl,7);assert.equal(a.plan.config.medium_pl,3);assert.equal(a.plan.config.shape_pl,2);
 }finally{db.close();}
});
test('el catálogo gobierna efectos fijos, escalado pendiente, Medium y duración',()=>{
 const db=openDatabase(':memory:');try{
  const p=character(db,1),b=config(p),self=p.componentes.mediums.find(m=>m.nombre==='Self');
  assert.throws(()=>spellPlan(p,{...b,shape_pl:0}),/PL/);
  assert.throws(()=>spellPlan(p,{...b,medium_id:self.id,medium_pl:1}),/Medium/);
  assert.throws(()=>spellPlan(p,{...b,medium_id:self.id,medium_pl:0}),/Shape.*Medium/);
  assert.match(p.componentes.mediums[0].escalado_texto,/5 unidades/);assert.equal(p.componentes.mediums[0].aspecto_escalable,'Distancia de lanzamiento');
  const e=p.componentes.efectos[0];e.pl_escalable=0;e.escalado_pendiente=0;assert.throws(()=>spellPlan(p,b),/PL/);assert.equal(spellPlan(p,{...b,efecto_pl:1}).pl,3);
  e.pl_escalable=1;e.escalado_pendiente=1;assert.throws(()=>spellPlan(p,b),/PL/);
  e.escalado_pendiente=0;e.intervalo_duracion='Rondas';assert.equal(spellPlan(p,{...b,duracion_pl:3}).pl,9);
  const duration=p.componentes.duraciones.find(d=>d.intervalo==='Rondas');duration.pl_escalable=0;assert.throws(()=>spellPlan(p,{...b,duracion_pl:3}),/PL/);assert.equal(spellPlan(p,{...b,duracion_pl:1}).pl,7);
 }finally{db.close();}
});
test('descanso, curación diaria, pausa y meditación tienen efectos distintos',()=>{
 const db=openDatabase(':memory:');try{
  transaction(db,()=>spellOperation(db,character(db,1),config(character(db,1))));
  db.prepare('UPDATE personajes SET heridas_actuales=9,bloque_grave=4,heridas_graves=2,heridas_mortales=1,mana_consumido=20,dano_cronico=12,stamina_gastada=2,omen_actual=0 WHERE id=1').run();
  const rest=b=>transaction(db,()=>recordRest(db,1,b));
  let p=rest({tipo:'Largo',dia:1});
  assert.equal(p.heridas_actuales,9);assert.equal(p.heridas_graves,2);assert.equal(p.heridas_mortales,1);
  assert.equal(p.mana_consumido,20);assert.equal(p.dano_cronico,12);assert.equal(p.derivados.mana_actual,12);
  assert.equal(p.magia.activa,null);assert.throws(()=>rest({tipo:'Largo',dia:1}),/día/);
  p=rest({tipo:'Corto',horas:2,meditar:true});assert.equal(p.derivados.mana_actual,14);
  p=rest({tipo:'Pausa'});assert.equal(p.stamina_gastada,0);
  p=rest({tipo:'Curación natural',dia:1});assert.equal(p.heridas_actuales,8);
  assert.throws(()=>rest({tipo:'Curación natural',dia:1}),/día/);
 }finally{db.close();}
});
test('API: gasto excesivo bloqueado, trucos conocidos y coste autoritativo',async t=>{
 const db=openDatabase(':memory:'),server=makeServer(db,{random100:()=>0});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(async()=>{await new Promise(r=>server.close(r));db.close();});
 const fetch=fixtureFetch(db);
 const api=async(route,body,method='POST')=>{const r=await fetch(`http://127.0.0.1:${server.address().port}/api/personajes/1/${route}`,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});return {status:r.status,data:await r.json()};};
 assert.equal((await api('estado',{mana_consumido:45},'PATCH')).status,400);assert.equal((await api('estado',{stamina_gastada:5},'PATCH')).status,400);
 assert.equal((await api('recursos',{recurso:'Mana',cantidad:45})).status,400);assert.equal(character(db,1).mana_consumido,0);
 const r=await api('tiradas',{skill_id:character(db,1).skills[0].id,dado:99,valor:0});assert.equal(r.data.tirada.dado,0);assert.equal(r.data.tirada.ne,10);
 assert.equal((await api('trucos',{truco_id:999})).status,400);
 const trick=Number(db.prepare("INSERT INTO trucos(nombre,escuela,recurso,coste_recurso,descripcion) VALUES('Truco de prueba','Ignamor','Stamina',2,'Prueba')").run().lastInsertRowid),ep=character(db,1).adquisiciones.find(a=>a.epifania_id).epifania_id;
 db.prepare('INSERT INTO epifanias_trucos VALUES(?,?)').run(ep,trick);
 assert.equal((await api('trucos',{truco_id:trick,coste_recurso:0})).data.derivados.stamina,2);
 assert.equal((await api('trucos',{truco_id:trick})).data.derivados.stamina,0);assert.equal((await api('trucos',{truco_id:trick})).status,400);
 const p=character(db,1);await api('conjuros',config(p));const active=character(db,1).magia.activa;
 const cast=await api('conjuros',{accion:'Tejer',canalizacion_id:active.id,componentes_disponibles:true});assert.equal(cast.data.tirada.completado,true);assert.equal(cast.data.personaje.mana_consumido,4);
 assert.equal((await api('conjuros',{accion:'Tejer',canalizacion_id:active.id,componentes_disponibles:true})).status,400);
});
