import test from 'node:test';
import assert from 'node:assert/strict';
import {openDatabase,character} from './server.mjs';
import {synchronizeCore} from './core-sync.mjs';
import {devotionSheet} from '../js/path-choices-ui.js';

test('los milagros se guardan saneados con Markdown y se muestran como contenido con formato',()=>{
 const db=openDatabase(':memory:');try{
  const miracles=db.prepare("SELECT * FROM acciones WHERE tipo='Milagro'").all();assert.equal(miracles.length,3);
  for(const action of miracles){assert.match(action.descripcion,/\*\*Coste:\*\*/);assert(!/Narrativa:|\\text|\$|Hassan|ESQUELETO/.test(action.descripcion));
   const html=devotionSheet({acciones:[{...action,fuentes:['Dogma']}],plegarias:[],elecciones_senda:[]});assert(html.includes('<strong>Coste:</strong>'));assert(!html.includes('**Coste:**'));
   const stored=db.prepare("SELECT texto FROM textos_catalogo WHERE tabla='acciones' AND fila=?").get(action.id);assert.equal(stored.texto,action.descripcion);
  }
  const before=JSON.stringify(character(db,1));db.prepare("UPDATE acciones SET descripcion='Narrativa: texto roto' WHERE tipo='Milagro'").run();synchronizeCore(db);assert.equal(JSON.stringify(character(db,1)),before);
  const combo=db.prepare("SELECT * FROM dotes WHERE nombre='Golpe Insistente'").get();assert.match(combo.descripcion,/2 PA/);assert.match(combo.descripcion,/3 intentos/);assert.match(combo.descripcion,/Parry/);assert(!/1–2 PA|ataque fallido/.test(combo.descripcion));
 }finally{db.close();}
});
