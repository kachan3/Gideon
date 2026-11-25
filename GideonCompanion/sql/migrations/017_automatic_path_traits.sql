-- Ratificación: alcanzar la XP dedicada otorga el Rasgo automáticamente.
-- Las elecciones anteriores se conservan como historial, sin condicionar efectos.
DROP VIEW v_rasgos_senda_estado;
CREATE VIEW v_rasgos_senda_estado AS
 SELECT cr.*,pc.personaje_id,COALESCE(xp.xp_invertida,0) AS xp_dedicada,
 COALESCE(xp.xp_invertida,0)>=cr.xp_requerida AS requisito_cumplido,
 COALESCE(xp.xp_invertida,0)>=cr.xp_requerida AS obtenido,
 COALESCE(xp.xp_invertida,0)>=cr.xp_requerida AS activo
 FROM v_rasgos_senda_catalogo cr JOIN personajes_clases pc ON pc.clase_id=cr.clase_id
 LEFT JOIN v_xp_senda xp ON xp.personaje_id=pc.personaje_id AND xp.clase_id=cr.clase_id;
