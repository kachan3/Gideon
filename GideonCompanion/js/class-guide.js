import {pathSummary} from './path-ui.js';
import {playerText} from './player-text.js';
import {markup} from './rulebook.js';
import {schoolSkill} from './magic-rules.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Core §13.3: the school describes its domain; the Epiphany grants actual abilities.
export const FLOWS=[
 ['Ivganny','Mente, pensamientos e ideas. Influye en los sentidos, la percepción y las decisiones mediante una manipulación invisible.'],
 ['Cronibor','El flujo del tiempo. Permite explorar acontecimientos pasados y futuros y alterar el ritmo del tiempo mediante el repertorio aprendido.'],
 ['Ignamor','Termodinámica: energía, calor, frío, fuego y rayo.'],
 ['Gelmir','Leyes físicas del mundo material: gravedad, densidad, inercia, masa y materia.'],
 ['Yrgrammar','Energía de la muerte y decaimiento: descomposición, desgaste y daño Necrótico.'],
 ['Naial','Almas y emociones que se manifiestan como constructos, proyectiles, barreras y otras creaciones tangibles.']
];
const paths={
 'Senda del Arcanista':['Arcanist.jpg','Preparás conjuros con los efectos de tus Epifanías. Elegís herramienta y artefacto, administrás Maná y combinás los componentes de tu repertorio.'],
 'Senda del Berserker':['Berserker.jpg','Acumulás Ira al combatir y ante las heridas graves. Convertís esa Ira en daño y Vida Temporal; al entrar en Trance, el poder exige Maná y limita tus defensas.'],
 'Senda del Hierofante':['Hierophant.jpg','Elegís un Dogma y sostenés su Plegaria. Manifestás Intervenciones con Maná y Milagros con Maná y Omen.'],
 'Senda del Honor':['Honor.jpg','Tu Honor sostiene tus compromisos y capacidades. Elegís una Orden o el camino Herrante y podés preparar un Juramento para su futura progresión.'],
 'Senda de la Sombra':['Silente.png','Usás Presteza para acciones tácticas y Conocimiento Técnico para aprovechar tus habilidades. La inversión en la Senda abre Sentidos Tétricos y Artes Sombrías.'],
 'Senda del Valor':['Valor.jpg','Combinás ataques con Danza de Golpes, resistís el Miedo con Nervios de Acero y elegís un Dote Marcial con Entrenamiento Superior.']
};
export function flowGuide(){
 return `<section class="flow-guide"><h3>Los seis flujos arcanos</h3><p class="muted">Cada flujo representa un aspecto del mundo. Tus Epifanías determinan qué efectos, trucos y místicas podés usar.</p><dl class="flow-grid">${FLOWS.map(([name,text])=>`<div><dt>${name}</dt><dd>${text}</dd></div>`).join('')}</dl></section>`;
}
export function epiphanyDetails(ep,{open=false,owned=false}={}){
 if(!ep)return '';
 const text=playerText(ep.descripcion).replace(/\s*[—–-]\s*canónico[^\n]*/gi,'');
 return `<details class="list-item epiphany-detail" data-epiphany="${ep.id}" ${open?'open':''}><summary>${esc(ep.nombre)} · ${esc(ep.escuela)}${owned?' · Aprendida':''}</summary><article class="epiphany-rules">${markup({id:'epifania-'+ep.id,texto:text})}</article></details>`;
}
export function selectedEpiphany(c,d){
 const value=d.elecciones_rasgos?.epifania;
 const option=c.elecciones_rasgos?.find(e=>e.tipo==='Epifania')?.opciones.find(o=>String(o.id)===String(value));
 return option?c.epifanias.find(e=>e.id===(option.referencia_id??option.id)):null;
}
export function epiphanyRecommendations(c,d,{pool=false}={}){
 const ep=selectedEpiphany(c,d);if(!ep)return '';
 const skill=schoolSkill(c,ep.escuela),parent=c.skills.find(s=>s.id===skill?.padre_id);
 return `<aside class="epiphany-advice" data-epiphany-advice><h3>Recomendación · ${esc(ep.nombre)}</h3><p>${pool?`Priorizá un bono de combate en <strong>${esc(skill?.nombre??ep.escuela)}</strong> para mejorar las tiradas de esta Epifanía.`:`Asigná un valor alto a <strong>${esc(parent?.nombre??'Arcana')}</strong>: de este atributo parte <strong>${esc(skill?.nombre??ep.escuela)}</strong>, el flujo de tu Epifanía. En el reparto de habilidades podés reforzarlo con un bono de combate.`}</p><p class="muted">Voluntad aporta Maná y potencia a los efectos que la usan; Inteligencia determina el límite de PL por aspecto. Estas recomendaciones te orientan; elegís libremente tus valores.</p></aside>`;
}
export function markRecommendedSkills(root,c,d){
 root.querySelectorAll('.epiphany-recommended').forEach(el=>el.classList.remove('epiphany-recommended'));
 const ep=selectedEpiphany(c,d),skill=ep&&schoolSkill(c,ep.escuela);if(!skill)return;
 root.querySelector(`[data-skill-row="${skill.id}"]`)?.classList.add('epiphany-recommended');
 root.querySelector(`[name="attr_${skill.padre_id}"]`)?.closest('label')?.classList.add('epiphany-recommended');
}
export function classGuide(c,d){
 const path=c.clases.find(p=>p.id===d.clase_id);
 const cards=c.clases.map(p=>{const [image,gameplay]=paths[p.nombre]??[];return `<button type="button" class="class-card ${p.id===d.clase_id?'selected':''}" data-class-id="${p.id}" aria-pressed="${p.id===d.clase_id}">${image?`<img src="src/${image}" alt="Ilustración de ${esc(p.nombre)}" loading="lazy">`:''}<span><strong>${esc(p.nombre)}</strong><small>${esc(gameplay??p.descripcion)}</small></span></button>`;}).join('');
 const gameplay=paths[path?.nombre]?.[1];
 return `<div class="class-cards" aria-label="Clases disponibles">${cards}</div>${path?`<section class="class-gameplay"><h3>Cómo se juega</h3><p>${esc(gameplay??path.descripcion)}</p></section>`:''}${pathSummary(c,d)}${path?.nombre==='Senda del Arcanista'?flowGuide():''}`;
}
export function arcanistSheet(c,p){
 if(!p.sendas.some(s=>s.nombre==='Senda del Arcanista'))return '';
 const learned=new Set(p.adquisiciones.filter(a=>a.epifania_id).map(a=>a.epifania_id));
 const epiphanies=c.epifanias.filter(e=>learned.has(e.id));
 return `<section class="panel" data-arcanist-guide><h2>Repertorio del Arcanista</h2><p>Las Epifanías aprendidas te conceden los siguientes efectos, trucos y místicas.</p>${epiphanies.map(e=>epiphanyDetails(e,{owned:true})).join('')||'<p class="muted">Elegí tu Epifanía inicial en Elecciones de Rasgos.</p>'}${flowGuide()}<details><summary>Consultar otras Epifanías</summary>${c.epifanias.filter(e=>!learned.has(e.id)&&!(/placeholder/i.test(e.descripcion))).map(e=>epiphanyDetails(e)).join('')}</details></section>`;
}
