import test from 'node:test';
import assert from 'node:assert/strict';
import {openDatabase,catalogue,createCharacter,character,transaction,addProgress} from './server.mjs';
import {pathContent} from './paths.mjs';
import {pathSummary} from '../js/path-ui.js';
import {creationPathChoices,devotionSheet} from '../js/path-choices-ui.js';
import {recordPathChoice} from './path-choices.mjs';
import {FIXED_VALUES,ATTRIBUTE_ORDER} from '../js/creation-rules.js';
import {spellPlan} from '../js/magic-rules.js';

const body=(c,path)=>{
 const attrs=c.skills.filter(s=>s.tipo==='Atributo').sort((a,b)=>ATTRIBUTE_ORDER.indexOf(a.nombre)-ATTRIBUTE_ORDER.indexOf(b.nombre));
 const b={nombre:'Prueba de '+path.nombre,clase_id:path.id,linaje_id:c.linajes.find(l=>l.codigo==='hijos_del_sol').id,dedicacion_id:c.dedicaciones[0].id,nacimiento_id:c.nacimientos[0].id,atributos:Object.fromEntries(attrs.map((a,i)=>[a.id,FIXED_VALUES[i]])),pools:{}};
 c.skills.filter(s=>s.tipo==='Habilidad'&&s.combate).slice(0,4).forEach((s,i)=>b.pools[s.id]=[20,15,10,5][i]);c.skills.filter(s=>s.tipo==='Habilidad'&&!s.combate).slice(0,3).forEach((s,i)=>b.pools[s.id]=[20,20,10][i]);return b;
};
const withChoice = (c,path,index=0) => ({
 ...body(c,path),
 elecciones_senda: Object.fromEntries(c.preguntas_senda.filter(q=>q.clase_id===path.id).map(q=>[q.id,q.opciones[index].id]))
});

test('sólo seis Sendas disponibles y conserva sus Rasgos y Dotes de inicio',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db);assert.deepEqual(c.clases.map(p=>p.nombre).sort(),pathContent.sendas.map(p=>p.nombre).sort());
  for(const path of c.clases){
   const src=pathContent.sendas.find(p=>p.nombre===path.nombre),summary=pathSummary(c,{clase_id:path.id});
   assert(src.rasgos.length>0);assert(summary.includes('Rasgos iniciales'));
   for(const feature of src.rasgos)assert(summary.includes(feature.nombre));
   assert.equal(summary.includes('Elecciones iniciales'),src.elecciones.length>0);
   const p=transaction(db,()=>createCharacter(db,withChoice(c,path)));
   for(const trait of src.rasgos)assert.equal(p.rasgos_clase.some(r=>r.nombre===trait.nombre),trait.xp_requerida===0);
   assert.equal(p.xp_gastada,0);
   const otherClassOnly=c.clases_rasgos.find(r=>r.es_insignia&&r.clase_id!==path.id&&!src.rasgos.some(s=>s.nombre===r.nombre));
   if(otherClassOnly)assert(!p.rasgos_clase.some(r=>r.id===otherClassOnly.id));
  }
  assert(!pathSummary(c,{}).includes('Eficiencia'));
 }finally{db.close();}
});

test('Sombra comienza con dos Rasgos y desbloquea Artes y Sentidos con 5 XP dedicados',()=>{
 const db=openDatabase(':memory:');
 try{
  const c=catalogue(db),path=c.clases.find(s=>s.nombre==='Senda de la Sombra');
  const p=transaction(db,()=>createCharacter(db,body(c,path)));
  const initial=['Acciones de Presteza','Conocimiento Técnico'];
  const all=[...initial,'Artes Sombrías','Sentidos Tétricos'];
  const active=()=>character(db,p.id).rasgos_clase.map(r=>r.nombre).sort();
  assert.deepEqual(active(),initial);
  assert.match(p.rasgos_clase.find(r=>r.nombre==='Acciones de Presteza').descripcion,/no est[aá]s Sorprendido/);
  db.prepare('UPDATE personajes SET xp_total=20 WHERE id=?').run(p.id);
  assert.deepEqual(active(),initial);
  const insert=db.prepare("INSERT INTO dotes(nombre,descripcion,clase_id,costo_xp) VALUES(?,'Prueba',?,?)");
  const acquire=(name,cost)=>{
   const id=Number(insert.run(name,path.id,cost).lastInsertRowid);
   transaction(db,()=>addProgress(db,p.id,{tipo:'Adquisicion',dote_id:id}));
  };
  acquire('Prueba Sombra 4 XP',4);
  assert.deepEqual(active(),initial);
  acquire('Prueba Sombra 1 XP',1);
  assert.deepEqual(active(),all.sort());
 }finally{db.close();}
});

test('las Sendas fuera de demo se conservan en SQL pero no se pueden elegir por API',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),off=db.prepare("SELECT * FROM clases WHERE nombre='Senda del Elementalista'").get();
  assert.equal(off.disponible_demo,0);assert(!c.clases.some(s=>s.id===off.id));
  const before=db.prepare('SELECT COUNT(*) n FROM personajes').get().n;
  assert.throws(()=>transaction(db,()=>createCharacter(db,{...body(c,c.clases[0]),clase_id:off.id})),/no está disponible/);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM personajes').get().n,before);
 }finally{db.close();}
});

test('los Rasgos de inicio y los Dotes de Senda se conservan por separado',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),path=c.clases.find(c=>c.nombre==='Senda del Hierofante'),p=transaction(db,()=>createCharacter(db,withChoice(c,path)));
  assert(p.rasgos_clase.some(r=>r.nombre==='Manifestación Celestial'));assert(c.clases_dotes.some(d=>d.clase_id===path.id));
  assert(!p.tags.some(t=>t.nombre==='Bienaventurado'),'El pacto no debe elegirse automáticamente');
  assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
 }finally{db.close();}
});

test('el Dogma elegido concede su repertorio y sólo Justicia permite adquirir Mano del Juez',()=>{
 const db=openDatabase(':memory:');
 try{
  const c=catalogue(db);
  const path=c.clases.find(s=>s.nombre==='Senda del Hierofante');
  const question=c.preguntas_senda.find(q=>q.clase_id===path.id);
  const feat=c.dotes.find(d=>d.nombre==='Mano del Juez');
  const other=c.clases.find(s=>s.id!==path.id);
  const wrongClass=withChoice(c,path);
  assert.throws(()=>transaction(db,()=>createCharacter(db,body(c,path))),/Qué Dogma/);
  assert.throws(()=>transaction(db,()=>createCharacter(db,{...wrongClass,clase_id:other.id})),/no pertenece/);
  assert.throws(()=>transaction(db,()=>createCharacter(db,{...wrongClass,elecciones_senda:{[question.id]:999}})),/Qué Dogma/);
  assert.equal(creationPathChoices(c,{clase_id:other.id}),'');
  assert.match(creationPathChoices(c,wrongClass),/Dogma de la Justicia/);

  const expected=[
    ['Oración de los Cruzados','Juicio Divino','Juicio Pesado','Favor del Juez'],
    ['Viaje Seguro','Curar Heridas Menores','Proteger al Compañero','Restablecimiento Grupal'],
    ['Paso sin Grilletes','Cadenas Rotas','Grito de Emancipación','El Gran Éxodo']
  ];
  for(const [index,[prayer,first,second,miracle]] of expected.entries()){
   const p=transaction(db,()=>createCharacter(db,withChoice(c,path,index)));
   const saved=character(db,p.id);
   assert.equal(saved.elecciones_senda[0].opcion_id,question.opciones[index].id);
   assert.deepEqual(saved.plegarias.map(r=>r.nombre),[prayer]);
   assert.deepEqual(saved.acciones.filter(a=>a.tipo==='Intervención').map(a=>a.nombre).sort(),[first,second].sort());
   assert.deepEqual(saved.acciones.filter(a=>a.tipo==='Milagro').map(a=>[a.nombre,a.coste_mana,a.coste_omen]),[[miracle,5,1]]);
   assert(devotionSheet(saved).includes(prayer));
   assert.throws(()=>recordPathChoice(db,p.id,{pregunta_id:question.id,opcion_id:question.opciones[(index+1)%3].id}),/ya está registrada/);
   const buy=()=>transaction(db,()=>addProgress(db,p.id,{tipo:'Adquisicion',dote_id:feat.id}));
   if(index===0)assert.throws(buy,/XP disponible insuficiente/);
   db.prepare('UPDATE personajes SET xp_total=5 WHERE id=?').run(p.id);
   if(index!==0)assert.throws(buy,/Dogma de la Justicia/);
   else{
    const purchased=buy();
    assert.equal(purchased.xp_gastada,2);
    assert.equal(purchased.acciones.filter(a=>a.nombre==='Mano del Juez').length,1);
    assert(devotionSheet(purchased).includes('Mano del Juez'));
    const retired=transaction(db,()=>addProgress(db,p.id,{tipo:'Retiro',dote_id:feat.id}));
    assert(!retired.acciones.some(a=>a.nombre==='Mano del Juez'));
   }
  }
  // Una ficha anterior al selector llega a la ficha con la pregunta pendiente.
  const old=transaction(db,()=>createCharacter(db,withChoice(c,path)));
  db.prepare('DELETE FROM personajes_elecciones_senda WHERE personaje_id=?').run(old.id);
  const pending=character(db,old.id);
  assert.match(devotionSheet(pending),/Guardar elección/);
  assert.deepEqual(pending.plegarias,[]);
  transaction(db,()=>recordPathChoice(db,old.id,{pregunta_id:question.id,opcion_id:question.opciones[2].id}));
  assert.equal(character(db,old.id).plegarias[0].nombre,'Paso sin Grilletes');
 }finally{db.close();}
});

test('Eficiencia figura entre los Rasgos reales del Arcanista y reduce el coste modular',()=>{
 const db=openDatabase(':memory:');try{
  const p=character(db,1);assert(p.rasgos_clase.some(r=>r.nombre==='Eficiencia'));assert(!p.adquisiciones.some(a=>a.elemento?.nombre==='La Herramienta Correcta'));
  const config={efecto_id:p.componentes.efectos[0].id,medium_id:p.componentes.mediums[0].id,shape_id:p.componentes.shapes[0].id,efecto_pl:4,duracion_pl:0,mods:[],herramienta:'Herramienta'};
  const plan=spellPlan(p,config);assert.equal(plan.pl,6);assert.equal(plan.coste_mana,4);
 }finally{db.close();}
});
