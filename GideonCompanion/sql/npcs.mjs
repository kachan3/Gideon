import {readFileSync,readdirSync,existsSync,writeFileSync,renameSync} from 'node:fs';
import {resolve} from 'node:path';
import {randomUUID,randomBytes,createHash,timingSafeEqual,randomInt} from 'node:crypto';
import {NPC_FOLDERS,SITUATIONS,validateNPC,npcInteger,npcHealth,memberActions,actionsUsed,canDefend,setNPCAguante} from '../js/npc-rules.js';
import {resolveRoll} from '../js/roll-rules.js';
export const NPC_ROOT=resolve(import.meta.dirname,'../NPCs');
const clone=v=>structuredClone(v);
export function loadNPCs(root=NPC_ROOT){
 const list=[],ids=new Set();for(const folder of NPC_FOLDERS){
  for(const name of readdirSync(resolve(root,folder)).filter(n=>n.endsWith('.json')).sort()){
   const npc=validateNPC(JSON.parse(readFileSync(resolve(root,folder,name),'utf8')));
   if(ids.has(npc.id))throw Error('ID de NPC duplicado: '+npc.id);ids.add(npc.id);list.push({...npc,carpeta:folder});
  }
 }return list;
}
export function readLinks(root=NPC_ROOT){
 const data=JSON.parse(readFileSync(resolve(root,'vinculos.json'),'utf8'));
 if(data.version!==1||!Array.isArray(data.vinculos))throw Error('Archivo de vínculos inválido');
 const seen=new Set();for(const v of data.vinculos){npcInteger(v.personaje_id,1);npcInteger(v.cantidad,1,200);if(typeof v.id!=='string'||!v.id||typeof v.npc_id!=='string'||!['leal','esclavo','marioneta'].includes(v.control)||seen.has(v.id))throw Error('Vínculo inválido o repetido');seen.add(v.id);}
 return data;
}
export function writeLink(db,body,root=NPC_ROOT){
 const links=readLinks(root);
 if(body.eliminar){const before=links.vinculos.length;links.vinculos=links.vinculos.filter(v=>v.id!==body.id);if(links.vinculos.length===before)throw Error('Vínculo inexistente');}
 else{
  npcInteger(body.personaje_id,1);npcInteger(body.cantidad,1,200);
  if(!db.prepare('SELECT id FROM personajes WHERE id=?').get(body.personaje_id))throw Error('Personaje inexistente');
  if(!loadNPCs(root).some(n=>n.id===body.npc_id))throw Error('NPC inexistente');
  if(!['leal','esclavo','marioneta'].includes(body.control))throw Error('Tipo de control inválido');
  links.vinculos.push({id:randomUUID(),personaje_id:body.personaje_id,npc_id:body.npc_id,cantidad:body.cantidad,control:body.control,nombre:String(body.nombre??'').slice(0,120)});
 }
 const file=resolve(root,'vinculos.json'),temp=file+'.tmp';writeFileSync(temp,JSON.stringify(links,null,2)+'\n','utf8');renameSync(temp,file);return links;
}
export function initNPCs(db){db.exec('CREATE TABLE IF NOT EXISTS npc_grupos(id TEXT PRIMARY KEY,datos_json TEXT NOT NULL)');}
export function writeNPC(body,root=NPC_ROOT){
 if(!NPC_FOLDERS.includes(body.carpeta))throw Error('Carpeta inválida');
 const npc=clone(body.npc);delete npc.carpeta;validateNPC(npc);
 const previous=loadNPCs(root).find(n=>n.id===npc.id);
 if(previous&&previous.carpeta!==body.carpeta)throw Error('Ese ID ya existe en otra carpeta');
 npc.version=previous?previous.version+1:1;
 const file=resolve(root,body.carpeta,npc.id+'.json'),temp=file+'.tmp';writeFileSync(temp,JSON.stringify(npc,null,2)+'\n','utf8');renameSync(temp,file);return npc;
}
export function npcGroups(db){return db.prepare('SELECT datos_json FROM npc_grupos ORDER BY rowid').all().map(r=>JSON.parse(r.datos_json));}
export function saveGroup(db,g){db.prepare('INSERT INTO npc_grupos(id,datos_json) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET datos_json=excluded.datos_json').run(g.id,JSON.stringify(g));return g;}
export function createGroup(db,body,root=NPC_ROOT){
 const npc=loadNPCs(root).find(n=>n.id===body.npc_id);if(!npc)throw Error('NPC inexistente');npcInteger(body.cantidad,1,200);
 const source=body.vinculo_id?readLinks(root).vinculos.find(v=>v.id===body.vinculo_id&&v.npc_id===npc.id):null;
 if(body.vinculo_id&&!source)throw Error('Vínculo inexistente');
 const g={id:randomUUID(),revision:0,nombre:String(body.nombre||source?.nombre||npc.nombre).slice(0,120),npc:clone(npc),vinculo_id:source?.id??null,personaje_id:source?.personaje_id??null,control:source?.control??null,situacion:'preparado',ronda:1,acciones_maximas:3,acciones_usadas:0,integrantes:Array.from({length:body.cantidad},(_,i)=>({id:randomUUID(),nombre:npc.nombre+' '+(i+1),golpes:0,graves:0,heridas:0,estados:[],ajuste_acciones:0,acciones_extra_usadas:0,reacciones_usadas:0}))};
 return saveGroup(db,g);
}
export function changeGroup(db,id,body){
 const row=db.prepare('SELECT datos_json FROM npc_grupos WHERE id=?').get(id);if(!row)throw Error('Grupo inexistente');const g=JSON.parse(row.datos_json);
 if(body.revision!==g.revision)throw Error('El grupo cambió. Actualizá antes de volver a guardar.');
 const member=body.integrante_id?g.integrantes.find(m=>m.id===body.integrante_id):null;
 if(body.integrante_id&&!member)throw Error('Integrante inexistente');
 switch(body.operacion){
  case 'retirar':db.prepare('DELETE FROM npc_grupos WHERE id=?').run(id);return null;
  case 'ronda':g.ronda++;g.acciones_usadas=0;for(const m of g.integrantes){m.acciones_extra_usadas=0;m.reacciones_usadas=0;}break;
  case 'accion':if(g.acciones_usadas>=g.acciones_maximas)throw Error('No quedan acciones conjuntas');g.acciones_usadas++;break;
  case 'situacion':if(!SITUATIONS.includes(body.situacion))throw Error('Situación inválida');g.situacion=body.situacion;break;
  case 'aguante':g.npc=setNPCAguante(g.npc,body);break;
  case 'impacto':{
   const targets=body.todos?g.integrantes:member?[member]:[];if(!targets.length)throw Error('Elegí los afectados');
   if(g.npc.salud.tipo==='heridas')npcInteger(body.heridas,1);
   for(const m of targets){if(g.npc.salud.tipo==='golpes'){m.golpes++;if(body.grave===true)m.graves++;}else{m.heridas+=body.heridas;if(g.npc.defensas.ug!=null&&body.heridas>g.npc.defensas.ug)m.graves++;}}
   break;
  }
  case 'integrante':{
   if(!member)throw Error('Elegí un integrante');
   for(const key of ['golpes','graves','heridas'])if(body[key]!=null)member[key]=npcInteger(body[key]);
   if(body.estados!=null){if(!Array.isArray(body.estados)||body.estados.length>30||body.estados.some(s=>typeof s!=='string'||s.length>80))throw Error('Estados inválidos');member.estados=[...new Set(body.estados.map(s=>s.trim()).filter(Boolean))];}
   if(body.ajuste_acciones!=null)member.ajuste_acciones=npcInteger(body.ajuste_acciones,-3,20);
   break;
  }
  case 'extra':if(!member||npcHealth(g.npc,member).caido||member.ajuste_acciones<=0||g.acciones_usadas<g.acciones_maximas||actionsUsed(g,member)>=memberActions(g,member))throw Error('No hay acción adicional disponible');member.acciones_extra_usadas++;break;
  case 'defensa':if(!member||npcHealth(g.npc,member).caido||!canDefend(member,g.npc))throw Error('No puede realizar otra defensa o está Arrebatado');member.reacciones_usadas++;break;
  default:throw Error('Operación de NPC inválida');
 }g.revision++;return saveGroup(db,g);
}
export function playerCompanions(db,personId,root=NPC_ROOT){
 const links=readLinks(root).vinculos.filter(v=>v.personaje_id===personId),catalog=loadNPCs(root),groups=npcGroups(db);
 return links.map(v=>({...v,npc:catalog.find(n=>n.id===v.npc_id)??null,grupos:groups.filter(g=>g.personaje_id===personId&&g.vinculo_id===v.id)}));
}
export function npcRoll(npc,body,random100=()=>randomInt(100)){
 let value;if(body.accion_id){const a=npc.acciones.find(a=>a.id===body.accion_id);if(!a||a.valor==null)throw Error('Acción sin tirada');value=a.valor;}
 else{const skills={...npc.atributos,...npc.combate,...npc.especialidades};if(!Object.hasOwn(skills,body.habilidad))throw Error('Habilidad inexistente');value=skills[body.habilidad];}
 const options={circunstancia:body.circunstancia??'Normal',dificultad:npcInteger(body.dificultad??0,0,99),ventaja:npcInteger(body.ventaja??0,0,99),desventaja:npcInteger(body.desventaja??0,0,99)};
 if(body.salvataje!=null)options.salvataje=npcInteger(body.salvataje,0,99);
 return resolveRoll(random100(),value,options);
}
export function dmAuthorized(req,secret){
 const token=req.headers['x-gideon-dm-token'];if(!secret||typeof token!=='string')return false;
 return timingSafeEqual(createHash('sha256').update(secret).digest(),createHash('sha256').update(token).digest());
}
export function localDMToken(file=resolve(import.meta.dirname,'dm-access.local.json')){
 if(process.env.GIDEON_DM_TOKEN)return process.env.GIDEON_DM_TOKEN;
 if(existsSync(file))return JSON.parse(readFileSync(file,'utf8')).token;
 const token='DM_'+randomBytes(32).toString('base64url');writeFileSync(file,JSON.stringify({token},null,2)+'\n',{encoding:'utf8',mode:0o600,flag:'wx'});return token;
}
