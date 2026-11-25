-- Los beneficios de origen son Rasgos automáticos, no compras de dotes.
-- Se conservan los dotes anteriores y su historial como referencias heredadas.
ALTER TABLE dotes ADD COLUMN rasgo_origen_id INTEGER REFERENCES rasgos(id);
ALTER TABLE linajes_skills ADD COLUMN rasgo_id INTEGER REFERENCES rasgos(id);
ALTER TABLE dedicaciones_skills ADD COLUMN rasgo_id INTEGER REFERENCES rasgos(id);
ALTER TABLE linajes_elecciones ADD COLUMN rasgo_id INTEGER REFERENCES rasgos(id);
