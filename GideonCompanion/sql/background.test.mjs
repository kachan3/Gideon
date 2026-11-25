import test from 'node:test';
import assert from 'node:assert/strict';
import {openDatabase,catalogue,createCharacter,character,transaction} from './server.mjs';
import {backgroundAnswers,backgroundEditor,backgroundReview,backgroundSheet} from '../js/background-ui.js';
import {FIXED_VALUES,ATTRIBUTE_ORDER} from '../js/creation-rules.js';
import {loadBackgroundQuestions} from './background.mjs';

function payload(c,name='Médico'){
 const attrs=c.skills.filter(s=>s.tipo==='Atributo').sort((a,b)=>ATTRIBUTE_ORDER.indexOf(a.nombre)-ATTRIBUTE_ORDER.indexOf(b.nombre)),b={nombre:'Historia de prueba',linaje_id:c.linajes.find(l=>l.codigo==='hijos_del_sol').id,clase_id:c.clases[0].id,dedicacion_id:c.dedicaciones.find(d=>d.nombre===name).id,nacimiento_id:c.nacimientos[0].id,atributos:Object.fromEntries(attrs.map((a,i)=>[a.id,FIXED_VALUES[i]])),pools:{}};
 c.skills.filter(s=>s.tipo==='Habilidad'&&s.combate).slice(0,4).forEach((s,i)=>b.pools[s.id]=[20,15,10,5][i]);c.skills.filter(s=>s.tipo==='Habilidad'&&!s.combate).slice(0,3).forEach((s,i)=>b.pools[s.id]=[20,20,10][i]);return b;
}
test('preguntas: Core de cuatro y catálogo adicional de Cazador, sin inventar contenido',()=>{
 const db=openDatabase(':memory:');try{
  db.prepare('INSERT OR IGNORE INTO dedicaciones(nombre,descripcion,preguntas_orientativas) VALUES(?,?,?)').run('Cazador','Catálogo anterior','1. ¿Qué presa te marcó? 2. ¿Qué territorio conoces de memoria? 3. ¿Qué trofeo guardas?');loadBackgroundQuestions(db);
  const c=catalogue(db);
  for(const name of ['Médico','Académico','Granjero','Artesano','Marinero','Mercader','Soldado','Cazador'])assert.equal(c.dedicaciones_preguntas.filter(q=>q.dedicacion_id===c.dedicaciones.find(d=>d.nombre===name).id).length,4);
  const hunter=c.dedicaciones.find(d=>d.nombre==='Cazador');assert.equal(c.dedicaciones_preguntas.filter(q=>q.dedicacion_id===hunter.id).length,4);
  assert(backgroundEditor(c,{dedicacion_id:hunter.id}).includes('¿Qué presa te marcó?'));assert(backgroundEditor(c,payload(c)).includes('Respuestas opcionales'));
 }finally{db.close();}
});
test('respuestas opcionales persistidas, sin alterar notas ni estadísticas, y texto escapado',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),b=payload(c),q=c.dedicaciones_preguntas.find(q=>q.dedicacion_id===b.dedicacion_id),answer='Aprendí en el puerto. <script>nunca ejecutar</script>';
  const draft={...b,respuestas_trasfondo:{[q.id]:answer}},p=transaction(db,()=>createCharacter(db,{...draft,notas:'Notas independientes'})),plain=transaction(db,()=>createCharacter(db,b));
  assert.deepEqual(p.skills,plain.skills);assert.equal(p.xp_total,plain.xp_total);assert.equal(p.notas,'Notas independientes');assert.equal(character(db,p.id).trasfondo[0].respuesta,answer);
  assert.equal(p.trasfondo[0].pregunta_original,q.pregunta);assert(!backgroundSheet(p).includes('<script>'));assert(backgroundReview(c,draft).includes('&lt;script&gt;'));assert.equal(plain.trasfondo.length,0);
  const other=c.dedicaciones_preguntas.find(x=>x.dedicacion_id!==b.dedicacion_id);
  assert.deepEqual(backgroundAnswers(c,{...draft,respuestas_trasfondo:{[q.id]:answer,[other.id]:'Otro oficio'}}),{[q.id]:answer});
 }finally{db.close();}
});
test('servidor y SQLite rechazan preguntas ajenas, respuestas no textuales y exceso de longitud',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db),b=payload(c),q=c.dedicaciones_preguntas.find(q=>q.dedicacion_id===b.dedicacion_id),other=c.dedicaciones_preguntas.find(q=>q.dedicacion_id!==b.dedicacion_id);
  for(const answers of [{[other.id]:'No corresponde'},{[q.id]:42},{[q.id]:'x'.repeat(2001)},[]])assert.throws(()=>transaction(db,()=>createCharacter(db,{...b,respuestas_trasfondo:answers})),/trasfondo|Dedicación/);
  const p=transaction(db,()=>createCharacter(db,b));
  assert.throws(()=>db.prepare('INSERT INTO personajes_trasfondo VALUES(?,?,?,?)').run(p.id,other.id,other.pregunta,'No corresponde'),/no pertenece/);
  assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
 }finally{db.close();}
});
