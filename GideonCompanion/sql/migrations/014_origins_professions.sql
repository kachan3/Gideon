ALTER TABLE dedicaciones ADD COLUMN disponible_demo INTEGER NOT NULL DEFAULT 0 CHECK(disponible_demo IN(0,1));
ALTER TABLE nacimientos ADD COLUMN disponible_demo INTEGER NOT NULL DEFAULT 0 CHECK(disponible_demo IN(0,1));
-- Los rangos heredados no se recalculan sin una nueva tabla ratificada.
ALTER TABLE nacimientos ADD COLUMN rangos_demo_vigentes INTEGER NOT NULL DEFAULT 0 CHECK(rangos_demo_vigentes IN(0,1));
CREATE TABLE profesiones (
 id INTEGER PRIMARY KEY, nombre TEXT NOT NULL UNIQUE, descripcion TEXT NOT NULL,
 skill_id INTEGER NOT NULL UNIQUE REFERENCES all_skills(id), rasgo_id INTEGER NOT NULL REFERENCES rasgos(id),
 minimo_inicial INTEGER NOT NULL DEFAULT 50 CHECK(minimo_inicial BETWEEN 0 AND 80)
);
CREATE TABLE dedicaciones_profesiones (
 dedicacion_id INTEGER NOT NULL REFERENCES dedicaciones(id),profesion_id INTEGER NOT NULL REFERENCES profesiones(id),PRIMARY KEY(dedicacion_id,profesion_id)
);
CREATE TABLE personajes_profesiones (
 personaje_id INTEGER NOT NULL REFERENCES personajes(id), profesion_id INTEGER NOT NULL REFERENCES profesiones(id),
 origen TEXT NOT NULL DEFAULT 'Creacion', PRIMARY KEY(personaje_id,profesion_id)
);
CREATE TRIGGER oficio_inicial_dedicacion BEFORE INSERT ON personajes_profesiones
WHEN NEW.origen='Creacion' AND NOT EXISTS(SELECT 1 FROM personajes_dedicaciones pd JOIN dedicaciones_profesiones dp ON dp.dedicacion_id=pd.dedicacion_id WHERE pd.personaje_id=NEW.personaje_id AND dp.profesion_id=NEW.profesion_id)
BEGIN SELECT RAISE(ABORT,'El oficio no pertenece a la Dedicación elegida'); END;
CREATE TABLE nacimientos_preguntas (
 id INTEGER PRIMARY KEY, nacimiento_id INTEGER NOT NULL REFERENCES nacimientos(id), numero INTEGER NOT NULL CHECK(numero>0), pregunta TEXT NOT NULL, UNIQUE(nacimiento_id,numero)
);
CREATE TABLE personajes_origen_respuestas (
 personaje_id INTEGER NOT NULL REFERENCES personajes(id), pregunta_id INTEGER NOT NULL REFERENCES nacimientos_preguntas(id),
 pregunta_original TEXT NOT NULL, respuesta TEXT NOT NULL CHECK(length(respuesta) BETWEEN 1 AND 2000),PRIMARY KEY(personaje_id,pregunta_id)
);
CREATE TRIGGER respuesta_nacimiento BEFORE INSERT ON personajes_origen_respuestas
WHEN NOT EXISTS(SELECT 1 FROM nacimientos_preguntas q JOIN personajes_nacimientos pn ON pn.nacimiento_id=q.nacimiento_id WHERE q.id=NEW.pregunta_id AND pn.personaje_id=NEW.personaje_id)
BEGIN SELECT RAISE(ABORT,'La pregunta no pertenece al Nacimiento del personaje'); END;
