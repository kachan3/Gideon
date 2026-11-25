import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {mkdtempSync,copyFileSync,readdirSync,readFileSync,unlinkSync,rmdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {openDatabase,catalogue,createCharacter,character,transaction,makeServer} from './server.mjs';
import {issueCharacterToken,identifyCharacter,tokenFormat} from './access.mjs';
import {FIXED_VALUES,ATTRIBUTE_ORDER} from '../js/creation-rules.js';

function payload(db,name='PJ privado'){
 const c=catalogue(db),attrs=c.skills.filter(s=>s.tipo==='Atributo').sort((a,b)=>ATTRIBUTE_ORDER.indexOf(a.nombre)-ATTRIBUTE_ORDER.indexOf(b.nombre));
 const b={nombre:name,linaje_id:c.linajes.find(l=>l.codigo==='hijos_del_sol').id,clase_id:c.clases[0].id,dedicacion_id:c.dedicaciones.find(d=>d.nombre==='Académico').id,nacimiento_id:c.nacimientos[0].id,atributos:Object.fromEntries(attrs.map((s,i)=>[s.id,FIXED_VALUES[i]])),pools:{}};
 c.skills.filter(s=>s.tipo==='Habilidad'&&s.combate).slice(0,4).forEach((s,i)=>b.pools[s.id]=[20,15,10,5][i]);c.skills.filter(s=>s.tipo==='Habilidad'&&!s.combate).slice(0,3).forEach((s,i)=>b.pools[s.id]=[20,20,10][i]);return b;
}
async function service(t){const db=openDatabase(':memory:'),server=makeServer(db);await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(async()=>{await new Promise(r=>server.close(r));db.close();});const url='http://127.0.0.1:'+server.address().port;
 const request=async(path,{method='GET',body,token,headers={}}={})=>{const r=await fetch(url+'/api/'+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...headers},body:body===undefined?undefined:JSON.stringify(body)});return {status:r.status,data:await r.json()};};return {db,url,request};}

test('tokens aleatorios por PJ, únicos, sólo huella en SQLite y nunca en lecturas de ficha',()=>{
 const db=openDatabase(':memory:');try{
  const tokens=new Set();for(let i=0;i<12;i++){const p=transaction(db,()=>createCharacter(db,payload(db,'Privado '+i)));assert(tokenFormat(p.token_acceso));tokens.add(p.token_acceso);assert.equal(identifyCharacter(db,p.token_acceso).id,p.id);
   const record=db.prepare('SELECT * FROM personajes_accesos WHERE personaje_id=?').get(p.id);assert.equal(record.token_hash.length,64);assert(!JSON.stringify(record).includes(p.token_acceso));assert(!Object.hasOwn(character(db,p.id),'token_acceso'));
  }assert.equal(tokens.size,12);
  for(const key of ['token','token_acceso','password','pw','PW'])assert.throws(()=>transaction(db,()=>createCharacter(db,{...payload(db),[key]:'yo-elijo'})),/genera el sistema/);
 }finally{db.close();}
});

test('crear entrega el token y entrar habilita sólo ese PJ; no hay enumeración ni acceso por id',async t=>{
 const {db,request}=await service(t),a=await request('personajes',{method:'POST',body:payload(db,'Jugador A')}),b=await request('personajes',{method:'POST',body:payload(db,'Jugador B')});assert.equal(a.status,201);assert.equal(b.status,201);assert(tokenFormat(a.data.token_acceso));
 const token=a.data.token_acceso,id=a.data.id,other=b.data.id;
 assert.equal((await request('personajes')).status,401);assert.equal((await request('personajes/'+id)).status,401);
 assert.equal((await request('personajes/'+id+'?token='+token)).status,401);
 const entered=await request('acceso',{method:'POST',body:{token}});assert.equal(entered.status,200);assert.deepEqual(entered.data,{personaje:{id,nombre:'Jugador A'}});
 const list=await request('personajes',{token});assert.deepEqual(list.data,[{id,nombre:'Jugador A'}]);
 const own=await request('personajes/'+id,{token});assert.equal(own.status,200);assert(!Object.hasOwn(own.data,'token_acceso'));assert(!JSON.stringify(own.data).includes('token_hash'));
 assert.equal((await request('personajes/'+other,{token})).status,404);assert.equal((await request('personajes/999999',{token})).status,404);
 const previous=character(db,other);
 for(const route of ['estado','xp','progresion','inventario','descanso','acciones','tiradas','conjuros','recursos','trucos','dano','autorizar','inventario/1']){
  const method=route==='estado'||route==='inventario/1'?'PATCH':'POST';assert.equal((await request(`personajes/${other}/${route}`,{method,body:{notas:'No autorizado'},token})).status,404);
 }
 assert.deepEqual(character(db,other),previous);
 assert.equal((await request(`personajes/${id}/estado`,{method:'PATCH',body:{notas:'Mi nota'},token})).status,200);assert.equal(character(db,id).notas,'Mi nota');
 for(const path of ['catalogo/rasgos','catalogo/rasgos-senda'])assert.equal((await request(path,{method:'POST',body:{},token})).status,403);
 const published=JSON.stringify((await request('catalogo')).data);assert(!published.includes(token));assert(!published.includes('token_hash'));
});

test('token desconocido devuelve el mismo error; rotar invalida el anterior y limita intentos fallidos',async t=>{
 const {db,request}=await service(t),token=issueCharacterToken(db,1,{replace:true});
 const bad=await request('acceso',{method:'POST',body:{token:'PJ_'+'A'.repeat(43)}}),malformed=await request('acceso',{method:'POST',body:{token:'inventado'}});assert.equal(bad.status,401);assert.deepEqual(bad,malformed);
 assert.equal((await request('acceso',{method:'POST',body:{token}})).status,200);
 const replacement=issueCharacterToken(db,1,{replace:true});assert.notEqual(replacement,token);assert.equal((await request('personajes/1',{token})).status,401);assert.equal((await request('personajes/1',{token:replacement})).status,200);
 assert.equal((await request('acceso',{method:'POST',body:{token:replacement},headers:{Origin:'https://otro-sitio.example'}})).status,403);
 for(let i=0;i<20;i++)assert.equal((await request('acceso',{method:'POST',body:{token:'inexistente'}})).status,401);
 assert.equal((await request('acceso',{method:'POST',body:{token:'inexistente'}})).status,429);
});

test('migración v17 genera acceso a fichas previas sin cambiar su historia y persiste al reabrir',()=>{
 const dir=mkdtempSync(join(tmpdir(),'gideon-access-')),file=join(dir,'test.db');let db;
 try{
  db=openDatabase(file);db.close();copyFileSync(file+'.before-character-access.bak',file);unlinkSync(file+'.initial-character-tokens.json');db=new DatabaseSync(file);
  const tables=['personajes','personajes_skills','progresion','inventario','personajes_clases_rasgos'];const columns=Object.fromEntries(tables.map(t=>[t,db.prepare(`PRAGMA table_info(${t})`).all().map(c=>c.name).join(',')]));const snapshot=()=>Object.fromEntries(tables.map(t=>[t,db.prepare(`SELECT ${columns[t]} FROM ${t} ORDER BY rowid`).all()]));const before=snapshot();db.close();db=openDatabase(file);assert.deepEqual(snapshot(),before);
  const initial=JSON.parse(readFileSync(file+'.initial-character-tokens.json','utf8'));assert.equal(initial.length,before.personajes.length);assert.equal(identifyCharacter(db,initial[0].token).id,initial[0].id);
  const hash=db.prepare('SELECT token_hash FROM personajes_accesos WHERE personaje_id=?').get(initial[0].id).token_hash;db.close();db=openDatabase(file);assert.deepEqual(snapshot(),before);assert.equal(db.prepare('SELECT token_hash FROM personajes_accesos WHERE personaje_id=?').get(initial[0].id).token_hash,hash);assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
 }finally{db?.close();for(const f of readdirSync(dir))unlinkSync(join(dir,f));rmdirSync(dir);}
});
