-- Pesos de referencia para que la carga sea operativa; revisables por el narrador.
UPDATE armas SET peso_kg=CASE nombre
 WHEN 'Daga' THEN 0.3 WHEN 'Espada larga' THEN 1.4
 WHEN 'Hacha de batalla' THEN 1.5 WHEN 'Martillo de guerra' THEN 1.5
 WHEN 'Pica' THEN 5 WHEN 'Pala' THEN 2 WHEN 'Espadón' THEN 3
 WHEN 'Arco largo' THEN 1 WHEN 'Bastón' THEN 1.5
 WHEN 'Ballesta de caza' THEN 3 WHEN 'Piedra' THEN 0.5 WHEN 'Porra' THEN 1
 ELSE peso_kg END WHERE peso_kg=0;
