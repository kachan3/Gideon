ALTER TABLE epifanias ADD COLUMN catalogo_inicial INTEGER NOT NULL DEFAULT 0 CHECK(catalogo_inicial IN(0,1));
ALTER TABLE efectos ADD COLUMN reglas_json TEXT CHECK(reglas_json IS NULL OR json_valid(reglas_json));
ALTER TABLE efectos ADD COLUMN duracion_pl_maximo INTEGER CHECK(duracion_pl_maximo IS NULL OR duracion_pl_maximo>=1);
ALTER TABLE trucos ADD COLUMN opciones_coste TEXT CHECK(opciones_coste IS NULL OR json_valid(opciones_coste));
ALTER TABLE trucos ADD COLUMN componentes TEXT;
ALTER TABLE trucos ADD COLUMN intervalo_duracion TEXT;
ALTER TABLE trucos ADD COLUMN concentracion TEXT;
ALTER TABLE trucos ADD COLUMN alcance_texto TEXT;
ALTER TABLE trucos ADD COLUMN parametros_pendientes TEXT;
