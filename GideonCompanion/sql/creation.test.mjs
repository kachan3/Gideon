import test from 'node:test';
import assert from 'node:assert/strict';
import {FIXED_VALUES,remainingValues,sameValues,qualifiesForMulligan,rollValues,ATTRIBUTE_ORDER,creationSkills} from '../js/creation-rules.js';
import {openDatabase,catalogue,createCharacter,creationRoll,transaction} from './server.mjs';

test('arreglo fijo: reservas por copia, liberación y valores repetidos permitidos',()=>{
 assert(!remainingValues(FIXED_VALUES,{a:50}).includes(50));
 assert(remainingValues(FIXED_VALUES,{a:50},'a').includes(50));
 assert.equal(remainingValues(FIXED_VALUES,{a:30,b:30}).filter(v=>v===30).length,1);
 assert(!remainingValues(FIXED_VALUES,{a:30,b:30,c:30}).includes(30));
 assert.equal(remainingValues(FIXED_VALUES,{a:20}).filter(v=>v===20).length,1);
 assert(!remainingValues(FIXED_VALUES,{a:20,b:20}).includes(20));
 assert(sameValues(FIXED_VALUES,[...FIXED_VALUES].reverse()));
 assert(!sameValues(FIXED_VALUES,[50,50,40,35,30,30,30,20,20,15]));
});
test('Mulligan exige las tres condiciones simultáneas y los límites son estrictos',()=>{
 assert(qualifiesForMulligan([15,15,15,15,40,40,40,40,40,40]));
 assert(!qualifiesForMulligan([15,15,15,15,45,45,40,40,40,40]));
 assert(!qualifiesForMulligan([15,15,15,20,40,40,40,40,40,40]));
 assert(!qualifiesForMulligan([15,15,15,15,40,40,40,45,40,40]));
 assert.deepEqual(rollValues([[1,1,1],[4,4,4],[2,3,4]]),[15,60,45]);
});
function payload(db){const c=catalogue(db),attrs=c.skills.filter(s=>s.tipo==='Atributo').sort((a,b)=>ATTRIBUTE_ORDER.indexOf(a.nombre)-ATTRIBUTE_ORDER.indexOf(b.nombre));const b={nombre:'Generación de prueba',linaje_id:c.linajes[0].id,clase_id:c.clases[0].id,dedicacion_id:c.dedicaciones[0].id,nacimiento_id:c.nacimientos[0].id,atributos:Object.fromEntries(attrs.map((a,i)=>[a.id,FIXED_VALUES[i]])),pools:{}};c.skills.filter(s=>s.tipo==='Habilidad'&&s.combate).slice(0,4).forEach((s,i)=>b.pools[s.id]=[20,15,10,5][i]);c.skills.filter(s=>s.tipo==='Habilidad'&&!s.combate).slice(0,3).forEach((s,i)=>b.pools[s.id]=[20,20,10][i]);return {b,attrs};}
test('tiradas guardadas, repeticiones, orden estricto y Mulligan consumible',()=>{
 const db=openDatabase(':memory:');try{
  const free=creationRoll(db,{modo:'Libre'},()=>2);assert.deepEqual(free.valores,Array(10).fill(30));const reroll=creationRoll(db,{tirada_id:free.id,accion:'Repetir'},()=>4);assert.equal(reroll.historial.length,2);assert.deepEqual(reroll.valores,Array(10).fill(60));
  const strict=creationRoll(db,{modo:'Ordenado'},()=>3);assert.equal(strict.xp_inicial,2);assert.equal(strict.puede_mulligan,false);assert.throws(()=>creationRoll(db,{tirada_id:strict.id,accion:'Repetir'}),/estricto/);assert.throws(()=>creationRoll(db,{tirada_id:strict.id,accion:'Mulligan'}),/condiciones/);
  const {b,attrs}=payload(db);const ordered={...b,generacion_modo:'Ordenado',tirada_id:strict.id,atributos:Object.fromEntries(attrs.map(a=>[a.id,45]))};const p=transaction(db,()=>createCharacter(db,ordered));assert.equal(p.xp_total,2);assert.throws(()=>transaction(db,()=>createCharacter(db,ordered)),/utilizada/);
  const bad=creationRoll(db,{modo:'Ordenado'},()=>1);assert.equal(bad.puede_mulligan,true);const mulligan=creationRoll(db,{tirada_id:bad.id,accion:'Mulligan'});assert.equal(mulligan.modo,'Libre');assert.equal(mulligan.xp_inicial,1);assert.throws(()=>creationRoll(db,{tirada_id:bad.id,accion:'Mulligan'}),/condiciones/);
  const after=creationRoll(db,{tirada_id:bad.id,accion:'Repetir'},()=>2);assert.equal(after.puede_mulligan,false);assert.equal(after.mulligan_usado,true);const reassigned=transaction(db,()=>createCharacter(db,{...b,generacion_modo:'Libre',tirada_id:bad.id,atributos:Object.fromEntries(attrs.map(a=>[a.id,30]))}));assert.equal(reassigned.xp_total,1);
  assert.throws(()=>transaction(db,()=>createCharacter(db,{...b,generacion_modo:'Ordenado',atributos:Object.fromEntries(attrs.map(a=>[a.id,60]))})),/dados/);
  const saved=creationRoll(db,{modo:'Libre'},()=>1);assert.throws(()=>transaction(db,()=>createCharacter(db,{...b,generacion_modo:'Libre',tirada_id:saved.id})),/resultados/);
 }finally{db.close();}
});
test('creación aplica pisos gratuitos y Destacado al superar el mínimo con el pool',()=>{
 const db=openDatabase(':memory:');try{
  const {b,attrs}=payload(db),force=attrs.find(a=>a.nombre==='Fuerza'),child=catalogue(db).skills.find(s=>s.padre_id===force.id);
  db.prepare('DELETE FROM dedicaciones_skills WHERE dedicacion_id=?').run(b.dedicacion_id);
  db.prepare('DELETE FROM linajes_skills WHERE linaje_id=?').run(b.linaje_id);
  db.prepare('INSERT INTO dedicaciones_skills(dedicacion_id,skill_id,minimo,bono_destacado) VALUES(?,?,?,5)').run(b.dedicacion_id,child.id,50);
  const p=transaction(db,()=>createCharacter(db,b));assert.equal(p.skills.find(s=>s.id===child.id).valor,75);
 }finally{db.close();}
});

test('vista previa: herencia gratuita, mínimos, Destacado único, reversión y techo',()=>{
 const skills=[{id:1,nombre:'Agilidad',tipo:'Atributo'},{id:2,nombre:'Sigilo',tipo:'Habilidad',padre_id:1},{id:3,nombre:'Evasión',tipo:'Habilidad',padre_id:1}];
 const base={skills,atributos:{1:30},garantias:[],bonos:[]};
 let view=creationSkills(base);assert.equal(view.totals[2],30);assert.equal(view.totals[3],30);assert.equal(view.details[2].asignado,0);
 const guaranteed={...base,garantias:[{skill_id:2,minimo:40,bono_destacado:5}]};view=creationSkills(guaranteed);assert.equal(view.totals[2],40);assert.equal(view.details[2].piso,10);assert.equal(view.details[2].destacado,0);assert.equal(view.details[2].asignado,0);
 view=creationSkills({...guaranteed,pools:{2:11}});assert.equal(view.totals[2],46);assert.equal(view.details[2].asignado,11);assert.equal(view.details[2].destacado,5);
 view=creationSkills({...guaranteed,pools:{2:12}});assert.equal(view.totals[2],47);assert.equal(view.details[2].destacado,5);
 view=creationSkills({...guaranteed,pools:{2:0}});assert.equal(view.totals[2],40);assert.equal(view.details[2].destacado,0);
 view=creationSkills({...guaranteed,atributos:{1:50}});assert.equal(view.totals[2],55);assert.equal(view.details[2].asignado,0);
 view=creationSkills({...guaranteed,atributos:{1:70},bonos:[{skill_id:2,bono:5}],pools:{2:20}});assert.equal(view.totals[2],80);assert.equal(view.details[2].exceso,20);
 view=creationSkills({...base,garantias:[{skill_id:1,minimo:40,bono_destacado:5}]});assert.equal(view.totals[1],40);assert.equal(view.totals[2],40);assert.equal(view.totals[3],40);assert.equal(view.details[2].profesion,true);
});
