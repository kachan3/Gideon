-- El coste de catálogo es el mínimo de inversión del segmento.
ALTER TABLE mediums ADD COLUMN pl_escalable INTEGER NOT NULL DEFAULT 1 CHECK(pl_escalable IN(0,1));
ALTER TABLE shapes ADD COLUMN pl_escalable INTEGER NOT NULL DEFAULT 1 CHECK(pl_escalable IN(0,1));
ALTER TABLE mods ADD COLUMN pl_escalable INTEGER NOT NULL DEFAULT 0 CHECK(pl_escalable IN(0,1));
UPDATE mods SET pl_escalable=1 WHERE nombre='Encadenado';
CREATE TABLE descansos (
 id INTEGER PRIMARY KEY, personaje_id INTEGER NOT NULL REFERENCES personajes(id),
 fecha TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 tipo TEXT NOT NULL DEFAULT 'Largo simplificado' CHECK(tipo='Largo simplificado'),
 estado_anterior TEXT NOT NULL CHECK(json_valid(estado_anterior))
);
