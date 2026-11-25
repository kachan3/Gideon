CREATE TABLE clases_skills (
 clase_id INTEGER NOT NULL REFERENCES clases(id),
 skill_id INTEGER NOT NULL REFERENCES all_skills(id),
 valor_inicial INTEGER NOT NULL DEFAULT 0 CHECK(valor_inicial BETWEEN 0 AND 99),
 PRIMARY KEY(clase_id,skill_id)
);
INSERT INTO clases_skills(clase_id,skill_id,valor_inicial)
 SELECT c.id,s.id,0 FROM clases c CROSS JOIN all_skills s WHERE c.nombre LIKE '%Honor%' AND s.nombre='Honor';
