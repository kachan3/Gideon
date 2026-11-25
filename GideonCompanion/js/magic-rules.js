export const normalizeSchool=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z]/g,'').replace('yrgrammar','yrgramar');
export const schoolSkill=(p,school)=>p.skills.find(s=>normalizeSchool(s.nombre)===normalizeSchool(school));
export const magicLevel=p=>Math.floor((p.skills.find(s=>s.nombre==='Inteligencia')?.valor??0)/10);
export const canWeave=p=>p.acciones.some(a=>/spellweave/i.test(a.nombre))||p.rasgos_clase?.some(r=>r.nombre==='Herencia Arcana');
export const scalingPending=c=>Boolean(c?.escalado_pendiente)||(c?.pl_escalable===1&&!c?.escalado_texto?.trim());
export function componentPLBounds(p,table,c){
 const min=table==='efectos'?(c?.pl_minimo??1):(c?.coste_pl??0);
 return {min,max:c?.pl_escalable===1&&!scalingPending(c)?magicLevel(p):min};
}
export const durationData=(p,effect)=>{
 const data=p.componentes.duraciones?.find(d=>normalizeSchool(d.intervalo)===normalizeSchool(effect?.intervalo_duracion));
 return data&&effect?.duracion_pl_maximo===1?{...data,pl_escalable:0,escalado_texto:'Duración fija de 1 minuto; no admite PL extra de Duración.'}:data;
};
export function durationPLBounds(p,effect){
 if(effect?.duracion_pl_maximo!=null)return {min:1,max:effect.duracion_pl_maximo};
 const data=durationData(p,effect);if(data)return {min:data.pl_minimo,max:data.pl_escalable&&!scalingPending(data)?magicLevel(p):data.pl_minimo};
 return /^instant[aá]nea$/i.test(effect?.intervalo_duracion??'Instantánea')?{min:0,max:0}:/until dispelled|indeterminado/i.test(effect?.intervalo_duracion??'')?{min:1,max:1}:{min:1,max:magicLevel(p)};
}
export function manaCost(p,pl){
 const efficiency=[...p.rasgos_clase,...p.adquisiciones.filter(a=>a.dote_id).map(a=>a.elemento)].some(x=>['Eficiencia','Herencia Arcana'].includes(x?.nombre));
 return efficiency?pl-Math.floor(pl/3):pl;
}
export function spellPlan(p,b){
 if(!canWeave(p))throw Error('El personaje no tiene la acción Spellweave');
 const find=(table,id)=>{const c=p.componentes[table].find(c=>c.id===id);if(!c)throw Error('Componente desconocido: '+table);return c;};
 const effect=find('efectos',b.efecto_id),medium=find('mediums',b.medium_id),shape=find('shapes',b.shape_id);
 const rules=effect.reglas_json?JSON.parse(effect.reglas_json):{};
 const family=name=>{const n=normalizeSchool(String(name).replace(/\s*\(.*$/,''));return ['efectodirecto','objetivounico'].includes(n)?'directo':['acreatureyoudesignate','acreatureyoucandetect'].includes(n)?'criaturapercibida':n;};
 const matches=(names,name)=>names?.some(n=>family(n)===family(name));
 if(rules.mediums&&!matches(rules.mediums,medium.nombre))throw Error('El efecto no admite ese Medium');
 if(matches(rules.mediums_prohibidos,medium.nombre))throw Error('Ese Medium está prohibido para el efecto');
 if(rules.shapes&&!matches(rules.shapes,shape.nombre))throw Error('El efecto no admite ese Shape');
 const shapeRules=shape.reglas_json?JSON.parse(shape.reglas_json):{};
 if(matches(shapeRules.mediums_prohibidos,medium.nombre))throw Error('El Shape Proyectil no admite ese Medium: Self o Touch (Toque)');
 const modIds=Array.isArray(b.mods)?b.mods.map(m=>typeof m==='number'?m:m?.id):[];
 if(!Array.isArray(b.mods)||new Set(modIds).size!==modIds.length)throw Error('Modificadores inválidos');
 const limit=magicLevel(p),int=(v,min,max)=>{if(!Number.isSafeInteger(v)||v<min||v>max||v>limit)throw Error(`Los PL de cada aspecto deben estar entre ${min} y ${Math.min(max,limit)}`);return v;};
 const allocated=(table,c,value)=>{const bounds=componentPLBounds(p,table,c);return int(value??bounds.min,bounds.min,bounds.max);};
 const mods=b.mods.map((m,i)=>{const c=find('mods',modIds[i]);return {...c,pl:allocated('mods',c,typeof m==='number'?undefined:m.pl)};});
 const effectPL=allocated('efectos',effect,b.efecto_pl),mediumPL=allocated('mediums',medium,b.medium_pl),shapePL=allocated('shapes',shape,b.shape_pl),duration=durationPLBounds(p,effect),durationPL=int(b.duracion_pl,duration.min,duration.max);
 const schools=[...new Set([effect.escuela,...mods.map(m=>m.escuela)].filter(Boolean).flatMap(s=>s.split(/\s*(?:\+|,|\/)\s*/)))];
 const skills=schools.map(s=>schoolSkill(p,s));if(skills.some(s=>!s))throw Error('Falta una habilidad de flujo requerida');
 if(!['Herramienta','Sin herramienta','Hechicero'].includes(b.herramienta))throw Error('Indica cómo canalizas');
 if(b.herramienta==='Hechicero'&&![...p.tags,...p.adquisiciones.map(a=>a.elemento)].some(t=>/hechicero/i.test(t?.nombre??'')))throw Error('Requiere el rasgo Hechicero');
 const pl=effectPL+durationPL+mediumPL+shapePL+mods.reduce((n,m)=>n+m.pl,0);
 return {nombre:effect.nombre,efecto:effect,medium,shape,mods,escuelas:schools,valor:Math.min(...skills.map(s=>s.valor)),habilidad:skills.map(s=>s.nombre).join(' / '),pl,coste_mana:manaCost(p,pl),nivel_inteligencia:limit,config:{efecto_id:effect.id,medium_id:medium.id,shape_id:shape.id,mods:mods.map(m=>({id:m.id,pl:m.pl})),efecto_pl:effectPL,medium_pl:mediumPL,shape_pl:shapePL,duracion_pl:durationPL,herramienta:b.herramienta}};
}
