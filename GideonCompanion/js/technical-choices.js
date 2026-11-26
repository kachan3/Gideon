// Core: Sombra_01_Habilidades_Insignia.md, Conocimiento Técnico.
export const TECHNICAL_SKILLS=[
 ['Cerrajería','cerrajeria','Abrir cerraduras, desarmar trampas mecánicas y manipular mecanismos de seguridad.'],
 ['Alquimia','alquimia','Preparar sustancias, venenos, antídotos y compuestos químicos.'],
 ['Disfraz','disfraz','Alterar la apariencia física y suplantar una identidad visual.'],
 ['Falsificación','falsificacion','Crear documentos falsos, réplicas de sellos e imitaciones de escritura y firmas.']
];
export const hasTechnicalKnowledge=(c,d)=>c.clases.find(p=>p.id===d.clase_id)?.nombre==='Senda de la Sombra';
export function technicalAllocations(c,d,{strict=false}={}){
 const values=d.conocimiento_tecnico??{};
 if(!values||typeof values!=='object'||Array.isArray(values))throw Error('Reparto de Conocimiento Técnico inválido.');
 const skills=TECHNICAL_SKILLS.map(([name])=>c.skills.find(s=>s.nombre===name)).filter(Boolean);
 if(Object.keys(values).length&&!hasTechnicalKnowledge(c,d))throw Error('Conocimiento Técnico requiere Senda de la Sombra.');
 if(Object.keys(values).some(id=>!skills.some(s=>String(s.id)===id)))throw Error('Habilidad de Conocimiento Técnico inválida.');
 for(const value of Object.values(values))if(!Number.isSafeInteger(value)||value<0||value>100)throw Error('Asigná entre 0 y 100 puntos por habilidad técnica.');
 if(strict&&hasTechnicalKnowledge(c,d)&&Object.values(values).reduce((sum,n)=>sum+n,0)!==100)throw Error('Repartí los 100 puntos de Conocimiento Técnico.');
 return hasTechnicalKnowledge(c,d)?skills.map(s=>({skill:s,puntos:values[s.id]??0})):[];
}
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function technicalEditor(c,d,{review=false}={}){
 const choices=technicalAllocations(c,d);if(!choices.length)return '';
 return `<section class="trait-choices" data-technical-choices><h3>Conocimiento Técnico</h3><p>Distribuí 100 puntos entre estas cuatro habilidades de profesión. Se suman a sus valores existentes, hasta el techo de 100 − Olvido.</p><div class="grid">${choices.map(({skill,puntos})=>`<label>${esc(skill.nombre)}${review?`<strong>+${puntos}</strong>`:`<input name="tecnico_${skill.id}" data-technical="${skill.id}" type="number" min="0" max="100" value="${puntos}" required>`}<small>${esc(TECHNICAL_SKILLS.find(([name])=>name===skill.nombre)[2])}</small></label>`).join('')}</div><p data-technical-budget aria-live="polite">${choices.reduce((sum,x)=>sum+x.puntos,0)} / 100 puntos asignados</p></section>`;
}
export function bindTechnicalEditor(root,c,d){
 for(const input of root.querySelectorAll('[data-technical]'))input.oninput=()=>{
  (d.conocimiento_tecnico??={})[input.dataset.technical]=Number(input.value);
  root.querySelector('[data-technical-budget]').textContent=`${Object.values(d.conocimiento_tecnico).reduce((sum,n)=>sum+n,0)} / 100 puntos asignados`;
 };
}
