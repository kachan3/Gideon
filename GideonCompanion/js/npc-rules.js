// Fichas estáticas y estado de combate: independientes de la progresión de PJ.
export const NPC_FOLDERS=['minons','enemies','boses','companions'];
export const SITUATIONS=['emboscador','preparado','desprevenido','distraido','dormido'];
export function npcInteger(value,min=0,max=99999){
 if(!Number.isSafeInteger(value)||value<min||value>max)throw Error('Cantidad inválida');return value;
}
const record=v=>v&&typeof v==='object'&&!Array.isArray(v);
export function validateNPC(npc){
 if(!record(npc)||typeof npc.id!=='string'||!/^[a-z0-9_-]{1,80}$/.test(npc.id)||typeof npc.nombre!=='string'||!npc.nombre.trim()||npc.nombre.length>120)throw Error('La ficha requiere id y nombre');
 npcInteger(npc.version,1);
 if(!['minion','enemigo','jefe','companero'].includes(npc.perfil))throw Error('Perfil de NPC inválido');
 if(!record(npc.atributos)||!Object.keys(npc.atributos).length)throw Error('Faltan atributos');
 for(const values of [npc.atributos,npc.combate??{},npc.especialidades??{}]){if(!record(values))throw Error('Atributos inválidos');for(const v of Object.values(values))npcInteger(v);}
 if(!Array.isArray(npc.velocidades)||!npc.velocidades.length)throw Error('Indicá al menos una velocidad');
 for(const v of npc.velocidades){if(typeof v.tipo!=='string')throw Error('Velocidad inválida');npcInteger(v.valor);}
 if(!Array.isArray(npc.sentidos))throw Error('Faltan sentidos');
 for(const s of npc.sentidos)if(typeof s.tipo!=='string'||!['preciso','impreciso'].includes(s.precision))throw Error('Sentido inválido');
 if(!record(npc.defensas)||!record(npc.defensas.armadura))throw Error('Faltan defensas');
 npcInteger(npc.defensas.dureza);for(const v of Object.values(npc.defensas.armadura))npcInteger(v);
 if(!record(npc.salud)||!['golpes','heridas'].includes(npc.salud.tipo))throw Error('Indicá el modelo de salud');
 if(npc.perfil==='minion'&&npc.salud.tipo!=='golpes')throw Error('Los minions usan golpes');
 if(npc.salud.tipo==='golpes'||npc.defensas.ug!=null)npcInteger(npc.defensas.ug,1);
 if(npc.salud.tipo==='heridas')npcInteger(npc.salud.maximo,1);
 if(!Array.isArray(npc.rasgos)||!Array.isArray(npc.acciones))throw Error('Faltan rasgos o acciones');
 const ids=new Set();for(const r of npc.rasgos){if(!record(r)||typeof r.id!=='string'||ids.has(r.id))throw Error('Rasgo inválido o repetido');ids.add(r.id);if(r.cantidad!=null||['vigoroso','duro'].includes(r.id))npcInteger(r.cantidad,1);}
 ids.clear();for(const a of npc.acciones){if(!record(a)||typeof a.id!=='string'||typeof a.nombre!=='string'||ids.has(a.id))throw Error('Acción inválida o repetida');ids.add(a.id);if(a.valor!=null)npcInteger(a.valor);if(a.coste!=null)npcInteger(a.coste);}
 if(npc.defensa_esbirro!=null){if(!record(npc.defensa_esbirro)||!['basica','avanzada'].includes(npc.defensa_esbirro.version))throw Error('Excepción defensiva inválida');npcInteger(npc.defensa_esbirro.maniobras_por_ronda,1,20);}
 for(const key of ['retaliaciones','acciones_epicas'])if(npc[key]!=null){if(!Array.isArray(npc[key])||npc[key].some(a=>!record(a)||typeof a.nombre!=='string'||typeof a.descripcion!=='string'))throw Error('Opciones de jefe inválidas');}
 return npc;
}
export function npcHealth(npc,member){
 if(npc.salud.tipo==='heridas')return {caido:member.heridas>=npc.salud.maximo,restante:Math.max(0,npc.salud.maximo-member.heridas),maximo:npc.salud.maximo,tipo:'heridas'};
 const vigorous=npc.rasgos.find(r=>r.id==='vigoroso')?.cantidad,hard=npc.rasgos.find(r=>r.id==='duro')?.cantidad;
 const caido=hard?(member.graves>=hard||(vigorous!=null&&member.golpes>=vigorous)):(member.graves>=1||member.golpes>=(vigorous??1));
 return {caido,tipo:'golpes',limite_golpes:vigorous??(hard?null:1),limite_graves:hard??1};
}
export function setNPCAguante(npc,{vigoroso=null,duro=null}={}){
 if(npc.salud.tipo!=='golpes')throw Error('Vigoroso y Duro requieren salud por golpes');
 for(const value of [vigoroso,duro])if(value!=null)npcInteger(value,1,200);
 const updated=structuredClone(npc);
 updated.rasgos=updated.rasgos.filter(r=>!['vigoroso','duro'].includes(r.id));
 if(vigoroso!=null)updated.rasgos.push({id:'vigoroso',nombre:'Vigoroso',cantidad:vigoroso,descripcion:`Cae al recibir ${vigoroso} golpes. Una Grave lo hace caer salvo que tenga Duro.`});
 if(duro!=null)updated.rasgos.push({id:'duro',nombre:'Duro',cantidad:duro,descripcion:`Cae al recibir ${duro} Heridas Graves. Sin Vigoroso, los golpes que no son Graves no lo hacen caer.`});
 return validateNPC(updated);
}
export function memberActions(group,member){return Math.max(0,group.acciones_maximas+member.ajuste_acciones);}
export function actionsUsed(group,member){return Math.min(group.acciones_usadas,memberActions(group,member))+member.acciones_extra_usadas;}
export function canDefend(member,npc){return member.reacciones_usadas<(npc?.defensa_esbirro?.maniobras_por_ronda??1)&&!member.estados.some(s=>s.toLocaleLowerCase()==='arrebatado');}
