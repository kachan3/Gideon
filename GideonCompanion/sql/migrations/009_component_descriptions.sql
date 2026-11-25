-- Texto de reglas para jugadores/DM; no contiene un intérprete de efectos.
ALTER TABLE efectos ADD COLUMN pl_escalable INTEGER NOT NULL DEFAULT 0 CHECK(pl_escalable IN(0,1));
ALTER TABLE efectos ADD COLUMN efecto_base TEXT;
ALTER TABLE efectos ADD COLUMN aspecto_escalable TEXT;
ALTER TABLE efectos ADD COLUMN escalado_texto TEXT;
ALTER TABLE efectos ADD COLUMN escalado_pendiente INTEGER NOT NULL DEFAULT 1 CHECK(escalado_pendiente IN(0,1));
ALTER TABLE mediums ADD COLUMN efecto_base TEXT;
ALTER TABLE mediums ADD COLUMN aspecto_escalable TEXT;
ALTER TABLE mediums ADD COLUMN escalado_texto TEXT;
ALTER TABLE mediums ADD COLUMN escalado_pendiente INTEGER NOT NULL DEFAULT 1 CHECK(escalado_pendiente IN(0,1));
ALTER TABLE shapes ADD COLUMN efecto_base TEXT;
ALTER TABLE shapes ADD COLUMN aspecto_escalable TEXT;
ALTER TABLE shapes ADD COLUMN escalado_texto TEXT;
ALTER TABLE shapes ADD COLUMN escalado_pendiente INTEGER NOT NULL DEFAULT 1 CHECK(escalado_pendiente IN(0,1));
ALTER TABLE mods ADD COLUMN efecto_base TEXT;
ALTER TABLE mods ADD COLUMN aspecto_escalable TEXT;
ALTER TABLE mods ADD COLUMN escalado_texto TEXT;
ALTER TABLE mods ADD COLUMN escalado_pendiente INTEGER NOT NULL DEFAULT 1 CHECK(escalado_pendiente IN(0,1));

UPDATE efectos SET efecto_base=descripcion;
UPDATE mediums SET efecto_base=reach;
UPDATE shapes SET efecto_base=area;
UPDATE mods SET efecto_base=descripcion;
-- Hasta documentar su tasa, no se permite comprar una mejora indeterminada.
UPDATE mediums SET pl_escalable=0;
UPDATE shapes SET pl_escalable=0;
UPDATE mods SET pl_escalable=0;

UPDATE efectos SET pl_escalable=1,escalado_pendiente=0,
 efecto_base='Daño genérico: 1 PL de Efecto aporta una vez el Nivel de Voluntad.',
 aspecto_escalable='Daño',escalado_texto='Cada PL extra de Efecto añade una vez el Nivel de Voluntad al daño genérico. Los PL de otros segmentos no aumentan este daño.'
 WHERE nombre='Llama — ejemplo';
UPDATE mediums SET escalado_pendiente=0,efecto_base='El conjuro se aplica sobre ti mismo.',escalado_texto='El objetivo Self es fijo; invertir PL extra no cambia a quién afecta.' WHERE nombre='Self';
UPDATE mediums SET escalado_pendiente=0,efecto_base='El conjuro se aplica mediante contacto.',escalado_texto='El alcance de toque es fijo; invertir PL extra no lo convierte en alcance a distancia.' WHERE nombre='Touch';
UPDATE mediums SET pl_escalable=1,escalado_pendiente=0,
 efecto_base='Un punto visible a un alcance de 15 unidades con el mínimo de 1 PL de Medium.',
 aspecto_escalable='Distancia de lanzamiento',
 escalado_texto='Cada PL extra de Medium aumenta la distancia en 5 unidades: 10 + 5 × PL del Medium. La selección de un punto visible permanece fija.'
 WHERE nombre IN('Punto visible — ejemplo','A point you can see');
UPDATE mediums SET pl_escalable=1,escalado_pendiente=0,
 efecto_base='Una criatura designada a un alcance de 15 unidades con el mínimo de 1 PL de Medium.',
 aspecto_escalable='Distancia de lanzamiento',
 escalado_texto='Cada PL extra de Medium aumenta la distancia en 5 unidades: 10 + 5 × PL del Medium. Sigue afectando a una criatura designada.'
 WHERE nombre='A creature you designate';
UPDATE shapes SET escalado_pendiente=0,efecto_base='Un único objetivo.',escalado_texto='Proyectil mantiene un objetivo. No aumenta el número de objetivos ni el área al invertir PL extra.' WHERE nombre IN('Proyectil','Proyectil — ejemplo');
UPDATE mods SET pl_escalable=1,escalado_pendiente=0,efecto_base='El conjuro salta a un objetivo adicional por 1 PL.',aspecto_escalable='Saltos adicionales',escalado_texto='Cada PL extra añade un salto a otro objetivo.' WHERE nombre='Encadenado';
UPDATE mods SET escalado_pendiente=0,efecto_base='El hechizo no produce componente audible.',escalado_texto='La supresión del sonido es fija; invertir PL extra no la mejora.' WHERE nombre='Silencioso';

CREATE TABLE duraciones (
 id INTEGER PRIMARY KEY, intervalo TEXT NOT NULL UNIQUE,
 pl_minimo INTEGER NOT NULL CHECK(pl_minimo>=0),
 pl_escalable INTEGER NOT NULL CHECK(pl_escalable IN(0,1)),
 efecto_base TEXT NOT NULL,aspecto_escalable TEXT,escalado_texto TEXT NOT NULL,
 escalado_pendiente INTEGER NOT NULL DEFAULT 0 CHECK(escalado_pendiente IN(0,1))
);
INSERT INTO duraciones(intervalo,pl_minimo,pl_escalable,efecto_base,aspecto_escalable,escalado_texto) VALUES
 ('Instantánea',0,0,'Un pulso instantáneo.',NULL,'0 PL. No admite prolongación.'),
 ('Turnos',1,1,'Un turno por 1 PL.','Tiempo','Cada PL extra añade un turno.'),
 ('Rondas',1,1,'Una ronda (6 segundos) por 1 PL.','Tiempo','Cada PL extra añade una ronda (6 segundos).'),
 ('Minutos',1,1,'Un minuto por 1 PL.','Tiempo','Cada PL extra añade un minuto.'),
 ('10 Minutos',1,1,'Diez minutos por 1 PL.','Tiempo','Cada PL extra añade diez minutos.'),
 ('Hora',1,1,'Una hora por 1 PL.','Tiempo','Cada PL extra añade una hora.'),
 ('8 Horas',1,1,'Ocho horas por 1 PL.','Tiempo','Cada PL extra añade ocho horas.'),
 ('Días',1,1,'Un día por 1 PL.','Tiempo','Cada PL extra añade un día.'),
 ('Semanas',1,1,'Una semana por 1 PL.','Tiempo','Cada PL extra añade una semana.'),
 ('Meses',1,1,'Un mes por 1 PL.','Tiempo','Cada PL extra añade un mes.'),
 ('Años',1,1,'Un año por 1 PL.','Tiempo','Cada PL extra añade un año.'),
 ('Until Dispelled (Indeterminado)',1,0,'Hasta ser disipado, por 1 PL.',NULL,'Duración indeterminada. No se prolonga mediante PL extra.');

-- Ejemplo provisional de Hassan. El mínimo de 1 PL procede del primer Cono de la matriz.
INSERT OR IGNORE INTO shapes(nombre,coste_pl,area,componentes,pl_escalable,efecto_base,aspecto_escalable,escalado_texto,escalado_pendiente)
 VALUES('Cono — ejemplo provisional',1,'Cono de 5 unidades','Motriz',1,'Cono de 5 unidades con la inversión base de 1 PL.','Tamaño del cono','Cada PL extra sobre el coste base añade 3 unidades al cono. Ejemplo provisional; la geometría definitiva queda pendiente.',0);
INSERT OR IGNORE INTO epifanias_shapes(epifania_id,shape_id)
 SELECT e.id,s.id FROM epifanias e CROSS JOIN shapes s
 WHERE e.nombre='Evocación Básica' AND e.descripcion LIKE '%demostración%' AND s.nombre='Cono — ejemplo provisional';
