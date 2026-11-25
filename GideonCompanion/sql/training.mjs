import {randomInt} from 'node:crypto';
export function markTraining(db,p,skill){
 if(!skill)return;
 const mark=db.prepare('INSERT OR IGNORE INTO entrenamiento_marcas VALUES(?,?)');
 const inserted=mark.run(p.id,skill.id).changes;
 if(!inserted||!skill.padre_id)return;
 const count=db.prepare('SELECT COUNT(*) n FROM entrenamiento_marcas m JOIN all_skills s ON s.id=m.skill_id WHERE m.personaje_id=? AND s.padre_id=?').get(p.id,skill.padre_id).n;
 if(count>=3)mark.run(p.id,skill.padre_id);
}
export function trainingState(db,id){
 const marcas=db.prepare('SELECT skill_id FROM entrenamiento_marcas WHERE personaje_id=?').all(id).map(r=>r.skill_id);
 const sesion=db.prepare('SELECT id FROM entrenamiento_sesiones WHERE personaje_id=? ORDER BY id DESC LIMIT 1').get(id);
 const intentos=sesion?db.prepare('SELECT * FROM entrenamiento_intentos WHERE sesion_id=? ORDER BY id').all(sesion.id):[];
 const coste=db.prepare('SELECT COUNT(*) n FROM entrenamiento_sesiones WHERE personaje_id=?').get(id).n;
 return {marcas,intentos,coste};
}
export function train(db,p,b,grant,roll=randomInt){
 const {marcas,intentos}=p.entrenamiento;
 const improve=(skill,value,asegurado)=>{
  const sides=skill.tipo==='Atributo'||value>=76?4:6;
  const delta=Math.min(100-skill.valor,roll(1,sides+1));
  if(delta<=0)throw Error('La habilidad ya alcanzó 100');
  grant(skill.id,delta,asegurado?1:0);
  db.prepare('DELETE FROM entrenamiento_marcas WHERE personaje_id=? AND skill_id=?').run(p.id,skill.id);
  return delta;
 };
 if(p.xp_disponible<1)throw Error('Se requiere 1 XP disponible');
 if(b.asegurar!=null){
  const intento=intentos.find(i=>i.id===b.asegurar&&!i.mejora&&marcas.includes(i.skill_id));
  if(!intento)throw Error('El intento no está disponible para asegurar');
  const skill=p.skills.find(s=>s.id===intento.skill_id);
  const delta=improve(skill,intento.valor,true);
  db.prepare('UPDATE entrenamiento_intentos SET mejora=?,asegurado=1 WHERE id=?').run(delta,intento.id);
  return;
 }
 if(!Array.isArray(b.skills)||!b.skills.length||new Set(b.skills).size!==b.skills.length)throw Error('Elegí habilidades o atributos marcados distintos');
 const skills=b.skills.map(id=>p.skills.find(s=>s.id===id&&s.valor<100&&marcas.includes(id)));
 if(skills.some(s=>!s))throw Error('Se requiere una marca vigente');
 if(skills.filter(s=>s.tipo==='Atributo').length>2||skills.filter(s=>s.tipo!=='Atributo').length>5)throw Error('Máximo dos atributos y cinco habilidades por sesión');
 const sesion=db.prepare('INSERT INTO entrenamiento_sesiones(personaje_id) VALUES(?)').run(p.id).lastInsertRowid;
 // Resolve in the player's selection order, including inheritance from earlier improvements.
 for(const skill of skills){
  const dado=roll(0,100),valor=skill.valor;
  const mejora=valor<100&&dado>=valor?improve(skill,valor,false):0;
  if(mejora&&skill.tipo==='Atributo')for(const child of skills.filter(s=>s.padre_id===skill.id))child.valor=Math.min(100,child.valor+mejora);
  db.prepare('INSERT INTO entrenamiento_intentos(sesion_id,skill_id,valor,dado,mejora) VALUES(?,?,?,?,?)').run(sesion,skill.id,valor,dado,mejora);
 }
}
