import {fixtureFetch,TEST_CATALOGUE_TOKEN} from './http-fixture.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {mkdtempSync,copyFileSync,readdirSync,unlinkSync,rmdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {openDatabase,catalogue,character,transaction,addProgress,makeServer} from './server.mjs';
import {createTrait} from './traits.mjs';
import {linkPathTrait} from './path-traits.mjs';
import {addInventory} from './equipment.mjs';
import {pathTraitsSheet} from '../js/path-ui.js';

const insert=(db,sql,...args)=>Number(db.prepare(sql).run(...args).lastInsertRowid);
const currentXP=p=>p.pools.find(x=>x.clase_id===p.sendas[0].id)?.xp_invertida??0;
function advanced(db,required=11){
 const p=character(db,1),skill=p.skills.find(s=>s.nombre==='Coraje');
 const action=insert(db,"INSERT INTO acciones(nombre,tipo,descripcion) VALUES('Acción de progresión de prueba','Rasgo','Sólo prueba')");
 const rid=createTrait(db,{nombre:'Rasgo avanzado de prueba',descripcion:'Sólo prueba del requisito',modificadores:[{tipo:'BonoSkill',skill_id:skill.id,valor:4},{tipo:'Mitigacion',objetivo:'Frío',valor:2}],acciones:[action]});
 return {...linkPathTrait(db,{clase_id:p.sendas[0].id,rasgo_id:rid,xp_requerida:required}),action,skill:skill.id};
}

test('Rasgos de Senda: definición única, requisito explícito 0 y concesión sin compras',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),p=character(db,1);assert.equal(c.clases_rasgos.length,19);
  for(const r of c.clases_rasgos){assert.equal(r.xp_requerida===0,Boolean(r.es_insignia));assert(c.rasgos.some(t=>t.id===r.rasgo_id&&t.tipo==='Capacidad'));}
  assert(p.rasgos_senda.every(r=>r.activo&&r.requisito_cumplido&&r.obtenido));
  assert(p.rasgos_senda.every(r=>p.rasgos.some(t=>t.id===r.rasgo_id&&t.sendas.some(s=>s.clase_id===r.clase_id))));
  assert(pathTraitsSheet(p).includes('0 XP requeridas'));assert(!pathTraitsSheet(p).includes('data-obtain-path-trait'));
 }finally{db.close();}
});

test('el umbral usa XP dedicada de dotes y objetos; no global ni de otra Senda, sin pagar otra vez',()=>{
 const db=openDatabase(':memory:');try{
  let p=character(db,1);const base=currentXP(p),r=advanced(db),other=catalogue(db).clases.find(c=>c.id!==p.sendas[0].id);
  db.prepare('UPDATE personajes SET xp_total=1000 WHERE id=1').run();db.prepare('INSERT INTO personajes_clases(personaje_id,clase_id) VALUES(?,?)').run(1,other.id);
  const foreign=insert(db,"INSERT INTO dotes(nombre,descripcion,clase_id,costo_xp) VALUES('Otra Senda prueba','Prueba',?,3)",other.id);
  p=addProgress(db,1,{tipo:'Adquisicion',dote_id:foreign});assert.equal(currentXP(p),base);assert(p.pools.some(x=>x.clase_id===other.id&&x.xp_invertida===3));
  const general=insert(db,"INSERT INTO dotes(nombre,descripcion,costo_xp) VALUES('General prueba','Prueba',3)");
  p=addProgress(db,1,{tipo:'Adquisicion',dote_id:general});assert.equal(currentXP(p),base);
  assert(!p.rasgos.some(t=>t.id===r.rasgo_id));assert(!p.acciones.some(a=>a.id===r.action));
  assert.throws(()=>db.prepare('INSERT INTO personajes_clases_rasgos VALUES(?,?)').run(1,r.id),/XP dedicada/);
  const own=insert(db,"INSERT INTO dotes(nombre,descripcion,clase_id,costo_xp) VALUES('Propio prueba','Prueba',?,2)",p.sendas[0].id);
  p=addProgress(db,1,{tipo:'Adquisicion',dote_id:own});assert.equal(currentXP(p),base+2);
  const item=insert(db,"INSERT INTO items_magicos(nombre,descripcion,clase_id,costo_xp_sintonia,permite_inversion_adicional) VALUES('Objeto de Senda prueba','Prueba',?,1,1)",p.sendas[0].id);
  const instance=addInventory(db,1,{item_magico_id:item});p=addProgress(db,1,{tipo:'Adquisicion',item_id:instance});
  const before={spent:p.xp_gastada,available:p.xp_disponible,history:p.historial.length,skill:p.skills.find(s=>s.id===r.skill).valor};
  p=addProgress(db,1,{tipo:'Inversion',item_id:instance,xp_gastada:2});
  assert.equal(currentXP(p),11);assert(p.rasgos_senda.find(t=>t.id===r.id).obtenido);assert(p.rasgos.some(t=>t.id===r.rasgo_id));
  assert.equal(p.xp_gastada,before.spent+2);assert.equal(p.xp_disponible,before.available-2);assert.equal(p.historial.length,before.history+1);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM personajes_clases_rasgos WHERE personaje_id=1').get().n,0);
  assert.equal(p.skills.find(s=>s.id===r.skill).valor,before.skill+4);assert.equal(p.acciones.filter(a=>a.id===r.action).length,1);assert.equal(p.equipo.defensas.filter(d=>d.tipo_dano==='Frío').reduce((n,d)=>n+d.valor,0),2);
  assert.deepEqual(character(db,1).skills,p.skills);assert(!pathTraitsSheet(p).includes('data-obtain-path-trait'));
  p=addProgress(db,1,{tipo:'Retiro',item_id:instance});assert.equal(currentXP(p),11);assert(p.rasgos_senda.find(t=>t.id===r.id).activo);
 }finally{db.close();}
});

test('API y SQLite validan Senda, umbral, referencias y pertenencia al obtener Rasgos',async t=>{
 const db=openDatabase(':memory:'),server=makeServer(db,{catalogueToken:TEST_CATALOGUE_TOKEN});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(async()=>{await new Promise(r=>server.close(r));db.close();});
 const fetch=fixtureFetch(db);
 const request=async(path,body)=>{const response=await fetch(`http://127.0.0.1:${server.address().port}/api/${path}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});return {status:response.status,body:await response.json()};};
 const p=character(db,1),rid=createTrait(db,{nombre:'Definición reutilizable de prueba',descripcion:'Prueba'}),own=p.sendas[0].id,other=catalogue(db).clases.find(c=>c.id!==own).id;
 for(const body of [{clase_id:own,rasgo_id:rid},{clase_id:own,rasgo_id:rid,xp_requerida:-1},{clase_id:own,rasgo_id:rid,xp_requerida:1.5},{clase_id:99999,rasgo_id:rid,xp_requerida:0},{clase_id:own,rasgo_id:99999,xp_requerida:0},{clase_id:own,rasgo_id:rid,xp_requerida:4,inicial:true}])assert.equal((await request('catalogo/rasgos-senda',body)).status,400);
 const initial=await request('catalogo/rasgos-senda',{clase_id:own,rasgo_id:rid,xp_requerida:0});assert.equal(initial.status,201);assert(character(db,1).rasgos.some(r=>r.id===rid));
 const outside=await request('catalogo/rasgos-senda',{clase_id:other,rasgo_id:rid,xp_requerida:0});assert.equal(outside.status,201);assert(!character(db,1).rasgos_senda.some(r=>r.id===outside.body.vinculo.id));
 const a=advanced(db,7);assert(!character(db,1).rasgos_senda.find(r=>r.id===a.id).obtenido);
 db.prepare('UPDATE personajes SET xp_total=100 WHERE id=1').run();const vm=p.adquisiciones.find(a=>a.elemento?.nombre==='Vigoris Mortis');addProgress(db,1,{tipo:'Inversion',dote_id:vm.dote_id,xp_gastada:1});
 assert(character(db,1).rasgos_senda.find(r=>r.id===a.id).activo);
 assert.equal((await request('personajes/1/rasgos-senda',{clase_rasgo_id:a.id})).status,404);
 assert.throws(()=>db.prepare('UPDATE clases_rasgos SET xp_clase_requerida=-1 WHERE id=?').run(a.id),/umbral/);assert.throws(()=>db.prepare('UPDATE clases_rasgos SET rasgo_id=NULL WHERE id=?').run(a.id),/capacidad/);
 assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
});

test('migración v15 conserva fichas e historial y migra acciones al Rasgo canónico',()=>{
 const dir=mkdtempSync(join(tmpdir(),'gideon-path-traits-')),file=join(dir,'test.db');let db;
 try{
  db=openDatabase(file);db.close();copyFileSync(file+'.before-path-traits.bak',file);db=new DatabaseSync(file);db.exec('PRAGMA foreign_keys=ON');
  const old=character(db,1),r=old.rasgos_clase[0],action=insert(db,"INSERT INTO acciones(nombre,tipo,descripcion) VALUES('Acción heredada de Senda','Senda','Prueba')");
  db.prepare('INSERT INTO clases_rasgos_acciones VALUES(?,?)').run(r.id,action);
  const tables=['personajes','personajes_skills','progresion','inventario','personajes_clases_rasgos','personajes_clases'];
  const columns=Object.fromEntries(tables.map(t=>[t,db.prepare(`PRAGMA table_info(${t})`).all().map(c=>c.name).join(',')]));const snapshot=()=>Object.fromEntries(tables.map(t=>[t,db.prepare(`SELECT ${columns[t]} FROM ${t} ORDER BY rowid`).all()]));const before=snapshot();db.close();db=openDatabase(file);
  assert.deepEqual(snapshot(),before);const p=character(db,1);
  const skillValues=skills=>skills.map(({descripcion,...values})=>values);
  assert.deepEqual(skillValues(p.skills),skillValues(old.skills));
  assert.match(p.skills.find(s=>s.nombre==='Fuerza').descripcion,/Capacidad bruta/);
  assert.equal(p.xp_total,old.xp_total);assert.deepEqual(p.pools,old.pools);assert.equal(p.acciones.filter(a=>a.id===action).length,1);
  db.close();db=openDatabase(file);assert.deepEqual(snapshot(),before);assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');
 }finally{db?.close();for(const f of readdirSync(dir))unlinkSync(join(dir,f));rmdirSync(dir);}
});
