// Catálogo y cálculo compartidos por el creador y el servidor.
import {creationTraitModifiers,traitCondition} from './trait-rules.js';
export function lineageBonuses(c,d,{strict=false}={}){
 const bonuses=(c.linajes_skills??[]).filter(b=>b.linaje_id===d.linaje_id&&!b.rasgo_id).map(b=>({...b}));
 const groups=(c.linajes_elecciones??[]).filter(g=>g.linaje_id===d.linaje_id),selected=d.elecciones_linaje??{};
 if(typeof selected!=='object'||selected===null||Array.isArray(selected))throw Error('Elecciones de linaje inválidas');
 if(strict&&Object.keys(selected).some(id=>!groups.some(g=>String(g.id)===id)))throw Error('La elección no pertenece al linaje');
 for(const group of groups){
  const id=selected[group.id];
  if(id==null||id===''){if(strict)throw Error('Elige la habilidad del bono de linaje');continue;}
  if(!Number.isSafeInteger(id)||!(c.linajes_elecciones_opciones??[]).some(o=>o.eleccion_id===group.id&&o.skill_id===id))throw Error('Habilidad de linaje no permitida');
  bonuses.push({linaje_id:d.linaje_id,skill_id:id,bono:group.bono});
 }
 return [...bonuses,...creationTraitModifiers(c,d).bonos];
}

export function lineageSummary(p,effects=[]){
 const rule=name=>effects.filter(e=>e.tipo==='Regla'&&e.objetivo===name).reduce((n,e)=>Math.max(n,e.valor),0);
 const movement=name=>effects.filter(e=>e.tipo==='Movimiento'&&e.objetivo===name).reduce((n,e)=>Math.max(n,e.valor),0);
 const resist=Math.floor((p.skills.find(s=>s.nombre==='Resistir')?.valor??0)/10),multiplier=rule('respiracion_acuatica_multiplicador')||1;
 const poison=Boolean(rule('resistencia_veneno_driades'));
 const unconscious=p.estados?.some(s=>['Inconsciente','Dormido','Dormidos'].includes(s.nombre))||p.derivados?.estado!=='Activo';
 return {revision:'2026-11-05',movimiento:p.linaje.movimiento_terrestre??6,nado:movement('nado'),escalada_vegetal:movement('escalada_vegetal'),
  respiracion_minutos:resist,respiracion_acuatica_minutos:resist*multiplier,sin_gasto_aire_ataque_acuatico:Boolean(rule('sin_gasto_aire_ataque_acuatico')),
  iniciativa_escalones:unconscious?0:rule('iniciativa_escalones_consciente'),vision_luz_residual:Boolean(rule('vision_con_luz_residual')),
  umbral_caida_unidades:2*(rule('umbral_caida_multiplicador')||1),dano_caida_multiplicador:rule('dano_caida_multiplicador')||1,
  veneno_driades:{resistente:poison,tolerancia:resist,envenenado:resist*(poison?2:1),sobredosis:resist*(poison?3:2),depuracion_dia:poison?2:1},
  efectos:effects};
}

export function lineageRollModifiers(p,name){
 const effects=p.rasgos?p.rasgos.flatMap(r=>r.modificadores.filter(m=>m.fase==='Siempre'&&traitCondition(m.condicion,p)).map(m=>({...m,objetivo:p.skills.find(s=>s.id===m.skill_id)?.nombre??m.objetivo}))):p.capacidades_linaje?.efectos??[];
 return {ne:effects.filter(e=>e.tipo==='TiradaNE'&&e.objetivo===name).reduce((n,e)=>n+e.valor,0),
  salvataje:effects.filter(e=>e.tipo==='Salvataje'&&e.objetivo===name).reduce((n,e)=>Math.max(n,e.valor),0)};
}
