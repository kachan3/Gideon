import {readFileSync} from 'node:fs';
import {randomInt} from 'node:crypto';
import {playerText} from '../js/player-text.js';
const content=JSON.parse(readFileSync(new URL('../content/Ordenes/ordenes.json',import.meta.url),'utf8'));
export const orderContent=content;
const one=(db,sql,...args)=>db.prepare(sql).get(...args);
const honorClass=db=>one(db,"SELECT id FROM clases WHERE nombre='Senda del Honor'")?.id;
const hasHonor=(db,id)=>Boolean(one(db,'SELECT 1 FROM personajes_clases WHERE personaje_id=? AND clase_id=?',id,honorClass(db)));
const combos=['Golpe Insistente','Multi Ataque','Golpe Poderoso','Danza Dragón','Golpe Dual'];

export function ensureOrders(db){
 db.exec(`CREATE TABLE IF NOT EXISTS personajes_ordenes(
   personaje_id INTEGER PRIMARY KEY REFERENCES personajes(id),orden_codigo TEXT NOT NULL,
   honor_inicial INTEGER, dados TEXT NOT NULL DEFAULT '[]',combo_dote_id INTEGER REFERENCES dotes(id));
   CREATE TABLE IF NOT EXISTS personajes_juramento(
   personaje_id INTEGER NOT NULL REFERENCES personajes(id),posicion TEXT NOT NULL,frase_codigo TEXT NOT NULL,
   PRIMARY KEY(personaje_id,posicion));`);
 if(!one(db,"SELECT id FROM dotes WHERE nombre='Luchador de Escudo'"))
  db.prepare("INSERT INTO dotes(nombre,tipo,costo_xp,solo_concesion_inicial,descripcion) VALUES('Luchador de Escudo','Marcial',0,1,?)")
   .run('Dote inicial concedido por la Gran Orden Armada de Tolfan.');
 for(const combo of content.combos)if(!one(db,'SELECT id FROM dotes WHERE nombre=?',combo.nombre))
  db.prepare("INSERT INTO dotes(nombre,tipo,costo_xp,solo_concesion_inicial,descripcion) VALUES(?,'Marcial',0,1,?)")
   .run(combo.nombre,'Cada ejecución cuesta 1 Stamina. '+playerText(combo.descripcion).replace(/\*\*|`/g,''));
 db.prepare('INSERT OR IGNORE INTO schema_migrations(version) VALUES(41)').run();
}
export function orderCatalogue(db){
 return {fuente:content.fuente,ordenes:content.ordenes,clase_honor_id:honorClass(db),
  combos:db.prepare('SELECT id,nombre,descripcion FROM dotes').all().filter(d=>combos.includes(d.nombre)),
  posiciones:content.juramento.posiciones.map(p=>({...p,opciones:p.opciones.map(o=>({...o,descripcion:playerText(o.descripcion).replace(/\*\*|`/g,'')}))}))};
}
export function validateOrder(db,b){
 const honor=b.clase_id===honorClass(db),data=orderCatalogue(db);
 if(!honor){if(b.orden||b.combo_orden_id!=null)throw Error('Las órdenes de caballería requieren la Senda del Honor.');return null;}
 const order=data.ordenes.find(o=>o.codigo===b.orden);
 if(!order){if(honor||b.orden)throw Error('Elegí una Orden o Caballero Herrante.');return null;}
 if(honor&&order.combo&&!data.combos.some(c=>c.id===b.combo_orden_id))throw Error('Elegí el Combo marcial que recibís de tu Orden.');
 if((!honor||!order.combo)&&b.combo_orden_id!=null)throw Error('Esta afiliación no concede un Combo inicial.');
 return order;
}
function validatePhrases(db,b){
 const selected=b.juramento??{};
 if(!selected||typeof selected!=='object'||Array.isArray(selected))throw Error('Juramento inválido.');
 const positions=content.juramento.posiciones;
 for(const [key,code] of Object.entries(selected)){
  if(!positions.some(p=>p.codigo===key&&p.opciones.some(o=>o.codigo===code)))throw Error('Frase de Juramento inválida.');
 }
 if(Object.keys(selected).length&&b.clase_id!==honorClass(db))throw Error('El Juramento Declarado requiere la Senda del Honor.');
 return selected;
}
export function validateOrderCreation(db,b){validateOrder(db,b);return validatePhrases(db,b);}
export function recordOrderCreation(db,id,b,grant,roll=()=>randomInt(1,7)){
 const order=validateOrder(db,b),selected=validatePhrases(db,b);
 if(order){
  const honor=b.clase_id===honorClass(db),dice=honor&&order.honor===null?Array.from({length:5},roll):[];
  if(dice.some(v=>!Number.isInteger(v)||v<1||v>6))throw Error('Tirada de Honor inválida.');
  const initial=honor?(order.honor??30+dice.reduce((n,v)=>n+v,0)):null;
  db.prepare('INSERT INTO personajes_ordenes VALUES(?,?,?,?,?)').run(id,order.codigo,initial,JSON.stringify(dice),honor&&order.combo?b.combo_orden_id:null);
  if(honor){
   db.prepare('UPDATE personajes SET honor_puntos=? WHERE id=?').run(initial,id);
   const skill=one(db,"SELECT id FROM all_skills WHERE nombre='Honor'");
   db.prepare('INSERT INTO personajes_skills(personaje_id,skill_id,valor_base) VALUES(?,?,?) ON CONFLICT(personaje_id,skill_id) DO UPDATE SET valor_base=excluded.valor_base').run(id,skill.id,initial);
   const feats=[one(db,"SELECT id FROM dotes WHERE nombre='Entrenado en Armadura Pesada'")?.id,
     order.combo?b.combo_orden_id:one(db,"SELECT id FROM dotes WHERE nombre='Luchador de Escudo'")?.id];
   for(const feat of feats){if(!feat)throw Error('Falta un dote inicial de la Orden.');
    if(!one(db,'SELECT 1 FROM v_adquisiciones_activas WHERE personaje_id=? AND dote_id=?',id,feat))grant({tipo:'Adquisicion',dote_id:feat,origen:'Orden: '+order.nombre});
   }
  }
 }
 for(const [position,code] of Object.entries(selected))db.prepare('INSERT INTO personajes_juramento VALUES(?,?,?)').run(id,position,code);
}
export function orderState(db,id){
 if(!one(db,"SELECT 1 FROM sqlite_schema WHERE name='personajes_ordenes'"))return null;
 const row=one(db,'SELECT * FROM personajes_ordenes WHERE personaje_id=?',id);
 const order=content.ordenes.find(o=>o.codigo===row?.orden_codigo);
 return order?{...order,...row,dados:JSON.parse(row.dados),combo:row.combo_dote_id?one(db,'SELECT nombre FROM dotes WHERE id=?',row.combo_dote_id)?.nombre:null}:null;
}
export function oathState(db,id){
 if(!hasHonor(db,id)||!one(db,"SELECT 1 FROM sqlite_schema WHERE name='personajes_juramento'"))return null;
 const xp=one(db,`SELECT COALESCE(SUM(pr.xp_gastada),0) n FROM progresion pr JOIN dotes d ON d.id=pr.dote_id
   WHERE pr.personaje_id=? AND (d.clase_id=? OR EXISTS(SELECT 1 FROM dotes_tags dt JOIN rasgos r ON r.id=dt.rasgo_id WHERE dt.dote_id=d.id AND r.nombre='Honor'))`,id,honorClass(db)).n;
 const saved=db.prepare('SELECT posicion,frase_codigo FROM personajes_juramento WHERE personaje_id=?').all(id);
 const positions=orderCatalogue(db).posiciones.map(p=>({...p,seleccion:saved.find(s=>s.posicion===p.codigo)?.frase_codigo??'',desbloqueada:xp>=p.xp}));
 return {xp,posiciones:positions,texto:positions.filter(p=>p.desbloqueada&&p.seleccion).map(p=>p.opciones.find(o=>o.codigo===p.seleccion).nombre).join('. ')};
}
export function saveOath(db,id,selections){
 if(!selections||typeof selections!=='object'||Array.isArray(selections))throw Error('Juramento inválido.');
 const state=oathState(db,id);if(!state)throw Error('El Juramento Declarado requiere la Senda del Honor.');
 validatePhrases(db,{clase_id:honorClass(db),juramento:selections});
 for(const p of state.posiciones){
  const code=selections[p.codigo]??'';
  if(p.desbloqueada&&p.seleccion&&code!==p.seleccion)throw Error('Una frase activa del Juramento ya está elegida.');
  if(code)db.prepare('INSERT INTO personajes_juramento VALUES(?,?,?) ON CONFLICT(personaje_id,posicion) DO UPDATE SET frase_codigo=excluded.frase_codigo').run(id,p.codigo,code);
  else db.prepare('DELETE FROM personajes_juramento WHERE personaje_id=? AND posicion=?').run(id,p.codigo);
 }
}
