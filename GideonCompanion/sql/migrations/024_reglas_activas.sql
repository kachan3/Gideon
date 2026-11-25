ALTER TABLE inventario ADD COLUMN mano TEXT CHECK(mano IN ('Principal','Secundaria'));
ALTER TABLE personajes ADD COLUMN exceso_espacios INTEGER NOT NULL DEFAULT 0 CHECK(exceso_espacios IN (0,1));
ALTER TABLE personajes ADD COLUMN cansancio INTEGER NOT NULL DEFAULT 0 CHECK(cansancio BETWEEN 0 AND 5);
ALTER TABLE personajes ADD COLUMN muerte_por_impacto INTEGER NOT NULL DEFAULT 0 CHECK(muerte_por_impacto IN (0,1));
ALTER TABLE dano_eventos ADD COLUMN zona TEXT;
UPDATE personajes SET heridas_graves=heridas_graves+heridas_mortales;
CREATE TABLE recuperaciones (
 id INTEGER PRIMARY KEY, personaje_id INTEGER NOT NULL REFERENCES personajes(id),
 tipo TEXT NOT NULL, dia INTEGER, horas INTEGER, estado_anterior TEXT NOT NULL,
 fecha TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(personaje_id,tipo,dia)
);
INSERT OR IGNORE INTO items_base(nombre,categoria,peso,descripcion) VALUES
 ('Escudo','Escudo',4,'Blindaje pasivo 1 / activo 2. Equipar cuesta 1 PA.'),
 ('Escudo Torre','Escudo',12,'Blindaje pasivo 2 / activo 4. Pesado (15). Equipar cuesta 1 PA.');

CREATE TABLE entrenamiento_marcas (
 personaje_id INTEGER NOT NULL REFERENCES personajes(id), skill_id INTEGER NOT NULL REFERENCES all_skills(id),
 PRIMARY KEY(personaje_id,skill_id)
);
CREATE TABLE entrenamiento_sesiones (
 id INTEGER PRIMARY KEY, personaje_id INTEGER NOT NULL REFERENCES personajes(id), fecha TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE entrenamiento_intentos (
 id INTEGER PRIMARY KEY, sesion_id INTEGER NOT NULL REFERENCES entrenamiento_sesiones(id),
 skill_id INTEGER NOT NULL REFERENCES all_skills(id), valor INTEGER NOT NULL, dado INTEGER NOT NULL,
 mejora INTEGER NOT NULL DEFAULT 0, asegurado INTEGER NOT NULL DEFAULT 0,
 UNIQUE(sesion_id,skill_id)
);
CREATE TABLE decenas_pendientes (
 personaje_id INTEGER PRIMARY KEY REFERENCES personajes(id), clave TEXT NOT NULL, contexto TEXT NOT NULL,
 solicitud TEXT NOT NULL, dados TEXT NOT NULL
);
ALTER TABLE dano_eventos ADD COLUMN omen INTEGER NOT NULL DEFAULT 0;
ALTER TABLE personajes ADD COLUMN bloque_grave REAL NOT NULL DEFAULT 0 CHECK(bloque_grave>=0);
ALTER TABLE dano_eventos ADD COLUMN ne_impacto INTEGER;
ALTER TABLE acciones ADD COLUMN coste_texto TEXT;
ALTER TABLE dano_eventos ADD COLUMN fuente TEXT;
ALTER TABLE dano_eventos ADD COLUMN medio TEXT;
