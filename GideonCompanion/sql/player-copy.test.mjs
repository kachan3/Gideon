import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {openDatabase,catalogue,character,transaction} from './server.mjs';
import {pathContent} from './paths.mjs';
import {exportPlayerCopy,applyPlayerCopy} from './player-copy.mjs';
import {pathSummary,pathTraitsSheet} from '../js/path-ui.js';
import {playerText,playerDescription} from '../js/player-text.js';

const internal=/ESQUELETO|pendiente de ratific|placeholder|versiones heredadas|se denominaba|\.md\b|Hassan|\bV[1-3]\b/i;
test('six reviewed paths expose their mechanics and initial feats without editorial source text',()=>{
 const db=openDatabase(':memory:');try{
  const c=catalogue(db);assert.equal(c.clases.length,6);
  for(const path of pathContent.sendas){
   const row=c.clases.find(r=>r.nombre===path.nombre);assert.equal(row.descripcion,path.descripcion);
   const html=pathSummary(c,{clase_id:row.id});assert(!internal.test(html),path.nombre);
   for(const r of [...path.rasgos,...path.dotes]){
    assert(html.includes(r.nombre),r.nombre);assert(!internal.test(r.descripcion),r.nombre);
    const source=r.fuente??path.fuente;
    if(source.endsWith('.md'))assert(readFileSync(new URL('../../'+source,import.meta.url),'utf8').length>0);
   }
  }
  const copy=exportPlayerCopy(db,pathContent.sendas);
  for(const doc of copy.documents.filter(r=>r.id.includes('Senda_'))){
   assert(!/\[ESQUELETO|pendiente de ratific|placeholder|Hassan|\bV[1-3]\b/i.test(doc.texto.replace(/\]\([^)]*\)/g,']')),doc.id);
   assert(!/Multiclase|Filosofia_de_Dise/.test(doc.id));
  }
  const berserker=c.clases.find(r=>r.nombre==='Senda del Berserker');
  assert(c.clases_rasgos.some(r=>r.clase_id===berserker.id&&r.nombre==='Enemigo Declarado'&&r.xp_requerida===0));
  assert(c.clases_rasgos.some(r=>r.nombre==='As Marcial'&&r.xp_requerida===3&&!r.es_insignia));
  assert(pathSummary(c,{clase_id:6}).includes('¡Fe, Protégeme!'));
  assert.match(db.prepare("SELECT texto FROM reglas_atomicas WHERE id='artefacto-mastin-de-huesos'").get().texto,/8 horas/);
 }finally{db.close();}
});

test('older collections receive readable text without replacing character, equipment or XP records',()=>{
 const db=openDatabase(':memory:');try{
  const copy=exportPlayerCopy(db,pathContent.sendas);
  db.prepare("UPDATE clases SET descripcion='Mecánicas completas en archivo interno'").run();
  db.prepare("UPDATE rasgos SET descripcion='Las versiones heredadas quedan obsoletas' WHERE nombre='Nervios de Acero'").run();
  db.prepare("DELETE FROM clases_rasgos WHERE nombre IN ('Enemigo Declarado','As Marcial')").run();
  const custom=Number(db.prepare("INSERT INTO rasgos(nombre,descripcion,tipo) VALUES('Personalizado','Conservar texto propio','Capacidad')").run().lastInsertRowid);
  const tables=db.prepare("SELECT name FROM sqlite_schema WHERE type='table' AND (name LIKE 'personajes%' OR name IN ('progresion','inventario','tiradas')) ORDER BY name").all();
  const snapshot=()=>tables.map(t=>db.prepare('SELECT * FROM '+t.name+' ORDER BY rowid').all());
  const before=snapshot();
  // A fresh build may assign different numeric IDs; names and kinds still match.
  for(const f of copy.fields)f.id+=10000;
  transaction(db,()=>applyPlayerCopy(db,copy));
  assert.deepEqual(snapshot(),before);
  assert.equal(db.prepare('SELECT descripcion FROM rasgos WHERE id=?').get(custom).descripcion,'Conservar texto propio');
  assert(!internal.test(pathTraitsSheet(character(db,1))));
  assert(!internal.test(pathSummary(catalogue(db),{clase_id:2})));
  const count=db.prepare('SELECT count(*) n FROM clases_rasgos').get().n;
  transaction(db,()=>applyPlayerCopy(db,copy));
  assert.equal(db.prepare('SELECT count(*) n FROM clases_rasgos').get().n,count);
  assert.deepEqual(snapshot(),before);assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(),[]);
 }finally{db.close();}
});

test('publishing keeps operative paragraphs, explicit references and normal navigation links',()=>{
 const raw='> Módulo canónico\n# Rasgo\nPagá 2 PM para mover 3 unidades. [[Aturdimiento]]\n\n> [ESQUELETO: escala]\n\nConsultá archivo.md.\n\n[Defensa](Defensa.md)\n\n## Dotes descartados\nTexto interno.';
 const shown=playerText(raw,{keepLinks:true});
 assert(shown.includes('Pagá 2 PM para mover 3 unidades. [[Aturdimiento]]'));
 assert(shown.includes('[Defensa](Defensa.md)'));
 assert(!shown.includes('Texto interno'));assert(!shown.includes('ESQUELETO'));
 assert(!playerDescription('<script>bad()</script>').includes('<script>'));
 assert.equal(playerText('El esqueleto recupera 1 carga cada 8 horas.'),'El esqueleto recupera 1 carga cada 8 horas.');
});

test('As Marcial unlock text follows XP in Valor feats and excludes XP in items',()=>{
 const db=openDatabase(':memory:');try{
  db.prepare('INSERT INTO personajes_clases(personaje_id,clase_id) VALUES(1,10)').run();
  const base=db.prepare('SELECT item_magico_id FROM inventario WHERE item_magico_id IS NOT NULL LIMIT 1').get();
  const item=Number(db.prepare('INSERT INTO inventario(personaje_id,item_magico_id) VALUES(1,?)').run(base.item_magico_id).lastInsertRowid);
  db.prepare("INSERT INTO progresion(personaje_id,change,tipo,item_id,xp_gastada,clase_id) VALUES(1,'Add','Adquisicion',?,3,10)").run(item);
  const state=()=>db.prepare("SELECT * FROM v_rasgos_senda_estado WHERE personaje_id=1 AND nombre='As Marcial'").get();
  assert.equal(state().activo,0);assert.equal(state().xp_dedicada,0);
  const feat=Number(db.prepare("INSERT INTO dotes(nombre,tipo,clase_id,costo_xp,descripcion) VALUES('Dote Valor de prueba','Senda',10,3,'Prueba')").run().lastInsertRowid);
  db.prepare("INSERT INTO progresion(personaje_id,change,tipo,dote_id,xp_gastada,clase_id) VALUES(1,'Add','Adquisicion',?,3,10)").run(feat);
  assert.equal(state().activo,1);assert.equal(state().xp_dedicada,3);
 }finally{db.close();}
});
