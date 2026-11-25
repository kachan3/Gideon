CREATE TABLE lanzador_turnos (
 personaje_id INTEGER PRIMARY KEY REFERENCES personajes(id),
 turno INTEGER NOT NULL DEFAULT 1 CHECK(turno>=1),
 libro_turno INTEGER NOT NULL DEFAULT 0,
 repeticion TEXT CHECK(repeticion IS NULL OR json_valid(repeticion))
);
CREATE TABLE herramientas_elecciones_legado (
 personaje_id INTEGER PRIMARY KEY REFERENCES personajes(id), valor TEXT NOT NULL
);
UPDATE personajes_elecciones_rasgos SET valor='"Libro de Conjuros"' WHERE codigo='herramienta' AND valor='"Libro"';
UPDATE personajes_elecciones_rasgos SET valor='"Espada"' WHERE codigo='herramienta' AND valor='"Arma"';
INSERT INTO herramientas_elecciones_legado SELECT personaje_id,valor FROM personajes_elecciones_rasgos WHERE codigo='herramienta' AND valor='"Amuleto"';
DELETE FROM personajes_elecciones_rasgos WHERE codigo='herramienta' AND valor='"Amuleto"';
