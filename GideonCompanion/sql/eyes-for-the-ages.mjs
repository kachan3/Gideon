import {readFileSync} from 'node:fs';
import {installEpiphanies} from './epiphanies.mjs';

const source=readFileSync(new URL('../../20_Contenido/Dotes/Ojos_para_las_Eras.md',import.meta.url),'utf8');
const prediction=source.slice(source.indexOf('## Mecánica'),source.indexOf('## Efectos')).trim();
export const eyesForTheAges={
 nombre:'Eyes for the Ages / Ojos para las Eras',escuela:'Cronibor',archivo:'Ojos_para_las_Eras.md',
 efectos:[
  {nombre:'Predicción',descripcion:'Obtienes Predicción (1) sobre cada objetivo, criatura u objeto. 2 PL para el primero y +1 PL por cada subsiguiente.\n\n'+prediction,pl_minimo:2,componentes:'Susurro',intervalo_duracion:'Instantánea',concentracion:'Ninguna',pl_escalable:1,aspecto_escalable:'Objetivos',escalado_texto:'2 PL para un objetivo, criatura u objeto; cada PL adicional añade otro objetivo. Cada uno recibe Predicción (1).'},
  {nombre:'Adivinación rápida',descripcion:'Meditas y experimentas una visión genuina del futuro: realizas tantas acciones como PL del efecto. La secuencia es enteramente mental; al finalizar estás en el estado y momento del lanzamiento. Sus acciones y tiradas constituyen predicciones reales y se rigen por Predicción.\n\n'+prediction,pl_minimo:2,componentes:'Motriz, Motriz Fino',intervalo_duracion:'Instantánea',concentracion:'Exhaustiva',pl_escalable:1,aspecto_escalable:'Acciones previstas',escalado_texto:'2 PL permiten prever 2 acciones; cada PL adicional añade 1 acción.',reglas:{mediums:['Self'],shapes:['Efecto Directo']}}
 ],
 truco:{nombre:'Reconstrucción',componentes:'Motriz',medium:'Un punto que puedas sentir',shape:'Efecto Directo',pa:1,alcance:'Hasta donde puedas localizar el objeto mediante un sentido preciso propio.',intervalo_duracion:'Instantánea',concentracion:'Ninguna',opciones:[{id:'reconstruir',nombre:'Reconstruir el último cambio del objeto',recurso:'Mana',coste:1,variable:false}],descripcion:'Apuntas a un objeto que puedas sentir y rebobinas su historia en tu mente. Observas su estado anterior, lo sucedido y cómo ocurrió el cambio. Acontecimientos posteriores pueden ensuciar el registro: si un candado fue movido después de romperse, lo último recordado es el traslado.'},
 mistica:'Conciencia atemporal'
};

export function migrateEyesForTheAges(db){
 const id=(table,name)=>db.prepare(`SELECT id FROM ${table} WHERE nombre=?`).get(name).id;
 // Conservar el identificador de una entrada anterior, si existiese.
 if(!db.prepare('SELECT id FROM epifanias WHERE nombre=?').get(eyesForTheAges.nombre)){
  const old=db.prepare("SELECT id FROM epifanias WHERE nombre IN ('Eyes for the Ages','Ojos para las Eras') ORDER BY id LIMIT 1").get();
  if(old)db.prepare('UPDATE epifanias SET nombre=? WHERE id=?').run(eyesForTheAges.nombre,old.id);
 }
 installEpiphanies(db,[eyesForTheAges],{
  pointId:id('mediums','Un punto que puedas sentir'),creatureId:id('mediums','A creature you can detect'),
  shapeIds:db.prepare("SELECT id FROM shapes WHERE nombre IN ('Efecto Directo','Objetivo Único','Proyectil','Cono (30u)','Cono (60u)','Esfera (15u)','Esfera (30u)','Línea (60u)','Anillo')").all().map(s=>s.id)
 });
 db.prepare('INSERT INTO schema_migrations(version) VALUES(35)').run();
}
