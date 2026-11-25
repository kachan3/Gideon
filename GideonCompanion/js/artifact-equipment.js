const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function artifactEquipment(p,c){
 const items=(p.equipo?.inventario??[]).filter(i=>i.artefacto_id&&i.elemento.demo);
 const catalog=(c.artefactos_arcanos??[]).filter(a=>a.demo);
 return `<section class="panel" data-artifact-panel><h2>Artefactos arcanos</h2>${items.length?'':'<p>No tenés artefactos arcanos en tu equipo.</p>'}${items.map(i=>{
  const a=i.elemento,r=JSON.parse(a.reglas_json),full=i.cargas_actuales>=a.cargas_maximas,ready=i.equipado&&i.transportado;
  const btn=(op,label,cost=0)=>`<button type="button" data-artifact-item="${i.id}" data-artifact-op="${op}" ${!ready||i.cargas_actuales<cost?'disabled':''}>${label}</button>`;
  return `<article class="inventory-row" data-artifact-row="${i.id}"><div><h3>${esc(i.nombre)}</h3><p><strong>${i.cargas_actuales} / ${a.cargas_maximas} cargas</strong> · Nivel ${a.nivel_item??1} · ${esc(i.ubicacion)}${i.artefacto_activo?' · Activo':''}</p><p>${esc(a.herramienta_compatible)}</p><details><summary>Reglas del artefacto</summary><p class="description" style="white-space:pre-line">${esc(a.descripcion)}</p></details><p class="muted">Las acciones, duración, distancia y condiciones se resuelven en mesa. Peso por definir.</p><div class="item-actions">${r.tipo==='varita'?btn('luz',i.artefacto_activo?'Otra hora de luz · 1 carga':'Encender · 1 PA · 1 carga',1)+btn('destello','Destello · 2 PA · 3 cargas',3):r.tipo==='mastin'?btn(i.artefacto_activo?'minuto':'manifestar',i.artefacto_activo?'Otro minuto · 1 carga':'Manifestar · 2 PA · 1 carga',1):''}${r.tipo!=='blunderblaze'&&i.artefacto_activo?btn('apagar',r.tipo==='varita'?'Apagar · 1 PA':'Finalizar manifestación'):''}</div>${r.ataque?'<p>El ataque está disponible en la sección Ataques de la ficha al tener el artefacto en una mano'+(r.tipo==='mastin'?' y el cráneo manifestado':'')+'.</p>':''}<div class="grid"><label>Maná para recargar<input type="number" data-artifact-mana="${i.id}" min="1" max="99" value="1"></label><button type="button" data-artifact-item="${i.id}" data-artifact-op="recargar_mana" ${full?'disabled':''}>Recargar: ${esc(a.tasa_conversion_mana_cargas)}</button></div><p>${esc(a.tiempo_recarga_natural)}</p>${r.tipo!=='mastin'?`<label>Día de la partida<input data-artifact-day="${i.id}" maxlength="80" placeholder="Por ejemplo: día 1"></label>`:''}<label><input type="checkbox" data-artifact-condition="${i.id}"> Se cumplieron estas condiciones de recarga en la partida</label><button type="button" data-artifact-item="${i.id}" data-artifact-op="recarga_natural" ${full?'disabled':''}>${r.tipo==='mastin'?'Recuperar 1 carga tras 8 horas de inactividad':'Aplicar recarga natural del día'}</button><p class="bad" data-artifact-error role="alert"></p></div></article>`;
 }).join('')}${catalog.length?`<details><summary>Catálogo de artefactos de la demo</summary>${catalog.map(a=>`<article><h3>${esc(a.nombre)}</h3><p>${a.cargas_maximas} cargas · ${esc(a.escuela)}</p><p class="description" style="white-space:pre-line">${esc(a.descripcion)}</p><button type="button" data-artifact-add="${a.id}">Añadir al equipo</button></article>`).join('')}<p class="muted">Añadir registra un objeto obtenido en la partida. No es una compra con oro.</p></details>`:''}</section>`;
}
export function bindArtifactEquipment(root,request,refresh=()=>{}){
 root.querySelectorAll('[data-artifact-op],[data-artifact-add]').forEach(button=>button.onclick=async()=>{
  const panel=button.closest('[data-artifact-panel]'),id=Number(button.dataset.artifactItem),op=button.dataset.artifactOp;
  const error=button.closest('[data-artifact-row]')?.querySelector('[data-artifact-error]');
  button.disabled=true;if(error)error.textContent='';
  try{
   if(button.dataset.artifactAdd)await request('inventario',{artefacto_id:Number(button.dataset.artifactAdd)});
   else await request('artefactos',{inventario_id:id,operacion:op,...(op==='recargar_mana'?{cantidad:Number(panel.querySelector(`[data-artifact-mana="${id}"]`).value)}:{}),...(op==='recarga_natural'?{condicion:panel.querySelector(`[data-artifact-condition="${id}"]`).checked,dia:panel.querySelector(`[data-artifact-day="${id}"]`)?.value}:{})});
   refresh();
  }catch(e){if(error)error.textContent=e.message;else{let p=panel.querySelector('[data-artifact-catalog-error]');if(!p){p=document.createElement('p');p.dataset.artifactCatalogError='';p.className='bad';panel.append(p);}p.textContent=e.message;}}
  finally{if(button.isConnected)button.disabled=false;}
 });
}
