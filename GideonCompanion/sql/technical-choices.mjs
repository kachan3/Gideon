import {TECHNICAL_SKILLS,technicalAllocations} from '../js/technical-choices.js';
export function ensureTechnicalSkills(db){
 for(const [nombre,codigo,descripcion] of TECHNICAL_SKILLS){
  if(!db.prepare('SELECT id FROM all_skills WHERE nombre=?').get(nombre))db.prepare("INSERT INTO all_skills(nombre,codigo,tipo,descripcion) VALUES(?,?,'Extra',?)").run(nombre,'sombra_'+codigo,descripcion);
 }
}
export function grantTechnicalKnowledge(db,c,d,id){
 if(d.conocimiento_tecnico===undefined)return; // Existing sheets and older API clients keep their choices.
 for(const {skill,puntos} of technicalAllocations(c,d,{strict:true})){
  const base=db.prepare('SELECT valor_base FROM personajes_skills WHERE personaje_id=? AND skill_id=?').get(id,skill.id)?.valor_base??0;
  const applied=Math.min(puntos,Math.max(0,100-base));if(!applied)continue;
  db.prepare("INSERT INTO progresion(personaje_id,change,tipo,skill_id,valor,xp_gastada,clase_id,origen) VALUES(?,'Add','Skill',?,?,0,?,'Conocimiento Técnico')").run(id,skill.id,applied,d.clase_id);
 }
}
