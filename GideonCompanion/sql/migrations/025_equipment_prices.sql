-- Precios en oro calculados automáticamente; curva normalizada común.
ALTER TABLE armas ADD COLUMN coste_oro INTEGER GENERATED ALWAYS AS (
 CAST(round(CASE categoria_balance WHEN 'Militar' THEN 5 WHEN 'Cotidiana' THEN 3 ELSE 0 END +
 (CASE categoria_balance WHEN 'Militar' THEN 20000 WHEN 'Cotidiana' THEN 15000 ELSE 10000 END - CASE categoria_balance WHEN 'Militar' THEN 5 WHEN 'Cotidiana' THEN 3 ELSE 0 END) *
 (pow(40000.0,(min(10,max(1,nivel_arma))-1)/9.0)-1)/39999.0) AS INTEGER)) VIRTUAL;
ALTER TABLE armaduras ADD COLUMN coste_oro INTEGER GENERATED ALWAYS AS (
 CAST(round(CASE categoria WHEN 'Ligera' THEN 5 WHEN 'Mediana' THEN 10 ELSE 20 END +
 (CASE categoria WHEN 'Ligera' THEN 30000 WHEN 'Mediana' THEN 50000 ELSE 100000 END - CASE categoria WHEN 'Ligera' THEN 5 WHEN 'Mediana' THEN 10 ELSE 20 END) *
 (pow(40000.0,(min(10,max(1,nivel_equipo))-1)/9.0)-1)/39999.0) AS INTEGER)) VIRTUAL;
INSERT INTO armaduras(nombre,categoria,nivel_equipo,multiplicador_s,multiplicador_p,multiplicador_b,peso_kg,descripcion) VALUES('Gambesón — calidad 1','Ligera',1,0.5,0.5,1,4,'Catálogo de armaduras. Peso de referencia estimado. Precio automático por categoría y nivel.');
INSERT INTO armaduras(nombre,categoria,nivel_equipo,multiplicador_s,multiplicador_p,multiplicador_b,peso_kg,descripcion) VALUES('Gambesón — calidad 5','Ligera',5,0.5,0.5,1,4,'Catálogo de armaduras. Peso de referencia estimado. Precio automático por categoría y nivel.');
INSERT INTO armaduras(nombre,categoria,nivel_equipo,multiplicador_s,multiplicador_p,multiplicador_b,peso_kg,descripcion) VALUES('Gambesón — calidad 10','Ligera',10,0.5,0.5,1,4,'Catálogo de armaduras. Peso de referencia estimado. Precio automático por categoría y nivel.');
INSERT INTO armaduras(nombre,categoria,nivel_equipo,multiplicador_s,multiplicador_p,multiplicador_b,peso_kg,descripcion) VALUES('Armadura de malla — calidad 1','Mediana',1,0.5,1,1,10,'Catálogo de armaduras. Peso de referencia estimado. Precio automático por categoría y nivel.');
INSERT INTO armaduras(nombre,categoria,nivel_equipo,multiplicador_s,multiplicador_p,multiplicador_b,peso_kg,descripcion) VALUES('Armadura de malla — calidad 5','Mediana',5,0.5,1,1,10,'Catálogo de armaduras. Peso de referencia estimado. Precio automático por categoría y nivel.');
INSERT INTO armaduras(nombre,categoria,nivel_equipo,multiplicador_s,multiplicador_p,multiplicador_b,peso_kg,descripcion) VALUES('Armadura de malla — calidad 10','Mediana',10,0.5,1,1,10,'Catálogo de armaduras. Peso de referencia estimado. Precio automático por categoría y nivel.');
INSERT INTO armaduras(nombre,categoria,nivel_equipo,multiplicador_s,multiplicador_p,multiplicador_b,peso_kg,descripcion) VALUES('Armadura de placas — calidad 1','Pesada',1,1,1,1.5,20,'Catálogo de armaduras. Peso de referencia estimado. Precio automático por categoría y nivel.');
INSERT INTO armaduras(nombre,categoria,nivel_equipo,multiplicador_s,multiplicador_p,multiplicador_b,peso_kg,descripcion) VALUES('Armadura de placas — calidad 5','Pesada',5,1,1,1.5,20,'Catálogo de armaduras. Peso de referencia estimado. Precio automático por categoría y nivel.');
INSERT INTO armaduras(nombre,categoria,nivel_equipo,multiplicador_s,multiplicador_p,multiplicador_b,peso_kg,descripcion) VALUES('Armadura de placas — calidad 10','Pesada',10,1,1,1.5,20,'Catálogo de armaduras. Peso de referencia estimado. Precio automático por categoría y nivel.');
