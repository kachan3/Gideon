CREATE TABLE personajes_accesos (
 personaje_id INTEGER PRIMARY KEY REFERENCES personajes(id),
 token_hash TEXT NOT NULL UNIQUE CHECK(length(token_hash)=64),
 creado TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
