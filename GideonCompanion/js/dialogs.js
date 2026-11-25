// Formularios propios: el navegador integrado no admite prompt()/confirm().
function formDialog({title,message,confirmLabel,available,suggested,onSubmit}){
 return new Promise(resolve=>{
  const previous=document.activeElement,overlay=document.createElement('div');overlay.className='companion-dialog-backdrop';
  overlay.innerHTML='<section class="companion-dialog" role="dialog" aria-modal="true" aria-labelledby="companion-dialog-title"><h2 id="companion-dialog-title"></h2><p data-message></p><form class="stack"><label data-value-label>XP adicional<input name="xp" type="number" min="1" step="1" required></label><p data-balance class="muted"></p><p data-error class="bad" role="alert" hidden></p><div class="item-actions"><button type="button" data-cancel>Cancelar</button><button type="submit" class="primary" data-submit></button></div></form></section>';
  overlay.querySelector('h2').textContent=title;overlay.querySelector('[data-message]').textContent=message;
  const form=overlay.querySelector('form'),input=form.querySelector('input'),submit=form.querySelector('[data-submit]'),cancel=form.querySelector('[data-cancel]'),error=form.querySelector('[data-error]');
  const numeric=available!==undefined;let busy=false;
  overlay.querySelector('[data-value-label]').hidden=!numeric;input.disabled=!numeric;input.required=numeric;
  if(numeric){input.max=available;input.value=Math.max(1,Math.min(suggested??1,available));overlay.querySelector('[data-balance]').textContent=`XP disponible: ${available}`;submit.disabled=available<1;}
  else overlay.querySelector('[data-balance]').hidden=true;
  submit.textContent=confirmLabel;
  const close=result=>{document.removeEventListener('keydown',keyboard);overlay.remove();if(previous?.isConnected)previous.focus();resolve(result);};
  const keyboard=event=>{
   if(event.key==='Escape'){event.preventDefault();event.stopPropagation();if(!busy)close(null);}
   if(event.key==='Tab'){const focusable=[...overlay.querySelectorAll('button,input')].filter(el=>!el.disabled&&!el.closest('[hidden]'));const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
  };
  cancel.onclick=()=>{if(!busy)close(null);};
  form.onsubmit=async event=>{
   event.preventDefault();const value=numeric?Number(input.value):true;
   if(numeric&&(!Number.isSafeInteger(value)||value<1||value>available)){error.textContent='Indica una cantidad entera dentro de tu XP disponible.';error.hidden=false;return;}
   busy=true;submit.disabled=true;cancel.disabled=true;input.disabled=true;error.hidden=true;submit.textContent='Guardando…';
   try{await onSubmit(value);close(value);}catch(e){error.textContent=e.message;error.hidden=false;busy=false;submit.disabled=false;cancel.disabled=false;input.disabled=!numeric;submit.textContent=confirmLabel;}
  };
  document.body.append(overlay);document.addEventListener('keydown',keyboard);if(numeric&&available>0){input.focus();input.select();}else cancel.focus();
 });
}
export function investXP({name,available,suggested=1,onSubmit}){
 return formDialog({title:'Invertir más XP',message:name,available,suggested,confirmLabel:'Confirmar inversión',onSubmit});
}
export function confirmAction({message,confirmLabel='Confirmar',onConfirm}){
 return formDialog({title:'Confirmar cambio',message,confirmLabel,onSubmit:onConfirm});
}
