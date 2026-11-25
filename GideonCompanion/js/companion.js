import {creationOrders,bindCreationOrders,validateCreationOrders,ordersSheet,bindOrdersSheet} from './orders-ui.js';
import {setupNPCViews} from './npcs.js';
import {creationTraitChoices,bindCreationTraitChoices,validateInitialTraitChoices,traitChoicesSheet,bindTraitChoicesSheet} from './trait-choices-ui.js';
import {openGear,gearLauncher} from './gear-market.js';
import {artifactEquipment,bindArtifactEquipment} from './artifact-equipment.js';
import {openRulebook} from './rulebook.js';
import {installReferences} from './references.js';
import { FIXED_VALUES, ATTRIBUTE_ORDER, remainingValues, sameValues } from './creation-rules.js';
import { poolEditor, bindPoolEditor, professionMarkup, creationWeight } from './creation-pools.js';
import {renderInventory,equipmentMainMarkup} from './inventory.js';
import {investXP,confirmAction} from './dialogs.js';
import {resourceMarkup,bindResources} from './resources.js';
import {openDice} from './dice-popup.js';
import {renderSpellcasting} from './spellcasting.js';
import {lineageEditor,bindLineageEditor,lineageSheet,initialXP} from './lineage-ui.js';
import {lineageBonuses} from './lineage-rules.js';
import {pathSummary,pathTraitsSheet} from './path-ui.js';
import {creationPathChoices,devotionSheet,isManifestation} from './path-choices-ui.js';
import {backgroundAnswers,originAnswers,backgroundEditor,bindBackground,backgroundReview,backgroundSheet} from './background-ui.js';
import {professionChoice,bindProfession,professionsSheet,professionReview} from './profession-ui.js';
import {traitSheet,originTraitEditor} from './trait-ui.js';
import {selectedProfession} from './profession-rules.js';
import {currentToken,savedCharacters,saveAccess,selectAccess,clearAccess,accessHeaders,copyToken} from './access.js';
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let catalog,character,step=0,draft={nombre:'',modo_campana:'enclave',atributos:{},pools:{}};
const needsOrder=()=>draft.clase_id===catalog?.ordenes_y_juramento?.clase_honor_id;
const steps=['Identidad y linaje','Atributos','Trasfondo','Senda y habilidades','Orden y juramento','Confirmar'];
let attributeRoll=null;
function orderedAttributes(){return catalog.skills.filter(s=>s.tipo==='Atributo').sort((a,b)=>ATTRIBUTE_ORDER.indexOf(a.nombre)-ATTRIBUTE_ORDER.indexOf(b.nombre));}
function attributePool(){return (draft.generacion_modo??'Fijo')==='Fijo'?FIXED_VALUES:(attributeRoll?.valores??[]);}
function attributeEditor(attrs){
 const mode=draft.generacion_modo??'Fijo',locked=attributeRoll?.modo==='Ordenado',pool=attributePool();
 return `<label>Método de atributos<select id="generation-mode"><option value="Fijo" ${mode==='Fijo'?'selected':''} ${locked?'disabled':''}>Arreglo fijo</option><option value="Libre" ${mode==='Libre'?'selected':''} ${locked?'disabled':''}>Dados 3d4 × 5 · asignación libre</option><option value="Ordenado" ${mode==='Ordenado'?'selected':''} ${attributeRoll?.mulligan_usado?'disabled':''}>Dados 3d4 × 5 · orden estricto</option></select></label>
 <p class="hint">${mode==='Fijo'?'Distribuye 50, 45, 40, 35, 30, 30, 30, 20, 20 y 15. Los valores se reservan al seleccionarlos.':mode==='Libre'?'Tira diez resultados de 3d4 × 5 y repártelos libremente. Puedes volver a tirar o usar el arreglo fijo.':'Antes de tirar te comprometes al orden Fuerza → Vitalidad → Agilidad → Instinto → Voluntad → Inteligencia → Carácter → Melee → Proyectiles → Arcana. Solo puedes abandonar el compromiso con un Mulligan válido.'}</p>
 <div class="item-actions">${mode==='Fijo'?'<button id="fill-attributes" type="button">Asignar en orden</button><button id="clear-attributes" type="button">Limpiar asignación</button>':`<button id="roll-attributes" type="button" ${locked?'disabled':''}>${attributeRoll?'Volver a tirar (re-roll)':'Tirar atributos (3d4 × 5)'}</button>${mode==='Libre'&&attributeRoll?'<button id="fill-attributes" type="button">Asignar en orden</button><button id="clear-attributes" type="button">Limpiar asignación</button>':''}${attributeRoll?.puede_mulligan?'<button id="mulligan-attributes" type="button">Usar Mulligan</button>':''}`}</div>
 ${locked?`<p class="${attributeRoll.puede_mulligan?'hint':'muted'}">${attributeRoll.puede_mulligan?'Cumples las tres condiciones: menos de dos atributos >40, más de tres <20 y ninguno de combate >40. Puedes usar el Mulligan para reasignar, repetir o volver al arreglo fijo.':'Orden estricto confirmado. Esta tirada no cumple las tres condiciones del Mulligan; no puede repetirse ni reasignarse.'}</p>`:''}
 ${attributeRoll?.mulligan_usado?'<p class="hint">Mulligan utilizado; no hay otro Mulligan disponible.</p>':''}
 <p id="attribute-remaining" aria-live="polite"></p>
 <div class="grid">${attrs.map(a=>`<label>${esc(a.nombre)}<select name="attr_${a.id}" required ${mode!=='Fijo'&&(!attributeRoll||locked)?'disabled':''}>${options([...new Set(pool)].sort((a,b)=>b-a).map(v=>({id:v,nombre:v})),draft.atributos[a.id])}</select><small id="attr-level-${a.id}"></small></label>`).join('')}</div>
 ${mode!=='Fijo'&&attributeRoll?`<details><summary>Ver dados y resultados originales · tirada ${attributeRoll.historial.length}</summary><div class="grid">${attributeRoll.dados.map((dice,i)=>`<p><small>${esc(attrs[i].nombre)}</small><br>${dice.join(' + ')} = ${dice.reduce((a,b)=>a+b,0)} × 5 = <strong>${attributeRoll.valores[i]}</strong></p>`).join('')}</div></details>`:''}`;
}
function updateAttributeChoices(){
 const pool=attributePool();
 for(const a of orderedAttributes()){
   const select=$(`[name="attr_${a.id}"]`),available=remainingValues(pool,draft.atributos,a.id);
   for(const option of select.options){if(!option.value)continue;const n=Number(option.value),count=available.filter(v=>v===n).length;option.disabled=count===0;option.textContent=`${n}${count===0?' · ya asignado':count>1?' · '+count+' disponibles':''}`;}
   $(`#attr-level-${a.id}`).textContent=draft.atributos[a.id]?`Nivel ${Math.floor(draft.atributos[a.id]/10)}`:'Sin asignar';
 }
 const remaining=remainingValues(pool,draft.atributos),count=Object.values(draft.atributos).filter(v=>v>0).length;
 $('#attribute-remaining').textContent=pool.length?`${count}/10 asignados · ${remaining.length?'Disponibles: '+remaining.join(', '):'Todos los valores están asignados.'}`:'Tira los dados para obtener tus diez valores.';
 $('#next').disabled=!sameValues(Object.values(draft.atributos).filter(v=>v>0),pool)||pool.length!==10;
}
function bindAttributeEditor(attrs){
 $('#generation-mode').onchange=e=>{saveStep();draft.generacion_modo=e.target.value;draft.atributos={};if(draft.generacion_modo==='Ordenado'){attributeRoll=null;delete draft.tirada_id;}renderWizard();};
 const assign=()=>{attrs.forEach((a,i)=>draft.atributos[a.id]=attributePool()[i]);renderWizard();};
 if($('#fill-attributes'))$('#fill-attributes').onclick=assign;
 if($('#clear-attributes'))$('#clear-attributes').onclick=()=>{draft.atributos={};renderWizard();};
 for(const a of attrs)$(`[name="attr_${a.id}"]`).onchange=e=>{draft.atributos[a.id]=Number(e.target.value);updateAttributeChoices();};
 const roll=async(action)=>{
   const buttons=[...document.querySelectorAll('#wizard-body button')];buttons.forEach(b=>b.disabled=true);
   $('#next').disabled=true;$('#previous').disabled=true;
   try{
     const body=action==='Mulligan'?{tirada_id:attributeRoll.id,accion:action}:attributeRoll?{tirada_id:attributeRoll.id,accion:'Repetir'}:{modo:draft.generacion_modo};
     attributeRoll=await api('atributos/tiradas','POST',body);draft.tirada_id=attributeRoll.id;draft.generacion_modo=attributeRoll.modo;draft.atributos={};attrs.forEach((a,i)=>draft.atributos[a.id]=attributeRoll.valores[i]);
   }finally{renderWizard();}
 };
 if($('#roll-attributes'))$('#roll-attributes').onclick=guard(()=>roll('Repetir'));
 if($('#mulligan-attributes'))$('#mulligan-attributes').onclick=guard(()=>roll('Mulligan'));
 updateAttributeChoices();
}
async function api(path,method='GET',body){const r=await fetch('/api/'+path,{method,headers:{'Content-Type':'application/json',...accessHeaders()},body:body===undefined?undefined:JSON.stringify(body)});const d=await r.json();if(!r.ok){if(r.status===401&&path!=='acceso')endAccess();throw Error(d.error||'No se pudo completar la operación');}return d;}
function error(e){$('#error').hidden=false;$('#error').textContent=e.message;$('#error').scrollIntoView({block:'nearest'});}
function clearError(){$('#error').hidden=true;}
function guard(fn){return async e=>{clearError();try{await fn(e);}catch(e){error(e);}};}
function options(items,selected,empty='Seleccionar…'){return `<option value="">${empty}</option>`+items.map(x=>`<option value="${x.id}" ${Number(selected)===x.id?'selected':''}>${esc(x.nombre)}</option>`).join('');}
function selectField(label,key,items,optional=false){return `<label>${label}<select name="${key}" ${optional?'':'required'}>${options(items,draft[key],optional?'Ninguno':'Seleccionar…')}</select></label>`;}
let rules;
async function rulesView(id,section){show('rules');rules??=await api(await referenceReady?'reglas?referencias=1':'reglas');await openRulebook($('#rules-view'),()=>rules,id,section);}
$('#nav-rules').onclick=guard(()=>rulesView());
function show(view){$('#dm-view').hidden=view!=='dm';$('#companions-view').hidden=view!=='companions';$('#rules-view').hidden=view!=='rules';$('#access').hidden=view!=='access';$('#sheet').hidden=view!=='sheet';$('#creation').hidden=view!=='create';$('#inventory-view').hidden=view!=='inventory';$('#spellcasting-view').hidden=view!=='spells';for(const id of ['nav-companions','nav-sheet','nav-inventory','nav-shop','nav-spells','nav-dice','copy-character-token'])$('#'+id).disabled=!character;$('#logout').hidden=!currentToken();clearError();}
async function list(selected){const items=await api('personajes');for(const p of items)saveAccess(p,currentToken());const known=savedCharacters();$('#character-select').innerHTML=options(known,selected,'Elige un personaje');if(selected||items.length)await load(selected||items[0].id);}
async function load(id){if(!id)return;selectAccess(id);character=await api('personajes/'+id);$('#character-select').value=character.id;$('#token-notice').hidden=true;renderSheet();show('sheet');if(!character.equipo_inicial_completo||character.equipo.pendientes)openEquipment();}
function endAccess(){$('#copy-character-token').textContent='Copiar token del PJ';$('#copy-created-token').textContent='Copiar token';clearAccess();$('#companions-view').replaceChildren();character=null;step=0;attributeRoll=null;draft={nombre:'',modo_campana:'enclave',atributos:{},pools:{}};$('#wizard-body').replaceChildren();$('#access-token').value='';$('#character-content').replaceChildren();$('#inventory-view').replaceChildren();$('#spellcasting-view').replaceChildren();$('#character-select').replaceChildren();$('#created-token').value='';$('#token-notice').hidden=true;show('access');}
function revealToken(){ $('#created-token').value=currentToken();$('#token-notice').hidden=false;}
async function mutate(route,method,body){character=await api(`personajes/${character.id}/${route}`,method,body);renderSheet();}
async function performRoll(body){const result=await api(`personajes/${character.id}/tiradas`,'POST',body);character=result.personaje;renderSheet();return result.tirada;}
function rollSkill(id){const s=character.skills.find(s=>s.id===id);openDice({title:s.nombre,value:s.valor,attribute:s.tipo==='Atributo',perform:options=>performRoll({skill_id:id,...options})});}
  function updateMagic(){renderSpellcasting($('#spellcasting-view'),character,{error,current:()=>character,roll:rollSkill,cast:async body=>{const result=await api(`personajes/${character.id}/conjuros`,'POST',body);character=result.personaje;renderSheet();return result.tirada;},useTrick:(id,settings={})=>mutate('trucos','POST',{truco_id:id,...settings})});}
function openEquipment(mode='inventory'){openGear({current:()=>character,catalog,request:async(route,body)=>{await mutate(route,'POST',body);},onChange:()=>renderSheet()},mode);}
function updateInventory(){if(character)gearLauncher($('#inventory-view'),character,()=>openEquipment(),body=>mutate('asignar-equipo','POST',body),catalog,(route,body)=>mutate(route,'POST',body));}
function metric(label,value,detail=''){return `<div class="metric"><span>${label}</span><strong>${esc(value)}</strong><span>${esc(detail)}</span></div>`;}
function itemMarkup(a){return `<div class="list-item"><div class="item-head"><strong>${esc(a.elemento?.nombre||'Ítem #'+a.item_id)}</strong><span class="tag">${a.xp_invertida} XP invertida</span></div><p class="description">${esc(a.elemento?.descripcion)}</p><small>${esc(a.origen)}</small><div class="item-actions">${a.elemento?.permite_inversion_adicional?`<button data-invest="${a.id}">Invertir más XP</button>`:''}${a.elemento?.solo_concesion_senda?'':`<button data-remove="${a.id}">Retirar</button>`}</div></div>`;}
function target(a){return a.dote_id?{dote_id:a.dote_id}:a.epifania_id?{epifania_id:a.epifania_id}:{item_id:a.item_id};}
function actionMarkup(action, character){
 const skill=character.skills.find(s=>s.id===action.skill_uso_id);
 const skillBlocked=action.skill_uso_minimo!=null&&(skill?.valor??0)<action.skill_uso_minimo;
 const costs=[action.coste_texto??(action.es_reaccion?'Reacción':action.nro_acciones_pa+' PA')];
 if(action.coste_stamina)costs.push(action.coste_stamina+' Stamina');
 if(action.coste_mana)costs.push(action.coste_mana+' Maná');
 return `<details class="list-item">
   <summary>${esc(action.nombre)} · ${esc(costs.join(' · '))}${skillBlocked?' · Requisito pendiente':''}</summary>
   <p class="description">${esc(action.descripcion)}</p>
   ${skillBlocked?`<p class="bad">${esc(skill?.nombre??'Habilidad')} actual: ${skill?.valor??0}%.</p>`:''}
   <small>Fuente: ${esc(action.fuentes.join(', '))}</small>
   ${action.usable_linaje?`<p><button data-use-lineage="${action.id}" ${character.derivados.mana_actual<action.coste_mana?'disabled':''}>Usar · ${action.coste_mana} maná / 1 hora</button></p>`:''}
 </details>`;
}
function renderSheet(){
 const p=character,d=p.derivados,groups=catalog.skills.filter(s=>s.tipo==='Atributo');
 const feats=p.adquisiciones.filter(a=>a.dote_id&&!a.elemento?.solo_concesion_inicial),ep=p.adquisiciones.filter(a=>a.epifania_id),available=p.dotes_disponibles.filter(d=>!d.poseido);
 $('#character-content').innerHTML=`
 <div class="panel identity"><div><h1>${esc(p.nombre)}</h1><p>${esc(p.linaje?.nombre)} · ${p.sendas.map(s=>esc(s.nombre)).join(', ')}</p><p class="muted">${p.dedicaciones.map(s=>esc(s.nombre)).join(', ')} · ${p.nacimientos.map(s=>esc(s.nombre)).join(', ')}</p><div class="tags">${p.tags.map(t=>`<span class="tag">${esc(t.nombre)}</span>`).join('')}</div></div><div><strong class="${d.estado==='Activo'?'good':'bad'}">${esc(d.estado)}</strong><p>${p.xp_disponible} XP disponible / ${p.xp_total} total</p><small>${p.xp_gastada} XP gastada · Omen ${p.omen_actual}/2</small>${p.sendas.map(s=>{const pool=p.pools.find(c=>c.clase_id===s.id);return `<p class="muted">${esc(s.nombre)}: ${pool?.xp_invertida??0} XP · Grado ${pool?.grado??0}</p>`;}).join('')}</div></div>
 <div class="metrics">${metric('Margen de heridas',d.pg_reales+' / '+d.mh,'Heridas actuales: '+p.heridas_actuales)}${metric('Maná disponible',d.mana_actual,'Máximo: '+d.mana_max)}${metric('Stamina',d.stamina)}${metric('Límite seguro',d.limite_seguro,'Maná consumido: '+p.mana_consumido)}${metric('Umbral grave',d.umbral_grave,'Umbral mortal: '+d.mh)}</div>
 ${equipmentMainMarkup(p)}
 ${lineageSheet(p)}
 ${professionsSheet(p)}
 ${traitSheet(p,catalog)}
 ${pathTraitsSheet(p)}${ordersSheet(p)}
 ${devotionSheet(p)}${traitChoicesSheet(p)}
 <div class="layout"><div>
 <section class="panel"><h2>Atributos y habilidades</h2><div class="skill-grid">${groups.map(attr=>{const val=p.skills.find(s=>s.id===attr.id)?.valor??0;return `<div class="skill-group"><button type="button" class="skill-title skill-roll" data-roll-skill="${attr.id}" aria-label="Tirar ${esc(attr.nombre)} ${val}"><span>${esc(attr.nombre)}</span><span>${val} · Nv ${Math.floor(val/10)}</span></button>${p.skills.filter(s=>s.padre_id===attr.id).map(s=>`<button type="button" class="skill-row skill-roll" data-roll-skill="${s.id}" aria-label="Tirar ${esc(s.nombre)} ${s.valor}"><span>${esc(s.nombre)}</span><strong>${s.valor}</strong></button>`).join('')}</div>`;}).join('')}</div><h3 style="margin-top:20px">Skills extra y especiales</h3>${p.skills.filter(s=>['Extra','Especial'].includes(s.tipo)).map(s=>`<button type="button" class="skill-row skill-roll" data-roll-skill="${s.id}" aria-label="Tirar ${esc(s.nombre)} ${s.valor}"><span>${esc(s.nombre)}</span><strong>${s.valor}</strong></button>`).join('')||'<p class="muted">Sin habilidades extra registradas.</p>'}<details><summary>Registrar cambio de habilidad</summary><form id="skill-form" class="stack"><label>Habilidad<select name="skill_id" required>${options(catalog.skills,null)}</select></label><div class="grid"><label>Cambio<select name="change"><option>Add</option><option>Subtract</option></select></label><label>Puntos<input name="valor" type="number" min="1" max="99" value="5" required></label><label>XP gastada<input name="xp_gastada" type="number" min="0" max="${p.xp_disponible}" value="0" required></label></div><button>Registrar</button></form><p class="muted">El narrador determina el coste y las mejoras permitidas.</p></details></section>
 <section class="panel"><h2>Entrenamiento</h2><p>Una sesión cuesta 1 XP. Elegí hasta cinco habilidades y dos atributos marcados.</p>
 <form id="training-form" class="stack">${p.skills.filter(s=>p.entrenamiento.marcas.includes(s.id)).map(s=>`<label><input type="checkbox" name="skill" value="${s.id}" ${s.valor>=100?'disabled':''}> ${esc(s.nombre)} · ${s.valor}</label>`).join('')||'<p class="muted">Sin marcas disponibles.</p>'}<button ${p.xp_disponible<1||!p.entrenamiento.marcas.length?'disabled':''}>Iniciar sesión · 1 XP</button></form>
 ${p.entrenamiento.intentos.map(i=>`<p>${esc(p.skills.find(s=>s.id===i.skill_id)?.nombre)} · ${String(i.dado).padStart(2,'0')} contra ${i.valor} · ${i.mejora?'+'+i.mejora+(i.asegurado?' (asegurado)':''):'Conserva la marca'} ${!i.mejora&&p.xp_disponible>0?`<button data-ensure="${i.id}">Asegurar mejora · 1 XP</button>`:''}</p>`).join('')}</section>
 <section class="panel"><h2>Dotes</h2>${feats.map(itemMarkup).join('')||'<p class="muted">Sin dotes adquiridos.</p>'}<details><summary>Adquirir un dote</summary>${available.map(f=>`<div class="list-item"><div class="item-head"><strong>${esc(f.nombre)}</strong><span>${f.costo_xp} XP</span></div><p class="description">${esc(f.descripcion)}</p>${f.requisitos.length?`<small class="bad">Requiere: ${esc(f.requisitos.join(' · '))}</small>`:''}<div class="item-actions"><button data-acquire-feat="${f.id}" ${f.requisitos.length||p.xp_disponible<f.costo_xp?'disabled':''}>Adquirir</button></div></div>`).join('')}</details></section>
 <section class="panel"><h2>Acciones disponibles</h2><div class="item-actions"><button data-rule="Acciones_Genericas">Acciones genéricas y costes</button><button data-rule="Reacciones_Defensivas">Reacciones defensivas</button><button data-rule="Procedimientos_de_Combate_e_Iniciativas">Iniciativa</button></div><details><summary>Acciones y maniobras generales</summary>${p.acciones.filter(a=>['Generica','Reaccion'].includes(a.tipo)).map(a=>actionMarkup(a,p)).join('')}</details>${p.acciones.filter(a=>!isManifestation(a)&&!['Generica','Reaccion'].includes(a.tipo)).map(a=>actionMarkup(a,p)).join('')}</section>
 <section class="panel"><div class="item-head"><h2>Epifanías</h2><button id="open-spells">Abrir Spellcasting</button></div>${ep.map(itemMarkup).join('')}<form id="ep-form" class="row-form"><label>Epifanía<select name="epifania_id" required>${options(catalog.epifanias.filter(e=>!ep.some(a=>a.epifania_id===e.id)),null)}</select></label><button>Adquirir</button></form></section>
 <section class="panel"><h2>Historial de progresión</h2><div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Cambio</th><th>Elemento</th><th>XP gastada</th></tr></thead><tbody>${p.historial.map(h=>`<tr><td>${esc(new Date(h.fecha).toLocaleString('es-AR'))}</td><td>${esc(h.tipo)}${h.skill_id?' '+(h.change==='Add'?'+':'−')+h.valor:''}</td><td>${esc(h.nombre)}<br><small>${esc(h.origen)}</small></td><td>${h.xp_gastada}</td></tr>`).join('')}</tbody></table></div></section>
 </div><aside>
 ${resourceMarkup(p)}
 ${p.regalos.length?` <section class="panel"><h2>Regalos y perjuicios históricos</h2>${p.regalos.map(r=>`<h3>${esc(r.nombre)}</h3><p class="description">${esc(r.efecto_mecanico)}</p>`).join('')||'<p class="muted">Sin selección.</p>'}</section>`:''}
 <section class="panel"><h2>Notas y trasfondo</h2>${backgroundSheet(p)}<form id="notes-form" class="stack"><label>Notas<textarea name="notas" rows="5">${esc(p.notas)}</textarea></label><button>Guardar notas</button></form></section>
 <details class="panel"><summary>Herramientas del narrador</summary><p class="muted">Herramienta local sin cuentas ni permisos separados.</p><form id="xp-form" class="stack"><label>Conceder XP<input name="cantidad" type="number" min="1" value="1" required></label><label>Motivo<input name="notas" maxlength="300"></label><button>Conceder XP</button></form><hr><form id="authorize-form" class="stack"><label>Dote especial<select name="dote_id" required>${options(catalog.dotes_narrador??[],null)}</select></label><label>Motivo<input name="notas" maxlength="300"></label><button>Autorizar para este personaje</button></form><p class="muted">Retirar contenido no devuelve XP. La pool de senda muestra la inversión histórica registrada.</p></details>
 </aside></div>`;
 const bind=(id,fn)=>$(id).addEventListener('submit',guard(async e=>{e.preventDefault();await fn(new FormData(e.target));}));
 document.querySelectorAll('[data-senda-choice]').forEach(form=>{
   const pregunta_id=Number(form.dataset.sendaChoice);
   form.onsubmit=guard(async event=>{
     event.preventDefault();
     const opcion_id=Number(new FormData(form).get('respuesta_senda_'+pregunta_id));
     await mutate('elecciones-senda','POST',{pregunta_id,opcion_id});
   });
 });
 bind('#state-form',f=>mutate('estado','PATCH',Object.fromEntries([...f].map(([k,v])=>[k,Number(v)]))));bind('#notes-form',f=>mutate('estado','PATCH',{notas:f.get('notas')}));
 bind('#training-form',f=>mutate('entrenamiento','POST',{skills:f.getAll('skill').map(Number)}));
 document.querySelectorAll('[data-ensure]').forEach(b=>b.onclick=guard(()=>mutate('entrenamiento','POST',{asegurar:Number(b.dataset.ensure)})));
 bind('#skill-form',f=>mutate('progresion','POST',{tipo:'Skill',skill_id:Number(f.get('skill_id')),change:f.get('change'),valor:Number(f.get('valor')),xp_gastada:Number(f.get('xp_gastada'))}));
 bind('#ep-form',f=>mutate('progresion','POST',{tipo:'Adquisicion',epifania_id:Number(f.get('epifania_id'))}));
 bind('#xp-form',f=>mutate('xp','POST',{cantidad:Number(f.get('cantidad')),notas:f.get('notas')}));bind('#authorize-form',f=>mutate('autorizar','POST',{dote_id:Number(f.get('dote_id')),notas:f.get('notas')}));
 document.querySelectorAll('[data-use-lineage]').forEach(b=>b.onclick=guard(()=>mutate('acciones','POST',{accion_id:Number(b.dataset.useLineage)})));
 document.querySelectorAll('[data-acquire-feat]').forEach(b=>b.onclick=guard(()=>mutate('progresion','POST',{tipo:'Adquisicion',dote_id:Number(b.dataset.acquireFeat)})));
 document.querySelectorAll('[data-attune]').forEach(b=>b.onclick=guard(()=>mutate('progresion','POST',{tipo:'Adquisicion',item_id:Number(b.dataset.attune)})));
 document.querySelectorAll('[data-invest]').forEach(b=>b.onclick=guard(async()=>{const a=character.adquisiciones.find(a=>a.id===Number(b.dataset.invest));await investXP({name:a.elemento?.nombre??'Elemento adquirido',available:character.xp_disponible,suggested:2,onSubmit:xp=>mutate('progresion','POST',{tipo:'Inversion',...target(a),xp_gastada:xp})});}));
 document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=guard(async()=>{const a=character.adquisiciones.find(a=>a.id===Number(b.dataset.remove));await confirmAction({message:'¿Retirar este elemento? No devuelve XP.',confirmLabel:'Retirar',onConfirm:()=>mutate('progresion','POST',{tipo:'Retiro',...target(a)})});}));
 bindOrdersSheet(document,p,mutate,error);
 updateInventory();
 updateMagic();
 document.querySelectorAll('[data-roll-skill]').forEach(b=>b.onclick=()=>rollSkill(Number(b.dataset.rollSkill)));
 document.querySelectorAll('[data-roll-attack]').forEach(b=>b.onclick=()=>{const id=b.dataset.rollAttack==='desarmado'?'desarmado':Number(b.dataset.rollAttack),a=character.equipo.ataques.find(a=>(a.item_id??'desarmado')===id);openDice({title:a.nombre,value:a.valor,attack:true,perform:options=>performRoll({ataque:id,...options})});});
 $('#open-spells').onclick=()=>{updateMagic();show('spells');};
 document.querySelectorAll('[data-rule]').forEach(b=>b.onclick=guard(()=>rulesView('10_Reglas/'+b.dataset.rule+'.md')));
 bindResources(p,{mutate,error,damageTypes:catalog.tipos_dano});
 bindTraitChoicesSheet($('#character-content'),p,mutate,error);
 if(p.equipo.inventario.some(i=>i.artefacto_id&&i.elemento.demo)){
  $('#character-content').insertAdjacentHTML('beforeend',artifactEquipment(p,{}));
  bindArtifactEquipment($('#character-content'),(route,body)=>mutate(route,'POST',body));
 }
}
function renderWizard(){
 const skipOrder=Boolean(draft.clase_id&&!needsOrder());
 $('#step-label').textContent=`Paso ${step+1-(skipOrder&&step>4?1:0)} de ${steps.length-(skipOrder?1:0)} · ${steps[step]}`;$('#previous').disabled=step===0;$('#next').disabled=false;$('#next').textContent=step===5?'Crear y guardar personaje':'Continuar';
 const attrs=orderedAttributes(),fields=[];
 if(step===0)fields.push(`<div class="grid"><label>Nombre<input name="nombre" value="${esc(draft.nombre)}" maxlength="80" required></label><label>Campaña<select name="modo_campana"><option value="enclave" ${draft.modo_campana==='enclave'?'selected':''}>Enclave</option><option value="sandbox" ${draft.modo_campana==='sandbox'?'selected':''}>Sandbox</option></select></label></div>${selectField('Linaje','linaje_id',catalog.linajes)}<div id="initial-lineage"></div><label>Trasfondo narrativo<textarea name="notas" rows="4">${esc(draft.notas)}</textarea></label>`);
 if(step===1)fields.push(attributeEditor(attrs));
 if(step===2)fields.push(`<div class="grid">${selectField('Dedicación / trasfondo','dedicacion_id',catalog.dedicaciones)}${selectField('Nacimiento / origen','nacimiento_id',catalog.nacimientos)}</div><div id="selection-details" class="hint"></div><div id="profession-choice"></div><section id="profession-details" class="profession-summary"></section><div id="origin-traits"></div><div id="background-details"></div>`);
 if(step===3)fields.push(`${selectField('Senda','clase_id',catalog.clases)}<div id="path-details">${pathSummary(catalog,draft)}${creationPathChoices(catalog,draft)}</div>${poolEditor(catalog,draft)}<div id="creation-trait-choices">${creationTraitChoices(catalog,draft)}</div>`);
 if(step===4)fields.push('<div id="creation-orders">'+creationOrders(catalog,draft)+'</div>');
 if(step===5)fields.push(`<h2>${esc(draft.nombre)}</h2><p>${esc(catalog.linajes.find(l=>l.id===draft.linaje_id)?.nombre)} · ${esc(catalog.clases.find(l=>l.id===draft.clase_id)?.nombre)}</p><p>${esc(catalog.dedicaciones.find(l=>l.id===draft.dedicacion_id)?.nombre)} · ${esc(catalog.nacimientos.find(l=>l.id===draft.nacimiento_id)?.nombre)}</p><p>${initialXP(catalog,draft)} XP inicial · Peso personal ${creationWeight(catalog,draft)} kg</p>${lineageEditor(catalog,draft,{readOnly:true})}${pathSummary(catalog,draft)}${professionReview(catalog,draft)}${originTraitEditor(catalog,draft)}${backgroundReview(catalog,draft)}<p class="hint">Se guardará en SQLite, con sus habilidades y concesiones iniciales. La ficha calculará recursos y mostrará acciones y componentes disponibles.</p>`);
 $('#wizard-body').innerHTML=`<div class="panel stack"><h2>${steps[step]}</h2>${fields.join('')}</div>`;
 if(step===5)$('#wizard-body .panel').insertAdjacentHTML('beforeend',creationPathChoices(catalog,draft,{review:true})+creationTraitChoices(catalog,draft,{review:true})+creationOrders(catalog,draft,{review:true}));
 if(step===0){
  const select=$('[name=linaje_id]');
  const refresh=()=>{const id=Number(select.value)||null;if(id!==draft.linaje_id){draft.linaje_id=id;draft.elecciones_linaje={};draft.regalo_moonstone=true;}
   $('#initial-lineage').innerHTML=lineageEditor(catalog,draft);bindLineageEditor($('#initial-lineage'),draft,catalog);};
  refresh();select.onchange=refresh;
 }
 if(step===1)bindAttributeEditor(attrs);
 if(step===3){
   draft.elecciones_rasgos??={};
   bindPoolEditor(catalog,draft);
   const refreshTraitChoices=()=>{const root=$('#creation-trait-choices');root.innerHTML=creationTraitChoices(catalog,draft);bindCreationTraitChoices(root,catalog,draft);};
   refreshTraitChoices();
   for(const input of document.querySelectorAll('[data-combat-slot],[data-normal]'))input.addEventListener('change',refreshTraitChoices);
   $('[name=clase_id]').onchange=e=>{
     draft.clase_id=e.target.value?Number(e.target.value):null;
     draft.elecciones_senda={};draft.elecciones_rasgos={};draft.juramento={};delete draft.combo_orden_id;delete draft.orden;
     $('#path-details').innerHTML=pathSummary(catalog,draft)+creationPathChoices(catalog,draft);refreshTraitChoices();
   };
 }
 if(step===4){const refresh=()=>{const root=$('#creation-orders');root.innerHTML=creationOrders(catalog,draft);bindCreationOrders(root,catalog,draft,refresh);};refresh();}
 if(step===2){
  const selects=[...document.querySelectorAll('#wizard-body .grid select')];
  const details=()=>{
   $('#selection-details').textContent=selects.map(select=>{
    const sources=select.name==='dedicacion_id'?catalog.dedicaciones:catalog.nacimientos;
    const item=sources.find(x=>x.id===Number(select.value));draft[select.name]=select.value?Number(select.value):null;
    return item?(item.nombre+': '+(item.efecto_mecanico||item.descripcion||'')):'';
   }).filter(Boolean).join('\n');
   if(step===2){

    $('#profession-choice').innerHTML=professionChoice(catalog,draft);bindProfession($('#profession-choice'),catalog,draft,()=>{$('#profession-details').innerHTML=professionMarkup(catalog,draft);$('#origin-traits').innerHTML=originTraitEditor(catalog,draft);});
    $('#profession-details').innerHTML=professionMarkup(catalog,draft);
    $('#origin-traits').innerHTML=originTraitEditor(catalog,draft);
    $('#background-details').innerHTML=backgroundEditor(catalog,draft);bindBackground($('#background-details'),draft);

   }
  };selects.forEach(select=>select.onchange=details);details();
 }
}
function saveStep(){
 for(const [k,v] of new FormData($('#creation-form'))){
   if(k.startsWith('rasgo_')||k.startsWith('juramento_')||k==='orden'||k==='combo_orden_id')continue;
   if(k.startsWith('respuesta_senda_')){
     const id=k.slice('respuesta_senda_'.length);
     if(v)(draft.elecciones_senda??={})[id]=Number(v);
     else if(draft.elecciones_senda)delete draft.elecciones_senda[id];
     continue;
   }
   if(k.startsWith('normal_')||k.startsWith('combat_')||k.startsWith('eleccion_')||k==='regalo_moonstone'||k.startsWith('trasfondo_')||k==='oficio_inicial')continue;
   if(k.startsWith('attr_'))draft.atributos[k.slice(5)]=Number(v);
   else if(k.startsWith('pool_'))draft.pools[k.slice(5)]=Number(v);
   else draft[k]=k.endsWith('_id')?(v?Number(v):null):v;
 }
}
function validateStep(){if(step===4)validateCreationOrders(catalog,draft);if(step===0)lineageBonuses(catalog,draft,{strict:true});if(step===2){selectedProfession(catalog,draft,{strict:true});}if(step===1&&!sameValues(Object.values(draft.atributos),attributePool()))throw Error('Completa los diez atributos con los valores disponibles.');if(step===3){validateInitialTraitChoices(catalog,draft);const assigned=Object.entries(draft.pools).map(([id,v])=>({s:catalog.skills.find(s=>s.id===Number(id)),v}));if(assigned.filter(a=>a.s.combate&&a.v).map(a=>a.v).sort((a,b)=>a-b).join(',')!=='5,10,15,20'||assigned.filter(a=>!a.s.combate).reduce((n,a)=>n+a.v,0)!==50)throw Error('Completa ambos pools antes de continuar.');}}
$('#creation-form').addEventListener('submit',guard(async e=>{e.preventDefault();saveStep();validateStep();if(step<5){step+=step===3&&!needsOrder()?2:1;renderWizard();window.scrollTo(0,0);}else{const b=$('#next');b.disabled=true;try{const created=await api('personajes','POST',{...draft,profesion_id:selectedProfession(catalog,draft)?.id,respuestas_trasfondo:backgroundAnswers(catalog,draft),respuestas_nacimiento:originAnswers(catalog,draft)});saveAccess(created,created.token_acceso);await list(created.id);show('sheet');revealToken();step=0;attributeRoll=null;draft={nombre:'',modo_campana:'enclave',atributos:{},pools:{}};}finally{b.disabled=false;}}}));
$('#previous').onclick=()=>{saveStep();if(step>0)step-=step===5&&!needsOrder()?2:1;clearError();renderWizard();};$('#nav-sheet').onclick=()=>show('sheet');$('#nav-create').onclick=()=>{show('create');renderWizard();};$('#nav-shop').onclick=()=>openEquipment('shop');$('#nav-inventory').onclick=()=>{updateInventory();show('inventory');};$('#character-select').onchange=guard(e=>load(Number(e.target.value)));$('#nav-spells').onclick=()=>{updateMagic();show('spells');};$('#nav-dice').onclick=()=>{if(character)openDice({title:'Roller de dados',skills:character.skills,perform:performRoll});};
$('#access-form').addEventListener('submit',guard(async e=>{e.preventDefault();const token=$('#access-token').value.trim(),result=await api('acceso','POST',{token});saveAccess(result.personaje,token);$('#access-token').value='';await list(result.personaje.id);show('sheet');}));
$('#logout').onclick=endAccess;$('#dismiss-token').onclick=()=>{$('#token-notice').hidden=true;};
for(const id of ['copy-character-token','copy-created-token'])$('#'+id).onclick=guard(async e=>{const button=e.currentTarget,label=id==='copy-character-token'?'Copiar token del PJ':'Copiar token';if(await copyToken()){button.textContent='Token copiado';setTimeout(()=>button.textContent=label,1800);}else{show('sheet');revealToken();$('#created-token').focus();$('#created-token').select();}});
const referenceReady=api('referencias').then(data=>{installReferences(data);return true;}).catch(e=>{error(e);return false;});
try{catalog=await api('catalogo');if(currentToken())await list();else show('access');$('#connection').textContent='● SQLite conectado';}catch(e){$('#connection').textContent='Sin conexión';error(e);}

setupNPCViews({show,current:()=>character,api,error});
