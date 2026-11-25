import {lineageBonuses} from './lineage-rules.js';
import {creationTraitModifiers} from './trait-rules.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function initialXP(c,d){
 return d.generacion_modo==='Ordenado'?2:1;
}
export function lineageEditor(c,d,{readOnly=false}={}){
 const l=c.linajes.find(l=>l.id===d.linaje_id);if(!l)return '';
 const grants=(c.linajes_rasgos??[]).filter(g=>g.linaje_id===l.id).map(g=>c.rasgos.find(r=>r.id===g.rasgo_id&&r.tipo==='Capacidad')).filter(Boolean);
 const bonuses=lineageBonuses(c,d),groups=(c.linajes_elecciones??[]).filter(g=>g.linaje_id===l.id);
 return `<section class="panel lineage-summary"><h3>${esc(l.nombre)}</h3><p>${esc(l.descripcion)}</p><p>Movimiento ${l.movimiento_terrestre} unidades · Escalado vital ×${l.escalado_vital}</p><h4>Bonos de creación</h4><p data-lineage-bonuses>${bonuses.map(b=>`+${b.bono} ${esc(c.skills.find(s=>s.id===b.skill_id)?.nombre)}`).join(' · ')}</p>
 ${groups.map(g=>{const selected=d.elecciones_linaje?.[g.id];return readOnly?'':`<label>${esc(g.nombre)}<select data-lineage-choice="${g.id}" name="eleccion_${g.id}" required><option value="">Elige una habilidad…</option>${(c.linajes_elecciones_opciones??[]).filter(o=>o.eleccion_id===g.id).map(o=>`<option value="${o.skill_id}" ${selected===o.skill_id?'selected':''}>${esc(c.skills.find(s=>s.id===o.skill_id)?.nombre)}</option>`).join('')}</select></label>`;}).join('')}
 <h4>Rasgos de origen · Linaje</h4><p class="hint">Los recibes automáticamente al elegir este linaje, sin coste de XP.</p>${grants.map(f=>`<details><summary>${esc(f.nombre)}</summary><p class="description">${esc(f.descripcion)}</p></details>`).join('')}
 ${(c.linajes_equipo_inicial??[]).filter(i=>i.linaje_id===l.id).map(i=>{const item=c.items_base.find(x=>x.id===i.item_base_id);return readOnly?`<p>${d.regalo_moonstone===false?'Sin regalo cultural':esc(item.nombre)+' como regalo cultural inicial'}</p>`:`<label class="hint"><input type="checkbox" name="regalo_moonstone" data-lineage-gift ${d.regalo_moonstone===false?'':'checked'}> Comenzar con ${esc(item.nombre)}</label><p class="description">${esc(item.descripcion)}</p>`;}).join('')}
 <p class="hint">Los bonos de linaje se suman a la base heredada antes de repartir los puntos de Senda.</p></section>`;
}
export function bindLineageEditor(root,d,c){
 root.querySelectorAll('[data-lineage-choice]').forEach(select=>select.onchange=()=>{d.elecciones_linaje??={};if(select.value)d.elecciones_linaje[select.dataset.lineageChoice]=Number(select.value);else delete d.elecciones_linaje[select.dataset.lineageChoice];root.querySelector('[data-lineage-bonuses]').textContent=lineageBonuses(c,d).map(b=>`+${b.bono} ${c.skills.find(s=>s.id===b.skill_id)?.nombre}`).join(' · ');});
 const gift=root.querySelector('[data-lineage-gift]');if(gift)gift.onchange=()=>{d.regalo_moonstone=gift.checked;};
}
export function lineageSheet(p){
 const s=p.capacidades_linaje;if(!s)return '';
 return `<section class="panel lineage-summary"><h2>Capacidades de linaje</h2><p>Movimiento base ${s.movimiento} unidades${s.nado?' · Nado '+s.nado:''}${s.escalada_vegetal?' · Escalada vegetal '+s.escalada_vegetal:''}</p><p>Respiración: ${s.respiracion_minutos} min${s.respiracion_acuatica_minutos!==s.respiracion_minutos?' · Bajo el agua: '+s.respiracion_acuatica_minutos+' min':''}</p>${s.sin_gasto_aire_ataque_acuatico?'<p class="hint">No gastas aire adicional por atacar bajo el agua mientras tengas reserva.</p>':''}
 ${p.linaje_revision?.skills_anteriores?'<p class="hint">Ficha creada antes de la revisión: conserva sus valores de habilidades anteriores. Las nuevas capacidades de linaje están concedidas.</p>':''}</section>`;
}
