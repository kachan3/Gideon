import {creationSkills} from './creation-rules.js';
import {lineageBonuses} from './lineage-rules.js';
import {creationTraitModifiers,originTraits} from './trait-rules.js';
import {professionGuarantees} from './profession-rules.js';
import {playerText} from './player-text.js';
import {markup} from './rulebook.js';
import {epiphanyDetails} from './class-guide.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function martialRequirements(c,option){
 return (c.requisitos_dotes??[]).filter(r=>r.dote_id===option.id).map(r=>[
  r.skill_id?c.skills.find(s=>s.id===r.skill_id)?.nombre+' '+r.valor_minimo+'%':'',
  r.dote_requerido_id?c.dotes.find(d=>d.id===r.dote_requerido_id)?.nombre:'',
  r.epifania_id?c.epifanias.find(e=>e.id===r.epifania_id)?.nombre:'',
  r.clase_id?c.clases.find(p=>p.id===r.clase_id)?.nombre:''
 ].filter(Boolean).join(' · ')).filter(Boolean).join(' · ');
}
export function initialTraitChoices(c,d){
 const traits=new Set([...originTraits(c,d).map(r=>r.id),...(c.clases_rasgos??[]).filter(r=>r.clase_id===d.clase_id&&r.es_insignia).map(r=>r.rasgo_id)]);
 const feats=new Set([...(c.clases_dotes??[]).filter(r=>r.clase_id===d.clase_id),...(c.linajes_dotes??[]).filter(r=>r.linaje_id===d.linaje_id)].map(r=>r.dote_id));
 const dedication=c.dedicaciones.find(r=>r.id===d.dedicacion_id)?.dote_otorgado_id;
 if(dedication)feats.add(dedication);
 for(const link of c.dotes_rasgos??[])if(feats.has(link.dote_id))traits.add(link.rasgo_id);
 const totals=creationSkills({skills:c.skills,atributos:d.atributos,pools:d.pools,bonos:lineageBonuses(c,d),garantias:professionGuarantees(c,d),minimos:creationTraitModifiers(c,d).garantias}).totals;
 return (c.elecciones_rasgos??[]).filter(e=>e.tipo!=='As'&&(traits.has(e.rasgo_id)||feats.has(e.dote_id))).map(e=>({...e,opciones:e.opciones.map(o=>({...o,poseida:feats.has(o.id),requisitos_texto:e.tipo==='Marcial'?martialRequirements(c,o):'',escuela:c.epifanias?.find(ep=>ep.id===(o.referencia_id??o.id))?.escuela,bloqueada:e.tipo==='Marcial'&&(feats.has(o.id)||(c.requisitos_dotes??[]).some(r=>r.dote_id===o.id&&((r.skill_id&&(totals[r.skill_id]??0)<r.valor_minimo)||(r.dote_requerido_id&&!feats.has(r.dote_requerido_id))||r.epifania_id||(r.clase_id&&r.clase_id!==d.clase_id))))}))}));
}
function field(e,value,{planning=false}={}){return `<div class="trait-choice" data-trait-choice="${esc(e.codigo)}"><h3>${esc(e.fuente)}</h3><label>${esc(e.titulo)}<select name="rasgo_${esc(e.codigo)}" required><option value="">Seleccionar…</option>${e.opciones.filter(o=>!(/placeholder/i.test(o.descripcion))).map(o=>`<option value="${esc(o.id)}" ${String(o.id)===String(value)?'selected':''} ${(planning&&e.tipo==='Marcial'?o.poseida:o.bloqueada)?'disabled':''}>${esc(o.nombre)}${o.bloqueada?' · Requisitos pendientes':''}</option>`).join('')}</select></label><div class="description" data-choice-description>${choiceDescription(e,e.opciones.find(o=>String(o.id)===String(value)))}</div></div>`;}
function choiceDescription(e,option){
 if(!option)return '';
 if(e.tipo==='Epifania')return epiphanyDetails({id:option.referencia_id??option.id,nombre:option.nombre,escuela:option.escuela??'',descripcion:option.descripcion},{open:true});
 return markup({id:'eleccion-'+e.codigo,texto:playerText(option.descripcion)})+(option.requisitos_texto?`<p class="hint" data-martial-requirements>Requiere: ${esc(option.requisitos_texto)}</p>`:'');
}
export function creationTraitChoices(c,d,{review=false,phase='all'}={}){
 const choices=initialTraitChoices(c,d);if(!choices.length)return '';
 return `<section class="trait-choices"><h2>Elegí tus capacidades</h2><p class="muted">Estas elecciones forman parte de tus Rasgos iniciales.</p>${choices.map(e=>review?`<p><strong>${esc(e.fuente)}</strong> · ${esc(e.opciones.find(o=>o.id===d.elecciones_rasgos?.[e.codigo])?.nombre??'Pendiente')}</p>`:field(e,d.elecciones_rasgos?.[e.codigo],{planning:phase==='class'})).join('')}</section>`;
}
export function bindCreationTraitChoices(root,c,d,onChange=()=>{}){
 root.querySelectorAll('[data-trait-choice] select').forEach(select=>select.onchange=()=>{
  const code=select.closest('[data-trait-choice]').dataset.traitChoice,e=initialTraitChoices(c,d).find(e=>e.codigo===code),option=e.opciones.find(o=>String(o.id)===select.value);
  if(option)(d.elecciones_rasgos??={})[code]=option.id;else if(d.elecciones_rasgos)delete d.elecciones_rasgos[code];
  select.closest('[data-trait-choice]').querySelector('[data-choice-description]').innerHTML=choiceDescription(e,option);
  onChange();
 });
}
export function validateInitialTraitChoices(c,d,{phase='all'}={}){for(const e of initialTraitChoices(c,d))if(!e.opciones.some(o=>o.id===d.elecciones_rasgos?.[e.codigo]&&(phase==='class'&&e.tipo==='Marcial'?!o.poseida:!o.bloqueada)))throw Error(e.titulo);}
export function traitChoicesSheet(p){
 const choices=p.elecciones_rasgos??[];if(!choices.length)return '';
 return `<section class="panel" id="trait-choices-sheet"><h2>Elecciones de Rasgos</h2>${choices.map(e=>{
  if(e.tipo==='As'){
   const saved=e.valor??[],eligible=e.opciones.filter(o=>(saved.find(a=>a.skill_id===o.id)?.puntos??0)<5);
   return `<div class="trait-choice"><h3>As Marcial</h3><p>${e.asignados} / ${e.puntos} puntos asignados · ${e.xp} XP en Dotes Valor</p>${saved.map(a=>`<p>${esc(p.skills.find(s=>s.id===a.skill_id)?.nombre)} · +${a.puntos} NE</p>`).join('')}${e.puntos>e.asignados?eligible.length?`<form data-ace class="row-form"><label>Habilidad marcial<select name="skill_id" required>${eligible.map(o=>`<option value="${o.id}">${esc(o.nombre)} · ${o.porcentaje}%</option>`).join('')}</select></label><label>Puntos adicionales<input name="puntos" type="number" min="1" max="${Math.min(5,e.puntos-e.asignados)}" value="1" required></label><button>Asignar puntos</button></form>`:'<p class="muted">Necesitás una habilidad marcial de al menos 80% y con menos de 5 puntos de As.</p>':'<p class="muted">Ganás un punto por cada 3 XP invertidos en Dotes Valor.</p>'}</div>`;
  }
  const option=e.opciones.find(o=>o.id===e.valor);
  return option?`<div class="list-item"><strong>${esc(e.fuente)}</strong><p>${esc(option.nombre)}</p>${option.descripcion?`<p class="description">${esc(option.descripcion)}</p>`:''}</div>`:`<form data-trait-answer="${esc(e.codigo)}" class="stack">${field(e)}<button>Guardar elección</button></form>`;
 }).join('')}</section>`;
}
export function bindTraitChoicesSheet(root,p,mutate,error){
 const guard=fn=>async ev=>{ev.preventDefault();const buttons=[...ev.target.querySelectorAll('button')];buttons.forEach(b=>b.disabled=true);try{await fn(ev);}catch(e){error(e);}finally{buttons.forEach(b=>b.disabled=false);}};
 root.querySelectorAll('[data-trait-answer]').forEach(form=>form.onsubmit=guard(()=>{const e=p.elecciones_rasgos.find(e=>e.codigo===form.dataset.traitAnswer),value=form.querySelector('select').value;return mutate('elecciones-rasgos','POST',{codigo:e.codigo,valor:e.opciones.find(o=>String(o.id)===value)?.id});}));
 root.querySelector('[data-ace]')?.addEventListener('submit',guard(ev=>{const form=ev.target,e=p.elecciones_rasgos.find(e=>e.tipo==='As'),skill_id=Number(form.elements.skill_id.value),points=Number(form.elements.puntos.value),valor=(e.valor??[]).map(a=>({...a})),old=valor.find(a=>a.skill_id===skill_id);if(old)old.puntos+=points;else valor.push({skill_id,puntos:points});return mutate('elecciones-rasgos','POST',{codigo:e.codigo,valor});}));
}
