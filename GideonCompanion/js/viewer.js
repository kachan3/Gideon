// viewer.js — Visor de personaje completo
// Muestra atributos, habilidades hijas, stats derivados, rasgos y equipo

const Viewer = {
  // ─────────────────────────────────────────────
  // Inicializar
  // ─────────────────────────────────────────────
  init() {
    // Nada que hacer aquí, se renderiza cuando hay personaje
  },

  // ─────────────────────────────────────────────
  // Renderizar personaje completo
  // ─────────────────────────────────────────────
  renderizar(personaje) {
    const container = document.getElementById('viewer-container');
    if (!container) return;

    if (!personaje) {
      container.innerHTML = `
        <div class="viewer-empty" id="viewer-empty">
          <div class="empty-icon">👤</div>
          <h2>Sin Personaje</h2>
          <p>Crea un personaje con el wizard o importa uno existente.</p>
          <button class="btn btn-primary" id="btn-go-wizard">📜 Crear Personaje</button>
        </div>
      `;
      document.getElementById('btn-go-wizard')?.addEventListener('click', () => {
        if (window.App) window.App.cambiarVista('wizard');
      });
      return;
    }

    // Recalcular derivados
    GideonCharacter.recalcularDerivados(personaje);

    container.innerHTML = `
      <div class="viewer-layout fade-in">
        <!-- Header del personaje -->
        ${this._renderHeader(personaje)}

        <!-- Grid principal -->
        <div class="viewer-grid">
          <!-- Columna izquierda: Atributos y habilidades -->
          <div class="viewer-col-main">
            ${this._renderAtributos(personaje)}
          </div>

          <!-- Columna derecha: Stats derivados, rasgos, equipo -->
          <div class="viewer-col-side">
            ${this._renderStatsDerivados(personaje)}
            ${this._renderRasgos(personaje)}
            ${this._renderNotas(personaje)}
          </div>
        </div>
      </div>
    `;

    // Bind eventos
    this._bindEvents(personaje);
  },

  // ─────────────────────────────────────────────
  // Header del personaje
  // ─────────────────────────────────────────────
  _renderHeader(char) {
    return `
      <div class="character-header">
        <div class="character-header-main">
          <h1 class="character-name">${char.nombre || 'Sin Nombre'}</h1>
          <div class="character-tags">
            ${char.linaje?.nombre ? `<span class="badge badge-gold">${char.linaje.nombre}</span>` : ''}
            ${char.senda?.nombre ? `<span class="badge badge-success">${char.senda.nombre}</span>` : ''}
            ${char.dedicacion?.nombre ? `<span class="badge">${char.dedicacion.nombre}</span>` : ''}
          </div>
        </div>
        <div class="character-header-meta">
          <div class="meta-item">
            <span class="meta-label">Campaña</span>
            <span class="meta-value">${char.modoCampana === 'enclave' ? '🏰 Enclave' : '🌍 Sandbox'}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Nacimiento</span>
            <span class="meta-value">${char.nacimiento?.nombre || '—'}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">XP</span>
            <span class="meta-value">${char.xpTotal || 1}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Omen</span>
            <span class="meta-value omen-display">
              ${'★'.repeat(char.omen || 0)}${'☆'.repeat(2 - (char.omen || 0))}
            </span>
          </div>
        </div>
      </div>
    `;
  },

  // ─────────────────────────────────────────────
  // Panel de Atributos + Habilidades Hijas
  // ─────────────────────────────────────────────
  _renderAtributos(char) {
    const skillTree = GideonCharacter.getSkillTree();
    const attrCombate = GideonCharacter.getAtributosCombate();

    // Separar combate y normales
    const combateHTML = attrCombate.map(attr => this._renderAtributoPanel(char, attr, skillTree[attr], true)).join('');
    const normalesHTML = GideonCharacter.getAtributosNormales().map(attr => 
      this._renderAtributoPanel(char, attr, skillTree[attr], false)
    ).join('');

    return `
      <div class="attributes-section">
        <h2 class="section-title">⚔ Atributos de Combate</h2>
        <div class="stats-grid combat-grid">
          ${combateHTML}
        </div>

        <h2 class="section-title">📊 Atributos Normales</h2>
        <div class="stats-grid normal-grid">
          ${normalesHTML}
        </div>
      </div>
    `;
  },

  _renderAtributoPanel(char, attrName, skills, esCombate) {
    const valor = char.atributos[attrName] || 0;
    const nivel = GideonFormulas.nivel(valor);
    const tipo = esCombate ? 'combate' : 'normal';

    const skillsHTML = (skills || []).map(skill => {
      const hab = char.habilidades[skill];
      const total = hab ? hab.total : valor;
      const mod = hab ? hab.modificacion : 0;
      const skillNivel = GideonFormulas.nivel(total);
      
      return `
        <div class="skill-item" data-skill="${skill}" data-valor="${total}" title="Click para tirar ${skill}">
          <span class="skill-name">${skill}</span>
          <span class="skill-mod">${mod > 0 ? `+${mod}` : mod < 0 ? mod : ''}</span>
          <span class="skill-total">${total}</span>
          <span class="skill-nivel badge badge-sm">Nv ${skillNivel}</span>
        </div>
      `;
    }).join('');

    return `
      <div class="attribute-panel ${tipo}">
        <div class="attribute-panel-header">
          <div class="attribute-circle ${tipo}">
            <span class="attribute-circle-value">${valor}</span>
          </div>
          <div class="attribute-panel-info">
            <span class="attribute-panel-name">${attrName}</span>
            <span class="attribute-panel-nivel">Nivel ${nivel}</span>
          </div>
        </div>
        <div class="skills-panel">
          ${skillsHTML}
        </div>
      </div>
    `;
  },

  // ─────────────────────────────────────────────
  // Stats Derivados
  // ─────────────────────────────────────────────
  _renderStatsDerivados(char) {
    const d = char._derivados || {};
    const mh = d.mh || 0;
    const pgReales = d.pgReales || mh;
    const manaMax = d.manaMax || 0;
    const manaActual = manaMax - (char.manaConsumido || 0);
    const stamina = d.stamina || 0;
    const dureza = d.dureza || 0;
    const limiteSeguro = d.limiteSeguroMana || 0;
    const umbralGrave = d.umbralHeridaGrave || 0;
    const umbralMortal = d.umbralHeridaMortal || 0;

    const hpPercent = mh > 0 ? (pgReales / mh * 100) : 0;
    const manaPercent = manaMax > 0 ? (manaActual / manaMax * 100) : 0;

    return `
      <div class="derived-stats card">
        <h3 class="card-header">📋 Stats Derivados</h3>
        
        <!-- Vida -->
        <div class="stat-block">
          <div class="stat-header">
            <span class="stat-name">❤ PG</span>
            <span class="stat-numbers">${pgReales} / ${mh}</span>
          </div>
          <div class="stat-bar">
            <div class="stat-bar-fill hp-bar" style="width: ${hpPercent}%"></div>
          </div>
          <div class="stat-details">
            <span>Heridas Graves: ${char.heridasGraves || 0}/4</span>
            <span>Umbral Grave: ${umbralGrave}</span>
            <span>Umbral Mortal: ${umbralMortal}</span>
          </div>
        </div>

        <!-- Maná -->
        <div class="stat-block">
          <div class="stat-header">
            <span class="stat-name">🔮 Maná</span>
            <span class="stat-numbers">${manaActual} / ${manaMax}</span>
          </div>
          <div class="stat-bar">
            <div class="stat-bar-fill mana-bar" style="width: ${manaPercent}%"></div>
          </div>
          <div class="stat-details">
            <span>Límite Seguro: ${limiteSeguro}</span>
            <span>Daño Crónico: ${char.danoCronico || 0}</span>
          </div>
        </div>

        <!-- Stamina y Dureza -->
        <div class="stat-row">
          <div class="stat-mini">
            <span class="stat-mini-label">⚡ Stamina</span>
            <span class="stat-mini-value">${stamina}</span>
          </div>
          <div class="stat-mini">
            <span class="stat-mini-label">🛡 Dureza</span>
            <span class="stat-mini-value">${dureza}</span>
          </div>
          <div class="stat-mini">
            <span class="stat-mini-label">✦ Omen</span>
            <span class="stat-mini-value">${char.omen || 0}/2</span>
          </div>
        </div>

        <!-- Escalado Vital -->
        <div class="stat-row">
          <div class="stat-mini">
            <span class="stat-mini-label">🌿 Escalado Vital</span>
            <span class="stat-mini-value">×${char.linaje?.escalado_vital || '?'}</span>
          </div>
          <div class="stat-mini">
            <span class="stat-mini-label">📈 Nv Vitalidad</span>
            <span class="stat-mini-value">${GideonFormulas.nivel(char.atributos?.Vitalidad || 0)}</span>
          </div>
        </div>
      </div>
    `;
  },

  // ─────────────────────────────────────────────
  // Rasgos (Regalo, Perjuicio, Senda)
  // ─────────────────────────────────────────────
  _renderRasgos(char) {
    return `
      <div class="traits-panel card">
        <h3 class="card-header">🏷 Rasgos</h3>
        
        ${char.linaje ? `
          <div class="trait-item">
            <span class="trait-type badge badge-gold">Linaje</span>
            <span class="trait-name">${char.linaje.nombre}</span>
            ${char.linaje.bonos?.length > 0 
              ? `<div class="trait-bonuses">${char.linaje.bonos.map(b => `<span class="bonus-tag">+${b.valor} ${b.habilidad}</span>`).join('')}</div>` 
              : ''}
          </div>
        ` : ''}
        
        ${char.senda ? `
          <div class="trait-item">
            <span class="trait-type badge badge-success">Senda</span>
            <span class="trait-name">${char.senda.nombre}</span>
          </div>
        ` : ''}

        ${char.regalo ? `
          <div class="trait-item">
            <span class="trait-type badge badge-gold">Regalo</span>
            <span class="trait-name">${char.regalo.nombre}</span>
            <p class="trait-desc">${char.regalo.efecto || ''}</p>
          </div>
        ` : ''}
        
        ${char.perjuicio ? `
          <div class="trait-item">
            <span class="trait-type badge badge-danger">Perjuicio</span>
            <span class="trait-name">${char.perjuicio.nombre}</span>
            <p class="trait-desc">${char.perjuicio.efecto || ''}</p>
          </div>
        ` : ''}

        ${!char.regalo && !char.perjuicio && !char.linaje && !char.senda 
          ? '<p class="empty-text">Sin rasgos definidos.</p>' : ''}
      </div>
    `;
  },

  // ─────────────────────────────────────────────
  // Notas del personaje
  // ─────────────────────────────────────────────
  _renderNotas(char) {
    return `
      <div class="notes-panel card">
        <h3 class="card-header">📝 Notas</h3>
        <textarea class="notes-textarea" id="char-notes" placeholder="Escribe notas sobre tu personaje...">${char.notas || ''}</textarea>
      </div>
    `;
  },

  // ─────────────────────────────────────────────
  // Bind eventos (click en skills para tirar)
  // ─────────────────────────────────────────────
  _bindEvents(char) {
    // Click en skill para tirar dados
    document.querySelectorAll('.skill-item').forEach(item => {
      item.addEventListener('click', () => {
        const skill = item.dataset.skill;
        const valor = parseInt(item.dataset.valor);
        if (skill && !isNaN(valor) && window.Roller) {
          window.Roller.tirarDesdeVisor(skill, valor);
        }
      });
    });

    // Guardar notas
    document.getElementById('char-notes')?.addEventListener('input', (e) => {
      char.notas = e.target.value;
    });

    // Ir al wizard
    document.getElementById('btn-go-wizard')?.addEventListener('click', () => {
      if (window.App) window.App.cambiarVista('wizard');
    });
  },

  // ─────────────────────────────────────────────
  // Actualizar visor
  // ─────────────────────────────────────────────
  actualizar() {
    if (window.AppState && window.AppState.personaje) {
      this.renderizar(window.AppState.personaje);
    }
  }
};

window.Viewer = Viewer;
