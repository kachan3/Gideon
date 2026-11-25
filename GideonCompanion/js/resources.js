import {icon} from './icons.js';
import {damagePreview,ZONAS,FUENTES,MEDIOS} from './combat-rules.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let omenLayout=null;
export function resourceMarkup(p){
 const d=p.derivados,maxMana=d.mana_max,maxStamina=d.stamina_max??d.stamina;
 if(omenLayout?.id!==p.id||omenLayout.checked.filter(Boolean).length!==p.omen_actual)omenLayout={id:p.id,checked:[p.omen_actual>=1,p.omen_actual>=2]};
 return `<section class="panel resource-panel"><div class="item-head"><h2>Estado y recursos</h2><button type="button" class="damage-button" id="take-damage">${icon('heart')} Recibir daño</button></div>
 <div class="wound-tokens" aria-label="Heridas"><span title="Heridas actuales">${icon('heart')}${p.heridas_actuales}</span><span title="Heridas graves">Graves ${p.heridas_graves}</span><span title="Heridas mortales">Mortales ${p.heridas_mortales}</span></div>
 ${p.ultimo_impacto?.zona?`<p>Último impacto · ${esc(p.ultimo_impacto.zona)} · ${p.ultimo_impacto.heridas} heridas${p.ultimo_impacto.mortal?` · Hemorragia ${p.ultimo_impacto.ne_impacto==null?'⌊NE del golpe / 2⌋':Math.floor(p.ultimo_impacto.ne_impacto/2)}`:''}</p>`:''}
 ${p.cansancio?`<p>Cansancio ${p.cansancio}${p.cansancio<4?` · −${p.cansancio} acciones por turno`:''} </p>`:''}
 ${p.heridas_actuales>p.derivados.mh&&p.derivados.estado==='Agonizando'?'<p>También está Desmayado.</p>':''}
 <p>Heridas leves ${Math.max(0,p.heridas_actuales-p.bloque_grave)} · Bloque grave ${p.bloque_grave}</p>
 <details><summary>Descansos y recuperación</summary><form id="rest-form" class="stack">
 <label>Actividad<select name="tipo"><option value="Pausa">Take a Break · 10 minutos · recuperar Stamina</option><option value="Corto">Descanso corto · al menos 1 hora</option><option value="Largo">Descanso largo · 8 horas de sueño</option><option>Curación natural</option></select></label>
 <label hidden data-short>Horas completas<input name="horas" type="number" min="1" max="999" value="1"></label><label hidden data-short><input name="meditar" type="checkbox"> Dediqué estas horas exclusivamente a meditar (1 PM por hora)</label>
 <label hidden data-daily>Día de campaña<input name="dia" type="number" min="1" placeholder="Número de día"></label>
 <label hidden data-long><input name="necesidades" type="checkbox"> Comí, bebí y tuve temperatura tolerable (−1 Cansancio)</label><small hidden data-natural>Sanás 1 herida leve al cumplirse el día.</small>
 <button>Registrar actividad completada</button></form></details>
 <div class="resource-meter"><div class="item-head"><label for="mana-progress">Maná</label><strong>${d.mana_actual} / ${maxMana}</strong></div><div class="meter-wrap"><progress id="mana-progress" class="${d.excedido?'over-limit':''}" value="${d.mana_actual}" max="${Math.max(1,maxMana)}" aria-valuetext="${d.mana_actual} disponibles de ${maxMana}; máximo reducido por daño crónico">${d.mana_actual}</progress></div><div class="item-head"><small>Límite seguro ${d.limite_seguro}</small><small>Consumido ${p.mana_consumido}</small></div></div>
 <form id="mana-form" class="resource-spend"><label>Maná a gastar<input name="cantidad" type="number" min="1" max="${d.mana_actual}" value="1" ${d.mana_actual<=0?'disabled':''} required></label><button ${d.mana_actual<=0?'disabled':''}>Gastar maná</button></form>
 <div class="chronic-value" aria-live="polite">${icon('Fuego')}<span>Daño crónico</span><strong>${p.dano_cronico}</strong></div>
 <div class="resource-meter"><div class="item-head"><label for="stamina-progress">Stamina</label><strong>${d.stamina} / ${maxStamina}</strong></div><progress id="stamina-progress" value="${d.stamina}" max="${Math.max(1,maxStamina)}">${d.stamina}</progress></div>
 <form id="stamina-form" class="resource-spend"><label>Stamina a gastar<input name="cantidad" type="number" min="1" max="${d.stamina}" value="1" required></label><button ${d.stamina<=0?'disabled':''}>Gastar Stamina</button></form>
 <fieldset class="omen-tokens"><legend>Omen</legend>${[1,2].map(n=>`<label><input type="checkbox" name="omen-token" aria-label="Omen ${n}" ${omenLayout.checked[n-1]?'checked':''}>${icon('star')}</label>`).join('')}</fieldset>
 <details id="state-adjustments"><summary>Ajustes del narrador</summary><form id="state-form" class="stack">${[['heridas_actuales','Heridas actuales',999],['heridas_graves','Heridas graves (incluye mortales)',999],['cansancio','Cansancio',5],['muerte_por_impacto','Muerte por impacto (0 o 1)',1],['heridas_mortales','Heridas mortales',100],['mana_consumido','Maná consumido',9999],['dano_cronico','Daño crónico (corrección)',9999],['stamina_gastada','Stamina gastada',999]].map(([key,label,max])=>`<label>${label}<input name="${key}" type="number" step="${key==='heridas_actuales'?'any':1}" min="0" max="${max}" value="${p[key]}" required></label>`).join('')}<button>Guardar estado</button></form></details>
 ${p.estados.map(e=>`<span class="tag">${esc(e.nombre)} ${e.es_graduado?e.grado:''}</span>`).join('')}</section>`;
}
export function bindResources(p,{mutate,error,damageTypes}){
 const bind=(id,fn)=>document.getElementById(id).onsubmit=async event=>{event.preventDefault();try{await fn(new FormData(event.target));}catch(e){error(e);}};
 for(const [id,available,resource] of [['mana-form',p.derivados.mana_actual,'Mana'],['stamina-form',p.derivados.stamina,'Stamina']]){
  const form=document.getElementById(id),input=form.querySelector('input'),button=form.querySelector('button');
  const validate=()=>{button.disabled=!Number.isSafeInteger(Number(input.value))||Number(input.value)<1||Number(input.value)>available;};input.oninput=validate;validate();
  bind(id,async f=>{const amount=Number(f.get('cantidad'));if(!Number.isSafeInteger(amount)||amount<1||amount>available)throw Error('El gasto supera el recurso disponible');button.disabled=true;try{await mutate('recursos','POST',{recurso:resource,cantidad:amount});}catch(e){validate();throw e;}});
 }
 document.querySelectorAll('[name=omen-token]').forEach(input=>input.onchange=async()=>{try{omenLayout={id:p.id,checked:[...document.querySelectorAll('[name=omen-token]')].map(i=>i.checked)};await mutate('estado','PATCH',{omen_actual:omenLayout.checked.filter(Boolean).length});}catch(e){error(e);}});
 document.getElementById('take-damage').onclick=()=>damageDialog(p,{mutate,damageTypes});
 const rest=document.getElementById('rest-form');
 const refresh=()=>{const tipo=rest.elements.tipo.value;
  for(const [selector,visible] of [['short',tipo==='Corto'],['long',tipo==='Largo'],['daily',['Largo','Curación natural'].includes(tipo)],['natural',tipo==='Curación natural']]){
   rest.querySelectorAll('[data-'+selector+']').forEach(el=>{el.hidden=!visible;});
  }
  rest.elements.dia.required=!rest.elements.dia.closest('label').hidden;
 };
 rest.elements.tipo.onchange=refresh;refresh();
 bind('rest-form',async f=>{const button=rest.querySelector('button');button.disabled=true;try{await mutate('descanso','POST',{tipo:f.get('tipo'),horas:Number(f.get('horas')),dia:Number(f.get('dia')),meditar:f.has('meditar'),necesidades:f.has('necesidades')});}finally{button.disabled=false;}});
}
function damageDialog(p,{mutate,damageTypes}){
 const overlay=document.createElement('div');overlay.className='companion-dialog-backdrop';overlay.innerHTML=`<section class="companion-dialog" role="dialog" aria-modal="true" aria-labelledby="damage-title"><h2 id="damage-title">Recibir daño</h2><form class="stack"><label>Daño recibido<input name="cantidad" type="number" min="0" max="9999" step="1" value="1" required></label><div class="grid"><label>Fuente<select name="fuente"><option value="">Sin indicar</option>${FUENTES.map(x=>`<option>${x}</option>`).join('')}</select></label><label>Medio<select name="medio"><option value="">Sin indicar</option>${MEDIOS.map(x=>`<option>${x}</option>`).join('')}</select></label></div><label>Tipo de daño<select name="tipo_dano">${damageTypes.map(t=>`<option>${esc(t)}</option>`).join('')}</select></label><label><input name="resuelto" type="checkbox"> Daño ya resuelto (sin aplicar defensas)</label><label><input name="suerte" type="checkbox" ${p.omen_actual<1?'disabled':''}> Suerte de Héroe · ignorar este daño gastando 1 Omen con aprobación del DM</label><label>NE del golpe (si corresponde)<input type="number" min="0" max="999" name="ne_impacto"></label><label data-zone hidden>Zona de impacto<select name="zona"><option value="">Tirar 1d6</option>${ZONAS.map(z=>`<option>${z}</option>`).join('')}</select></label><p class="damage-preview" aria-live="polite"></p><p class="bad" data-error role="alert" hidden></p><div class="item-actions"><button type="button" data-cancel>Cancelar</button><button type="submit" class="primary">Aplicar daño</button></div></form></section>`;
 const previous=document.activeElement,form=overlay.querySelector('form'),submit=form.querySelector('[type=submit]'),err=form.querySelector('[data-error]');let busy=false;
 const data=()=>{const f=new FormData(form);return {cantidad:Number(f.get('cantidad')),tipo_dano:f.get('tipo_dano'),fuente:f.get('fuente')||null,medio:f.get('medio')||null,zona:f.get('zona'),ne_impacto:f.get('ne_impacto')===''?null:Number(f.get('ne_impacto')),modo:f.has('suerte')?'Omen':f.has('resuelto')?'Final':'Bruto'};};
 const preview=()=>{try{const result=damagePreview(p,data());overlay.querySelector('[data-zone]').hidden=!result.grave;overlay.querySelector('.damage-preview').textContent=`${result.heridas} heridas${result.grave?' · Herida grave':''}${result.mortal?' · Herida mortal':''}${result.mitigacion?' · Mitigado '+result.mitigacion:''}`;err.hidden=true;submit.disabled=false;}catch(e){err.textContent=e.message;err.hidden=false;submit.disabled=true;}};
 const close=()=>{overlay.remove();document.removeEventListener('keydown',keyboard);if(previous?.isConnected)previous.focus();};
 const keyboard=e=>{if(e.key==='Escape'&&!busy){e.preventDefault();close();}if(e.key==='Tab'){const controls=[...form.querySelectorAll('input,select,button')].filter(x=>!x.disabled),first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}};
 form.querySelectorAll('input,select').forEach(i=>i.oninput=preview);form.querySelector('[data-cancel]').onclick=()=>{if(!busy)close();};form.onsubmit=async e=>{e.preventDefault();if(busy)return;busy=true;submit.disabled=true;try{await mutate('dano','POST',data());close();}catch(e){err.textContent=e.message;err.hidden=false;submit.disabled=false;busy=false;}};
 document.body.append(overlay);document.addEventListener('keydown',keyboard);preview();form.querySelector('input').focus();
}
