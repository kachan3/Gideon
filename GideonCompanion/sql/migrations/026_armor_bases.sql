-- Nueve bases; cada ejemplar del personaje conserva su propio nivel.
CREATE TABLE bases_armadura (
 id INTEGER PRIMARY KEY, nombre TEXT NOT NULL UNIQUE,
 categoria TEXT NOT NULL, especialidad TEXT NOT NULL,
 multiplicador_s REAL NOT NULL, multiplicador_p REAL NOT NULL, multiplicador_b REAL NOT NULL
);
INSERT INTO bases_armadura VALUES
 (1,'Ligera anticorte','Ligera','Cortante',1,0.5,0.5),
 (2,'Ligera antiperforación','Ligera','Punzante',0.5,1,0.5),
 (3,'Ligera antiimpacto','Ligera','Contundente',0.5,0.5,1),
 (4,'Mediana anticorte','Mediana','Cortante',1.5,0.5,0.5),
 (5,'Mediana antiperforación','Mediana','Punzante',0.5,1.5,0.5),
 (6,'Mediana antiimpacto','Mediana','Contundente',0.5,0.5,1.5),
 (7,'Pesada anticorte','Pesada','Cortante',1.5,1,1),
 (8,'Pesada antiperforación','Pesada','Punzante',1,1.5,1),
 (9,'Pesada antiimpacto','Pesada','Contundente',1,1,1.5);
DROP TRIGGER armadura_perfil_insert;
DROP TRIGGER armadura_perfil_update;
DROP TRIGGER perfil_armadura_actualizado;
ALTER TABLE armaduras ADD COLUMN base_id INTEGER REFERENCES bases_armadura(id);
ALTER TABLE armaduras ADD COLUMN es_base INTEGER NOT NULL DEFAULT 0;
UPDATE armaduras SET es_base=-1;
ALTER TABLE inventario ADD COLUMN nivel_armadura INTEGER CHECK(nivel_armadura BETWEEN 1 AND 10);
UPDATE inventario SET nivel_armadura=(SELECT nivel_equipo FROM armaduras WHERE id=inventario.armadura_id) WHERE armadura_id IS NOT NULL;
-- Conserva los objetos existentes y asigna la base más cercana por categoría.
UPDATE armaduras SET base_id=CASE categoria WHEN 'Ligera' THEN 3 WHEN 'Mediana' THEN 5 ELSE 9 END;
UPDATE armaduras SET multiplicador_s=(SELECT multiplicador_s FROM bases_armadura WHERE id=base_id),multiplicador_p=(SELECT multiplicador_p FROM bases_armadura WHERE id=base_id),multiplicador_b=(SELECT multiplicador_b FROM bases_armadura WHERE id=base_id);
INSERT INTO armaduras(nombre,categoria,nivel_equipo,multiplicador_s,multiplicador_p,multiplicador_b,descripcion,base_id,es_base)
 SELECT nombre,categoria,1,multiplicador_s,multiplicador_p,multiplicador_b,'Base especializada. Protección, coste y peso calculados según el nivel del ejemplar.',id,1 FROM bases_armadura;
