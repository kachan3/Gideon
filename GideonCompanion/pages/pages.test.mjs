import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,mkdtemp,copyFile,unlink,rmdir} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {DatabaseSync} from 'node:sqlite';
import {createHash,randomBytes} from 'node:crypto';
import {build,output} from './build.mjs';
import * as browserCrypto from './runtime/crypto.js';
import {bytesToBase64,validateArchive} from './runtime/library.js';
import {FIXED_VALUES,ATTRIBUTE_ORDER} from '../js/creation-rules.js';

test('SHA-256 del navegador coincide con Node para tokens y textos de distintos tamaños',()=>{
 for(const length of [0,1,43,55,56,63,64,65,127,256,2048]){
  const data=randomBytes(length),expected=createHash('sha256').update(data).digest('hex');
  assert.equal(browserCrypto.createHash('sha256').update(data).digest('hex'),expected);
 }
 assert.equal(browserCrypto.createHash('sha256').update('Gideon · energía').digest('hex'),createHash('sha256').update('Gideon · energía').digest('hex'));
 assert.match(browserCrypto.randomBytes(32).toString('base64url'),/^[A-Za-z0-9_-]{43}$/);
});

test('el sitio se construye desde cero sin fichas, accesos, datos de sesión ni aventuras privadas',async()=>{
 await build();const db=new DatabaseSync(join(output,'catalogue.sqlite'),{readOnly:true});
 try{
  const manifest=JSON.parse(await readFile(join(output,'catalogue-manifest.json'),'utf8'));
  for(const t of manifest.personalTables)assert.equal(db.prepare(`SELECT COUNT(*) n FROM "${t}"`).get().n,0,t);
  assert(db.prepare('SELECT COUNT(*) n FROM linajes').get().n>0);
  assert(db.prepare('SELECT COUNT(*) n FROM reglas_atomicas').get().n>0);
  assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');
  assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(),[]);
  const files=await readFile(join(output,'runtime/files.js'),'utf8');
  assert(!files.includes('dm-access.local'));
  assert(!files.includes('Kor-Zath'));
  const html=await readFile(join(output,'index.html'),'utf8');assert(html.includes('src="runtime/bootstrap.js"'));
  for(const e of await readdir(join(output,'engine/sql'))){const source=await readFile(join(output,'engine/sql',e),'utf8');assert(!/from ['"]node:/.test(source),e);}
 }finally{db.close();}
});

test('las copias comprueban formato y versión antes de tocar las fichas actuales',async()=>{
 const bytes=new Uint8Array(await readFile(join(output,'catalogue.sqlite'))),manifest=JSON.parse(await readFile(join(output,'catalogue-manifest.json'),'utf8'));
 const archive={format:'gideon-pages-backup',version:1,manifest,characters:[],database:bytesToBase64(bytes)};
 assert.deepEqual(validateArchive(archive,manifest),bytes);
 assert.throws(()=>validateArchive({...archive,manifest:{schemaVersion:-1}},manifest),/compatible/);
 assert.throws(()=>validateArchive({...archive,database:btoa('not SQLite')},manifest),/SQLite/);
 assert.throws(()=>validateArchive({...archive,characters:[{id:1,nombre:'Prueba',token:'incorrecto'}]},manifest),/accesos/);
});

test('el motor publicado crea fichas con las mismas reglas, sin un servidor HTTP',async()=>{
 const folder=await mkdtemp(join(tmpdir(),'gideon-pages-test-')),file=join(folder,'sheets.sqlite');await copyFile(join(output,'catalogue.sqlite'),file);const db=new DatabaseSync(file);
 try{
  db.exec('PRAGMA foreign_keys=ON');
  const {makeServer}=await import('./dist/engine/sql/server.mjs');const handler=makeServer(db,{catalogueToken:'',dmToken:'local-test'});
  async function request(path,method='GET',body,token){let status,result;await handler.handle({url:'/api/'+path,method,headers:{authorization:token?'Bearer '+token:''},socket:{remoteAddress:'test'},async *[Symbol.asyncIterator](){if(body)yield JSON.stringify(body);}},{writeHead(s){status=s;},end(text){result=JSON.parse(text);}});assert(status<400,JSON.stringify(result));return result;}
  const c=await request('catalogo'),attrs=c.skills.filter(s=>s.tipo==='Atributo').sort((a,b)=>ATTRIBUTE_ORDER.indexOf(a.nombre)-ATTRIBUTE_ORDER.indexOf(b.nombre));
  const draft={nombre:'Visitante de Pages',linaje_id:c.linajes[0].id,clase_id:c.clases.find(s=>s.nombre==='Senda del Berserker').id,dedicacion_id:c.dedicaciones[0].id,nacimiento_id:c.nacimientos[0].id,atributos:Object.fromEntries(attrs.map((a,i)=>[a.id,FIXED_VALUES[i]])),pools:{}};
  c.skills.filter(s=>s.tipo==='Habilidad'&&s.combate).slice(0,4).forEach((s,i)=>draft.pools[s.id]=[20,15,10,5][i]);c.skills.filter(s=>s.tipo==='Habilidad'&&!s.combate).slice(0,3).forEach((s,i)=>draft.pools[s.id]=[20,20,10][i]);
  const created=await request('personajes','POST',draft);assert.equal(created.nombre,draft.nombre);assert.match(created.token_acceso,/^PJ_/);
  const saved=await request('personajes/'+created.id,'GET',undefined,created.token_acceso);assert.equal(saved.nombre,draft.nombre);assert(saved.skills.length>10);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM personajes').get().n,1);assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(),[]);
 }finally{db.close();await unlink(file);await rmdir(folder);}
});
