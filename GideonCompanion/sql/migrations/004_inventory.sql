-- Ejecutada con FK temporalmente desactivadas por el migrador; los identificadores
-- se conservan para no romper el historial de inversiones.
CREATE TABLE inventario_nuevo (
 id INTEGER PRIMARY KEY, personaje_id INTEGER NOT NULL REFERENCES personajes(id),
 item_magico_id INTEGER REFERENCES items_magicos(id), arma_id INTEGER REFERENCES armas(id),
 armadura_id INTEGER REFERENCES armaduras(id), artefacto_id INTEGER REFERENCES artefactos_arcanos(id),
 item_base_id INTEGER REFERENCES items_base(id),
 equipado INTEGER NOT NULL DEFAULT 0 CHECK(equipado IN (0,1)), cargas_actuales INTEGER NOT NULL DEFAULT 0 CHECK(cargas_actuales>=0),
 cantidad INTEGER NOT NULL DEFAULT 1 CHECK(cantidad>=0), transportado INTEGER NOT NULL DEFAULT 1 CHECK(transportado IN (0,1)),
 retirado INTEGER NOT NULL DEFAULT 0 CHECK(retirado IN (0,1)),
 CHECK((item_magico_id IS NOT NULL)+(arma_id IS NOT NULL)+(armadura_id IS NOT NULL)+(artefacto_id IS NOT NULL)+(item_base_id IS NOT NULL)=1),
 CHECK(item_base_id IS NOT NULL OR cantidad<=1),
 CHECK(equipado=0 OR (transportado=1 AND retirado=0 AND cantidad=1)),
 CHECK(retirado=0 OR equipado=0)
);
INSERT INTO inventario_nuevo(id,personaje_id,item_magico_id,arma_id,armadura_id,artefacto_id,equipado,cargas_actuales)
 SELECT id,personaje_id,item_magico_id,arma_id,armadura_id,artefacto_id,equipado,cargas_actuales FROM inventario;
DROP TABLE inventario;
ALTER TABLE inventario_nuevo RENAME TO inventario;
CREATE INDEX inventario_personaje ON inventario(personaje_id,retirado);
ALTER TABLE personajes ADD COLUMN capacidad_carga_kg REAL CHECK(capacidad_carga_kg IS NULL OR capacidad_carga_kg>0);
ALTER TABLE armas ADD COLUMN peso_kg REAL NOT NULL DEFAULT 0 CHECK(peso_kg>=0);
ALTER TABLE armas ADD COLUMN descripcion TEXT NOT NULL DEFAULT '';
ALTER TABLE armas ADD COLUMN skill_id INTEGER REFERENCES all_skills(id);
ALTER TABLE armas ADD COLUMN manos INTEGER NOT NULL DEFAULT 1 CHECK(manos IN (1,2));
ALTER TABLE armaduras ADD COLUMN peso_kg REAL NOT NULL DEFAULT 0 CHECK(peso_kg>=0);
ALTER TABLE armaduras ADD COLUMN descripcion TEXT NOT NULL DEFAULT '';
ALTER TABLE items_magicos ADD COLUMN peso_kg REAL NOT NULL DEFAULT 0 CHECK(peso_kg>=0);
ALTER TABLE artefactos_arcanos ADD COLUMN peso_kg REAL NOT NULL DEFAULT 0 CHECK(peso_kg>=0);
CREATE TABLE equipo_defensas (
 id INTEGER PRIMARY KEY, arma_id INTEGER REFERENCES armas(id), armadura_id INTEGER REFERENCES armaduras(id),
 item_magico_id INTEGER REFERENCES items_magicos(id), artefacto_id INTEGER REFERENCES artefactos_arcanos(id), item_base_id INTEGER REFERENCES items_base(id),
 categoria TEXT NOT NULL CHECK(categoria IN ('Resistencia','Debilidad','Mitigacion','Fragilidad')),
 tipo_dano TEXT NOT NULL, valor REAL, descripcion TEXT NOT NULL DEFAULT '',
 CHECK((arma_id IS NOT NULL)+(armadura_id IS NOT NULL)+(item_magico_id IS NOT NULL)+(artefacto_id IS NOT NULL)+(item_base_id IS NOT NULL)=1),
 CHECK((categoria IN ('Mitigacion','Fragilidad') AND valor IS NOT NULL AND valor>0) OR (categoria IN ('Resistencia','Debilidad') AND valor IS NULL))
);
CREATE TRIGGER armadura_balance_insert BEFORE INSERT ON armaduras
WHEN NEW.puntos_s<0 OR NEW.puntos_p<0 OR NEW.puntos_b<0
 OR ABS(NEW.puntos_s+NEW.puntos_p+NEW.puntos_b-CASE NEW.categoria WHEN 'Ligera' THEN 1 WHEN 'Mediana' THEN 2 ELSE 3 END)>0.000001
 OR NEW.base_general<>CASE NEW.categoria WHEN 'Ligera' THEN 0.5 WHEN 'Mediana' THEN 1 ELSE 1.5 END
 OR NEW.puntos_asignables<>CASE NEW.categoria WHEN 'Ligera' THEN 1 WHEN 'Mediana' THEN 2 ELSE 3 END
BEGIN SELECT RAISE(ABORT,'Armadura fuera de las reglas de DMs Blacksmit'); END;
CREATE TRIGGER armadura_balance_update BEFORE UPDATE OF categoria,puntos_s,puntos_p,puntos_b,base_general,puntos_asignables ON armaduras
WHEN NEW.puntos_s<0 OR NEW.puntos_p<0 OR NEW.puntos_b<0
 OR ABS(NEW.puntos_s+NEW.puntos_p+NEW.puntos_b-CASE NEW.categoria WHEN 'Ligera' THEN 1 WHEN 'Mediana' THEN 2 ELSE 3 END)>0.000001
 OR NEW.base_general<>CASE NEW.categoria WHEN 'Ligera' THEN 0.5 WHEN 'Mediana' THEN 1 ELSE 1.5 END
 OR NEW.puntos_asignables<>CASE NEW.categoria WHEN 'Ligera' THEN 1 WHEN 'Mediana' THEN 2 ELSE 3 END
BEGIN SELECT RAISE(ABORT,'Armadura fuera de las reglas de DMs Blacksmit'); END;
