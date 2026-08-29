// roller.js — Roller de dados d100 canónico de Crónicas de Gideon
// Sistema: d100 (00-99), NE (decenas en éxito), NF (unidades en fallo)
// Bandas automáticas: 00-05 éxito, 95-99 fallo
// Capicúa: Portento (NE=10) o Pifia (NF=10)

const Roller = {
  historial: [],
  maxHistorial: 50,

  // ─────────────────────────────────────────────
  // Tirar d100 (rango 00-99)
  // ─────────────────────────────────────────────
  tirarD100() {
    return Math.floor(Math.random() * 100);
  },

  // ─────────────────────────────────────────────
  // Verificar si es capicúa (dobles: 00, 11, 22... 99)
  // ─────────────────────────────────────────────
  esCapicua(tirada) {
    const decenas = Math.floor(tirada / 10);
    const unidades = tirada % 10;
    return decenas === unidades;
  },

  // ─────────────────────────────────────────────
  // Resolver una tirada contra un valor de habilidad
  // Retorna objeto con toda la información del resultado
  // ─────────────────────────────────────────────
  resolver(tirada, valorHabilidad) {
    const decenas = Math.floor(tirada / 10);
    const unidades = tirada % 10;
    const capicua = this.esCapicua(tirada);

    // Determinar éxito o fallo
    const enBandaExito = tirada >= 0 && tirada <= 5;
    const enBandaFallo = tirada >= 95 && tirada <= 99;

    let esExito;
    if (enBandaExito) {
      esExito = true; // Éxito automático
    } else if (enBandaFallo) {
      esExito = false; // Fallo automático
    } else {
      esExito = tirada <= valorHabilidad;
    }

    // Calcular NE o NF
    let ne = null;
    let nf = null;
    let esPortento = false;
    let esPifia = false;

    if (esExito) {
      ne = decenas;
      // Capicúa en éxito = Portento (NE fijado en 10)
      if (capicua) {
        esPortento = true;
        ne = 10;
      }
    } else {
      nf = unidades;
      // Capicúa en fallo = Pifia (NF fijado en 10)
      if (capicua) {
        esPifia = true;
        nf = 10;
      }
    }

    // Caso especial 00: Éxito Auto + Portento
    if (tirada === 0) {
      esExito = true;
      esPortento = true;
      ne = 10;
      nf = null;
    }

    // Caso especial 99: Fallo Auto + Pifia
    if (tirada === 99) {
      esExito = false;
      esPifia = true;
      nf = 10;
      ne = null;
    }

    return {
      tirada,
      valorHabilidad,
      esExito,
      ne,
      nf,
      esPortento,
      esPifia,
      capicua,
      bandaAutoExito: enBandaExito,
      bandaAutoFallo: enBandaFallo
    };
  },

  // ─────────────────────────────────────────────
  // Obtener texto descriptivo del resultado
  // ─────────────────────────────────────────────
  descripcion(resultado) {
    const { tirada, valorHabilidad, esExito, ne, nf, esPortento, esPifia, bandaAutoExito, bandaAutoFallo } = resultado;

    let texto = `Tirada: ${String(tirada).padStart(2, '0')} vs ${valorHabilidad}`;

    if (esPortento) {
      texto += ` — ¡PORTENTO! (NE 10)`;
    } else if (esPifia) {
      texto += ` — ¡PIFIA! (NF 10)`;
    } else if (esExito) {
      texto += ` — Éxito (NE ${ne})`;
      if (bandaAutoExito) texto += ' [Auto]';
    } else {
      texto += ` — Fallo (NF ${nf})`;
      if (bandaAutoFallo) texto += ' [Auto]';
    }

    return texto;
  },

  // ─────────────────────────────────────────────
  // Registrar una tirada en el historial
  // ─────────────────────────────────────────────
  registrar(resultado, nombreHabilidad = null) {
    const entrada = {
      ...resultado,
      nombreHabilidad,
      timestamp: new Date(),
      id: Date.now()
    };
    this.historial.unshift(entrada);
    if (this.historial.length > this.maxHistorial) {
      this.historial.pop();
    }
    return entrada;
  },

  // ─────────────────────────────────────────────
  // Limpiar historial
  // ─────────────────────────────────────────────
  limpiarHistorial() {
    this.historial = [];
  },

  // ─────────────────────────────────────────────
  // RENDER: Inicializar la UI del roller
  // ─────────────────────────────────────────────
  init() {
    this._bindEvents();
    this._poblarSkillSelect();
  },

  _bindEvents() {
    const rollBtn = document.getElementById('roll-btn');
    const skillSelect = document.getElementById('roller-skill-select');
    const manualInput = document.getElementById('roller-manual-value');

    if (rollBtn) {
      rollBtn.addEventListener('click', () => this._ejecutarTirada());
    }

    if (skillSelect) {
      skillSelect.addEventListener('change', () => {
        const val = skillSelect.value;
        if (val) {
          manualInput.value = '';
          document.getElementById('roller-target-value').textContent = val;
        } else {
          document.getElementById('roller-target-value').textContent = '--';
        }
      });
    }

    if (manualInput) {
      manualInput.addEventListener('input', () => {
        const val = manualInput.value;
        if (val) {
          skillSelect.value = '';
          document.getElementById('roller-target-value').textContent = val;
        } else {
          document.getElementById('roller-target-value').textContent = '--';
        }
      });
    }

    // Atajo de teclado: Enter o Espacio para tirar
    document.addEventListener('keydown', (e) => {
      if (e.key === ' ' && document.getElementById('view-roller').classList.contains('active')) {
        e.preventDefault();
        this._ejecutarTirada();
      }
    });
  },

  // ─────────────────────────────────────────────
  // Poblar el selector de habilidades con el personaje actual
  // ─────────────────────────────────────────────
  _poblarSkillSelect() {
    const select = document.getElementById('roller-skill-select');
    if (!select) return;

    // Limpiar opciones existentes
    select.innerHTML = '<option value="">— Seleccionar habilidad —</option>';

    // Verificar si hay personaje cargado
    if (!window.AppState || !window.AppState.personaje) return;

    const char = window.AppState.personaje;
    const skillTree = GideonCharacter.getSkillTree();

    // Agregar atributos como grupo
    const attrGroup = document.createElement('optgroup');
    attrGroup.label = 'Atributos';
    for (const attr of GideonCharacter.getNombreAtributos()) {
      const opt = document.createElement('option');
      opt.value = char.atributos[attr] || 0;
      opt.textContent = `${attr} (${char.atributos[attr] || 0})`;
      opt.dataset.nombre = attr;
      attrGroup.appendChild(opt);
    }
    select.appendChild(attrGroup);

    // Agregar habilidades hijas por atributo
    for (const [attr, skills] of Object.entries(skillTree)) {
      const group = document.createElement('optgroup');
      group.label = attr;
      for (const skill of skills) {
        const hab = char.habilidades[skill];
        const total = hab ? hab.total : (char.atributos[attr] || 0);
        const opt = document.createElement('option');
        opt.value = total;
        opt.textContent = `${skill} (${total})`;
        opt.dataset.nombre = skill;
        group.appendChild(opt);
      }
      select.appendChild(group);
    }
  },

  // ─────────────────────────────────────────────
  // Ejecutar una tirada completa con animación
  // ─────────────────────────────────────────────
  async _ejecutarTirada() {
    const skillSelect = document.getElementById('roller-skill-select');
    const manualInput = document.getElementById('roller-manual-value');
    const diceDisplay = document.getElementById('dice-display');
    const diceValue = document.getElementById('dice-value');
    const rollResult = document.getElementById('roll-result');
    const rollBtn = document.getElementById('roll-btn');

    // Obtener valor objetivo
    let valorObj = null;
    let nombreHab = null;

    if (skillSelect.value) {
      valorObj = parseInt(skillSelect.value);
      const selectedOpt = skillSelect.options[skillSelect.selectedIndex];
      nombreHab = selectedOpt.dataset.nombre || selectedOpt.textContent;
    } else if (manualInput.value) {
      valorObj = parseInt(manualInput.value);
      nombreHab = 'Manual';
    }

    if (valorObj === null || isNaN(valorObj)) {
      this._mostrarToast('Selecciona una habilidad o ingresa un valor', 'warning');
      return;
    }

    // Desactivar botón durante animación
    rollBtn.disabled = true;

    // Animación de dado
    diceDisplay.classList.add('rolling');
    rollResult.style.display = 'none';

    // Animación: números aleatorios rápidos
    const duracion = 800;
    const inicio = Date.now();

    await new Promise(resolve => {
      const animar = () => {
        const progreso = Date.now() - inicio;
        if (progreso < duracion) {
          diceValue.textContent = String(Math.floor(Math.random() * 100)).padStart(2, '0');
          requestAnimationFrame(animar);
        } else {
          resolve();
        }
      };
      animar();
    });

    // Tirada real
    const tirada = this.tirarD100();
    const resultado = this.resolver(tirada, valorObj);
    const entrada = this.registrar(resultado, nombreHab);

    // Mostrar resultado
    diceValue.textContent = String(tirada).padStart(2, '0');
    diceDisplay.classList.remove('rolling');

    // Limpiar clases anteriores
    diceDisplay.classList.remove('result-success', 'result-failure', 'result-portento', 'result-pifia');

    // Aplicar clase de resultado
    if (resultado.esPortento) {
      diceDisplay.classList.add('result-portento');
    } else if (resultado.esPifia) {
      diceDisplay.classList.add('result-pifia');
    } else if (resultado.esExito) {
      diceDisplay.classList.add('result-success');
    } else {
      diceDisplay.classList.add('result-failure');
    }

    // Renderizar resultado detallado
    this._renderResultado(resultado);
    rollResult.style.display = 'block';

    // Actualizar historial
    this._renderHistorial();

    // Reactivar botón
    rollBtn.disabled = false;
  },

  // ─────────────────────────────────────────────
  // Renderizar el resultado de la tirada
  // ─────────────────────────────────────────────
  _renderResultado(resultado) {
    const typeEl = document.getElementById('result-type');
    const levelEl = document.getElementById('result-level');
    const detailEl = document.getElementById('result-detail');

    if (resultado.esPortento) {
      typeEl.innerHTML = '<span class="badge badge-gold">✦ PORTENTO ✦</span>';
      levelEl.innerHTML = `<span class="ne-badge">NE 10</span>`;
      detailEl.textContent = '¡Capicúa en éxito! Crítico absoluto.';
    } else if (resultado.esPifia) {
      typeEl.innerHTML = '<span class="badge badge-purple">☠ PIFIA ☠</span>';
      levelEl.innerHTML = `<span class="nf-badge">NF 10</span>`;
      detailEl.textContent = '¡Capicúa en fallo! Fallo catastrófico.';
    } else if (resultado.esExito) {
      typeEl.innerHTML = '<span class="badge badge-success">✓ ÉXITO</span>';
      levelEl.innerHTML = `<span class="ne-badge">NE ${resultado.ne}</span>`;
      let detail = `Tirada ${String(resultado.tirada).padStart(2, '0')} ≤ ${resultado.valorHabilidad}`;
      if (resultado.bandaAutoExito) detail += ' (Banda automática 00-05)';
      detailEl.textContent = detail;
    } else {
      typeEl.innerHTML = '<span class="badge badge-danger">✗ FALLO</span>';
      levelEl.innerHTML = `<span class="nf-badge">NF ${resultado.nf}</span>`;
      let detail = `Tirada ${String(resultado.tirada).padStart(2, '0')} > ${resultado.valorHabilidad}`;
      if (resultado.bandaAutoFallo) detail += ' (Banda automática 95-99)';
      detailEl.textContent = detail;
    }
  },

  // ─────────────────────────────────────────────
  // Renderizar historial de tiradas
  // ─────────────────────────────────────────────
  _renderHistorial() {
    const container = document.getElementById('roll-history');
    if (!container) return;

    if (this.historial.length === 0) {
      container.innerHTML = '<p class="roll-history-empty">Aún no hay tiradas.</p>';
      return;
    }

    container.innerHTML = this.historial.map(entrada => {
      const hora = entrada.timestamp.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const tiradaStr = String(entrada.tirada).padStart(2, '0');

      let claseResultado = '';
      let icono = '';
      let nivel = '';

      if (entrada.esPortento) {
        claseResultado = 'history-portento';
        icono = '✦';
        nivel = 'NE 10';
      } else if (entrada.esPifia) {
        claseResultado = 'history-pifia';
        icono = '☠';
        nivel = 'NF 10';
      } else if (entrada.esExito) {
        claseResultado = 'history-success';
        icono = '✓';
        nivel = `NE ${entrada.ne}`;
      } else {
        claseResultado = 'history-failure';
        icono = '✗';
        nivel = `NF ${entrada.nf}`;
      }

      const nombre = entrada.nombreHabilidad || 'Manual';

      return `
        <div class="roll-history-item ${claseResultado}">
          <span class="history-time">${hora}</span>
          <span class="history-skill">${nombre}</span>
          <span class="history-roll">${tiradaStr} vs ${entrada.valorHabilidad}</span>
          <span class="history-icon">${icono}</span>
          <span class="history-level">${nivel}</span>
        </div>
      `;
    }).join('');
  },

  // ─────────────────────────────────────────────
  // Mostrar toast de notificación
  // ─────────────────────────────────────────────
  _mostrarToast(mensaje, tipo = 'info') {
    if (window.App && window.App.mostrarToast) {
      window.App.mostrarToast(mensaje, tipo);
    }
  },

  // ─────────────────────────────────────────────
  // Actualizar el roller cuando cambia el personaje
  // ─────────────────────────────────────────────
  actualizar() {
    this._poblarSkillSelect();
  },

  // ─────────────────────────────────────────────
  // Tirar desde el visor (click en una skill)
  // ─────────────────────────────────────────────
  tirarDesdeVisor(nombreHabilidad, valor) {
    // Cambiar a vista roller
    if (window.App) {
      window.App.cambiarVista('roller');
    }
    // Establecer valor
    const manualInput = document.getElementById('roller-manual-value');
    const skillSelect = document.getElementById('roller-skill-select');
    const targetDisplay = document.getElementById('roller-target-value');

    if (manualInput) manualInput.value = valor;
    if (skillSelect) skillSelect.value = '';
    if (targetDisplay) targetDisplay.textContent = valor;

    // Auto-tirar después de un breve delay
    setTimeout(() => this._ejecutarTirada(), 300);
  }
};

window.Roller = Roller;
