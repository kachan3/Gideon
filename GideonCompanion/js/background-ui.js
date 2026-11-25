const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function backgroundAnswers(c,d){
 return Object.fromEntries((c.dedicaciones_preguntas??[]).filter(q=>q.dedicacion_id===d.dedicacion_id&&d.respuestas_trasfondo?.[q.id]?.trim()).map(q=>[q.id,d.respuestas_trasfondo[q.id]]));
}
export function originAnswers(c,d){
 return Object.fromEntries((c.nacimientos_preguntas??[]).filter(q=>q.nacimiento_id===d.nacimiento_id&&d.respuestas_nacimiento?.[q.id]?.trim()).map(q=>[q.id,d.respuestas_nacimiento[q.id]]));
}
function questionnaire(title,prompts,answers,source){
 return `<section class="background-questions"><h3>${esc(title)}</h3><p class="muted">Respuestas opcionales para dar historia al personaje. No modifican sus estadísticas. Las marcadas con (*) pueden acordarse con el narrador.</p>${prompts.map(q=>`<label>${q.numero}. ${esc(q.pregunta)}${q.coordinar_dm?' (*)':''}<textarea name="trasfondo_${source}_${q.id}" data-background-question="${q.id}" data-background-source="${source}" rows="2" maxlength="2000">${esc(answers?.[q.id]??'')}</textarea></label>`).join('')||'<p class="muted">No hay preguntas definidas para esta selección.</p>'}</section>`;
}
export function backgroundEditor(c,d){
 const dedication=c.dedicaciones.find(p=>p.id===d.dedicacion_id),birth=c.nacimientos.find(n=>n.id===d.nacimiento_id);
 return (dedication?questionnaire('Preguntas de trasfondo · '+dedication.nombre,(c.dedicaciones_preguntas??[]).filter(q=>q.dedicacion_id===dedication.id),d.respuestas_trasfondo,'Dedicacion'):'')+
 (birth?questionnaire('Preguntas de nacimiento · '+birth.nombre,(c.nacimientos_preguntas??[]).filter(q=>q.nacimiento_id===birth.id),d.respuestas_nacimiento,'Nacimiento'):'');
}
export function bindBackground(root,d){
 root.querySelectorAll('[data-background-question]').forEach(field=>field.oninput=()=>{const key=field.dataset.backgroundSource==='Nacimiento'?'respuestas_nacimiento':'respuestas_trasfondo';d[key]??={};d[key][field.dataset.backgroundQuestion]=field.value;});
}
export function backgroundReview(c,d){
 const answers=backgroundAnswers(c,d),origin=originAnswers(c,d),entries=[...(c.dedicaciones_preguntas??[]).filter(q=>q.dedicacion_id===d.dedicacion_id&&Object.hasOwn(answers,q.id)).map(q=>({...q,respuesta:answers[q.id]})),...(c.nacimientos_preguntas??[]).filter(q=>q.nacimiento_id===d.nacimiento_id&&Object.hasOwn(origin,q.id)).map(q=>({...q,respuesta:origin[q.id]}))];
 return entries.length?`<section><h3>Tu trasfondo</h3>${entries.map(q=>`<p><strong>${esc(q.pregunta)}</strong></p><p class="description">${esc(q.respuesta)}</p>`).join('')}</section>`:'';
}
export function backgroundSheet(p){
 return [...(p.trasfondo??[]),...(p.origen_trasfondo??[])].map(q=>`<div class="list-item"><strong>${esc(q.pregunta_original)}</strong><p class="description">${esc(q.respuesta)}</p></div>`).join('');
}
