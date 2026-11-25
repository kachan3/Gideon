import {ZONAS} from './combat-rules.js';
import {CIRCUMSTANCES} from './roll-rules.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function openDice({title,value,perform,single=false,spell=false,attack=false,attribute=false,skills=[],preserveRoll=false}){
 const previous=document.activeElement,overlay=document.createElement('div');overlay.className='companion-dialog-backdrop';
 overlay.innerHTML=`<section class="companion-dialog dice-dialog" role="dialog" aria-modal="true" aria-labelledby="dice-title"><div class="item-head"><h2 id="dice-title">${esc(title)}</h2><button type="button" data-close aria-label="Cerrar dados">×</button></div><form class="stack">
 ${skills.length?`<label>Habilidad<select name="skill_id">${skills.map(s=>`<option value="${s.id}">${esc(s.nombre)} · ${s.valor}</option>`).join('')}</select></label>`:`<p class="roll-target">Valor <strong>${value}</strong> · 2d10 → 00–99</p>`}
 <div class="grid"><label>Circunstancia<select name="circunstancia">${CIRCUMSTANCES.map(([n,v])=>`<option ${n==='Normal'?'selected':''}>${n}</option>`).join('')}</select></label>${spell?'':`<label>Exigencia (NE mínimos)<input name="dificultad" type="number" min="0" max="99" value="0" required></label>`}</div>
 <details><summary>Modificadores de la tirada</summary><div class="grid"><label>Ventaja<input name="ventaja" type="number" min="0" max="99" value="0"></label><label>Desventaja<input name="desventaja" type="number" min="0" max="99" value="0"></label><label>Dados extra de decenas<input name="decenas_extra" type="number" min="-99" max="99" value="0"><small>Positivos para Bonificación. Negativos para Penalización.</small></label><label>Salvataje<input name="salvataje" type="number" min="0" max="99" placeholder="Sin Salvataje"></label><label><input name="omen" type="checkbox"> Éxito Asegurado · gastar 1 Omen con aprobación del DM</label>${attack?`<label>Apuntar<select name="apuntar"><option value="">Sin apuntar</option>${ZONAS.map(z=>`<option>${z}</option>`).join('')}</select></label>`:''}</div></details>
 ${(attribute||skills.length)?'<label data-dm-request><input name="solicitada_dm" type="checkbox"> Tirada directa de atributo solicitada por el DM (marca en caso de fallo)</label>':''}
 <div class="dice-stage" aria-hidden="true"><span class="die" data-tens>0</span><span class="die" data-units>0</span></div>
 <button class="primary" type="submit">Tirar dados</button><p data-error class="bad" role="alert" hidden></p></form><div class="dice-result" aria-live="polite"></div></section>`;
 const form=overlay.querySelector('form'),submit=form.querySelector('[type=submit]'),result=overlay.querySelector('.dice-result'),err=overlay.querySelector('[data-error]'),dice=[overlay.querySelector('[data-tens]'),overlay.querySelector('[data-units]')];let busy=false,used=false;
 if(preserveRoll){form.querySelector('.grid').hidden=true;form.querySelector('details').hidden=true;form.insertAdjacentHTML('afterbegin','<p>Se conservan las circunstancias y los modificadores de la tirada original.</p>');}
 const close=()=>{if(busy)return;overlay.remove();document.removeEventListener('keydown',keyboard);if(previous?.isConnected)previous.focus();};
 const skillSelect=form.elements.skill_id;
 if(skillSelect){const update=()=>{form.querySelector('[data-dm-request]').hidden=skills.find(s=>s.id===Number(skillSelect.value))?.tipo!=='Atributo';};skillSelect.onchange=update;update();}
 function keyboard(e){if(e.key==='Escape'){e.preventDefault();close();}if(e.key==='Tab'){const all=[...overlay.querySelectorAll('button,input,select,summary')].filter(b=>!b.disabled),first=all[0],last=all.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}
 overlay.querySelector('[data-close]').onclick=close;document.addEventListener('keydown',keyboard);document.body.append(overlay);form.querySelector('select').focus();
 form.onsubmit=async e=>{
  e.preventDefault();if(busy||(single&&used))return;busy=true;submit.disabled=true;err.hidden=true;overlay.classList.add('rolling');
  const f=new FormData(form),options={circunstancia:f.get('circunstancia'),dificultad:Number(f.get('dificultad')??0)};for(const key of ['ventaja','desventaja','salvataje','decenas_extra'])if(f.get(key)!=='')options[key]=Number(f.get(key));if(f.has('solicitada_dm'))options.solicitada_dm=true;if(f.has('omen'))options.omen=true;if(f.get('apuntar'))options.apuntar=f.get('apuntar');if(f.has('skill_id'))options.skill_id=Number(f.get('skill_id'));
  const controls=[...form.querySelectorAll('input,select')];controls.forEach(c=>c.disabled=true);
  const animated=!matchMedia('(prefers-reduced-motion: reduce)').matches,timer=animated?setInterval(()=>dice.forEach(d=>d.textContent=Math.floor(Math.random()*10)),65):null;
  try{
   let [r]=await Promise.all([perform(options),new Promise(r=>setTimeout(r,animated?650:0))]);
   if(r?.elegir){
    if(timer)clearInterval(timer);overlay.classList.remove('rolling');
    const choice=await new Promise(resolve=>{
     result.innerHTML='<p>'+(r.penalizacion?'Penalización · el Director elige la peor decena.':'Bonificación · elegí la decena que querés usar.')+'</p>';
     r.dados.forEach((d,i)=>{const button=document.createElement('button');button.type='button';button.textContent=String(d).padStart(2,'0');button.onclick=()=>resolve(i);result.append(button);});
     const cancel=document.createElement('button');cancel.type='button';cancel.textContent='Cancelar';cancel.onclick=()=>resolve(null);result.append(cancel);
     result.querySelector('button').focus();
    });
    result.textContent='';
    if(choice===null)return;
    r=await perform({...options,clave:r.clave,eleccion:choice});
   }
   if(!r||r.aviso){result.textContent=r?.aviso??'Sin tirada.';used=true;return;}
   dice[0].textContent=Math.floor(r.dado/10);dice[1].textContent=r.dado%10;
   result.innerHTML=`<p class="roll-outcome ${r.supera?'good':'bad'}">${esc(r.resultado)}</p><p>${String(r.dado).padStart(2,'0')} vs ${r.objetivo} · ${esc(r.circunstancia)}${r.automatico?' · '+esc(r.automatico):''}</p><p class="muted">Normal: ${esc(r.normal.resultado)}</p>
   ${r.nota_as_marcial?`<p class="hint">${esc(r.nota_as_marcial)}</p>`:''}
    ${r.asegurado?'<p>Éxito Asegurado · 1 Omen gastado</p>':''}
   ${r.punteria?`<p>${esc(r.punteria.zona)} · ${r.punteria.impacta?'Impacto':'Ataque perdido'}${r.punteria.dados.length?' · d6: '+r.punteria.dados.join(', '):''}</p>`:''}
   ${r.dano!==undefined?`<p class="roll-outcome">Daño ${r.dano}${r.supera&&r.punteria?.impacta!==false?' · '+esc(r.formula):' · sin impacto'}</p>`:''}
   ${r.progreso!==undefined?`<p class="roll-outcome">${r.completado?'Conjuro completado':'Canalizando'} · ${r.progreso} / ${r.pl} NE</p><p>${r.delta>=0?'+':''}${r.delta} NE · ${r.mana_pagado} maná pagado · ${r.repeticion_libro?'Repetición del Libro: 1 Stamina':'2 PA'}</p>`:''}
   <details open><summary>Resultado por circunstancia · mismo dado</summary><div class="table-wrap"><table class="roll-index"><thead><tr><th>Circunstancia</th><th>Valor</th><th>Resultado</th></tr></thead><tbody>${r.indice.map(i=>`<tr ${i.circunstancia===r.circunstancia?'class="selected"':''}><td>${esc(i.circunstancia)}</td><td>${i.objetivo}</td><td class="${i.supera?'good':'bad'}">${esc(i.resultado)}</td></tr>`).join('')}</tbody></table></div></details>`;
   used=true;
  }catch(e){err.textContent=e.message;err.hidden=false;}
  finally{if(timer)clearInterval(timer);overlay.classList.remove('rolling');busy=false;controls.forEach(c=>c.disabled=single&&used);submit.disabled=single&&used;submit.textContent=single&&used?'Tirada registrada':'Volver a tirar';if(!(single&&used))submit.focus();else overlay.querySelector('[data-close]').focus();}
 };
}
