import test from 'node:test';
import assert from 'node:assert/strict';
import {openDatabase,catalogue,createCharacter,transaction,character} from './server.mjs';
import {classGuide,selectedEpiphany,epiphanyRecommendations,arcanistSheet} from '../js/class-guide.js';
import {creationTraitChoices,validateInitialTraitChoices} from '../js/trait-choices-ui.js';
import {technicalAllocations} from '../js/technical-choices.js';
import {FIXED_VALUES,ATTRIBUTE_ORDER} from '../js/creation-rules.js';
import {creationOrders,validateCreationOrders} from '../js/orders-ui.js';

test('la guía usa los IDs de Epifanía y relaciona Yrgrammar con su habilidad y Arcana',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),d={clase_id:c.clases.find(p=>p.nombre==='Senda del Arcanista').id,atributos:{},pools:{},elecciones_rasgos:{epifania:'pendiente:Memento Mori',herramienta:'Bastón',artefacto:'Blunderblaze'}};
  const ep=selectedEpiphany(c,d);assert.equal(ep.nombre,'Memento Mori');
  const before=JSON.stringify(d);assert.match(epiphanyRecommendations(c,d),/Arcana/);assert.match(epiphanyRecommendations(c,d,{pool:true}),/Yrgram/);assert.equal(JSON.stringify(d),before);
  assert.doesNotThrow(()=>validateInitialTraitChoices(c,d,{phase:'class'}));
  const html=creationTraitChoices(c,d,{phase:'class'});assert.match(html,/Force Decay/);assert(!html.includes('Evocación Básica'));assert(!html.includes('data-choice-description><p>##'));
  const guide=classGuide(c,d);assert.equal((guide.match(/class="class-card[ "]/g)??[]).length,6);assert.match(guide,/src\/Arcanist.jpg/);
  const sheet=arcanistSheet(c,{sendas:[c.clases.find(p=>p.id===d.clase_id)],adquisiciones:[{epifania_id:ep.id}]});assert.match(sheet,/Force Decay/);assert.match(sheet,/Aprendida/);assert.match(sheet,/Naial/);
  assert.equal(arcanistSheet(c,{sendas:[],adquisiciones:[]}), '');
 }finally{db.close();}
});

test('la vista de clase permite preparar el Dote Marcial y elegir Orden y Combo',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),d={clase_id:c.clases.find(p=>p.nombre==='Senda del Valor').id,atributos:{},pools:{},elecciones_rasgos:{}};
  const martial=c.elecciones_rasgos.find(e=>e.tipo==='Marcial');d.elecciones_rasgos[martial.codigo]=martial.opciones.find(o=>o.nombre==='Dual Wielding Enthusiast').id;
  assert.match(creationTraitChoices(c,d,{phase:'class'}),/name="rasgo_entrenamiento_superior" required/);
  assert.doesNotThrow(()=>validateInitialTraitChoices(c,d,{phase:'class'}));
  assert.throws(()=>validateInitialTraitChoices(c,d),/Dote Marcial/);
  const honor={...d,clase_id:c.ordenes_y_juramento.clase_honor_id,orden:'dragon-valeroso',combo_orden_id:c.ordenes_y_juramento.combos[0].id};
  const html=creationOrders(c,honor,{affiliationOnly:true});assert.match(html,/name="orden"/);assert.match(html,/name="combo_orden_id"/);assert.match(html,/50/);assert(!html.includes('data-oath-planner'));
  assert.doesNotThrow(()=>validateCreationOrders(c,honor));assert(creationOrders(c,honor).includes('data-oath-planner'));
  assert.equal(creationOrders(c,d,{affiliationOnly:true}),'');
 }finally{db.close();}
});

test('Sombra reparte 100 puntos técnicos, respeta valores previos y no gasta XP',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),attrs=c.skills.filter(s=>s.tipo==='Atributo').sort((a,b)=>ATTRIBUTE_ORDER.indexOf(a.nombre)-ATTRIBUTE_ORDER.indexOf(b.nombre));
  const draft={nombre:'Técnica de Sombra',clase_id:c.clases.find(s=>s.nombre==='Senda de la Sombra').id,linaje_id:c.linajes.find(l=>l.codigo==='hijos_del_sol').id,dedicacion_id:c.dedicaciones.find(d=>d.nombre==='Soldado').id,nacimiento_id:c.nacimientos[0].id,atributos:Object.fromEntries(attrs.map((a,i)=>[a.id,FIXED_VALUES[i]])),pools:{}};
  c.skills.filter(s=>s.tipo==='Habilidad'&&s.combate).slice(0,4).forEach((s,i)=>draft.pools[s.id]=[20,15,10,5][i]);c.skills.filter(s=>s.tipo==='Habilidad'&&!s.combate).slice(0,3).forEach((s,i)=>draft.pools[s.id]=[20,20,10][i]);
  const skills=technicalAllocations(c,draft);assert.equal(skills.length,4);
  draft.conocimiento_tecnico=Object.fromEntries(skills.map(({skill})=>[skill.id,25]));assert.doesNotThrow(()=>technicalAllocations(c,draft,{strict:true}));
  const p=transaction(db,()=>createCharacter(db,draft));assert.equal(p.xp_gastada,0);
  for(const {skill} of skills)assert.equal(character(db,p.id).skills.find(s=>s.id===skill.id).valor,25);
  assert.equal(p.historial.filter(h=>h.origen==='Conocimiento Técnico').length,4);
  assert.throws(()=>technicalAllocations(c,{...draft,clase_id:c.clases[0].id},{strict:true}),/requiere Senda/);
  const count=db.prepare('SELECT COUNT(*) n FROM personajes').get().n;
  assert.throws(()=>transaction(db,()=>createCharacter(db,{...draft,conocimiento_tecnico:{[skills[0].skill.id]:99}})),/100 puntos/);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM personajes').get().n,count);
  const cap=transaction(db,()=>createCharacter(db,{...draft,conocimiento_tecnico:{[skills[0].skill.id]:100}}));assert.equal(cap.skills.find(s=>s.id===skills[0].skill.id).valor,100);
  const locksmith=c.profesiones.find(p=>p.nombre==='Cerrajería');
  const trained=transaction(db,()=>createCharacter(db,{...draft,dedicacion_id:c.dedicaciones.find(d=>d.nombre==='Artesano').id,profesion_id:locksmith.id,conocimiento_tecnico:{[skills[0].skill.id]:100}}));
  assert.equal(trained.skills.find(s=>s.id===skills[0].skill.id).valor,100);
  assert.equal(trained.historial.find(h=>h.origen==='Conocimiento Técnico').valor,50);
 }finally{db.close();}
});
