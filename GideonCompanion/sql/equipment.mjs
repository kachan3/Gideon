import {weaponPrice,carriedLocation} from '../js/gear-rules.js';
import {shieldStats} from '../js/shield-rules.js';
import {armorStats} from '../js/armor-rules.js';
import {personalWeight} from '../js/creation-rules.js';
import {normalizeSchool} from '../js/magic-rules.js';
import {readFileSync} from 'node:fs';
const rows=(db,s,...a)=>db.prepare(s).all(...a),one=(db,s,...a)=>db.prepare(s).get(...a),run=(db,s,...a)=>db.prepare(s).run(...a);
const insert=(db,t,v)=>Number(run(db,`INSERT INTO ${t}(${Object.keys(v).join(',')}) VALUES(${Object.keys(v).map(()=>'?').join(',')})`,...Object.values(v)).lastInsertRowid);
const fail=s=>{throw Error(s);};
const number=(v,min=0,max=100000)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)fail('Valor numérico fuera de rango');return v;};
const integer=(v,min=0,max=100000)=>{number(v,min,max);if(!Number.isInteger(v))fail('Se requiere un número entero');return v;};
const bool=v=>v===true||v===1?1:0;
const TARGETS={arma_id:'armas',armadura_id:'armaduras',item_magico_id:'items_magicos',artefacto_id:'artefactos_arcanos',item_base_id:'items_base'};
const DAMAGE=['Cortante','Punzante','Contundente','Fuego','Frío','Rayo','Ácido','Necrótico','Radiante','Sónico','Espiritual','Psíquico','Verdadero','Toxinas'];
export const ARMOR={Ligera:{base:0.5,puntos:1},Mediana:{base:1,puntos:2},Pesada:{base:1.5,puntos:3}};
export function migrateEquipment(db){
 db.exec('PRAGMA foreign_keys=OFF; PRAGMA legacy_alter_table=ON; BEGIN IMMEDIATE;');
 try{
  db.exec(readFileSync(new URL('./migrations/004_inventory.sql',import.meta.url),'utf8'));
  seedEquipment(db);
  if(rows(db,'PRAGMA foreign_key_check').length)fail('La migración no pasó la verificación de relaciones');
  run(db,'INSERT INTO schema_migrations(version) VALUES(4)');db.exec('COMMIT');
 }catch(e){db.exec('ROLLBACK');throw e;}finally{db.exec('PRAGMA legacy_alter_table=OFF; PRAGMA foreign_keys=ON;');}
}
export function migrateArmorProfiles(db){
 db.exec('PRAGMA foreign_keys=OFF; PRAGMA legacy_alter_table=ON; BEGIN IMMEDIATE;');
 try{
  db.exec(readFileSync(new URL('./migrations/006_armor_profiles.sql',import.meta.url),'utf8'));
  if(rows(db,'PRAGMA foreign_key_check').length)fail('No se conservaron correctamente las relaciones de las armaduras');
  run(db,'INSERT INTO schema_migrations(version) VALUES(6)');db.exec('COMMIT');
 }catch(e){db.exec('ROLLBACK');throw e;}finally{db.exec('PRAGMA legacy_alter_table=OFF; PRAGMA foreign_keys=ON;');}
}
function seedEquipment(db){
 const source=(t,id)=>run(db,'INSERT OR REPLACE INTO contenido_fuentes VALUES(?,?,?,1)',t,id,'Inventario de ejemplo: pesos estimados; no canoniza precios ni carga');
 const item=(name,weight,description,category='Herramienta')=>{const id=one(db,'SELECT id FROM items_base WHERE nombre=?',name)?.id??insert(db,'items_base',{nombre:name,peso:weight,descripcion:description,categoria:category});source('items_base',id);return id;};
 const ration=item('Ración de viaje',0.7,'Una ración individual de alimentos secos. Cantidad y consumo manuales.','Consumible');
 const water=item('Cantimplora con agua (1 L)',1.2,'Incluye 1 litro de agua y un recipiente de 0,2 kg.','Contenedor');
 const torch=item('Antorcha',0.3,'Fuente de luz consumible; no otorga una bonificación automática.','Consumible');
 for(const [name,w,desc,cat] of [
 ['Mochila de viaje',1.2,'Peso de la mochila vacía. No modifica la capacidad de carga.','Contenedor'],
 ['Cuerda de cáñamo (6.6666666667 unidades)',1.5,'Ayuda contextual para trepar, asegurar cargas y rescates.','Herramienta'],
 ['Yesquero',0.1,'Pedernal, eslabón y yesca para encender fuego.','Herramienta'],
 ['Manta de lana',1.5,'Abrigo de descanso. Sus efectos dependen del entorno.','General'],
 ['Saco de dormir',2,'Aislamiento y comodidad para descansar.','General'],
 ['Kit de vendas',0.3,'Material de primeros auxilios; no sustituye una tirada de Medicina.','Consumible'],
 ['Martillo de campamento',0.8,'Herramienta para estacas y reparaciones sencillas.','Herramienta'],
 ['Estaca de hierro',0.2,'Anclaje de campamento; el peso es por unidad.','Herramienta'],
 ['Olla pequeña',0.7,'Recipiente para preparar alimentos o calentar agua.','Herramienta'],
 ['Jabón de viaje',0.1,'Higiene personal y limpieza básica de equipo.','Consumible']])item(name,w,desc,cat);
 let sword=one(db,"SELECT id FROM armas WHERE nombre='Espada larga'")?.id;
 if(!sword)sword=insert(db,'armas',{nombre:'Espada larga',tipo:'Una Mano',nivel_arma:4,tipo_dano:'Cortante / Punzante',categoria_balance:'Militar',puntos_balance_inicial:3,peso_kg:1.4,descripcion:'Espada larga militar.',skill_id:one(db,"SELECT id FROM all_skills WHERE nombre='Una Mano'").id});source('armas',sword);
 for(const [name,desc] of [['Guardia','Habilita Deflectar y Parry.'],['Multiuso','Permite elegir entre los tipos de daño del arma.']]){const id=one(db,'SELECT id FROM ventajas_arma WHERE nombre=?',name)?.id??insert(db,'ventajas_arma',{nombre:name,descripcion:desc});run(db,'INSERT OR IGNORE INTO armas_ventajas(arma_id,ventaja_id,grado_aplicado) VALUES(?,?,1)',sword,id);}
 const armor=one(db,"SELECT id FROM armaduras WHERE nombre='Cota de malla de viaje — nivel 3'")?.id??insert(db,'armaduras',{nombre:'Cota de malla de viaje — nivel 3',categoria:'Mediana',base_general:1,puntos_asignables:2,nivel_equipo:3,puntos_s:1,puntos_p:1,puntos_b:0,peso_kg:10,descripcion:'Ejemplo DMs Blacksmit: base 1; asignación S=1, P=1, B=0. Reducciones 6 / 6 / 3.'});source('armaduras',armor);
 run(db,"UPDATE items_magicos SET peso_kg=0.1 WHERE nombre='Amuleto del aprendiz — ejemplo'");
 for(const [category,level,ps,pp,pb,w,name] of [['Ligera',3,0,0,1,4,'Gambesón acolchado — nivel 3'],['Pesada',5,1,1,1,20,'Armadura de placas — nivel 5']]){
  const id=one(db,'SELECT id FROM armaduras WHERE nombre=?',name)?.id??insert(db,'armaduras',{nombre:name,categoria:category,base_general:ARMOR[category].base,puntos_asignables:ARMOR[category].puntos,nivel_equipo:level,puntos_s:ps,puntos_p:pp,puntos_b:pb,peso_kg:w,descripcion:'Diseño de ejemplo siguiendo DMs Blacksmit.'});source('armaduras',id);
 }
 const p=one(db,'SELECT id FROM personajes ORDER BY id LIMIT 1');if(p){
  insert(db,'inventario',{personaje_id:p.id,arma_id:sword,equipado:1});
  // Una sola armadura corporal activa en el prototipo.
  run(db,'UPDATE inventario SET equipado=0 WHERE personaje_id=? AND armadura_id IS NOT NULL',p.id);
  insert(db,'inventario',{personaje_id:p.id,armadura_id:armor,equipado:1});
  for(const [id,count] of [[ration,5],[water,1],[torch,3]])insert(db,'inventario',{personaje_id:p.id,item_base_id:id,cantidad:count});
 }
}
export function equipmentCatalogue(db){return {armas:rows(db,rows(db,'PRAGMA table_info(armas)').some(c=>c.name==='archivada')?'SELECT * FROM armas WHERE archivada=0':'SELECT * FROM armas'),armaduras:rows(db,'SELECT * FROM armaduras WHERE es_base>=0').map(a=>armorStats(a,a.nivel_equipo)),bases_armadura:rows(db,'SELECT * FROM bases_armadura'),bases_escudo:rows(db,'SELECT * FROM bases_escudo'),items_base:rows(db,'SELECT *,peso AS peso_kg FROM items_base').map(item=>item.escudo_base_id?{...item,...shieldStats(one(db,'SELECT * FROM bases_escudo WHERE id=?',item.escudo_base_id),1),id:item.id,categoria:item.categoria,escudo_base_id:item.escudo_base_id,descripcion:item.descripcion}:item),artefactos_arcanos:rows(db,'SELECT * FROM artefactos_arcanos'),ventajas_arma:rows(db,'SELECT * FROM ventajas_arma'),limitaciones_arma:rows(db,'SELECT * FROM limitaciones_arma'),perfiles_armadura:one(db,"SELECT name FROM sqlite_master WHERE name='perfiles_armadura'")?rows(db,'SELECT * FROM perfiles_armadura'):[],tipos_dano:DAMAGE};}
export function inventoryRows(db,personId){
 return rows(db,'SELECT * FROM inventario WHERE personaje_id=? AND retirado=0 AND cantidad>0 ORDER BY id',personId).map(i=>{
  const key=Object.keys(TARGETS).find(k=>i[k]!=null),storedElement=one(db,`SELECT * FROM ${TARGETS[key]} WHERE id=?`,i[key]);
  const element=i.armadura_id?armorStats(storedElement,i.nivel_armadura??storedElement.nivel_equipo):i.arma_id?{...storedElement,nivel_arma:i.nivel_arma??storedElement.nivel_arma,coste_oro:weaponPrice(storedElement.categoria_balance,i.nivel_arma??storedElement.nivel_arma)}:storedElement;
  const armor=i.armadura_id?element:element.armadura_id?one(db,'SELECT * FROM armaduras WHERE id=?',element.armadura_id):null;
  const weapon=i.arma_id?element:element.arma_id?one(db,'SELECT * FROM armas WHERE id=?',element.arma_id):null;
  const resolvedArmor=armor?armorStats(armor,i.nivel_armadura??armor.nivel_equipo):null;
  const shield=element.escudo_base_id?shieldStats(one(db,'SELECT * FROM bases_escudo WHERE id=?',element.escudo_base_id),i.nivel_escudo??1):null;
  const weight=Number(shield?.peso_kg??resolvedArmor?.peso_kg??element.peso_kg??element.peso??0);
  const invested=one(db,'SELECT * FROM v_adquisiciones_activas WHERE personaje_id=? AND item_id=?',personId,i.id);
  return {...i,transportado:carriedLocation(i.ubicacion)?1:0,equipado:carriedLocation(i.ubicacion)&&['Mano principal','Mano secundaria','Armadura'].includes(i.ubicacion)?i.equipado:0,nombre:element.nombre,descripcion:element.descripcion??'',tipo:key,elemento:{...element,...(shield?{coste_oro:shield.coste_oro,peso_kg:shield.peso_kg}:{})},armadura:resolvedArmor,escudo:shield,arma:weapon,peso_kg:weight,peso_total_kg:Math.round(weight*i.cantidad*1000)/1000,investido:Boolean(invested),xp_invertida:invested?.xp_invertida??0,permite_inversion_adicional:Boolean(element.permite_inversion_adicional),propiedades:weapon?rows(db,'SELECT v.nombre,v.descripcion,av.parametro_x,av.grado_aplicado FROM armas_ventajas av JOIN ventajas_arma v ON v.id=av.ventaja_id WHERE av.arma_id=?',weapon.id):[]};
 });
}
export function equipmentSummary(db,p){
 const inventory=inventoryRows(db,p.id),value=n=>p.skills.find(s=>s.nombre===n)?.valor??0;
 const defenses=[],warnings=[],attacks=[];
 for(const i of inventory){
  if(i.artefacto_id&&i.elemento.demo){
   const a=i.elemento,r=JSON.parse(a.reglas_json);
   if(r.ataque){
    const skill=p.skills.find(s=>normalizeSchool(s.nombre)===normalizeSchool(r.ataque)),stat=Math.floor(value('Voluntad')/10),level=a.nivel_item??1;
    attacks.push({item_id:i.id,nombre:i.nombre+(r.tipo==='mastin'?' · Mordida':''),equipado:Boolean(i.equipado)&&(r.tipo!=='mastin'||Boolean(i.artefacto_activo))&&i.cargas_actuales>=r.cargas_ataque,skill:skill?.nombre??r.ataque,valor:skill?.valor??0,nivel:level,tipos_dano:r.dano,pa:r.pa,dano_base:stat+level,atributo_dano:'Voluntad',formula:`NE + ${stat} (Voluntad) + ${level} (Artefacto)`,propiedades:[],artefacto:true,coste_cargas:r.cargas_ataque,nota:`${r.medio} · ${r.alcance}. ${r.tipo==='mastin'?'Requiere el cráneo activo; consume 1 carga por minuto.':'1 carga por disparo.'}`});
   }
  }
  if(i.arma){
   const w=i.arma,skill=p.skills.find(s=>s.id===w.skill_id)??p.skills.find(s=>s.nombre===w.tipo),ranged=['Arcos','Ballestas','Armas de Fuego','Arrojar','Asedio'].includes(w.tipo),subtle=i.propiedades.some(v=>['Sutil','Ágil'].includes(v.nombre));
   const sumaFuerza=!ranged||w.tipo==='Arrojar';
   const damageAttribute=subtle&&value('Agilidad')>value('Fuerza')?'Agilidad':'Fuerza';
   const stat=!sumaFuerza?0:Math.floor(value(damageAttribute)/10);
   attacks.push({item_id:i.id,nombre:i.nombre,equipado:Boolean(i.equipado),skill:skill?.nombre??w.tipo,valor:skill?.valor??value(ranged?'Proyectiles':'Melee'),nivel:w.nivel_arma,tipos_dano:w.tipo_dano,pa:1,dano_base:w.nivel_arma+stat,atributo_dano:sumaFuerza?damageAttribute:null,formula:`NE + ${w.nivel_arma}${!sumaFuerza?'':` + ${stat} (${damageAttribute}${subtle?' · mayor valor automático':''})`}`,propiedades:i.propiedades.map(v=>v.nombre)});
  }
  if(!i.equipado||!i.transportado)continue;
  if(i.armadura){const a=i.armadura;
   for(const [type,col] of [['Cortante','reduccion_s'],['Punzante','reduccion_p'],['Contundente','reduccion_b']])if(a[col]>0)defenses.push({categoria:'Mitigacion',tipo_dano:type,valor:a[col],fuente:i.nombre,descripcion:`−${a[col]} daño adicional a Dureza`});
   if(a.categoria==='Pesada'){
    warnings.push('Armadura pesada: desventaja en Sigilo.');
    const trained=p.adquisiciones.some(g=>g.dote_id&&g.elemento?.nombre==='Entrenado en Armadura Pesada');
    if(!trained||Math.floor(value('Carga')/10)<a.nivel_equipo)warnings.push('Pesada sin requisitos completos: Fuerza, Agilidad, Melee y Proyectiles Difícil; sin componentes somáticos y −1 acción por turno. La protección se conserva.');
   }
  }
  if((i.item_magico_id||i.artefacto_id)&&!i.investido)continue;
  const key=i.tipo;
  for(const d of rows(db,`SELECT * FROM equipo_defensas WHERE ${key}=?`,i[key]))defenses.push({...d,fuente:i.nombre});
 }
 attacks.push({item_id:null,nombre:'Desarmado',equipado:true,skill:'Desarmado',valor:value('Desarmado'),nivel:null,tipos_dano:null,pa:1,dano_base:Math.floor(value('Fuerza')/10),formula:`NE + ${Math.floor(value('Fuerza')/10)} (Fuerza)`,propiedades:[],nota:'Daño = NE + Nivel de Fuerza. No suma daño ni nivel de arma.'});
 const carried=inventory.filter(i=>i.transportado);
 const weapons=carried.filter(i=>i.ubicacion!=='Mochila'&&i.ubicacion!=='Carcaj'&&(i.arma||i.artefacto_id||i.elemento.categoria==='Escudo'));
 const slots=Boolean(p.exceso_espacios)||weapons.reduce((n,i)=>n+i.cantidad,0)>3||weapons.filter(i=>i.arma?.manos===2).length>1;
 const capacity=value('Carga'),speed=p.linaje?.movimiento_terrestre??6;
 const personal=personalWeight(value('Fuerza'),value('Vitalidad'),p.linaje?.escalado_vital??0);
 const total=Math.round(inventory.filter(i=>i.transportado).reduce((sum,i)=>sum+i.peso_total_kg,0)*1000)/1000;
 const backpack=carried.some(i=>i.ubicacion==='Mochila');
 if(total>capacity)warnings.push(total>capacity*2?'El peso supera el máximo de Carga Dedicada. Reasigná o soltá equipo.':'El peso supera la carga normal. Para transportarlo necesitás resolver Levantar objeto voluminoso e iniciar Carga Dedicada.');
 const state=total>=capacity&&total>0?'Encumbered':slots||total>capacity/2?'Incómodo':'Cómodo';
 return {mochila_cargada:backpack,acciones_perdidas:(backpack?1:0)+(state==='Encumbered'?1:0),pendientes:inventory.filter(i=>i.ubicacion==='Pendiente').length,peso_personal:personal,estado_carga:state,peso_comodo:capacity/2,carga_dedicada:capacity*2,
 movimiento_carga:state==='Encumbered'?speed/2:state==='Incómodo'?speed-Math.ceil(speed/4):speed,inventario:inventory,ataques:attacks,defensas: defenses,advertencias:[...new Set(warnings)],peso_kg:total,capacidad_kg:capacity,sobrecarga:state!=='Cómodo'};
}
function validateEquipment(db,personId,item){
 const current=inventoryRows(db,personId).filter(i=>i.id!==item.id&&i.equipado);
 const key=Object.keys(TARGETS).find(k=>item[k]!=null),el=one(db,`SELECT * FROM ${TARGETS[key]} WHERE id=?`,item[key]);
 const armor=key==='armadura_id'||el.armadura_id;
 if(armor)for(const other of current.filter(i=>i.armadura))run(db,'UPDATE inventario SET equipado=0 WHERE id=?',other.id);
 const weapon=key==='arma_id'?el:el.arma_id?one(db,'SELECT * FROM armas WHERE id=?',el.arma_id):null;
 const handheld=weapon||item.artefacto_id||el.categoria==='Escudo';
 if(!handheld)return null;
 const occupied=current.filter(i=>i.arma||i.artefacto_id||i.elemento.categoria==='Escudo');
 const available=['Principal','Secundaria'].filter(hand=>!occupied.some(i=>i.mano===hand||i.arma?.manos===2));
 const hand=item.mano??available[0];
 if(!available.includes(hand)||(weapon?.manos===2&&available.length!==2))fail('Debes guardar otra arma o escudo: la mano está ocupada');
 return hand;
}
export function addInventory(db,personId,b){
 const keys=Object.keys(TARGETS).filter(k=>b[k]!=null);if(keys.length!==1)fail('Selecciona exactamente un objeto');const key=keys[0],id=integer(b[key],1);
 if(!one(db,`SELECT id FROM ${TARGETS[key]} WHERE id=?`,id))fail('El objeto no existe');
 const quantity=integer(b.cantidad??1,1,key==='item_base_id'?999:1),equipped=bool(b.equipado);
 const shield=key==='item_base_id'&&one(db,'SELECT categoria FROM items_base WHERE id=?',id).categoria==='Escudo';
 if(shield&&quantity!==1)fail('Añadí cada escudo por separado');
 if(key==='item_base_id'&&!shield&&equipped)fail('Los objetos mundanos se transportan, no ocupan equipo de combate');
 const values={personaje_id:personId,[key]:id,cantidad:quantity,equipado:equipped,transportado:b.transportado===false?0:1};
 if(key==='artefacto_id')values.cargas_actuales=one(db,'SELECT cargas_maximas FROM artefactos_arcanos WHERE id=?',id).cargas_maximas;
 if(key==='arma_id')values.nivel_arma=integer(b.nivel_arma??one(db,'SELECT nivel_arma FROM armas WHERE id=?',id).nivel_arma,1,10);
 if(shield)values.nivel_escudo=integer(b.nivel_escudo??1,1,10);
 if(key==='armadura_id')values.nivel_armadura=integer(b.nivel_armadura??one(db,'SELECT nivel_equipo FROM armaduras WHERE id=?',id).nivel_equipo,1,10);
 if(equipped){values.transportado=1;values.mano=validateEquipment(db,personId,{...values,mano:b.mano});}
 return insert(db,'inventario',values);
}
export function changeInventory(db,personId,id,b){
 const current=one(db,'SELECT * FROM inventario WHERE id=? AND personaje_id=? AND retirado=0',id,personId);if(!current)fail('El objeto no pertenece a este personaje');
 if(b.nivel_armadura!==undefined){if(!current.armadura_id)fail('El objeto no es una armadura');run(db,'UPDATE inventario SET nivel_armadura=? WHERE id=?',integer(b.nivel_armadura,1,10),id);}
 const qty=b.cantidad===undefined?current.cantidad:integer(b.cantidad,0,current.item_base_id?999:1);
 const carried=b.transportado===undefined?current.transportado:bool(b.transportado),equipped=(b.equipado===undefined?current.equipado:bool(b.equipado))&&carried&&qty>0?1:0;
 const shield=current.item_base_id&&one(db,'SELECT categoria FROM items_base WHERE id=?',current.item_base_id).categoria==='Escudo';
 if(b.nivel_escudo!==undefined){if(!shield)fail('El objeto no es un escudo');run(db,'UPDATE inventario SET nivel_escudo=? WHERE id=?',integer(b.nivel_escudo,1,10),id);}
 if(shield&&qty>1)fail('Añadí cada escudo por separado');
 if(equipped&&current.item_base_id&&!shield)fail('El objeto mundano no se equipa como arma o armadura');
 const hand=equipped?validateEquipment(db,personId,{...current,mano:b.mano??current.mano}):null;
 const maxCharges=current.artefacto_id?one(db,'SELECT cargas_maximas FROM artefactos_arcanos WHERE id=?',current.artefacto_id).cargas_maximas:100000;
 run(db,'UPDATE inventario SET mano=?,cantidad=?,transportado=?,equipado=?,retirado=?,cargas_actuales=? WHERE id=?',hand,qty,carried,equipped,qty===0?1:0,b.cargas_actuales===undefined?current.cargas_actuales:integer(b.cargas_actuales,0,maxCharges),id);
}
export function customItem(db,b){
 const key=b.tipo;if(!TARGETS[key]||key==='artefacto_id')fail('Tipo de objeto personalizado inválido');
 if(typeof b.nombre!=='string'||!b.nombre.trim()||b.nombre.length>100)fail('Indica un nombre de hasta 100 caracteres');
 const description=String(b.descripcion??'').slice(0,3000),weight=number(b.peso_kg),values={nombre:b.nombre.trim(),descripcion:description};let props=[];
 if(key==='item_base_id'){values.peso=weight;values.categoria=String(b.categoria??'General');}
 else values.peso_kg=weight;
 if(key==='armadura_id'){
  const spec=b.base_id?one(db,'SELECT * FROM bases_armadura WHERE id=?',integer(b.base_id,1)):one(db,'SELECT * FROM bases_armadura WHERE categoria=? ORDER BY id DESC LIMIT 1',b.categoria);if(!spec)fail('Categoría de armadura inválida');
  if(['puntos_s','puntos_p','puntos_b','base_general','puntos_asignables'].some(k=>Object.hasOwn(b,k)))fail('Las armaduras usan perfiles fijos; ya no se reparten puntos');
  Object.assign(values,{categoria:spec.categoria,base_id:spec.id,nivel_equipo:integer(b.nivel,1,10),multiplicador_s:spec.multiplicador_s,multiplicador_p:spec.multiplicador_p,multiplicador_b:spec.multiplicador_b});
 }
 if(key==='arma_id'){
  const skill=one(db,"SELECT * FROM all_skills WHERE id=? AND combate=1 AND tipo='Habilidad'",integer(b.skill_id,1));if(!skill)fail('Selecciona una habilidad de combate');
  const balance={Burda:0,Cotidiana:1,Militar:3}[b.categoria];if(balance===undefined)fail('Categoría de arma inválida');
  if(![...DAMAGE,'Punzante / Cortante','Punzante / Contundente','Cortante / Contundente'].includes(b.tipo_dano))fail('Tipo de daño inválido');
  Object.assign(values,{tipo:skill.nombre,skill_id:skill.id,categoria_balance:b.categoria,puntos_balance_inicial:balance,nivel_arma:integer(b.nivel,1,10),tipo_dano:b.tipo_dano,manos:integer(b.manos??1,1,2)});
  if(!Array.isArray(b.propiedades??[]))fail('Propiedades inválidas');props=b.propiedades??[];let net=balance;const seen=new Set();
  for(const prop of props){const table=prop.tipo==='Ventaja'?'ventajas_arma':prop.tipo==='Limitacion'?'limitaciones_arma':null;if(!table)fail('Propiedad inválida');if(seen.has(prop.tipo+prop.id))fail('Propiedad duplicada');seen.add(prop.tipo+prop.id);const row=one(db,`SELECT * FROM ${table} WHERE id=?`,integer(prop.id,1));if(!row)fail('Propiedad inexistente');net+=(prop.tipo==='Ventaja'?-1:1)*integer(prop.grado,0,3);}
  // El balance es informativo mientras se cierra el catálogo.
 }
 if(key==='item_magico_id')Object.assign(values,{costo_xp_sintonia:integer(b.costo_xp??1,0,100),permite_inversion_adicional:bool(b.permite_inversion_adicional)});
 const id=insert(db,TARGETS[key],values);
 for(const prop of props){const positive=prop.tipo==='Ventaja',row=one(db,`SELECT * FROM ${positive?'ventajas_arma':'limitaciones_arma'} WHERE id=?`,prop.id);const parameter=positive&&row.usa_formula_mitad_nivel?String(Math.ceil(values.nivel_arma/2)):String(prop.parametro??'').slice(0,80);insert(db,positive?'armas_ventajas':'armas_limitaciones',{arma_id:id,[positive?'ventaja_id':'limitacion_id']:prop.id,grado_aplicado:prop.grado,parametro_x:parameter});}
 if(!Array.isArray(b.defensas??[]))fail('Defensas inválidas');
 for(const d of b.defensas??[]){if(!['Resistencia','Debilidad','Mitigacion','Fragilidad'].includes(d.categoria)||!DAMAGE.includes(d.tipo_dano))fail('Defensa especial inválida');insert(db,'equipo_defensas',{[key]:id,categoria:d.categoria,tipo_dano:d.tipo_dano,valor:['Mitigacion','Fragilidad'].includes(d.categoria)?number(d.valor,0.001,1000):null,descripcion:String(d.descripcion??'').slice(0,500)});}
 run(db,'INSERT INTO contenido_fuentes VALUES(?,?,?,0)',TARGETS[key],id,'Objeto personalizado del narrador');return {[key]:id};
}
