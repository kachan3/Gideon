import {playerDescription} from './player-text.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const xpLabel=i=>i.nombre==='As Marcial'?' XP en dotes de Valor':' XP dedicadas';
function traitList(items){
 return items.map(i=>'<details class="list-item"><summary>'+esc(i.nombre)+(i.xp_requerida>0?' · '+i.xp_requerida+xpLabel(i):'')+'</summary>'+playerDescription(i.descripcion)+'</details>').join('');
}
export function pathSummary(c,d){
 const path=c.clases.find(p=>p.id===d.clase_id);
 if(!path)return '<p class="muted">Elegí una Senda para conocer sus rasgos y capacidades.</p>';
 const traits=(c.clases_rasgos??[]).filter(r=>r.clase_id===path.id&&r.es_insignia);
 const progression=(c.clases_rasgos??[]).filter(r=>r.clase_id===path.id&&!r.es_insignia);
 const grants=(c.clases_dotes??[]).filter(g=>g.clase_id===path.id).map(g=>c.dotes.find(d=>d.id===g.dote_id)).filter(Boolean);
 const origin=(c.clases_origen??[]).find(o=>o.clase_id===path.id);
 const choices=origin?JSON.parse(origin.elecciones):[],notes=origin?JSON.parse(origin.notas):[];
 return '<section class="path-summary"><h3>'+esc(path.nombre)+'</h3><p>'+esc(path.descripcion)+'</p>'+
  '<h4>Rasgos iniciales</h4>'+traitList(traits)+
  (grants.length?'<h4>Dotes iniciales</h4>'+traitList(grants):'')+
  (progression.length?'<h4>Progresión de Senda</h4>'+traitList(progression)+'<p class="hint">Estos rasgos se reciben al alcanzar la XP dedicada requerida, sin coste adicional.</p>':'')+
  (choices.length?'<h4>Elecciones iniciales</h4><ul>'+choices.map(v=>'<li>'+esc(v)+'</li>').join('')+'</ul>':'')+
  notes.map(v=>'<p class="hint">'+esc(v)+'</p>').join('')+'</section>';
}
export function pathTraitsSheet(p){
 if(!p.rasgos_senda?.length)return '';
 return '<section class="panel" data-path-traits><h2>Rasgos de Senda</h2><p class="hint">La XP dedicada es la invertida en elementos de esa Senda. Al alcanzar la XP requerida recibís el rasgo automáticamente, sin coste adicional.</p>'+
 p.sendas.map(s=>{
  const traits=p.rasgos_senda.filter(r=>r.clase_id===s.id),xp=p.pools.find(x=>x.clase_id===s.id)?.xp_invertida??0;
  return '<h3>'+esc(s.nombre)+' · '+xp+' XP dedicadas</h3>'+traits.map(r=>
   '<details class="list-item" data-path-trait="'+r.id+'"><summary>'+esc(r.nombre)+' · '+
   (r.es_insignia?'Inicial':r.xp_requerida+xpLabel(r))+' <span class="tag">'+(r.activo?'Disponible':'Bloqueado')+'</span></summary>'+
   playerDescription(r.descripcion)+(r.es_insignia?'':'<p>Progreso: '+r.xp_dedicada+' / '+r.xp_requerida+xpLabel(r)+'.</p>')+'</details>').join('');
 }).join('')+'</section>';
}
