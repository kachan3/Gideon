import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {openDatabase,transaction} from './server.mjs';
import {synchronizeCore} from './core-sync.mjs';
import {referenceMatcher,referencePattern,unmark} from '../js/reference-format.js';
import {playerText} from '../js/player-text.js';

test('el Core restaura el catálogo sin cambiar las fichas y mantiene referencias resolubles',()=>{
  const db=openDatabase(':memory:');
  try {
    const all=(sql,...args)=>db.prepare(sql).all(...args);
    const one=(sql,...args)=>db.prepare(sql).get(...args);
    const snapshot=()=>{
      const tables=all("SELECT name FROM sqlite_schema WHERE type='table' AND (name LIKE 'personajes%' OR name IN ('progresion','inventario','tiradas')) ORDER BY name");
      return tables.map(({name})=>all('SELECT * FROM '+name+' ORDER BY rowid'));
    };
    const original=snapshot();
    const definitions=all('SELECT * FROM reglas_atomicas ORDER BY id');
    assert.deepEqual(all('PRAGMA table_info(reglas_atomicas)').map(c=>c.name),['id','nombre','texto']);
    const ids=new Set(definitions.map(r=>r.id));
    for(const {texto} of all('SELECT texto FROM reglas_atomicas UNION ALL SELECT texto FROM textos_catalogo UNION ALL SELECT texto FROM documentos_reglas')) {
      for(const [,target] of texto.matchAll(referencePattern))for(const id of target.split('+'))assert(ids.has(id),id);
      assert(!unmark(texto).includes('⟦'));
    }
    const doc='10_Reglas/Core_18_Estados_Alterados.md';
    const core=readFileSync(new URL('../../'+doc,import.meta.url),'utf8').replace(/\r\n/g,'\n');
    assert.equal(unmark(one('SELECT texto FROM documentos_reglas WHERE id=?',doc).texto),playerText(core,{keepLinks:true}));
    const mark=referenceMatcher(all('SELECT * FROM alias_reglas'));
    assert.equal(mark('Quedas aturdida. Fuerza. Cortante.'),'Quedas aturdida. Fuerza. Cortante.');
    assert.match(mark('[[Aturdimiento|aturdida]]'),/\u27e6estado-aturdimiento\u00a6aturdida\u27e7/);
    const skin=one("SELECT texto FROM textos_catalogo WHERE tabla='rasgos' AND fila=(SELECT id FROM rasgos WHERE nombre='Piel escamosa')").texto;
    assert(!skin.includes('\u27e6'));
    db.prepare("UPDATE rasgos SET descripcion='texto anterior' WHERE nombre='Piel escamosa'").run();
    transaction(db,()=>synchronizeCore(db));
    assert.equal(one("SELECT descripcion FROM rasgos WHERE nombre='Piel escamosa'").descripcion,unmark(skin));
    assert.deepEqual(all('SELECT * FROM reglas_atomicas ORDER BY id'),definitions);
    assert.deepEqual(snapshot(),original);
    assert.deepEqual(all('PRAGMA foreign_key_check'),[]);
  } finally {db.close();}
});
