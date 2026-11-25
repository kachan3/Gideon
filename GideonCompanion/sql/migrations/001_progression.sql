-- Migración aditiva: se conservan las tablas anteriores para compatibilidad.
ALTER TABLE personajes ADD COLUMN heridas_actuales INTEGER NOT NULL DEFAULT 0 CHECK(heridas_actuales>=0);
CREATE TABLE xp_concesiones (id INTEGER PRIMARY KEY, personaje_id INTEGER NOT NULL REFERENCES personajes(id), cantidad INTEGER NOT NULL CHECK(cantidad>0), fecha TEXT DEFAULT CURRENT_TIMESTAMP, notas TEXT NOT NULL DEFAULT '');
CREATE TABLE all_skills (
 id INTEGER PRIMARY KEY, codigo TEXT NOT NULL UNIQUE, nombre TEXT NOT NULL UNIQUE,
 tipo TEXT NOT NULL CHECK(tipo IN ('Atributo','Habilidad','Extra','Especial')),
 padre_id INTEGER REFERENCES all_skills(id), combate INTEGER NOT NULL DEFAULT 0,
 modo_progresion TEXT NOT NULL DEFAULT 'Normal', descripcion TEXT NOT NULL DEFAULT ''
);
CREATE TABLE personajes_skills (
 personaje_id INTEGER NOT NULL REFERENCES personajes(id), skill_id INTEGER NOT NULL REFERENCES all_skills(id),
 valor_base INTEGER NOT NULL CHECK(valor_base BETWEEN 0 AND 99), PRIMARY KEY(personaje_id,skill_id)
);
ALTER TABLE dotes ADD COLUMN condicion_especial INTEGER NOT NULL DEFAULT 0 CHECK(condicion_especial IN (0,1));
ALTER TABLE dotes ADD COLUMN descripcion_condicion_especial TEXT;
ALTER TABLE dotes ADD COLUMN permite_inversion_adicional INTEGER NOT NULL DEFAULT 0 CHECK(permite_inversion_adicional IN (0,1));
ALTER TABLE epifanias ADD COLUMN permite_inversion_adicional INTEGER NOT NULL DEFAULT 0;
ALTER TABLE items_magicos ADD COLUMN permite_inversion_adicional INTEGER NOT NULL DEFAULT 0;
CREATE TABLE requisitos_dotes (
 id INTEGER PRIMARY KEY, dote_id INTEGER NOT NULL REFERENCES dotes(id),
 skill_id INTEGER REFERENCES all_skills(id), dote_requerido_id INTEGER REFERENCES dotes(id),
 epifania_id INTEGER REFERENCES epifanias(id), clase_id INTEGER REFERENCES clases(id),
 valor_minimo INTEGER CHECK(valor_minimo BETWEEN 0 AND 99),
 CHECK((skill_id IS NOT NULL)+(dote_requerido_id IS NOT NULL)+(epifania_id IS NOT NULL)+(clase_id IS NOT NULL)=1),
 CHECK((skill_id IS NOT NULL AND valor_minimo IS NOT NULL) OR (skill_id IS NULL AND valor_minimo IS NULL)),
 CHECK(dote_requerido_id IS NULL OR dote_requerido_id<>dote_id)
);
CREATE TRIGGER limite_requisitos_skills BEFORE INSERT ON requisitos_dotes
WHEN NEW.skill_id IS NOT NULL AND (SELECT COUNT(*) FROM requisitos_dotes WHERE dote_id=NEW.dote_id AND skill_id IS NOT NULL)>=10
BEGIN SELECT RAISE(ABORT,'Máximo 10 requisitos de habilidades por dote'); END;
CREATE TRIGGER limite_requisitos_skills_update BEFORE UPDATE ON requisitos_dotes
WHEN NEW.skill_id IS NOT NULL AND (SELECT COUNT(*) FROM requisitos_dotes WHERE dote_id=NEW.dote_id AND skill_id IS NOT NULL AND id<>OLD.id)>=10
BEGIN SELECT RAISE(ABORT,'Máximo 10 requisitos de habilidades por dote'); END;
CREATE TABLE dotes_acciones (dote_id INTEGER REFERENCES dotes(id), accion_id INTEGER REFERENCES acciones(id), PRIMARY KEY(dote_id,accion_id));
CREATE TABLE clases_rasgos_acciones (clase_rasgo_id INTEGER REFERENCES clases_rasgos(id), accion_id INTEGER REFERENCES acciones(id), PRIMARY KEY(clase_rasgo_id,accion_id));
CREATE TABLE linajes_dotes (linaje_id INTEGER REFERENCES linajes(id), dote_id INTEGER REFERENCES dotes(id), PRIMARY KEY(linaje_id,dote_id));
CREATE TABLE clases_dotes (clase_id INTEGER REFERENCES clases(id), dote_id INTEGER REFERENCES dotes(id), PRIMARY KEY(clase_id,dote_id));
CREATE TABLE linajes_rasgos (linaje_id INTEGER REFERENCES linajes(id), rasgo_id INTEGER REFERENCES rasgos(id), PRIMARY KEY(linaje_id,rasgo_id));
CREATE TABLE clases_tags (clase_id INTEGER REFERENCES clases(id), rasgo_id INTEGER REFERENCES rasgos(id), PRIMARY KEY(clase_id,rasgo_id));
CREATE TABLE personajes_tags (personaje_id INTEGER REFERENCES personajes(id), rasgo_id INTEGER REFERENCES rasgos(id), PRIMARY KEY(personaje_id,rasgo_id));
CREATE TABLE dotes_tags (dote_id INTEGER REFERENCES dotes(id), rasgo_id INTEGER REFERENCES rasgos(id), PRIMARY KEY(dote_id,rasgo_id));
CREATE TABLE linajes_skills (linaje_id INTEGER REFERENCES linajes(id), skill_id INTEGER REFERENCES all_skills(id), bono INTEGER NOT NULL, PRIMARY KEY(linaje_id,skill_id));
CREATE TABLE dedicaciones_skills (dedicacion_id INTEGER REFERENCES dedicaciones(id), skill_id INTEGER REFERENCES all_skills(id), minimo INTEGER NOT NULL CHECK(minimo BETWEEN 0 AND 99), bono_destacado INTEGER NOT NULL DEFAULT 5, PRIMARY KEY(dedicacion_id,skill_id));
CREATE TABLE personajes_autorizaciones (personaje_id INTEGER REFERENCES personajes(id), dote_id INTEGER REFERENCES dotes(id), notas TEXT, PRIMARY KEY(personaje_id,dote_id));
-- Instancia de inventario: dos ejemplares del mismo catálogo son independientes.
CREATE TABLE inventario (
 id INTEGER PRIMARY KEY, personaje_id INTEGER NOT NULL REFERENCES personajes(id),
 item_magico_id INTEGER REFERENCES items_magicos(id), arma_id INTEGER REFERENCES armas(id),
 armadura_id INTEGER REFERENCES armaduras(id), artefacto_id INTEGER REFERENCES artefactos_arcanos(id),
 equipado INTEGER NOT NULL DEFAULT 0, cargas_actuales INTEGER NOT NULL DEFAULT 0,
 CHECK((item_magico_id IS NOT NULL)+(arma_id IS NOT NULL)+(armadura_id IS NOT NULL)+(artefacto_id IS NOT NULL)=1)
);
CREATE TABLE progresion (
 id INTEGER PRIMARY KEY, personaje_id INTEGER NOT NULL REFERENCES personajes(id),
 fecha TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 change TEXT NOT NULL CHECK(change IN ('Add','Subtract')),
 tipo TEXT NOT NULL CHECK(tipo IN ('Adquisicion','Inversion','Retiro','Skill')),
 dote_id INTEGER REFERENCES dotes(id), epifania_id INTEGER REFERENCES epifanias(id),
 item_id INTEGER REFERENCES inventario(id), skill_id INTEGER REFERENCES all_skills(id),
 valor INTEGER NOT NULL DEFAULT 1 CHECK(valor>0), xp_gastada INTEGER NOT NULL DEFAULT 0 CHECK(xp_gastada>=0),
 adquisicion_id INTEGER REFERENCES progresion(id), clase_id INTEGER REFERENCES clases(id),
 origen TEXT NOT NULL DEFAULT 'Compra', notas TEXT NOT NULL DEFAULT '',
 CHECK((dote_id IS NOT NULL)+(epifania_id IS NOT NULL)+(item_id IS NOT NULL)+(skill_id IS NOT NULL)=1),
 CHECK((tipo='Skill' AND skill_id IS NOT NULL AND adquisicion_id IS NULL)
 OR (tipo='Adquisicion' AND skill_id IS NULL AND adquisicion_id IS NULL AND change='Add' AND valor=1)
 OR (tipo='Inversion' AND skill_id IS NULL AND adquisicion_id IS NOT NULL AND change='Add' AND valor=1 AND xp_gastada>0)
 OR (tipo='Retiro' AND skill_id IS NULL AND adquisicion_id IS NOT NULL AND change='Subtract' AND valor=1 AND xp_gastada=0))
);
CREATE INDEX progresion_personaje ON progresion(personaje_id,id);
CREATE UNIQUE INDEX retiro_unico ON progresion(adquisicion_id) WHERE tipo='Retiro';
CREATE TRIGGER progresion_vinculo BEFORE INSERT ON progresion WHEN NEW.adquisicion_id IS NOT NULL
BEGIN
 SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM progresion p WHERE p.id=NEW.adquisicion_id AND p.personaje_id=NEW.personaje_id AND p.tipo='Adquisicion' AND p.dote_id IS NEW.dote_id AND p.epifania_id IS NEW.epifania_id AND p.item_id IS NEW.item_id)
 THEN RAISE(ABORT,'Adquisición de origen incompatible') END;
 SELECT CASE WHEN EXISTS(SELECT 1 FROM progresion WHERE adquisicion_id=NEW.adquisicion_id AND tipo='Retiro') THEN RAISE(ABORT,'La adquisición ya fue retirada') END;
END;
CREATE TRIGGER progresion_no_update BEFORE UPDATE ON progresion BEGIN SELECT RAISE(ABORT,'El historial es inmutable'); END;
CREATE TRIGGER progresion_no_delete BEFORE DELETE ON progresion BEGIN SELECT RAISE(ABORT,'El historial es inmutable'); END;
CREATE TABLE contenido_fuentes (tabla TEXT NOT NULL, entidad_id INTEGER NOT NULL, fuente TEXT NOT NULL, ejemplo INTEGER NOT NULL DEFAULT 1, PRIMARY KEY(tabla,entidad_id));
CREATE VIEW v_adquisiciones_activas AS SELECT p.*, p.xp_gastada+COALESCE((SELECT SUM(i.xp_gastada) FROM progresion i WHERE i.adquisicion_id=p.id AND i.tipo='Inversion'),0) AS xp_invertida
 FROM progresion p WHERE p.tipo='Adquisicion' AND NOT EXISTS(SELECT 1 FROM progresion r WHERE r.adquisicion_id=p.id AND r.tipo='Retiro');
CREATE VIEW v_xp_gastada AS SELECT personaje_id,SUM(xp_gastada) AS xp_gastada FROM progresion GROUP BY personaje_id;
-- Pool histórica: retirar no devuelve ni resta XP. No se interpreta como regla definitiva.
CREATE VIEW v_xp_senda AS SELECT personaje_id,clase_id,SUM(xp_gastada) AS xp_invertida,CAST(SUM(xp_gastada)/5 AS INTEGER) AS grado
 FROM progresion WHERE clase_id IS NOT NULL GROUP BY personaje_id,clase_id;
