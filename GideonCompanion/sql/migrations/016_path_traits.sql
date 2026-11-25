-- La definición vive en rasgos; la Senda y su umbral pertenecen al vínculo.
CREATE UNIQUE INDEX clases_rasgos_definicion ON clases_rasgos(clase_id,rasgo_id) WHERE rasgo_id IS NOT NULL;
CREATE TRIGGER rasgo_senda_definicion_insert BEFORE INSERT ON clases_rasgos
WHEN NEW.rasgo_id IS NULL OR NOT EXISTS(SELECT 1 FROM rasgos WHERE id=NEW.rasgo_id AND tipo='Capacidad')
 OR typeof(NEW.xp_clase_requerida)<>'integer' OR NEW.xp_clase_requerida<0
 OR NEW.es_insignia NOT IN(0,1) OR (NEW.es_insignia=1 AND NEW.xp_clase_requerida<>0)
BEGIN SELECT RAISE(ABORT,'Rasgo de Senda: capacidad y umbral de XP válidos requeridos; inicial exige 0 XP'); END;
CREATE TRIGGER rasgo_senda_definicion_update BEFORE UPDATE ON clases_rasgos
WHEN NEW.rasgo_id IS NULL OR NOT EXISTS(SELECT 1 FROM rasgos WHERE id=NEW.rasgo_id AND tipo='Capacidad')
 OR typeof(NEW.xp_clase_requerida)<>'integer' OR NEW.xp_clase_requerida<0
 OR NEW.es_insignia NOT IN(0,1) OR (NEW.es_insignia=1 AND NEW.xp_clase_requerida<>0)
BEGIN SELECT RAISE(ABORT,'Rasgo de Senda: capacidad y umbral de XP válidos requeridos; inicial exige 0 XP'); END;

CREATE VIEW v_rasgos_senda_catalogo AS
 SELECT cr.id,cr.clase_id,cr.rasgo_id,cr.xp_clase_requerida,cr.xp_clase_requerida AS xp_requerida,
 cr.es_insignia,r.nombre,r.descripcion,c.nombre AS senda
 FROM clases_rasgos cr JOIN rasgos r ON r.id=cr.rasgo_id JOIN clases c ON c.id=cr.clase_id;
CREATE VIEW v_rasgos_senda_estado AS
 SELECT cr.*,pc.personaje_id,COALESCE(xp.xp_invertida,0) AS xp_dedicada,
 COALESCE(xp.xp_invertida,0)>=cr.xp_requerida AS requisito_cumplido,
 (cr.es_insignia=1 OR pr.personaje_id IS NOT NULL) AS obtenido,
 (COALESCE(xp.xp_invertida,0)>=cr.xp_requerida AND (cr.es_insignia=1 OR pr.personaje_id IS NOT NULL)) AS activo
 FROM v_rasgos_senda_catalogo cr JOIN personajes_clases pc ON pc.clase_id=cr.clase_id
 LEFT JOIN v_xp_senda xp ON xp.personaje_id=pc.personaje_id AND xp.clase_id=cr.clase_id
 LEFT JOIN personajes_clases_rasgos pr ON pr.personaje_id=pc.personaje_id AND pr.clase_rasgo_id=cr.id;
CREATE TRIGGER obtener_rasgo_senda BEFORE INSERT ON personajes_clases_rasgos
WHEN NOT EXISTS(SELECT 1 FROM v_rasgos_senda_estado WHERE personaje_id=NEW.personaje_id AND id=NEW.clase_rasgo_id AND requisito_cumplido=1)
BEGIN SELECT RAISE(ABORT,'Requiere pertenecer a la Senda y alcanzar su XP dedicada'); END;
CREATE TRIGGER actualizar_rasgo_senda BEFORE UPDATE ON personajes_clases_rasgos
WHEN NOT EXISTS(SELECT 1 FROM v_rasgos_senda_estado WHERE personaje_id=NEW.personaje_id AND id=NEW.clase_rasgo_id AND requisito_cumplido=1)
BEGIN SELECT RAISE(ABORT,'Requiere pertenecer a la Senda y alcanzar su XP dedicada'); END;
