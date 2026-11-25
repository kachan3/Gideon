ALTER TABLE shapes ADD COLUMN reglas_json TEXT CHECK(reglas_json IS NULL OR json_valid(reglas_json));
UPDATE shapes SET coste_pl=1,pl_escalable=0,escalado_pendiente=0,
 efecto_base='Un proyectil realiza un ataque contra un solo objetivo.',
 escalado_texto='Coste fijo: 1 PL. No admite Self ni Touch (Toque).',
 restricciones='Medium[ No puede ser Self ni Touch (Toque) ]',
 reglas_json='{"mediums_prohibidos":["Self","Touch","Toque"]}'
 WHERE nombre='Proyectil' OR nombre LIKE 'Proyectil %';
INSERT INTO schema_migrations(version) VALUES(38);
