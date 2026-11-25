import {armorStats} from '../js/armor-rules.js';
import {shieldStats} from '../js/shield-rules.js';
import {weaponPrice,LOCATIONS,carriedLocation} from '../js/gear-rules.js';
import {addInventory,changeInventory,inventoryRows} from './equipment.mjs';
const fail=message=>{throw Error(message);};
const level=n=>{if(!Number.isInteger(n)||n<1||n>10)fail('Nivel inválido');return n;};
export function purchase(db,personId,b){
 if(typeof b.solicitud!=='string'||!b.solicitud||b.solicitud.length>100)fail('Identificador de compra requerido');
 if(db.prepare('SELECT id FROM compras_equipo WHERE personaje_id=? AND solicitud=?').get(personId,b.solicitud))return;
 const tables={arma_id:'armas',armadura_id:'armaduras',item_base_id:'items_base'};
 if(!tables[b.tipo])fail('Tipo de compra inválido');
 const item=db.prepare(`SELECT * FROM ${tables[b.tipo]} WHERE id=?`).get(b.id);if(!item||item.archivada)fail('Equipo inexistente');
 const n=level(b.nivel??1);let cost,body={[b.tipo]:item.id};
 if(b.tipo==='arma_id'){cost=weaponPrice(item.categoria_balance,n);body.nivel_arma=n;}
 if(b.tipo==='armadura_id'){cost=armorStats(item,n).coste_oro;body.nivel_armadura=n;}
 if(b.tipo==='item_base_id'){
  if(!item.escudo_base_id)fail('Selecciona un escudo');
  cost=shieldStats(db.prepare('SELECT * FROM bases_escudo WHERE id=?').get(item.escudo_base_id),n).coste_oro;body.nivel_escudo=n;
 }
 if(!db.prepare('UPDATE personajes SET oro=oro-? WHERE id=? AND oro>=?').run(cost,personId,cost).changes)fail('Oro insuficiente');
 const id=addInventory(db,personId,body);
 db.prepare('INSERT INTO compras_equipo(personaje_id,solicitud,inventario_id,coste_oro) VALUES(?,?,?,?)').run(personId,b.solicitud,id,cost);
}
export function assignGear(db,personId,id,b){
 if(!LOCATIONS.includes(b.ubicacion)||b.ubicacion==='Pendiente')fail('Elegí una ubicación');
 const items=inventoryRows(db,personId),item=items.find(i=>i.id===id);if(!item)fail('Objeto inexistente');
 const place=b.ubicacion,others=items.filter(i=>i.id!==id);
 const hand=place==='Mano principal'?'Principal':place==='Mano secundaria'?'Secundaria':null;
 const handheld=Boolean(item.arma||item.escudo||item.artefacto_id||item.elemento.categoria==='Escudo');
 if(hand&&!handheld)fail('Ese espacio requiere arma o escudo');
 if(place==='Armadura'&&!item.armadura)fail('Ese espacio requiere armadura');
 if(place.startsWith('Arma ')&&!handheld)fail('Ese espacio requiere arma o escudo');
 if(!['Mochila','Piso','Campamento','Transferir','Carcaj'].includes(place)&&others.some(i=>i.ubicacion===place))fail('Espacio ocupado');
 if(place==='Carcaj'){
  const thrown=item.propiedades.some(v=>v.nombre==='Arrojadiza');
  const arrows=/flecha/i.test(item.nombre);
  if(!thrown&&!arrows)fail('El carcaj admite flechas o armas arrojadizas');
  const contents=others.filter(i=>i.ubicacion==='Carcaj');
  if(contents.some(i=>/flecha/i.test(i.nombre)!==arrows)||contents.reduce((s,i)=>s+i.cantidad,0)+item.cantidad>(arrows?20:6))fail('Capacidad del carcaj superada');
 }
 if(hand||place.startsWith('Arma ')){
  const weapons=others.filter(i=>i.arma||i.escudo||i.artefacto_id).filter(i=>i.ubicacion.startsWith('Arma ')||i.ubicacion.startsWith('Mano '));
  if(weapons.length>=3)fail('Hay tres espacios de armas, contando escudos');
  if(item.arma?.manos===2&&weapons.some(i=>i.arma?.manos===2))fail('Solo un arma a dos manos en acceso');
 }
 const recipient=String(b.destinatario??'').trim().slice(0,100);
 if(place==='Transferir'&&!recipient)fail('Indicá el compañero, mula o asistente que lo recibe');
 changeInventory(db,personId,id,{equipado:Boolean(hand||place==='Armadura'),transportado:carriedLocation(place),mano:hand});
 db.prepare('UPDATE inventario SET ubicacion=?,destinatario=? WHERE id=?').run(place,recipient,id);
}
export function finishEquipment(db,personId){
 if(db.prepare("SELECT id FROM inventario WHERE personaje_id=? AND retirado=0 AND cantidad>0 AND ubicacion='Pendiente'").get(personId))fail('Asigná una ubicación a todos los objetos');
 db.prepare('UPDATE personajes SET equipo_inicial_completo=1 WHERE id=?').run(personId);
}
