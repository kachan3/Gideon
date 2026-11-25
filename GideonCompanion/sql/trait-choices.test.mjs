import test from 'node:test';
import assert from 'node:assert/strict';
import {openDatabase,catalogue,createCharacter,character,transaction,addProgress} from './server.mjs';
import {recordTraitChoice} from './trait-choices.mjs';
import {initialTraitChoices,creationTraitChoices,validateInitialTraitChoices} from '../js/trait-choices-ui.js';
import {gearTable} from '../js/gear-market.js';
import {assignGear,purchase} from './market.mjs';
import {ATTRIBUTE_ORDER,FIXED_VALUES,creationSkills} from '../js/creation-rules.js';
import {skillRoll} from './magic.mjs';
function draft(c,path){
 const attrs=c.skills.filter(s=>s.tipo==='Atributo').sort((a,b)=>ATTRIBUTE_ORDER.indexOf(a.nombre)-ATTRIBUTE_ORDER.indexOf(b.nombre));
 const b={nombre:'Prueba elecciones',clase_id:c.clases.find(p=>p.nombre===path).id,linaje_id:c.linajes.find(l=>l.codigo==='hijos_del_sol').id,dedicacion_id:c.dedicaciones[0].id,nacimiento_id:c.nacimientos[0].id,atributos:Object.fromEntries(attrs.map((a,i)=>[a.id,FIXED_VALUES[i]])),pools:{}};
 c.skills.filter(s=>s.tipo==='Habilidad'&&s.combate).slice(0,4).forEach((s,i)=>b.pools[s.id]=[20,15,10,5][i]);c.skills.filter(s=>s.tipo==='Habilidad'&&!s.combate).slice(0,3).forEach((s,i)=>b.pools[s.id]=[20,20,10][i]);return b;
}
function answer(c,b){b.elecciones_rasgos=Object.fromEntries(initialTraitChoices(c,b).map(e=>[e.codigo,e.opciones.find(o=>!o.bloqueada).id]));return b;}
const save=(db,id,codigo,valor)=>transaction(db,()=>recordTraitChoice(db,character(db,id),{codigo,valor},v=>db.prepare('INSERT INTO progresion(personaje_id,tipo,dote_id,epifania_id,origen) VALUES(?,?,?,?,?)').run(id,v.tipo,v.dote_id??null,v.epifania_id??null,v.origen)));

test('Arcanista exige las tres elecciones, guarda valores y concede la Epifanía sin gasto',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),b=draft(c,'Senda del Arcanista');assert.deepEqual(initialTraitChoices(c,b).map(e=>e.codigo).sort(),['artefacto','epifania','herramienta']);
  assert.throws(()=>validateInitialTraitChoices(c,b),/Elegí/);assert.match(creationTraitChoices(c,b),/name="rasgo_herramienta" required/);
  const count=db.prepare('SELECT COUNT(*) n FROM personajes').get().n;
  assert.throws(()=>transaction(db,()=>createCharacter(db,{...b,elecciones_rasgos:{}})),/Elegí/);assert.equal(db.prepare('SELECT COUNT(*) n FROM personajes').get().n,count);
  answer(c,b);const p=transaction(db,()=>createCharacter(db,b));assert.equal(p.xp_gastada,0);assert(p.componentes.efectos.length);assert(p.adquisiciones.some(a=>a.epifania_id===b.elecciones_rasgos.epifania));
  for(const e of character(db,p.id).elecciones_rasgos)assert.equal(e.valor,b.elecciones_rasgos[e.codigo]);
  const before=p.adquisiciones.length;save(db,p.id,'epifania',b.elecciones_rasgos.epifania);assert.equal(character(db,p.id).adquisiciones.length,before);
  assert.throws(()=>save(db,p.id,'herramienta','Inventada'),/registrada/);
  const other=transaction(db,()=>createCharacter(db,draft(c,'Senda del Berserker')));assert.throws(()=>save(db,other.id,'herramienta','Libro'),/disponible/);
  assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
 }finally{db.close();}
});
test('Entrenamiento Superior sólo admite Marcial disponible y no duplica su concesión',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),b=answer(c,draft(c,'Senda del Valor'));assert.deepEqual(Object.keys(b.elecciones_rasgos),['entrenamiento_superior']);validateInitialTraitChoices(c,b);
  const p=transaction(db,()=>createCharacter(db,b)),id=b.elecciones_rasgos.entrenamiento_superior;assert(p.adquisiciones.some(a=>a.dote_id===id));assert.equal(p.xp_gastada,0);save(db,p.id,'entrenamiento_superior',id);assert.equal(character(db,p.id).adquisiciones.filter(a=>a.dote_id===id).length,1);
  const invalid={...b,elecciones_rasgos:{entrenamiento_superior:c.dotes.find(d=>d.nombre==='Lanzador de Conjuros').id}};assert.throws(()=>transaction(db,()=>createCharacter(db,invalid)),/Dote Marcial/);
 }finally{db.close();}
});
test('As se gana con XP en Dotes Valor, valida 80%, límite 5 y aplica NE sólo al éxito',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),p=transaction(db,()=>createCharacter(db,answer(c,draft(c,'Senda del Valor'))));
  let ace=()=>character(db,p.id).elecciones_rasgos.find(e=>e.tipo==='As');assert.equal(ace().puntos,0);assert.throws(()=>save(db,p.id,'as_marcial',[{skill_id:1,puntos:1}]),/80/);
  const skill=c.skills.find(s=>s.tipo==='Habilidad'&&s.combate&&c.skills.find(a=>a.id===s.padre_id)?.nombre==='Melee');
  db.prepare('UPDATE personajes_skills SET valor_base=80 WHERE personaje_id=? AND skill_id=?').run(p.id,skill.id);
  const tag=db.prepare("SELECT id FROM rasgos WHERE nombre='Valor'").get()?.id??Number(db.prepare("INSERT INTO rasgos(nombre,descripcion) VALUES('Valor','Etiqueta de prueba')").run().lastInsertRowid);
  const feat=Number(db.prepare("INSERT INTO dotes(nombre,descripcion,costo_xp) VALUES('Dote de prueba','Prueba',18)").run().lastInsertRowid);db.prepare('INSERT INTO dotes_tags VALUES(?,?)').run(feat,tag);
  db.prepare('UPDATE personajes SET xp_total=50 WHERE id=?').run(p.id);transaction(db,()=>addProgress(db,p.id,{tipo:'Adquisicion',dote_id:feat}));assert.equal(ace().puntos,6);
  assert.throws(()=>save(db,p.id,'as_marcial',[{skill_id:skill.id,puntos:6}]),/inválida/);save(db,p.id,'as_marcial',[{skill_id:skill.id,puntos:5}]);assert.equal(ace().asignados,5);assert.throws(()=>save(db,p.id,'as_marcial',[{skill_id:skill.id,puntos:4}]),/conservan/);
  const roll=d=>transaction(db,()=>skillRoll(db,character(db,p.id),{skill_id:skill.id},()=>d));assert.equal(roll(42).ne,9);assert.equal(roll(97).ne,0);
 }finally{db.close();}
});
test('equipo presenta ubicación, destinatario sólo como lugar y compras separadas',()=>{
 const db=openDatabase(':memory:');try{
  const p=character(db,1),i=p.equipo.inventario[0];assignGear(db,p.id,i.id,{ubicacion:'Transferir',destinatario:'Mula'});
  const html=gearTable(character(db,p.id).equipo.inventario);assert.match(html,/Mula/);assert(!html.includes('Destinatario'));assert(!html.includes('Transferir'));assert(!html.includes('Comprar'));assert.match(html,/Cambiar lugar/);
  const weapon=db.prepare('SELECT id FROM armas LIMIT 1').get().id;purchase(db,p.id,{tipo:'arma_id',id:weapon,nivel:1,solicitud:'separate-shop'});assert(character(db,p.id).equipo.pendientes>0);
 }finally{db.close();}
});
