import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {mkdtempSync,copyFileSync,readdirSync,unlinkSync,rmdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {openDatabase,catalogue,createCharacter,character,transaction} from './server.mjs';
import {FIXED_VALUES,ATTRIBUTE_ORDER} from '../js/creation-rules.js';
import {lineageBonuses} from '../js/lineage-rules.js';
import {professionGuarantees} from '../js/profession-rules.js';
import {originTraits} from '../js/trait-rules.js';

function payload(c){
 const attrs=c.skills.filter(s=>s.tipo==='Atributo').sort((a,b)=>ATTRIBUTE_ORDER.indexOf(a.nombre)-ATTRIBUTE_ORDER.indexOf(b.nombre));
 const b={nombre:'Origen conservado',linaje_id:c.linajes.find(l=>l.codigo==='hijos_del_sol').id,dedicacion_id:c.dedicaciones.find(d=>d.nombre==='Artesano').id,profesion_id:c.profesiones.find(p=>p.nombre==='Herrería').id,nacimiento_id:c.nacimientos[0].id,clase_id:c.clases[0].id,atributos:Object.fromEntries(attrs.map((a,i)=>[a.id,FIXED_VALUES[i]])),pools:{}};
 c.skills.filter(s=>s.tipo==='Habilidad'&&s.combate).slice(0,4).forEach((s,i)=>b.pools[s.id]=[20,15,10,5][i]);c.skills.filter(s=>s.tipo==='Habilidad'&&!s.combate).slice(0,3).forEach((s,i)=>b.pools[s.id]=[20,20,10][i]);return b;
}

test('los orígenes conceden Rasgos sin adquisiciones ni coste y sólo el oficio elegido',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),b=payload(c),p=transaction(db,()=>createCharacter(db,b)),origins=originTraits(c,b);
  assert.equal(p.xp_gastada,0);assert.equal(c.linajes_dotes.length,0);
  for(const r of origins){assert.equal(p.rasgos.filter(t=>t.id===r.id).length,1);assert(p.rasgos.find(t=>t.id===r.id).origenes.length);}
  assert(!p.adquisiciones.some(a=>a.elemento?.rasgo_origen_id));
  const professions=p.rasgos.filter(r=>r.origenes.includes('Oficio'));assert.deepEqual(professions.map(r=>r.nombre),['Oficio aprendido: Herrería']);
  const birth=p.rasgos.find(r=>r.origenes.includes('Nacimiento'));assert.equal(birth.modificadores.length,0);
 }finally{db.close();}
});

test('los valores de creación se leen del Rasgo y no se duplican con tablas heredadas',()=>{
 const db=openDatabase(':memory:');try{
  let c=catalogue(db);const b=payload(c),bonus=c.linajes_skills.find(r=>r.linaje_id===b.linaje_id),soldier=c.dedicaciones.find(d=>d.nombre==='Soldado'),floor=c.dedicaciones_skills.find(g=>g.dedicacion_id===soldier.id);
  db.prepare("UPDATE rasgos_modificadores SET valor=7 WHERE rasgo_id=? AND skill_id=? AND tipo='BonoSkill'").run(bonus.rasgo_id,bonus.skill_id);
  db.prepare("UPDATE rasgos_modificadores SET valor=37 WHERE rasgo_id=? AND skill_id=? AND tipo='MinimoSkill'").run(floor.rasgo_id,floor.skill_id);
  c=catalogue(db);assert.equal(lineageBonuses(c,b).find(r=>r.skill_id===bonus.skill_id).bono,7);assert.equal(lineageBonuses(c,b).reduce((n,r)=>n+r.bono,0),22);
  assert.equal(professionGuarantees(c,{...b,dedicacion_id:soldier.id,profesion_id:undefined})[0].minimo,37);
  const p=transaction(db,()=>createCharacter(db,b)),again=character(db,p.id);assert.deepEqual(p.skills,again.skills);
  const detail=p.creacion_skills.find(s=>s.skill_id===bonus.skill_id);assert.equal(detail.linaje,7);
 }finally{db.close();}
});

test('la migración desde v14 conserva skills, XP, historial y objetos; deduplica concesiones previas',()=>{
 const dir=mkdtempSync(join(tmpdir(),'gideon-origin-traits-')),file=join(dir,'test.db');let db;
 try{
  db=openDatabase(file);db.close();copyFileSync(file+'.before-origin-traits.bak',file);
  db=new DatabaseSync(file);db.exec('PRAGMA foreign_keys=ON');
  const c=catalogue(db),p=transaction(db,()=>createCharacter(db,payload(c)));assert(!p.adquisiciones.some(a=>a.elemento?.solo_concesion_inicial));
  const tables=['personajes','personajes_skills','progresion','inventario','personajes_profesiones','personajes_creacion_skills','xp_concesiones'];
  const columns=Object.fromEntries(tables.map(t=>[t,db.prepare(`PRAGMA table_info(${t})`).all().map(c=>c.name).join(',')]));const snapshot=()=>Object.fromEntries(tables.map(t=>[t,db.prepare(`SELECT ${columns[t]} FROM ${t} ORDER BY rowid`).all()]));
  const before=snapshot(),defenses=p.equipo.defensas,solar=p.rasgos.find(r=>r.nombre==='Brillo Solar').id;
  db.close();db=openDatabase(file);assert.deepEqual(snapshot(),before);
  const after=character(db,p.id);assert.deepEqual(after.skills,p.skills);assert.deepEqual(after.equipo.defensas,defenses);assert.equal(after.xp_total,p.xp_total);assert.equal(after.rasgos.filter(r=>r.id===solar).length,1);assert(after.acciones.find(a=>a.nombre==='Brillo Solar').usable_linaje);
  db.close();db=openDatabase(file);assert.deepEqual(snapshot(),before);assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
 }finally{db?.close();for(const f of readdirSync(dir))unlinkSync(join(dir,f));rmdirSync(dir);}
});
