-- Canonización 2026-11-21: cambia los nombres, conservando los efectos por id.
UPDATE ventajas_arma SET nombre='__agil_previo_33__' WHERE nombre='Ágil';
UPDATE ventajas_arma SET nombre='Ágil' WHERE nombre='Veloz';
UPDATE ventajas_arma SET nombre='Veloz' WHERE nombre='__agil_previo_33__';
UPDATE ventajas_arma SET nombre='Ágil' WHERE nombre='Sutil' AND NOT EXISTS(SELECT 1 FROM ventajas_arma WHERE nombre='Ágil');
INSERT OR IGNORE INTO armas_ventajas(arma_id,ventaja_id,parametro_x,grado_aplicado)
SELECT av.arma_id,nueva.id,av.parametro_x,av.grado_aplicado FROM armas_ventajas av
JOIN ventajas_arma vieja ON vieja.id=av.ventaja_id AND vieja.nombre='Sutil'
JOIN ventajas_arma nueva ON nueva.nombre='Ágil';
DELETE FROM armas_ventajas WHERE ventaja_id IN(SELECT id FROM ventajas_arma WHERE nombre='Sutil');
DELETE FROM ventajas_arma WHERE nombre='Sutil';
UPDATE ventajas_arma SET descripcion='Permite usar Fuerza o Agilidad para calcular el daño. Companion usa automáticamente el mayor valor.',grado_coste=2 WHERE nombre='Ágil';
UPDATE ventajas_arma SET descripcion='Si en el turno solo usaste armas veloces, hiciste como máximo dos ataques y la última acción fue un ataque con arma veloz, no sufrís Arrebatado.',grado_coste=1 WHERE nombre='Veloz';
UPDATE rasgos SET descripcion=REPLACE(descripcion,'arma Ágil','arma Veloz') WHERE nombre='Acciones de Presteza';
UPDATE clases_rasgos SET descripcion=REPLACE(descripcion,'arma Ágil','arma Veloz') WHERE nombre='Acciones de Presteza';
