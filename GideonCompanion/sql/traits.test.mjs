import {fixtureFetch,TEST_CATALOGUE_TOKEN} from './http-fixture.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {openDatabase,catalogue,character,createCharacter,transaction,makeServer,addProgress} from './server.mjs';
import {createTrait} from './traits.mjs';
import {lineageBonuses} from '../js/lineage-rules.js';
import {creationSkills,FIXED_VALUES,ATTRIBUTE_ORDER} from '../js/creation-rules.js';
import {creationTraitModifiers} from '../js/trait-rules.js';
import {professionGuarantees} from '../js/profession-rules.js';

function payload(c){
 const attrs=c.skills.filter(s=>s.tipo==='Atributo').sort((a,b)=>ATTRIBUTE_ORDER.indexOf(a.nombre)-ATTRIBUTE_ORDER.indexOf(b.nombre));
 const b={nombre:'Rasgos de prueba',linaje_id:c.linajes.find(l=>l.codigo==='hijos_del_sol').id,dedicacion_id:c.dedicaciones.find(d=>d.nombre==='Académico').id,nacimiento_id:c.nacimientos[0].id,clase_id:c.clases[0].id,atributos:Object.fromEntries(attrs.map((s,i)=>[s.id,FIXED_VALUES[i]])),pools:{}};
 c.skills.filter(s=>s.tipo==='Habilidad'&&s.combate).slice(0,4).forEach((s,i)=>b.pools[s.id]=[20,15,10,5][i]);c.skills.filter(s=>s.tipo==='Habilidad'&&!s.combate).slice(0,3).forEach((s,i)=>b.pools[s.id]=[20,20,10][i]);return b;
}
test('Rasgos mecánicos reutilizables: atributos heredados, habilidades, defensas y acciones sin acumular al leer',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),p=transaction(db,()=>createCharacter(db,payload(c))),strength=c.skills.find(s=>s.nombre==='Fuerza'),climb=c.skills.find(s=>s.nombre==='Escalar');
  const action=Number(db.prepare("INSERT INTO acciones(nombre,tipo,descripcion) VALUES('Acción de prueba de rasgo','Dote','Prueba')").run().lastInsertRowid);
  const id=transaction(db,()=>createTrait(db,{nombre:'Capacidad reutilizable',descripcion:'Prueba de modificadores',regla_texto:'Texto descriptivo; no se ejecuta.',modificadores:[{tipo:'BonoSkill',skill_id:strength.id,valor:5},{tipo:'BonoSkill',skill_id:climb.id,valor:2},{tipo:'Mitigacion',objetivo:'Fuego',valor:2},{tipo:'Debilidad',objetivo:'Frío',valor:2}],acciones:[action]}));
  db.prepare('INSERT INTO personajes_rasgos(personaje_id,rasgo_id) VALUES(?,?)').run(p.id,id);
  db.prepare('INSERT INTO linajes_rasgos VALUES(?,?)').run(p.linaje_id,id);
  const after=character(db,p.id),again=character(db,p.id),value=(p,id)=>p.skills.find(s=>s.id===id).valor;
  assert.equal(value(after,strength.id),value(p,strength.id)+5);assert.equal(value(after,climb.id),value(p,climb.id)+7);assert.deepEqual(after.skills,again.skills);
  assert.equal(after.rasgos.filter(r=>r.id===id).length,1);assert.equal(after.acciones.filter(a=>a.id===action).length,1);assert(!after.tags.some(t=>t.id===id));
  assert.equal(after.equipo.defensas.filter(d=>d.tipo_dano==='Fuego').reduce((n,d)=>n+d.valor,0),5);assert(after.equipo.defensas.some(d=>d.categoria==='Debilidad'&&d.tipo_dano==='Frío'));
  assert.equal(db.prepare('SELECT valor_base FROM personajes_skills WHERE personaje_id=? AND skill_id=?').get(p.id,strength.id).valor_base,value(p,strength.id));
  const json=JSON.parse(db.prepare('SELECT definicion_json FROM v_rasgos_definicion WHERE id=?').get(id).definicion_json);assert.equal(json.modificadores.length,4);assert.deepEqual(json.acciones,[action]);
 }finally{db.close();}
});
test('modificadores de creación desde nacimiento: vista previa, herencia, mínimos y techo coinciden con guardado',()=>{
 const db=openDatabase(':memory:');try{
  let c=catalogue(db);const b=payload(c),vitality=c.skills.find(s=>s.nombre==='Vitalidad'),stealth=c.skills.find(s=>s.nombre==='Sigilo');
  const id=transaction(db,()=>createTrait(db,{nombre:'Origen de prueba',descripcion:'Sólo prueba',modificadores:[{tipo:'BonoSkill',skill_id:vitality.id,valor:10,fase:'Creacion'},{tipo:'MinimoSkill',skill_id:stealth.id,valor:70,fase:'Creacion'}]}));
  db.prepare('INSERT INTO nacimientos_rasgos VALUES(?,?)').run(b.nacimiento_id,id);c=catalogue(db);
  const preview=creationSkills({skills:c.skills,atributos:b.atributos,pools:b.pools,bonos:lineageBonuses(c,b),garantias:professionGuarantees(c,b),minimos:creationTraitModifiers(c,b).garantias});
  const p=transaction(db,()=>createCharacter(db,b));for(const [sid,total] of Object.entries(preview.totals))assert.equal(p.skills.find(s=>s.id===Number(sid)).valor,total);
  assert.equal(p.skills.find(s=>s.id===vitality.id).valor,55);assert.equal(p.skills.find(s=>s.id===stealth.id).valor,70);assert(p.skills.every(s=>s.valor<=80));
 }finally{db.close();}
});
test('efectos antiguos migrados tienen una sola fuente activa y el pseudocódigo no se ejecuta',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),p=transaction(db,()=>createCharacter(db,payload(c))),feat=db.prepare("SELECT id FROM dotes WHERE nombre='Adaptación al fuego'").get();
  const rid=db.prepare('SELECT rasgo_id FROM dotes_rasgos WHERE dote_id=?').get(feat.id).rasgo_id;
  db.prepare("UPDATE rasgos_modificadores SET valor=4 WHERE rasgo_id=? AND tipo='Mitigacion'").run(rid);
  const after=character(db,p.id);assert.equal(after.equipo.defensas.filter(d=>d.tipo_dano==='Fuego').reduce((n,d)=>n+d.valor,0),4);
  const id=transaction(db,()=>createTrait(db,{nombre:'Texto no ejecutable',descripcion:'Manual',regla_texto:'throw new Error("no ejecutar")',modificadores:[]}));db.prepare('INSERT INTO personajes_rasgos(personaje_id,rasgo_id) VALUES(?,?)').run(p.id,id);assert(character(db,p.id).rasgos.some(r=>r.id===id));
 }finally{db.close();}
});
test('un Rasgo puede conceder una skill aún no registrada y su progreso no se pierde al releer',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),p=transaction(db,()=>createCharacter(db,payload(c))),sid=Number(db.prepare("INSERT INTO all_skills(codigo,nombre,tipo) VALUES('extra_prueba','Técnica de prueba','Extra')").run().lastInsertRowid);
  const trait=transaction(db,()=>createTrait(db,{nombre:'Conocimiento concedido',descripcion:'Prueba',modificadores:[{tipo:'BonoSkill',skill_id:sid,valor:50}]}));db.prepare('INSERT INTO personajes_rasgos(personaje_id,rasgo_id) VALUES(?,?)').run(p.id,trait);
  assert.equal(character(db,p.id).skills.find(s=>s.id===sid).valor,50);addProgress(db,p.id,{tipo:'Skill',skill_id:sid,valor:5,xp_gastada:0});assert.equal(character(db,p.id).skills.find(s=>s.id===sid).valor,55);
 }finally{db.close();}
});
test('un Rasgo de origen no concede XP adicional durante la creación',()=>{
 const db=openDatabase(':memory:');try{
  let c=catalogue(db);const b=payload(c),trait=transaction(db,()=>createTrait(db,{nombre:'XP de origen de prueba',descripcion:'Sólo prueba',modificadores:[{tipo:'XPInicial',objetivo:'xp',valor:2}]}));
  db.prepare('INSERT INTO nacimientos_rasgos VALUES(?,?)').run(b.nacimiento_id,trait);const p=transaction(db,()=>createCharacter(db,b));assert.equal(p.xp_total,1);assert.equal(character(db,p.id).xp_total,1);
 }finally{db.close();}
});
test('API de Rasgos valida tipos, referencias y etiquetas; rollback sin registros parciales',async t=>{
 const db=openDatabase(':memory:'),server=makeServer(db,{catalogueToken:TEST_CATALOGUE_TOKEN});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(async()=>{await new Promise(r=>server.close(r));db.close();});
 const fetch=fixtureFetch(db);
 const request=async body=>{const r=await fetch(`http://127.0.0.1:${server.address().port}/api/catalogo/rasgos`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});return {status:r.status,body:await r.json()};};
 const before=db.prepare('SELECT COUNT(*) n FROM rasgos').get().n;
 for(const definition of [{nombre:'Mal tipo',descripcion:'',modificadores:[{tipo:'Ejecutar',valor:1}]},{nombre:'Mal objetivo',descripcion:'',modificadores:[{tipo:'BonoSkill',skill_id:999999,valor:5}]},{nombre:'Etiqueta con efecto',descripcion:'',tipo:'Etiqueta',modificadores:[{tipo:'Mitigacion',objetivo:'Fuego',valor:1}]},{nombre:'Daño inválido',descripcion:'',modificadores:[{tipo:'Mitigacion',objetivo:'Veneno',valor:1}]},{nombre:'Acción inválida',descripcion:'',acciones:[999999]}])assert.equal((await request(definition)).status,400);
 assert.equal(db.prepare('SELECT COUNT(*) n FROM rasgos').get().n,before);
 const r=await request({nombre:'Rasgo válido',descripcion:'Protección',modificadores:[{tipo:'Mitigacion',objetivo:'Fuego',valor:1}]});assert.equal(r.status,201);assert.equal(r.body.rasgo.modificadores[0].valor,1);
 assert.throws(()=>db.prepare("UPDATE rasgos SET tipo='Etiqueta' WHERE id=?").run(r.body.rasgo.id),/no se convierte/);assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
});
