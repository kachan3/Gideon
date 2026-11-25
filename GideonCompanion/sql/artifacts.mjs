import {readFileSync} from 'node:fs';
import {addInventory} from './equipment.mjs';
import {spendResource} from './magic.mjs';
const one=(db,q,...a)=>db.prepare(q).get(...a);
const fail=m=>{throw Error(m);};
export const artifactDefinitions=[
 {nombre:'Blunderblaze',escuela:'Ignamor',max:6,ratio:3,compatible:'Bastón',natural:'Una vez al día, 1 hora en brasas calientes o fuego.',reglas:{tipo:'blunderblaze',ataque:'Ignamor',dano:'Fuego',fuente:'Física',medio:'Proyectil',alcance:'1.2 unidades',pa:1,cargas_ataque:1}},
 {nombre:'Varita del Amanecer',escuela:'Ignamor / Naial',max:5,ratio:1,compatible:'Según compatibilidad física con la herramienta dedicada.',natural:'La primera vez que recibe luz solar cada día.',reglas:{tipo:'varita',alcance:'6 unidades de luz brillante',acciones:[{id:'luz',nombre:'Iluminar 1 hora',pa:1,cargas:1},{id:'destello',nombre:'Destello',pa:2,cargas:3}]}},
 {nombre:'Mastín de Huesos',escuela:'Yrgramar',max:3,ratio:1,compatible:'Libro de Conjuros o Arma; la vara puede dedicarse como Bastón.',natural:'1 carga cada 8 horas de inactividad, mientras el esqueleto duerme.',reglas:{tipo:'mastin',ataque:'Yrgramar',dano:'Cortante espiritual',medio:'Melee',alcance:'El cráneo permanece a un máximo de 3 bloques del portador.',pa:1,cargas_ataque:0,manifestar_pa:2}}
];
export function migrateArtifacts(db){
 db.exec(readFileSync(new URL('./migrations/036_arcane_artifacts.sql',import.meta.url),'utf8'));
 const text=readFileSync(new URL('../../20_Contenido/Senda_Arcanista/Arcanista_03_Epifanias_y_Artefactos.md',import.meta.url),'utf8');
 for(const def of artifactDefinitions){
  let existing=one(db,'SELECT id FROM artefactos_arcanos WHERE nombre=?',def.nombre);
  if(!existing&&def.nombre==='Blunderblaze')existing=one(db,"SELECT id FROM artefactos_arcanos WHERE nombre IN ('Bastón de Brasas','Blunderbrass') LIMIT 1");
  const start=text.indexOf(def.nombre,text.indexOf('#### ')),end=text.indexOf('\n###',start);
  const description=text.slice(start,end<0?undefined:end).trim();
  const values={nombre:def.nombre,escuela:def.escuela,cargas_maximas:def.max,coste_cargas_activacion:1,tasa_conversion_mana_cargas:`1 Maná = ${def.ratio} carga(s)`,tiempo_recarga_natural:def.natural,herramienta_compatible:def.compatible,descripcion:description,demo:1,reglas_json:JSON.stringify({...def.reglas,conversion:def.ratio}),tiene_nivel:1,nivel_item:1};
  const keys=Object.keys(values);let id=existing?.id;
  if(id)db.prepare(`UPDATE artefactos_arcanos SET ${keys.map(k=>k+'=?').join(',')} WHERE id=?`).run(...Object.values(values),id);
  else id=Number(db.prepare(`INSERT INTO artefactos_arcanos(${keys.join(',')}) VALUES(${keys.map(()=>'?').join(',')})`).run(...Object.values(values)).lastInsertRowid);
  db.prepare('INSERT OR REPLACE INTO contenido_fuentes VALUES(?,?,?,0)').run('artefactos_arcanos',id,'20_Contenido/Senda_Arcanista/Arcanista_03_Epifanias_y_Artefactos.md');
 }
 // Las elecciones ya guardadas conservan su objeto y no vuelven a cobrar recursos.
 for(const c of db.prepare("SELECT * FROM personajes_elecciones_rasgos WHERE codigo='artefacto'").all()){
  let name;try{name=JSON.parse(c.valor);}catch{continue;}
  if(['Bastón de Brasas','Blunderbrass'].includes(name))name='Blunderblaze';
  const artifact=one(db,'SELECT id FROM artefactos_arcanos WHERE nombre=? AND demo=1',name);if(!artifact)continue;
  db.prepare("UPDATE personajes_elecciones_rasgos SET valor=? WHERE personaje_id=? AND codigo='artefacto'").run(JSON.stringify(name),c.personaje_id);
  if(!one(db,'SELECT id FROM inventario WHERE personaje_id=? AND artefacto_id=?',c.personaje_id,artifact.id))addInventory(db,c.personaje_id,{artefacto_id:artifact.id});
 }
 db.prepare('INSERT INTO schema_migrations(version) VALUES(36)').run();
}

export function useArtifact(db,p,b){
 const item=p.equipo.inventario.find(i=>i.id===b.inventario_id&&i.artefacto_id&&i.elemento.demo);
 if(!item)fail('Artefacto ajeno o no disponible');
 const a=item.elemento,r=JSON.parse(a.reglas_json),n=b.cantidad??1;
 if(!Number.isSafeInteger(n)||n<1||n>99)fail('Cantidad inválida');
 const charge=cost=>{if(item.cargas_actuales<cost)fail('Cargas insuficientes');db.prepare('UPDATE inventario SET cargas_actuales=cargas_actuales-? WHERE id=?').run(cost,item.id);};
 if(b.operacion==='recargar_mana'){
  if(item.cargas_actuales>=a.cargas_maximas)fail('El artefacto ya está cargado');
  if(n>Math.ceil((a.cargas_maximas-item.cargas_actuales)/r.conversion))fail('No se necesita tanto Maná');
  spendResource(db,p,'Mana',n);
  db.prepare('UPDATE inventario SET cargas_actuales=MIN(?,cargas_actuales+?) WHERE id=?').run(a.cargas_maximas,n*r.conversion,item.id);return;
 }
 if(b.operacion==='recarga_natural'){
  if(b.condicion!==true)fail('Confirma las condiciones de recarga en mesa');
  if(item.cargas_actuales>=a.cargas_maximas)fail('El artefacto ya está cargado');
  if(r.tipo!=='mastin'){
   const day=String(b.dia??'').trim();if(!day||day.length>80)fail('Indica el día de la partida');
   if(day===item.ultima_recarga_dia)fail('Ya se recargó en ese día');
   db.prepare('UPDATE inventario SET cargas_actuales=?,ultima_recarga_dia=? WHERE id=?').run(a.cargas_maximas,day,item.id);
  }else{
   if(item.artefacto_activo)fail('El esqueleto debe estar inactivo para dormir');
   db.prepare('UPDATE inventario SET cargas_actuales=MIN(?,cargas_actuales+1) WHERE id=?').run(a.cargas_maximas,item.id);
  }
  return;
 }
 if(!item.equipado||!item.transportado)fail('Coloca el artefacto en una mano antes de usarlo');
 if(p.derivados.estado!=='Activo'||p.estados.some(s=>['Inconsciente','Dormido'].includes(s.nombre)))fail('Tu estado impide usar el artefacto');
 if(b.operacion==='apagar'){
  db.prepare('UPDATE inventario SET artefacto_activo=0 WHERE id=?').run(item.id);return;
 }
 if(r.tipo==='varita'){
  const action=r.acciones.find(x=>x.id===b.operacion);if(!action)fail('Acción de artefacto inválida');charge(action.cargas);
  if(action.id==='luz')db.prepare('UPDATE inventario SET artefacto_activo=1 WHERE id=?').run(item.id);
  return;
 }
 if(r.tipo==='mastin'&&['manifestar','minuto'].includes(b.operacion)){
  if(b.operacion==='manifestar'&&item.artefacto_activo)fail('El cráneo ya está manifestado');
  if(b.operacion==='minuto'&&!item.artefacto_activo)fail('Primero manifiesta el cráneo');
  charge(1);db.prepare('UPDATE inventario SET artefacto_activo=1 WHERE id=?').run(item.id);return;
 }
 fail('Acción de artefacto inválida');
}
