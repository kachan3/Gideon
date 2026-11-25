// wizard.js — Wizard de creación de personaje paso a paso
// Flujo canónico: Campaña → Atributos → Linaje → Origen → Senda → Regalos/Perjuicios

const Wizard = {
  pasoActual: 0,
  totalPasos: 6, // 0-5
  personajeEnCreacion: null,
  contenido: null, // contenido cargado

  // ─────────────────────────────────────────────
  // Inicializar el wizard
  // ─────────────────────────────────────────────
  init(contenido) {
    this.contenido = contenido;
    this.personajeEnCreacion = GideonCharacter.crearNuevo();
    this.pasoActual = 0;
    this._bindEvents();
    this.renderPaso();
  },

  _bindEvents() {
    document.getElementById('wizard-next')?.addEventListener('click', () => this.siguiente());
    document.getElementById('wizard-prev')?.addEventListener('click', () => this.anterior());
  },

  // ─────────────────────────────────────────────
  // Navegación
  // ─────────────────────────────────────────────
  siguiente() {
    this._guardarPaso();
    if (!this._validarPaso()) return;
    if (this.pasoActual < this.totalPasos - 1) {
      this.pasoActual++;
      this.renderPaso();
    } else {
      this._finalizarCreacion();
    }
  },

  anterior() {
    if (this.pasoActual > 0) {
      this.pasoActual--;
      this.renderPaso();
    }
  },

  irAPaso(paso) {
    if (paso >= 0 && paso < this.totalPasos) {
      this._guardarPaso();
      this.pasoActual = paso;
      this.renderPaso();
    }
  },

  // ─────────────────────────────────────────────
  // Renderizar el paso actual
  // ─────────────────────────────────────────────
  renderPaso() {
    const contenedor = document.getElementById('wizard-content');
    if (!contenedor) return;

    // Actualizar indicadores de progreso
    this._actualizarProgreso();
    this._actualizarNavegacion();

    // Renderizar contenido del paso
    switch (this.pasoActual) {
      case 0: this._renderPaso0Campana(contenedor); break;
      case 1: this._renderPaso1Atributos(contenedor); break;
      case 2: this._renderPaso2Linaje(contenedor); break;
      case 3: this._renderPaso3Origen(contenedor); break;
      case 4: this._renderPaso4Senda(contenedor); break;
      case 5: this._renderPaso5Regalos(contenedor); break;
    }

    // Scroll arriba
    contenedor.scrollTop = 0;
  },

  // ─────────────────────────────────────────────
  // PASO 0: Modo de Campaña + Nombre
  // ─────────────────────────────────────────────
  _renderPaso0Campana(el) {
    const char = this.personajeEnCreacion;
    el.innerHTML = `
      <div class="wizard-step-content fade-in">
        <h2 class="wizard-step-title">Paso 0 — Modo de Campaña</h2>
        <p class="wizard-step-desc">Define el nombre de tu personaje y el modo de campaña.</p>
        
        <div class="form-group">
          <label class="form-label" for="char-nombre">Nombre del Personaje</label>
          <input type="text" class="input-field" id="char-nombre" 
                 placeholder="Ej: Aelindra, Kael, Theron..." 
                 value="${char.nombre || ''}" maxlength="50">
        </div>

        <div class="form-group">
          <label class="form-label">Modo de Campaña</label>
          <div class="option-cards">
            <div class="option-card ${char.modoCampana === 'enclave' ? 'selected' : ''}" data-value="enclave" id="opt-enclave">
              <div class="option-card-icon">🏰</div>
              <h3>Enclave</h3>
              <p>Campaña estructurada con contrato formal con el Enclave del Eclipse. El trasfondo tiene peso mecánico e institucional.</p>
            </div>
            <div class="option-card ${char.modoCampana === 'sandbox' ? 'selected' : ''}" data-value="sandbox" id="opt-sandbox">
              <div class="option-card-icon">🌍</div>
              <h3>Sandbox</h3>
              <p>Campaña libre, sin contrato ni institución central. El trasfondo es puramente narrativo.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Eventos
    el.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', () => {
        el.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        char.modoCampana = card.dataset.value;
      });
    });
  },

  // ─────────────────────────────────────────────
  // PASO 1: Atributos Base
  // ─────────────────────────────────────────────
  _renderPaso1Atributos(el) {
    const char = this.personajeEnCreacion;
    const atributos = GideonCharacter.getNombreAtributos();
    const arreglo = GideonFormulas.ARREGLO_FIJO;

    el.innerHTML = `
      <div class="wizard-step-content fade-in">
        <h2 class="wizard-step-title">Paso 1 — Atributos Base</h2>
        <p class="wizard-step-desc">Asigna valores a tus 10 atributos. Las habilidades hijas nacen con el valor de su atributo padre.</p>
        
        <div class="form-group">
          <label class="form-label">Método de generación</label>
          <div class="btn-group">
            <button class="btn ${char._metodoAtributos === 'fijo' || !char._metodoAtributos ? 'btn-primary' : 'btn-secondary'}" 
                    id="metodo-fijo">📋 Arreglo Fijo</button>
            <button class="btn ${char._metodoAtributos === 'aleatorio' ? 'btn-primary' : 'btn-secondary'}" 
                    id="metodo-aleatorio">🎲 Aleatorio (3d4×5)</button>
          </div>
          <p class="form-hint" id="metodo-hint">
            ${char._metodoAtributos === 'aleatorio' 
              ? 'Valores generados aleatoriamente. Asignarlos en orden estricto es una restricción narrativa.'
              : `Distribuye libremente: ${arreglo.join(', ')}`}
          </p>
        </div>

        <div class="attributes-grid" id="attributes-grid">
          ${this._renderAtributosInputs(atributos, char)}
        </div>

        <div class="pool-info" id="arreglo-info">
          ${this._renderArregloInfo(char, atributos)}
        </div>
      </div>
    `;

    // Eventos de método
    document.getElementById('metodo-fijo')?.addEventListener('click', () => {
      char._metodoAtributos = 'fijo';
      this._renderPaso1Atributos(el);
    });

    document.getElementById('metodo-aleatorio')?.addEventListener('click', () => {
      char._metodoAtributos = 'aleatorio';
      // Generar 10 valores aleatorios
      char._valoresAleatorios = atributos.map(() => GideonFormulas.generarAtributoAleatorio());
      // Resetear atributos
      atributos.forEach((attr, i) => {
        char.atributos[attr] = char._valoresAleatorios[i];
      });
      this._renderPaso1Atributos(el);
    });

    // Eventos de inputs de atributos (solo en modo fijo)
    if (char._metodoAtributos !== 'aleatorio') {
      this._bindAtributoSelectEvents(el, char, atributos);
    }
  },

  _renderAtributosInputs(atributos, char) {
    const esCombate = (attr) => GideonCharacter.getAtributosCombate().includes(attr);

    return atributos.map(attr => {
      const valor = char.atributos[attr] || 0;
      const nivel = GideonFormulas.nivel(valor);
      const tipo = esCombate(attr) ? 'combate' : 'normal';
      const skills = GideonCharacter.getHabilidadesDe(attr);

      if (char._metodoAtributos === 'aleatorio') {
        return `
          <div class="attribute-row ${tipo}" data-attr="${attr}">
            <div class="attribute-info">
              <span class="attribute-name">${attr}</span>
              <span class="attribute-type-badge badge ${tipo === 'combate' ? 'badge-danger' : 'badge-success'}">${tipo === 'combate' ? 'Combate' : 'Normal'}</span>
            </div>
            <div class="attribute-value-display">
              <span class="attribute-value">${valor}</span>
              <span class="attribute-nivel badge">Nv ${nivel}</span>
            </div>
            <div class="attribute-skills-preview">${skills.join(', ')}</div>
          </div>
        `;
      }

      // Modo fijo: select con valores disponibles
      return `
        <div class="attribute-row ${tipo}" data-attr="${attr}">
          <div class="attribute-info">
            <span class="attribute-name">${attr}</span>
            <span class="attribute-type-badge badge ${tipo === 'combate' ? 'badge-danger' : 'badge-success'}">${tipo === 'combate' ? 'Combate' : 'Normal'}</span>
          </div>
          <div class="attribute-input-group">
            <select class="select-field attr-select" data-attr="${attr}" id="attr-${attr}">
              <option value="0" ${valor === 0 ? 'selected' : ''}>--</option>
              ${GideonFormulas.ARREGLO_FIJO.map(v => 
                `<option value="${v}" ${valor === v ? 'selected' : ''}>${v}</option>`
              ).join('')}
            </select>
            <span class="attribute-nivel badge">Nv ${nivel}</span>
          </div>
          <div class="attribute-skills-preview">${skills.join(', ')}</div>
        </div>
      `;
    }).join('');
  },

  _renderArregloInfo(char, atributos) {
    if (char._metodoAtributos === 'aleatorio') {
      return `<div class="info-box">🎲 Valores aleatorios asignados. Haz click en "Aleatorio" de nuevo para regenerar.</div>`;
    }

    const usados = atributos.map(a => char.atributos[a]).filter(v => v > 0);
    const arreglo = [...GideonFormulas.ARREGLO_FIJO];
    const disponibles = [...arreglo];

    usados.forEach(v => {
      const idx = disponibles.indexOf(v);
      if (idx !== -1) disponibles.splice(idx, 1);
    });

    if (disponibles.length === 0 && usados.length === 10) {
      return `<div class="info-box info-success">✓ Todos los atributos asignados correctamente.</div>`;
    }

    return `<div class="info-box">Valores disponibles: ${disponibles.length > 0 ? disponibles.join(', ') : 'Ninguno'}</div>`;
  },

  _bindAtributoSelectEvents(el, char, atributos) {
    el.querySelectorAll('.attr-select').forEach(select => {
      select.addEventListener('change', () => {
        const attr = select.dataset.attr;
        const newVal = parseInt(select.value) || 0;
        char.atributos[attr] = newVal;

        // Actualizar habilidades hijas base
        const skills = GideonCharacter.getHabilidadesDe(attr);
        skills.forEach(skill => {
          if (!char.habilidades[skill]) {
            char.habilidades[skill] = { base: newVal, modificacion: 0, total: newVal };
          } else {
            char.habilidades[skill].base = newVal;
            char.habilidades[skill].total = newVal + char.habilidades[skill].modificacion;
          }
        });

        // Re-renderizar info
        const infoEl = document.getElementById('arreglo-info');
        if (infoEl) infoEl.innerHTML = this._renderArregloInfo(char, atributos);

        // Actualizar nivel mostrado
        const nivelBadge = select.closest('.attribute-row')?.querySelector('.attribute-nivel');
        if (nivelBadge) nivelBadge.textContent = `Nv ${GideonFormulas.nivel(newVal)}`;
      });
    });
  },

  // ─────────────────────────────────────────────
  // PASO 2: Especie y Linaje
  // ─────────────────────────────────────────────
  _renderPaso2Linaje(el) {
    const char = this.personajeEnCreacion;
    const linajes = this.contenido?.linajes || [];

    el.innerHTML = `
      <div class="wizard-step-content fade-in">
        <h2 class="wizard-step-title">Paso 2 — Especie y Linaje</h2>
        <p class="wizard-step-desc">Selecciona el linaje Dríade de tu personaje. Cada linaje define el Escalado Vital (PV máximos) y otorga bonos a habilidades.</p>
        
        <div class="lineage-grid" id="lineage-grid">
          ${linajes.map(lin => `
            <div class="lineage-card ${char.linaje?.id === lin.id ? 'selected' : ''}" data-id="${lin.id}">
              <div class="lineage-header">
                <h3 class="lineage-name">${lin.nombre}</h3>
                <span class="lineage-name-en">${lin.nombre_en || ''}</span>
              </div>
              <div class="lineage-stat">
                <span class="stat-label">Escalado Vital</span>
                <span class="stat-value">×${lin.escalado_vital}</span>
              </div>
              <div class="lineage-bonuses">
                ${lin.bonos && lin.bonos.length > 0 
                  ? lin.bonos.map(b => `<span class="bonus-tag">+${b.valor} ${b.habilidad}</span>`).join('')
                  : '<span class="bonus-tag pending">Pendiente de diseño</span>'}
              </div>
              ${lin.descripcion ? `<p class="lineage-desc">${lin.descripcion}</p>` : ''}
            </div>
          `).join('')}
        </div>

        ${linajes.length === 0 ? '<div class="info-box info-warning">⚠ No se pudieron cargar los linajes. Verifica los archivos XML.</div>' : ''}
      </div>
    `;

    // Eventos
    el.querySelectorAll('.lineage-card').forEach(card => {
      card.addEventListener('click', () => {
        el.querySelectorAll('.lineage-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const linaje = linajes.find(l => l.id === card.dataset.id);
        if (linaje) {
          char.linaje = { ...linaje };
        }
      });
    });
  },

  // ─────────────────────────────────────────────
  // PASO 3: Origen (Dedicación + Nacimiento)
  // ─────────────────────────────────────────────
  _renderPaso3Origen(el) {
    const char = this.personajeEnCreacion;
    const dedicaciones = this.contenido?.dedicaciones || [];
    const nacimientos = this.contenido?.nacimientos || [];

    el.innerHTML = `
      <div class="wizard-step-content fade-in">
        <h2 class="wizard-step-title">Paso 3 — Origen</h2>
        <p class="wizard-step-desc">El trasfondo se compone de Dedicación (oficio) y Nacimiento (estructura social).</p>

        <!-- Dedicación -->
        <div class="form-section">
          <h3 class="form-section-title">Dedicación</h3>
          <p class="form-hint">Tu oficio o modo de vida antes de la aventura. Otorga habilidades garantizadas.</p>
          
          <div class="dedication-grid" id="dedication-grid">
            ${dedicaciones.map(ded => {
              const esEsqueleto = ded.estado === 'esqueleto';
              return `
                <div class="option-card dedication-card ${esEsqueleto ? 'esqueleto' : ''} ${char.dedicacion?.id === ded.id ? 'selected' : ''}" 
                     data-id="${ded.id}" ${esEsqueleto ? 'title="Skills pendientes de diseño"' : ''}>
                  <h4>${ded.nombre}</h4>
                  ${ded.skills_garantizadas && ded.skills_garantizadas.length > 0 
                    ? `<div class="ded-skills">${ded.skills_garantizadas.map(s => 
                        `<span class="bonus-tag">${s.nombre} ≥ ${s.minimo}</span>`).join('')}</div>`
                    : '<span class="bonus-tag pending">Pendiente</span>'}
                  ${esEsqueleto ? '<span class="badge badge-warning esqueleto-badge">Esqueleto</span>' : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Nacimiento -->
        <div class="form-section">
          <h3 class="form-section-title">Nacimiento</h3>
          <p class="form-hint">Estructura social y económica de origen. Se determina con 1d100.</p>
          
          <div class="birth-section">
            <button class="btn btn-primary" id="btn-tirar-nacimiento">🎲 Tirar Nacimiento (1d100)</button>
            <span class="birth-or">ó</span>
            <select class="select-field" id="nacimiento-select">
              <option value="">— Elegir manualmente —</option>
              ${nacimientos.map(n => 
                `<option value="${n.id}" ${char.nacimiento?.id === n.id ? 'selected' : ''}>${n.nombre} (${String(n.rango_min).padStart(2,'0')}-${String(n.rango_max).padStart(2,'0')})</option>`
              ).join('')}
            </select>
          </div>

          <div class="birth-result" id="birth-result" style="${char.nacimiento ? '' : 'display:none'}">
            <div class="birth-card">
              <span class="birth-roll" id="birth-roll">${char.nacimiento?.tirada ? `Tirada: ${char.nacimiento.tirada}` : ''}</span>
              <h4 id="birth-name">${char.nacimiento?.nombre || ''}</h4>
              <p id="birth-desc">${char.nacimiento?.descripcion || ''}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Eventos de dedicación
    el.querySelectorAll('.dedication-card').forEach(card => {
      card.addEventListener('click', () => {
        el.querySelectorAll('.dedication-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const ded = dedicaciones.find(d => d.id === card.dataset.id);
        if (ded) char.dedicacion = { ...ded };
      });
    });

    // Tirar nacimiento
    document.getElementById('btn-tirar-nacimiento')?.addEventListener('click', () => {
      const tirada = Math.floor(Math.random() * 100) + 1; // 1-100
      const nacimiento = nacimientos.find(n => tirada >= n.rango_min && tirada <= n.rango_max);
      if (nacimiento) {
        char.nacimiento = { ...nacimiento, tirada };
        document.getElementById('birth-result').style.display = '';
        document.getElementById('birth-roll').textContent = `Tirada: ${tirada}`;
        document.getElementById('birth-name').textContent = nacimiento.nombre;
        document.getElementById('birth-desc').textContent = nacimiento.descripcion || '';
        document.getElementById('nacimiento-select').value = nacimiento.id;
      }
    });

    // Selección manual de nacimiento
    document.getElementById('nacimiento-select')?.addEventListener('change', (e) => {
      const nacimiento = nacimientos.find(n => n.id === e.target.value);
      if (nacimiento) {
        char.nacimiento = { ...nacimiento, tirada: null };
        document.getElementById('birth-result').style.display = '';
        document.getElementById('birth-roll').textContent = 'Elegido manualmente';
        document.getElementById('birth-name').textContent = nacimiento.nombre;
        document.getElementById('birth-desc').textContent = nacimiento.descripcion || '';
      }
    });
  },

  // ─────────────────────────────────────────────
  // PASO 4: Senda (Clase)
  // ─────────────────────────────────────────────
  _renderPaso4Senda(el) {
    const char = this.personajeEnCreacion;
    const sendas = this.contenido?.sendas || [];
    const skillsCombate = [];
    GideonCharacter.getAtributosCombate().forEach(attr => {
      GideonCharacter.getHabilidadesDe(attr).forEach(skill => {
        skillsCombate.push({ nombre: skill, atributo: attr });
      });
    });

    const skillsNormales = [];
    GideonCharacter.getAtributosNormales().forEach(attr => {
      GideonCharacter.getHabilidadesDe(attr).forEach(skill => {
        skillsNormales.push({ nombre: skill, atributo: attr });
      });
    });

    el.innerHTML = `
      <div class="wizard-step-content fade-in">
        <h2 class="wizard-step-title">Paso 4 — Senda</h2>
        <p class="wizard-step-desc">Tu Senda define tu camino de poder. Otorga dotes de senda y dos pools de puntos para habilidades.</p>

        <!-- Selección de Senda -->
        <div class="form-section">
          <h3 class="form-section-title">Elige tu Senda</h3>
          <div class="senda-grid" id="senda-grid">
            ${sendas.map(s => `
              <div class="senda-card ${char.senda?.id === s.id ? 'selected' : ''}" data-id="${s.id}">
                <h4 class="senda-name">${s.nombre}</h4>
                <p class="senda-desc">${s.descripcion || ''}</p>
                ${s.proficiencias && s.proficiencias.length > 0 
                  ? `<div class="senda-profs">${s.proficiencias.map(p => 
                      `<span class="bonus-tag">${p.habilidad} <small>(${p.nivel})</small></span>`).join('')}</div>` 
                  : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Pool de Combate -->
        <div class="form-section">
          <h3 class="form-section-title">Pool de Combate</h3>
          <p class="form-hint">Asigna +20, +15, +10 y +5 a cuatro habilidades de combate distintas (Melee, Proyectiles o Arcana).</p>
          <div class="pool-assignments" id="pool-combate">
            ${[20, 15, 10, 5].map((valor, i) => `
              <div class="pool-row">
                <span class="pool-value">+${valor}</span>
                <select class="select-field pool-select" data-pool="combate" data-valor="${valor}" data-index="${i}">
                  <option value="">— Asignar —</option>
                  ${skillsCombate.map(s => {
                    const sel = char._poolCombate?.[i]?.skill === s.nombre ? 'selected' : '';
                    return `<option value="${s.nombre}" ${sel}>${s.nombre} (${s.atributo})</option>`;
                  }).join('')}
                </select>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Pool Normal -->
        <div class="form-section">
          <h3 class="form-section-title">Pool Normal</h3>
          <p class="form-hint">Reparte 50 puntos entre habilidades normales. Máximo +20 a una sola habilidad.</p>
          <div class="pool-counter" id="pool-normal-counter">
            Puntos restantes: <span id="pool-normal-remaining" class="pool-remaining">50</span> / 50
          </div>
          <div class="pool-normal-grid" id="pool-normal-grid">
            ${skillsNormales.map(s => {
              const mod = char._poolNormal?.[s.nombre] || 0;
              return `
                <div class="pool-normal-row">
                  <span class="pool-normal-skill">${s.nombre}</span>
                  <span class="pool-normal-attr">(${s.atributo})</span>
                  <div class="pool-normal-input-group">
                    <button class="btn btn-sm pool-minus" data-skill="${s.nombre}">−</button>
                    <span class="pool-normal-value" data-skill="${s.nombre}">${mod}</span>
                    <button class="btn btn-sm pool-plus" data-skill="${s.nombre}">+</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    // Inicializar pools si no existen
    if (!char._poolCombate) char._poolCombate = [{}, {}, {}, {}];
    if (!char._poolNormal) char._poolNormal = {};

    // Eventos de senda
    el.querySelectorAll('.senda-card').forEach(card => {
      card.addEventListener('click', () => {
        el.querySelectorAll('.senda-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const senda = sendas.find(s => s.id === card.dataset.id);
        if (senda) char.senda = { ...senda };
      });
    });

    // Eventos de pool de combate
    el.querySelectorAll('[data-pool="combate"]').forEach(select => {
      select.addEventListener('change', () => {
        const idx = parseInt(select.dataset.index);
        const valor = parseInt(select.dataset.valor);
        char._poolCombate[idx] = { skill: select.value, valor };
      });
    });

    // Eventos de pool normal (+/-)
    this._bindPoolNormalEvents(el, char, skillsNormales);
  },

  _bindPoolNormalEvents(el, char, skillsNormales) {
    const maxPorSkill = 20;
    const totalPool = 50;

    const getUsados = () => Object.values(char._poolNormal).reduce((a, b) => a + b, 0);

    const actualizar = () => {
      const restante = totalPool - getUsados();
      const restanteEl = document.getElementById('pool-normal-remaining');
      if (restanteEl) {
        restanteEl.textContent = restante;
        restanteEl.classList.toggle('pool-over', restante < 0);
        restanteEl.classList.toggle('pool-done', restante === 0);
      }
    };

    el.querySelectorAll('.pool-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const skill = btn.dataset.skill;
        const actual = char._poolNormal[skill] || 0;
        const restante = totalPool - getUsados();
        if (actual < maxPorSkill && restante > 0) {
          char._poolNormal[skill] = actual + 5;
          const display = el.querySelector(`.pool-normal-value[data-skill="${skill}"]`);
          if (display) display.textContent = char._poolNormal[skill];
          actualizar();
        }
      });
    });

    el.querySelectorAll('.pool-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const skill = btn.dataset.skill;
        const actual = char._poolNormal[skill] || 0;
        if (actual > 0) {
          char._poolNormal[skill] = actual - 5;
          const display = el.querySelector(`.pool-normal-value[data-skill="${skill}"]`);
          if (display) display.textContent = char._poolNormal[skill];
          actualizar();
        }
      });
    });

    actualizar();
  },

  // ─────────────────────────────────────────────
  // PASO 5: Regalos y Perjuicios
  // ─────────────────────────────────────────────
  _renderPaso5Regalos(el) {
    const char = this.personajeEnCreacion;
    const regalos = this.contenido?.regalos || [];
    const perjuicios = this.contenido?.perjuicios || [];

    el.innerHTML = `
      <div class="wizard-step-content fade-in">
        <h2 class="wizard-step-title">Paso 5 — Regalos y Perjuicios</h2>
        <p class="wizard-step-desc">Rasgos opcionales de origen. Son independientes: puedes tener un Regalo sin Perjuicio, un Perjuicio sin Regalo, ambos, o ninguno.</p>

        <div class="info-box">
          <strong>Regla anti-min-max:</strong> El jugador nunca elige ambos lados. Si eliges uno, el otro es aleatorio o lo pone el DM.
        </div>

        <!-- Método de adquisición -->
        <div class="form-section">
          <h3 class="form-section-title">Método</h3>
          <div class="option-cards method-cards">
            <div class="option-card ${char._metodoRegalos === 'ninguno' ? 'selected' : ''}" data-method="ninguno">
              <div class="option-card-icon">🚫</div>
              <h4>Sin Regalo ni Perjuicio</h4>
            </div>
            <div class="option-card ${char._metodoRegalos === 'elegir_regalo' ? 'selected' : ''}" data-method="elegir_regalo">
              <div class="option-card-icon">🎁</div>
              <h4>Elegir Regalo</h4>
              <p>El DM asigna el Perjuicio</p>
            </div>
            <div class="option-card ${char._metodoRegalos === 'elegir_perjuicio' ? 'selected' : ''}" data-method="elegir_perjuicio">
              <div class="option-card-icon">⚡</div>
              <h4>Elegir Perjuicio</h4>
              <p>El Regalo es aleatorio</p>
            </div>
            <div class="option-card ${char._metodoRegalos === 'ambos_azar' ? 'selected' : ''}" data-method="ambos_azar">
              <div class="option-card-icon">🎲</div>
              <h4>Ambos al Azar</h4>
            </div>
          </div>
        </div>

        <!-- Selección de Regalo -->
        <div class="form-section" id="regalo-section" style="${char._metodoRegalos === 'elegir_regalo' ? '' : 'display:none'}">
          <h3 class="form-section-title">Elige tu Regalo</h3>
          <div class="regalo-grid">
            ${regalos.map(r => `
              <div class="option-card regalo-card ${char.regalo?.id === r.id ? 'selected' : ''}" data-id="${r.id}">
                <h4>${r.nombre}</h4>
                <p>${r.efecto}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Selección de Perjuicio -->
        <div class="form-section" id="perjuicio-section" style="${char._metodoRegalos === 'elegir_perjuicio' ? '' : 'display:none'}">
          <h3 class="form-section-title">Elige tu Perjuicio</h3>
          <div class="perjuicio-grid">
            ${perjuicios.map(p => `
              <div class="option-card perjuicio-card ${char.perjuicio?.id === p.id ? 'selected' : ''}" data-id="${p.id}">
                <h4>${p.nombre}</h4>
                <p>${p.efecto}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Resultado aleatorio -->
        <div class="form-section" id="azar-result-section" style="${char._metodoRegalos === 'ambos_azar' ? '' : 'display:none'}">
          <button class="btn btn-primary" id="btn-tirar-ambos">🎲 Tirar ambos al azar</button>
          <div id="azar-result" style="${char._azarResult ? '' : 'display:none'}">
            <div class="azar-resultado">
              <span class="badge badge-success">Regalo: ${char.regalo?.nombre || '?'}</span>
              <span class="badge badge-danger">Perjuicio: ${char.perjuicio?.nombre || '?'}</span>
            </div>
          </div>
        </div>

        <!-- Resumen final -->
        <div class="form-section">
          <h3 class="form-section-title">Resumen de Creación</h3>
          <div class="creation-summary card" id="creation-summary">
            ${this._renderResumenCreacion(char)}
          </div>
        </div>
      </div>
    `;

    // Eventos de método
    el.querySelectorAll('.method-cards .option-card').forEach(card => {
      card.addEventListener('click', () => {
        el.querySelectorAll('.method-cards .option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        char._metodoRegalos = card.dataset.method;

        // Mostrar/ocultar secciones
        document.getElementById('regalo-section').style.display = 
          char._metodoRegalos === 'elegir_regalo' ? '' : 'none';
        document.getElementById('perjuicio-section').style.display = 
          char._metodoRegalos === 'elegir_perjuicio' ? '' : 'none';
        document.getElementById('azar-result-section').style.display = 
          char._metodoRegalos === 'ambos_azar' ? '' : 'none';

        if (char._metodoRegalos === 'ninguno') {
          char.regalo = null;
          char.perjuicio = null;
        }
      });
    });

    // Eventos de selección de regalo
    el.querySelectorAll('.regalo-card').forEach(card => {
      card.addEventListener('click', () => {
        el.querySelectorAll('.regalo-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        char.regalo = regalos.find(r => r.id === card.dataset.id) || null;
      });
    });

    // Eventos de selección de perjuicio
    el.querySelectorAll('.perjuicio-card').forEach(card => {
      card.addEventListener('click', () => {
        el.querySelectorAll('.perjuicio-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        char.perjuicio = perjuicios.find(p => p.id === card.dataset.id) || null;
      });
    });

    // Tirar ambos al azar
    document.getElementById('btn-tirar-ambos')?.addEventListener('click', () => {
      if (regalos.length > 0) {
        char.regalo = regalos[Math.floor(Math.random() * regalos.length)];
      }
      if (perjuicios.length > 0) {
        char.perjuicio = perjuicios[Math.floor(Math.random() * perjuicios.length)];
      }
      char._azarResult = true;
      const resultEl = document.getElementById('azar-result');
      if (resultEl) {
        resultEl.style.display = '';
        resultEl.innerHTML = `
          <div class="azar-resultado">
            <span class="badge badge-success">Regalo: ${char.regalo?.nombre || '?'}</span>
            <span class="badge badge-danger">Perjuicio: ${char.perjuicio?.nombre || '?'}</span>
          </div>
        `;
      }
    });
  },

  _renderResumenCreacion(char) {
    return `
      <div class="summary-grid">
        <div class="summary-item"><span class="summary-label">Nombre</span><span class="summary-value">${char.nombre || '—'}</span></div>
        <div class="summary-item"><span class="summary-label">Campaña</span><span class="summary-value">${char.modoCampana || '—'}</span></div>
        <div class="summary-item"><span class="summary-label">Linaje</span><span class="summary-value">${char.linaje?.nombre || '—'}</span></div>
        <div class="summary-item"><span class="summary-label">Senda</span><span class="summary-value">${char.senda?.nombre || '—'}</span></div>
        <div class="summary-item"><span class="summary-label">Dedicación</span><span class="summary-value">${char.dedicacion?.nombre || '—'}</span></div>
        <div class="summary-item"><span class="summary-label">Nacimiento</span><span class="summary-value">${char.nacimiento?.nombre || '—'}</span></div>
        <div class="summary-item"><span class="summary-label">Regalo</span><span class="summary-value">${char.regalo?.nombre || 'Ninguno'}</span></div>
        <div class="summary-item"><span class="summary-label">Perjuicio</span><span class="summary-value">${char.perjuicio?.nombre || 'Ninguno'}</span></div>
      </div>
    `;
  },

  // ─────────────────────────────────────────────
  // Validación de pasos
  // ─────────────────────────────────────────────
  _validarPaso() {
    const char = this.personajeEnCreacion;
    switch (this.pasoActual) {
      case 0:
        if (!char.nombre || char.nombre.trim() === '') {
          this._mostrarError('Ingresa un nombre para tu personaje.');
          return false;
        }
        if (!char.modoCampana) {
          this._mostrarError('Selecciona un modo de campaña.');
          return false;
        }
        return true;

      case 1:
        // Verificar que todos los atributos tengan valor
        const atributos = GideonCharacter.getNombreAtributos();
        const sinValor = atributos.filter(a => !char.atributos[a] || char.atributos[a] === 0);
        if (sinValor.length > 0) {
          this._mostrarError(`Asigna valores a: ${sinValor.join(', ')}`);
          return false;
        }
        return true;

      case 2:
        if (!char.linaje) {
          this._mostrarError('Selecciona un linaje.');
          return false;
        }
        return true;

      case 3:
        // Dedicación y nacimiento son opcionales en sandbox, pero conviene tener al menos uno
        return true;

      case 4:
        if (!char.senda) {
          this._mostrarError('Selecciona una senda.');
          return false;
        }
        return true;

      case 5:
        return true;

      default:
        return true;
    }
  },

  // ─────────────────────────────────────────────
  // Guardar datos del paso actual
  // ─────────────────────────────────────────────
  _guardarPaso() {
    const char = this.personajeEnCreacion;

    switch (this.pasoActual) {
      case 0:
        const nombreInput = document.getElementById('char-nombre');
        if (nombreInput) char.nombre = nombreInput.value.trim();
        break;

      case 1:
        // Inicializar habilidades hijas con el valor del atributo padre
        const skillTree = GideonCharacter.getSkillTree();
        for (const [attr, skills] of Object.entries(skillTree)) {
          const valorAttr = char.atributos[attr] || 0;
          skills.forEach(skill => {
            if (!char.habilidades[skill]) {
              char.habilidades[skill] = { base: valorAttr, modificacion: 0, total: valorAttr };
            } else {
              char.habilidades[skill].base = valorAttr;
              char.habilidades[skill].total = valorAttr + (char.habilidades[skill].modificacion || 0);
            }
          });
        }
        break;

      case 2:
        // Aplicar bonos de linaje
        if (char.linaje && char.linaje.bonos) {
          GideonCharacter.aplicarLinaje(char, char.linaje);
        }
        break;

      case 3:
        // Aplicar dedicación (Regla de Destacado)
        if (char.dedicacion) {
          GideonCharacter.aplicarDedicacion(char, char.dedicacion);
        }
        break;

      case 4:
        // Aplicar pools de senda
        if (char._poolCombate) {
          char._poolCombate.forEach(asig => {
            if (asig.skill && asig.valor) {
              const hab = char.habilidades[asig.skill];
              if (hab) {
                hab.modificacion = (hab.modificacion || 0) + asig.valor;
                hab.total = GideonFormulas.aplicarTecho(hab.base + hab.modificacion);
              }
            }
          });
        }
        if (char._poolNormal) {
          for (const [skill, mod] of Object.entries(char._poolNormal)) {
            if (mod > 0) {
              const hab = char.habilidades[skill];
              if (hab) {
                hab.modificacion = (hab.modificacion || 0) + mod;
                hab.total = GideonFormulas.aplicarTecho(hab.base + hab.modificacion);
              }
            }
          }
        }
        break;

      case 5:
        // Aplicar regalos y perjuicios
        if (char.regalo) {
          GideonCharacter.aplicarRegalo(char, char.regalo);
        }
        if (char.perjuicio) {
          GideonCharacter.aplicarPerjuicio(char, char.perjuicio);
        }
        break;
    }
  },

  // ─────────────────────────────────────────────
  // Finalizar creación
  // ─────────────────────────────────────────────
  _finalizarCreacion() {
    this._guardarPaso();
    const char = this.personajeEnCreacion;

    // Recalcular todos los derivados
    GideonCharacter.recalcularDerivados(char);

    // Limpiar propiedades temporales del wizard
    delete char._metodoAtributos;
    delete char._valoresAleatorios;
    delete char._poolCombate;
    delete char._poolNormal;
    delete char._metodoRegalos;
    delete char._azarResult;

    // Establecer como personaje activo
    window.AppState.personaje = char;

    // Notificar a la app
    if (window.App) {
      window.App.onPersonajeCreado(char);
    }
  },

  // ─────────────────────────────────────────────
  // Actualizar indicadores de progreso
  // ─────────────────────────────────────────────
  _actualizarProgreso() {
    const steps = document.querySelectorAll('#wizard-progress .wizard-step');
    steps.forEach((step, i) => {
      step.classList.remove('active', 'completed');
      if (i < this.pasoActual) step.classList.add('completed');
      if (i === this.pasoActual) step.classList.add('active');
    });
  },

  _actualizarNavegacion() {
    const prevBtn = document.getElementById('wizard-prev');
    const nextBtn = document.getElementById('wizard-next');
    const stepText = document.getElementById('wizard-step-text');

    if (prevBtn) prevBtn.disabled = this.pasoActual === 0;
    if (nextBtn) {
      nextBtn.textContent = this.pasoActual === this.totalPasos - 1 ? '✓ Finalizar' : 'Siguiente →';
      if (this.pasoActual === this.totalPasos - 1) {
        nextBtn.classList.add('btn-success');
      } else {
        nextBtn.classList.remove('btn-success');
      }
    }
    if (stepText) stepText.textContent = `Paso ${this.pasoActual} de ${this.totalPasos - 1}`;
  },

  // ─────────────────────────────────────────────
  // Utilidades
  // ─────────────────────────────────────────────
  _mostrarError(mensaje) {
    if (window.App && window.App.mostrarToast) {
      window.App.mostrarToast(mensaje, 'error');
    } else {
      alert(mensaje);
    }
  },

  // Reiniciar wizard
  reiniciar() {
    this.personajeEnCreacion = GideonCharacter.crearNuevo();
    this.pasoActual = 0;
    this.renderPaso();
  }
};

window.Wizard = Wizard;
