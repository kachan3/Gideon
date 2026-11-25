CREATE TABLE elecciones_rasgos (
 codigo TEXT PRIMARY KEY,
 rasgo_id INTEGER REFERENCES rasgos(id),
 dote_id INTEGER REFERENCES dotes(id),
 tipo TEXT NOT NULL CHECK(tipo IN ('Marcial','Herramienta','Epifania','Artefacto','As')),
 titulo TEXT NOT NULL,
 CHECK((rasgo_id IS NOT NULL)+(dote_id IS NOT NULL)=1)
);
CREATE TABLE personajes_elecciones_rasgos (
 personaje_id INTEGER NOT NULL REFERENCES personajes(id),
 codigo TEXT NOT NULL REFERENCES elecciones_rasgos(codigo),
 valor TEXT NOT NULL CHECK(json_valid(valor)),
 PRIMARY KEY(personaje_id,codigo)
);
