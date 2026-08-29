// formulas.js — Fórmulas canónicas de Crónicas de Gideon
// Fuente: Core_20bis_Formulas_Canonicas.md

const GideonFormulas = {
  // Nivel de Atributo o Habilidad: INT(valor / 10)
  nivel(valor) { return Math.floor(valor / 10); },
  
  // MH (Max Health) = ROUNDUP(Escalado Vital del Linaje × Nivel de Vitalidad)
  calcularMH(escaladoVital, vitalidad) {
    const nv = this.nivel(vitalidad);
    return Math.ceil(escaladoVital * nv);
  },
  
  // Dureza = Nivel de Vitalidad
  calcularDureza(vitalidad) { return this.nivel(vitalidad); },
  
  // PG Reales = ROUNDUP(MH - (MH/4) × heridas_graves)
  calcularPGReales(mh, heridasGraves) {
    return Math.ceil(mh - (mh / 4) * heridasGraves);
  },
  
  // Umbral Herida Grave = ROUNDUP(MH / 2)
  umbralHeridaGrave(mh) { return Math.ceil(mh / 2); },
  
  // Umbral Herida Mortal = MH
  umbralHeridaMortal(mh) { return mh; },
  
  // Maná Máximo = Voluntad + Nivel de Voluntad - Daño Crónico
  calcularManaMax(voluntad, danoCronico = 0) {
    return voluntad + this.nivel(voluntad) - danoCronico;
  },
  
  // Stamina = Nivel de Vitalidad - heridas_graves
  calcularStamina(vitalidad, heridasGraves = 0) {
    return this.nivel(vitalidad) - heridasGraves;
  },
  
  // Límite Seguro de Maná = Nivel de Voluntad + Nivel de Vitalidad
  calcularLimiteSeguro(voluntad, vitalidad) {
    return this.nivel(voluntad) + this.nivel(vitalidad);
  },
  
  // Nivel de Potencia (magia) = 1 + NE
  calcularPL(ne) { return 1 + ne; },
  
  // Coste Base de Hechizo = 1 + PL
  calcularCosteBase(pl) { return 1 + pl; },
  
  // Daño Genérico = PL × Nivel de Voluntad
  calcularDanoGenerico(pl, voluntad) {
    return pl * this.nivel(voluntad);
  },
  
  // Daño de ataque melee = NE + Daño Arma + Nivel de Fuerza
  calcularDanoMelee(ne, danoArma, fuerza) {
    return ne + danoArma + this.nivel(fuerza);
  },
  
  // Daño de ataque a rango = NE + Daño Arma (sin Fuerza)
  calcularDanoRango(ne, danoArma) {
    return ne + danoArma;
  },
  
  // Daño mágico = NE + Daño Hechizo + Nivel de Voluntad
  calcularDanoMagico(ne, danoHechizo, voluntad) {
    return ne + danoHechizo + this.nivel(voluntad);
  },
  
  // Mitigación de daño por tipo
  calcularMitigacion(tipoDano, vitalidad, armadura = 0, resistencia = 0, voluntad = 0, inteligencia = 0, caracter = 0) {
    const dureza = this.nivel(vitalidad);
    switch(tipoDano) {
      case 'cortante': case 'punzante': case 'contundente':
        return dureza + armadura;
      case 'fuego': case 'frio': case 'rayo':
        return dureza;
      case 'veneno': case 'acido':
        return dureza + resistencia;
      case 'necrotico':
        return dureza + resistencia;
      case 'sonico':
        return Math.floor(dureza / 2); // parcial
      case 'radiante':
        return Math.max(this.nivel(voluntad), this.nivel(caracter));
      case 'espiritual':
        return this.nivel(voluntad);
      case 'psiquico':
        return this.nivel(inteligencia);
      case 'verdadero':
        return 0;
      default: return 0;
    }
  },

  // Generación aleatoria de atributos: (d4 + d4 + d4) × 5
  generarAtributoAleatorio() {
    const d4 = () => Math.floor(Math.random() * 4) + 1;
    return (d4() + d4() + d4()) * 5;
  },

  // Arreglo fijo de atributos
  ARREGLO_FIJO: [50, 45, 40, 35, 30, 30, 30, 20, 20, 15],

  // Techo de creación
  TECHO_CREACION: 80,

  // Aplicar techo de 80 (excepto Dotado)
  aplicarTecho(valor, ignorarTecho = false) {
    if (ignorarTecho) return valor;
    return Math.min(valor, this.TECHO_CREACION);
  }
};

window.GideonFormulas = GideonFormulas;
