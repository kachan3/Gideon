// Reglas compartidas por el wizard y el servidor. Core: creación, pasos 1 y 6.
export const FIXED_VALUES = [50,45,40,35,30,30,30,20,20,15];
export const ATTRIBUTE_ORDER = ['Fuerza','Vitalidad','Agilidad','Instinto','Voluntad','Inteligencia','Carácter','Melee','Proyectiles','Arcana'];
export function sameValues(a,b){return a.length===b.length&&[...a].sort((x,y)=>x-y).join(',')===[...b].sort((x,y)=>x-y).join(',');}
export function remainingValues(pool,assigned,except=null){
 const left=[...pool];
 for(const [key,value] of Object.entries(assigned))if(String(key)!==String(except)&&Number(value)>0){const i=left.indexOf(Number(value));if(i>=0)left.splice(i,1);}
 return left;
}
export function qualifiesForMulligan(values){return values.length===10&&values.filter(v=>v>40).length<2&&values.filter(v=>v<20).length>3&&values.slice(7).every(v=>v<=40);}
export function rollValues(dice){return dice.map(roll=>roll.reduce((sum,n)=>sum+n,0)*5);}

// Previsualización y guardado comparten los mismos valores. Destacado se evalúa
// sobre el resultado con puntos asignados, una sola vez, antes del techo de 80.
export function creationSkills({skills,atributos,pools={},bonos=[],garantias=[],minimos=[]}){
 const details={},totals={};
 const bonusFor=id=>bonos.filter(b=>b.skill_id===id).reduce((n,b)=>n+b.bono,0);
 const guaranteeFor=id=>garantias.find(g=>g.skill_id===id);
 const compute=(skill,parent=null)=>{
   const g=guaranteeFor(skill.id),base=parent?parent.total:Number(atributos[skill.id]??0),lineage=bonusFor(skill.id);
   const inherited=base+lineage,minimum=g?.minimo??null,traitMinimum=Math.max(0,...minimos.filter(m=>m.skill_id===skill.id).map(m=>m.minimo)),baseline=inherited;
   const allocated=Number(pools[skill.id]??0),before=baseline+allocated;
   const standout=g&&before>g.minimo?(g.bono_destacado??5):0;
   const floor=Math.max(minimum??0,traitMinimum);
   const unclamped=Math.max(before+standout,floor),total=Math.min(80,unclamped);
   const result={id:skill.id,base,linaje:lineage,minimo:minimum,piso:Math.max(0,floor-before),baseline,asignado:allocated,antes_destacado:before,destacado:standout,total,exceso:Math.max(0,unclamped-80),profesion:Boolean(g||parent?.profesion),garantia_propia:Boolean(g),garantia_padre:parent?.profesion?parent.id:null};
   details[skill.id]=result;totals[skill.id]=total;return result;
 };
 for(const s of skills.filter(s=>s.tipo==='Atributo'))compute(s);
 for(const s of skills.filter(s=>s.padre_id!=null))compute(s,details[s.padre_id]);
 for(const s of skills.filter(s=>s.tipo!=='Atributo'&&s.padre_id==null&&(garantias.some(g=>g.skill_id===s.id)||minimos.some(m=>m.skill_id===s.id)||bonos.some(b=>b.skill_id===s.id))))compute(s);
 return {details,totals};
}

export function personalWeight(fuerza,vitalidad,escaladoVital){
 return 5*Math.floor((fuerza+vitalidad)*escaladoVital/10);
}
