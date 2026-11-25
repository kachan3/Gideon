import {readFileSync} from 'node:fs';
const questions=JSON.parse(readFileSync(new URL('../content/Dedicaciones/preguntas.json',import.meta.url),'utf8'));
export function migrateBackground(db){
 db.exec(readFileSync(new URL('./migrations/012_background.sql',import.meta.url),'utf8'));
 loadBackgroundQuestions(db);
 db.prepare('INSERT INTO schema_migrations(version) VALUES(12)').run();
}
export function loadBackgroundQuestions(db){
 for(const d of db.prepare('SELECT * FROM dedicaciones').all()){
  // El Core actual prevalece; los oficios adicionales conservan su catálogo existente.
  const canonical=questions.dedicaciones[d.nombre];
  const legacy=(d.preguntas_orientativas??'').split(/(?:^|\s+)\d+\.\s*/u).map(s=>s.trim()).filter(Boolean);
  const prompts=canonical??legacy.map(q=>[q,false]);
  for(const [i,[text,dm]] of prompts.entries())db.prepare('INSERT OR IGNORE INTO dedicaciones_preguntas(dedicacion_id,numero,pregunta,coordinar_dm,fuente) VALUES(?,?,?,?,?)').run(d.id,i+1,text,Number(dm),canonical?questions.fuente:'Catálogo SQL existente: '+d.nombre);
  if(prompts.length)db.prepare('UPDATE dedicaciones SET preguntas_orientativas=? WHERE id=?').run(prompts.map(([q],i)=>(i+1)+'. '+q).join('\n'),d.id);
 }
}

export function validateBackground(c,b){
 const answers=b.respuestas_trasfondo??{};
 if(typeof answers!=='object'||answers===null||Array.isArray(answers))throw Error('Respuestas de trasfondo inválidas');
 const prompts=(c.dedicaciones_preguntas??[]).filter(q=>q.dedicacion_id===b.dedicacion_id),result=[];
 for(const [key,value] of Object.entries(answers)){
  const q=prompts.find(q=>String(q.id)===key);if(!q)throw Error('La pregunta no pertenece a la Dedicación elegida');
  if(typeof value!=='string'||value.length>2000)throw Error('Cada respuesta de trasfondo debe ser texto de hasta 2000 caracteres');
  if(value.trim())result.push({pregunta_id:q.id,pregunta_original:q.pregunta,respuesta:value.trim()});
 }
 return result;
}
