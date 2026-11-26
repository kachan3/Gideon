import test from 'node:test';
import assert from 'node:assert/strict';
import {openDatabase,character,catalogue} from './server.mjs';
import {synchronizeCore} from './core-sync.mjs';
import {devotionSheet,creationPathChoices} from '../js/path-choices-ui.js';

test('los milagros se guardan saneados con Markdown y se muestran como contenido con formato',()=>{
 const db=openDatabase(':memory:');try{
  const miracles=db.prepare("SELECT * FROM acciones WHERE tipo='Milagro'").all();assert.equal(miracles.length,3);
  const c=catalogue(db),question=c.preguntas_senda.find(q=>q.opciones.some(o=>o.nombre==='Dogma de la Justicia'));
  for(const option of question.opciones){
   assert(!/\\text|\$|Narrativa:|Nota de grado avanzado|bondadoso débil/.test(option.descripcion));assert.match(option.descripcion,/## Plegaria diaria/);assert.match(option.descripcion,/## Intervenciones/);assert.match(option.descripcion,/## Milagro/);
   const html=creationPathChoices(c,{clase_id:question.clase_id,elecciones_senda:{[question.id]:option.id}});assert.match(html,/<h3[^>]*>Plegaria diaria/);assert(html.includes('<strong>Coste:</strong>'));assert(!html.includes('## Intervenciones'));
  }
  for(const action of miracles){assert.match(action.descripcion,/\*\*Coste:\*\*/);assert(!/Narrativa:|\\text|\$|Hassan|ESQUELETO/.test(action.descripcion));
   const html=devotionSheet({acciones:[{...action,fuentes:['Dogma']}],plegarias:[],elecciones_senda:[]});assert(html.includes('<strong>Coste:</strong>'));assert(!html.includes('**Coste:**'));
   const stored=db.prepare("SELECT texto FROM textos_catalogo WHERE tabla='acciones' AND fila=?").get(action.id);assert.equal(stored.texto,action.descripcion);
  }
  const before=JSON.stringify(character(db,1));db.prepare("UPDATE acciones SET descripcion='Narrativa: texto roto' WHERE tipo='Milagro'").run();synchronizeCore(db);assert.equal(JSON.stringify(character(db,1)),before);
  const combo=db.prepare("SELECT * FROM dotes WHERE nombre='Golpe Insistente'").get();assert.match(combo.descripcion,/2 PA/);assert.match(combo.descripcion,/3 intentos/);assert.match(combo.descripcion,/Parry/);assert(!/1–2 PA|ataque fallido/.test(combo.descripcion));
 }finally{db.close();}
});
