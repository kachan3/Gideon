import {originTraits} from './trait-rules.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function originTraitEditor(c,d){
 const traits=originTraits(c,d,{includeLineage:false});if(!traits.length)return '';
 return `<section class="profession-summary"><h3>Rasgos de origen · Dedicación y Nacimiento</h3><p class="hint">Se incorporan automáticamente a tu personaje. El oficio elegido también es un Rasgo de origen.</p>${traits.map(r=>`<details><summary>${esc(r.nombre)}</summary><p class="description">${esc(r.descripcion)}</p><small>${esc(r.origenes.join(' · '))}</small></details>`).join('')}</section>`;
}
export function traitSheet(p,c){
 if(!p.rasgos?.length)return '';
 const names={BonoSkill:'Bono',MinimoSkill:'Mínimo',Mitigacion:'Mitigación',Resistencia:'Resistencia',Debilidad:'Debilidad',Movimiento:'Velocidad',Regla:'Regla particular',TiradaNE:'NE adicional',Salvataje:'Salvataje',XPInicial:'XP inicial'};
 const markup=r=>`<div class="list-item"><h3>${esc(r.nombre)}</h3><p class="description">${esc(r.descripcion)}</p><small>Origen: ${esc(r.fuentes.join(', '))}</small>${r.modificadores.filter(m=>m.tipo!=='Regla').map(m=>`<p>${esc(names[m.tipo])}: ${esc(c.skills.find(s=>s.id===m.skill_id)?.nombre??m.objetivo)} ${m.tipo==='BonoSkill'||m.tipo==='TiradaNE'||m.tipo==='Mitigacion'?'+' :''}${m.valor}${m.unidad?' '+esc(m.unidad):''}${m.fase==='Creacion'?' · al crear el personaje':''}${m.condicion!=='Siempre'?' · condicionado':''}</p>`).join('')}</div>`;
 const origins=p.rasgos.filter(r=>r.origenes?.length),others=p.rasgos.filter(r=>!r.origenes?.length&&!(p.rasgos_senda&&r.sendas?.length));
 return `${origins.length?`<section class="panel" data-origin-traits><h2>Rasgos de origen</h2><p class="hint">Concedidos por tu linaje, Dedicación, Nacimiento y oficio. No consumen XP.</p>${origins.map(r=>`<details><summary>${esc(r.nombre)} · ${esc(r.origenes.join(' / '))}</summary>${markup(r)}</details>`).join('')}</section>`:''}${others.length?`<details class="panel"><summary>Otros Rasgos activos · ${others.length}</summary>${others.map(markup).join('')}</details>`:''}`;
}
