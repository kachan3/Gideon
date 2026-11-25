import test from 'node:test';
import assert from 'node:assert/strict';
import {openDatabase,catalogue,createCharacter,character,transaction} from './server.mjs';
import {ensureOrders,orderCatalogue,validateOrderCreation,recordOrderCreation,saveOath,oathState} from './orders.mjs';
import {FIXED_VALUES,ATTRIBUTE_ORDER} from '../js/creation-rules.js';
import {creationOrders,ordersSheet} from '../js/orders-ui.js';

function draft(c,order='dragon-valeroso'){
 const attrs=c.skills.filter(s=>s.tipo==='Atributo').sort((a,b)=>ATTRIBUTE_ORDER.indexOf(a.nombre)-ATTRIBUTE_ORDER.indexOf(b.nombre));
 const b={nombre:'Caballero de prueba',clase_id:c.ordenes_y_juramento.clase_honor_id,linaje_id:c.linajes.find(l=>l.codigo==='hijos_del_sol').id,
  dedicacion_id:c.dedicaciones[0].id,nacimiento_id:c.nacimientos[0].id,atributos:Object.fromEntries(attrs.map((a,i)=>[a.id,FIXED_VALUES[i]])),pools:{},orden:order};
 c.skills.filter(s=>s.tipo==='Habilidad'&&s.combate).slice(0,4).forEach((s,i)=>b.pools[s.id]=[20,15,10,5][i]);
 c.skills.filter(s=>s.tipo==='Habilidad'&&!s.combate).slice(0,3).forEach((s,i)=>b.pools[s.id]=[20,20,10][i]);
 if(order!=='tolfan')b.combo_orden_id=c.ordenes_y_juramento.combos[0].id;
 return b;
}
test('Orders are an independent creation choice; all four Honor options grant their free starting benefits',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db);assert.equal(c.ordenes_y_juramento.combos.length,5);
  for(const [code,expected] of [['dragon-valeroso',50],['leones-de-pircar',60],['tolfan',55],['herrante',null]]){
   const b=draft(c,code),p=transaction(db,()=>createCharacter(db,b));
   assert.equal(p.orden.orden_codigo,code);assert.equal(p.xp_gastada,0);
   if(expected!==null)assert.equal(p.honor_puntos,expected);else{assert(p.honor_puntos>=35&&p.honor_puntos<=60);assert.equal(p.orden.dados.length,5);}
   assert.equal(p.skills.find(s=>s.nombre==='Honor').valor,p.honor_puntos);
   assert(p.adquisiciones.some(a=>a.elemento?.nombre==='Entrenado en Armadura Pesada'));
   assert(p.adquisiciones.some(a=>a.elemento?.nombre===(code==='tolfan'?'Luchador de Escudo':c.ordenes_y_juramento.combos[0].nombre)));
   assert(ordersSheet(p).includes(p.orden.nombre));assert(creationOrders(c,b).includes('data-order-segment'));
  }
  const b=draft(c);delete b.orden;assert.throws(()=>validateOrderCreation(db,b),/Elegí una Orden/);
  b.orden='dragon-valeroso';b.combo_orden_id=999999;assert.throws(()=>validateOrderCreation(db,b),/Combo/);
 }finally{db.close();}
});
test('Only followers of Honor can join a knightly Order; other Sendas have no order step or rewards',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),b=draft(c);b.clase_id=c.clases.find(p=>p.nombre==='Senda del Berserker').id;delete b.combo_orden_id;
  assert.throws(()=>validateOrderCreation(db,b),/requieren la Senda del Honor/);
  assert.equal(creationOrders(c,b),'');
  delete b.orden;const p=transaction(db,()=>createCharacter(db,b));
  assert.equal(p.orden,null);assert.equal(p.juramento,null);
  assert(!p.skills.some(s=>s.nombre==='Honor'));assert(!p.adquisiciones.some(a=>a.origen.startsWith('Orden:')));
 }finally{db.close();}
});
test('Oath preparation persists; effects unlock only with XP in Honor feats and active choices cannot be replaced',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),b=draft(c);b.juramento=Object.fromEntries(c.ordenes_y_juramento.posiciones.map(p=>[p.codigo,p.opciones[0].codigo]));
  const p=transaction(db,()=>createCharacter(db,b));let oath=oathState(db,p.id);
  assert.equal(oath.texto,'');assert(oath.posiciones.every(p=>p.seleccion&&!p.desbloqueada));
  const skill=c.skills.find(s=>s.nombre==='Coraje').id;
  db.prepare("INSERT INTO progresion(personaje_id,change,tipo,skill_id,valor,xp_gastada,clase_id) VALUES(?,'Add','Skill',?,1,25,?)").run(p.id,skill,b.clase_id);
  assert.equal(oathState(db,p.id).texto,'');
  const feat=Number(db.prepare("INSERT INTO dotes(nombre,tipo,clase_id,costo_xp,descripcion) VALUES('Honor de prueba','Senda',?,5,'Prueba')").run(b.clase_id).lastInsertRowid);
  db.prepare("INSERT INTO progresion(personaje_id,change,tipo,dote_id,xp_gastada,clase_id) VALUES(?,'Add','Adquisicion',?,5,?)").run(p.id,feat,b.clase_id);
  oath=oathState(db,p.id);assert(oath.posiciones[0].desbloqueada);assert(oath.posiciones.slice(1).every(p=>!p.desbloqueada));assert.match(oath.texto,/Juro por mi vida/);
  assert.throws(()=>saveOath(db,p.id,{...b.juramento,apertura:c.ordenes_y_juramento.posiciones[0].opciones[1].codigo}),/activa/);
  const changed={...b.juramento,remate:c.ordenes_y_juramento.posiciones[4].opciones[1].codigo};transaction(db,()=>saveOath(db,p.id,changed));
  assert.equal(oathState(db,p.id).posiciones[4].seleccion,changed.remate);
  assert.throws(()=>saveOath(db,p.id,{intruso:'falso'}),/inválida/);
 }finally{db.close();}
});
test('Legacy migration preserves stored sheets and does not assign an order or roll Honor retroactively',()=>{
 const db=openDatabase(':memory:');try{
  const before=JSON.stringify(db.prepare('SELECT * FROM personajes').all());
  db.exec('DROP TABLE personajes_juramento; DROP TABLE personajes_ordenes; DELETE FROM schema_migrations WHERE version=41');
  ensureOrders(db);ensureOrders(db);
  assert.equal(JSON.stringify(db.prepare('SELECT * FROM personajes').all()),before);
  assert.equal(db.prepare('SELECT count(*) n FROM personajes_ordenes').get().n,0);
  assert.equal(db.prepare('SELECT MAX(version) n FROM schema_migrations').get().n,41);
  assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(),[]);
 }finally{db.close();}
});
