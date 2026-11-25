-- Rasgos = etiquetas. Las capacidades se conceden mediante dotes de linaje.
ALTER TABLE linajes ADD COLUMN codigo TEXT;
CREATE UNIQUE INDEX linajes_codigo ON linajes(codigo) WHERE codigo IS NOT NULL;
ALTER TABLE linajes ADD COLUMN movimiento_terrestre INTEGER NOT NULL DEFAULT 6 CHECK(movimiento_terrestre>0);
ALTER TABLE dotes ADD COLUMN linaje_requerido_id INTEGER REFERENCES linajes(id);
ALTER TABLE dotes ADD COLUMN solo_concesion_inicial INTEGER NOT NULL DEFAULT 0 CHECK(solo_concesion_inicial IN(0,1));
CREATE TABLE dotes_efectos (
 id INTEGER PRIMARY KEY, dote_id INTEGER NOT NULL REFERENCES dotes(id),
 tipo TEXT NOT NULL CHECK(tipo IN ('Mitigacion','Movimiento','Regla','TiradaNE','Salvataje','XPInicial')),
 objetivo TEXT NOT NULL, valor REAL NOT NULL, unidad TEXT NOT NULL DEFAULT '',
 descripcion TEXT NOT NULL DEFAULT '', UNIQUE(dote_id,tipo,objetivo)
);
CREATE TABLE linajes_elecciones (
 id INTEGER PRIMARY KEY, linaje_id INTEGER NOT NULL REFERENCES linajes(id),
 codigo TEXT NOT NULL UNIQUE, nombre TEXT NOT NULL, bono INTEGER NOT NULL CHECK(bono=5)
);
CREATE TABLE linajes_elecciones_opciones (
 eleccion_id INTEGER NOT NULL REFERENCES linajes_elecciones(id),
 skill_id INTEGER NOT NULL REFERENCES all_skills(id), PRIMARY KEY(eleccion_id,skill_id)
);
CREATE TABLE personajes_elecciones_linaje (
 personaje_id INTEGER NOT NULL REFERENCES personajes(id),
 eleccion_id INTEGER NOT NULL REFERENCES linajes_elecciones(id),
 skill_id INTEGER NOT NULL REFERENCES all_skills(id), PRIMARY KEY(personaje_id,eleccion_id),
 FOREIGN KEY(eleccion_id,skill_id) REFERENCES linajes_elecciones_opciones(eleccion_id,skill_id)
);
CREATE TRIGGER eleccion_linaje_personaje BEFORE INSERT ON personajes_elecciones_linaje
WHEN NOT EXISTS(SELECT 1 FROM personajes p JOIN linajes_elecciones e ON e.linaje_id=p.linaje_id WHERE p.id=NEW.personaje_id AND e.id=NEW.eleccion_id)
BEGIN SELECT RAISE(ABORT,'La elección no pertenece al linaje del personaje'); END;
CREATE TABLE linajes_equipo_inicial (
 linaje_id INTEGER NOT NULL REFERENCES linajes(id), item_base_id INTEGER NOT NULL REFERENCES items_base(id),
 cantidad INTEGER NOT NULL DEFAULT 1 CHECK(cantidad>0), opcional INTEGER NOT NULL DEFAULT 0 CHECK(opcional IN(0,1)),
 PRIMARY KEY(linaje_id,item_base_id)
);
-- Conserva el cálculo de creación para poder explicar y auditar cada bonificación.
CREATE TABLE personajes_creacion_skills (
 personaje_id INTEGER NOT NULL REFERENCES personajes(id), skill_id INTEGER NOT NULL REFERENCES all_skills(id),
 detalle TEXT NOT NULL CHECK(json_valid(detalle)), PRIMARY KEY(personaje_id,skill_id)
);
CREATE TABLE personajes_linaje_revision (
 personaje_id INTEGER PRIMARY KEY REFERENCES personajes(id), revision TEXT NOT NULL,
 skills_anteriores INTEGER NOT NULL DEFAULT 0 CHECK(skills_anteriores IN(0,1))
);
