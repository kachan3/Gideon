-- Perfiles finales ratificados por Hassan 2026-11-04. Sin base adicional.
DROP TRIGGER armadura_balance_insert;
DROP TRIGGER armadura_balance_update;
CREATE TABLE perfiles_armadura (
 categoria TEXT PRIMARY KEY, multiplicador_s REAL NOT NULL CHECK(multiplicador_s>0),
 multiplicador_p REAL NOT NULL CHECK(multiplicador_p>0), multiplicador_b REAL NOT NULL CHECK(multiplicador_b>0)
);
INSERT INTO perfiles_armadura VALUES('Ligera',0.5,0.5,1),('Mediana',0.5,1,1),('Pesada',1,1,1.5);
CREATE TABLE armaduras_nuevas (
 id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL,
 categoria TEXT NOT NULL REFERENCES perfiles_armadura(categoria),
 nivel_equipo INTEGER NOT NULL DEFAULT 1 CHECK(nivel_equipo BETWEEN 1 AND 10),
 multiplicador_s REAL NOT NULL, multiplicador_p REAL NOT NULL, multiplicador_b REAL NOT NULL,
 reduccion_s INTEGER GENERATED ALWAYS AS (CAST(multiplicador_s*nivel_equipo AS INTEGER)+(multiplicador_s*nivel_equipo>CAST(multiplicador_s*nivel_equipo AS INTEGER))) STORED,
 reduccion_p INTEGER GENERATED ALWAYS AS (CAST(multiplicador_p*nivel_equipo AS INTEGER)+(multiplicador_p*nivel_equipo>CAST(multiplicador_p*nivel_equipo AS INTEGER))) STORED,
 reduccion_b INTEGER GENERATED ALWAYS AS (CAST(multiplicador_b*nivel_equipo AS INTEGER)+(multiplicador_b*nivel_equipo>CAST(multiplicador_b*nivel_equipo AS INTEGER))) STORED,
 peso_kg REAL NOT NULL DEFAULT 0 CHECK(peso_kg>=0), descripcion TEXT NOT NULL DEFAULT '', rasgo_id INTEGER REFERENCES rasgos(id) ON DELETE SET NULL
);
INSERT INTO armaduras_nuevas(id,nombre,categoria,nivel_equipo,multiplicador_s,multiplicador_p,multiplicador_b,peso_kg,descripcion,rasgo_id)
 SELECT a.id,a.nombre,a.categoria,a.nivel_equipo,p.multiplicador_s,p.multiplicador_p,p.multiplicador_b,a.peso_kg,a.descripcion,a.rasgo_id
 FROM armaduras a JOIN perfiles_armadura p ON p.categoria=a.categoria;
DROP TABLE armaduras;
ALTER TABLE armaduras_nuevas RENAME TO armaduras;
CREATE TRIGGER armadura_perfil_insert BEFORE INSERT ON armaduras
WHEN NOT EXISTS(SELECT 1 FROM perfiles_armadura p WHERE p.categoria=NEW.categoria AND p.multiplicador_s=NEW.multiplicador_s AND p.multiplicador_p=NEW.multiplicador_p AND p.multiplicador_b=NEW.multiplicador_b)
BEGIN SELECT RAISE(ABORT,'La armadura debe usar el perfil fijo de su categoría'); END;
CREATE TRIGGER armadura_perfil_update BEFORE UPDATE OF categoria,multiplicador_s,multiplicador_p,multiplicador_b ON armaduras
WHEN NOT EXISTS(SELECT 1 FROM perfiles_armadura p WHERE p.categoria=NEW.categoria AND p.multiplicador_s=NEW.multiplicador_s AND p.multiplicador_p=NEW.multiplicador_p AND p.multiplicador_b=NEW.multiplicador_b)
BEGIN SELECT RAISE(ABORT,'La armadura debe usar el perfil fijo de su categoría'); END;
CREATE TRIGGER perfil_armadura_actualizado AFTER UPDATE ON perfiles_armadura
BEGIN UPDATE armaduras SET multiplicador_s=NEW.multiplicador_s,multiplicador_p=NEW.multiplicador_p,multiplicador_b=NEW.multiplicador_b WHERE categoria=NEW.categoria; END;
UPDATE armaduras SET descripcion='Cota mediana de ejemplo. Perfil final 0,5 / 1 / 1 multiplicado por nivel, con redondeo hacia arriba.' WHERE nombre='Cota de malla de viaje — nivel 3';
