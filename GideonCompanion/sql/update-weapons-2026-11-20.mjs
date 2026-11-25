import {DatabaseSync} from 'node:sqlite';
import {copyFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const path = fileURLToPath(new URL('./gideon_companion.db', import.meta.url));
const backup = `${path}.before-weapons-2026-11-20.bak`;
if (!existsSync(backup)) copyFileSync(path, backup);
const db = new DatabaseSync(path);
db.exec('PRAGMA foreign_keys=ON; BEGIN IMMEDIATE');
try {
  // Costs not explicitly ratified remain reference proposals in the descriptions.
  const advantages = [
    ['Versátil',0,0,'Activa la propiedad indicada en parametro_x al usar dos manos. Coste 0 incluida esa propiedad.'],
    ['Ágil',2,0,'Permite elegir Fuerza o Agilidad para calcular el daño.'],
    ['Veloz',1,0,'Evita Arrebatado si solo usaste armas veloces, hiciste como máximo dos ataques y la última acción fue un ataque veloz.'],
    ['Guardia',0,0,'Habilita Deflectar y Parry. Incompatible con A Distancia.'],
    ['Multiuso',1,0,'Permite elegir el tipo de daño del arma.'],
    ['Multiuso (P/S)',1,0,'Permite elegir daño Punzante o Cortante.'],
    ['Multiuso (P/B)',1,0,'Permite elegir daño Punzante o Contundente.'],
    ['Multiuso (S/B)',1,0,'Permite elegir daño Cortante o Contundente.'],
    ['Ventaja de Rango',1,0,'Para contraatacar, el oponente requiere esta propiedad, salvo condiciones particulares.'],
    ['Alcance',3,0,'Permite atacar melee a 2 bloques.'],
    ['Penetración',2,1,'X = mitad del nivel redondeada hacia arriba. Si alcanza Protección la ignora, si no suma X al daño. Coste de referencia propuesto.'],
    ['Wounding',2,1,'Inflige X heridas adicionales. X = mitad del nivel redondeada hacia arriba. Coste de referencia propuesto.'],
    ['Brutal',2,0,'En un crítico duplica el componente Daño del Arma. Coste de referencia propuesto.'],
    ['Resistente',1,0,'Conserva su daño aunque pierda durabilidad.'],
    ['Arrojadiza',2,0,'Permite Arrojar con NE + Daño del Arma + Nivel de Fuerza y Apuntar. Coste de referencia propuesto.'],
    ['A Distancia',0,0,'Usa Disparar. No puede tener Guardia ni recibir puntos por Carece de Guardia.'],
    ['Ejecución',2,0,'Contra una criatura en su límite de heridas, una acción adicional garantiza una herida. Coste de referencia propuesto.']
  ];
  db.prepare("UPDATE ventajas_arma SET nombre='Ágil' WHERE nombre='Sutil' AND NOT EXISTS(SELECT 1 FROM ventajas_arma WHERE nombre='Ágil')").run();
  for (const [name,cost,formula,description] of advantages) {
    db.prepare('INSERT INTO ventajas_arma(nombre,grado_coste,usa_formula_mitad_nivel,descripcion) VALUES(?,?,?,?) ON CONFLICT(nombre) DO UPDATE SET grado_coste=excluded.grado_coste,usa_formula_mitad_nivel=excluded.usa_formula_mitad_nivel,descripcion=excluded.descripcion').run(name,cost,formula,description);
    db.prepare('UPDATE armas_ventajas SET grado_aplicado=? WHERE ventaja_id=(SELECT id FROM ventajas_arma WHERE nombre=?)').run(cost,name);
  }
  const limitations = [
    ['Carece de Guardia',1,'Impide Deflectar y Parry. No devuelve puntos en armas A Distancia.'],
    ['Desventaja de Rango',1,'En acciones que requieren Ventaja de Rango, solo cumple la condición frente a otra arma con Desventaja de Rango.'],
    ['Complicada',1,'−10 a los ataques con el arma.'],['Difícil',2,'−20 a los ataques con el arma.'],['Muy Difícil',3,'−30 a los ataques con el arma.'],
    ['Torpe',1,'Evasión exitosa con NE >= X evita el impacto. X=5 devuelve 1, X=2 devuelve 2, X=0 devuelve 3.'],
    ['Recarga',2,'Tras cada disparo requiere una acción y una mano libre. Obligatoria en ballestas. Devolución de referencia propuesta.'],
    ['A Dos Manos',2,'Requiere mano principal y soporte. Obligatoria en arcos. Devolución de referencia propuesta.'],
    ['Pesada',2,'Requiere X de Fuerza. Sin requisito penaliza ataque y daño y pierde ventajas. Devolución de referencia propuesta.'],
    ['Special Training',3,'Sin el dote correspondiente reduce habilidad marcial a la mitad y pierde propiedades positivas. Devolución de referencia propuesta.'],
    ['Lenta',3,'X acciones adicionales por ataque. Lenta(1) agrega una acción a los combos excepto Golpe Brutal. Devolución de referencia propuesta.'],
    ['Imprecisa',1,'Sin X de Instinto la tirada es Muy Difícil o peor. Devolución de referencia propuesta.']
  ];
  for (const [name,cost,description] of limitations) db.prepare('INSERT INTO limitaciones_arma(nombre,grado_devolucion,descripcion) VALUES(?,?,?) ON CONFLICT(nombre) DO UPDATE SET grado_devolucion=excluded.grado_devolucion,descripcion=excluded.descripcion').run(name,cost,description);
  const weapons = [
    ['Daga','Militar','Punzante',['Veloz','Ágil','Arrojadiza'],[['Carece de Guardia',null],['Desventaja de Rango',null]]],
    ['Espada larga','Militar','Punzante / Cortante',['Guardia','Multiuso (P/S)','Ventaja de Rango','Versátil'],[]],
    ['Hacha de batalla','Militar','Cortante',['Brutal','Wounding'],[['Carece de Guardia',null]]],
    ['Martillo de guerra','Militar','Contundente',['Penetración','Resistente'],[['Carece de Guardia',null]]],
    ['Pica','Militar','Punzante',['Alcance','Penetración'],[['Pesada','70']]],
    ['Pala','Burda','Cortante',['Wounding'],[['A Dos Manos',null]]],
    ['Espadón','Militar','Cortante',['Guardia','Brutal','Ventaja de Rango'],[['A Dos Manos',null]]],
    ['Arco largo','Militar','Punzante',['A Distancia','Penetración','Resistente'],[['A Dos Manos',null]]],
    ['Bastón','Cotidiana','Contundente',['Guardia','Ventaja de Rango'],[]],
    ['Ballesta de caza','Cotidiana','Punzante',['A Distancia','Penetración'],[['Recarga',null]]],
    ['Piedra','Burda','Contundente',['Arrojadiza'],[['Carece de Guardia',null],['Complicada',null]]],
    ['Porra','Cotidiana','Contundente',['Guardia'],[]]
  ];
  db.prepare("UPDATE armas SET puntos_balance_inicial=3 WHERE categoria_balance='Militar'").run();
  for (const [name,category,damage,positive,negative] of weapons) {
    let id = db.prepare('SELECT id FROM armas WHERE nombre=?').get(name)?.id;
    const description = 'Catálogo funcional en revisión. Balance pendiente de cierre.';
    const type = name==='Arco largo'?'Arcos':name==='Ballesta de caza'?'Ballestas':name==='Piedra'?'Arrojar':['Pala','Pica','Espadón'].includes(name)?'A Dos Manos':'Una Mano';
    const hands = ['Pala','Pica','Espadón','Arco largo'].includes(name)?2:1;
    const budget = {Militar:3,Cotidiana:1,Burda:0}[category];
    const skill = db.prepare('SELECT id FROM all_skills WHERE nombre=?').get(type).id;
    if (!id) id = Number(db.prepare('INSERT INTO armas(nombre,tipo,categoria_balance,puntos_balance_inicial,tipo_dano,descripcion,manos,skill_id) VALUES(?,?,?,?,?,?,?,?)').run(name,type,category,budget,damage,description,hands,skill).lastInsertRowid);
    db.prepare('UPDATE armas SET tipo=?,categoria_balance=?,puntos_balance_inicial=?,tipo_dano=?,descripcion=?,manos=?,skill_id=? WHERE id=?').run(type,category,budget,damage,description,hands,skill,id);
    db.prepare('DELETE FROM armas_ventajas WHERE arma_id=?').run(id);
    db.prepare('DELETE FROM armas_limitaciones WHERE arma_id=?').run(id);
    for (const property of positive) {
      const v=db.prepare('SELECT id,grado_coste FROM ventajas_arma WHERE nombre=?').get(property);
      db.prepare('INSERT INTO armas_ventajas VALUES(?,?,?,?)').run(id,v.id,property==='Versátil'?'Wounding':null,v.grado_coste);
    }
    for (const [property,parameter] of negative) {
      const v=db.prepare('SELECT id,grado_devolucion FROM limitaciones_arma WHERE nombre=?').get(property);
      db.prepare('INSERT INTO armas_limitaciones VALUES(?,?,?,?)').run(id,v.id,parameter,v.grado_devolucion);
    }
  }
  db.exec('COMMIT');
  console.log(JSON.stringify({loaded:weapons.map(w=>w[0]),foreignKeyErrors:db.prepare('PRAGMA foreign_key_check').all()}));
} catch(error) { db.exec('ROLLBACK'); throw error; }
finally { db.close(); }
