import {ensureOrders,orderCatalogue,validateOrderCreation,recordOrderCreation,orderState,oathState,saveOath} from './orders.mjs';
import {purchase,assignGear,finishEquipment} from './market.mjs';
import {migrateInitialEpiphanies} from './epiphanies.mjs';
import {migrateEyesForTheAges} from './eyes-for-the-ages.mjs';
import {migrateArtifacts,useArtifact} from './artifacts.mjs';
import {migrateCasterTools,casterToolState} from './caster-tools.mjs';
import {listenLocal} from './startup.mjs';
import {NPC_ROOT,initNPCs,loadNPCs,readLinks,writeLink,writeNPC,npcGroups,createGroup,changeGroup,playerCompanions,npcRoll,dmAuthorized,localDMToken} from './npcs.mjs';
import {migrateTraitChoices,traitChoiceCatalogue,traitChoiceState,recordTraitChoice} from './trait-choices.mjs';
import {markTraining,train,trainingState} from './training.mjs';
import {updateGenericActions} from './rulebook.mjs';
import {synchronizeCore,referenceCatalogue} from './core-sync.mjs';
import {unmark} from '../js/reference-format.js';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, writeFileSync, readdirSync, existsSync, copyFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, resolve, extname, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { randomInt, randomUUID } from 'node:crypto';
import { FIXED_VALUES, ATTRIBUTE_ORDER, sameValues, qualifiesForMulligan, rollValues, creationSkills } from '../js/creation-rules.js';
import {migrateEquipment,migrateArmorProfiles,equipmentCatalogue,inventoryRows,equipmentSummary,addInventory,changeInventory,customItem} from './equipment.mjs';
import {damagePreview,chronicIncrease,ZONAS,FUENTES,MEDIOS} from '../js/combat-rules.js';
import {checkSpend,spendResource,skillRoll,spellOperation,magicState,useTrick} from './magic.mjs';
import {canWeave} from '../js/magic-rules.js';
import {migrateLineages,grantLineage,applyLineage,initialLineageXP} from './lineages.mjs';
import {lineageBonuses} from '../js/lineage-rules.js';
import {migratePaths,reconcilePaths,migrateValor,migrateSombra,migrateBerserker} from './paths.mjs';
import {migrateBackground,validateBackground} from './background.mjs';
import {migrateTraits,reconcileOriginTraitGrants,createTrait,activeTraits} from './traits.mjs';
import {creationTraitModifiers,runtimeTraitSkills} from '../js/trait-rules.js';
import {migrateOrigins,validateOriginAnswers} from './origins.mjs';
import {migrateOriginTraits} from './origin-traits.mjs';
import {migratePathTraits,linkPathTrait} from './path-traits.mjs';
import {migrateDevotion,pathQuestions,validateCreationChoices,recordPathChoice,characterPrayers} from './path-choices.mjs';
import {migrateCharacterAccess,issueCharacterToken,identifyCharacter,bearerToken,catalogueAdmin} from './access.mjs';
import {selectedProfession,professionGuarantees} from '../js/profession-rules.js';

const SQL = dirname(fileURLToPath(import.meta.url));
export const BASE = resolve(SQL, '..');
const fail = message => { throw new Error(message); };
const integer = (v, min=0, max=Number.MAX_SAFE_INTEGER) => {
  if (!Number.isSafeInteger(v) || v<min || v>max) fail('Valor numérico inválido'); return v;
};
export function transaction(db, fn) { db.exec('BEGIN IMMEDIATE'); try { const result=fn(); db.exec('COMMIT'); return result; } catch(e) { db.exec('ROLLBACK'); throw e; } }
export const rows = (db, sql, ...args) => db.prepare(sql).all(...args);
const one = (db, sql, ...args) => db.prepare(sql).get(...args);
const run = (db, sql, ...args) => db.prepare(sql).run(...args);
const get = (db,t,id) => one(db,`SELECT * FROM ${t} WHERE id=?`,id);
const insert = (db,t,values) => Number(run(db,`INSERT INTO ${t} (${Object.keys(values).join(',')}) VALUES (${Object.keys(values).map(()=>'?').join(',')})`,...Object.values(values)).lastInsertRowid);

export function openDatabase(path=resolve(SQL,'gideon_companion.db')) {
  if (path!==':memory:' && existsSync(path)) {
    const check=new DatabaseSync(path); const migrated=one(check,"SELECT name FROM sqlite_master WHERE name='schema_migrations'");check.close();
    if(!migrated) copyFileSync(path,path+'.before-progression.bak');
  }
  const db=new DatabaseSync(path);db.exec('PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
  db.exec(readFileSync(resolve(SQL,'schema.sql'),'utf8'));
  db.exec('CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, fecha TEXT DEFAULT CURRENT_TIMESTAMP)');
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=1')) transaction(db,()=>{
    // No se transforma silenciosamente una ficha previa al nuevo modelo.
    if(one(db,'SELECT COUNT(*) n FROM personajes').n) fail('La base contiene personajes anteriores: requiere migración de sus fichas antes de continuar. Se conservó una copia de seguridad.');
    db.exec(readFileSync(resolve(SQL,'migrations/001_progression.sql'),'utf8'));run(db,'INSERT INTO schema_migrations(version) VALUES(1)');
    seed(db);
  });
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=2'))transaction(db,()=>{
    db.exec(readFileSync(resolve(SQL,'migrations/002_initial_skills.sql'),'utf8'));
    run(db,'INSERT OR IGNORE INTO personajes_skills(personaje_id,skill_id,valor_base) SELECT pc.personaje_id,cs.skill_id,cs.valor_inicial FROM personajes_clases pc JOIN clases_skills cs ON cs.clase_id=pc.clase_id');
    run(db,'INSERT INTO schema_migrations(version) VALUES(2)');
  });
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=3'))transaction(db,()=>{
    db.exec(readFileSync(resolve(SQL,'migrations/003_creation_rolls.sql'),'utf8'));
    run(db,'INSERT INTO schema_migrations(version) VALUES(3)');
  });
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=4')){
    if(path!==':memory:')copyFileSync(path,path+'.before-inventory.bak');
    migrateEquipment(db);
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=5'))transaction(db,()=>{
    db.exec(readFileSync(resolve(SQL,'migrations/005_damage.sql'),'utf8'));run(db,'INSERT INTO schema_migrations(version) VALUES(5)');
  });
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=6')){
    if(path!==':memory:')copyFileSync(path,path+'.before-armor-profiles.bak');
    migrateArmorProfiles(db);
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=7')){
    if(path!==':memory:')copyFileSync(path,path+'.before-spellcasting.bak');
    transaction(db,()=>{db.exec(readFileSync(resolve(SQL,'migrations/007_spellcasting.sql'),'utf8'));run(db,'INSERT INTO schema_migrations(version) VALUES(7)');});
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=8')){
    if(path!==':memory:')copyFileSync(path,path+'.before-scalable-pl.bak');
    transaction(db,()=>{db.exec(readFileSync(resolve(SQL,'migrations/008_scalable_pl_rest.sql'),'utf8'));run(db,'INSERT INTO schema_migrations(version) VALUES(8)');});
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=9')){
    if(path!==':memory:')copyFileSync(path,path+'.before-component-descriptions.bak');
    transaction(db,()=>{db.exec(readFileSync(resolve(SQL,'migrations/009_component_descriptions.sql'),'utf8'));run(db,'INSERT INTO schema_migrations(version) VALUES(9)');});
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=10')){
    if(path!==':memory:')copyFileSync(path,path+'.before-lineages.bak');
    transaction(db,()=>migrateLineages(db));
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=11')){
    if(path!==':memory:')copyFileSync(path,path+'.before-paths.bak');
    transaction(db,()=>migratePaths(db));
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=12')){
    if(path!==':memory:')copyFileSync(path,path+'.before-background.bak');
    transaction(db,()=>migrateBackground(db));
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=13')){
    if(path!==':memory:')copyFileSync(path,path+'.before-traits.bak');
    transaction(db,()=>migrateTraits(db));
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=14')){
    if(path!==':memory:')copyFileSync(path,path+'.before-origins.bak');
    transaction(db,()=>migrateOrigins(db));
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=15')){
    if(path!==':memory:')copyFileSync(path,path+'.before-origin-traits.bak');
    transaction(db,()=>migrateOriginTraits(db));
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=16')){
    if(path!==':memory:')copyFileSync(path,path+'.before-path-traits.bak');
    transaction(db,()=>migratePathTraits(db));
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=17')){
    if(path!==':memory:')copyFileSync(path,path+'.before-automatic-path-traits.bak');
    transaction(db,()=>{db.exec(readFileSync(resolve(SQL,'migrations/017_automatic_path_traits.sql'),'utf8'));run(db,'INSERT INTO schema_migrations(version) VALUES(17)');});
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=18')){
    if(path!==':memory:')copyFileSync(path,path+'.before-character-access.bak');
    transaction(db,()=>{
      const initial=migrateCharacterAccess(db);
      if(path!==':memory:'&&initial.length){const initialFile=path+'.initial-character-tokens'+(existsSync(path+'.initial-character-tokens.json')?'-'+randomUUID():'')+'.json';writeFileSync(initialFile,JSON.stringify(initial,null,2),{mode:0o600,flag:'wx'});}
    });
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=19')){
    if(path!==':memory:')copyFileSync(path,path+'.before-devotion.bak');
    transaction(db,()=>migrateDevotion(db));
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=20')){
    if(path!==':memory:')copyFileSync(path,path+'.before-valor.bak');
    transaction(db,()=>migrateValor(db));
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=21')){
    transaction(db,()=>migrateRiposte(db));
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=22')){
    transaction(db,()=>migrateRiposteUseRequirement(db));
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=23')){
    transaction(db,()=>migrateSombra(db));
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=24'))transaction(db,()=>{
    db.exec(readFileSync(resolve(SQL,'migrations/024_reglas_activas.sql'),'utf8'));
    updateGenericActions(db);
    const dual=elements(xml('Dotes/dotes.xml'),'dote').find(d=>d.a.id==='golpe_dual');
    for(const table of ['acciones','dotes'])run(db,`UPDATE ${table} SET descripcion=? WHERE nombre='Golpe Dual'`,text(dual.body,'descripcion'));
    const equipped=rows(db,'SELECT DISTINCT personaje_id FROM inventario WHERE equipado=1');
    for(const {personaje_id} of equipped){
      const weapons=inventoryRows(db,personaje_id).filter(i=>i.equipado&&i.arma);
      weapons.forEach((item,index)=>run(db,'UPDATE inventario SET mano=? WHERE id=?',index===0?'Principal':'Secundaria',item.id));
    }
    for(const {id,heridas_graves} of rows(db,'SELECT id,heridas_graves FROM personajes WHERE heridas_graves>0')){
      const block=character(db,id).derivados.mh*heridas_graves/4;
      run(db,'UPDATE personajes SET bloque_grave=?,heridas_actuales=MAX(heridas_actuales,?) WHERE id=?',block,block,id);
    }
    run(db,'INSERT INTO schema_migrations(version) VALUES(24)');
  });
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=25'))transaction(db,()=>{
    db.exec(readFileSync(resolve(SQL,'migrations/025_equipment_prices.sql'),'utf8'));
    run(db,'INSERT INTO schema_migrations(version) VALUES(25)');
  });
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=26'))transaction(db,()=>{
    db.exec(readFileSync(resolve(SQL,'migrations/026_armor_bases.sql'),'utf8'));
    run(db,'INSERT INTO schema_migrations(version) VALUES(26)');
  });
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=27'))transaction(db,()=>{
    db.exec(readFileSync(resolve(SQL,'migrations/027_shields.sql'),'utf8'));
    run(db,'INSERT INTO schema_migrations(version) VALUES(27)');
  });
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=28'))transaction(db,()=>{
    db.exec(readFileSync(resolve(SQL,'migrations/028_shield_prices.sql'),'utf8'));
    run(db,'INSERT INTO schema_migrations(version) VALUES(28)');
  });
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=29'))transaction(db,()=>{
    db.exec(readFileSync(resolve(SQL,'migrations/029_market_inventory.sql'),'utf8'));
    run(db,'INSERT INTO schema_migrations(version) VALUES(29)');
  });
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=30'))transaction(db,()=>{
    db.exec(readFileSync(resolve(SQL,'migrations/030_weapon_reference_weights.sql'),'utf8'));
    run(db,'INSERT INTO schema_migrations(version) VALUES(30)');
  });
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=31')){
    if(path!==':memory:')copyFileSync(path,path+'.before-trait-choices.bak');
    transaction(db,()=>migrateTraitChoices(db));
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=32')){
    if(path!==':memory:')copyFileSync(path,path+'.before-travel-sword.bak');
    transaction(db,()=>{db.exec(readFileSync(resolve(SQL,'migrations/032_travel_sword.sql'),'utf8'));run(db,'INSERT INTO schema_migrations(version) VALUES(32)');});
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=33')){
    if(path!==':memory:')copyFileSync(path,path+'.before-agile-swift.bak');
    transaction(db,()=>{db.exec(readFileSync(resolve(SQL,'migrations/033_agile_swift.sql'),'utf8'));run(db,'INSERT INTO schema_migrations(version) VALUES(33)');});
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=34')){
    if(path!==':memory:'){
      const base=path+'.before-initial-epiphanies.bak',backup=existsSync(base)?path+'.before-initial-epiphanies-'+Date.now()+'.bak':base;
      db.prepare('VACUUM INTO ?').run(backup);
    }
    transaction(db,()=>migrateInitialEpiphanies(db));
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=35')){
    if(path!==':memory:'){
      const base=path+'.before-eyes-for-the-ages.bak',backup=existsSync(base)?path+'.before-eyes-for-the-ages-'+Date.now()+'.bak':base;
      db.prepare('VACUUM INTO ?').run(backup);
    }
    transaction(db,()=>migrateEyesForTheAges(db));
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=36')){
    if(path!==':memory:'){
      const base=path+'.before-arcane-artifacts.bak',backup=existsSync(base)?path+'.before-arcane-artifacts-'+Date.now()+'.bak':base;
      db.prepare('VACUUM INTO ?').run(backup);
    }
    transaction(db,()=>migrateArtifacts(db));
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=37')){
    if(path!==':memory:'){
      const base=path+'.before-caster-tools-units.bak',backup=existsSync(base)?path+'.before-caster-tools-units-'+Date.now()+'.bak':base;
      db.prepare('VACUUM INTO ?').run(backup);
    }
    transaction(db,()=>migrateCasterTools(db));
  }
  if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=38')){
    if(path!==':memory:'){
      const base=path+'.before-projectile-shape.bak',backup=existsSync(base)?path+'.before-projectile-shape-'+Date.now()+'.bak':base;
      db.prepare('VACUUM INTO ?').run(backup);
    }
    transaction(db,()=>db.exec(readFileSync(resolve(SQL,'migrations/038_projectile_shape.sql'),'utf8')));
  }
  if(path!==':memory:' && !one(db,'SELECT 1 FROM schema_migrations WHERE version=39')){
    const backup=path+'.before-core-references.bak';
    if(!existsSync(backup)) db.prepare('VACUUM INTO ?').run(backup);
  }
  transaction(db,()=>{
    if(!one(db,'SELECT 1 FROM schema_migrations WHERE version=40'))migrateBerserker(db);
    ensureOrders(db);
    synchronizeCore(db);
  });
  return db;
}

export function creationRoll(db,body,d4=()=>randomInt(1,5)){
 let state;
 if(body.tirada_id){
   const saved=one(db,'SELECT * FROM creacion_tiradas WHERE id=?',body.tirada_id);
   if(!saved||saved.personaje_id)fail('La tirada no existe o ya fue utilizada');
   state=JSON.parse(saved.estado);
   if(body.accion==='Mulligan'){
     if(state.modo!=='Ordenado'||state.mulligan_usado||!qualifiesForMulligan(state.valores))fail('Esta tirada no cumple las tres condiciones del Mulligan');
     state.modo='Libre';state.mulligan_usado=true;
   }else if(body.accion==='Repetir'){
     if(state.modo==='Ordenado')fail('El orden estricto no admite repetir sin un Mulligan válido');
     state.dados=Array.from({length:10},()=>Array.from({length:3},()=>d4()));state.valores=rollValues(state.dados);state.historial.push(state.dados);
   }else fail('Operación de tirada inválida');
   run(db,'UPDATE creacion_tiradas SET estado=? WHERE id=?',JSON.stringify(state),state.id);
 }else{
   if(!['Libre','Ordenado'].includes(body.modo))fail('Elige tirada libre o en orden estricto');
   const dice=Array.from({length:10},()=>Array.from({length:3},()=>d4()));
   state={id:randomUUID(),modo:body.modo,dados:dice,valores:rollValues(dice),historial:[dice],mulligan_usado:false};
   run(db,'INSERT INTO creacion_tiradas(id,estado) VALUES(?,?)',state.id,JSON.stringify(state));
 }
 return {...state,puede_mulligan:state.modo==='Ordenado'&&!state.mulligan_usado&&qualifiesForMulligan(state.valores),xp_inicial:state.modo==='Ordenado'&&!state.mulligan_usado?2:1};
}

// Importador acotado al formato de los XML locales, sin dependencias externas.
const decode = s => s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'");
const text = (s,tag, fallback='') => decode(s.match(new RegExp('<'+tag+'(?:\\s[^>]*)?>([\\s\\S]*?)</'+tag+'>'))?.[1]?.trim()??fallback);
const attrs = s => Object.fromEntries([...s.matchAll(/([\w_]+)="([^"]*)"/g)].map(m=>[m[1],decode(m[2])]));
const elements = (s,tag) => [...s.matchAll(new RegExp('<'+tag+'\\b([^>]*?)(?:/>|>([\\s\\S]*?)</'+tag+'>)','g'))].map(m=>({a:attrs(m[1]),body:m[2]||''}));
const xml = path => readFileSync(resolve(BASE,'content',path),'utf8').replace(/<!--[\s\S]*?-->/g,'');
const code = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
const TREE={Fuerza:['Carga','Escalar','Saltar','Firmeza','Atletismo'],Vitalidad:['Cardio','Resistir','Metabolismo'],Agilidad:['Sigilo','Acrobacias','Prestidigitación','Evasión','Montar'],Instinto:['Percepción','Detectar Intenciones','Orientación','Adaptación','Manejo Animal'],Voluntad:['Tenacidad','Coraje','Enfoque','Fe','Templanza'],Inteligencia:['Historia','Medicina','Naturaleza','Mecánica','Física','Química','Conocimiento Mágico'],'Carácter':['Elocuencia','Liderazgo','Coacción','Engañar','Entretener'],Melee:['Una Mano','A Dos Manos','Armas Dobles','Bloqueo','Paradas','Desarmado'],Proyectiles:['Arcos','Ballestas','Armas de Fuego','Asedio','Arrojar'],Arcana:['Yrgrammar','Naial','Cronibor','Ivganny','Ignamor','Gelmir']};
function migrateRiposte(db) {
  const entry=elements(xml('Dotes/dotes.xml'),'dote').find(dote=>dote.a.id==='riposte');
  const nombre=text(entry.body,'nombre');
  const tipo=text(entry.body,'tipo');
  const descripcion=text(entry.body,'descripcion');
  const costoXp=integer(Number(text(entry.body,'costo_xp')),1);
  run(db,`INSERT INTO dotes(nombre,tipo,costo_xp,descripcion) VALUES(?,?,?,?)
    ON CONFLICT(nombre) DO UPDATE SET tipo=excluded.tipo,costo_xp=excluded.costo_xp,
    descripcion=excluded.descripcion,clase_id=NULL,es_exclusivo_clase=0,xp_clase_requerida=0`,
    nombre,tipo,costoXp,descripcion);
  const doteId=one(db,'SELECT id FROM dotes WHERE nombre=?',nombre).id;
  run(db,`INSERT INTO acciones(nombre,tipo,nro_acciones_pa,es_reaccion,descripcion) VALUES(?,'Dote',0,1,?)
    ON CONFLICT(nombre) DO UPDATE SET tipo='Dote',nro_acciones_pa=0,es_reaccion=1,
    coste_stamina=0,descripcion=excluded.descripcion`,nombre,descripcion);
  const actionId=one(db,'SELECT id FROM acciones WHERE nombre=?',nombre).id;
  run(db,"INSERT OR IGNORE INTO rasgos(nombre,tipo,descripcion) VALUES('Marcial','Etiqueta','Dote de combate')");
  const tagId=one(db,"SELECT id FROM rasgos WHERE nombre='Marcial' AND tipo='Etiqueta'").id;
  run(db,'INSERT OR IGNORE INTO dotes_tags VALUES(?,?)',doteId,tagId);
  run(db,'INSERT OR IGNORE INTO dotes_acciones VALUES(?,?)',doteId,actionId);
  const source='20_Contenido/Core_15_Talentos_y_Dotes.md §15.2.bis';
  run(db,'INSERT OR REPLACE INTO contenido_fuentes VALUES(?,?,?,0)','dotes',doteId,source);
  run(db,'INSERT OR REPLACE INTO contenido_fuentes VALUES(?,?,?,0)','acciones',actionId,source);
  run(db,'INSERT INTO schema_migrations(version) VALUES(21)');
}
function migrateRiposteUseRequirement(db) {
  const entry=elements(xml('Dotes/dotes.xml'),'dote').find(dote=>dote.a.id==='riposte');
  const {habilidad,minimo}=elements(entry.body,'requisito_uso')[0].a;
  const skill=one(db,'SELECT id FROM all_skills WHERE nombre=?',habilidad);
  const description=text(entry.body,'descripcion');
  db.exec(`ALTER TABLE acciones ADD COLUMN skill_uso_id INTEGER REFERENCES all_skills(id);
    ALTER TABLE acciones ADD COLUMN skill_uso_minimo INTEGER
      CHECK((skill_uso_id IS NULL AND skill_uso_minimo IS NULL)
        OR (skill_uso_id IS NOT NULL AND skill_uso_minimo IS NOT NULL AND skill_uso_minimo BETWEEN 1 AND 99));`);
  run(db,'UPDATE acciones SET skill_uso_id=?,skill_uso_minimo=?,descripcion=? WHERE nombre=?',
    skill.id,integer(Number(minimo),1,99),description,'Riposte');
  run(db,'UPDATE dotes SET descripcion=? WHERE nombre=?',description,'Riposte');
  run(db,'INSERT INTO schema_migrations(version) VALUES(22)');
}
function seed(db) {
  const sourced=(table,id,source)=>run(db,'INSERT OR REPLACE INTO contenido_fuentes VALUES(?,?,?,1)',table,id,source);
  const entity=(table,values,source)=>{let existing=one(db,`SELECT id FROM ${table} WHERE nombre=?`,values.nombre);let id=existing?.id??insert(db,table,values);sourced(table,id,source);return id;};
  const skill=(name,type='Extra',parent=null,combat=0)=>one(db,'SELECT id FROM all_skills WHERE nombre=?',name)?.id??insert(db,'all_skills',{codigo:code(name),nombre:name,tipo:type,padre_id:parent,combate:combat});
  for(const [name,children] of Object.entries(TREE)){let combat=['Melee','Proyectiles','Arcana'].includes(name)?1:0;let id=skill(name,'Atributo',null,combat);children.forEach(n=>skill(n,'Habilidad',id,combat));}
  skill('Cerrajería');skill('Bibliotecas');skill('Dual Wielding');const honor=skill('Honor','Especial');run(db,"UPDATE all_skills SET modo_progresion='Narrador' WHERE id=?",honor);
  for(const file of readdirSync(resolve(BASE,'content/Linajes')).filter(f=>f.endsWith('.xml'))){let src='Linajes/'+file,s=xml(src);let id=entity('linajes',{nombre:text(s,'nombre'),especie:text(s,'especie','Dríade'),escalado_vital:Number(text(s,'escalado_vital','2')),descripcion:text(s,'descripcion')},src);for(const b of elements(s,'bono'))run(db,'INSERT OR IGNORE INTO linajes_skills VALUES(?,?,?)',id,skill(b.a.habilidad),Number(b.a.valor));}
  for(const file of readdirSync(resolve(BASE,'content/Sendas')).filter(f=>f.endsWith('.xml'))){let src='Sendas/'+file,s=xml(src),name=text(s,'nombre');let id=entity('clases',{nombre:name,dado_senda_inicial:text(s,'dado_senda_inicial','1d4'),descripcion:text(s,'descripcion')},src);let tag=entity('rasgos',{nombre:name.replace(/^Senda (del |de la |de )/,''),descripcion:'Etiqueta de senda'},src);run(db,'INSERT OR IGNORE INTO clases_tags VALUES(?,?)',id,tag);}
  for(const file of readdirSync(resolve(BASE,'content/Dedicaciones')).filter(f=>f.endsWith('.xml'))){let src='Dedicaciones/'+file,s=xml(src);let id=entity('dedicaciones',{nombre:text(s,'nombre'),descripcion:text(s,'descripcion')},src);for(const sk of elements(s,'skill'))run(db,'INSERT OR IGNORE INTO dedicaciones_skills VALUES(?,?,?,5)',id,skill(sk.a.nombre),Number(sk.a.minimo));}
  for(const n of elements(xml('Origenes/nacimientos.xml'),'nacimiento'))entity('nacimientos',{nombre:text(n.body,'nombre'),rango_d100_min:Number(n.a.rango_min),rango_d100_max:Number(n.a.rango_max),descripcion:text(n.body,'descripcion')},'Origenes/nacimientos.xml');
  for(const [src,tag,type] of [['Regalos/regalos.xml','regalo','Regalo'],['Perjuicios/perjuicios.xml','perjuicio','Perjuicio']])for(const n of elements(xml(src),tag))entity('regalos_perjuicios',{nombre:text(n.body,'nombre'),tipo:type,efecto_mecanico:text(n.body,'efecto'),descripcion:text(n.body,'efecto')},src);
  for(const n of elements(xml('Dotes/dotes.xml'),'dote'))entity('dotes',{nombre:text(n.body,'nombre'),tipo:text(n.body,'tipo'),descripcion:text(n.body,'descripcion')},'Dotes/dotes.xml');
  const arcanista=one(db,"SELECT id FROM clases WHERE nombre LIKE '%Arcanista%'").id;
  const action=(name,type,pa,description,stamina=0)=>entity('acciones',{nombre:name,tipo:type,nro_acciones_pa:pa,coste_stamina:stamina,descripcion:description},'Ejemplo de interfaz');
  action('Moverse','Generica',1,'Desplázate según tu velocidad.');action('Golpear','Generica',1,'Realiza un ataque cuerpo a cuerpo.');action('Disparar','Generica',1,'Realiza un ataque a distancia.');action('Defensa reactiva','Reaccion',0,'Consulta los requisitos de la reacción defensiva.');
  const combo=action('Golpe Dual','Dote',2,text(elements(xml('Dotes/dotes.xml'),'dote')[0].body,'descripcion'),1);
  const dual=one(db,"SELECT id FROM dotes WHERE nombre='Golpe Dual'").id,dwe=one(db,"SELECT id FROM dotes WHERE nombre='Dual Wielding Enthusiast'").id;
  run(db,'INSERT INTO dotes_acciones VALUES(?,?)',dual,combo);insert(db,'requisitos_dotes',{dote_id:dual,dote_requerido_id:dwe});insert(db,'requisitos_dotes',{dote_id:dual,skill_id:skill('Dual Wielding'),valor_minimo:85});insert(db,'requisitos_dotes',{dote_id:dwe,skill_id:skill('Dual Wielding'),valor_minimo:50});
  const caster=entity('dotes',{nombre:'Lanzador de Conjuros',descripcion:'Acceso al repertorio de epifanías y a Spellweave.',clase_id:arcanista},'Core: insignia de Arcanista');
  const weave=action('Spellweave','Dote',2,'Utiliza los componentes desbloqueados por tus epifanías.');run(db,"UPDATE acciones SET tipo='Dote' WHERE id=?",weave);run(db,'INSERT INTO dotes_acciones VALUES(?,?)',caster,weave);run(db,'INSERT INTO clases_dotes VALUES(?,?)',arcanista,caster);
  const vm=entity('dotes',{nombre:'Vigoris Mortis',clase_id:arcanista,costo_xp:2,permite_inversion_adicional:1,descripcion:'Adquisición: 2 XP. Permite inversiones adicionales de 2 XP hasta 10 XP totales (nivel 5). Redirige daño físico a maná según su nivel. El efecto se consulta en texto; no se aplica automáticamente.'},'Core: Arcanista_02 / ejemplo de inversión');insert(db,'requisitos_dotes',{dote_id:vm,skill_id:skill('Yrgrammar'),valor_minimo:50});
  const hidden=entity('dotes',{nombre:'Pacto del archivo — ejemplo',descripcion:'Ejemplo narrativo; no es contenido canonizado.',condicion_especial:1,descripcion_condicion_especial:'El narrador debe permitir este descubrimiento.'},'Dummy');
  const ep=entity('epifanias',{nombre:'Evocación Básica',escuela:'Ignamor',clase_id:arcanista,descripcion:'Ejemplo basado en el placeholder XML; desbloquea componentes de demostración.'},'Epifanias/placeholder.xml');
  const effect=entity('efectos',{nombre:'Llama — ejemplo',escuela:'Ignamor',categoria:'Ataque Mágico',propagacion:'Evocado',descripcion:'Efecto de demostración para el repertorio.'},'Dummy');
  const medium=entity('mediums',{nombre:'Punto visible — ejemplo',coste_pl:1,reach:'10 + 5 × PL'},'Dummy');const shape=entity('shapes',{nombre:'Proyectil — ejemplo',area:'1 objetivo'},'Dummy');
  run(db,'INSERT INTO epifanias_efectos VALUES(?,?)',ep,effect);run(db,'INSERT INTO epifanias_mediums VALUES(?,?)',ep,medium);run(db,'INSERT INTO epifanias_shapes VALUES(?,?)',ep,shape);
  entity('items_magicos',{nombre:'Amuleto del aprendiz — ejemplo',descripcion:'Ítem de demostración. Su inversión se registra por ejemplar.',clase_id:arcanista,permite_inversion_adicional:1},'Dummy');
  // Primer personaje para explorar la interfaz sin completar el wizard.
  const catalog=catalogue(db);const attr=Object.fromEntries(catalog.skills.filter(s=>s.tipo==='Atributo').map(s=>[s.id,s.nombre==='Arcana'?50:40]));
  const demo=createCharacter(db,{nombre:'Nerea — personaje de ejemplo',linaje_id:catalog.linajes[0].id,clase_id:arcanista,dedicacion_id:catalog.dedicaciones[0].id,nacimiento_id:catalog.nacimientos[0].id,atributos:attr,modo_campana:'sandbox',demo:true},true);
  run(db,'UPDATE personajes SET xp_total=20 WHERE id=?',demo.id);
  addProgress(db,demo.id,{tipo:'Adquisicion',epifania_id:ep});addProgress(db,demo.id,{tipo:'Adquisicion',dote_id:vm});addProgress(db,demo.id,{tipo:'Inversion',dote_id:vm,xp_gastada:2});
  const item=one(db,"SELECT id FROM items_magicos WHERE nombre='Amuleto del aprendiz — ejemplo'").id;const instance=insert(db,'inventario',{personaje_id:demo.id,item_magico_id:item,equipado:1});addProgress(db,demo.id,{tipo:'Adquisicion',item_id:instance});
}

export function catalogue(db) {
  const tables=['linajes','clases','dedicaciones','nacimientos','regalos_perjuicios','dotes','epifanias','items_magicos','rasgos','requisitos_dotes','linajes_skills','dedicaciones_skills'];
  const result=Object.fromEntries(tables.map(t=>[t,rows(db,`SELECT * FROM ${t}`)]));result.skills=rows(db,"SELECT * FROM all_skills WHERE nombre NOT IN ('CombatSkillPlaceholder','ProyectilesPlaceholder')");result.ejemplos=rows(db,'SELECT * FROM contenido_fuentes');
  // Los dotes secretos se ofrecen solamente desde una ficha autorizada.
  result.dotes_narrador=result.dotes.filter(d=>d.condicion_especial);
  result.dotes=result.dotes.filter(d=>!d.condicion_especial);
  if(one(db,"SELECT name FROM sqlite_master WHERE name='equipo_defensas'"))Object.assign(result,equipmentCatalogue(db));
  if(one(db,"SELECT name FROM sqlite_master WHERE name='dotes_efectos'"))for(const table of ['linajes_dotes','dotes_efectos','linajes_elecciones','linajes_elecciones_opciones','linajes_equipo_inicial'])result[table]=rows(db,`SELECT * FROM ${table}`);
  result.clases=result.clases.filter(c=>c.disponible_demo!==0);
  if(one(db,"SELECT name FROM sqlite_master WHERE name='clases_origen'"))for(const table of ['clases_rasgos','clases_dotes','clases_origen'])result[table]=rows(db,`SELECT * FROM ${table}`);
  if(one(db,"SELECT name FROM sqlite_master WHERE name='dedicaciones_preguntas'"))result.dedicaciones_preguntas=rows(db,'SELECT * FROM dedicaciones_preguntas ORDER BY dedicacion_id,numero');
  if(one(db,"SELECT name FROM sqlite_master WHERE name='rasgos_modificadores'"))for(const table of ['rasgos_modificadores','rasgos_acciones','dotes_rasgos','dedicaciones_rasgos','nacimientos_rasgos','linajes_rasgos'])result[table]=rows(db,`SELECT * FROM ${table}`);
  result.dedicaciones=result.dedicaciones.filter(d=>d.disponible_demo!==0);result.nacimientos=result.nacimientos.filter(n=>n.disponible_demo!==0);
  if(one(db,"SELECT name FROM sqlite_master WHERE name='profesiones'"))for(const table of ['profesiones','dedicaciones_profesiones','nacimientos_preguntas'])result[table]=rows(db,`SELECT * FROM ${table}`);
  if(result.rasgos_modificadores&&result.clases_rasgos)result.clases_rasgos=result.clases_rasgos.map(cr=>{const r=result.rasgos.find(r=>r.id===cr.rasgo_id&&r.tipo==='Capacidad');return r?{...cr,nombre:r.nombre,descripcion:r.descripcion}:cr;});
  if(one(db,"SELECT name FROM sqlite_master WHERE name='v_rasgos_senda_catalogo'"))result.clases_rasgos=rows(db,'SELECT * FROM v_rasgos_senda_catalogo');
  if(one(db,"SELECT name FROM sqlite_master WHERE name='preguntas_rasgos_senda'")){
    result.preguntas_senda=pathQuestions(db);
    result.requisitos_dotes_rasgos=rows(db,'SELECT * FROM requisitos_dotes_rasgos');
  }
  // Las tablas de creación heredadas son vínculos de compatibilidad. Los valores
  // canónicos proceden de los modificadores del Rasgo, sin aplicar ambos caminos.
  if(result.rasgos_modificadores){
    result.linajes_skills=result.linajes_skills.map(b=>{const m=result.rasgos_modificadores.find(m=>m.rasgo_id===b.rasgo_id&&m.skill_id===b.skill_id&&m.tipo==='BonoSkill'&&m.fase==='Creacion');return m?{...b,bono:m.valor}:b;});
    result.dedicaciones_skills=result.dedicaciones_skills.map(g=>{const m=result.rasgos_modificadores.find(m=>m.rasgo_id===g.rasgo_id&&m.skill_id===g.skill_id&&m.tipo==='MinimoSkill'&&m.fase==='Creacion');return m?{...g,minimo:m.valor}:g;});
    if(result.profesiones)result.profesiones=result.profesiones.map(p=>{const m=result.rasgos_modificadores.find(m=>m.rasgo_id===p.rasgo_id&&m.skill_id===p.skill_id&&m.tipo==='MinimoSkill'&&m.fase==='Creacion');return m?{...p,minimo_inicial:m.valor}:p;});
  }
  if(one(db,'SELECT 1 FROM schema_migrations WHERE version=31')){
    result.elecciones_rasgos=traitChoiceCatalogue(db);
    result.dotes_tags=rows(db,'SELECT * FROM dotes_tags');
  }
  result.ordenes_y_juramento=orderCatalogue(db);
  result.regalos_perjuicios=[];
  return result;
}
function log(db,id,v){return insert(db,'progresion',{personaje_id:id,change:v.change??'Add',tipo:v.tipo,dote_id:v.dote_id??null,epifania_id:v.epifania_id??null,item_id:v.item_id??null,skill_id:v.skill_id??null,valor:v.valor??1,xp_gastada:v.xp_gastada??0,adquisicion_id:v.adquisicion_id??null,clase_id:v.clase_id??null,origen:v.origen??'Compra',notas:v.notas??''});}
export function createCharacter(db,b,internal=false){
  if(['token','token_acceso','password','pw','PW'].some(key=>Object.hasOwn(b,key)))fail('El token del personaje lo genera el sistema');
  if(typeof b.nombre!=='string'||!b.nombre.trim()||b.nombre.length>80)fail('Indica un nombre de hasta 80 caracteres');
  for(const [key,table] of [['linaje_id','linajes'],['clase_id','clases'],['dedicacion_id','dedicaciones'],['nacimiento_id','nacimientos']])if(!get(db,table,integer(b[key],1)))fail('Selección de creación inválida');
  if(get(db,'clases',b.clase_id).disponible_demo===0)fail('Esta Senda no está disponible en la demo');
  if(one(db,"SELECT 1 FROM sqlite_schema WHERE name='personajes_ordenes'"))validateOrderCreation(db,b);
  const choices = validateCreationChoices(
    one(db,"SELECT name FROM sqlite_master WHERE name='preguntas_rasgos_senda'") ? pathQuestions(db) : [],
    b.clase_id, b.elecciones_senda
  );
  if(get(db,'dedicaciones',b.dedicacion_id).disponible_demo===0||get(db,'nacimientos',b.nacimiento_id).disponible_demo===0)fail('Este origen no está disponible en la demo');
  const attrs=rows(db,"SELECT * FROM all_skills WHERE tipo='Atributo'").sort((a,b)=>ATTRIBUTE_ORDER.indexOf(a.nombre)-ATTRIBUTE_ORDER.indexOf(b.nombre));for(const a of attrs)integer(b.atributos?.[a.id],0,99);
  let initialXP=1;let rollSession=null;
  if(!internal){
    const mode=b.generacion_modo??'Fijo',actual=attrs.map(a=>b.atributos[a.id]);
    if(b.tirada_id){const saved=one(db,'SELECT * FROM creacion_tiradas WHERE id=?',b.tirada_id);if(!saved||saved.personaje_id)fail('Tirada inexistente o ya utilizada');rollSession=JSON.parse(saved.estado);}
    if(mode==='Fijo'){
      if(rollSession?.modo==='Ordenado')fail('Debes respetar el orden estricto o solicitar un Mulligan válido');
      if(!sameValues(actual,FIXED_VALUES))fail('Distribuye el arreglo fijo respetando las copias disponibles de cada valor');
    }else if(['Libre','Ordenado'].includes(mode)){
      if(!rollSession||rollSession.modo!==mode)fail('Genera los atributos con los dados del wizard');
      if(!sameValues(actual,rollSession.valores))fail('Asigna únicamente los resultados de la tirada vigente');
      if(mode==='Ordenado'&&actual.some((v,i)=>v!==rollSession.valores[i]))fail('Respeta el orden original de las tiradas');
    }else fail('Método de atributos inválido');
    if(mode==='Ordenado'&&rollSession?.modo==='Ordenado'&&!rollSession.mulligan_usado)initialXP=2;
  }
  const pools=b.pools??{};const combat=new Set();let normal=0;
  if(!internal){const values=[];for(const [id,v] of Object.entries(pools)){const sk=get(db,'all_skills',Number(id));if(!sk||sk.tipo!=='Habilidad')fail('Habilidad de pool inválida');integer(v,0,20);if(sk.combate&&v){values.push(v);combat.add(sk.id);}else normal+=v;}if(values.sort((a,b)=>a-b).join(',')!=='5,10,15,20'||combat.size!==4||normal!==50)fail('Asigna +20/+15/+10/+5 a cuatro habilidades de combate y 50 puntos normales (máximo 20 por habilidad)');}
  const lineageCatalogue=catalogue(db),bonuses=lineageBonuses(lineageCatalogue,b,{strict:true});
  const background=validateBackground(lineageCatalogue,b);
  const originAnswers=validateOriginAnswers(lineageCatalogue,b),profession=selectedProfession(lineageCatalogue,b,{strict:true});
  const traitCreation=creationTraitModifiers(lineageCatalogue,b);
  if(b.regalo_moonstone!==undefined&&typeof b.regalo_moonstone!=='boolean')fail('Selección de regalo cultural inválida');
  const initialGold=get(db,'clases',b.clase_id).oro_inicial;
  const id=insert(db,'personajes',{nombre:b.nombre.trim(),linaje_id:b.linaje_id,xp_total:initialXP,...(initialGold!=null?{oro:initialGold}:{}),modo_campana:b.modo_campana==='sandbox'?'sandbox':'enclave',notas:String(b.notas??'').slice(0,4000)});
  if(rollSession)run(db,'UPDATE creacion_tiradas SET personaje_id=? WHERE id=?',id,rollSession.id);
  run(db,'INSERT INTO personajes_clases(personaje_id,clase_id) VALUES(?,?)',id,b.clase_id);run(db,'INSERT INTO personajes_dedicaciones VALUES(?,?)',id,b.dedicacion_id);run(db,'INSERT INTO personajes_nacimientos VALUES(?,?)',id,b.nacimiento_id);
  for(const choice of choices)recordPathChoice(db,id,choice);
  for(const answer of background)insert(db,'personajes_trasfondo',{personaje_id:id,...answer});
  for(const answer of originAnswers)insert(db,'personajes_origen_respuestas',{personaje_id:id,...answer});
  if(profession)run(db,'INSERT INTO personajes_profesiones(personaje_id,profesion_id) VALUES(?,?)',id,profession.id);
  const floors=professionGuarantees(lineageCatalogue,b);
  const {totals,details}=creationSkills({skills:rows(db,'SELECT * FROM all_skills'),atributos:b.atributos,pools,bonos:bonuses,garantias:floors,minimos:traitCreation.garantias});
  for(const [sk,v] of Object.entries(totals))run(db,'INSERT INTO personajes_skills VALUES(?,?,?)',id,Number(sk),v);
  if(one(db,"SELECT name FROM sqlite_master WHERE name='personajes_creacion_skills'")){
    for(const [sid,detail] of Object.entries(details))run(db,'INSERT INTO personajes_creacion_skills VALUES(?,?,?)',id,Number(sid),JSON.stringify(detail));
    for(const g of lineageCatalogue.linajes_elecciones.filter(g=>g.linaje_id===b.linaje_id))run(db,'INSERT INTO personajes_elecciones_linaje VALUES(?,?,?)',id,g.id,b.elecciones_linaje[g.id]);
  }
  if(one(db,"SELECT name FROM sqlite_master WHERE name='clases_skills'"))for(const s of rows(db,'SELECT * FROM clases_skills WHERE clase_id=?',b.clase_id))run(db,'INSERT OR IGNORE INTO personajes_skills VALUES(?,?,?)',id,s.skill_id,s.valor_inicial);
  if(b.regalo_id!=null||b.perjuicio_id!=null)fail('Los Regalos y Perjuicios están en cuarentena');
  for(const d of rows(db,'SELECT dote_id FROM linajes_dotes WHERE linaje_id=? UNION SELECT dote_id FROM clases_dotes WHERE clase_id=? UNION SELECT dote_otorgado_id FROM dedicaciones WHERE id=? AND dote_otorgado_id IS NOT NULL',b.linaje_id,b.clase_id,b.dedicacion_id))log(db,id,{tipo:'Adquisicion',dote_id:d.dote_id,origen:'Creación'});
  grantLineage(db,id,{moonstone:b.regalo_moonstone!==false});
  if(b.elecciones_rasgos!==undefined){
    if(!b.elecciones_rasgos||typeof b.elecciones_rasgos!=='object'||Array.isArray(b.elecciones_rasgos))fail('Elecciones de Rasgos inválidas');
    const initial=character(db,id).elecciones_rasgos.filter(e=>e.tipo!=='As');
    if(Object.keys(b.elecciones_rasgos).some(c=>!initial.some(e=>e.codigo===c)))fail('La elección no pertenece a tus Rasgos iniciales');
    for(const e of initial)recordTraitChoice(db,character(db,id),{codigo:e.codigo,valor:b.elecciones_rasgos[e.codigo]},v=>log(db,id,v));
  }
  if(one(db,"SELECT 1 FROM sqlite_schema WHERE name='personajes_ordenes'"))recordOrderCreation(db,id,b,v=>log(db,id,v));
  const created=character(db,id);
  if(one(db,"SELECT name FROM sqlite_master WHERE name='personajes_accesos'"))created.token_acceso=issueCharacterToken(db,id);
  return created;
}
export function character(db,id){
  const p=get(db,'personajes',id);if(!p)fail('Personaje no encontrado');
  p.orden=orderState(db,id);p.juramento=oathState(db,id);
  p.linaje=get(db,'linajes',p.linaje_id);p.sendas=rows(db,'SELECT c.* FROM clases c JOIN personajes_clases pc ON pc.clase_id=c.id WHERE pc.personaje_id=?',id);
  p.dedicaciones=rows(db,'SELECT d.* FROM dedicaciones d JOIN personajes_dedicaciones p ON p.dedicacion_id=d.id WHERE p.personaje_id=?',id);p.nacimientos=rows(db,'SELECT n.* FROM nacimientos n JOIN personajes_nacimientos p ON p.nacimiento_id=n.id WHERE p.personaje_id=?',id);p.regalos=rows(db,'SELECT r.* FROM regalos_perjuicios r JOIN personajes_regalos_perjuicios p ON p.regalo_perjuicio_id=r.id WHERE p.personaje_id=?',id);
  p.trasfondo=one(db,"SELECT name FROM sqlite_master WHERE name='personajes_trasfondo'")?rows(db,'SELECT a.*,q.numero,q.dedicacion_id FROM personajes_trasfondo a JOIN dedicaciones_preguntas q ON q.id=a.pregunta_id WHERE a.personaje_id=? ORDER BY q.dedicacion_id,q.numero',id):[];
  p.profesiones=one(db,"SELECT name FROM sqlite_master WHERE name='profesiones'")?rows(db,'SELECT o.* FROM profesiones o JOIN personajes_profesiones p ON p.profesion_id=o.id WHERE p.personaje_id=?',id):[];
  p.origen_trasfondo=one(db,"SELECT name FROM sqlite_master WHERE name='personajes_origen_respuestas'")?rows(db,'SELECT a.*,q.numero FROM personajes_origen_respuestas a JOIN nacimientos_preguntas q ON q.id=a.pregunta_id WHERE a.personaje_id=? ORDER BY q.numero',id):[];
  const bases=rows(db,'SELECT s.*,p.valor_base FROM personajes_skills p JOIN all_skills s ON s.id=p.skill_id WHERE p.personaje_id=?',id);
  for(const s of rows(db,'SELECT s.* FROM all_skills s WHERE EXISTS(SELECT 1 FROM progresion h WHERE h.personaje_id=? AND h.skill_id=s.id) AND NOT EXISTS(SELECT 1 FROM personajes_skills ps WHERE ps.personaje_id=? AND ps.skill_id=s.id)',id,id))bases.push({...s,valor_base:0});
  const skillDelta=sid=>one(db,"SELECT COALESCE(SUM(CASE change WHEN 'Add' THEN valor ELSE -valor END),0) n FROM progresion WHERE personaje_id=? AND skill_id=?",id,sid).n;
  p.skills=bases.map(s=>({...s,valor:s.valor_base+skillDelta(s.id)+(s.padre_id?skillDelta(s.padre_id):0)}));
  p.adquisiciones=rows(db,'SELECT * FROM v_adquisiciones_activas WHERE personaje_id=?',id).map(a=>{const i=a.item_id?get(db,'inventario',a.item_id):null;return {...a,elemento:a.dote_id?get(db,'dotes',a.dote_id):a.epifania_id?get(db,'epifanias',a.epifania_id):i?.item_magico_id?get(db,'items_magicos',i.item_magico_id):i?.artefacto_id?get(db,'artefactos_arcanos',i.artefacto_id):null};});
  if(one(db,"SELECT name FROM sqlite_master WHERE name='preguntas_rasgos_senda'"))p.elecciones_senda=pathQuestions(db,id);
  if(one(db,"SELECT name FROM sqlite_master WHERE name='rasgos_modificadores'")){
    p.estados=rows(db,'SELECT e.*,pe.grado FROM personajes_estados pe JOIN estados_alterados e ON e.id=pe.estado_id WHERE pe.personaje_id=?',id);
    if(one(db,"SELECT name FROM sqlite_master WHERE name='v_rasgos_senda_estado'"))p.rasgos_senda=rows(db,'SELECT * FROM v_rasgos_senda_estado WHERE personaje_id=? ORDER BY clase_id,xp_requerida,id',id);
    p.rasgos=activeTraits(db,p);
    if(p.elecciones_senda)p.plegarias=characterPrayers(db,p);
    for(const m of p.rasgos.flatMap(r=>r.modificadores).filter(m=>m.fase==='Siempre'&&['BonoSkill','MinimoSkill'].includes(m.tipo)))if(!p.skills.some(s=>s.id===m.skill_id)){const s=get(db,'all_skills',m.skill_id);p.skills.push({...s,valor_base:0,valor:skillDelta(s.id)+(s.padre_id?(p.skills.find(a=>a.id===s.padre_id)?.valor??0):0)});}
    p.skills=runtimeTraitSkills(p.skills,p.rasgos,p);
  }
  p.historial=rows(db,'SELECT * FROM progresion WHERE personaje_id=? ORDER BY id DESC',id).map(a=>({...a,nombre:a.dote_id?get(db,'dotes',a.dote_id)?.nombre:a.epifania_id?get(db,'epifanias',a.epifania_id)?.nombre:a.skill_id?get(db,'all_skills',a.skill_id)?.nombre:'Ítem #'+a.item_id}));
  p.xp_gastada=one(db,'SELECT COALESCE(SUM(xp_gastada),0) n FROM progresion WHERE personaje_id=?',id).n;if(one(db,'SELECT 1 FROM schema_migrations WHERE version=24')){
   p.entrenamiento=trainingState(db,id);p.xp_gastada+=p.entrenamiento.coste;
  }
  p.xp_disponible=p.xp_total-p.xp_gastada;p.pools=rows(db,'SELECT * FROM v_xp_senda WHERE personaje_id=?',id);
  const activeD=p.adquisiciones.filter(a=>a.dote_id).map(a=>a.dote_id),activeE=p.adquisiciones.filter(a=>a.epifania_id).map(a=>a.epifania_id);const actionMap=new Map();
  const grant=(a,source)=>{if(!actionMap.has(a.id))actionMap.set(a.id,{...a,fuentes:[]});if(!actionMap.get(a.id).fuentes.includes(source))actionMap.get(a.id).fuentes.push(source);};
  rows(db,"SELECT * FROM acciones WHERE tipo IN ('Generica','Reaccion')").forEach(a=>grant(a,'Genérica'));
  for(const d of activeD){const name=get(db,'dotes',d).nombre;rows(db,'SELECT a.* FROM acciones a JOIN dotes_acciones da ON da.accion_id=a.id WHERE da.dote_id=? UNION SELECT a.* FROM acciones a JOIN dotes d ON d.accion_id=a.id WHERE d.id=?',d,d).forEach(a=>grant(a,name));}
  if(!p.rasgos_senda)for(const c of p.sendas) rows(db,'SELECT a.*,cr.nombre fuente FROM clases_rasgos cr JOIN acciones a ON a.id=cr.accion_id WHERE cr.clase_id=? AND (cr.es_insignia=1 OR EXISTS(SELECT 1 FROM personajes_clases_rasgos pr WHERE pr.personaje_id=? AND pr.clase_rasgo_id=cr.id))',c.id,id).forEach(a=>grant(a,a.fuente));
  for(const c of p.sendas)if(c.accion_id){const a=get(db,'acciones',c.accion_id);if(a)grant(a,c.nombre);}
  for(const a of p.adquisiciones)if(!a.dote_id&&a.elemento?.accion_id){const item=a.item_id?get(db,'inventario',a.item_id):null;if(item&&(!item.equipado||!item.transportado||item.retirado))continue;const action=get(db,'acciones',a.elemento.accion_id);if(action)grant(action,a.elemento.nombre);}
  if(!p.rasgos_senda)rows(db,'SELECT a.*,cr.nombre fuente FROM clases_rasgos_acciones ca JOIN clases_rasgos cr ON cr.id=ca.clase_rasgo_id JOIN acciones a ON a.id=ca.accion_id JOIN personajes_clases pc ON pc.clase_id=cr.clase_id WHERE pc.personaje_id=? AND (cr.es_insignia=1 OR EXISTS(SELECT 1 FROM personajes_clases_rasgos pr WHERE pr.personaje_id=? AND pr.clase_rasgo_id=cr.id))',id,id).forEach(a=>grant(a,a.fuente));
  for(const r of p.rasgos??[])for(const a of r.acciones)grant(a,r.nombre);
  p.acciones=[...actionMap.values()];p.componentes={};for(const [table,col] of [['efectos','efecto_id'],['mediums','medium_id'],['shapes','shape_id'],['mods','mod_id'],['trucos','truco_id'],['misticas','mistica_id']])p.componentes[table]=rows(db,`SELECT DISTINCT e.* FROM ${table} e JOIN epifanias_${table} pe ON pe.${col}=e.id JOIN v_adquisiciones_activas a ON a.epifania_id=pe.epifania_id WHERE a.personaje_id=?`,id);
  if(canWeave(p)&&one(db,'SELECT 1 FROM schema_migrations WHERE version=7'))for(const medium of rows(db,'SELECT * FROM mediums WHERE universal=1'))if(!p.componentes.mediums.some(m=>m.id===medium.id))p.componentes.mediums.push(medium);
  if(one(db,'SELECT 1 FROM schema_migrations WHERE version=9'))p.componentes.duraciones=rows(db,'SELECT * FROM duraciones');
  p.tags=rows(db,'SELECT DISTINCT r.* FROM rasgos r WHERE r.id IN (SELECT rasgo_id FROM personajes_tags WHERE personaje_id=? UNION SELECT rasgo_id FROM linajes_rasgos WHERE linaje_id=? UNION SELECT ct.rasgo_id FROM clases_tags ct JOIN personajes_clases pc ON pc.clase_id=ct.clase_id WHERE pc.personaje_id=?)',id,p.linaje_id,id);
  for(const tagId of [p.rasgo_id,p.linaje?.rasgo_id,...p.sendas.map(s=>s.rasgo_id)].filter(Boolean))if(!p.tags.some(t=>t.id===tagId))p.tags.push(get(db,'rasgos',tagId));
  p.tags=p.tags.filter(t=>t&&t.tipo!=='Capacidad');
  p.rasgos_clase=rows(db,'SELECT cr.* FROM clases_rasgos cr JOIN personajes_clases pc ON pc.clase_id=cr.clase_id WHERE pc.personaje_id=? AND (cr.es_insignia=1 OR EXISTS(SELECT 1 FROM personajes_clases_rasgos pr WHERE pr.personaje_id=? AND pr.clase_rasgo_id=cr.id))',id,id);
  if(p.rasgos_senda)p.rasgos_clase=p.rasgos_senda.filter(r=>r.activo);
  if(p.rasgos)p.rasgos_clase=p.rasgos_clase.map(cr=>{const r=p.rasgos.find(r=>r.id===cr.rasgo_id);return r?{...cr,nombre:r.nombre,descripcion:r.descripcion}:cr;});
  p.inventario=rows(db,'SELECT i.*,COALESCE(m.nombre,a.nombre,ar.nombre,aa.nombre) nombre FROM inventario i LEFT JOIN items_magicos m ON m.id=i.item_magico_id LEFT JOIN armas a ON a.id=i.arma_id LEFT JOIN armaduras ar ON ar.id=i.armadura_id LEFT JOIN artefactos_arcanos aa ON aa.id=i.artefacto_id WHERE i.personaje_id=?',id);
  p.estados=rows(db,'SELECT e.*,pe.grado FROM personajes_estados pe JOIN estados_alterados e ON e.id=pe.estado_id WHERE pe.personaje_id=?',id);
  const value=n=>p.skills.find(s=>s.nombre===n)?.valor??0,nv=Math.floor(value('Vitalidad')/10),nw=Math.floor(value('Voluntad')/10),mh=Math.ceil((p.linaje?.escalado_vital??0)*nv),pg=mh-p.heridas_actuales;
  p.derivados={mh,pg_reales:pg,mana_max:Math.max(0,value('Voluntad')+nw-p.dano_cronico),mana_actual:Math.max(0,value('Voluntad')+nw-p.mana_consumido-p.dano_cronico),stamina:Math.max(0,nv-p.heridas_graves-p.stamina_gastada),dureza:nv,umbral_grave:Math.ceil(mh/2),limite_seguro:nv+nw,excedido:p.mana_consumido>nv+nw,estado:p.muerte_por_impacto||p.cansancio>=5||mh>0&&p.heridas_actuales>=2*mh?'Muerto':p.cansancio===4?'Coma por Cansancio':mh>0&&p.bloque_grave>=mh?'Coma Traumático':p.heridas_mortales||p.heridas_graves&&pg<=0?'Agonizando':pg<0?'Desmayado':'Activo'};
  p.derivados.mana_base=value('Voluntad')+nw;p.derivados.stamina_max=Math.max(0,nv-p.heridas_graves);p.derivados.mana_actual=Math.min(p.derivados.mana_actual,p.derivados.mana_max);
  if(one(db,'SELECT 1 FROM schema_migrations WHERE version=24'))p.ultimo_impacto=one(db,'SELECT zona,mortal,grave,heridas,ne_impacto FROM dano_eventos WHERE personaje_id=? ORDER BY id DESC LIMIT 1',id);
  p.dotes_disponibles=rows(db,'SELECT * FROM dotes WHERE condicion_especial=0 OR EXISTS(SELECT 1 FROM personajes_autorizaciones pa WHERE pa.personaje_id=? AND pa.dote_id=dotes.id)',id).filter(d=>!d.solo_concesion_inicial&&!d.solo_concesion_senda&&(!d.linaje_requerido_id||d.linaje_requerido_id===p.linaje_id)).map(d=>({...d,requisitos:requirements(db,p,d),poseido:activeD.includes(d.id)}));
  if(one(db,"SELECT name FROM sqlite_master WHERE name='equipo_defensas'")){p.equipo=equipmentSummary(db,p);p.inventario=p.equipo.inventario;}
  applyLineage(db,p);
  p.magia=one(db,'SELECT 1 FROM schema_migrations WHERE version=7')?magicState(db,id):{activa:null,historial:[],tiradas:[]};
  if(one(db,'SELECT 1 FROM schema_migrations WHERE version=31'))p.elecciones_rasgos=traitChoiceState(db,p);
  if(one(db,'SELECT 1 FROM schema_migrations WHERE version=37'))p.herramienta_lanzador=casterToolState(db,p);
  return p;
}
function requirements(db,p,d){const reasons=[];if(d.linaje_requerido_id&&d.linaje_requerido_id!==p.linaje_id)reasons.push('Linaje exclusivo');if(d.solo_concesion_inicial)reasons.push('Concesión inicial del linaje; no se compra');if(d.solo_concesion_senda)reasons.push('Dote insignia de origen; no se compra desde este catálogo');for(const r of rows(db,'SELECT * FROM requisitos_dotes WHERE dote_id=?',d.id)){
  if(r.skill_id){const s=p.skills.find(s=>s.id===r.skill_id);if((s?.valor??0)<r.valor_minimo)reasons.push((get(db,'all_skills',r.skill_id)?.nombre??'Habilidad')+' ≥ '+r.valor_minimo);}
  if(r.dote_requerido_id&&!p.adquisiciones.some(a=>a.dote_id===r.dote_requerido_id))reasons.push(get(db,'dotes',r.dote_requerido_id).nombre);
  if(r.epifania_id&&!p.adquisiciones.some(a=>a.epifania_id===r.epifania_id))reasons.push(get(db,'epifanias',r.epifania_id).nombre);
  if(r.clase_id&&!p.sendas.some(s=>s.id===r.clase_id))reasons.push(get(db,'clases',r.clase_id).nombre);
}
 if(p.elecciones_senda)for(const r of rows(db,`SELECT r.id,r.nombre FROM requisitos_dotes_rasgos dr
   JOIN rasgos r ON r.id=dr.rasgo_id WHERE dr.dote_id=?`,d.id)){
   if(!p.rasgos.some(trait=>trait.id===r.id))reasons.push(r.nombre);
 }
 if(d.es_exclusivo_clase&&!p.sendas.some(s=>s.id===d.clase_id))reasons.push('Senda exclusiva');if(d.xp_clase_requerida>(p.pools.find(c=>c.clase_id===d.clase_id)?.xp_invertida??0))reasons.push('XP de senda: '+d.xp_clase_requerida);return reasons;}
export function addProgress(db,id,b){
  const p=character(db,id),targets=['dote_id','epifania_id','item_id','skill_id'].filter(k=>b[k]!=null);if(targets.length!==1)fail('Selecciona exactamente un objetivo');const key=targets[0],target=integer(b[key],1);const type=b.tipo;
  let element=key==='dote_id'?get(db,'dotes',target):key==='epifania_id'?get(db,'epifanias',target):key==='skill_id'?get(db,'all_skills',target):get(db,'inventario',target);if(!element)fail('Objetivo inexistente');if(key==='item_id'){if(element.personaje_id!==id)fail('El ítem no pertenece al personaje');if(element.retirado||element.cantidad===0)fail('El objeto ya no está en el inventario');if(!element.item_magico_id&&!element.artefacto_id)fail('Solo los ítems mágicos y artefactos admiten inversión');element=element.item_magico_id?get(db,'items_magicos',element.item_magico_id):get(db,'artefactos_arcanos',element.artefacto_id);}
  const active=p.adquisiciones.find(a=>a[key]===target);let cost=0,change='Add',acquisition=null,value=1;
  if(type==='Adquisicion'){
    if(key==='skill_id'||active)fail('El elemento ya está adquirido o no es adquirible');
    if(key==='dote_id'){if(element.condicion_especial&&!one(db,'SELECT 1 FROM personajes_autorizaciones WHERE personaje_id=? AND dote_id=?',id,target))fail('Requiere autorización del narrador');const missing=requirements(db,p,element);if(missing.length)fail('Requisitos pendientes: '+missing.join(', '));}
    cost=element.costo_xp??element.costo_xp_sintonia??1;
  }else if(type==='Inversion'){if(!active||!element.permite_inversion_adicional)fail('Este elemento no admite esta inversión');cost=integer(b.xp_gastada,1);acquisition=active.id;
  }else if(type==='Retiro'){if(!active)fail('El elemento no está adquirido');if(element.solo_concesion_inicial)fail('Una capacidad inicial de linaje no se retira como una compra');if(element.solo_concesion_senda)fail('Un dote insignia de origen no se retira como una compra');change='Subtract';acquisition=active.id;
  }else if(type==='Skill'){if(key!=='skill_id')fail('Objetivo de habilidad inválido');value=integer(b.valor,1,99);change=b.change==='Subtract'?'Subtract':'Add';cost=integer(b.xp_gastada??0);if(element.modo_progresion==='Narrador'&&cost>0)fail('Esta habilidad se modifica por decisión del narrador, sin compra de XP');const current=p.skills.find(s=>s.id===target)?.valor??(element.padre_id?(p.skills.find(s=>s.id===element.padre_id)?.valor??0):0);integer(current+(change==='Add'?value:-value),0,99);if(element.tipo==='Atributo')for(const child of p.skills.filter(s=>s.padre_id===target))integer(child.valor+(change==='Add'?value:-value),0,99);if(!one(db,'SELECT 1 FROM personajes_skills WHERE personaje_id=? AND skill_id=?',id,target)){const inherited=element.padre_id?(one(db,'SELECT valor_base FROM personajes_skills WHERE personaje_id=? AND skill_id=?',id,element.padre_id)?.valor_base??0):0;run(db,'INSERT INTO personajes_skills VALUES(?,?,?)',id,target,inherited);}
  }else fail('Tipo de movimiento inválido');
  if(cost>p.xp_disponible)fail('XP disponible insuficiente');
  const cls=element.clase_id&&p.sendas.some(s=>s.id===element.clase_id)?element.clase_id:null;
  log(db,id,{tipo:type,[key]:target,change,valor:value,xp_gastada:cost,adquisicion_id:acquisition,clase_id:cls,origen:type==='Skill'?'Narrador / progresión':'Compra',notas:String(b.notas??'').slice(0,1000)});return character(db,id);
}

export function recordRest(db,id,b){
 const p=character(db,id),tipo=b.tipo;
 if(!['Pausa','Corto','Largo','Curación natural'].includes(tipo))fail('Elegí un procedimiento de descanso');
 const diario=tipo==='Largo'||tipo==='Curación natural',dia=diario?integer(b.dia,1):null;
 if(diario&&one(db,'SELECT 1 FROM recuperaciones WHERE personaje_id=? AND tipo=? AND dia=?',id,tipo,dia))fail('Ya se registró para ese día de campaña');
 const horas=tipo==='Corto'?integer(b.horas,1,999):tipo==='Largo'?8:null;
 const before=Object.fromEntries(['heridas_actuales','heridas_graves','heridas_mortales','mana_consumido','dano_cronico','stamina_gastada','cansancio'].map(k=>[k,p[k]]));
 insert(db,'recuperaciones',{personaje_id:id,tipo,dia,horas,estado_anterior:JSON.stringify(before)});
 if(tipo==='Pausa')run(db,'UPDATE personajes SET stamina_gastada=0 WHERE id=?',id);
 if(tipo==='Corto'&&b.meditar===true)run(db,'UPDATE personajes SET mana_consumido=MAX(0,mana_consumido-?) WHERE id=?',horas,id);
 if(tipo==='Largo'&&b.necesidades===true&&p.cansancio<5)run(db,'UPDATE personajes SET cansancio=MAX(0,cansancio-1) WHERE id=?',id);
 if(tipo==='Curación natural'&&p.derivados.estado!=='Muerto'){
  const leves=Math.max(0,p.heridas_actuales-p.bloque_grave);
  run(db,'UPDATE personajes SET heridas_actuales=heridas_actuales-? WHERE id=?',Math.min(1,leves),id);
 }
 if(tipo!=='Curación natural')run(db,"UPDATE canalizaciones SET estado='Interrumpido',actualizada=CURRENT_TIMESTAMP WHERE personaje_id=? AND estado='Canalizando'",id);
 return character(db,id);
}
export function makeServer(db,{random100,catalogueToken=process.env.GIDEON_CATALOG_TOKEN,dmToken,npcRoot=NPC_ROOT}={}){initNPCs(db);const failures=new Map();return createServer(async(req,res)=>{
  const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
  try{
    const path=new URL(req.url,'http://localhost').pathname;
    if(path.startsWith('/api/')){
      let body={};if(['POST','PATCH'].includes(req.method)){let raw='';for await(const c of req){raw+=c;if(raw.length>100000)fail('Petición demasiado grande');}body=JSON.parse(raw||'{}');}
      if(['POST','PATCH'].includes(req.method)&&req.headers.origin){let allowed=false;try{const origin=new URL(req.headers.origin);allowed=['http:','https:'].includes(origin.protocol)&&origin.host===req.headers.host;}catch{}if(!allowed)return send(403,{error:'Origen de solicitud no permitido'});}
      if(path==='/api/reglas'&&req.method==='GET'){
        const docs=rows(db,'SELECT * FROM documentos_reglas ORDER BY rowid');
        if(!new URL(req.url,'http://localhost').searchParams.has('referencias'))
          for(const doc of docs)doc.texto=unmark(doc.texto);
        return send(200,docs);
      }
      if(path==='/api/referencias'&&req.method==='GET')return send(200,referenceCatalogue(db));
      if(path==='/api/health'&&req.method==='GET')return send(200,{app:'gideon-companion'});
      if(path==='/api/catalogo'&&req.method==='GET')return send(200,catalogue(db));
      if(path==='/api/acceso'&&req.method==='POST'){
        const ip=req.socket.remoteAddress??'',now=Date.now(),previous=failures.get(ip),attempt=previous&&now-previous.at<60000?previous:{at:now,count:0};
        if(attempt.count>=20)return send(429,{error:'Demasiados intentos. Esperá un minuto y volvé a intentar.'});
        const owner=identifyCharacter(db,body.token);
        if(!owner){attempt.count++;if(failures.size>=10000)failures.delete(failures.keys().next().value);failures.set(ip,attempt);return send(401,{error:'Token inválido'});}
        failures.delete(ip);return send(200,{personaje:owner});
      }
      if(req.method==='POST'&&['/api/catalogo/rasgos','/api/catalogo/rasgos-senda'].includes(path)&&!catalogueAdmin(req,catalogueToken))return send(403,{error:'La edición del catálogo requiere acceso del servidor'});
      if(path==='/api/catalogo/rasgos'&&req.method==='POST')return send(201,transaction(db,()=>{const id=createTrait(db,body);return {rasgo:JSON.parse(one(db,'SELECT definicion_json FROM v_rasgos_definicion WHERE id=?',id).definicion_json),catalogo:catalogue(db)};}));
      if(path==='/api/catalogo/rasgos-senda'&&req.method==='POST')return send(201,transaction(db,()=>({vinculo:linkPathTrait(db,body),catalogo:catalogue(db)})));
      if(path==='/api/atributos/tiradas'&&req.method==='POST')return send(200,transaction(db,()=>creationRoll(db,body)));
      if(path==='/api/personajes'&&req.method==='POST')return send(201,transaction(db,()=>createCharacter(db,body)));
      if(path.startsWith('/api/dm/')){
        if(!dmAuthorized(req,dmToken))return send(403,{error:'El sector Only DM requiere el token del narrador'});
        const summary=()=>({catalogo:loadNPCs(npcRoot),grupos:npcGroups(db),personajes:rows(db,'SELECT id,nombre FROM personajes ORDER BY nombre'),vinculos:readLinks(npcRoot).vinculos});
        if(path==='/api/dm/npcs'&&req.method==='GET')return send(200,summary());
        if(path==='/api/dm/npcs/catalogo'&&req.method==='POST'){writeNPC(body,npcRoot);return send(201,summary());}
        if(path==='/api/dm/npcs/vinculos'&&req.method==='POST'){writeLink(db,body,npcRoot);return send(200,summary());}
        if(path==='/api/dm/npcs/grupos'&&req.method==='POST'){transaction(db,()=>createGroup(db,body,npcRoot));return send(201,summary());}
        const groupRoute=path.match(/^\/api\/dm\/npcs\/grupos\/([a-zA-Z0-9-]+)$/);
        if(groupRoute&&req.method==='PATCH'){transaction(db,()=>changeGroup(db,groupRoute[1],body));return send(200,summary());}
        if(path==='/api/dm/npcs/tiradas'&&req.method==='POST'){
          const npc=body.grupo_id?npcGroups(db).find(g=>g.id===body.grupo_id)?.npc:loadNPCs(npcRoot).find(n=>n.id===body.npc_id);
          if(!npc)fail('NPC inexistente');return send(200,npcRoll(npc,body,random100));
        }
        return send(404,{error:'Ruta de NPC inexistente'});
      }
      const owner=identifyCharacter(db,bearerToken(req));if(!owner)return send(401,{error:'Ingresá con el token de tu personaje'});
      if(path==='/api/personajes'&&req.method==='GET')return send(200,[owner]);
      if(path==='/api/catalogo/objetos'&&req.method==='POST')return send(201,transaction(db,()=>{const item=customItem(db,body);return {item,catalogo:catalogue(db)};}));
      const requested=path.match(/^\/api\/personajes\/(\d+)(?:\/|$)/);if(requested&&Number(requested[1])!==owner.id)return send(404,{error:'Personaje no disponible'});
      const companionRoute=path.match(/^\/api\/personajes\/(\d+)\/companeros(?:\/tiradas)?$/);
      if(companionRoute){
        const companions=playerCompanions(db,owner.id,npcRoot);
        if(req.method==='GET'&&!path.endsWith('/tiradas'))return send(200,companions);
        if(req.method==='POST'&&path.endsWith('/tiradas')){
          const link=companions.find(v=>v.id===body.vinculo_id);if(!link?.npc)return send(404,{error:'Compañero no disponible'});
          let npc=link.npc;if(body.grupo_id){const group=link.grupos.find(g=>g.id===body.grupo_id);if(!group)return send(404,{error:'Grupo no disponible'});npc=group.npc;}
          return send(200,npcRoll(npc,body,random100));
        }
        return send(405,{error:'Operación no admitida'});
      }
      const oathRoute=path.match(/^\/api\/personajes\/(\d+)\/juramento$/);
      if(oathRoute&&req.method==='POST')return send(200,transaction(db,()=>{
        const id=Number(oathRoute[1]);saveOath(db,id,body.juramento);return character(db,id);
      }));
      const choiceRoute=path.match(/^\/api\/personajes\/(\d+)\/elecciones-rasgos$/);
      if(choiceRoute&&req.method==='POST')return send(200,transaction(db,()=>{
        const id=Number(choiceRoute[1]);recordTraitChoice(db,character(db,id),body,v=>log(db,id,v));return character(db,id);
      }));
      const gearRoute=path.match(/^\/api\/personajes\/(\d+)\/(mercado|asignar-equipo|finalizar-equipo|soltar-mochila)$/);
      if(gearRoute&&req.method==='POST')return send(200,transaction(db,()=>{
        const id=Number(gearRoute[1]);
        if(gearRoute[2]==='soltar-mochila')run(db,"UPDATE inventario SET ubicacion='Piso',transportado=0,equipado=0,mano=NULL WHERE personaje_id=? AND ubicacion='Mochila'",id);
        if(gearRoute[2]==='mercado')purchase(db,id,body);
        if(gearRoute[2]==='asignar-equipo')assignGear(db,id,Number(body.inventario_id),body);
        if(gearRoute[2]==='finalizar-equipo')finishEquipment(db,id);
        return character(db,id);
      }));
      const inventoryMatch=path.match(/^\/api\/personajes\/(\d+)\/inventario\/(\d+)$/);
      if(inventoryMatch&&req.method==='PATCH')return send(200,transaction(db,()=>{
        const personId=Number(inventoryMatch[1]),itemId=Number(inventoryMatch[2]);
        if(!one(db,'SELECT id FROM inventario WHERE id=? AND personaje_id=? AND retirado=0',itemId,personId))fail('El objeto no pertenece a este personaje');
        if(body.cantidad===0&&one(db,'SELECT id FROM v_adquisiciones_activas WHERE personaje_id=? AND item_id=?',personId,itemId))addProgress(db,personId,{tipo:'Retiro',item_id:itemId});
        changeInventory(db,personId,itemId,body);return character(db,personId);
      }));
      const match=path.match(/^\/api\/personajes\/(\d+)(?:\/(entrenamiento|progresion|estado|inventario|artefactos|autorizar|xp|dano|tiradas|conjuros|recursos|trucos|descanso|acciones|elecciones-senda))?$/);if(!match)return send(404,{error:'Ruta inexistente'});const id=Number(match[1]);if(!get(db,'personajes',id))return send(404,{error:'Personaje no encontrado'});
      if(req.method==='GET'&&!match[2])return send(200,character(db,id));
      if(req.method==='POST'&&match[2]==='elecciones-senda')return send(200,transaction(db,()=>{
        recordPathChoice(db,id,body);
        return character(db,id);
      }));
      if(req.method==='POST'&&match[2]==='entrenamiento')return send(200,transaction(db,()=>{
        train(db,character(db,id),body,(skill_id,valor,costo)=>log(db,id,{tipo:'Skill',skill_id,valor,xp_gastada:costo,origen:'Entrenamiento'}));
        return character(db,id);
      }));
      if(req.method==='POST'&&match[2]==='descanso')return send(200,transaction(db,()=>recordRest(db,id,body)));
      if(req.method==='POST'&&match[2]==='tiradas')return send(200,transaction(db,()=>({tirada:skillRoll(db,character(db,id),body,random100),personaje:character(db,id)})));
      if(req.method==='POST'&&match[2]==='acciones')return send(200,transaction(db,()=>{const p=character(db,id),a=p.acciones.find(a=>a.id===body.accion_id&&a.usable_linaje);if(!a)fail('Capacidad de linaje no disponible');if(p.derivados.estado!=='Activo'||p.estados.some(s=>['Inconsciente','Dormido'].includes(s.nombre)))fail('Tu estado impide usar esta capacidad');spendResource(db,p,'Mana',a.coste_mana);return character(db,id);}));
      if(req.method==='POST'&&match[2]==='conjuros')return send(200,transaction(db,()=>{const tirada=spellOperation(db,character(db,id),body,random100);return {tirada,personaje:character(db,id)};}));
      if(req.method==='POST'&&match[2]==='recursos')return send(200,transaction(db,()=>{spendResource(db,character(db,id),body.recurso,integer(body.cantidad,1,9999));return character(db,id);}));
      if(req.method==='POST'&&match[2]==='trucos')return send(200,transaction(db,()=>{useTrick(db,character(db,id),body);return character(db,id);}));
      if(req.method==='POST'&&match[2]==='progresion')return send(200,transaction(db,()=>addProgress(db,id,body)));
      if(req.method==='POST'&&match[2]==='dano')return send(200,transaction(db,()=>{
        const p=character(db,id);if(!equipmentCatalogue(db).tipos_dano.includes(body.tipo_dano)||!['Bruto','Final','Omen'].includes(body.modo??'Bruto'))fail('Tipo de daño o modo inválido');
        if(body.fuente!=null&&!FUENTES.includes(body.fuente)||body.medio!=null&&!MEDIOS.includes(body.medio))fail('Fuente o medio de ataque inválido');
        if(body.modo==='Omen'&&!run(db,'UPDATE personajes SET omen_actual=omen_actual-1 WHERE id=? AND omen_actual>0',id).changes)fail('No quedan puntos de Omen');
        const result=damagePreview(p,body);run(db,'UPDATE personajes SET heridas_actuales=heridas_actuales+?,heridas_graves=heridas_graves+?,heridas_mortales=heridas_mortales+?,bloque_grave=bloque_grave+? WHERE id=?',result.heridas,result.grave,result.mortal,result.grave*p.derivados.mh/4,id);
        if(result.grave)markTraining(db,p,p.skills.find(s=>s.nombre==='Vitalidad'));
        const zona=result.grave?(body.zona||ZONAS[randomInt(ZONAS.length)]):null;
        if(zona&&!ZONAS.includes(zona))fail('Zona de impacto inválida');
        if(result.mortal&&['Cabeza','Torso'].includes(zona))run(db,'UPDATE personajes SET muerte_por_impacto=1 WHERE id=?',id);
        insert(db,'dano_eventos',{personaje_id:id,zona,fuente:body.fuente??null,medio:body.medio??null,ne_impacto:body.ne_impacto==null?null:integer(body.ne_impacto,0,999),tipo_dano:body.tipo_dano,recibido:result.recibido,mitigacion:result.mitigacion,fragilidad:result.fragilidad,heridas:result.heridas,grave:result.grave,mortal:result.mortal,omen:body.modo==='Omen'?1:0,modo:body.modo==='Omen'?'Final':body.modo??'Bruto'});return character(db,id);
      }));
      if(req.method==='PATCH'&&match[2]==='estado')return send(200,transaction(db,()=>{const before=character(db,id);if(body.mana_consumido>before.mana_consumido)checkSpend(before,'Mana',body.mana_consumido-before.mana_consumido);if(body.stamina_gastada>before.stamina_gastada)checkSpend(before,'Stamina',body.stamina_gastada-before.stamina_gastada);if(body.mana_consumido!=null){integer(body.mana_consumido,0,9999);const gain=chronicIncrease(before.mana_consumido,body.mana_consumido,before.derivados.limite_seguro);run(db,'UPDATE personajes SET dano_cronico=dano_cronico+? WHERE id=?',gain,id);}const fields={exceso_espacios:1,cansancio:5,muerte_por_impacto:1,heridas_graves:999,heridas_mortales:100,heridas_actuales:999,mana_consumido:9999,stamina_gastada:999,omen_actual:2};for(const [k,max] of Object.entries(fields))if(body[k]!=null)run(db,`UPDATE personajes SET ${k}=? WHERE id=?`,k==='heridas_actuales'&&Number.isFinite(body[k])&&body[k]>=0&&body[k]<=max?body[k]:integer(body[k],0,max),id);if(body.heridas_graves!=null&&body.heridas_graves!==before.heridas_graves){
          const block=Math.max(0,before.bloque_grave+(body.heridas_graves-before.heridas_graves)*before.derivados.mh/4);
          run(db,'UPDATE personajes SET bloque_grave=?,heridas_actuales=MAX(heridas_actuales,?) WHERE id=?',body.heridas_graves===0?0:block,body.heridas_graves===0?0:block,id);
        }
        if(body.heridas_actuales!=null||body.heridas_graves!=null||body.heridas_mortales!=null){
          const health=get(db,'personajes',id);
          if(health.heridas_actuales<health.bloque_grave||health.heridas_mortales>health.heridas_graves)fail('Las heridas totales deben incluir el bloque grave, y las graves incluyen las mortales');
        }
        if(body.dano_cronico!=null&&body.dano_cronico!==before.dano_cronico)run(db,'UPDATE personajes SET dano_cronico=? WHERE id=?',integer(body.dano_cronico,0,9999),id);if(body.notas!=null)run(db,'UPDATE personajes SET notas=? WHERE id=?',String(body.notas).slice(0,4000),id);if(body.capacidad_carga_kg!=null)fail('La capacidad depende de la habilidad Carga');return character(db,id);}));
      if(req.method==='POST'&&match[2]==='inventario')return send(201,transaction(db,()=>{addInventory(db,id,body);return character(db,id);}));
      if(req.method==='POST'&&match[2]==='artefactos')return send(200,transaction(db,()=>{useArtifact(db,character(db,id),body);return character(db,id);}));
      if(req.method==='POST'&&match[2]==='autorizar')return send(200,transaction(db,()=>{if(!get(db,'dotes',integer(body.dote_id,1)))fail('Dote inexistente');run(db,'INSERT OR REPLACE INTO personajes_autorizaciones VALUES(?,?,?)',id,body.dote_id,String(body.notas??''));return character(db,id);}));
      if(req.method==='POST'&&match[2]==='xp')return send(200,transaction(db,()=>{const amount=integer(body.cantidad,1,10000);run(db,'INSERT INTO xp_concesiones(personaje_id,cantidad,notas) VALUES(?,?,?)',id,amount,String(body.notas??''));run(db,'UPDATE personajes SET xp_total=xp_total+? WHERE id=?',amount,id);return character(db,id);}));
      return send(405,{error:'Operación no admitida'});
    }
    if(!['GET','HEAD'].includes(req.method))return send(405,{error:'Operación no admitida'});
    const file=resolve(BASE,'.'+decodeURIComponent(path==='/'?'/index.html':path));
    if(!file.startsWith(BASE+sep)||!['.html','.css','.js','.svg','.ico','.xml'].includes(extname(file))||file.startsWith(resolve(BASE,'sql')+sep)||!existsSync(file)||!statSync(file).isFile())return send(404,{error:'Archivo no encontrado'});
    const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.xml':'application/xml','.svg':'image/svg+xml'};res.writeHead(200,{'Content-Type':(types[extname(file)]??'application/octet-stream')+'; charset=utf-8','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:readFileSync(file));
  }catch(e){send(400,{error:e.message});}
});}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const db=openDatabase();
 if(process.argv.includes('--init-only')){console.log('SQLite migrado y datos de ejemplo cargados');db.close();}
 else{
  try{
   const status=await listenLocal(makeServer(db,{dmToken:localDMToken()}),{port:Number(process.env.PORT||8000)});
   if(status!=='started'){db.close();process.exitCode=status==='already-running'?0:1;}
  }catch(e){db.close();console.error(e.message);process.exitCode=1;}
 }
}
