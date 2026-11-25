import test from 'node:test';
import assert from 'node:assert/strict';
import {openDatabase,character,transaction,addProgress,catalogue,makeServer,createCharacter} from './server.mjs';
import {ATTRIBUTE_ORDER,FIXED_VALUES} from '../js/creation-rules.js';
import {initialTraitChoices} from '../js/trait-choices-ui.js';
import {fixtureFetch} from './http-fixture.mjs';
import {initialEpiphanies} from './epiphanies.mjs';
import {useTrick} from './magic.mjs';
import {spellPlan,durationPLBounds} from '../js/magic-rules.js';
import {trickCard} from '../js/spellcasting.js';
const all=(db,q,...a)=>db.prepare(q).all(...a),one=(db,q,...a)=>db.prepare(q).get(...a);
function grant(db,name){const ep=one(db,'SELECT id FROM epifanias WHERE nombre=?',name);db.prepare("INSERT INTO progresion(personaje_id,change,tipo,epifania_id,xp_gastada,origen) VALUES(1,'Add','Adquisicion',?,0,'Prueba')").run(ep.id);return character(db,1);}
function plan(p,name,medium='Self',shape='Efecto Directo',overrides={}){
 const e=p.componentes.efectos.find(e=>e.nombre===name);
 return {efecto_id:e.id,medium_id:p.componentes.mediums.find(m=>m.nombre===medium).id,shape_id:p.componentes.shapes.find(s=>s.nombre===shape).id,efecto_pl:e.pl_minimo,duracion_pl:e.intervalo_duracion==='Instantánea'?0:1,mods:[],herramienta:'Herramienta',...overrides};
}

test('Ojos para las Eras se aprende y permite prever sin sustituir la epifanía inicial',()=>{
 const db=openDatabase(':memory:');try{
  const ep=one(db,"SELECT * FROM epifanias WHERE nombre='Eyes for the Ages / Ojos para las Eras'");
  assert.equal(ep.catalogo_inicial,0);assert.equal(ep.costo_xp,3);
  const before=character(db,1);
  transaction(db,()=>addProgress(db,1,{tipo:'Adquisicion',epifania_id:ep.id,xp_gastada:0}));
  const p=character(db,1);assert.equal(p.xp_gastada,before.xp_gastada+3);
  assert.equal(p.componentes.efectos.filter(e=>['Predicción','Adivinación rápida'].includes(e.nombre)).length,2);
  assert(p.componentes.misticas.some(m=>m.nombre==='Conciencia atemporal'&&m.descripcion.includes('rayo')));
  const prediction=spellPlan(p,plan(p,'Predicción','Self','Efecto Directo',{efecto_pl:3}));
  assert.equal(prediction.pl,3);assert.match(prediction.efecto.descripcion,/lógicamente similares/);
  assert.throws(()=>spellPlan(p,plan(p,'Predicción','Self','Efecto Directo',{efecto_pl:1})),/PL/);
  const vision=spellPlan(p,plan(p,'Adivinación rápida'));
  assert.equal(vision.pl,2);assert.equal(vision.efecto.concentracion,'Exhaustiva');assert.equal(vision.efecto.componentes,'Motriz, Motriz Fino');
  assert.throws(()=>spellPlan(p,plan(p,'Adivinación rápida','Un punto que puedas sentir')),/Medium/);
  assert.throws(()=>spellPlan(p,plan(p,'Adivinación rápida','Self','Proyectil')),/Shape/);
  assert.equal(all(db,'PRAGMA foreign_key_check').length,0);
 }finally{db.close();}
});

test('Reconstrucción usa el recurso fijo e incluye la contaminación del registro',()=>{
 const db=openDatabase(':memory:');try{
  const p=grant(db,'Eyes for the Ages / Ojos para las Eras'),t=p.componentes.trucos.find(t=>t.nombre==='Reconstrucción');
  assert.equal(t.componentes,'Motriz');assert.equal(t.concentracion,'Ninguna');assert.equal(t.intervalo_duracion,'Instantánea');assert.equal(t.parametros_pendientes,null);
  assert.equal(one(db,'SELECT nro_acciones_pa n FROM acciones WHERE id=?',t.accion_id).n,1);
  assert.match(t.descripcion,/candado/);assert.match(t.descripcion,/traslado/);
  transaction(db,()=>useTrick(db,p,{truco_id:t.id,opcion:'reconstruir',coste_recurso:0}));
  assert.equal(character(db,1).mana_consumido,p.mana_consumido+1);
  assert.throws(()=>transaction(db,()=>useTrick(db,character(db,1),{truco_id:t.id,opcion:'reconstruir',unidades:2})));
 }finally{db.close();}
});
test('seis epifanías con 2 efectos, 1 truco, 1 mística y coste de 3 XP; sin alterar demo',()=>{
 const db=openDatabase(':memory:');try{
  assert.equal(all(db,'SELECT * FROM epifanias WHERE catalogo_inicial=1').length,6);
  for(const e of initialEpiphanies){const ep=one(db,'SELECT * FROM epifanias WHERE nombre=?',e.nombre);assert.equal(ep.costo_xp,3);for(const [table,n] of [['efectos',2],['trucos',1],['misticas',1]])assert.equal(one(db,`SELECT COUNT(*) n FROM epifanias_${table} WHERE epifania_id=?`,ep.id).n,n);}
  const before=character(db,1),ep=one(db,"SELECT id FROM epifanias WHERE nombre='Telekinesis'");
  transaction(db,()=>addProgress(db,1,{tipo:'Adquisicion',epifania_id:ep.id,xp_gastada:0}));
  const after=character(db,1);assert.equal(after.xp_gastada,before.xp_gastada+3);assert.equal(after.componentes.trucos.length,1);assert.equal(after.componentes.misticas.length,1);
  assert.equal(all(db,'PRAGMA foreign_key_check').length,0);
 }finally{db.close();}
});
test('restricciones de efectos y duración fija se validan en servidor',()=>{
 const db=openDatabase(':memory:');try{
  grant(db,'Telekinesis');grant(db,'Sintonía con la Llama');grant(db,'Virtud Anima');const p=grant(db,'Primera Paradoja');
  assert.throws(()=>spellPlan(p,plan(p,'Combustión Espontánea','A creature you can detect')),/prohibido/);
  assert.throws(()=>spellPlan(p,plan(p,'Empujón','Self','Anillo')),/Shape/);
  assert.throws(()=>spellPlan(p,plan(p,'Anhelo','Self')),/Medium/);
  assert.throws(()=>spellPlan(p,plan(p,'Acelerar','Self','Proyectil')),/Shape/);
  const b=plan(p,'Acelerar','Self','Esfera (15u)');assert.equal(spellPlan(p,b).pl,5);
  assert.throws(()=>spellPlan(p,{...b,duracion_pl:2}),/PL/);
  assert.deepEqual(durationPLBounds(p,p.componentes.efectos.find(e=>e.nombre==='Acelerar')),{min:1,max:1});
  assert.equal(spellPlan(p,plan(p,'Empujón','Self','Objetivo Único',{efecto_pl:2})).pl,2);
  assert.throws(()=>spellPlan(p,plan(p,'Jabalina de Odio','Self','Proyectil')),/Medium/);
  assert.equal(spellPlan(p,plan(p,'Jabalina de Odio','A creature you can detect','Proyectil')).pl,3);
  assert.throws(()=>spellPlan(p,plan(p,'Empujón','Self','Proyectil')),/Shape.*Medium/);
  assert.throws(()=>spellPlan(p,plan(p,'Empujón','Touch','Proyectil')),/Shape.*Medium/);
  const projectile=plan(p,'Empujón','Un punto que puedas sentir','Proyectil');
  assert.equal(spellPlan(p,projectile).config.shape_pl,1);
  assert.throws(()=>spellPlan(p,{...projectile,shape_pl:0}),/PL/);
 }finally{db.close();}
});
test('modalidades y cantidades no permiten elegir costes arbitrarios; rollback por maná insuficiente',()=>{
 const db=openDatabase(':memory:');try{
  grant(db,'Memento Mori');grant(db,'Virtud Anima');grant(db,'Primera Paradoja');const p=grant(db,'Emaptomancia');
  const rot=p.componentes.trucos.find(t=>t.nombre==='Roting Touch'),detect=p.componentes.trucos.find(t=>t.nombre==='Detectar Magia'),repair=p.componentes.trucos.find(t=>t.nombre==='Reparar');
  transaction(db,()=>useTrick(db,character(db,1),{truco_id:rot.id,opcion:'meses',unidades:3,coste_recurso:0}));assert.equal(character(db,1).mana_consumido,3);
  transaction(db,()=>useTrick(db,character(db,1),{truco_id:detect.id,opcion:'stamina'}));assert.equal(character(db,1).stamina_gastada,1);
  for(const b of [{opcion:'inventado'},{opcion:'meses',unidades:0},{opcion:'meses',unidades:1.5},{opcion:'semana',unidades:2}])assert.throws(()=>transaction(db,()=>useTrick(db,character(db,1),{truco_id:rot.id,...b})));
  assert.throws(()=>transaction(db,()=>useTrick(db,character(db,1),{truco_id:repair.id,opcion:'minutos',unidades:9999})),/insuficiente/);assert.equal(character(db,1).mana_consumido,3);
  const cognition=p.componentes.trucos.find(t=>t.nombre==='Cognición Acelerada');assert.equal(one(db,'SELECT nro_acciones_pa n FROM acciones WHERE id=?',cognition.accion_id).n,0);assert.equal(cognition.componentes,'Ninguno');
  assert.match(trickCard(rot,p),/data-trick-units/);assert.match(trickCard(detect,p),/data-trick-option/);
 }finally{db.close();}
});
test('selección inicial ofrece los nombres vigentes y sus componentes reales',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),choice=c.elecciones_rasgos?.find(e=>e.tipo==='Epifania');
  assert.equal(choice.opciones.filter(o=>o.referencia_id&&initialEpiphanies.some(e=>e.nombre===o.nombre)).length,6);
  assert.equal(c.epifanias.filter(e=>e.catalogo_inicial).length,6);
  assert(!c.epifanias.some(e=>['Gelmiromancia','Ilusionismo','Evocación Tempestuosa'].includes(e.nombre)));
 }finally{db.close();}
});
test('API autoriza el repertorio del PJ y calcula el recurso de la modalidad',async t=>{
 const db=openDatabase(':memory:');grant(db,'Virtud Anima');const p=character(db,1),trick=p.componentes.trucos.find(t=>t.nombre==='Detectar Magia');
 const server=makeServer(db);await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(async()=>{await new Promise(r=>server.close(r));db.close();});
 const fetch=fixtureFetch(db),url=`http://127.0.0.1:${server.address().port}/api/personajes/1/trucos`;
 const post=body=>fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 let r=await post({truco_id:trick.id,opcion:'mana',coste_recurso:0,recurso:'Gratis'});assert.equal(r.status,200);assert.equal((await r.json()).mana_consumido,1);
 r=await post({truco_id:trick.id,opcion:'stamina'});assert.equal(r.status,200);assert.equal((await r.json()).stamina_gastada,1);
 const foreign=one(db,"SELECT id FROM trucos WHERE nombre='Ignición'");r=await post({truco_id:foreign.id});assert.equal(r.status,400);
 r=await post({truco_id:trick.id,opcion:'mana',unidades:-1});assert.equal(r.status,400);assert.equal(character(db,1).mana_consumido,1);
});
test('las seis elecciones del creador conceden el repertorio inicial gratis',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),attrs=c.skills.filter(s=>s.tipo==='Atributo').sort((a,b)=>ATTRIBUTE_ORDER.indexOf(a.nombre)-ATTRIBUTE_ORDER.indexOf(b.nombre));
  for(const e of initialEpiphanies){
   const b={nombre:'Prueba '+e.nombre,clase_id:c.clases.find(p=>p.nombre==='Senda del Arcanista').id,linaje_id:c.linajes.find(l=>l.codigo==='hijos_del_sol').id,dedicacion_id:c.dedicaciones[0].id,nacimiento_id:c.nacimientos[0].id,atributos:Object.fromEntries(attrs.map((a,i)=>[a.id,FIXED_VALUES[i]])),pools:{}};
   c.skills.filter(s=>s.tipo==='Habilidad'&&s.combate).slice(0,4).forEach((s,i)=>b.pools[s.id]=[20,15,10,5][i]);c.skills.filter(s=>s.tipo==='Habilidad'&&!s.combate).slice(0,3).forEach((s,i)=>b.pools[s.id]=[20,20,10][i]);
   b.elecciones_rasgos=Object.fromEntries(initialTraitChoices(c,b).map(q=>[q.codigo,(q.tipo==='Epifania'?q.opciones.find(o=>o.nombre===e.nombre):q.opciones.find(o=>!o.bloqueada)).id]));
   const p=transaction(db,()=>createCharacter(db,b));assert.equal(p.xp_gastada,0);assert.equal(p.componentes.efectos.length,2);assert.equal(p.componentes.trucos.length,1);assert.equal(p.componentes.misticas.length,1);
  }
 }finally{db.close();}
});
