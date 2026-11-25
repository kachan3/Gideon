import {fixtureFetch,TEST_CATALOGUE_TOKEN} from './http-fixture.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {openDatabase,character,catalogue,addProgress,transaction,makeServer} from './server.mjs';

test('progresión, requisitos, fuentes, ítems y recursos mediante HTTP',async t=>{
 const db=openDatabase(':memory:');const server=makeServer(db);await new Promise(r=>server.listen(0,'127.0.0.1',r));
 t.after(async()=>{await new Promise(r=>server.close(r));db.close();});
 const url='http://127.0.0.1:'+server.address().port;
 const fetch=fixtureFetch(db);
 const request=async(path,method='GET',body)=>{const res=await fetch(url+path,{method,headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});return {status:res.status,data:await res.json()};};
 const c=(await request('/api/catalogo')).data;assert.equal(c.skills.filter(s=>s.tipo==='Atributo').length,10);assert(c.skills.some(s=>s.nombre==='Cerrajería'));assert(!c.dotes.some(d=>d.condicion_especial));
 let p=character(db,1);const vm=p.adquisiciones.find(a=>a.elemento.nombre==='Vigoris Mortis');assert.equal(vm.xp_invertida,4);assert.equal(p.adquisiciones.filter(a=>a.dote_id===vm.dote_id).length,1);assert(p.acciones.some(a=>a.nombre==='Spellweave'));assert.equal(p.componentes.efectos.length,1);
 const spent=p.xp_gastada,pool=p.pools[0].xp_invertida;
 let response=await request('/api/personajes/1/progresion','POST',{tipo:'Retiro',dote_id:vm.dote_id});assert.equal(response.status,200);p=response.data;assert.equal(p.xp_gastada,spent);assert.equal(p.pools[0].xp_invertida,pool);assert(!p.adquisiciones.some(a=>a.dote_id===vm.dote_id));
 assert.equal((await request('/api/personajes/1/progresion','POST',{tipo:'Inversion',dote_id:vm.dote_id,xp_gastada:2})).status,400);
 p=(await request('/api/personajes/1/progresion','POST',{tipo:'Adquisicion',dote_id:vm.dote_id})).data;assert.equal(p.adquisiciones.find(a=>a.dote_id===vm.dote_id).xp_invertida,2);
 const combo=c.dotes.find(d=>d.nombre==='Golpe Dual');assert.equal((await request('/api/personajes/1/progresion','POST',{tipo:'Adquisicion',dote_id:combo.id})).status,400);
 const dwe=c.dotes.find(d=>d.nombre==='Dual Wielding Enthusiast'),dw=c.skills.find(s=>s.nombre==='Dual Wielding');await request('/api/personajes/1/progresion','POST',{tipo:'Skill',skill_id:dw.id,valor:85});await request('/api/personajes/1/progresion','POST',{tipo:'Adquisicion',dote_id:dwe.id});p=(await request('/api/personajes/1/progresion','POST',{tipo:'Adquisicion',dote_id:combo.id})).data;assert.equal(p.acciones.filter(a=>a.nombre==='Golpe Dual').length,1);
 p=(await request('/api/personajes/1/progresion','POST',{tipo:'Retiro',dote_id:combo.id})).data;assert(!p.acciones.some(a=>a.nombre==='Golpe Dual'));
 assert.equal((await request('/api/personajes/1/progresion','POST',{tipo:'Inversion',dote_id:vm.dote_id,xp_gastada:9999})).status,400);
 const extra=c.skills.find(s=>s.nombre==='Cerrajería');p=(await request('/api/personajes/1/progresion','POST',{tipo:'Skill',skill_id:extra.id,valor:30})).data;assert.equal(p.skills.find(s=>s.id===extra.id).valor,30);
 const vital=c.skills.find(s=>s.nombre==='Vitalidad'),before=character(db,1);p=(await request('/api/personajes/1/progresion','POST',{tipo:'Skill',skill_id:vital.id,valor:10})).data;assert(p.derivados.mh>before.derivados.mh);const child=before.skills.find(s=>s.padre_id===vital.id);assert.equal(p.skills.find(s=>s.id===child.id).valor,child.valor+10);
 p=(await request('/api/personajes/1/estado','PATCH',{heridas_graves:4,mana_consumido:20})).data;assert.equal(p.derivados.estado,'Coma Traumático');assert.equal(p.derivados.pg_reales,p.derivados.mh-p.heridas_actuales);assert.equal(p.derivados.excedido,true);
 p=(await request('/api/personajes/1/estado','PATCH',{heridas_graves:1,heridas_mortales:1})).data;assert.equal(p.derivados.estado,'Agonizando');
 const attrs=c.skills.filter(s=>s.tipo==='Atributo');const b={nombre:'Prueba wizard',linaje_id:c.linajes[0].id,clase_id:c.clases.find(s=>s.nombre.includes('Arcanista')).id,dedicacion_id:c.dedicaciones[0].id,nacimiento_id:c.nacimientos[0].id,atributos:Object.fromEntries(attrs.map((s,i)=>[s.id,[50,45,40,35,30,30,30,20,20,15][i]])),pools:{}};
 c.skills.filter(s=>s.tipo==='Habilidad'&&s.combate).slice(0,4).forEach((s,i)=>b.pools[s.id]=[20,15,10,5][i]);c.skills.filter(s=>s.tipo==='Habilidad'&&!s.combate).slice(0,3).forEach((s,i)=>b.pools[s.id]=[20,20,10][i]);
 response=await request('/api/personajes','POST',b);assert.equal(response.status,201);const newId=response.data.id;assert.equal(response.data.xp_gastada,0);assert(response.data.acciones.some(a=>a.nombre==='Spellweave'));assert.equal((await request('/api/personajes/'+newId)).status,200);
 const prior=db.prepare('SELECT COUNT(*) n FROM personajes').get().n;assert.equal((await request('/api/personajes','POST',{...b,pools:{}})).status,400);assert.equal(db.prepare('SELECT COUNT(*) n FROM personajes').get().n,prior);
 const secret=db.prepare('SELECT id FROM dotes WHERE condicion_especial=1').get().id;assert.equal((await request('/api/personajes/1/progresion','POST',{tipo:'Adquisicion',dote_id:secret})).status,400);await request('/api/personajes/1/autorizar','POST',{dote_id:secret});assert(character(db,1).dotes_disponibles.some(d=>d.id===secret));
 const item=c.items_magicos[0];p=(await request('/api/personajes/1/inventario','POST',{item_magico_id:item.id})).data;const instance=p.inventario.at(-1);p=(await request('/api/personajes/1/progresion','POST',{tipo:'Adquisicion',item_id:instance.id})).data;assert.equal(p.adquisiciones.filter(a=>a.item_id).length,2);
 assert.equal((await request('/api/personajes/'+newId+'/progresion','POST',{tipo:'Adquisicion',item_id:instance.id})).status,400);
 assert.equal((await fetch(url+'/sql/gideon_companion.db')).status,404);assert.equal((await fetch(url+'/')).status,200);assert.equal((await fetch(url+'/js/companion.js')).status,200);
 assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
});

test('SQLite impone objetivo único, límite de diez requisitos e historial inmutable',()=>{
 const db=openDatabase(':memory:');try{
 const d=db.prepare("SELECT id FROM dotes WHERE nombre='Reflejos'").get().id,skills=db.prepare('SELECT id FROM all_skills LIMIT 11').all();
 for(const s of skills.slice(0,10))db.prepare('INSERT INTO requisitos_dotes(dote_id,skill_id,valor_minimo) VALUES(?,?,1)').run(d,s.id);
 assert.throws(()=>db.prepare('INSERT INTO requisitos_dotes(dote_id,skill_id,valor_minimo) VALUES(?,?,1)').run(d,skills[10].id),/Máximo 10/);
 assert.throws(()=>db.prepare("INSERT INTO progresion(personaje_id,change,tipo,dote_id,epifania_id) VALUES(1,'Add','Adquisicion',?,1)").run(d),/CHECK/);
 assert.throws(()=>db.exec('UPDATE progresion SET xp_gastada=0'),/inmutable/);assert.throws(()=>db.exec('DELETE FROM progresion'),/inmutable/);
 }finally{db.close();}
});
