import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {openDatabase,makeServer,catalogue} from './server.mjs';

test('Chrome: clases ilustradas, Epifanías, recomendaciones, creación y recarga', {timeout:60000},async t=>{
 const db=openDatabase(':memory:'),server=makeServer(db),handler=server.listeners('request')[0];
 const chrome=spawn(process.env.CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--no-sandbox','--disable-crash-reporter','--no-first-run','--no-default-browser-check','--disable-gpu','--remote-debugging-pipe','--user-data-dir='+mkdtempSync(join(tmpdir(),'gideon-class-guide-')),'about:blank'],{windowsHide:true,stdio:['ignore','ignore','pipe','pipe','pipe']});
 const pending=new Map();let nextId=0,buffer='',onEvent=()=>{};
 t.after(()=>{chrome.kill();db.close();});
 const errors=[];
 chrome.stdio[4].on('data',chunk=>{
  buffer+=String(chunk);let end;
  while((end=buffer.indexOf('\0'))>=0){const data=JSON.parse(buffer.slice(0,end));buffer=buffer.slice(end+1);
   if(data.id){const w=pending.get(data.id);if(w){pending.delete(data.id);clearTimeout(w.timer);data.error?w.bad(Error(data.error.message)):w.ok(data.result);}}
   else {if(data.method==='Runtime.exceptionThrown')errors.push(data.params.exceptionDetails.exception?.description??data.params.exceptionDetails.text);onEvent(data);}
  }
 });
 const call=(method,params={},sessionId)=>new Promise((ok,bad)=>{const id=++nextId,timer=setTimeout(()=>bad(Error('CDP: '+method)),10000);pending.set(id,{ok,bad,timer});chrome.stdio[3].write(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})})+'\0');});
 const {targetId}=await call('Target.createTarget',{url:'about:blank'}),{sessionId}=await call('Target.attachToTarget',{targetId,flatten:true});
 onEvent=data=>{if(data.method!=='Fetch.requestPaused')return;
  (async()=>{
   const request=data.params.request,url=new URL(request.url);let status=200,headers={},body;
   await handler({url:url.pathname+url.search,method:request.method,headers:Object.fromEntries(Object.entries({...request.headers,Host:url.host}).map(([k,v])=>[k.toLowerCase(),v])),socket:{remoteAddress:'browser-test'},async *[Symbol.asyncIterator](){if(request.postData)yield request.postData;}},{writeHead(code,h){status=code;headers=h;},end(value){body=value;}});
   await call('Fetch.fulfillRequest',{requestId:data.params.requestId,responseCode:status,responseHeaders:Object.entries(headers).map(([name,value])=>({name,value:String(value)})),body:Buffer.from(body??'').toString('base64')},data.sessionId);
  })().catch(error=>errors.push(error.message));
 };
 await call('Fetch.enable',{patterns:[{urlPattern:'*'}]},sessionId);
 const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},sessionId);if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description??r.exceptionDetails.text);return r.result.value;};
 const wait=expression=>evaluate(`(async()=>{for(let i=0;i<200;i++){if(${expression})return true;await new Promise(r=>setTimeout(r,25));}throw Error(${JSON.stringify('No se cumplió: '+expression)}+'; '+document.querySelector('#error')?.textContent);})()`);
 const click=selector=>evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
 const select=(selector,value)=>evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});el.value=${JSON.stringify(String(value))};el.dispatchEvent(new Event('change',{bubbles:true}));})()`);
 const content=selector=>evaluate(`document.querySelector(${JSON.stringify(selector)}).textContent`);
 await call('Runtime.enable',{},sessionId);await call('Page.enable',{},sessionId);
 await call('Page.navigate',{url:'http://gideon.test/'},sessionId);await wait("document.querySelector('#connection')?.textContent.includes('conectado')");
 const c=catalogue(db),arcanist=c.clases.find(p=>p.nombre==='Senda del Arcanista');
 await click('#nav-create');await evaluate("document.querySelector('[name=nombre]').value='Arcanista visual'");await select('[name=linaje_id]',c.linajes.find(l=>l.codigo==='hijos_del_sol').id);await click('#next');
 assert.equal(await evaluate("document.querySelectorAll('.class-card').length"),6);
 for(const path of c.clases){await select('[name=clase_id]',path.id);assert((await content('.path-summary')).includes(path.nombre));}
 await select('[name=clase_id]',arcanist.id);
 await wait("[...document.querySelectorAll('.class-card img')].every(i=>i.complete&&i.naturalWidth>0)");
 assert.equal(await evaluate("document.querySelectorAll('.flow-grid dt').length"),6);
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true},sessionId);assert(await evaluate('document.documentElement.scrollWidth<=innerWidth'));
 await select('[name=rasgo_herramienta]','Bastón');await select('[name=rasgo_artefacto]','Blunderblaze');
 for(const [name,flow,effect] of [['Telekinesis','Gelmir','Empujón'],['Sintonía con la Llama','Ignamor','Combustión'],['Emaptomancia','Ivganny','Miedo'],['Virtud Anima','Naial','Anhelo'],['Memento Mori','Yrgrammar','Force Decay'],['Primera Paradoja','Cronibor','Ralentizar'],['Eyes for the Ages / Ojos para las Eras','Cronibor','Predicción']]){
  await select('[name=rasgo_epifania]','pendiente:'+name);assert((await content('[data-trait-choice=epifania]')).includes(effect));await click('#next');
  assert((await content('[data-epiphany-advice]')).includes(flow));assert.equal(await evaluate("document.querySelectorAll('.epiphany-recommended select').length"),1);
  await click('#previous');assert.equal(await evaluate("document.querySelector('[name=rasgo_epifania]').value"),'pendiente:'+name);
 }
 await select('[name=rasgo_epifania]','pendiente:Memento Mori');await click('#next');await click('#fill-attributes');await click('#next');
 await select('[name=dedicacion_id]',c.dedicaciones.find(d=>d.nombre==='Soldado').id);await select('[name=nacimiento_id]',c.nacimientos[0].id);await click('#next');
 assert.match(await content('.allocation-row.epiphany-recommended'),/Yrgram/);
 const skills=c.skills.filter(s=>s.tipo==='Habilidad'&&s.combate);for(let i=0;i<4;i++)await select(`[data-combat-slot="${[20,15,10,5][i]}"]`,skills[i].id);
 await evaluate("[...document.querySelectorAll('[data-normal]')].slice(0,3).forEach((e,i)=>{e.value=Number(e.min)+[20,20,10][i];e.dispatchEvent(new Event('input',{bubbles:true}));})");
 await select('[name=rasgo_epifania]','pendiente:Telekinesis');assert.match(await content('#pool-epiphany-advice'),/Gelmir/);assert.match(await content('.allocation-row.epiphany-recommended'),/Gelmir/);
 await select('[name=rasgo_epifania]','pendiente:Memento Mori');
 await click('#previous');await click('#next');assert.equal(await evaluate("document.querySelector('[name=rasgo_epifania]').value"),'pendiente:Memento Mori');
 await click('#next');assert((await content('#wizard-body')).includes('Memento Mori'));await click('#next');
 await wait("document.querySelector('#character-content h1')?.textContent==='Arcanista visual'");
 await wait("document.querySelector('dialog.gear-dialog[open]')");await click('dialog [data-move]');await select('dialog [name=ubicacion]','Mano principal');await evaluate("document.querySelector('dialog .gear-move-form').requestSubmit()");await wait("!document.querySelector('dialog .gear-move-form')");await click('dialog [data-finish]');await wait("!document.querySelector('dialog.gear-dialog[open]')");
 // Reload the authenticated in-memory character and inspect its granted repertoire.
 await call('Page.reload',{},sessionId);await wait("document.querySelector('[data-arcanist-guide]')");
 assert.match(await content('[data-arcanist-guide]'),/Force Decay/);assert.match(await content('[data-arcanist-guide]'),/Roting Touch/);
 assert.equal(await evaluate("document.querySelectorAll('[data-arcanist-guide] .flow-grid dt').length"),6);
 assert.deepEqual(errors,[]);
 await click('#nav-create');await evaluate("document.querySelector('[name=nombre]').value='Sombra visual'");await select('[name=linaje_id]',c.linajes.find(l=>l.codigo==='hijos_del_sol').id);await click('#next');
 await select('[name=clase_id]',c.clases.find(p=>p.nombre==='Senda del Hierofante').id);
 const question=c.preguntas_senda.find(q=>q.clase_id===c.clases.find(p=>p.nombre==='Senda del Hierofante').id);
 await select('[name=respuesta_senda_'+question.id+']',question.opciones[0].id);assert((await content('[data-path-choice-description]')).includes(question.opciones[0].descripcion));
 await click('#next');await click('#previous');assert.equal(await evaluate(`document.querySelector('[name=respuesta_senda_${question.id}]').value`),String(question.opciones[0].id));
 await select('[name=clase_id]',c.clases.find(p=>p.nombre==='Senda de la Sombra').id);assert.equal(await evaluate("document.querySelectorAll('[data-technical]').length"),4);
 await click('#next');assert.match(await content('#error'),/100 puntos/);
 await evaluate("[...document.querySelectorAll('[data-technical]')].forEach(e=>{e.value=25;e.dispatchEvent(new Event('input',{bubbles:true}));})");await click('#next');await click('#fill-attributes');await click('#next');
 await select('[name=dedicacion_id]',c.dedicaciones.find(d=>d.nombre==='Soldado').id);await select('[name=nacimiento_id]',c.nacimientos[0].id);await click('#next');
 for(let i=0;i<4;i++)await select(`[data-combat-slot="${[20,15,10,5][i]}"]`,skills[i].id);
 await evaluate("[...document.querySelectorAll('[data-normal]')].slice(0,3).forEach((e,i)=>{e.value=Number(e.min)+[20,20,10][i];e.dispatchEvent(new Event('input',{bubbles:true}));})");await click('#next');assert.match(await content('[data-technical-choices]'),/25/);await click('#next');
 await wait("document.querySelector('#character-content h1')?.textContent==='Sombra visual'");
 assert.match(await content('#character-content'),/Alquimia/);assert.deepEqual(errors,[]);
 const beginClass=async(name,path)=>{
  await wait("document.querySelector('dialog [data-finish]')");await click('dialog [data-finish]');await wait("!document.querySelector('dialog.gear-dialog[open]')");
  await click('#nav-create');await evaluate("document.querySelector('[name=nombre]').value="+JSON.stringify(name));await select('[name=linaje_id]',c.linajes.find(l=>l.codigo==='hijos_del_sol').id);await click('#next');await select('[name=clase_id]',c.clases.find(p=>p.nombre===path).id);
 };
 const prepareSkills=async()=>{
  await click('#next');await click('#fill-attributes');await click('#next');await select('[name=dedicacion_id]',c.dedicaciones.find(d=>d.nombre==='Soldado').id);await select('[name=nacimiento_id]',c.nacimientos[0].id);await click('#next');
  for(let i=0;i<4;i++)await select('[data-combat-slot="'+[20,15,10,5][i]+'"]',skills[i].id);
  await evaluate("[...document.querySelectorAll('[data-normal]')].slice(0,3).forEach((e,i)=>{e.value=Number(e.min)+[20,20,10][i];e.dispatchEvent(new Event('input',{bubbles:true}));})");
 };
 await beginClass('Valor visual','Senda del Valor');
 const martial=c.elecciones_rasgos.find(e=>e.tipo==='Marcial'),planned=martial.opciones.find(o=>o.nombre==='Golpe Dual'),chosen=martial.opciones.find(o=>o.nombre==='Ataque Simultáneo');
 await select('[name=rasgo_entrenamiento_superior]',planned.id);assert.match(await content('[data-martial-requirements]'),/85/);
 await click('#next');await click('#previous');assert.equal(await evaluate("document.querySelector('[name=rasgo_entrenamiento_superior]').value"),String(planned.id));
 await prepareSkills();assert(await evaluate(`document.querySelector('[name=rasgo_entrenamiento_superior] option[value="${planned.id}"]').disabled`));
 await select('[name=rasgo_entrenamiento_superior]',chosen.id);await click('#next');assert((await content('#wizard-body')).includes(chosen.nombre));await click('#next');
 await wait("document.querySelector('#character-content h1')?.textContent==='Valor visual'");assert.match(await content('#trait-choices-sheet'),/Ataque Simultáneo/);
 await beginClass('Honor visual','Senda del Honor');
 await select('[name=orden]','dragon-valeroso');assert.match(await content('[data-order-benefits]'),/50/);await select('[name=combo_orden_id]',c.ordenes_y_juramento.combos[0].id);
 await click('#next');await click('#previous');assert.equal(await evaluate("document.querySelector('[name=orden]').value"),'dragon-valeroso');assert.equal(await evaluate("document.querySelector('[name=combo_orden_id]').value"),String(c.ordenes_y_juramento.combos[0].id));
 await prepareSkills();await click('#next');assert.equal(await evaluate("document.querySelector('[name=orden]').value"),'dragon-valeroso');assert.equal(await evaluate("document.querySelector('[name=combo_orden_id]').value"),String(c.ordenes_y_juramento.combos[0].id));
 await click('#next');await click('#next');await wait("document.querySelector('#character-content h1')?.textContent==='Honor visual'");assert.match(await content('[data-order-sheet]'),/Dragón Valeroso/);assert.match(await content('[data-order-sheet]'),/50/);assert.deepEqual(errors,[]);

});
