export const FUENTES=['Física','Energética'];
export const MEDIOS=['Melee','Proyectil','Área de efecto','Directo'];
export const ZONAS=['Cabeza','Torso','Brazo izquierdo','Brazo derecho','Pierna izquierda','Pierna derecha'];
export function baseMitigation(p,type){
 const stat=name=>Math.floor((p.skills.find(s=>s.nombre===name)?.valor??0)/10);
 if(['Cortante','Punzante','Contundente','Fuego','Frío','Rayo','Ácido'].includes(type))return p.derivados.dureza;
 if(type==='Espiritual')return stat('Voluntad');
 if(type==='Psíquico')return stat('Inteligencia');
 if(type==='Verdadero')return 0;
 return null;
}
export function defenseTotals(p){
 const defenses=p.equipo?.defensas??[],types=[...new Set(defenses.map(d=>d.tipo_dano))];
 return types.map(type=>{
  const applicable=defenses.filter(d=>d.tipo_dano===type),base=baseMitigation(p,type);
  const flat=applicable.filter(d=>d.categoria==='Mitigacion').reduce((n,d)=>n+d.valor,0),fragile=applicable.filter(d=>d.categoria==='Fragilidad').reduce((n,d)=>n+d.valor,0);
  return {tipo_dano:type,base,mitigacion:flat,fragilidad:fragile,total:base===null?null:type==='Verdadero'?0:base+flat-fragile,modificadores:type==='Verdadero'?[]:applicable.filter(d=>['Resistencia','Debilidad'].includes(d.categoria)),fuentes:applicable.map(d=>d.fuente)};
 });
}
export function damagePreview(p,{cantidad,tipo_dano,modo='Bruto'}){
 if(!Number.isSafeInteger(cantidad)||cantidad<0||cantidad>9999)throw Error('Indica un daño entero entre 0 y 9999');
 let mitigation=0,fragility=0;
 if(modo==='Omen')return {recibido:cantidad,mitigacion:0,fragilidad:0,heridas:0,grave:0,mortal:0};
 if(modo!=='Final'){
  const base=baseMitigation(p,tipo_dano);
  if(base===null)throw Error('Este tipo necesita resolución de la mesa. Activa «Daño ya resuelto».');
  mitigation=base;
  if(tipo_dano!=='Verdadero')for(const d of p.equipo?.defensas??[]){
   if(d.tipo_dano!==tipo_dano)continue;
   if(['Resistencia','Debilidad'].includes(d.categoria))throw Error('Hay multiplicadores de daño. Resuélvelos con la mesa y activa «Daño ya resuelto».');
   if(d.categoria==='Mitigacion')mitigation+=d.valor;
   if(d.categoria==='Fragilidad')fragility+=d.valor;
  }
 }
 const heridas=Math.max(0,cantidad-mitigation+fragility),mh=p.derivados.mh;
 const mortal=mh>0&&heridas>=mh?1:0,grave=mh>0&&heridas>=Math.ceil(mh/2)?1:0;
 return {recibido:cantidad,mitigacion:mitigation,fragilidad:fragility,heridas,grave,mortal};
}
export function chronicIncrease(oldConsumed,newConsumed,safe){return Math.max(0,Math.max(0,newConsumed-safe)-Math.max(0,oldConsumed-safe));}
