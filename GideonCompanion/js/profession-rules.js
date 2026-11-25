export function selectedProfession(c,d,{strict=false}={}){
 const options=(c.dedicaciones_profesiones??[]).filter(p=>p.dedicacion_id===d.dedicacion_id).map(p=>c.profesiones.find(x=>x.id===p.profesion_id));
 const selected=d.profesiones_elegidas?.[d.dedicacion_id]??d.profesion_id;
 if(!options.length){if(strict&&selected!=null&&selected!=='')throw Error('Esta Dedicación no concede ese oficio');return null;}
 if(selected==null||selected===''){if(options.length===1)return options[0];if(strict)throw Error('Elige el oficio aprendido');return null;}
 const found=options.find(p=>p.id===selected);if(!found)throw Error('El oficio no pertenece a la Dedicación');return found;
}
export function professionGuarantees(c,d){
 const result=(c.dedicaciones_skills??[]).filter(g=>g.dedicacion_id===d.dedicacion_id).map(g=>({...g})),selected=selectedProfession(c,d);
 if(selected){const old=result.find(g=>g.skill_id===selected.skill_id);if(old)old.minimo=Math.max(old.minimo,selected.minimo_inicial);else result.push({skill_id:selected.skill_id,minimo:selected.minimo_inicial,bono_destacado:5});}
 return result;
}
