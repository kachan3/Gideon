ALTER TABLE bases_escudo ADD COLUMN precio_min INTEGER NOT NULL DEFAULT 0;
ALTER TABLE bases_escudo ADD COLUMN precio_max INTEGER NOT NULL DEFAULT 0;
UPDATE bases_escudo SET precio_min=5,precio_max=8000 WHERE nombre='Broquel';
UPDATE bases_escudo SET precio_min=10,precio_max=12000 WHERE nombre='Rodela';
UPDATE bases_escudo SET precio_min=20,precio_max=18000 WHERE nombre='Torre';
