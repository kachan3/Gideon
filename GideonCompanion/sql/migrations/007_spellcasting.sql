ALTER TABLE efectos ADD COLUMN pl_minimo INTEGER NOT NULL DEFAULT 1 CHECK(pl_minimo>=1);
ALTER TABLE mediums ADD COLUMN universal INTEGER NOT NULL DEFAULT 0 CHECK(universal IN(0,1));
INSERT OR IGNORE INTO mediums(nombre,coste_pl,reach,condicion_aplicacion,universal) VALUES
 ('Self',0,'Sobre ti mismo',NULL,1),
 ('Touch',0,'Toque','Objetivo no voluntario: requiere acertar Melee (Brawl) una vez preparado el conjuro.',1);
UPDATE mediums SET universal=1 WHERE nombre IN('Self','Touch');
CREATE TABLE tiradas (
 id INTEGER PRIMARY KEY, personaje_id INTEGER NOT NULL REFERENCES personajes(id),
 fecha TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, contexto TEXT NOT NULL, resultado TEXT NOT NULL CHECK(json_valid(resultado))
);
CREATE TABLE canalizaciones (
 id INTEGER PRIMARY KEY, personaje_id INTEGER NOT NULL REFERENCES personajes(id),
 fecha TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizada TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 estado TEXT NOT NULL DEFAULT 'Canalizando' CHECK(estado IN('Canalizando','Completado','Interrumpido')),
 plan TEXT NOT NULL CHECK(json_valid(plan)), progreso INTEGER NOT NULL DEFAULT 0 CHECK(progreso>=0),
 tiradas INTEGER NOT NULL DEFAULT 0 CHECK(tiradas>=0), ultimo_resultado TEXT CHECK(ultimo_resultado IS NULL OR json_valid(ultimo_resultado))
);
CREATE UNIQUE INDEX una_canalizacion_activa ON canalizaciones(personaje_id) WHERE estado='Canalizando';
CREATE INDEX historial_tiradas ON tiradas(personaje_id,id DESC);
