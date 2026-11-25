import {npcHealth,memberActions,actionsUsed,canDefend,SITUATIONS,setNPCAguante} from './npc-rules.js';
import {CIRCUMSTANCES} from './roll-rules.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={minons:'Minions y tropas',enemies:'Enemigos',boses:'Jefes',companions:'Compañeros'};
const DM_KEY='gideon.dm.token';
const label=v=>v.charAt(0).toUpperCase()+v.slice(1).replaceAll('_',' ');
function modal(title,content,className=''){
 const d=document.createElement('dialog');d.className='npc-dialog '+className;
 d.innerHTML=`<div class="item-head"><h2>${esc(title)}</h2><button type="button" data-close aria-label="Cerrar">×</button></div><div data-body>${content}</div>`;
 d.querySelector('[data-close]').onclick=()=>d.close();d.addEventListener('close',()=>d.remove(),{once:true});document.body.append(d);d.showModal();return d;
}
function healthText(n,m){const h=npcHealth(n,m);return n.salud.tipo==='heridas'?`${h.restante} / ${h.maximo} de margen · ${m.heridas} heridas`:`${m.golpes}${h.limite_golpes==null?' / sin límite':' / '+h.limite_golpes} golpes · ${m.graves} / ${h.limite_graves} Graves`;}
function rosterSummary(g){const fallen=g.integrantes.filter(m=>npcHealth(g.npc,m).caido).length;return `${g.integrantes.length-fallen} en pie · ${fallen} caídos · ${g.integrantes.length} total`;}
function aguanteForm(n){
 if(n.salud.tipo!=='golpes')return '';
 return `<form data-aguante class="stack"><fieldset><legend>Aguante</legend><div class="grid">${[['vigoroso','Vigoroso','Golpes hasta caer'],['duro','Duro','Heridas Graves hasta caer']].map(([id,name,help])=>{const r=n.rasgos.find(r=>r.id===id);return `<div><label><input type="checkbox" name="${id}" ${r?'checked':''}> ${name}</label><label>${help}<input type="number" name="${id}_cantidad" min="1" max="200" value="${r?.cantidad??2}" ${r?'':'disabled'} required></label></div>`;}).join('')}</div><p class="description">Vigoroso fija los golpes hasta caer; una Grave lo hace caer salvo que tenga Duro. Duro fija las Graves hasta caer. Con Duro y sin Vigoroso, solo las Graves lo hacen caer.</p><button>Guardar aguante</button></fieldset></form>`;
}
function bindAguante(root,save){
 const form=root.querySelector('[data-aguante]');if(!form)return;
 for(const id of ['vigoroso','duro'])form.elements[id].onchange=()=>{form.elements[id+'_cantidad'].disabled=!form.elements[id].checked;};
 form.onsubmit=async e=>{e.preventDefault();const button=form.querySelector('button');button.disabled=true;try{await save(Object.fromEntries(['vigoroso','duro'].map(id=>[id,form.elements[id].checked?Number(form.elements[id+'_cantidad'].value):null])));}finally{button.disabled=false;}};
}
function statblock(n){
 const values={...n.atributos,...n.combate,...n.especialidades};
 return `<div class="npc-statblock"><div class="tags"><span class="tag">${esc(label(n.perfil))}</span><span class="tag">v${n.version}</span>${n.datos_demo?'<span class="tag">Datos de prueba</span>':''}</div><p class="description">${esc(n.descripcion)}</p>
 <div class="npc-stats">${Object.entries(values).map(([key,v])=>`<button data-npc-roll="${esc(key)}"><span>${esc(label(key))}</span><strong>${v}</strong></button>`).join('')}</div>
 <p><strong>Dureza ${n.defensas.dureza}</strong> · ${n.defensas.ug==null?'':'UG '+n.defensas.ug+' · '}${n.salud.tipo==='heridas'?'MH '+n.salud.maximo:'Salud por golpes'}</p>
 <p class="description">Armadura: ${Object.entries(n.defensas.armadura).map(([k,v])=>esc(`${label(k)} ${v}`)).join(' / ')}</p>
 <p class="description">Velocidad: ${n.velocidades.map(v=>`${v.tipo} ${v.valor} u`).map(esc).join(' · ')}</p>
 <p class="description">Sentidos: ${n.sentidos.map(s=>`${s.tipo} (${s.precision})`).map(esc).join(' · ')}</p>
 ${n.rasgos.map(r=>`<div class="npc-trait"><strong>${esc(r.nombre??label(r.id))}${r.cantidad==null?'':' ('+r.cantidad+')'}</strong><p class="description">${esc(r.descripcion)}</p></div>`).join('')}
 <h3>Acciones</h3>${n.acciones.map(a=>`<div class="npc-trait"><strong>${esc(a.nombre)}</strong> <small>${a.coste==null?'':a.coste+' PA'}</small>${a.valor==null?'':` <button data-npc-action="${esc(a.id)}">Tirar · ${a.valor}</button>`}<p class="description">${esc(a.descripcion)}</p></div>`).join('')}
 ${[['retaliaciones','Retaliación'],['acciones_epicas','Acciones Épicas']].map(([key,name])=>n[key]?.length?`<h3>${name}</h3>${n[key].map(a=>`<div class="npc-trait"><strong>${esc(a.nombre)}</strong><p class="description">${esc(a.descripcion)}</p></div>`).join('')}`:'').join('')}</div>`;
}
export function setupNPCViews({show,current,api,error}){
 const dm=document.querySelector('#dm-view'),players=document.querySelector('#companions-view');let data=null,selected=null,filter='',category='',busy=false;
 const guard=fn=>async e=>{try{await fn(e);}catch(e){error(e);}};
 async function dmRequest(path='',method='GET',body){
  const r=await fetch('/api/dm/npcs'+path,{method,headers:{'Content-Type':'application/json','X-Gideon-DM-Token':sessionStorage.getItem(DM_KEY)??''},body:body===undefined?undefined:JSON.stringify(body)}),result=await r.json();
  if(r.status===403){sessionStorage.removeItem(DM_KEY);data=null;login();}
  if(!r.ok)throw Error(result.error??'No se pudo completar la operación');return result;
 }
 async function refresh(){data=await dmRequest();selected=data.catalogo.some(n=>n.id===selected)?selected:data.catalogo[0]?.id;renderDM();}
 async function commit(path,method,body){if(busy)throw Error('Esperá a que termine la operación');busy=true;try{data=await dmRequest(path,method,body);renderDM();}finally{busy=false;}}
 function login(){
  dm.innerHTML=`<section class="panel access-panel"><h1>Only DM</h1><p>Bestiario y seguimiento del combate.</p><form id="dm-login" class="stack"><label>Token del narrador<input name="token" type="password" required autocomplete="off" spellcheck="false"></label><button class="primary">Entrar como DM</button><label>Cargar archivo de acceso<input name="archivo" type="file" accept=".json"></label><p class="description">El servidor genera el acceso en sql/dm-access.local.json. Podés cargar ese archivo o pegar su token.</p></form></section>`;
  const f=dm.querySelector('form');f.onsubmit=guard(async e=>{e.preventDefault();sessionStorage.setItem(DM_KEY,f.elements.token.value.trim());await refresh();});
  f.elements.archivo.onchange=guard(async()=>{const file=f.elements.archivo.files[0];if(!file)return;const key=JSON.parse(await file.text()).token;if(typeof key!=='string')throw Error('El archivo no contiene un token');f.elements.token.value=key;});
 }
 function selectedNPC(){return data.catalogo.find(n=>n.id===selected);}
 function renderDM(){
  const npc=selectedNPC(),list=data.catalogo.filter(n=>(!category||n.carpeta===category)&&(!filter||n.nombre.toLocaleLowerCase().includes(filter.toLocaleLowerCase())));
  dm.innerHTML=`<div class="item-head"><div><small>ONLY DM</small><h1>Bestiario y combate</h1></div><div class="item-actions"><button id="npc-refresh">Actualizar</button><button id="dm-logout">Cerrar acceso DM</button></div></div>
  <div class="npc-workspace"><section class="panel"><h2>Catálogo de criaturas</h2><div class="grid"><label>Buscar<input id="npc-search" value="${esc(filter)}" placeholder="Nombre de la criatura"></label><label>Carpeta<select id="npc-category"><option value="">Todas</option>${Object.entries(labels).map(([k,v])=>`<option value="${k}" ${category===k?'selected':''}>${v}</option>`).join('')}</select></label></div>
  <div class="npc-catalog" role="list">${list.map(n=>`<button class="npc-catalog-entry ${selected===n.id?'selected':''}" data-npc-id="${esc(n.id)}"><strong>${esc(n.nombre)}</strong><small>${labels[n.carpeta]}${n.datos_demo?' · Prueba':''}</small></button>`).join('')||'<p class="muted">No hay fichas con ese nombre.</p>'}</div>
  ${npc?`<div class="item-head"><h2>${esc(npc.nombre)}</h2><button id="npc-edit">Editar JSON</button></div>${statblock(npc)}${aguanteForm(npc)}<form id="npc-add" class="row-form"><label>Cantidad<input name="cantidad" type="number" min="1" max="200" value="${npc.perfil==='minion'?4:1}" required></label><label>Nombre del grupo<input name="nombre" maxlength="120" placeholder="${esc(npc.nombre)}"></label><button class="primary">Añadir al combate</button></form>`:''}<button id="npc-new" class="npc-new">Crear statblock JSON</button></section>
  <section><div class="item-head"><h2>En combate</h2><span class="tag">${data.grupos.length} grupos</span></div><p class="description">Los integrantes de un grupo actúan al unísono. Las heridas ingresadas son finales, después de mitigaciones.</p><div id="npc-groups">${data.grupos.map(groupCard).join('')||'<div class="panel"><p>Añadí criaturas del catálogo para empezar.</p></div>'}</div>
  <details class="panel"><summary>Vincular compañeros a personajes</summary>${linkForm()}</details></section></div>`;
  dm.querySelector('#npc-refresh').onclick=guard(refresh);dm.querySelector('#dm-logout').onclick=()=>{sessionStorage.removeItem(DM_KEY);data=null;login();};
  dm.querySelector('#npc-search').oninput=e=>{filter=e.target.value;const at=e.target.selectionStart;renderDM();const s=dm.querySelector('#npc-search');s.focus();s.setSelectionRange(at,at);};
  dm.querySelector('#npc-category').onchange=e=>{category=e.target.value;renderDM();};
  dm.querySelectorAll('[data-npc-id]').forEach(b=>b.onclick=()=>{selected=b.dataset.npcId;renderDM();});
  if(npc){bindRolls(dm.querySelector('.npc-statblock'),npc,body=>dmRequest('/tiradas','POST',{npc_id:npc.id,...body}));dm.querySelector('#npc-edit').onclick=()=>editor(npc);
   bindAguante(dm,guard(async values=>{await commit('/catalogo','POST',{carpeta:npc.carpeta,npc:setNPCAguante(npc,values)});}));
   dm.querySelector('#npc-add').onsubmit=guard(async e=>{e.preventDefault();const f=new FormData(e.target);await commit('/grupos','POST',{npc_id:npc.id,cantidad:Number(f.get('cantidad')),nombre:f.get('nombre')});});}
  dm.querySelector('#npc-new').onclick=()=>editor(null);
  dm.querySelectorAll('[data-group]').forEach(b=>b.onclick=()=>roster(data.grupos.find(g=>g.id===b.dataset.group)));
  dm.querySelectorAll('[data-group-roll]').forEach(b=>b.onclick=()=>{const g=data.grupos.find(g=>g.id===b.dataset.groupRoll);roller(g.npc,body=>dmRequest('/tiradas','POST',{grupo_id:g.id,...body}));});
  dm.querySelectorAll('[data-group-op]').forEach(b=>b.onclick=guard(async()=>{const g=data.grupos.find(g=>g.id===b.dataset.id);if(b.dataset.groupOp==='retirar'){const d=modal('Retirar grupo',`<p>¿Retirar ${esc(g.nombre)} del combate? Se eliminará su seguimiento.</p><button data-confirm>Retirar grupo</button>`);d.querySelector('[data-confirm]').onclick=guard(async()=>{await patch(g,{operacion:'retirar'});d.close();});return;}await patch(g,{operacion:b.dataset.groupOp});}));
  dm.querySelectorAll('[data-situation]').forEach(s=>s.onchange=guard(()=>patch(data.grupos.find(g=>g.id===s.dataset.situation),{operacion:'situacion',situacion:s.value})));
  bindLinks();
 }
 function groupCard(g){const first=g.integrantes[0];return `<article class="panel npc-group" data-group-card="${g.id}"><div class="item-head"><h3>${esc(g.nombre)}</h3><span class="tag">Ronda ${g.ronda}</span></div><p>${rosterSummary(g)}</p>${g.integrantes.length===1?`<p class="${npcHealth(g.npc,first).caido?'bad':'good'}">${healthText(g.npc,first)}</p>`:''}<p class="description">${g.control?'Esbirro '+esc(g.control)+' · ':''}Acciones conjuntas: ${g.acciones_maximas-g.acciones_usadas} / ${g.acciones_maximas}</p><label>Iniciativa<select data-situation="${g.id}">${SITUATIONS.map(s=>`<option value="${s}" ${s===g.situacion?'selected':''}>${label(s)}</option>`).join('')}</select></label><div class="item-actions"><button data-group="${g.id}">Integrantes (${g.integrantes.length})</button><button data-group-roll="${g.id}">Dados</button><button data-group-op="accion" data-id="${g.id}" ${g.acciones_usadas>=g.acciones_maximas?'disabled':''}>Gastar acción conjunta</button><button data-group-op="ronda" data-id="${g.id}">Nueva ronda</button><button data-group-op="retirar" data-id="${g.id}">Retirar</button></div></article>`;}
 const patch=(g,body)=>commit('/grupos/'+g.id,'PATCH',{revision:g.revision,...body});
 function linkForm(){return `<form id="npc-link" class="stack"><label>Personaje<select name="personaje_id" required>${data.personajes.map(p=>`<option value="${p.id}">#${p.id} · ${esc(p.nombre)}</option>`).join('')}</select></label><label>NPC<select name="npc_id">${data.catalogo.map(n=>`<option value="${esc(n.id)}">${esc(n.nombre)}</option>`).join('')}</select></label><div class="grid"><label>Cantidad<input name="cantidad" type="number" min="1" max="200" value="1" required></label><label>Control<select name="control"><option value="leal">Leal</option><option value="esclavo">Esclavo</option><option value="marioneta">Marioneta</option></select></label></div><label>Nombre del grupo de compañeros<input name="nombre" maxlength="120"></label><button ${data.personajes.length?'':'disabled'}>Vincular al personaje</button></form><div>${data.vinculos.map(v=>`<div class="list-item"><strong>${esc(v.nombre||v.npc_id)}</strong><p class="description">PJ #${v.personaje_id} · ${v.cantidad} integrantes · ${esc(v.control)}</p><div class="item-actions"><button data-deploy="${esc(v.id)}">Añadir compañeros al combate</button><button data-unlink="${esc(v.id)}">Quitar vínculo</button></div></div>`).join('')}</div>`;}
 function bindLinks(){
  dm.querySelector('#npc-link').onsubmit=guard(async e=>{e.preventDefault();const f=new FormData(e.target);await commit('/vinculos','POST',{personaje_id:Number(f.get('personaje_id')),npc_id:f.get('npc_id'),cantidad:Number(f.get('cantidad')),control:f.get('control'),nombre:f.get('nombre')});});
  dm.querySelectorAll('[data-deploy]').forEach(b=>b.onclick=guard(async()=>{const v=data.vinculos.find(v=>v.id===b.dataset.deploy);await commit('/grupos','POST',{npc_id:v.npc_id,cantidad:v.cantidad,nombre:v.nombre,vinculo_id:v.id});}));
  dm.querySelectorAll('[data-unlink]').forEach(b=>b.onclick=guard(()=>commit('/vinculos','POST',{id:b.dataset.unlink,eliminar:true})));
 }
 function editor(npc){
  const template=structuredClone(npc??data.catalogo[0]);delete template.carpeta;if(!npc){template.id='nueva_criatura';template.nombre='Nueva criatura';template.version=1;}
  const d=modal(npc?'Editar statblock':'Crear statblock',`<form class="stack"><label>Carpeta<select name="carpeta">${Object.entries(labels).map(([k,v])=>`<option value="${k}" ${(npc?.carpeta??'minons')===k?'selected':''}>${v}</option>`).join('')}</select></label><label>Statblock JSON<textarea name="json" rows="22" spellcheck="false" required>${esc(JSON.stringify(template,null,2))}</textarea></label><p class="description">Los grupos ya creados conservan una copia de la ficha con la que entraron al combate.</p><p class="bad" data-error role="alert"></p><button class="primary">Guardar statblock</button></form>`,'npc-editor');
  d.querySelector('form').onsubmit=async e=>{e.preventDefault();try{const f=new FormData(e.target),n=JSON.parse(f.get('json'));await commit('/catalogo','POST',{carpeta:f.get('carpeta'),npc:n});selected=n.id;renderDM();d.close();}catch(e){d.querySelector('[data-error]').textContent=e.message;}};
 }
 function roster(g,readOnly=false,roll=null){
  const d=modal(g.nombre,'','npc-roster-dialog');
  function draw(group){
   const n=group.npc,body=d.querySelector('[data-body]');
   body.innerHTML=`<p>${rosterSummary(group)}</p><p class="description">Acciones conjuntas ${group.acciones_maximas-group.acciones_usadas} / ${group.acciones_maximas}. Las excepciones individuales se llevan debajo.</p>${readOnly?'':`${aguanteForm(n)}<p class="hint">Esbirros: una Maniobra Defensiva por ronda, básica y con coste de 1 Reacción; Arrebatado la impide.</p><form data-all class="row-form">${n.salud.tipo==='golpes'?'<label><input name="grave" type="checkbox"> Herida Grave</label>':'<label>Heridas finales por integrante<input name="heridas" type="number" min="1" value="1" required></label>'}<button>Aplicar impacto a todos</button></form>`}
   <div class="npc-members">${group.integrantes.map(m=>{
    const h=npcHealth(n,m),used=actionsUsed(group,m),total=memberActions(group,m);return `<article class="npc-member ${h.caido?'npc-fallen':''}" data-member="${m.id}"><div class="item-head"><h3>${esc(m.nombre)}</h3><span class="${h.caido?'bad':'good'}">${h.caido?'Caído':'En pie'}</span></div><p>${healthText(n,m)}</p><p class="description">${m.estados.length?esc(m.estados.join(' · ')):'Sin estados'} · Acciones ${used} / ${total} · Reacciones usadas ${m.reacciones_usadas} / ${n.defensa_esbirro?.maniobras_por_ronda??1}</p>
    ${readOnly?'':`<div class="item-actions">${n.salud.tipo==='golpes'?'<button data-hit="normal">Golpe</button><button data-hit="grave">Herida Grave</button>':`<form data-hit-form class="row-form"><label>Heridas finales<input name="heridas" type="number" min="1" value="1" required></label><button>Aplicar heridas</button></form>`}<button data-defend ${h.caido||!canDefend(m,n)?'disabled':''}>Defensa ${n.defensa_esbirro?.version??'basica'} · 1 Reacción</button><button data-extra ${h.caido||m.ajuste_acciones<=0||group.acciones_usadas<group.acciones_maximas||used>=total?'disabled':''}>Acción adicional</button></div><details><summary>Ajustar heridas y estados</summary><form data-edit class="stack"><div class="grid">${(n.salud.tipo==='golpes'?['golpes','graves']:['heridas','graves']).map(k=>`<label>${label(k)} recibidas<input name="${k}" type="number" min="0" value="${m[k]}" required></label>`).join('')}<label>Ajuste de acciones<input name="ajuste_acciones" type="number" min="-3" max="20" value="${m.ajuste_acciones}" required></label></div><label>Estados separados por coma<input name="estados" value="${esc(m.estados.join(', '))}" placeholder="Arrebatado, Aturdido"></label><button>Guardar integrante</button></form></details>`}</article>`;}).join('')}</div>`;
   if(readOnly)return;
   const act=async b=>{try{await patch(group,b);const updated=data.grupos.find(x=>x.id===group.id);if(updated)draw(updated);else d.close();}catch(e){try{await refresh();}catch{}const updated=data?.grupos.find(x=>x.id===group.id);if(updated)draw(updated);const message=document.createElement('p');message.className='bad';message.setAttribute('role','alert');message.textContent=e.message;body.prepend(message);}};
   bindAguante(body,values=>act({operacion:'aguante',...values}));
   body.querySelector('[data-all]').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);act({operacion:'impacto',todos:true,grave:f.has('grave'),heridas:Number(f.get('heridas'))});};
   body.querySelectorAll('[data-member]').forEach(row=>{const id=row.dataset.member;
    row.querySelectorAll('[data-hit]').forEach(b=>b.onclick=()=>act({operacion:'impacto',integrante_id:id,grave:b.dataset.hit==='grave'}));
    const hit=row.querySelector('[data-hit-form]');if(hit)hit.onsubmit=e=>{e.preventDefault();act({operacion:'impacto',integrante_id:id,heridas:Number(new FormData(e.target).get('heridas'))});};
    row.querySelector('[data-defend]').onclick=()=>act({operacion:'defensa',integrante_id:id});row.querySelector('[data-extra]').onclick=()=>act({operacion:'extra',integrante_id:id});
    row.querySelector('[data-edit]').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),b={operacion:'integrante',integrante_id:id,estados:f.get('estados').split(','),ajuste_acciones:Number(f.get('ajuste_acciones'))};for(const k of ['golpes','graves','heridas'])if(f.has(k))b[k]=Number(f.get(k));act(b);};
   });
  }draw(g);return d;
 }
 function bindRolls(root,n,perform){root.querySelectorAll('[data-npc-roll]').forEach(b=>b.onclick=()=>roller(n,perform,{habilidad:b.dataset.npcRoll}));root.querySelectorAll('[data-npc-action]').forEach(b=>b.onclick=()=>roller(n,perform,{accion_id:b.dataset.npcAction}));}
 function roller(n,perform,preset={}){
  const choices=[...Object.entries({...n.atributos,...n.combate,...n.especialidades}).map(([k,v])=>({key:'skill:'+k,text:label(k)+' · '+v,habilidad:k})),...n.acciones.filter(a=>a.valor!=null).map(a=>({key:'action:'+a.id,text:a.nombre+' · '+a.valor,accion_id:a.id}))];
  const initial=preset.accion_id?'action:'+preset.accion_id:preset.habilidad?'skill:'+preset.habilidad:choices[0]?.key;
  const d=modal('Dados · '+n.nombre,`<form class="stack"><label>Tirada<select name="tirada">${choices.map(c=>`<option value="${esc(c.key)}" ${c.key===initial?'selected':''}>${esc(c.text)}</option>`).join('')}</select></label><div class="grid"><label>Circunstancia<select name="circunstancia">${CIRCUMSTANCES.map(([c])=>`<option ${c==='Normal'?'selected':''}>${esc(c)}</option>`).join('')}</select></label><label>Exigencia<input name="dificultad" type="number" min="0" max="99" value="0"></label><label>Ventaja<input name="ventaja" type="number" min="0" max="99" value="0"></label><label>Desventaja<input name="desventaja" type="number" min="0" max="99" value="0"></label><label>Salvataje<input name="salvataje" type="number" min="0" max="99" placeholder="Sin Salvataje"></label></div><label><input name="conjunta" type="checkbox"> Salvación conjunta (opcional)</label><button class="primary">Tirar 1d100</button><p class="bad" data-error role="alert"></p></form><div class="npc-roll-result" aria-live="polite"></div>`,'npc-roller');
  d.querySelector('form').onsubmit=async e=>{e.preventDefault();const submit=e.target.querySelector('button');submit.disabled=true;try{const f=new FormData(e.target),choice=choices.find(c=>c.key===f.get('tirada')),b={circunstancia:f.get('circunstancia')};if(choice.accion_id)b.accion_id=choice.accion_id;else b.habilidad=choice.habilidad;for(const k of ['dificultad','ventaja','desventaja','salvataje'])if(f.get(k)!=='')b[k]=Number(f.get(k));const r=await perform(b);d.querySelector('.npc-roll-result').innerHTML=`<strong class="npc-die">${String(r.dado).padStart(2,'0')}</strong><p class="${r.supera?'good':'bad'}">${esc(r.resultado)}</p><p>Objetivo ${r.objetivo} · ${esc(r.circunstancia)}</p>${f.has('conjunta')?'<p class="hint">Todos los integrantes afectados comparten este resultado.</p>':''}`;d.querySelector('[data-error]').textContent='';}catch(e){d.querySelector('[data-error]').textContent=e.message;}finally{submit.disabled=false;}};
 }
 async function playerView(){
  const p=current();if(!p)return;const links=await api(`personajes/${p.id}/companeros`);if(current()?.id!==p.id)return;
  players.innerHTML=`<div class="item-head"><div><small>PERSONAJE #${p.id}</small><h1>Compañeros de ${esc(p.nombre)}</h1></div><button id="companions-refresh">Actualizar</button></div><p class="description">Compañeros asignados por el narrador. El seguimiento del combate lo lleva el DM.</p><div class="npc-companions">${links.map(v=>`<section class="panel" data-link="${esc(v.id)}"><h2>${esc(v.nombre||v.npc?.nombre||v.npc_id)}</h2><p>${v.cantidad} integrantes · Esbirro ${esc(v.control)}</p>${v.npc?statblock(v.npc):'<p class="bad">La ficha vinculada no está disponible.</p>'}${v.grupos.map(g=>`<div class="list-item"><strong>${esc(g.nombre)}</strong><p>${rosterSummary(g)}</p><button data-companion-group="${g.id}">Ver integrantes (${g.integrantes.length})</button></div>`).join('')||'<p class="muted">Sin grupo desplegado en combate.</p>'}</section>`).join('')||'<section class="panel"><p>Tu personaje todavía no tiene compañeros vinculados.</p></section>'}</div>`;
  players.querySelector('#companions-refresh').onclick=guard(playerView);
  players.querySelectorAll('[data-link]').forEach(card=>{const v=links.find(v=>v.id===card.dataset.link);if(v.npc)bindRolls(card,v.npc,body=>api(`personajes/${p.id}/companeros/tiradas`,'POST',{vinculo_id:v.id,...body}));card.querySelectorAll('[data-companion-group]').forEach(b=>b.onclick=()=>roster(v.grupos.find(g=>g.id===b.dataset.companionGroup),true));});
 }
 document.querySelector('#nav-dm').onclick=guard(async()=>{show('dm');if(sessionStorage.getItem(DM_KEY))await refresh();else login();});
 document.querySelector('#nav-companions').onclick=guard(async()=>{show('companions');await playerView();});
 return {clear(){players.replaceChildren();}};
}
