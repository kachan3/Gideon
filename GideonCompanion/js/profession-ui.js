import {selectedProfession} from './profession-rules.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function professionChoice(c,d){
 const choices=(c.dedicaciones_profesiones??[]).filter(p=>p.dedicacion_id===d.dedicacion_id).map(p=>c.profesiones.find(x=>x.id===p.profesion_id)),selected=selectedProfession(c,d);if(!choices.length)return '';
 return `<section class="profession-choice"><h3>Oficio aprendido</h3><p class="hint">Comienzas con un mínimo de 50 en el oficio aprendido. Es una habilidad que puedes usar y mejorar; no consume tus pools de creación. Los dotes generales pueden requerir un valor mínimo en ella.</p>${choices.length>1?`<label>Elige tu oficio<select name="oficio_inicial" data-profession-choice required><option value="">Seleccionar oficio…</option>${choices.map(p=>`<option value="${p.id}" ${selected?.id===p.id?'selected':''}>${esc(p.nombre)} · mínimo ${p.minimo_inicial}</option>`).join('')}</select></label>`:`<strong>${esc(selected.nombre)} · mínimo ${selected.minimo_inicial}</strong>`}<p data-profession-description class="description">${esc(selected?.descripcion??'')}</p></section>`;
}
export function bindProfession(root,c,d,onChange){
 const select=root.querySelector('[data-profession-choice]');if(!select)return;
 select.onchange=()=>{d.profesiones_elegidas??={};if(select.value)d.profesiones_elegidas[d.dedicacion_id]=Number(select.value);else delete d.profesiones_elegidas[d.dedicacion_id];root.querySelector('[data-profession-description]').textContent=selectedProfession(c,d)?.descripcion??'';onChange();};
}
export function professionsSheet(p){
 if(!p.profesiones?.length)return '';
 return `<section class="panel"><h2>Oficios aprendidos</h2>${p.profesiones.map(o=>{const skill=p.skills.find(s=>s.id===o.skill_id);return `<div class="list-item"><button type="button" class="skill-row skill-roll" data-roll-skill="${o.skill_id}"><span>${esc(o.nombre)}</span><strong>${skill?.valor??0} · Nv ${Math.floor((skill?.valor??0)/10)}</strong></button><p class="description">${esc(o.descripcion)}</p></div>`;}).join('')}</section>`;
}
export function professionReview(c,d){const p=selectedProfession(c,d);return p?`<p><strong>Oficio aprendido:</strong> ${esc(p.nombre)} · mínimo ${p.minimo_inicial}</p>`:'';}
