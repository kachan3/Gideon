-- Conserva las clases fuera de la demo para no romper fichas ni historial.
ALTER TABLE clases ADD COLUMN disponible_demo INTEGER NOT NULL DEFAULT 0 CHECK(disponible_demo IN(0,1));
ALTER TABLE dotes ADD COLUMN solo_concesion_senda INTEGER NOT NULL DEFAULT 0 CHECK(solo_concesion_senda IN(0,1));
CREATE TABLE clases_origen (
 clase_id INTEGER PRIMARY KEY REFERENCES clases(id), fuente TEXT NOT NULL,
 elecciones TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(elecciones)),
 notas TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(notas))
);
