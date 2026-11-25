import {fixtureFetch,TEST_CATALOGUE_TOKEN} from './http-fixture.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,unlinkSync,rmdirSync,readdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {openDatabase,character,catalogue,createCharacter,transaction,addProgress,creationRoll,makeServer} from './server.mjs';
import {grantLineage,lineageContent} from './lineages.mjs';
import {creationSkills,FIXED_VALUES,ATTRIBUTE_ORDER} from '../js/creation-rules.js';
import {lineageBonuses} from '../js/lineage-rules.js';
import {lineageEditor,initialXP} from '../js/lineage-ui.js';
import {skillRoll} from './magic.mjs';
import {damagePreview} from '../js/combat-rules.js';

function payload(db,code){
 const c=catalogue(db),l=c.linajes.find(l=>l.codigo===code),attrs=c.skills.filter(s=>s.tipo==='Atributo').sort((a,b)=>ATTRIBUTE_ORDER.indexOf(a.nombre)-ATTRIBUTE_ORDER.indexOf(b.nombre));
 const b={nombre:'Prueba '+l.nombre,linaje_id:l.id,clase_id:c.clases[0].id,dedicacion_id:c.dedicaciones[0].id,nacimiento_id:c.nacimientos[0].id,atributos:Object.fromEntries(attrs.map((a,i)=>[a.id,FIXED_VALUES[i]])),pools:{},elecciones_linaje:{}};
 c.skills.filter(s=>s.tipo==='Habilidad'&&s.combate).slice(0,4).forEach((s,i)=>b.pools[s.id]=[20,15,10,5][i]);c.skills.filter(s=>s.tipo==='Habilidad'&&!s.combate).slice(0,3).forEach((s,i)=>b.pools[s.id]=[20,20,10][i]);
 for(const g of c.linajes_elecciones.filter(g=>g.linaje_id===l.id))b.elecciones_linaje[g.id]=c.linajes_elecciones_opciones.find(o=>o.eleccion_id===g.id).skill_id;
 return {c,l,b};
}

test('ocho linajes: 25 puntos, ninguna skill fantasma y vista previa idéntica al guardado',()=>{
 const db=openDatabase(':memory:');try{
  for(const line of lineageContent.linajes){
   const {c,l,b}=payload(db,line.codigo),bonos=lineageBonuses(c,b,{strict:true});
   assert.equal(bonos.reduce((n,b)=>n+b.bono,0),25);assert.equal(l.movimiento_terrestre,line.codigo==='hijos_del_viento'?8:6);
   assert(bonos.every(b=>c.skills.some(s=>s.id===b.skill_id&&s.tipo==='Habilidad'&&!/Placeholder/.test(s.nombre))));
   const combat=bonos.filter(b=>c.skills.find(s=>s.id===b.skill_id).combate);assert(combat.length<=1);assert(combat.every(b=>b.bono<=5));
   const preview=creationSkills({skills:c.skills,atributos:b.atributos,pools:b.pools,bonos,garantias:c.dedicaciones_skills.filter(g=>g.dedicacion_id===b.dedicacion_id)});
   const p=transaction(db,()=>createCharacter(db,b));
   for(const [id,value] of Object.entries(preview.totals))assert.equal(p.skills.find(s=>s.id===Number(id)).valor,value);
   for(const r of line.rasgos.filter(r=>r.efectos.length))assert.equal(p.rasgos.filter(t=>t.nombre===r.nombre&&t.origenes.includes('Linaje')).length,1);
   assert.equal(p.xp_gastada,0);
   assert.equal(p.xp_total,initialXP(c,b));assert.equal(p.creacion_skills.length,Object.keys(preview.details).length);
   assert(!p.dotes_disponibles.some(d=>d.solo_concesion_inicial));assert(p.tags.some(t=>t.nombre==='Dríade'));
   assert(!p.equipo.defensas.some(d=>d.categoria==='Debilidad'||d.categoria==='Resistencia'));
  }
 }finally{db.close();}
});

test('Tierra exige elección válida, no puede recibir dos bonos y el orden estricto concede 2 XP',()=>{
 const db=openDatabase(':memory:');try{
  const {c,b}=payload(db,'hijos_de_la_tierra'),gid=c.linajes_elecciones[0].id;
  assert.throws(()=>transaction(db,()=>createCharacter(db,{...b,elecciones_linaje:{}})),/Elige/);
  assert.throws(()=>transaction(db,()=>createCharacter(db,{...b,elecciones_linaje:{[gid]:c.skills.find(s=>s.nombre==='Sigilo').id}})),/no permitida/);
  assert.throws(()=>transaction(db,()=>createCharacter(db,{...b,elecciones_linaje:{...b.elecciones_linaje,99999:1}})),/no pertenece/);
  const roll=creationRoll(db,{modo:'Ordenado'},()=>2),attrs=c.skills.filter(s=>s.tipo==='Atributo');
  const p=transaction(db,()=>createCharacter(db,{...b,generacion_modo:'Ordenado',tirada_id:roll.id,atributos:Object.fromEntries(attrs.map(s=>[s.id,30]))}));
  assert.equal(p.xp_total,2);grantLineage(db,p.id);assert.equal(character(db,p.id).xp_total,2);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM xp_concesiones WHERE personaje_id=?').get(p.id).n,0);
  assert.throws(()=>db.prepare('INSERT INTO personajes_elecciones_linaje VALUES(?,?,?)').run(1,gid,b.elecciones_linaje[gid]),/no pertenece/);
 }finally{db.close();}
});

test('mitigaciones físicas y elementales se suman a Dureza y entran en el cálculo de daño',()=>{
 const db=openDatabase(':memory:');try{
  for(const [code,type,bonus] of [['hijos_del_sol','Fuego',3],['hijos_del_hielo','Frío',3],['seres_del_rio','Cortante',1],['seres_del_rio','Punzante',1],['seres_del_rio','Contundente',1]]){
   const {b}=payload(db,code),p=transaction(db,()=>createCharacter(db,b)),d=damagePreview(p,{cantidad:10,tipo_dano:type});
   assert.equal(d.mitigacion,p.derivados.dureza+bonus);assert.equal(d.heridas,Math.max(0,10-p.derivados.dureza-bonus));
  }
  assert(!catalogue(db).tipos_dano.includes('Veneno'));
 }finally{db.close();}
});

test('Temperamento Calmo aplica NE y Salvataje, respeta críticos/bandas y no altera valores de skills',()=>{
 const db=openDatabase(':memory:');try{
  const {c,b}=payload(db,'hijos_del_hielo'),p=transaction(db,()=>createCharacter(db,b));
  for(const name of ['Templanza','Enfoque','Coraje']){
   const skill=p.skills.find(s=>s.nombre===name),r=skillRoll(db,p,{skill_id:skill.id},()=>61);
   assert(r.exito);assert(r.salvado);assert.equal(r.ne,1);assert.equal(r.normal.ne,1);assert(r.indice.find(i=>i.circunstancia==='Normal').salvado);
   assert.equal(character(db,p.id).skills.find(s=>s.id===skill.id).valor,skill.valor);
   const failed=skillRoll(db,p,{skill_id:skill.id},()=>62);assert(!failed.exito);
   assert(!skillRoll(db,p,{skill_id:skill.id},()=>55).salvado);
   assert(!skillRoll(db,p,{skill_id:skill.id},()=>96).exito);
   assert.equal(skillRoll(db,p,{skill_id:skill.id},()=>20).ne,3);
  }
  assert(!skillRoll(db,p,{skill_id:c.skills.find(s=>s.nombre==='Tenacidad').id},()=>61).exito);
 }finally{db.close();}
});

test('capacidades de cada linaje, medallón opcional y restricciones de adquisición',()=>{
 const db=openDatabase(':memory:');try{
  for(const code of ['seres_del_rio','hijos_del_bosque','hijos_del_viento','hijos_de_las_estrellas','hijos_de_la_luna']){
   const {b}=payload(db,code),p=transaction(db,()=>createCharacter(db,b)),s=p.capacidades_linaje;
   if(code==='seres_del_rio'){assert.equal(s.nado,6);assert.equal(s.respiracion_acuatica_minutos,s.respiracion_minutos*2);assert(s.sin_gasto_aire_ataque_acuatico);}
   if(code==='hijos_del_bosque'){assert.equal(s.escalada_vegetal,6);assert(p.tags.some(t=>t.nombre==='Abdríade'));assert(s.veneno_driades.resistente);}
   if(code==='hijos_del_viento'){assert.equal(s.umbral_caida_unidades,4);assert.equal(s.dano_caida_multiplicador,0.5);}
   if(code==='hijos_de_las_estrellas'){assert.equal(s.iniciativa_escalones,1);db.prepare('UPDATE personajes SET heridas_mortales=1 WHERE id=?').run(p.id);assert.equal(character(db,p.id).capacidades_linaje.iniciativa_escalones,0);}
   if(code==='hijos_de_la_luna'){
    assert(s.vision_luz_residual);assert(p.inventario.some(i=>i.nombre==='Medallón de Moonstone'));
    const without=transaction(db,()=>createCharacter(db,{...b,regalo_moonstone:false}));assert(!without.inventario.some(i=>i.nombre==='Medallón de Moonstone'));
   }
   assert(!p.adquisiciones.some(a=>a.elemento?.solo_concesion_inicial));
   assert.equal(db.prepare('SELECT COUNT(*) n FROM dotes WHERE linaje_requerido_id=? AND rasgo_origen_id IS NOT NULL').get(p.linaje_id).n,0);
  }
  const {b}=payload(db,'hijos_de_la_tierra'),p=transaction(db,()=>createCharacter(db,b)),solar=db.prepare("SELECT id FROM dotes WHERE nombre='Brillo Solar'").get();
  assert.throws(()=>addProgress(db,p.id,{tipo:'Adquisicion',dote_id:solar.id}),/Linaje exclusivo/);
  const extra=Number(db.prepare("INSERT INTO dotes(nombre,descripcion,tipo,linaje_requerido_id,costo_xp) VALUES('Avanzado de prueba','Sólo prueba','Linaje',?,1)").run(p.linaje_id).lastInsertRowid);
  db.prepare('UPDATE personajes SET xp_total=1 WHERE id=?').run(p.id);
  assert.equal(addProgress(db,p.id,{tipo:'Adquisicion',dote_id:extra}).xp_gastada,1);
 }finally{db.close();}
});

test('migración persiste sin repetir concesiones, equipo ni XP al reabrir',()=>{
 const dir=mkdtempSync(join(tmpdir(),'gideon-lineages-')),file=join(dir,'test.db');let db;
 try{
  db=openDatabase(file);const {b}=payload(db,'hijos_de_la_tierra'),p=transaction(db,()=>createCharacter(db,b));
  const before=character(db,p.id),count=db.prepare('SELECT COUNT(*) n FROM progresion').get().n;db.close();db=openDatabase(file);
  assert.equal(character(db,p.id).xp_total,before.xp_total);assert.equal(db.prepare('SELECT COUNT(*) n FROM progresion').get().n,count);
  assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
 }finally{db?.close();for(const entry of readdirSync(dir,{withFileTypes:true})){if(!entry.isFile())throw Error("Archivo temporal inesperado");unlinkSync(join(dir,entry.name));}rmdirSync(dir);}
});

test('Brillo Solar: servidor valida propiedad y cobra 1 maná, incluso sin acceso a Spellweave',async t=>{
 const db=openDatabase(':memory:'),server=makeServer(db);await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(async()=>{await new Promise(r=>server.close(r));db.close();});
 const {b}=payload(db,'hijos_del_sol'),p=transaction(db,()=>createCharacter(db,b)),action=p.acciones.find(a=>a.nombre==='Brillo Solar');assert(action.usable_linaje);
 const fetch=fixtureFetch(db);
 const request=async(id,body)=>{const r=await fetch(`http://127.0.0.1:${server.address().port}/api/personajes/${id}/acciones`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});return {status:r.status,p:await r.json()};};
 let r=await request(p.id,{accion_id:action.id});assert.equal(r.status,200);assert.equal(r.p.mana_consumido,p.mana_consumido+1);
 r=await request(1,{accion_id:action.id});assert.equal(r.status,400);
 db.prepare('UPDATE personajes SET mana_consumido=9999 WHERE id=?').run(p.id);r=await request(p.id,{accion_id:action.id});assert.equal(r.status,400);
});
