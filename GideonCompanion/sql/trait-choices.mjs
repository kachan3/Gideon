import {readFileSync} from 'node:fs';
import {addInventory} from './equipment.mjs';
import {toolNames} from './caster-tools.mjs';
import {casterToolDescription} from './core-sync.mjs';
const rows=(db,q,...a)=>db.prepare(q).all(...a),one=(db,q,...a)=>db.prepare(q).get(...a);
const fail=m=>{throw Error(m);};
const artifacts=[['Bastón de Brasas','Ignamor · Fuego y calor.'],['Varita del Amanecer','Ignamor / Naial · Luz y calor.'],['Mastín de Huesos','Yrgramar · Reliquia de hueso grabado.'],['Compañero Fiel','Naial · Protección y vínculo etéreo.'],['Báculo del Atrapasueños','Ivganny · Mente y sueños.']];
export function migrateTraitChoices(db){
 db.exec(readFileSync(new URL('./migrations/031_trait_choices.sql',import.meta.url),'utf8'));
 const add=(codigo,name,tipo,titulo,feat=false)=>{const target=one(db,`SELECT id FROM ${feat?'dotes':'rasgos'} WHERE nombre=?`,name);if(!target)fail('Falta definición: '+name);db.prepare(`INSERT INTO elecciones_rasgos(codigo,${feat?'dote_id':'rasgo_id'},tipo,titulo) VALUES(?,?,?,?)`).run(codigo,target.id,tipo,titulo);};
 add('entrenamiento_superior','Entrenamiento Superior','Marcial','Elegí tu Dote Marcial');
 add('herramienta','La Herramienta Correcta','Herramienta','Elegí tu herramienta de lanzador',true);
 add('epifania','Lanzador de Conjuros','Epifania','Elegí tu Epifanía inicial',true);
 add('artefacto','Epifanía Original','Artefacto','Elegí tu Artefacto Arcano inicial');
 let ace=one(db,"SELECT id FROM rasgos WHERE nombre='As Marcial'");
 if(!ace){const id=Number(db.prepare("INSERT INTO rasgos(nombre,descripcion,tipo) VALUES('As Marcial',?,'Capacidad')").run('Un punto de As por cada 3 XP invertidos en Dotes Valor. Cada punto suma +1 NE a los éxitos de una habilidad marcial de al menos 80%, con máximo 5 puntos por habilidad.').lastInsertRowid);ace={id};}
 add('as_marcial','As Marcial','As','Asigná tus puntos de As');
 db.prepare('INSERT INTO schema_migrations(version) VALUES(31)').run();
}
export function traitChoiceCatalogue(db){
 return rows(db,'SELECT e.*,COALESCE(r.nombre,d.nombre) fuente FROM elecciones_rasgos e LEFT JOIN rasgos r ON r.id=e.rasgo_id LEFT JOIN dotes d ON d.id=e.dote_id').map(e=>{
  let opciones=[];
  if(e.tipo==='Marcial')opciones=rows(db,`SELECT DISTINCT d.id,d.nombre,d.descripcion FROM dotes d LEFT JOIN dotes_tags t ON t.dote_id=d.id LEFT JOIN rasgos r ON r.id=t.rasgo_id WHERE (d.tipo='Marcial' OR r.nombre='Marcial') AND d.condicion_especial=0 AND d.solo_concesion_inicial=0 AND d.solo_concesion_senda=0`);
  if(e.tipo==='Herramienta')opciones=toolNames.map(nombre=>({id:nombre,nombre,descripcion:casterToolDescription(db,nombre)??''}));
  if(e.tipo==='Epifania'){
   opciones=rows(db,'SELECT id,nombre,descripcion FROM epifanias');
   for(const nombre of ['Memento Mori','Sintonía con la Llama','Emaptomancia','Telekinesis','Virtud Anima','Primera Paradoja','Eyes for the Ages / Ojos para las Eras']){
    const implemented=opciones.find(o=>o.nombre===nombre);
    if(implemented){implemented.referencia_id=implemented.id;implemented.id='pendiente:'+nombre;}
    else opciones.push({id:'pendiente:'+nombre,nombre,descripcion:'Epifanía del catálogo inicial. Su repertorio se incorporará cuando esté definido para la campaña.'});
   }
  }
  if(e.tipo==='Artefacto'){
   const demo=rows(db,'PRAGMA table_info(artefactos_arcanos)').some(c=>c.name==='demo');
   opciones=rows(db,'SELECT id,nombre,descripcion FROM artefactos_arcanos'+(demo?' WHERE demo=1':'')).map(a=>({...a,referencia_id:a.id,id:a.nombre}));
   if(!demo)for(const [nombre,descripcion] of artifacts)if(!opciones.some(o=>o.nombre===nombre))opciones.push({id:nombre,nombre,descripcion:descripcion+' PL, cargas y recarga pendientes de definición.'});
  }
  return {...e,opciones};
 });
}
export function traitChoiceState(db,p){
 const definitions=traitChoiceCatalogue(db),traits=new Set(p.rasgos.map(r=>r.id)),feats=new Set(p.adquisiciones.filter(a=>a.dote_id).map(a=>a.dote_id));
 const valor=p.sendas.find(s=>s.nombre==='Senda del Valor');
 const xp=valor?one(db,`SELECT COALESCE(SUM(pr.xp_gastada),0) n FROM progresion pr JOIN dotes d ON d.id=pr.dote_id WHERE pr.personaje_id=? AND (d.clase_id=? OR EXISTS(SELECT 1 FROM dotes_tags dt JOIN rasgos r ON r.id=dt.rasgo_id WHERE dt.dote_id=d.id AND r.nombre='Valor'))`,p.id,valor.id).n:0;
 const puntos=Math.floor(xp/3);
 const saved=rows(db,'SELECT codigo,valor FROM personajes_elecciones_rasgos WHERE personaje_id=?',p.id);
 return definitions.filter(e=>e.tipo==='As'?Boolean(valor):traits.has(e.rasgo_id)||feats.has(e.dote_id)).map(e=>{
  const valor=JSON.parse(saved.find(s=>s.codigo===e.codigo)?.valor??'null');
  if(e.tipo==='As')return {...e,valor,puntos,xp,opciones:p.skills.filter(s=>s.tipo==='Habilidad'&&s.combate&&['Melee','Proyectiles'].includes(p.skills.find(a=>a.id===s.padre_id)?.nombre)&&s.valor>=80).map(s=>({id:s.id,nombre:s.nombre,porcentaje:s.valor})),asignados:(valor??[]).reduce((sum,a)=>sum+a.puntos,0)};
  return {...e,valor,opciones:e.opciones.map(o=>({...o,bloqueada:e.tipo==='Marcial'&&(!p.dotes_disponibles.some(d=>d.id===o.id&&!d.poseido&&!d.requisitos.length))}))};
 });
}
export function recordTraitChoice(db,p,{codigo,valor},grant){
 const choice=p.elecciones_rasgos.find(e=>e.codigo===codigo);if(!choice)fail('Esta elección no está disponible para el personaje');
 if(choice.tipo==='As'){
  if(!Array.isArray(valor)||!valor.length)fail('Asigná al menos un punto de As');
  const old=choice.valor??[],ids=new Set();let total=0;
  for(const a of valor){if(!Number.isSafeInteger(a.skill_id)||ids.has(a.skill_id)||!Number.isSafeInteger(a.puntos)||a.puntos<1||a.puntos>5)fail('Asignación de As inválida');ids.add(a.skill_id);total+=a.puntos;
   const prev=old.find(v=>v.skill_id===a.skill_id)?.puntos??0;
   if(a.puntos<prev)fail('Los puntos ya asignados se conservan');
   if(a.puntos>prev&&!choice.opciones.some(o=>o.id===a.skill_id))fail('La habilidad marcial debe alcanzar 80%');
  }
  if(old.some(a=>!ids.has(a.skill_id))||total>choice.puntos)fail('Puntos de As no disponibles');
 }else{
  if(choice.valor!==null){if(choice.valor===valor)return;fail('Esta elección ya está registrada');}
  const option=choice.opciones.find(o=>o.id===valor);if(!option)fail(choice.titulo);
  if(choice.tipo==='Marcial'){
   const available=p.dotes_disponibles.find(d=>d.id===valor);if(!available||available.poseido||available.requisitos.length)fail('El Dote Marcial tiene requisitos pendientes o ya está adquirido');
   grant({tipo:'Adquisicion',dote_id:valor,origen:choice.fuente});
  }
  const epiphanyId=option.referencia_id??(Number.isSafeInteger(valor)?valor:null);
  if(choice.tipo==='Epifania'&&epiphanyId&&!p.adquisiciones.some(a=>a.epifania_id===epiphanyId))grant({tipo:'Adquisicion',epifania_id:epiphanyId,origen:choice.fuente});
  if(choice.tipo==='Artefacto'&&option.referencia_id)addInventory(db,p.id,{artefacto_id:option.referencia_id});
 }
 db.prepare('INSERT INTO personajes_elecciones_rasgos VALUES(?,?,?) ON CONFLICT(personaje_id,codigo) DO UPDATE SET valor=excluded.valor').run(p.id,codigo,JSON.stringify(valor));
}
