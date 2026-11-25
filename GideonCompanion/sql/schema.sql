-- =============================================================================
-- GIDEON COMPANION — ARQUITECTURA SQL CANÓNICA
-- Motor compatible con SQLite / PostgreSQL
-- El modelo activo de SQLite se completa con sql/migrations/.
-- 010_lineages.sql: linajes iniciales, modificadores de dotes, elecciones de skills,
-- equipo cultural y trazabilidad. 013_traits.sql amplía Rasgos con capacidades.
-- 011_paths.sql: seis Sendas de demo y resúmenes de rasgos/dotes de origen.
-- 013_traits.sql: Rasgos tipados, modificadores y acciones; texto de regla no ejecutable.
-- 014_origins_professions.sql: ocho Dedicaciones/Nacimientos, oficios y preguntas.
-- =============================================================================

PRAGMA foreign_keys = ON;

-- -----------------------------------------------------------------------------
-- 1. RASGOS (base compatible; 013 añade tipo Etiqueta/Capacidad y efectos relacionados)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rasgos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT NOT NULL
);

-- -----------------------------------------------------------------------------
-- 2. MOTOR DE ACCIONES (Referenciado por Personajes, Clases, Dotes, Epifanías, Trucos)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS acciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    tipo TEXT NOT NULL DEFAULT 'Generica', -- 'Generica', 'Reaccion', 'Senda', 'Dote', 'Epifania', 'Truco'
    nro_acciones_pa INTEGER NOT NULL DEFAULT 1, -- 0 (Gratis/Reacción), 1, 2, 3
    coste_stamina INTEGER NOT NULL DEFAULT 0,
    coste_mana INTEGER NOT NULL DEFAULT 0,
    descripcion TEXT NOT NULL,
    rasgo_id INTEGER,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- -----------------------------------------------------------------------------
-- 3. ESTADOS ALTERADOS (§18 Core)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS estados_alterados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    es_graduado INTEGER NOT NULL DEFAULT 0, -- 1 si tiene grado (ej. Torpe X), 0 si es binario (ej. Arrebatado)
    descripcion TEXT NOT NULL,
    rasgo_id INTEGER,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- -----------------------------------------------------------------------------
-- 4. LINAJES Y CLASES (SENDAS)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS linajes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    especie TEXT NOT NULL DEFAULT 'Dríade',
    escalado_vital REAL NOT NULL DEFAULT 2.0, -- 2.0, 2.5, 3.0
    descripcion TEXT,
    rasgo_id INTEGER,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS clases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    dado_senda_inicial TEXT NOT NULL DEFAULT '1d4',
    descripcion TEXT,
    accion_id INTEGER,
    rasgo_id INTEGER,
    FOREIGN KEY (accion_id) REFERENCES acciones(id) ON DELETE SET NULL,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- -----------------------------------------------------------------------------
-- 5. DOTES Y REQUISITOS (One-to-Many)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    tipo TEXT NOT NULL DEFAULT 'Universal', -- 'Senda', 'Universal', 'Combate'
    clase_id INTEGER DEFAULT NULL, -- Si posee el Rasgo "Clase" (vinculado a una Senda específica) o es exclusivo de ella
    es_exclusivo_clase INTEGER NOT NULL DEFAULT 0, -- 1 si es un Dote exclusivo de dicha clase desbloqueable por XP de Clase
    xp_clase_requerida INTEGER NOT NULL DEFAULT 0, -- Cuánta XP acumulada en elementos con el Rasgo de esta Clase exige desbloquearlo (si pertenece a la clase)
    costo_xp INTEGER NOT NULL DEFAULT 1,
    descripcion TEXT NOT NULL,
    accion_id INTEGER,
    rasgo_id INTEGER,
    FOREIGN KEY (clase_id) REFERENCES clases(id) ON DELETE SET NULL,
    FOREIGN KEY (accion_id) REFERENCES acciones(id) ON DELETE SET NULL,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS dotes_requisitos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dote_id INTEGER NOT NULL,
    tipo_requisito TEXT NOT NULL, -- 'Atributo', 'Habilidad', 'Dote', 'Clase', 'Carga'
    objetivo TEXT NOT NULL,       -- ej. 'Fuerza', 'Una Mano', 'Golpe Dual'
    valor_minimo INTEGER DEFAULT 0,
    descripcion TEXT,
    rasgo_id INTEGER,
    FOREIGN KEY (dote_id) REFERENCES dotes(id) ON DELETE CASCADE,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- Rasgos exclusivos de Clase desbloqueables al invertir XP en elementos (Dotes, Hechizos o Armas) con el Rasgo "Clase" si se es de dicha clase (§12 Core)
CREATE TABLE IF NOT EXISTS clases_rasgos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clase_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    xp_clase_requerida INTEGER NOT NULL DEFAULT 0, -- Cuánta XP invertida en elementos (Dotes, Hechizos o Armas) con el Rasgo de esta Clase exige desbloquear el rasgo
    es_insignia INTEGER NOT NULL DEFAULT 0, -- 1 si es Habilidad Insignia inicial de la Senda
    descripcion TEXT NOT NULL,
    accion_id INTEGER,
    rasgo_id INTEGER,
    FOREIGN KEY (clase_id) REFERENCES clases(id) ON DELETE CASCADE,
    FOREIGN KEY (accion_id) REFERENCES acciones(id) ON DELETE SET NULL,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- -----------------------------------------------------------------------------
-- 5B. TRASFONDOS: DEDICACIONES, SKILLS GARANTIZADAS, NACIMIENTO, REGALOS Y PERJUICIOS (§17 Core)
-- -----------------------------------------------------------------------------

-- Tabla de Dedicaciones (Unidades de Identidad Narrativa y Mecánica)
CREATE TABLE IF NOT EXISTS dedicaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT NOT NULL,
    preguntas_orientativas TEXT, -- Preguntas narrativas; 012_background.sql normaliza preguntas y respuestas
    dote_otorgado_id INTEGER DEFAULT NULL, -- Dote inicial asociado a la Dedicación
    rasgo_id INTEGER,
    FOREIGN KEY (dote_otorgado_id) REFERENCES dotes(id) ON DELETE SET NULL,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- Tabla de Skills Garantizadas Dedicaciones (Catálogo de pisos garantizados de Habilidades Hijas)
CREATE TABLE IF NOT EXISTS skills_garantizadas_dedicaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    columna_skill TEXT NOT NULL, -- ej. 'skill_medicina', 'skill_sigilo', 'skill_una_mano'
    nombre_skill TEXT NOT NULL,  -- ej. 'Medicina', 'Sigilo', 'Una Mano'
    valor_piso_garantizado INTEGER NOT NULL DEFAULT 50, -- ej. 60, 50, 40
    bono_destacado INTEGER NOT NULL DEFAULT 5, -- Regla §17.2: si el jugador ya superaba el piso, gana +5 ("Destacado")
    UNIQUE(columna_skill, valor_piso_garantizado)
);

-- Relación Many-to-Many: Varias Dedicaciones pueden compartir/tener varias Skills Garantizadas
CREATE TABLE IF NOT EXISTS dedicaciones_skills_garantizadas (
    dedicacion_id INTEGER NOT NULL,
    skill_garantizada_id INTEGER NOT NULL,
    PRIMARY KEY (dedicacion_id, skill_garantizada_id),
    FOREIGN KEY (dedicacion_id) REFERENCES dedicaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_garantizada_id) REFERENCES skills_garantizadas_dedicaciones(id) ON DELETE CASCADE
);

-- Tabla de Nacimiento (Unidades Sociales y Económicas — Rango 1d100)
CREATE TABLE IF NOT EXISTS nacimientos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    rango_d100_min INTEGER NOT NULL CHECK (rango_d100_min BETWEEN 1 AND 100),
    rango_d100_max INTEGER NOT NULL CHECK (rango_d100_max BETWEEN 1 AND 100),
    es_baja_frecuencia INTEGER NOT NULL DEFAULT 0, -- 1 para Esclavo, Noble, Monárquico, Enclave Mágico
    descripcion TEXT NOT NULL,
    rasgo_id INTEGER,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- Tabla Unificada de Regalos y Perjuicios (§17.4 Core)
CREATE TABLE IF NOT EXISTS regalos_perjuicios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    tipo TEXT NOT NULL CHECK (tipo IN ('Regalo', 'Perjuicio')),
    opuesto_id INTEGER DEFAULT NULL, -- Self-FK al Regalo/Perjuicio temáticamente opuesto (ej. Agraciado <-> Poco Atractivo)
    ignora_techo_80 INTEGER NOT NULL DEFAULT 1, -- Los modificadores de Regalos/Perjuicios ignoran el límite de 80 en creación
    efecto_mecanico TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    estado_id INTEGER DEFAULT NULL, -- Si representa una discapacidad o condición permanente vinculada a un Estado
    rasgo_id INTEGER,
    FOREIGN KEY (opuesto_id) REFERENCES regalos_perjuicios(id) ON DELETE SET NULL,
    FOREIGN KEY (estado_id) REFERENCES estados_alterados(id) ON DELETE SET NULL,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- -----------------------------------------------------------------------------
-- 6. SPELLCASTING MODULAR: COMPONENTES, TRUCOS, MÍSTICAS Y EPIFANÍAS
-- -----------------------------------------------------------------------------

-- 6.1 Efectos (Incluye Duración, Mantenimiento y Concentración por ser propiedad del Efecto)
CREATE TABLE IF NOT EXISTS efectos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    escuela TEXT NOT NULL, -- 'Ignamor', 'Cronibor', 'Yrgrammar', 'Naial', 'Ivganny', 'Gelmir'
    categoria TEXT NOT NULL, -- 'Ataque Mágico', 'Maldición', 'Devastación', 'Inevitable'
    propagacion TEXT NOT NULL, -- 'Ráfaga', 'Evocado'
    formula_potencia TEXT NOT NULL DEFAULT 'X', -- 'X', '2X', '3X', 'X+Y'
    intervalo_duracion TEXT NOT NULL DEFAULT 'Instantánea',
    coste_mantenimiento TEXT DEFAULT 'Ninguno',
    concentracion TEXT NOT NULL DEFAULT 'Ninguna', -- 'Ninguna', 'Ligera', 'Demandante', 'Exhaustiva'
    componentes TEXT, -- 'Verbal, Motriz, Material[Rubí]...'
    restricciones TEXT, -- 'Duracion[Instantanea], Shape[Linea]...'
    descripcion TEXT,
    rasgo_id INTEGER,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- 6.2 Mediums
CREATE TABLE IF NOT EXISTS mediums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    coste_pl INTEGER NOT NULL DEFAULT 0,
    reach TEXT NOT NULL DEFAULT '0u',
    componentes TEXT,
    condicion_aplicacion TEXT,
    restricciones TEXT,
    rasgo_id INTEGER,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- 6.3 Shapes (Configuraciones)
CREATE TABLE IF NOT EXISTS shapes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    coste_pl INTEGER NOT NULL DEFAULT 0,
    area TEXT NOT NULL,
    componentes TEXT,
    restricciones TEXT,
    rasgo_id INTEGER,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- 6.4 Modificadores (Mods)
CREATE TABLE IF NOT EXISTS mods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    escuela TEXT,
    coste_pl INTEGER NOT NULL DEFAULT 1,
    componentes TEXT,
    restricciones TEXT,
    descripcion TEXT,
    rasgo_id INTEGER,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- 6.5 Trucos (Many-to-One hacia Efectos, Mediums, Shapes y Mods)
CREATE TABLE IF NOT EXISTS trucos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    escuela TEXT NOT NULL,
    recurso TEXT NOT NULL DEFAULT 'Stamina', -- 'Stamina', 'Mana', 'Gratis'
    coste_recurso INTEGER NOT NULL DEFAULT 0,
    efecto_id INTEGER,
    medium_id INTEGER,
    shape_id INTEGER,
    mod_id INTEGER,
    accion_id INTEGER,
    rasgo_id INTEGER,
    descripcion TEXT,
    FOREIGN KEY (efecto_id) REFERENCES efectos(id) ON DELETE SET NULL,
    FOREIGN KEY (medium_id) REFERENCES mediums(id) ON DELETE SET NULL,
    FOREIGN KEY (shape_id) REFERENCES shapes(id) ON DELETE SET NULL,
    FOREIGN KEY (mod_id) REFERENCES mods(id) ON DELETE SET NULL,
    FOREIGN KEY (accion_id) REFERENCES acciones(id) ON DELETE SET NULL,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- 6.6 Místicas
CREATE TABLE IF NOT EXISTS misticas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    escuela TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    rasgo_id INTEGER,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- 6.7 Epifanías / Hechizos (Con sus 6 relaciones hacia Efectos, Mediums, Shapes, Mods, Trucos, Místicas)
CREATE TABLE IF NOT EXISTS epifanias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    escuela TEXT NOT NULL,
    costo_xp INTEGER NOT NULL DEFAULT 1,
    clase_id INTEGER DEFAULT NULL, -- Si el hechizo/epifanía posee el Rasgo "Clase" (al invertir XP siendo de dicha clase, desbloquea Dotes/Rasgos exclusivos)
    descripcion TEXT,
    accion_id INTEGER,
    rasgo_id INTEGER,
    FOREIGN KEY (clase_id) REFERENCES clases(id) ON DELETE SET NULL,
    FOREIGN KEY (accion_id) REFERENCES acciones(id) ON DELETE SET NULL,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS epifanias_requisitos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    epifania_id INTEGER NOT NULL,
    tipo_requisito TEXT NOT NULL,
    objetivo TEXT NOT NULL,
    valor_minimo INTEGER DEFAULT 0,
    rasgo_id INTEGER,
    FOREIGN KEY (epifania_id) REFERENCES epifanias(id) ON DELETE CASCADE,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- Las 6 tablas puente de Epifanías (1 Epifanía puede otorgar 1 o más de cada uno)
CREATE TABLE IF NOT EXISTS epifanias_efectos (
    epifania_id INTEGER NOT NULL,
    efecto_id INTEGER NOT NULL,
    PRIMARY KEY (epifania_id, efecto_id),
    FOREIGN KEY (epifania_id) REFERENCES epifanias(id) ON DELETE CASCADE,
    FOREIGN KEY (efecto_id) REFERENCES efectos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS epifanias_mediums (
    epifania_id INTEGER NOT NULL,
    medium_id INTEGER NOT NULL,
    PRIMARY KEY (epifania_id, medium_id),
    FOREIGN KEY (epifania_id) REFERENCES epifanias(id) ON DELETE CASCADE,
    FOREIGN KEY (medium_id) REFERENCES mediums(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS epifanias_shapes (
    epifania_id INTEGER NOT NULL,
    shape_id INTEGER NOT NULL,
    PRIMARY KEY (epifania_id, shape_id),
    FOREIGN KEY (epifania_id) REFERENCES epifanias(id) ON DELETE CASCADE,
    FOREIGN KEY (shape_id) REFERENCES shapes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS epifanias_mods (
    epifania_id INTEGER NOT NULL,
    mod_id INTEGER NOT NULL,
    PRIMARY KEY (epifania_id, mod_id),
    FOREIGN KEY (epifania_id) REFERENCES epifanias(id) ON DELETE CASCADE,
    FOREIGN KEY (mod_id) REFERENCES mods(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS epifanias_trucos (
    epifania_id INTEGER NOT NULL,
    truco_id INTEGER NOT NULL,
    PRIMARY KEY (epifania_id, truco_id),
    FOREIGN KEY (epifania_id) REFERENCES epifanias(id) ON DELETE CASCADE,
    FOREIGN KEY (truco_id) REFERENCES trucos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS epifanias_misticas (
    epifania_id INTEGER NOT NULL,
    mistica_id INTEGER NOT NULL,
    PRIMARY KEY (epifania_id, mistica_id),
    FOREIGN KEY (epifania_id) REFERENCES epifanias(id) ON DELETE CASCADE,
    FOREIGN KEY (mistica_id) REFERENCES misticas(id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- 7. HERRERÍA DEL MÁSTER, ÍTEMS BASE, ARTEFACTOS ARCANOS (BASTONES) E ÍTEMS MÁGICOS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ventajas_arma (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    grado_coste INTEGER NOT NULL DEFAULT 1, -- 1, 2 o 3 (Resta puntos de balance)
    usa_formula_mitad_nivel INTEGER NOT NULL DEFAULT 0, -- 1 para Penetración, Wounding, Brutal
    descripcion TEXT NOT NULL,
    rasgo_id INTEGER,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS limitaciones_arma (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    grado_devolucion INTEGER NOT NULL DEFAULT 1, -- 1, 2 o 3 (Suma puntos de balance)
    descripcion TEXT NOT NULL,
    rasgo_id INTEGER,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS armas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL, -- 'Una Mano', 'A Dos Manos', 'Armas Dobles', 'Arcos', 'Ballestas', 'Armas de Fuego', 'Arrojar'
    categoria_balance TEXT NOT NULL DEFAULT 'Militar', -- 'Burda' (0), 'Cotidiana' (+1), 'Militar' (+2)
    puntos_balance_inicial INTEGER NOT NULL DEFAULT 2,
    nivel_arma INTEGER NOT NULL DEFAULT 1 CHECK (nivel_arma BETWEEN 1 AND 10),
    tipo_dano TEXT NOT NULL DEFAULT 'Cortante', -- 'Cortante', 'Punzante', 'Contundente'
    clase_id INTEGER DEFAULT NULL, -- Si el arma posee el Rasgo "Clase" (al invertir XP en ella siendo de dicha clase, desbloquea Dotes/Rasgos exclusivos)
    rasgo_id INTEGER,
    FOREIGN KEY (clase_id) REFERENCES clases(id) ON DELETE SET NULL,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- Many-to-Many: Armas <-> Ventajas
CREATE TABLE IF NOT EXISTS armas_ventajas (
    arma_id INTEGER NOT NULL,
    ventaja_id INTEGER NOT NULL,
    parametro_x TEXT, -- ej. '+2', '30/60', o calculado por ceil(nivel/2)
    grado_aplicado INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (arma_id, ventaja_id),
    FOREIGN KEY (arma_id) REFERENCES armas(id) ON DELETE CASCADE,
    FOREIGN KEY (ventaja_id) REFERENCES ventajas_arma(id) ON DELETE CASCADE
);

-- Many-to-Many: Armas <-> Limitaciones
CREATE TABLE IF NOT EXISTS armas_limitaciones (
    arma_id INTEGER NOT NULL,
    limitacion_id INTEGER NOT NULL,
    parametro_x TEXT, -- ej. '30' para Pesada(30)
    grado_aplicado INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (arma_id, limitacion_id),
    FOREIGN KEY (arma_id) REFERENCES armas(id) ON DELETE CASCADE,
    FOREIGN KEY (limitacion_id) REFERENCES limitaciones_arma(id) ON DELETE CASCADE
);

-- Armaduras dinámicas (Regla DMs_Blacksmit §9: S/P/B x Nivel de Equipo)
CREATE TABLE IF NOT EXISTS armaduras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL CHECK (categoria IN ('Ligera', 'Mediana', 'Pesada')),
    base_general REAL NOT NULL, -- 0.5 (Ligera), 1.0 (Mediana), 1.5 (Pesada)
    puntos_asignables REAL NOT NULL, -- 1.0 (Ligera), 2.0 (Mediana), 3.0 (Pesada)
    nivel_equipo INTEGER NOT NULL DEFAULT 1 CHECK (nivel_equipo BETWEEN 1 AND 10),
    puntos_s REAL NOT NULL DEFAULT 0,
    puntos_p REAL NOT NULL DEFAULT 0,
    puntos_b REAL NOT NULL DEFAULT 0,
    -- Reducción calculada dinámicamente según fórmula canónica: FLOOR((base_general + puntos) * nivel_equipo)
    reduccion_s INTEGER GENERATED ALWAYS AS (CAST((base_general + puntos_s) * nivel_equipo AS INTEGER)) STORED,
    reduccion_p INTEGER GENERATED ALWAYS AS (CAST((base_general + puntos_p) * nivel_equipo AS INTEGER)) STORED,
    reduccion_b INTEGER GENERATED ALWAYS AS (CAST((base_general + puntos_b) * nivel_equipo AS INTEGER)) STORED,
    rasgo_id INTEGER,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- 7.1 Tabla de Ítems Base (Equipo mundano, consumibles, herramientas, anillos, capas, etc.)
CREATE TABLE IF NOT EXISTS items_base (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    categoria TEXT NOT NULL DEFAULT 'General', -- 'Herramienta', 'Consumible', 'Accesorio', 'Contenedor', 'General'
    peso REAL NOT NULL DEFAULT 0.0,
    valor_base INTEGER NOT NULL DEFAULT 0,
    descripcion TEXT,
    rasgo_id INTEGER,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- 7.2 Tabla de Artefactos Arcanos y Reglas de Bastones (§13.7 Core & Arcanista_03)
CREATE TABLE IF NOT EXISTS artefactos_arcanos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    es_baston INTEGER NOT NULL DEFAULT 1, -- 1 si es un Bastón (fuente genérica de daño/canalización arcana)
    escuela TEXT NOT NULL, -- 'Ignamor', 'Cronibor', 'Yrgrammar', 'Naial', 'Ivganny', 'Gelmir', 'Universal'
    pl_fijo INTEGER NOT NULL DEFAULT 1, -- Nivel de Poder (PL) fijo al que se lanza el efecto del bastón/artefacto
    cargas_maximas INTEGER NOT NULL DEFAULT 3, -- Cargas máximas que almacena el artefacto
    coste_cargas_activacion INTEGER NOT NULL DEFAULT 1, -- Cuántas cargas consume por uso
    tasa_conversion_mana_cargas TEXT NOT NULL DEFAULT '2 Mana = 1 Carga', -- Regla de recarga activa inyectando maná
    tiempo_recarga_natural TEXT NOT NULL DEFAULT 'Amanecer (1d4 cargas)', -- Regla de recarga pasiva/natural
    herramienta_compatible TEXT DEFAULT 'Arma/Bastón, Libro, Amuleto', -- Con qué Herramienta de Lanzador puede compactarse
    permite_compactar INTEGER NOT NULL DEFAULT 1, -- 1 si un Arcanista puede compactarlo con su Herramienta de Lanzador
    -- Hechizo/Efecto preconfigurado dentro del Bastón o Artefacto
    efecto_id INTEGER DEFAULT NULL,
    medium_id INTEGER DEFAULT NULL,
    shape_id INTEGER DEFAULT NULL,
    mod_id INTEGER DEFAULT NULL,
    truco_id INTEGER DEFAULT NULL,
    -- Referencia opcional a item_base, arma o armadura (todas pueden ser NULL)
    item_base_id INTEGER DEFAULT NULL,
    arma_id INTEGER DEFAULT NULL,
    armadura_id INTEGER DEFAULT NULL,
    -- Reglas de Sintonía (XP), Rasgo "Clase" y Nivel del Artefacto
    costo_xp_sintonia INTEGER NOT NULL DEFAULT 0,
    clase_id INTEGER DEFAULT NULL, -- Si posee el Rasgo "Clase" (invertir XP siendo de dicha clase desbloquea Dotes/Rasgos exclusivos)
    tiene_nivel INTEGER NOT NULL DEFAULT 0, -- 1 si el artefacto tiene Nivel, 0 si no
    nivel_item INTEGER DEFAULT NULL CHECK (nivel_item IS NULL OR (nivel_item BETWEEN 1 AND 10)),
    accion_id INTEGER DEFAULT NULL,
    rasgo_id INTEGER DEFAULT NULL,
    descripcion TEXT NOT NULL,
    FOREIGN KEY (efecto_id) REFERENCES efectos(id) ON DELETE SET NULL,
    FOREIGN KEY (medium_id) REFERENCES mediums(id) ON DELETE SET NULL,
    FOREIGN KEY (shape_id) REFERENCES shapes(id) ON DELETE SET NULL,
    FOREIGN KEY (mod_id) REFERENCES mods(id) ON DELETE SET NULL,
    FOREIGN KEY (truco_id) REFERENCES trucos(id) ON DELETE SET NULL,
    FOREIGN KEY (item_base_id) REFERENCES items_base(id) ON DELETE SET NULL,
    FOREIGN KEY (arma_id) REFERENCES armas(id) ON DELETE SET NULL,
    FOREIGN KEY (armadura_id) REFERENCES armaduras(id) ON DELETE SET NULL,
    FOREIGN KEY (clase_id) REFERENCES clases(id) ON DELETE SET NULL,
    FOREIGN KEY (accion_id) REFERENCES acciones(id) ON DELETE SET NULL,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- 7.3 Tabla de Ítems Mágicos (FKs anulables a item_base, armas o armaduras + Costo XP Sintonía + Rasgo Clase + Nivel opcional)
CREATE TABLE IF NOT EXISTS items_magicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    -- FKs anulables: puede tomar de referencia un item_base, un arma, una armadura, o NINGUNO (todos NULL)
    item_base_id INTEGER DEFAULT NULL,
    arma_id INTEGER DEFAULT NULL,
    armadura_id INTEGER DEFAULT NULL,
    -- Sintonía (Attunement) en XP, Rasgo "Clase" y Nivel del Ítem
    costo_xp_sintonia INTEGER NOT NULL DEFAULT 1, -- Cuántos puntos de XP cuesta atunearse (sintonizarse) con el ítem
    clase_id INTEGER DEFAULT NULL, -- Si el arma/ítem posee el Rasgo "Clase" (invertir XP siendo de dicha clase desbloquea Dotes/Rasgos exclusivos)
    tiene_nivel INTEGER NOT NULL DEFAULT 0, -- 1 si el ítem tiene LV, 0 si no tiene LV
    nivel_item INTEGER DEFAULT NULL CHECK (nivel_item IS NULL OR (nivel_item BETWEEN 1 AND 10)), -- Si tiene LV, cuál es (1-10)
    es_inteligente INTEGER NOT NULL DEFAULT 0, -- 1 si posee consciencia propia
    requisitos_sintonia TEXT DEFAULT NULL,
    descripcion TEXT NOT NULL,
    accion_id INTEGER DEFAULT NULL,
    rasgo_id INTEGER DEFAULT NULL,
    FOREIGN KEY (item_base_id) REFERENCES items_base(id) ON DELETE SET NULL,
    FOREIGN KEY (arma_id) REFERENCES armas(id) ON DELETE SET NULL,
    FOREIGN KEY (armadura_id) REFERENCES armaduras(id) ON DELETE SET NULL,
    FOREIGN KEY (clase_id) REFERENCES clases(id) ON DELETE SET NULL,
    FOREIGN KEY (accion_id) REFERENCES acciones(id) ON DELETE SET NULL,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- -----------------------------------------------------------------------------
-- 8. TABLA PRINCIPAL: PERSONAJES (CORE PLAYER — Todos los Stats, Skills Hijas y Estados Puntuales)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS personajes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    modo_campana TEXT NOT NULL DEFAULT 'enclave',
    
    -- Estados puntuales y recursos
    xp_total INTEGER NOT NULL DEFAULT 1,
    xp_gastada INTEGER NOT NULL DEFAULT 0,
    omen_actual INTEGER NOT NULL DEFAULT 2,
    heridas_graves INTEGER NOT NULL DEFAULT 0,
    heridas_mortales INTEGER NOT NULL DEFAULT 0,
    dano_cronico INTEGER NOT NULL DEFAULT 0,
    mana_consumido INTEGER NOT NULL DEFAULT 0,
    stamina_gastada INTEGER NOT NULL DEFAULT 0,
    cargas_paradoja INTEGER NOT NULL DEFAULT 0,
    honor_puntos INTEGER DEFAULT NULL, -- Para Senda del Honor (0-99)

    -- 10 Atributos Principales
    attr_fuerza INTEGER NOT NULL DEFAULT 20,
    attr_vitalidad INTEGER NOT NULL DEFAULT 20,
    attr_agilidad INTEGER NOT NULL DEFAULT 20,
    attr_instinto INTEGER NOT NULL DEFAULT 20,
    attr_voluntad INTEGER NOT NULL DEFAULT 20,
    attr_inteligencia INTEGER NOT NULL DEFAULT 20,
    attr_caracter INTEGER NOT NULL DEFAULT 20,
    attr_melee INTEGER NOT NULL DEFAULT 20,
    attr_proyectiles INTEGER NOT NULL DEFAULT 20,
    attr_arcana INTEGER NOT NULL DEFAULT 20,

    -- Skills Hijas de Fuerza (5)
    skill_carga INTEGER NOT NULL DEFAULT 20,
    skill_escalar INTEGER NOT NULL DEFAULT 20,
    skill_saltar INTEGER NOT NULL DEFAULT 20,
    skill_firmeza INTEGER NOT NULL DEFAULT 20,
    skill_atletismo INTEGER NOT NULL DEFAULT 20,

    -- Skills Hijas de Agilidad (5)
    skill_sigilo INTEGER NOT NULL DEFAULT 20,
    skill_acrobacias INTEGER NOT NULL DEFAULT 20,
    skill_prestidigitacion INTEGER NOT NULL DEFAULT 20,
    skill_evasion INTEGER NOT NULL DEFAULT 20,
    skill_montar INTEGER NOT NULL DEFAULT 20,

    -- Skills Hijas de Vitalidad (3)
    skill_cardio INTEGER NOT NULL DEFAULT 20,
    skill_resistir INTEGER NOT NULL DEFAULT 20,
    skill_metabolismo INTEGER NOT NULL DEFAULT 20,

    -- Skills Hijas de Voluntad (5)
    skill_tenacidad INTEGER NOT NULL DEFAULT 20,
    skill_coraje INTEGER NOT NULL DEFAULT 20,
    skill_enfoque INTEGER NOT NULL DEFAULT 20,
    skill_fe INTEGER NOT NULL DEFAULT 20,
    skill_templanza INTEGER NOT NULL DEFAULT 20,

    -- Skills Hijas de Carácter (5)
    skill_elocuencia INTEGER NOT NULL DEFAULT 20,
    skill_liderazgo INTEGER NOT NULL DEFAULT 20,
    skill_coaccion INTEGER NOT NULL DEFAULT 20,
    skill_enganar INTEGER NOT NULL DEFAULT 20,
    skill_entretener INTEGER NOT NULL DEFAULT 20,

    -- Skills Hijas de Instinto (5)
    skill_percepcion INTEGER NOT NULL DEFAULT 20,
    skill_detectar_intenciones INTEGER NOT NULL DEFAULT 20,
    skill_orientacion INTEGER NOT NULL DEFAULT 20,
    skill_adaptacion INTEGER NOT NULL DEFAULT 20,
    skill_manejo_animal INTEGER NOT NULL DEFAULT 20,

    -- Skills Hijas de Inteligencia (7)
    skill_historia INTEGER NOT NULL DEFAULT 20,
    skill_medicina INTEGER NOT NULL DEFAULT 20,
    skill_naturaleza INTEGER NOT NULL DEFAULT 20,
    skill_mecanica INTEGER NOT NULL DEFAULT 20,
    skill_fisica INTEGER NOT NULL DEFAULT 20,
    skill_quimica INTEGER NOT NULL DEFAULT 20,
    skill_conocimiento_magico INTEGER NOT NULL DEFAULT 20,

    -- Skills Hijas de Melee (6)
    skill_una_mano INTEGER NOT NULL DEFAULT 20,
    skill_dos_manos INTEGER NOT NULL DEFAULT 20,
    skill_armas_dobles INTEGER NOT NULL DEFAULT 20,
    skill_bloqueo INTEGER NOT NULL DEFAULT 20,
    skill_paradas INTEGER NOT NULL DEFAULT 20,
    skill_desarmado INTEGER NOT NULL DEFAULT 20,

    -- Skills Hijas de Proyectiles (5)
    skill_arcos INTEGER NOT NULL DEFAULT 20,
    skill_ballestas INTEGER NOT NULL DEFAULT 20,
    skill_armas_fuego INTEGER NOT NULL DEFAULT 20,
    skill_asedio INTEGER NOT NULL DEFAULT 20,
    skill_arrojar INTEGER NOT NULL DEFAULT 20,

    -- Skills Hijas de Arcana / Escuelas (6)
    skill_yrgrammar INTEGER NOT NULL DEFAULT 20,
    skill_naial INTEGER NOT NULL DEFAULT 20,
    skill_cronibor INTEGER NOT NULL DEFAULT 20,
    skill_ivganny INTEGER NOT NULL DEFAULT 20,
    skill_ignamor INTEGER NOT NULL DEFAULT 20,
    skill_gelmir INTEGER NOT NULL DEFAULT 20,

    -- FKs transversales pedidas
    linaje_id INTEGER,
    accion_id INTEGER,
    rasgo_id INTEGER,
    notas TEXT,

    FOREIGN KEY (linaje_id) REFERENCES linajes(id) ON DELETE SET NULL,
    FOREIGN KEY (accion_id) REFERENCES acciones(id) ON DELETE SET NULL,
    FOREIGN KEY (rasgo_id) REFERENCES rasgos(id) ON DELETE SET NULL
);

-- -----------------------------------------------------------------------------
-- 9. TABLAS PUENTE DEL PERSONAJE (MANY-TO-MANY CON CORE PLAYER) Y REGISTRO DE XP INVERTIDA
-- -----------------------------------------------------------------------------

-- 9.1 Many-to-Many: CORE Player <-> Dedicaciones
CREATE TABLE IF NOT EXISTS personajes_dedicaciones (
    personaje_id INTEGER NOT NULL,
    dedicacion_id INTEGER NOT NULL,
    PRIMARY KEY (personaje_id, dedicacion_id),
    FOREIGN KEY (personaje_id) REFERENCES personajes(id) ON DELETE CASCADE,
    FOREIGN KEY (dedicacion_id) REFERENCES dedicaciones(id) ON DELETE CASCADE
);

-- 9.2 Many-to-Many: CORE Player <-> Nacimiento
CREATE TABLE IF NOT EXISTS personajes_nacimientos (
    personaje_id INTEGER NOT NULL,
    nacimiento_id INTEGER NOT NULL,
    PRIMARY KEY (personaje_id, nacimiento_id),
    FOREIGN KEY (personaje_id) REFERENCES personajes(id) ON DELETE CASCADE,
    FOREIGN KEY (nacimiento_id) REFERENCES nacimientos(id) ON DELETE CASCADE
);

-- 9.3 Many-to-Many: CORE Player <-> Regalos y Perjuicios (Unificada)
CREATE TABLE IF NOT EXISTS personajes_regalos_perjuicios (
    personaje_id INTEGER NOT NULL,
    regalo_perjuicio_id INTEGER NOT NULL,
    origen TEXT DEFAULT 'Creacion', -- 'Creacion (1d100)', 'Voluntario', 'Narrativo'
    PRIMARY KEY (personaje_id, regalo_perjuicio_id),
    FOREIGN KEY (personaje_id) REFERENCES personajes(id) ON DELETE CASCADE,
    FOREIGN KEY (regalo_perjuicio_id) REFERENCES regalos_perjuicios(id) ON DELETE CASCADE
);

-- 9.4 Many-to-Many: CORE Player <-> Clases (con tracking de cuánta XP invirtió el jugador en elementos con el Rasgo de esa Clase)
CREATE TABLE IF NOT EXISTS personajes_clases (
    personaje_id INTEGER NOT NULL,
    clase_id INTEGER NOT NULL,
    xp_invertida_clase INTEGER NOT NULL DEFAULT 0, -- Acumulador de XP invertida en Dotes, Hechizos (Epifanías) o Armas/Ítems con el Rasgo "Clase" de esta Senda (desbloquea Dotes o Rasgos exclusivos de dicha clase y Grado de Senda)
    grado_senda INTEGER GENERATED ALWAYS AS (CAST(xp_invertida_clase / 5 AS INTEGER)) STORED, -- Grado de Senda = floor(XP_Clase / 5)
    PRIMARY KEY (personaje_id, clase_id),
    FOREIGN KEY (personaje_id) REFERENCES personajes(id) ON DELETE CASCADE,
    FOREIGN KEY (clase_id) REFERENCES clases(id) ON DELETE CASCADE
);

-- Rasgos exclusivos de Clase desbloqueados por el jugador al alcanzar los umbrales de XP invertida en elementos con el Rasgo "Clase"
CREATE TABLE IF NOT EXISTS personajes_clases_rasgos (
    personaje_id INTEGER NOT NULL,
    clase_rasgo_id INTEGER NOT NULL,
    PRIMARY KEY (personaje_id, clase_rasgo_id),
    FOREIGN KEY (personaje_id) REFERENCES personajes(id) ON DELETE CASCADE,
    FOREIGN KEY (clase_rasgo_id) REFERENCES clases_rasgos(id) ON DELETE CASCADE
);

-- 9.5 Tabla Extra de Registro de XP Invertida por Jugador (Dotes, Hechizos/Epifanías y Armas/Ítems/Artefactos con o sin el Rasgo "Clase")
CREATE TABLE IF NOT EXISTS personajes_xp_inversiones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    personaje_id INTEGER NOT NULL,
    tipo_inversion TEXT NOT NULL CHECK (tipo_inversion IN ('Dote', 'Dote_Clase', 'Hechizo_Epifania', 'Arma_Clase', 'Item_Magico', 'Artefacto_Arcano', 'Epifania')),
    dote_id INTEGER DEFAULT NULL,
    clase_id INTEGER DEFAULT NULL, -- Si el Dote, Hechizo o Arma posee el Rasgo "Clase" y el jugador pertenece a dicha clase, registra a qué Clase suma XP para desbloquear Dotes o Rasgos exclusivos
    arma_id INTEGER DEFAULT NULL,
    item_magico_id INTEGER DEFAULT NULL,
    artefacto_id INTEGER DEFAULT NULL,
    epifania_id INTEGER DEFAULT NULL,
    xp_invertida INTEGER NOT NULL DEFAULT 1, -- Cuánta XP invirtió el jugador en este elemento
    activa INTEGER NOT NULL DEFAULT 1, -- 1 si la inversión sigue activa (ej. sintonía activa), 0 si rompió sintonía y recuperó la XP
    notas TEXT,
    FOREIGN KEY (personaje_id) REFERENCES personajes(id) ON DELETE CASCADE,
    FOREIGN KEY (dote_id) REFERENCES dotes(id) ON DELETE CASCADE,
    FOREIGN KEY (clase_id) REFERENCES clases(id) ON DELETE SET NULL,
    FOREIGN KEY (arma_id) REFERENCES armas(id) ON DELETE CASCADE,
    FOREIGN KEY (item_magico_id) REFERENCES items_magicos(id) ON DELETE CASCADE,
    FOREIGN KEY (artefacto_id) REFERENCES artefactos_arcanos(id) ON DELETE CASCADE,
    FOREIGN KEY (epifania_id) REFERENCES epifanias(id) ON DELETE CASCADE
);

-- 9.6 Tablas de Posesión/Vínculo Directo de Dotes, Epifanías, Estados y Equipamiento del Jugador
CREATE TABLE IF NOT EXISTS personajes_dotes (
    personaje_id INTEGER NOT NULL,
    dote_id INTEGER NOT NULL,
    clase_id INTEGER DEFAULT NULL, -- Si fue adquirido como Dote de Clase
    xp_invertida INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (personaje_id, dote_id),
    FOREIGN KEY (personaje_id) REFERENCES personajes(id) ON DELETE CASCADE,
    FOREIGN KEY (dote_id) REFERENCES dotes(id) ON DELETE CASCADE,
    FOREIGN KEY (clase_id) REFERENCES clases(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS personajes_epifanias (
    personaje_id INTEGER NOT NULL,
    epifania_id INTEGER NOT NULL,
    xp_invertida INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (personaje_id, epifania_id),
    FOREIGN KEY (personaje_id) REFERENCES personajes(id) ON DELETE CASCADE,
    FOREIGN KEY (epifania_id) REFERENCES epifanias(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS personajes_estados (
    personaje_id INTEGER NOT NULL,
    estado_id INTEGER NOT NULL,
    grado INTEGER NOT NULL DEFAULT 1, -- ej. Torpe 2
    PRIMARY KEY (personaje_id, estado_id),
    FOREIGN KEY (personaje_id) REFERENCES personajes(id) ON DELETE CASCADE,
    FOREIGN KEY (estado_id) REFERENCES estados_alterados(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS personajes_armas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    personaje_id INTEGER NOT NULL,
    arma_id INTEGER NOT NULL,
    equipada INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (personaje_id) REFERENCES personajes(id) ON DELETE CASCADE,
    FOREIGN KEY (arma_id) REFERENCES armas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS personajes_armaduras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    personaje_id INTEGER NOT NULL,
    armadura_id INTEGER NOT NULL,
    equipada INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (personaje_id) REFERENCES personajes(id) ON DELETE CASCADE,
    FOREIGN KEY (armadura_id) REFERENCES armaduras(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS personajes_items_base (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    personaje_id INTEGER NOT NULL,
    item_base_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    equipado INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (personaje_id) REFERENCES personajes(id) ON DELETE CASCADE,
    FOREIGN KEY (item_base_id) REFERENCES items_base(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS personajes_artefactos_arcanos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    personaje_id INTEGER NOT NULL,
    artefacto_id INTEGER NOT NULL,
    cargas_actuales INTEGER NOT NULL DEFAULT 0,
    compactado_con_herramienta INTEGER NOT NULL DEFAULT 0, -- 1 si el Arcanista lo compactó con su Herramienta de Lanzador
    sintonizado INTEGER NOT NULL DEFAULT 1,
    xp_invertida INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (personaje_id) REFERENCES personajes(id) ON DELETE CASCADE,
    FOREIGN KEY (artefacto_id) REFERENCES artefactos_arcanos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS personajes_items_magicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    personaje_id INTEGER NOT NULL,
    item_magico_id INTEGER NOT NULL,
    sintonizado INTEGER NOT NULL DEFAULT 1, -- 1 si está sintonizado (attuned)
    equipado INTEGER NOT NULL DEFAULT 1,
    xp_invertida INTEGER NOT NULL DEFAULT 1, -- Cuánta XP invirtió el jugador en sintonizar este ítem mágico
    FOREIGN KEY (personaje_id) REFERENCES personajes(id) ON DELETE CASCADE,
    FOREIGN KEY (item_magico_id) REFERENCES items_magicos(id) ON DELETE CASCADE
);

