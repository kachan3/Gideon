import {referenceMatcher,referencePattern,unmark} from './reference-format.js';

export function installReferences(data) {
  const rules=new Map(data.reglas.map(r=>[r.id,r]));
  const definition=id=>rules.get(id);
  const reported=new Set();
  const match=referenceMatcher(data.aliases, issue=>{
    const key=issue.reason+':'+issue.target;
    if(!reported.has(key)){reported.add(key);console.warn('Referencia de Gideon sin resolver:',issue);}
  });
  const card=document.createElement('aside');
  card.className='reference-card';
  card.id='reference-preview';
  card.setAttribute('role','tooltip');
  card.hidden=true;
  document.body.append(card);
  let trigger, closeTimer, fadeTimer;
  const ignore='script,style,textarea,input,select,option,[contenteditable=true],[data-rule-ref],#reference-preview';
  const visibleContent='main,dialog,.modal,[role=dialog]';

  function renderText(node, marked) {
    const entries=[...marked.matchAll(referencePattern)];
    if(!entries.length) {node.textContent=marked;return;}
    const fragment=document.createDocumentFragment();
    let offset=0;
    for(const part of entries) {
      fragment.append(marked.slice(offset,part.index));
      const [,id,label]=part;
      if(definition(id,label)){
        const ref=document.createElement('span');
        ref.className='rule-reference';
        ref.dataset.ruleRef=id;
        ref.textContent=label;
        if(!node.parentElement?.closest('button,a,summary,label')) {
          ref.tabIndex=0;
          ref.setAttribute('role','button');
        }
        fragment.append(ref);
      } else fragment.append(label);
      offset=part.index+part[0].length;
    }
    fragment.append(marked.slice(offset));
    node.replaceWith(fragment);
  }
  function decorate(node) {
    const parent=node.parentElement;
    if(!parent || parent.closest(ignore) || !parent.closest(visibleContent)) return;
    const text=node.data;
    if(!text.trim()) return;
    if(parent.closest('code,pre')){node.textContent=unmark(text);return;}
    const marked=match(text);
    renderText(node,marked);
  }
  function scan(root) {
    if(root.nodeType===Node.TEXT_NODE) {decorate(root);return;}
    if(root.nodeType!==Node.ELEMENT_NODE || root.closest(ignore)) return;
    const nodes=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const pending=[];
    while(nodes.nextNode()) pending.push(nodes.currentNode);
    pending.forEach(decorate);
  }
  // Observe rerenders in the wizard, shop, encounter panels and native dialogs.
  // Disconnect during decoration so our own spans never cause another pass.
  const observer=new MutationObserver(changes=>{
    observer.disconnect();
    for(const change of changes) {
      if(change.type==='characterData') decorate(change.target);
      else for(const node of change.addedNodes) if(node.isConnected) scan(node);
    }
    if(trigger&&!trigger.isConnected) hide();
    observe();
  });
  const observe=()=>observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  scan(document.body); observe();

  function cancelClose(){clearTimeout(closeTimer); clearTimeout(fadeTimer);}
  function hide() {
    cancelClose();
    trigger?.removeAttribute('aria-describedby');
    trigger=null;
    card.classList.remove('visible');
    fadeTimer=setTimeout(()=>{card.hidden=true;},160);
  }
  function leave(){closeTimer=setTimeout(hide,110);}
  function position(anchor) {
    const box=anchor.getBoundingClientRect(), padding=8;
    const width=card.offsetWidth, height=card.offsetHeight;
    card.style.left=Math.max(padding,Math.min(box.left,innerWidth-width-padding))+'px';
    const below=box.bottom+padding;
    card.style.top=Math.max(padding,Math.min(below+height<=innerHeight?below:box.top-height-padding,innerHeight-height-padding))+'px';
  }
  function show(ref) {
    const entry=definition(ref.dataset.ruleRef,ref.textContent);
    if(!entry) return;
    cancelClose();
    if(trigger===ref && !card.hidden){card.classList.add('visible');return;}
    const nested=card.contains(ref);
    if(!nested) {
      trigger?.removeAttribute('aria-describedby');
      trigger=ref;
      trigger.setAttribute('aria-describedby',card.id);
      const host=ref.closest('dialog[open]')??document.body;
      if(card.parentNode!==host) host.append(card);
    }
    const heading=document.createElement('strong'),body=document.createElement('div');
    heading.textContent=entry.nombre;body.textContent=entry.texto;
    if(body.firstChild)renderText(body.firstChild,match(entry.texto));
    card.replaceChildren(heading,body);
    card.scrollTop=0;
    card.hidden=false;
    if(!nested)position(ref);
    requestAnimationFrame(()=>{if(trigger)card.classList.add('visible');});
  }
  const nearest=e=>e.target.closest?.('[data-rule-ref]')??e.target.closest?.('button')?.querySelector('[data-rule-ref]');
  document.addEventListener('pointerover',e=>{
    if(e.pointerType==='touch')return;
    const ref=nearest(e);
    if(ref&&!card.contains(ref))show(ref);
    else if(card.contains(e.target))cancelClose();
  });
  document.addEventListener('pointerout',e=>{
    if(!trigger || e.pointerType==='touch')return;
    if((trigger.contains(e.target)||card.contains(e.target))&&!trigger.contains(e.relatedTarget)&&!card.contains(e.relatedTarget))leave();
  });
  document.addEventListener('focusin',e=>{const ref=nearest(e);if(ref&&!card.contains(ref))show(ref);else if(card.contains(e.target))cancelClose();else if(trigger)hide();});
  document.addEventListener('focusout',e=>{if(trigger&&(trigger.contains(e.target)||card.contains(e.target))&&!card.contains(e.relatedTarget))leave();});
  document.addEventListener('click',e=>{
    const ref=nearest(e);
    if(ref)show(ref);
    else if(!card.contains(e.target)&&trigger)hide();
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&trigger)hide();
    const ref=nearest(e);
    if(ref&&e.target===ref&&ref.getAttribute('role')==='button'&&['Enter',' '].includes(e.key)){e.preventDefault();show(ref);}
  });
  window.addEventListener('resize',()=>{if(trigger)position(trigger);});
  document.addEventListener('scroll',e=>{
    if(!trigger||card.contains(e.target))return;
    const box=trigger.getBoundingClientRect();
    if(box.bottom<0||box.right<0||box.top>innerHeight||box.left>innerWidth)hide();
    else position(trigger);
  },true);
}
