-- Conserva los ids y vínculos de las antiguas etiquetas.
ALTER TABLE rasgos ADD COLUMN tipo TEXT NOT NULL DEFAULT 'Etiqueta' CHECK(tipo IN ('Etiqueta','Capacidad'));
ALTER TABLE rasgos ADD COLUMN codigo TEXT;
ALTER TABLE rasgos ADD COLUMN regla_texto TEXT NOT NULL DEFAULT '';
CREATE UNIQUE INDEX rasgos_codigo ON rasgos(codigo) WHERE codigo IS NOT NULL;
CREATE TABLE rasgos_modificadores (
 id INTEGER PRIMARY KEY, rasgo_id INTEGER NOT NULL REFERENCES rasgos(id),
 tipo TEXT NOT NULL CHECK(tipo IN ('BonoSkill','MinimoSkill','Mitigacion','Resistencia','Debilidad','Movimiento','Regla','TiradaNE','Salvataje','XPInicial')),
 skill_id INTEGER REFERENCES all_skills(id), objetivo TEXT NOT NULL DEFAULT '', valor REAL NOT NULL,
 unidad TEXT NOT NULL DEFAULT '', fase TEXT NOT NULL DEFAULT 'Siempre' CHECK(fase IN ('Creacion','Siempre')),
 condicion TEXT NOT NULL DEFAULT 'Siempre' CHECK(condicion IN ('Siempre','Consciente','BajoAgua','AlCaer','ConLuzResidual','ArbolesVegetacion','Manual')),
 descripcion TEXT NOT NULL DEFAULT '',
 CHECK((tipo IN ('BonoSkill','MinimoSkill','TiradaNE','Salvataje') AND skill_id IS NOT NULL) OR (tipo NOT IN ('BonoSkill','MinimoSkill','TiradaNE','Salvataje') AND skill_id IS NULL)),
 CHECK(tipo NOT IN ('BonoSkill','MinimoSkill','TiradaNE','Salvataje','XPInicial') OR valor=CAST(valor AS INTEGER)),
 CHECK(tipo NOT IN ('MinimoSkill','Salvataje','XPInicial','Mitigacion') OR valor>=0),
 CHECK(tipo<>'MinimoSkill' OR valor<=99),
 CHECK(tipo<>'XPInicial' OR fase='Creacion'),
 CHECK(fase<>'Creacion' OR tipo IN ('BonoSkill','MinimoSkill','XPInicial')),
 CHECK(tipo NOT IN ('Mitigacion','Resistencia','Debilidad') OR objetivo IN ('Cortante','Punzante','Contundente','Fuego','Frío','Rayo','Ácido','Necrótico','Radiante','Sónico','Espiritual','Psíquico','Verdadero')),
 CHECK(tipo<>'Resistencia' OR valor=0.5), CHECK(tipo<>'Debilidad' OR valor=2),
 CHECK(tipo NOT IN ('Mitigacion','Resistencia','Debilidad') OR objetivo<>'Verdadero')
);
CREATE TABLE rasgos_acciones (rasgo_id INTEGER NOT NULL REFERENCES rasgos(id),accion_id INTEGER NOT NULL REFERENCES acciones(id),PRIMARY KEY(rasgo_id,accion_id));
CREATE TABLE dotes_rasgos (dote_id INTEGER NOT NULL REFERENCES dotes(id),rasgo_id INTEGER NOT NULL REFERENCES rasgos(id),PRIMARY KEY(dote_id,rasgo_id));
CREATE TABLE dedicaciones_rasgos (dedicacion_id INTEGER NOT NULL REFERENCES dedicaciones(id),rasgo_id INTEGER NOT NULL REFERENCES rasgos(id),PRIMARY KEY(dedicacion_id,rasgo_id));
CREATE TABLE nacimientos_rasgos (nacimiento_id INTEGER NOT NULL REFERENCES nacimientos(id),rasgo_id INTEGER NOT NULL REFERENCES rasgos(id),PRIMARY KEY(nacimiento_id,rasgo_id));
CREATE TABLE personajes_rasgos (personaje_id INTEGER NOT NULL REFERENCES personajes(id),rasgo_id INTEGER NOT NULL REFERENCES rasgos(id),fuente TEXT NOT NULL DEFAULT 'Narrador',PRIMARY KEY(personaje_id,rasgo_id));
CREATE TRIGGER modificador_de_capacidad BEFORE INSERT ON rasgos_modificadores
WHEN NOT EXISTS(SELECT 1 FROM rasgos WHERE id=NEW.rasgo_id AND tipo='Capacidad')
BEGIN SELECT RAISE(ABORT,'Una etiqueta no contiene modificadores mecánicos'); END;
CREATE TRIGGER modificador_de_capacidad_update BEFORE UPDATE ON rasgos_modificadores
WHEN NOT EXISTS(SELECT 1 FROM rasgos WHERE id=NEW.rasgo_id AND tipo='Capacidad')
BEGIN SELECT RAISE(ABORT,'Una etiqueta no contiene modificadores mecánicos'); END;
CREATE TRIGGER accion_de_capacidad BEFORE INSERT ON rasgos_acciones
WHEN NOT EXISTS(SELECT 1 FROM rasgos WHERE id=NEW.rasgo_id AND tipo='Capacidad')
BEGIN SELECT RAISE(ABORT,'Una etiqueta no concede acciones'); END;
CREATE TRIGGER accion_de_capacidad_update BEFORE UPDATE ON rasgos_acciones
WHEN NOT EXISTS(SELECT 1 FROM rasgos WHERE id=NEW.rasgo_id AND tipo='Capacidad')
BEGIN SELECT RAISE(ABORT,'Una etiqueta no concede acciones'); END;
CREATE TRIGGER conservar_capacidad BEFORE UPDATE OF tipo ON rasgos
WHEN NEW.tipo='Etiqueta' AND (EXISTS(SELECT 1 FROM rasgos_modificadores WHERE rasgo_id=OLD.id) OR EXISTS(SELECT 1 FROM rasgos_acciones WHERE rasgo_id=OLD.id))
BEGIN SELECT RAISE(ABORT,'Un rasgo con efectos no se convierte en etiqueta'); END;
CREATE VIEW v_rasgos_definicion AS SELECT r.*,
 json_object('id',r.id,'nombre',r.nombre,'descripcion',r.descripcion,'tipo',r.tipo,'regla_texto',r.regla_texto,
 'modificadores',json(COALESCE((SELECT json_group_array(json_object('tipo',m.tipo,'skill_id',m.skill_id,'objetivo',m.objetivo,'valor',m.valor,'unidad',m.unidad,'fase',m.fase,'condicion',m.condicion,'descripcion',m.descripcion)) FROM rasgos_modificadores m WHERE m.rasgo_id=r.id),'[]')),
 'acciones',json(COALESCE((SELECT json_group_array(accion_id) FROM rasgos_acciones a WHERE a.rasgo_id=r.id),'[]'))) AS definicion_json
 FROM rasgos r;
