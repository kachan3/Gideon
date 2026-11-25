// Operaciones cerradas sobre datos. No interpreta ni ejecuta regla_texto.
import {selectedProfession} from './profession-rules.js';
export const TRAIT_TYPES=['BonoSkill','MinimoSkill','Mitigacion','Resistencia','Debilidad','Movimiento','Regla','TiradaNE','Salvataje','XPInicial'];
export const TRAIT_CONDITIONS=['Siempre','Consciente','BajoAgua','AlCaer','ConLuzResidual','ArbolesVegetacion','Manual'];
export function traitCondition(condition,p={},context={}){
 if(condition==='Siempre')return true;
 if(condition==='Consciente')return !p.heridas_mortales&&p.heridas_graves<4&&!p.estados?.some(s=>['Inconsciente','Dormido','Dormidos'].includes(s.nombre)||(s.nombre==='Sofocado'&&s.grado>=2))&&(!p.derivados||p.derivados.estado==='Activo');
 return context[condition]===true;
}
export function runtimeTraitSkills(skills,traits,p={}){
 const mods=traits.flatMap(r=>r.modificadores).filter(m=>m.fase==='Siempre'&&['BonoSkill','MinimoSkill'].includes(m.tipo)&&traitCondition(m.condicion,p));
 const apply=(s,inherited=0)=>{const own=mods.filter(m=>m.skill_id===s.id),bonus=own.filter(m=>m.tipo==='BonoSkill').reduce((n,m)=>n+m.valor,0),minimum=Math.max(0,...own.filter(m=>m.tipo==='MinimoSkill').map(m=>m.valor));return {...s,valor:Math.min(100,Math.max(0,s.valor+inherited+bonus,minimum))};};
 const parents=new Map(skills.filter(s=>s.tipo==='Atributo').map(s=>[s.id,apply(s)]));
 return skills.map(s=>s.tipo==='Atributo'?parents.get(s.id):apply(s,s.padre_id?(parents.get(s.padre_id)?.valor??0)-(skills.find(a=>a.id===s.padre_id)?.valor??0):0));
}
export function originTraits(c,d,{includeLineage=true}={}){
 const ids=new Map(),collect=(table,field,id,source)=>{if(id==null)return;for(const link of (c[table]??[]).filter(r=>r[field]===id)){if(!ids.has(link.rasgo_id))ids.set(link.rasgo_id,new Set());ids.get(link.rasgo_id).add(source);}};
 if(includeLineage)collect('linajes_rasgos','linaje_id',d.linaje_id,'Linaje');
 collect('dedicaciones_rasgos','dedicacion_id',d.dedicacion_id,'Dedicación');collect('nacimientos_rasgos','nacimiento_id',d.nacimiento_id,'Nacimiento');
 const profession=selectedProfession(c,d);if(profession){if(!ids.has(profession.rasgo_id))ids.set(profession.rasgo_id,new Set());ids.get(profession.rasgo_id).add('Oficio');}
 return [...ids].map(([id,sources])=>{const r=c.rasgos?.find(r=>r.id===id&&r.tipo==='Capacidad');return r?{...r,origenes:[...sources]}:null;}).filter(Boolean);
}
export function creationTraitModifiers(c,d){
 const ids=new Set(),collect=(table,field,id)=>(c[table]??[]).filter(r=>r[field]===id).forEach(r=>ids.add(r.rasgo_id));
 collect('linajes_rasgos','linaje_id',d.linaje_id);collect('dedicaciones_rasgos','dedicacion_id',d.dedicacion_id);collect('nacimientos_rasgos','nacimiento_id',d.nacimiento_id);
 (c.clases_rasgos??[]).filter(r=>r.clase_id===d.clase_id&&r.es_insignia&&r.rasgo_id).forEach(r=>ids.add(r.rasgo_id));
 const feats=new Set([...(c.linajes_dotes??[]).filter(r=>r.linaje_id===d.linaje_id).map(r=>r.dote_id),...(c.clases_dotes??[]).filter(r=>r.clase_id===d.clase_id).map(r=>r.dote_id),c.dedicaciones?.find(r=>r.id===d.dedicacion_id)?.dote_otorgado_id].filter(Boolean));
 (c.dotes_rasgos??[]).filter(r=>feats.has(r.dote_id)).forEach(r=>ids.add(r.rasgo_id));
 const profession=selectedProfession(c,d);if(profession)ids.add(profession.rasgo_id);
 const mods=(c.rasgos_modificadores??[]).filter(m=>ids.has(m.rasgo_id)&&m.fase==='Creacion'&&m.condicion==='Siempre');
 const bonuses=mods.filter(m=>m.tipo==='BonoSkill').map(m=>({skill_id:m.skill_id,bono:m.valor}));
 const guaranteed=new Map();for(const m of mods.filter(m=>m.tipo==='MinimoSkill')){const old=guaranteed.get(m.skill_id);if(!old||m.valor>old.minimo)guaranteed.set(m.skill_id,{skill_id:m.skill_id,minimo:m.valor,bono_destacado:0});}
 return {bonos:bonuses,garantias:[...guaranteed.values()],xp_inicial:mods.filter(m=>m.tipo==='XPInicial').reduce((n,m)=>n+m.valor,0)};
}
