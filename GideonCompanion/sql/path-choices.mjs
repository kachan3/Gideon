import {readFileSync} from 'node:fs';
import {createTrait} from './traits.mjs';
import {linkPathTrait} from './path-traits.mjs';
import {pathContent} from './paths.mjs';

const rows = (db, sql, ...args) => db.prepare(sql).all(...args);
const one = (db, sql, ...args) => db.prepare(sql).get(...args);
const run = (db, sql, ...args) => db.prepare(sql).run(...args);
const idOf = result => Number(result.lastInsertRowid);

export function migrateDevotion(db) {
  db.exec(readFileSync(new URL('./migrations/019_devotion.sql', import.meta.url), 'utf8'));
  const content = JSON.parse(readFileSync(new URL('../content/Sendas/hierofante.json', import.meta.url), 'utf8'));
  const source = '20_Contenido/Senda_Hierofante/';
  const path = pathContent.sendas.find(s => s.nombre === 'Senda del Hierofante');
  const senda = one(db, 'SELECT id FROM clases WHERE nombre=?', path.nombre).id;
  run(db, 'UPDATE clases_origen SET elecciones=? WHERE clase_id=?', JSON.stringify(path.elecciones), senda);
  const selector = createTrait(db, {
    nombre: 'Elegir un Dogma',
    descripcion: 'Responde la pregunta de Senda para recibir la Plegaria, Intervenciones y Milagro iniciales del Dogma elegido.'
  });
  const vinculo = linkPathTrait(db, {clase_id: senda, rasgo_id: selector, xp_requerida: 0, inicial: true});
  const pregunta = idOf(run(db, 'INSERT INTO preguntas_rasgos_senda(clase_rasgo_id,texto) VALUES(?,?)',
    vinculo.id, '¿Qué Dogma del Bien Mayor seguís?'));
  const dogmas = new Map();
  function addAction(action) {
    const id = idOf(run(db, `INSERT INTO acciones(nombre,tipo,nro_acciones_pa,coste_mana,coste_omen,es_reaccion,descripcion)
      VALUES(?,?,?,?,?,?,?)`, action.nombre, action.tipo, action.pa, action.mana,
      action.omen ?? 0, Number(action.reaccion ?? false), action.descripcion));
    run(db, 'INSERT INTO contenido_fuentes VALUES(?,?,?,0)', 'acciones', id, source);
    return id;
  }
  for (const dogma of content.dogmas) {
    const rasgo = createTrait(db, {nombre: dogma.nombre, descripcion: dogma.descripcion});
    dogmas.set(dogma.codigo, rasgo);
    run(db, 'INSERT INTO opciones_rasgos_senda(pregunta_id,rasgo_id) VALUES(?,?)', pregunta, rasgo);
    const p = dogma.plegaria;
    const plegaria = idOf(run(db, `INSERT INTO hierophant_passives(nombre,activacion,tirada,duracion,descripcion)
      VALUES(?,?,?,?,?)`, p.nombre, p.activacion, p.tirada, p.duracion, p.descripcion));
    run(db, 'INSERT INTO rasgos_plegarias VALUES(?,?)', rasgo, plegaria);
    for (const action of dogma.acciones) {
      run(db, 'INSERT INTO rasgos_acciones VALUES(?,?)', rasgo, addAction(action));
    }
  }
  const feat = content.dote;
  const dote = idOf(run(db, `INSERT INTO dotes(nombre,tipo,clase_id,es_exclusivo_clase,costo_xp,descripcion)
    VALUES(?,'Senda',?,1,?,?)`, feat.nombre, senda, feat.xp, feat.descripcion));
  run(db, 'INSERT INTO contenido_fuentes VALUES(?,?,?,0)', 'dotes', dote, source + 'Hierofante_03_Dotes_de_Senda.md');
  run(db, 'INSERT INTO requisitos_dotes_rasgos VALUES(?,?)', dote, dogmas.get(feat.dogma));
  run(db, 'INSERT INTO dotes_acciones VALUES(?,?)', dote, addAction(feat.accion));
  run(db, 'INSERT INTO schema_migrations(version) VALUES(19)');
}

export function pathQuestions(db, characterId) {
  const questions = characterId === undefined
    ? rows(db, `SELECT q.*, cr.clase_id, cr.es_insignia FROM preguntas_rasgos_senda q
        JOIN clases_rasgos cr ON cr.id=q.clase_rasgo_id ORDER BY q.id`)
    : rows(db, `SELECT q.*, cr.clase_id, cr.es_insignia, pe.opcion_id FROM preguntas_rasgos_senda q
        JOIN v_rasgos_senda_estado cr ON cr.id=q.clase_rasgo_id AND cr.personaje_id=? AND cr.activo=1
        LEFT JOIN personajes_elecciones_senda pe ON pe.pregunta_id=q.id AND pe.personaje_id=cr.personaje_id
        ORDER BY q.id`, characterId);
  return questions.map(question => ({
    ...question,
    opciones: rows(db, `SELECT o.id, r.id AS rasgo_id, r.nombre, r.descripcion
      FROM opciones_rasgos_senda o JOIN rasgos r ON r.id=o.rasgo_id
      WHERE o.pregunta_id=? ORDER BY o.id`, question.id)
  }));
}

export function validateCreationChoices(questions, classId, answers = {}) {
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) throw Error('Elecciones de Senda inválidas');
  const required = questions.filter(q => q.clase_id === classId && q.es_insignia);
  if (Object.keys(answers).some(id => !required.some(q => String(q.id) === id))) {
    throw Error('La pregunta no pertenece a esta Senda');
  }
  for (const question of required) {
    if (!question.opciones.some(option => option.id === answers[question.id])) throw Error(question.texto);
  }
  return required.map(q => ({pregunta_id: q.id, opcion_id: answers[q.id]}));
}

export function recordPathChoice(db, characterId, {pregunta_id, opcion_id}) {
  const question = pathQuestions(db, characterId).find(q => q.id === pregunta_id);
  if (!question?.opciones.some(option => option.id === opcion_id)) throw Error('Elección de Senda inválida');
  if (question.opcion_id === opcion_id) return;
  if (question.opcion_id != null) throw Error('La elección de Senda ya está registrada');
  run(db, 'INSERT INTO personajes_elecciones_senda VALUES(?,?,?)', characterId, pregunta_id, opcion_id);
}

export function characterPrayers(db, character) {
  const prayers = new Map();
  const grant = (prayer, source) => {
    if (!prayers.has(prayer.id)) prayers.set(prayer.id, {...prayer, fuentes: []});
    const sources = prayers.get(prayer.id).fuentes;
    if (!sources.includes(source)) sources.push(source);
  };
  for (const trait of character.rasgos) {
    for (const prayer of rows(db, `SELECT p.* FROM hierophant_passives p
      JOIN rasgos_plegarias rp ON rp.plegaria_id=p.id WHERE rp.rasgo_id=?`, trait.id)) grant(prayer, trait.nombre);
  }
  for (const acquisition of character.adquisiciones.filter(a => a.dote_id)) {
    for (const prayer of rows(db, `SELECT p.* FROM hierophant_passives p
      JOIN dotes_plegarias dp ON dp.plegaria_id=p.id WHERE dp.dote_id=?`, acquisition.dote_id)) {
      grant(prayer, acquisition.elemento.nombre);
    }
  }
  return [...prayers.values()];
}
