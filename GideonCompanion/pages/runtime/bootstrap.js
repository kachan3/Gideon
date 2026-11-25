import {DatabaseSync} from './sqlite.js';
import {makeServer} from '../engine/sql/server.mjs';
import {identifyCharacter} from '../engine/sql/access.mjs';
import {exportFiles,restoreFiles} from './fs.js';
import {openLibrary,readCollection,listCollections,saveCollection,bytesToBase64,validateArchive} from './library.js';

const $=s=>document.querySelector(s),networkFetch=globalThis.fetch.bind(globalThis),root=new URL('../',import.meta.url);
const scope=root.pathname,activeKey='gideon.pages.active:'+scope;
let collection,engine,handler,library,manifest,SQL,queue=Promise.resolve(),storageFailed=false;
const notice=document.createElement('p');notice.id='pages-status';notice.setAttribute('role','status');
function report(text,bad=false){notice.textContent=text;notice.classList.toggle('failure',bad);}
function download(value,name){const url=URL.createObjectURL(new Blob([JSON.stringify(value)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
async function loadSQLite(){
 // GitHub Actions includes both files in the published site. The pinned CDN is
 // only a fallback for preparing a local build without an npm installation.
 for(const url of [new URL('vendor/sql-wasm.js',root).href,'https://cdn.jsdelivr.net/npm/sql.js@1.16.0/dist/sql-wasm.js']){
  try{
   await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=url;s.onload=resolve;s.onerror=()=>{s.remove();reject(Error('No se pudo cargar SQLite.'));};document.head.append(s);});
   return await globalThis.initSqlJs({useOldExtensionFunctions:false,locateFile:file=>new URL(file,url).href});
  }catch(e){console.warn(e.message);}
 }
 throw Error('No se pudo cargar el motor de fichas. Revisá tu conexión y volvé a intentar.');
}
function snapshot(){return {...collection,bytes:engine.export(),files:exportFiles(),updated:new Date().toISOString()};}
async function persist(){const next={...snapshot(),revision:(collection.revision??0)+1};await saveCollection(library,next,collection.revision??0);collection=next;}
function setSession(){sessionStorage.removeItem('gideon.token');sessionStorage.removeItem('gideon.personajes');sessionStorage.setItem('gideon.personajes',JSON.stringify(collection.characters));if(collection.selected)sessionStorage.setItem('gideon.token',collection.selected);}
function recordAccess(path,method,body,authorization){
 if(path==='/api/personajes'&&method==='POST'&&body.token_acceso){collection.characters.push({id:body.id,nombre:body.nombre,token:body.token_acceso});collection.selected=body.token_acceso;return;}
 const token=authorization?.replace(/^Bearer /,'');if(token&&collection.characters.some(p=>p.token===token))collection.selected=token;
}
async function request(input,options={}){
 const url=new URL(typeof input==='string'?input:input.url,location.href);
 if(url.origin!==location.origin||!url.pathname.startsWith('/api/'))return networkFetch(input,options);
 if(storageFailed)throw Error('El guardado no está disponible. Descargá una copia de tus fichas y recargá la página.');
 const operation=async()=>{
  const method=(options.method??'GET').toUpperCase(),headers=Object.fromEntries(new Headers(options.headers).entries());headers.host=url.host;
  const req={url:url.pathname+url.search,method,headers,socket:{remoteAddress:'browser'},async *[Symbol.asyncIterator](){if(options.body)yield options.body;}};
  let status=200,responseText;
  await handler.handle(req,{writeHead(code){status=code;},end(text){responseText=text;}});
  const data=JSON.parse(responseText);
  if(status>=200&&status<300){
   recordAccess(url.pathname,method,data,headers.authorization);
   // Reading a character can reconcile grants; save those operations too.
   if(method!=='GET'||/^\/api\/personajes(?:\/|$)/.test(url.pathname)){
    try{await persist();report('Guardado en este dispositivo');renderLibrary();}
    catch(e){storageFailed=true;report(e.message,true);throw e;}
   }
  }
  return new Response(responseText,{status,headers:{'Content-Type':'application/json'}});
 };
 const result=queue.then(operation);queue=result.catch(()=>{});return result;
}
async function chooseCharacter(person){try{await queue;collection.selected=person.token;await persist();setSession();location.reload();}catch(e){report(e.message,true);}}
function renderLibrary(){
 const home=$('#pages-characters');if(!home)return;home.replaceChildren();
 if(!collection.characters.length){const p=document.createElement('p');p.textContent='Todavía no creaste personajes en este navegador.';home.append(p);}
 for(const p of collection.characters){const button=document.createElement('button');button.textContent=p.nombre;button.onclick=()=>chooseCharacter(p);home.append(button);}
 const select=$('#pages-character');const previous=select.value;select.replaceChildren(new Option('Abrir un personaje…',''));
 for(const p of collection.characters)select.append(new Option(p.nombre,String(p.id)));
 select.value=previous;select.hidden=!collection.characters.length;
}
async function exportBackup(){await queue;download({format:'gideon-pages-backup',version:1,manifest:collection.manifest,characters:collection.characters,selected:collection.selected,files:exportFiles(),database:bytesToBase64(engine.export()),exported:new Date().toISOString()},'gideon-personajes-'+new Date().toISOString().slice(0,10)+'.json');}
async function importBackup(file){
 if(!file||file.size>38_000_000)throw Error('Elegí una copia de Gideon de menos de 38 MB.');
 const data=JSON.parse(await file.text()),bytes=validateArchive(data,manifest),candidate=new DatabaseSync(new SQL.Database(bytes));
 try{
  if(candidate.prepare('PRAGMA integrity_check').get().integrity_check!=='ok'||candidate.prepare('PRAGMA foreign_key_check').all().length)throw Error('La copia contiene fichas dañadas.');
  if(candidate.prepare('SELECT MAX(version) n FROM schema_migrations').get().n!==manifest.schemaVersion)throw Error('La versión de la copia no coincide.');
  const ids=candidate.prepare('SELECT id FROM personajes').all();if(ids.length!==data.characters.length)throw Error('La copia no contiene los accesos de todas las fichas.');
  for(const p of data.characters){const owner=identifyCharacter(candidate,p.token);if(!owner||owner.id!==p.id)throw Error('No coincide el acceso de una ficha de la copia.');p.nombre=owner.nombre;}
 }finally{candidate.close();}
 // Import into a NEW collection; never overwrite the visitor's existing sheets.
 const next={id:crypto.randomUUID(),scope,name:'Copia importada · '+new Date().toLocaleDateString('es-AR'),revision:1,bytes,characters:data.characters,selected:data.characters.some(p=>p.token===data.selected)?data.selected:data.characters[0]?.token??'',files:data.files??{},manifest:data.manifest};
 const oldFiles=exportFiles();try{restoreFiles(next.files);}finally{restoreFiles(oldFiles);}
 await saveCollection(library,next,0);localStorage.setItem(activeKey,next.id);location.reload();
}
async function setupUI(){
 document.body.classList.add('static-mode');
 const toolbar=document.createElement('section');toolbar.id='pages-toolbar';toolbar.setAttribute('aria-label','Tus fichas');
 toolbar.innerHTML='<div class="pages-tools"><strong>Gideon · Mesa de prueba</strong><select id="pages-collection" aria-label="Colección de personajes"></select><select id="pages-character" aria-label="Abrir un personaje"></select><button id="pages-export">Descargar copia</button><button id="pages-import">Importar copia</button><input id="pages-file" type="file" accept=".json,application/json" hidden></div><p>Las fichas se guardan en este navegador. Descargá una copia para conservarlas o llevarlas a otro dispositivo.</p>';
 toolbar.append(notice);$('#sql-app header').after(toolbar);
 const home=document.createElement('div');home.id='pages-home';home.className='panel';home.innerHTML='<h1>Creá tu personaje de Gideon</h1><p>Elegí un linaje y una Senda, distribuí tus atributos y prepará tu ficha para jugar.</p><button id="pages-create" class="primary">Crear mi personaje</button><h2>Mis personajes</h2><div id="pages-characters" class="pages-characters"></div>';
 $('#access').prepend(home);
 $('#pages-create').onclick=()=>$('#nav-create').click();
 $('#pages-character').onchange=e=>{const p=collection.characters.find(p=>p.id===Number(e.target.value));if(p)chooseCharacter(p);};
 const collections=await listCollections(library,scope),selector=$('#pages-collection');for(const c of collections)selector.append(new Option(c.name,c.id));selector.value=collection.id;selector.hidden=collections.length<2;selector.onchange=e=>{localStorage.setItem(activeKey,e.target.value);location.reload();};
 $('#pages-export').onclick=()=>exportBackup().catch(e=>report(e.message,true));
 $('#pages-import').onclick=()=>$('#pages-file').click();
 $('#pages-file').onchange=async e=>{try{await importBackup(e.target.files[0]);}catch(error){report(error.message,true);}finally{e.target.value='';}};
 $('#logout').textContent='Cambiar personaje';
 $('#sql-app footer').textContent='Gideon · Fichas guardadas en este dispositivo · Sin cuenta ni instalación';
 renderLibrary();
}
try{
 $('#connection').textContent='Preparando tus fichas…';
 const [loadedSQL,opened,metadata]=await Promise.all([loadSQLite(),openLibrary(),networkFetch(new URL('catalogue-manifest.json',root)).then(r=>{if(!r.ok)throw Error('No se pudo cargar el catálogo.');return r.json();})]);SQL=loadedSQL;library=opened;manifest=metadata;
 const id=localStorage.getItem(activeKey);collection=id?await readCollection(library,id):null;
 if(collection&&collection.scope!==scope)throw Error('Colección de otro sitio.');
 if(!collection){
  const response=await networkFetch(new URL('catalogue.sqlite',root));if(!response.ok)throw Error('No se pudo cargar el catálogo.');
  collection={id:crypto.randomUUID(),scope,name:'Mis personajes',revision:0,bytes:new Uint8Array(await response.arrayBuffer()),characters:[],selected:'',files:{},manifest};
 }
 if(collection.manifest.schemaVersion!==manifest.schemaVersion)throw Error('Tus fichas pertenecen a una versión anterior. Conservá el guardado de este navegador para poder migrarlas.');
 restoreFiles(collection.files);engine=new DatabaseSync(new SQL.Database(collection.bytes));handler=makeServer(engine,{catalogueToken:'',dmToken:'pages-local'});
 if(!collection.revision){await persist();localStorage.setItem(activeKey,collection.id);}
 setSession();globalThis.fetch=request;
 await import('../js/companion.js');await setupUI();
 $('#connection').textContent='Fichas en este dispositivo';
 report(collection.manifest.catalogueVersion===manifest.catalogueVersion?'Guardado local listo':'Hay un catálogo más nuevo. Esta colección conserva su catálogo original.');
}catch(e){
 console.error(e);$('#connection').textContent='No se pudo abrir Gideon';$('#error').hidden=false;$('#error').textContent=e.message;
 const recovery=document.createElement('button');recovery.textContent='Descargar guardado para recuperación';recovery.onclick=()=>{if(collection)download({...collection,bytes:bytesToBase64(new Uint8Array(collection.bytes))},'gideon-recuperacion.json');};if(collection)$('#error').append(recovery);
}
