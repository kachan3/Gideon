import {markTraining} from './training.mjs';
import {randomInt,randomUUID} from 'node:crypto';
import {resolveRoll,rollIndex} from '../js/roll-rules.js';
import {spellPlan,schoolSkill} from '../js/magic-rules.js';
import {chronicIncrease,ZONAS} from '../js/combat-rules.js';
import {lineageRollModifiers} from '../js/lineage-rules.js';
import {casterToolState} from './caster-tools.mjs';
const fail=m=>{throw Error(m);},run=(db,q,...args)=>db.prepare(q).run(...args);
export function checkSpend(p,resource,amount){
 if(!['Mana','Stamina','Gratis'].includes(resource)||!Number.isSafeInteger(amount)||amount<0||amount>9999)fail('Gasto inválido');
 const available=resource==='Mana'?p.derivados.mana_actual:resource==='Stamina'?p.derivados.stamina:0;
 if(resource==='Gratis'?amount!==0:amount>available)fail(`${resource==='Mana'?'Maná':resource} insuficiente: disponible ${available}`);
}
export function spendResource(db,p,resource,amount){
 checkSpend(p,resource,amount);
 if(resource==='Mana')run(db,'UPDATE personajes SET mana_consumido=mana_consumido+?,dano_cronico=dano_cronico+? WHERE id=?',amount,chronicIncrease(p.mana_consumido,p.mana_consumido+amount,p.derivados.limite_seguro),p.id);
 if(resource==='Stamina')run(db,'UPDATE personajes SET stamina_gastada=stamina_gastada+? WHERE id=?',amount,p.id);
}
export function useTrick(db,p,b){
 const trick=p.componentes.trucos.find(t=>t.id===b.truco_id);
 if(!trick)fail('Truco desconocido');
 const options=trick.opciones_coste?JSON.parse(trick.opciones_coste):null;
 if(!options){spendResource(db,p,trick.recurso,trick.coste_recurso);return;}
 const option=options.find(o=>o.id===(b.opcion??options[0].id));
 if(!option)fail('Modalidad de truco inválida');
 const units=b.unidades??1;
 if(!Number.isSafeInteger(units)||units<1||units>9999||(!option.variable&&units!==1))fail('Cantidad de recurso inválida');
 spendResource(db,p,option.recurso,option.coste*units);
}
function rollOptions(b){
 const dificultad=b.dificultad??0;if(!Number.isSafeInteger(dificultad)||dificultad<0||dificultad>99)fail('Dificultad inválida');
 const options={circunstancia:b.circunstancia??'Normal',dificultad};
 for(const key of ['ventaja','desventaja','salvataje']){
  if(b[key]==null)continue;
  if(!Number.isSafeInteger(b[key])||b[key]<0||b[key]>99)fail('Modificador inválido');
  options[key]=b[key];
 }
 if(b.omen!=null&&typeof b.omen!=='boolean')fail('Uso de Omen inválido');
 options.asegurado=b.omen===true;
 return options;
}
function saveRoll(db,p,context,result){const id=Number(run(db,'INSERT INTO tiradas(personaje_id,contexto,resultado) VALUES(?,?,?)',p.id,context,JSON.stringify(result)).lastInsertRowid);return {...result,id};}
function spendOmen(db,p,options){
 if(!options.asegurado)return;
 if(!run(db,'UPDATE personajes SET omen_actual=omen_actual-1 WHERE id=? AND omen_actual>0',p.id).changes)fail('No quedan puntos de Omen');
}
function rollDice(db,p,b,context,random100){
 if(b.eleccion!=null){
  const pending=db.prepare('SELECT * FROM decenas_pendientes WHERE personaje_id=? AND clave=? AND contexto=?').get(p.id,b.clave??'',context);
  const {clave,eleccion,...request}=b;
  if(!pending||pending.solicitud!==JSON.stringify(request))fail('La elección ya no corresponde a esta tirada');
  const dados=JSON.parse(pending.dados);
  if(!Number.isInteger(eleccion)||eleccion<0||eleccion>=dados.length)fail('Decena inválida');
  run(db,'DELETE FROM decenas_pendientes WHERE personaje_id=?',p.id);
  return {dado:dados[eleccion],alternativas:dados};
 }
 const count=b.decenas_extra??0;
 if(!Number.isInteger(count)||Math.abs(count)>99)fail('Cantidad de dados inválida');
 const first=random100();
 if(!count)return {dado:first};
 const dados=[first,...Array.from({length:Math.abs(count)},()=>Math.floor(random100()/10)*10+first%10)];
 const clave=randomUUID();
 run(db,'INSERT OR REPLACE INTO decenas_pendientes VALUES(?,?,?,?,?)',p.id,clave,context,JSON.stringify(b),JSON.stringify(dados));
 return {elegir:true,clave,dados,penalizacion:count<0};
}
export function skillRoll(db,p,b,random100=()=>randomInt(100)){
 let name,value,attack,skillName;
 if(Object.hasOwn(b,'ataque')){attack=p.equipo.ataques.find(a=>(a.item_id??'desarmado')===b.ataque);if(!attack||!attack.equipado)fail('Equipa el arma antes de atacar');name=attack.nombre;value=attack.valor;}
 else {const skill=p.skills.find(s=>s.id===b.skill_id);if(!skill)fail('Habilidad no disponible');name=skill.nombre;skillName=skill.nombre;value=skill.valor;}
 const options=rollOptions(b),dice=rollDice(db,p,b,'Habilidad',random100);
 const usedSkill=p.skills.find(s=>attack?s.nombre===attack.skill:s.id===b.skill_id);
 const ace=p.elecciones_rasgos?.find(e=>e.tipo==='As');
 options.neExito=(ace?.valor??[]).find(a=>a.skill_id===usedSkill?.id)?.puntos??0;
 let rootSkill=usedSkill;
 while(rootSkill?.padre_id)rootSkill=p.skills.find(s=>s.id===rootSkill.padre_id);
 const physical=Boolean(attack)||['Fuerza','Agilidad','Melee','Proyectiles'].includes(rootSkill?.nombre);
 if(physical&&['Incómodo','Encumbered'].includes(p.equipo?.estado_carga)){
  const minimum=p.equipo.estado_carga==='Encumbered'?-20:-10;
  const ranks={'Muy Fácil':30,'Fácil':20,'Sencilla':10,Normal:0,Complicada:-10,'Difícil':-20,'Muy Difícil':-30,Extrema:-40};
  if((ranks[options.circunstancia]??0)>minimum)options.circunstancia=minimum===-20?'Difícil':'Complicada';
 }
 if(dice.elegir)return dice;
 if(attack?.artefacto&&attack.coste_cargas){
  if(!db.prepare('UPDATE inventario SET cargas_actuales=cargas_actuales-? WHERE id=? AND personaje_id=? AND cargas_actuales>=?').run(attack.coste_cargas,attack.item_id,p.id,attack.coste_cargas).changes)fail('Cargas insuficientes');
 }
 const {dado}=dice,mods=lineageRollModifiers(p,skillName),settings={...options,neExito:dado%11===0?0:options.neExito,ne:mods.ne,salvataje:mods.salvataje>0?Math.max(mods.salvataje,options.salvataje??0):options.salvataje},result=resolveRoll(dado,value,settings);
 spendOmen(db,p,options);
 let punteria=null;
 if(b.apuntar){
  if(!attack||!ZONAS.includes(b.apuntar))fail('Zona de ataque inválida');
  const critico=result.critico==='Portento';
  const dados=result.supera&&!critico?Array.from({length:result.ne},()=>randomInt(1,7)):[];
  punteria={zona:b.apuntar,dados,impacta:result.supera&&(critico||dados.includes(ZONAS.indexOf(b.apuntar)+1))};
 }
 if(!result.exito){
  const used=p.skills.find(s=>attack?s.nombre===attack.skill:s.id===b.skill_id);
  if(used?.tipo!=='Atributo'||b.solicitada_dm===true)markTraining(db,p,used);
 }
 return saveRoll(db,p,name,{...result,nota_as_marcial:options.neExito&&dado%11===0?'As Marcial: el tratamiento de Portentos está pendiente de ratificación; resolvé su bono con el narrador.':null,nombre:name,punteria,alternativas:dice.alternativas,modificadores_linaje:mods,normal:resolveRoll(dado,value,{...settings,circunstancia:'Normal'}),indice:rollIndex(dado,value,settings),...(attack?{dano:result.supera&&(!punteria||punteria.impacta)?attack.dano_base+result.ne:0,formula:attack.formula,tipos_dano:attack.tipos_dano}: {})});
}
const decode=row=>row?{...row,plan:JSON.parse(row.plan),ultimo_resultado:row.ultimo_resultado?JSON.parse(row.ultimo_resultado):null}:null;
export function magicState(db,id){return {activa:decode(db.prepare("SELECT * FROM canalizaciones WHERE personaje_id=? AND estado='Canalizando'").get(id)),historial:db.prepare("SELECT * FROM canalizaciones WHERE personaje_id=? AND estado<>'Canalizando' ORDER BY id DESC LIMIT 5").all(id).map(decode),tiradas:db.prepare('SELECT * FROM tiradas WHERE personaje_id=? ORDER BY id DESC LIMIT 5').all(id).map(r=>({...r,resultado:JSON.parse(r.resultado)}))};}
export function spellOperation(db,p,b,random100=()=>randomInt(100),replaying=false){
 if(b.accion==='Nuevo turno'){
  const state=casterToolState(db,p);
  if(b.turno_actual!==state.turno)fail('El turno ya cambió; actualiza la ficha');
  run(db,'UPDATE lanzador_turnos SET turno=turno+1,repeticion=NULL WHERE personaje_id=?',p.id);return null;
 }
 if(b.accion==='Repetir con Libro'){
  const state=casterToolState(db,p);
  if(!state.repetible||state.repetible.id!==b.tirada_id||!state.libro_disponible)fail('La repetición del Libro no está disponible en este turno');
  const snapshot=JSON.parse(db.prepare('SELECT repeticion FROM lanzador_turnos WHERE personaje_id=?').get(p.id).repeticion);
  const current=db.prepare('SELECT mana_consumido,dano_cronico,omen_actual FROM personajes WHERE id=?').get(p.id);
  if(Object.keys(current).some(k=>current[k]!==snapshot.after[k]))fail('Los recursos cambiaron después de esta tirada; no se puede reemplazar su resultado');
  const activeNow=magicState(db,p.id).activa;
  if(activeNow&&activeNow.id!==snapshot.active.id)fail('Ya comenzaste otro conjuro');
  if(snapshot.request.herramienta==='Sin herramienta'||snapshot.active.plan.config.herramienta==='Sin herramienta')fail('El Libro debe usarse como herramienta');
  checkSpend(p,'Stamina',1);
  run(db,'UPDATE personajes SET mana_consumido=?,dano_cronico=?,omen_actual=? WHERE id=?',snapshot.before.mana_consumido,snapshot.before.dano_cronico,snapshot.before.omen_actual,p.id);
  if(snapshot.training_new)run(db,'DELETE FROM entrenamiento_marcas WHERE personaje_id=? AND skill_id=?',p.id,snapshot.training_skill);
  run(db,"UPDATE canalizaciones SET progreso=?,tiradas=?,estado='Canalizando',ultimo_resultado=? WHERE id=?",snapshot.active.progreso,snapshot.active.tiradas,snapshot.active.ultimo_resultado?JSON.stringify(snapshot.active.ultimo_resultado):null,snapshot.active.id);
  spendResource(db,p,'Stamina',1);
  const restored={...p,...snapshot.before,stamina_gastada:p.stamina_gastada+1,derivados:{...p.derivados,mana_max:p.derivados.mana_base-snapshot.before.dano_cronico,mana_actual:p.derivados.mana_base-snapshot.before.dano_cronico-snapshot.before.mana_consumido,stamina:p.derivados.stamina-1}};
  const result=spellOperation(db,restored,{...snapshot.request,accion:'Tejer',canalizacion_id:snapshot.active.id,decenas_extra:0},random100,true);
  run(db,"UPDATE tiradas SET resultado=json_set(resultado,'$.reemplazada_por',?) WHERE id=?",result.id,snapshot.roll_id);
  run(db,'UPDATE lanzador_turnos SET libro_turno=turno,repeticion=NULL WHERE personaje_id=?',p.id);
  return {...result,repeticion_libro:true,reemplaza:snapshot.roll_id};
 }
 const active=magicState(db,p.id).activa;
 if(b.accion==='Comenzar'){
  if(active)fail('Ya tienes un conjuro en canalización');
  if(b.componentes_disponibles!==true)fail('Confirma los componentes y restricciones del conjuro');
  if(p.derivados.estado!=='Activo'||p.estados.some(s=>/Aturdido|Dormido/i.test(s.nombre)))fail('Tu estado impide canalizar');
  const plan=spellPlan(p,b);checkSpend(p,'Mana',plan.coste_mana);
  run(db,'UPDATE lanzador_turnos SET repeticion=NULL WHERE personaje_id=?',p.id);
  run(db,'INSERT INTO canalizaciones(personaje_id,plan) VALUES(?,?)',p.id,JSON.stringify(plan));return null;
 }
 if(!active||active.id!==b.canalizacion_id)fail('La canalización ya no está activa');
 if(b.accion==='Interrumpir'){run(db,"UPDATE canalizaciones SET estado='Interrumpido',actualizada=CURRENT_TIMESTAMP WHERE id=?",active.id);return null;}
 if(b.accion!=='Tejer')fail('Acción de lanzamiento inválida');
 if(b.componentes_disponibles!==true||p.derivados.estado!=='Activo'||p.estados.some(s=>/Aturdido|Dormido/i.test(s.nombre))){run(db,"UPDATE canalizaciones SET estado='Interrumpido',actualizada=CURRENT_TIMESTAMP WHERE id=?",active.id);return {aviso:'Canalización interrumpida por el estado o la falta de componentes. Sin gasto de maná.'};}
 let plan;try{plan=spellPlan(p,active.plan.config);}catch{run(db,"UPDATE canalizaciones SET estado='Interrumpido',actualizada=CURRENT_TIMESTAMP WHERE id=?",active.id);return {aviso:'Canalización interrumpida: sus componentes o su inversión de PL ya no cumplen las reglas del catálogo.'};}
 checkSpend(p,'Mana',plan.coste_mana);
 const options=rollOptions(b),penalty=plan.config.herramienta==='Sin herramienta',mods={ne:penalty?-5:0,nf:penalty?5:0},dice=rollDice(db,p,b,'Spellweave '+active.id,random100);
 if(dice.elegir)return dice;
 const {dado}=dice,result=resolveRoll(dado,plan.valor,{...options,...mods});
 const trainingSkill=plan.escuelas.map(name=>schoolSkill(p,name)).find(s=>s?.valor===plan.valor);
 const hadTraining=trainingSkill?Boolean(db.prepare('SELECT 1 FROM entrenamiento_marcas WHERE personaje_id=? AND skill_id=?').get(p.id,trainingSkill.id)):true;
 spendOmen(db,p,options);
 if(!result.exito)markTraining(db,p,plan.escuelas.map(name=>schoolSkill(p,name)).find(s=>s?.valor===plan.valor));
 const delta=result.exito?result.ne:Math.min(0,plan.nivel_inteligencia-result.nf),progress=Math.max(0,active.progreso+delta),complete=progress>=plan.pl;
 if(complete)spendResource(db,p,'Mana',plan.coste_mana);
 const roll=saveRoll(db,p,'Spellweave · '+plan.nombre,{...result,nombre:'Spellweave · '+plan.nombre,alternativas:dice.alternativas,normal:resolveRoll(dado,plan.valor,{...options,...mods,circunstancia:'Normal'}),indice:rollIndex(dado,plan.valor,{...options,...mods}),progreso:progress,pl:plan.pl,delta,completado:complete,mana_pagado:complete?plan.coste_mana:0});
 run(db,'UPDATE canalizaciones SET plan=?,progreso=?,tiradas=tiradas+1,estado=?,ultimo_resultado=?,actualizada=CURRENT_TIMESTAMP WHERE id=?',JSON.stringify(plan),progress,complete?'Completado':'Canalizando',JSON.stringify(roll),active.id);
 if(!replaying){
  const state=casterToolState(db,p);
  if(state.nombre==='Libro de Conjuros'&&plan.config.herramienta!=='Sin herramienta'){
   const after=db.prepare('SELECT mana_consumido,dano_cronico,omen_actual FROM personajes WHERE id=?').get(p.id);
   run(db,'UPDATE lanzador_turnos SET repeticion=? WHERE personaje_id=?',JSON.stringify({turno:state.turno,roll_id:roll.id,active,request:b,before:{mana_consumido:p.mana_consumido,dano_cronico:p.dano_cronico,omen_actual:p.omen_actual},after,training_skill:trainingSkill?.id??null,training_new:!hadTraining&&!result.exito}),p.id);
  }
 }
 return roll;
}
