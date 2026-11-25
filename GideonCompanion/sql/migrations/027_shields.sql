CREATE TABLE bases_escudo (
 id INTEGER PRIMARY KEY, nombre TEXT NOT NULL UNIQUE,
 multiplicador_proteccion REAL NOT NULL, peso_min REAL NOT NULL, peso_max REAL NOT NULL,
 permite_paradas_bloqueo INTEGER NOT NULL DEFAULT 0, cobertura_alzado TEXT
);
INSERT INTO bases_escudo VALUES
 (1,'Broquel',0.5,1,5,1,NULL),
 (2,'Rodela',1,3,20,0,NULL),
 (3,'Torre',1.5,5,100,0,'Media');
ALTER TABLE items_base ADD COLUMN escudo_base_id INTEGER REFERENCES bases_escudo(id);
ALTER TABLE inventario ADD COLUMN nivel_escudo INTEGER CHECK(nivel_escudo BETWEEN 1 AND 10);
UPDATE items_base SET nombre='Rodela',escudo_base_id=2,descripcion='Protección física al bloquear: techo(nivel). Peso calculado por nivel. Equipar cuesta 1 PA.' WHERE categoria='Escudo' AND nombre='Escudo';
UPDATE items_base SET escudo_base_id=3,descripcion='Protección física al bloquear: techo(1,5 × nivel). Al alzarlo otorga Cobertura Media. Peso calculado por nivel. Equipar cuesta 1 PA.' WHERE categoria='Escudo' AND nombre='Escudo Torre';
INSERT INTO items_base(nombre,categoria,peso,descripcion,escudo_base_id) VALUES('Broquel','Escudo',1,'Protección física al bloquear: techo(0,5 × nivel). Permite Deflectar y Parry con Bloqueo en lugar de Paradas. Peso calculado por nivel. Equipar cuesta 1 PA.',1);
UPDATE inventario SET nivel_escudo=1 WHERE item_base_id IN (SELECT id FROM items_base WHERE escudo_base_id IS NOT NULL);
-- Elimina las protecciones pasivas del modelo anterior para estos escudos.
DELETE FROM equipo_defensas WHERE item_base_id IN (SELECT id FROM items_base WHERE escudo_base_id IS NOT NULL) AND categoria='Mitigacion';
