CREATE TABLE dedicaciones_preguntas (
 id INTEGER PRIMARY KEY, dedicacion_id INTEGER NOT NULL REFERENCES dedicaciones(id),
 numero INTEGER NOT NULL CHECK(numero>0), pregunta TEXT NOT NULL,
 coordinar_dm INTEGER NOT NULL DEFAULT 0 CHECK(coordinar_dm IN(0,1)),
 fuente TEXT NOT NULL, UNIQUE(dedicacion_id,numero)
);
CREATE TABLE personajes_trasfondo (
 personaje_id INTEGER NOT NULL REFERENCES personajes(id), pregunta_id INTEGER NOT NULL REFERENCES dedicaciones_preguntas(id),
 pregunta_original TEXT NOT NULL, respuesta TEXT NOT NULL CHECK(length(respuesta) BETWEEN 1 AND 2000),
 PRIMARY KEY(personaje_id,pregunta_id)
);
CREATE TRIGGER respuesta_dedicacion BEFORE INSERT ON personajes_trasfondo
WHEN NOT EXISTS(SELECT 1 FROM dedicaciones_preguntas q JOIN personajes_dedicaciones pd ON pd.dedicacion_id=q.dedicacion_id WHERE q.id=NEW.pregunta_id AND pd.personaje_id=NEW.personaje_id)
BEGIN SELECT RAISE(ABORT,'La pregunta no pertenece a la Dedicación del personaje'); END;
