CREATE TABLE IF NOT EXISTS reglas_atomicas (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  texto TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS documentos_reglas (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  grupo TEXT NOT NULL,
  texto TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS alias_reglas (
  alias TEXT NOT NULL,
  regla_id TEXT NOT NULL REFERENCES reglas_atomicas(id) ON DELETE CASCADE,
  PRIMARY KEY (alias, regla_id)
);
CREATE TABLE IF NOT EXISTS textos_catalogo (
  tabla TEXT NOT NULL,
  fila INTEGER NOT NULL,
  campo TEXT NOT NULL,
  fuente TEXT NOT NULL,
  texto TEXT NOT NULL,
  PRIMARY KEY (tabla, fila, campo)
);
