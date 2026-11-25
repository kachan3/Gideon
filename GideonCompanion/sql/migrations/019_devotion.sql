CREATE TABLE preguntas_rasgos_senda (
 id INTEGER PRIMARY KEY,
 clase_rasgo_id INTEGER NOT NULL REFERENCES clases_rasgos(id),
 texto TEXT NOT NULL
);
CREATE TABLE opciones_rasgos_senda (
 id INTEGER PRIMARY KEY,
 pregunta_id INTEGER NOT NULL REFERENCES preguntas_rasgos_senda(id),
 rasgo_id INTEGER NOT NULL REFERENCES rasgos(id),
 UNIQUE(pregunta_id, rasgo_id),
 UNIQUE(pregunta_id, id)
);
CREATE TABLE personajes_elecciones_senda (
 personaje_id INTEGER NOT NULL REFERENCES personajes(id),
 pregunta_id INTEGER NOT NULL,
 opcion_id INTEGER NOT NULL,
 PRIMARY KEY(personaje_id, pregunta_id),
 FOREIGN KEY(pregunta_id, opcion_id) REFERENCES opciones_rasgos_senda(pregunta_id, id)
);
CREATE TABLE hierophant_passives (
 id INTEGER PRIMARY KEY,
 nombre TEXT NOT NULL UNIQUE,
 activacion TEXT NOT NULL,
 tirada TEXT NOT NULL,
 duracion TEXT NOT NULL,
 descripcion TEXT NOT NULL
);
CREATE TABLE rasgos_plegarias (
 rasgo_id INTEGER NOT NULL REFERENCES rasgos(id),
 plegaria_id INTEGER NOT NULL REFERENCES hierophant_passives(id),
 PRIMARY KEY(rasgo_id, plegaria_id)
);
CREATE TABLE dotes_plegarias (
 dote_id INTEGER NOT NULL REFERENCES dotes(id),
 plegaria_id INTEGER NOT NULL REFERENCES hierophant_passives(id),
 PRIMARY KEY(dote_id, plegaria_id)
);
CREATE TABLE requisitos_dotes_rasgos (
 dote_id INTEGER NOT NULL REFERENCES dotes(id),
 rasgo_id INTEGER NOT NULL REFERENCES rasgos(id),
 PRIMARY KEY(dote_id, rasgo_id)
);
ALTER TABLE acciones ADD COLUMN coste_omen INTEGER NOT NULL DEFAULT 0 CHECK(coste_omen>=0);
ALTER TABLE acciones ADD COLUMN es_reaccion INTEGER NOT NULL DEFAULT 0 CHECK(es_reaccion IN (0,1));
