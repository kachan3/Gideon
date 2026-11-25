ALTER TABLE artefactos_arcanos ADD COLUMN demo INTEGER NOT NULL DEFAULT 0;
ALTER TABLE artefactos_arcanos ADD COLUMN reglas_json TEXT CHECK(reglas_json IS NULL OR json_valid(reglas_json));
ALTER TABLE inventario ADD COLUMN artefacto_activo INTEGER NOT NULL DEFAULT 0 CHECK(artefacto_activo IN(0,1));
ALTER TABLE inventario ADD COLUMN ultima_recarga_dia TEXT;
ALTER TABLE clases ADD COLUMN oro_inicial INTEGER NOT NULL DEFAULT 200 CHECK(oro_inicial>=0);
UPDATE clases SET oro_inicial=100 WHERE nombre='Senda del Arcanista';
