import {creationSkills,personalWeight} from './creation-rules.js';
import {lineageBonuses} from './lineage-rules.js';
import {creationTraitModifiers} from './trait-rules.js';
import {professionGuarantees} from './profession-rules.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const COMBAT=[20,15,10,5];
const combatAttribute=a=>['Melee','Proyectiles','Arcana'].includes(a.nombre);
function preview(c,d){return creationSkills({skills:c.skills,atributos:d.atributos,pools:d.pools,bonos:lineageBonuses(c,d),garantias:professionGuarantees(c,d),minimos:creationTraitModifiers(c,d).garantias});}
export function creationWeight(c,d){
 const {totals}=preview(c,d),value=name=>totals[c.skills.find(s=>s.nombre===name).id];
 return personalWeight(value('Fuerza'),value('Vitalidad'),c.linajes.find(l=>l.id===d.linaje_id).escalado_vital);
}
function profession(c,d){return c.dedicaciones.find(p=>p.id===d.dedicacion_id);}
function dedicationNotice(row){
 if(!row.destacado)return '';
 const applied=row.total-Math.min(80,row.antes_destacado);
 if(applied===row.destacado)return `+${row.destacado} por dedicación aplicado`;
 if(applied>0)return `+${applied} por dedicación aplicado (+${row.destacado} limitado por el techo de 80)`;
 return `Bono de dedicación +${row.destacado}: sin aumento por el techo de 80`;
}

export function professionMarkup(c,d){
 const p=profession(c,d),guarantees=professionGuarantees(c,d);
 if(!p)return '<p class="muted">Selecciona una profesión para ver sus habilidades garantizadas.</p>';
 return `<h3>Habilidades garantizadas · ${esc(p.nombre)}</h3>${guarantees.length?`<div class="guarantee-list">${guarantees.map(g=>{const s=c.skills.find(s=>s.id===g.skill_id);return `<div><strong>${esc(s?.nombre)}</strong><span class="tag">Mínimo ${g.minimo}</span>${s?.tipo==='Atributo'?`<small>También se aplica a sus habilidades hijas: ${c.skills.filter(ch=>ch.padre_id===s.id).map(ch=>esc(ch.nombre)).join(', ')}.</small>`:''}</div>`;}).join('')}</div><p class="muted">Los mínimos son gratuitos. Superar el mínimo concede Destacado (+5), una sola vez y sujeto al techo de 80; los oficios pueden mejorar mediante la progresión.</p>`:'<p class="muted">Los mínimos de esta profesión siguen pendientes de definición.</p>'}`;
}
function breakdown(c,d,s,row){
 const parent=c.skills.find(a=>a.id===s.padre_id),p=profession(c,d);
 const parts=[`${esc(parent?.nombre??s.nombre)} ${row.base}`];
 if(row.linaje)parts.push(`Linaje ${row.linaje>0?'+':''}${row.linaje}`);
 if(row.minimo!=null)parts.push(`<span class="profession-note">${esc(p?.nombre)} asegura ${row.minimo}${row.piso?' (+'+row.piso+')':''}</span>`);
 else if(row.garantia_padre)parts.push(`<span class="profession-note">${esc(p?.nombre)} · heredado de ${esc(parent?.nombre)}</span>`);
 if(row.asignado)parts.push(`Pool +${row.asignado}`);
 if(row.destacado)parts.push(`<strong class="${row.total>Math.min(80,row.antes_destacado)?'good':'profession-note'}">${dedicationNotice(row)}</strong>`);
 if(row.exceso)parts.push(`Techo 80: ${row.exceso} puntos excedentes`);
 return parts.join(' · ');
}
function skillRow(c,d,s,row,editable){return `<div class="allocation-row ${row.profesion?'profession-skill':''}" data-skill-row="${s.id}"><div class="allocation-info"><label for="${editable?'normal_':'combat-preview-'}${s.id}">${esc(s.nombre)}</label><small data-breakdown="${s.id}" aria-live="polite">${breakdown(c,d,s,row)}</small></div>${editable?`<label class="allocation-input">Valor asignado<input id="normal_${s.id}" name="normal_${s.id}" data-normal="${s.id}" type="number" min="${row.baseline}" max="${row.baseline+20}" value="${row.antes_destacado}" required></label>`:''}<div class="allocation-total"><small>Total</small><strong id="combat-preview-${s.id}" data-final="${s.id}">${row.total}</strong></div></div>`;}
export function poolEditor(c,d){
 const view=preview(c,d),attrs=c.skills.filter(s=>s.tipo==='Atributo'),combat=attrs.filter(combatAttribute),normal=attrs.filter(a=>!combatAttribute(a));
 const selectOptions=value=>`<option value="">Seleccionar habilidad…</option>`+combat.map(a=>`<optgroup label="${esc(a.nombre)}">${c.skills.filter(s=>s.padre_id===a.id).map(s=>`<option value="${s.id}" ${Number(d.pools[s.id])===value?'selected':''}>${esc(s.nombre)}</option>`).join('')}</optgroup>`).join('');
 const groups=(list,editable)=>list.map(a=>`<section class="pool-attribute"><h3>${esc(a.nombre)} <span class="muted">${view.totals[a.id]}</span></h3>${c.skills.filter(s=>s.padre_id===a.id).map(s=>skillRow(c,d,s,view.details[s.id],editable)).join('')}</section>`).join('');
 return `<section class="pool-section" id="combat-pool"><div class="pool-heading"><div><h2>Habilidades de combate</h2><p class="muted">Asigna cada bono a una habilidad distinta de Melee, Proyectiles o Arcana.</p></div><span id="combat-budget" class="tag" aria-live="polite"></span></div><div class="combat-slots">${COMBAT.map(v=>`<label>Bono +${v}<select name="combat_${v}" data-combat-slot="${v}" required>${selectOptions(v)}</select><small data-slot-detail="${v}"></small></label>`).join('')}</div><div class="combat-groups">${groups(combat,false)}</div></section>
 <section class="pool-section" id="normal-pool"><div class="pool-heading"><div><h2>Habilidades normales</h2><p class="muted">Repartí los puntos sobre la base heredada con los bonos de linaje. Después se aplica el mínimo de oficio. Aumenta el valor para repartir hasta +20 por habilidad.</p></div><span id="normal-budget" class="tag" aria-live="polite"></span></div><p class="hint">El campo muestra base + puntos asignados. El total aplica el mínimo si quedaste por debajo, o Destacado (+5) si lo superaste.</p><div class="normal-groups">${groups(normal,true)}</div></section>
 <section class="profession-summary">${professionMarkup(c,d)}</section>`;
}
export function bindPoolEditor(c,d){
 const root=document.getElementById('wizard-body'),next=document.getElementById('next');
 const totals=()=>{let normal=0,combat=[];for(const [id,value] of Object.entries(d.pools)){const skill=c.skills.find(s=>s.id===Number(id));if(!skill)continue;if(skill.combate&&value>0)combat.push(value);else if(!skill.combate)normal+=value;}return {normal,combat};};
 function update(){
   const view=preview(c,d),budget=totals(),remaining=50-budget.normal;
   root.querySelector('#combat-budget').textContent=`${budget.combat.length}/4 bonos asignados`;
   root.querySelector('#normal-budget').textContent=`${budget.normal}/50 puntos · ${remaining} disponibles`;
   for(const select of root.querySelectorAll('[data-combat-slot]')){
     const used=[...root.querySelectorAll('[data-combat-slot]')].filter(s=>s!==select).map(s=>s.value).filter(Boolean);
     for(const option of select.options)option.disabled=Boolean(option.value)&&used.includes(option.value);
     const s=c.skills.find(s=>s.id===Number(select.value)),row=s?view.details[s.id]:null;
     root.querySelector(`[data-slot-detail="${select.dataset.combatSlot}"]`).textContent=row?`${s.nombre}: ${row.baseline} → ${row.total}${row.destacado?' · '+dedicationNotice(row):''}`:'Sin asignar';
   }
   for(const [id,row] of Object.entries(view.details)){
     const el=root.querySelector(`[data-final="${id}"]`);if(!el)continue;
     const skill=c.skills.find(s=>s.id===Number(id));el.textContent=row.total;
     const detail=root.querySelector(`[data-breakdown="${id}"]`),markup=breakdown(c,d,skill,row);
     if(detail.innerHTML!==markup)detail.innerHTML=markup;
     const input=root.querySelector(`[data-normal="${id}"]`);
     if(input){input.min=row.baseline;input.max=row.baseline+Math.min(20,row.asignado+Math.max(0,remaining));}
   }
   next.disabled=budget.combat.sort((a,b)=>a-b).join(',')!=='5,10,15,20'||budget.normal!==50||!root.querySelectorAll('[data-normal]').length||[...root.querySelectorAll('[data-normal]')].some(i=>!i.validity.valid);
 }
 for(const select of root.querySelectorAll('[data-combat-slot]'))select.onchange=()=>{
   const value=Number(select.dataset.combatSlot);
   for(const [id,v] of Object.entries(d.pools))if(v===value&&c.skills.some(s=>s.id===Number(id)&&s.combate))delete d.pools[id];
   if(select.value)d.pools[select.value]=value;
   update();
 };
 for(const input of root.querySelectorAll('[data-normal]'))input.oninput=()=>{
   if(input.value===''){next.disabled=true;return;}
   const row=preview(c,d).details[input.dataset.normal],remaining=50-totals().normal;
   const max=row.baseline+Math.min(20,row.asignado+Math.max(0,remaining));
   const value=Math.max(row.baseline,Math.min(max,Math.trunc(Number(input.value))));
   input.value=value;d.pools[input.dataset.normal]=value-row.baseline;update();
 };
 update();
}
