import {readFileSync} from 'node:fs';
import {distancesToUnits,distanceDataToUnits,metricDistancesToUnits} from '../js/distance-units.js';
export const toolNames=['Libro de Conjuros','Bastón','Espada'];
const one=(db,q,...a)=>db.prepare(q).get(...a);
export function refreshDistanceDescriptions(db){
 const wind=readFileSync(new URL('../content/Linajes/hijos_del_viento.xml',import.meta.url),'utf8');
 const description=wind.match(/<rasgo nombre="Ligereza">([^<]+)<\/rasgo>/)?.[1]?.trim();
 if(description)for(const table of ['rasgos','dotes'])db.prepare(`UPDATE ${table} SET descripcion=? WHERE nombre='Ligereza'`).run(description);
}
export function casterToolState(db,p){
 const chosen=p.elecciones_rasgos?.find(e=>e.tipo==='Herramienta')?.valor??null;
 db.prepare('INSERT OR IGNORE INTO lanzador_turnos(personaje_id) VALUES(?)').run(p.id);
 const row=one(db,'SELECT * FROM lanzador_turnos WHERE personaje_id=?',p.id),pending=row.repeticion?JSON.parse(row.repeticion):null;
 const last=one(db,'SELECT id FROM tiradas WHERE personaje_id=? ORDER BY id DESC LIMIT 1',p.id);
 return {nombre:chosen,turno:row.turno,libro_disponible:chosen==='Libro de Conjuros'&&row.libro_turno!==row.turno,repetible:chosen==='Libro de Conjuros'&&row.libro_turno!==row.turno&&pending?.roll_id===last?.id&&pending?.turno===row.turno?{id:pending.roll_id,canalizacion_id:pending.active.id}:null};
}
export function migrateCasterTools(db){
 db.exec(readFileSync(new URL('./migrations/037_caster_tools_units.sql',import.meta.url),'utf8'));
 const description=readFileSync(new URL('../../20_Contenido/Herramientas_del_Lanzador.md',import.meta.url),'utf8');
 db.prepare("UPDATE dotes SET descripcion=? WHERE nombre='La Herramienta Correcta'").run(description);
 db.prepare("UPDATE rasgos SET descripcion=? WHERE nombre='La Herramienta Correcta'").run(description);
 // Convertir las distancias persistidas sin tocar datos numéricos que no sean distancias.
 for(const {name:table} of db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all()){
  const columns=db.prepare(`PRAGMA table_info("${table}")`).all();
  const texts=columns.filter(c=>/TEXT/i.test(c.type));if(!texts.length)continue;
  const rows=db.prepare(`SELECT rowid AS _rowid,* FROM "${table}"`).all();
  for(const row of rows)for(const col of texts){
   const old=row[col.name];if(typeof old!=='string')continue;
   let value=distancesToUnits(old);
   if(/cuerda de c[aá][ñn]amo/i.test(value))value=metricDistancesToUnits(value);
   try{const data=JSON.parse(old),converted=distanceDataToUnits(data);if(JSON.stringify(data)!==JSON.stringify(converted))value=JSON.stringify(converted);}catch{}
   if(value!==old)db.prepare(`UPDATE "${table}" SET "${col.name}"=? WHERE rowid=?`).run(value,row._rowid);
  }
 }
 for(const table of ['rasgos_modificadores','dotes_efectos'])db.prepare(`UPDATE ${table} SET valor=valor/5.0,unidad='unidades' WHERE lower(unidad) IN ('pies','feet','ft','feets')`).run();
 for(const table of ['rasgos_modificadores','dotes_efectos'])db.prepare(`UPDATE ${table} SET valor=valor/1.5,unidad='unidades' WHERE lower(unidad) IN ('m','metro','metros')`).run();
 refreshDistanceDescriptions(db);
 db.prepare('INSERT INTO schema_migrations(version) VALUES(37)').run();
}
