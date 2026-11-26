import {playerDescription} from './player-text.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const honor=(c,d)=>d.clase_id===c.ordenes_y_juramento?.clase_honor_id;
function phraseFields(positions,selections={},locked=false){
 return positions.map(p=>{
  const value=selections[p.codigo]??p.seleccion??'',option=p.opciones.find(o=>o.codigo===value);
  const fixed=locked&&p.desbloqueada&&Boolean(value);
  return '<div class="oath-position" data-oath-position="'+p.codigo+'"><label>'+esc(p.nombre)+' · '+p.xp+' XP en dotes de Honor'+
   '<select name="juramento_'+p.codigo+'" '+(fixed?'disabled':'')+'><option value="">Elegir más adelante</option>'+p.opciones.map(o=>'<option value="'+esc(o.codigo)+'" '+(o.codigo===value?'selected':'')+'>'+esc(o.nombre)+'</option>').join('')+'</select></label>'+
   '<p class="oath-status muted">'+(p.desbloqueada?'Disponible por tu inversión de XP':'Preparación · se habilita a los '+p.xp+' XP')+'</p><div data-phrase-description>'+playerDescription(option?.descripcion??'Seleccioná una frase para conocer su efecto.')+'</div></div>';
 }).join('');
}
function oathPreview(positions,selections){return positions.map(p=>p.opciones.find(o=>o.codigo===(selections[p.codigo]??p.seleccion))?.nombre).filter(Boolean).join('. ');}
export function creationOrders(c,d,{review=false,affiliationOnly=false}={}){
 const data=c.ordenes_y_juramento;if(!data||!honor(c,d))return '';
 const isHonor=honor(c,d),order=data.ordenes.find(o=>o.codigo===d.orden),combo=data.combos.find(o=>o.id===d.combo_orden_id);
 const affiliation=review?'<p><strong>'+esc(order?.nombre??'Sin Orden')+'</strong></p>':
  '<label>Afiliación<select name="orden" '+(isHonor?'required':'')+'><option value="">'+(isHonor?'Seleccioná una Orden o Caballero Herrante':'Sin Orden')+'</option>'+data.ordenes.map(o=>'<option value="'+o.codigo+'" '+(o.codigo===d.orden?'selected':'')+'>'+esc(o.nombre)+'</option>').join('')+'</select></label>';
 const benefits=isHonor&&order?'<div class="hint" data-order-benefits>'+esc(order.descripcion)+'</div>':'';
 const combos=isHonor&&order?.combo?(review?'<p>Combo inicial: '+esc(combo?.nombre??'Sin elegir')+'</p>':
  '<label>Combo marcial inicial<select name="combo_orden_id" required><option value="">Seleccionar.</option>'+data.combos.map(o=>'<option value="'+o.id+'" '+(o.id===d.combo_orden_id?'selected':'')+'>'+esc(o.nombre)+'</option>').join('')+'</select></label>'+playerDescription(combo?.descripcion??'')):'';
 const plan=d.juramento??{},preview=oathPreview(data.posiciones,plan);
 const oath=isHonor&&!affiliationOnly?'<section class="order-segment" data-oath-planner><h2>Juramento Declarado</h2><p>Prepará las frases de tu juramento. Cada posición concede su beneficio al alcanzar su requisito de XP en dotes de Honor.</p>'+
  (review?'<p>'+esc(preview||'Frases por elegir')+'</p>':phraseFields(data.posiciones,plan))+
  '<div class="hint"><strong>Tu juramento preparado</strong><p data-oath-preview>'+esc(preview||'Seleccioná las frases que quieras preparar.')+'</p></div></section>':'';
 return '<section class="order-segment" data-order-segment><h2>Orden</h2><p>Elegí una Orden de caballería o continuá como Caballero Herrante, sin pertenecer a una Orden.</p>'+affiliation+benefits+combos+'</section>'+oath;
}
export function validateCreationOrders(c,d){
 if(!honor(c,d))return;
 const order=c.ordenes_y_juramento.ordenes.find(o=>o.codigo===d.orden);
 if(!order)throw Error('Elegí una Orden o Caballero Herrante.');
 if(order.combo&&!c.ordenes_y_juramento.combos.some(o=>o.id===d.combo_orden_id))throw Error('Elegí tu Combo marcial inicial.');
}
export function bindCreationOrders(root,c,d,refresh){
 root.querySelector('[name=orden]')?.addEventListener('change',e=>{d.orden=e.target.value;delete d.combo_orden_id;refresh();});
 root.querySelector('[name=combo_orden_id]')?.addEventListener('change',e=>{d.combo_orden_id=Number(e.target.value)||null;refresh();});
 root.querySelectorAll('[data-oath-position] select').forEach(select=>select.addEventListener('change',()=>{
  const code=select.closest('[data-oath-position]').dataset.oathPosition;d.juramento??={};
  if(select.value)d.juramento[code]=select.value;else delete d.juramento[code];refresh();
 }));
}
export function ordersSheet(p){
 const order=p.orden;
 if(!p.juramento&&!order)return '';
 const affiliation='<section class="panel" data-order-sheet><h2>Orden</h2><p><strong>'+esc(order?.nombre??'Sin afiliación registrada')+'</strong></p>'+
  (order?.honor_inicial!=null?'<p>Honor al crear el personaje: '+order.honor_inicial+(order.dados.length?' · 30 + ['+order.dados.join(', ')+']':'')+'</p>':'')+
  (order?.combo?'<p>Combo inicial: '+esc(order.combo)+'</p>':'')+'</section>';
 const oath=p.juramento;if(!oath)return affiliation;
 return affiliation+'<section class="panel" data-oath-sheet><h2>Juramento Declarado</h2><p>'+oath.xp+' XP invertidos en dotes de Honor.</p><p class="hint">'+esc(oath.texto||'Todavía no tenés frases activas.')+'</p><form data-oath-form class="stack">'+
  phraseFields(oath.posiciones,{},true)+'<button>Guardar juramento</button></form></section>';
}
export function bindOrdersSheet(root,p,mutate,error){
 const form=root.querySelector('[data-oath-form]');if(!form)return;
 form.querySelectorAll('[data-oath-position] select').forEach(select=>select.addEventListener('change',()=>{
  const parent=select.closest('[data-oath-position]'),position=p.juramento.posiciones.find(o=>o.codigo===parent.dataset.oathPosition);
  parent.querySelector('[data-phrase-description]').innerHTML=playerDescription(position.opciones.find(o=>o.codigo===select.value)?.descripcion??'');
 }));
 form.addEventListener('submit',async e=>{e.preventDefault();const button=form.querySelector('button');button.disabled=true;
  try{const selections={};for(const select of form.querySelectorAll('select'))if(select.value)selections[select.name.slice('juramento_'.length)]=select.value;
   await mutate('juramento','POST',{juramento:selections});
  }catch(e){error(e);}finally{button.disabled=false;}
 });
}
