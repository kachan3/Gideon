// character.js - Modelo de datos del personaje
// Define la estructura de un personaje en Gideon y métodos para manipularlo

const SKILL_TREE = {
  // Atributos de Combate (3)
  "Melee": ["Una Mano", "A Dos Manos", "Armas Dobles", "Bloqueo", "Paradas", "Desarmado"],
  "Proyectiles": ["Arcos", "Ballestas", "Armas de Fuego", "Asedio", "Arrojar"],
  "Arcana": ["Yrgrammar", "Naial", "Cronibor", "Ivganny", "Ignamor", "Gelmir"],
  
  // Atributos Normales (7)
  "Fuerza": ["Carga", "Escalar", "Saltar", "Firmeza", "Atletismo"],
  "Agilidad": ["Sigilo", "Acrobacias", "Prestidigitación", "Evasión", "Montar"],
  "Vitalidad": ["Cardio", "Resistir", "Metabolismo"],
  "Voluntad": ["Tenacidad", "Coraje", "Enfoque", "Fe", "Templanza"],
  "Carácter": ["Elocuencia", "Liderazgo", "Coacción", "Engañar", "Entretener"],
  "Instinto": ["Percepción", "Detectar Intenciones", "Orientación", "Adaptación", "Manejo Animal"],
  "Inteligencia": ["Historia", "Medicina", "Naturaleza", "Mecánica", "Física", "Química", "C. Mágico"]
};

const ATRIBUTOS_CANONICOS = [
  "Fuerza", "Vitalidad", "Agilidad", "Instinto", "Voluntad", 
  "Inteligencia", "Carácter", "Melee", "Proyectiles", "Arcana"
];

const ATRIBUTOS_COMBATE = ["Melee", "Proyectiles", "Arcana"];
const ATRIBUTOS_NORMALES = [
  "Fuerza", "Agilidad", "Vitalidad", "Voluntad", "Carácter", "Instinto", "Inteligencia"
];

const GideonCharacter = {
  // Retorna el árbol completo de habilidades
  getSkillTree() {
    return SKILL_TREE;
  },

  // Retorna la lista ordenada de 10 atributos
  getNombreAtributos() {
    return ATRIBUTOS_CANONICOS;
  },

  // Retorna los 3 atributos de combate
  getAtributosCombate() {
    return ATRIBUTOS_COMBATE;
  },

  // Retorna los 7 atributos normales
  getAtributosNormales() {
    return ATRIBUTOS_NORMALES;
  },

  // Retorna las habilidades hijas de un atributo dado
  getHabilidadesDe(atributo) {
    return SKILL_TREE[atributo] || [];
  },

  // Crea una plantilla de personaje en blanco
  crearNuevo() {
    const char = {
      nombre: "",
      modoCampana: "enclave", // 'enclave' | 'sandbox'
      linaje: null,
      senda: null,
      dedicacion: null,
      nacimiento: null,
      regalo: null,
      perjuicio: null,
      atributos: {},
      habilidades: {},
      especializaciones: [],
      equipamiento: { arma: null, armadura: null, escudo: null },
      omen: 0,
      heridasGraves: 0,
      heridasMortales: 0,
      danoCronico: 0,
      manaConsumido: 0,
      xpTotal: 1,
      xpGastada: 0,
      notas: "",
      hechizos: [],

      
      // Estadísticas derivadas
      stats: {
        mh: 0,
        pgReales: 0,
        manaMax: 0,
        stamina: 0,
        dureza: 0
      }
    };

    // Inicializar atributos a 0
    this.getNombreAtributos().forEach(attr => {
      char.atributos[attr] = 0;
    });

    // Inicializar habilidades
    Object.keys(SKILL_TREE).forEach(attr => {
      SKILL_TREE[attr].forEach(hab => {
        char.habilidades[hab] = { base: 0, modificacion: 0, total: 0 };
      });
    });

    return char;
  },

  // Base + Modificación
  calcularHabilidad(atributo, modificacion) {
    return atributo + modificacion;
  },

  // Recalcular estadísticas derivadas
  recalcularDerivados(char) {
    if (!char.linaje) return;
    
    const vitalidad = char.atributos["Vitalidad"] || 0;
    const voluntad = char.atributos["Voluntad"] || 0;
    const escaladoVital = char.linaje.escalado_vital || 0;
    const gf = window.GideonFormulas;

    char.stats.mh = gf.calcularMH(escaladoVital, vitalidad);
    char.stats.pgReales = gf.calcularPGReales(char.stats.mh, char.heridasGraves);
    char.stats.manaMax = gf.calcularManaMax(voluntad, char.danoCronico);
    char.stats.stamina = gf.calcularStamina(vitalidad, char.heridasGraves);
    char.stats.dureza = gf.calcularDureza(vitalidad);
  },

  // Aplica los bonos de linaje al personaje
  aplicarLinaje(char, linaje) {
    char.linaje = linaje;
  },

  // Aplica la dedicación con la regla de Destacado
  aplicarDedicacion(char, dedicacion) {
    char.dedicacion = dedicacion;
  },

  // Aplica regalo
  aplicarRegalo(char, regalo) {
    char.regalo = regalo;
  },

  // Aplica perjuicio
  aplicarPerjuicio(char, perjuicio) {
    char.perjuicio = perjuicio;
  },

  // Valida que ninguna habilidad supere el techo de creación (usualmente 80)
  validarTecho(char) {
    const gf = window.GideonFormulas;
    const techo = gf.TECHO_CREACION;
    const ignorarTecho = char.regalo && char.regalo.id === 'dotado';
    let violaciones = [];

    if (ignorarTecho) return violaciones;

    for (const [hab, datos] of Object.entries(char.habilidades)) {
      if (datos.total > techo) {
        violaciones.push({ habilidad: hab, valor: datos.total });
      }
    }
    return violaciones;
  }
};

window.GideonCharacter = GideonCharacter;
