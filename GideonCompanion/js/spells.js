// spells.js — Gestor y simulador de hechizos para el companion
// Incluye gestión profunda de maná: límite seguro, daño crónico, tirada de Tenacidad

const SpellsManager = {
  hechizosDisponibles: [],

  async init() {
    this._bindEvents();
    await this._cargarHechizos();
  },

  async _cargarHechizos() {
    try {
      const res = await fetch('content/Hechizos/bola_de_fuego.xml');
      if (res.ok) {
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "application/xml");
        const hNode = doc.querySelector('hechizo');
        
        if (hNode) {
          const hechizo = {
            id: hNode.getAttribute('id'),
            nombre: hNode.querySelector('nombre')?.textContent || 'Hechizo sin nombre',
            escuela: hNode.querySelector('escuela')?.textContent || 'Arcana',
            coste_acciones: parseInt(hNode.querySelector('coste_acciones')?.textContent || '1'),
            componentes: hNode.querySelector('componentes')?.textContent || '',
            descripcion: hNode.querySelector('descripcion')?.textContent || ''
          };
          this.hechizosDisponibles.push(hechizo);
        }
      }
    } catch (e) {
      console.error("Error cargando hechizos:", e);
    }
  },

  _bindEvents() {
    document.getElementById('tab-spells')?.addEventListener('click', () => {
      this.render();
    });
  },

  // ─────────────────────────────────────────────
  // RENDER principal
  // ─────────────────────────────────────────────
  render() {
    const container = document.getElementById('spells-container');
    if (!container) return;

    if (!window.AppState || !window.AppState.personaje || !window.AppState.personaje.linaje) {
      container.innerHTML = `
        <div class="viewer-empty">
          <div class="empty-icon">🔮</div>
          <h2>Grimorio Vacío</h2>
          <p>Crea o carga un personaje completo para usar la magia.</p>
        </div>
      `;
      return;
    }

    const char = window.AppState.personaje;
    const gf = window.GideonFormulas;
    const voluntad = char.atributos["Voluntad"] || 0;
    const vitalidad = char.atributos["Vitalidad"] || 0;
    
    // Recalcular derivados para tener manaMax actualizado con daño crónico
    GideonCharacter.recalcularDerivados(char);

    const maxMana = char.stats.manaMax;
    const manaConsumido = char.manaConsumido || 0;
    const manaActual = maxMana - manaConsumido;
    const limiteSeguro = gf.calcularLimiteSeguro(voluntad, vitalidad);
    const danoCronico = char.danoCronico || 0;

    // Estado: si el maná consumido supera el límite seguro
    const sobreLimite = manaConsumido > limiteSeguro;
    const manaPercent = maxMana > 0 ? Math.max(0, (manaActual / maxMana) * 100) : 0;
    const limitePercent = maxMana > 0 ? Math.min(100, (limiteSeguro / maxMana) * 100) : 0;

    let estadoClass = 'text-success';
    let estadoTexto = 'Estable';
    if (manaActual <= 0) {
      estadoClass = 'text-danger';
      estadoTexto = '⚠ Sin Maná';
    } else if (sobreLimite) {
      estadoClass = 'text-warning';
      estadoTexto = '⚠ Sobre Límite Seguro';
    }

    let html = `
      <div class="spells-header card">
        <h3 class="card-header">🔮 Estado Mágico</h3>
        
        <!-- Barra de Maná con indicador de límite seguro -->
        <div style="margin-bottom:1rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
            <span>Maná</span>
            <span style="color:var(--accent-primary-light);">${manaActual} / ${maxMana}</span>
          </div>
          <div style="position:relative; height:16px; background:rgba(0,0,0,0.5); border-radius:8px; overflow:hidden; border:1px solid rgba(255,255,255,0.1);">
            <div style="height:100%; width:${manaPercent}%; background:linear-gradient(90deg, #1e3a8a, #3b82f6); border-radius:8px; transition:width 0.3s;"></div>
            <div style="position:absolute; top:0; left:${limitePercent}%; width:2px; height:100%; background:var(--portento); box-shadow:0 0 6px var(--portento);" title="Límite Seguro: ${limiteSeguro}"></div>
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:0.25rem; font-size:0.75rem; color:var(--text-secondary);">
            <span>Consumido: ${manaConsumido}</span>
            <span style="color:var(--portento);">Límite Seguro: ${limiteSeguro}</span>
          </div>
        </div>

        <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr);">
          <div class="attribute-panel">
            <span class="stat-label">Estado</span>
            <span class="${estadoClass}" style="font-size:0.9rem; font-weight:bold;">${estadoTexto}</span>
          </div>
          <div class="attribute-panel">
            <span class="stat-label">Daño Crónico</span>
            <span style="font-size: 1.3rem; color: ${danoCronico > 0 ? 'var(--danger)' : 'var(--text-primary)'};">${danoCronico}</span>
          </div>
          <div class="attribute-panel">
            <span class="stat-label">Nv Voluntad</span>
            <span style="font-size: 1.3rem;">${gf.nivel(voluntad)}</span>
          </div>
          <div class="attribute-panel">
            <span class="stat-label">Nv Vitalidad</span>
            <span style="font-size: 1.3rem;">${gf.nivel(vitalidad)}</span>
          </div>
        </div>

        <!-- Controles de gestión de maná -->
        <div style="display:flex; gap:0.5rem; margin-top:1rem; flex-wrap:wrap;">
          <button class="btn btn-secondary btn-sm" onclick="SpellsManager.resetearMana()">🔄 Resetear Maná</button>
          <button class="btn btn-secondary btn-sm" onclick="SpellsManager.ajustarDanoCronico(1)">💀 +1 D.Crónico</button>
          <button class="btn btn-secondary btn-sm" onclick="SpellsManager.ajustarDanoCronico(-1)">💚 -1 D.Crónico</button>
          <button class="btn btn-secondary btn-sm" onclick="SpellsManager.ajustarManaConsumido()">✏ Ajustar Maná</button>
        </div>
      </div>
    `;

    // Grimorio
    html += `
      <div class="card" style="margin-top: 1rem;">
        <h3 class="card-header">📖 Grimorio</h3>
        <div class="spells-list">
    `;

    if (this.hechizosDisponibles.length === 0) {
      html += `<p style="color:var(--text-secondary);">No hay hechizos disponibles.</p>`;
    } else {
      this.hechizosDisponibles.forEach(h => {
        const skillLvl = char.habilidades[h.escuela] ? char.habilidades[h.escuela].total : 0;
        html += `
          <div class="spell-item card" style="margin-bottom: 1rem; padding: 1rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
              <h4 style="margin:0;">${h.nombre} <small style="color:var(--text-secondary);">(${h.escuela} - Nivel: ${skillLvl})</small></h4>
              <button class="btn btn-primary btn-sm" onclick="SpellsManager.simularCasteo('${h.id}')">🔮 Lanzar</button>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Coste: ${h.coste_acciones} Acciones | Componentes: ${h.componentes}</p>
            <p>${h.descripcion}</p>
            <div id="spell-result-${h.id}" style="display:none; margin-top: 1rem; padding: 1rem; background: rgba(0,0,0,0.3); border-radius: 8px; border-left: 4px solid var(--accent-primary);"></div>
          </div>
        `;
      });
    }

    html += `</div></div>`;
    container.innerHTML = html;
  },

  // ─────────────────────────────────────────────
  // Controles de gestión de maná
  // ─────────────────────────────────────────────
  resetearMana() {
    const char = window.AppState?.personaje;
    if (!char) return;
    char.manaConsumido = 0;
    if (window.App) window.App.mostrarToast('Maná restaurado', 'success');
    this.render();
  },

  ajustarDanoCronico(delta) {
    const char = window.AppState?.personaje;
    if (!char) return;
    char.danoCronico = Math.max(0, (char.danoCronico || 0) + delta);
    GideonCharacter.recalcularDerivados(char); // Recalcular manaMax
    if (window.App) {
      if (delta > 0) {
        window.App.mostrarToast(`Daño Crónico: ${char.danoCronico} (Maná Máx: ${char.stats.manaMax})`, 'warning');
      } else {
        window.App.mostrarToast(`Daño Crónico reducido: ${char.danoCronico}`, 'success');
      }
    }
    this.render();
  },

  ajustarManaConsumido() {
    const char = window.AppState?.personaje;
    if (!char) return;
    const nuevoValor = prompt('Maná consumido actual:', char.manaConsumido || 0);
    if (nuevoValor !== null) {
      const parsed = parseInt(nuevoValor);
      if (!isNaN(parsed) && parsed >= 0) {
        char.manaConsumido = parsed;
        this.render();
      }
    }
  },

  // ─────────────────────────────────────────────
  // PASO 1: Pulsar Lanzar → hacer la tirada primero
  // ─────────────────────────────────────────────
  simularCasteo(hechizoId) {
    const hechizo = this.hechizosDisponibles.find(h => h.id === hechizoId);
    if (!hechizo) return;

    const char = window.AppState.personaje;
    if (!char) return;

    // Hacer la tirada de la escuela arcana PRIMERO
    const skillLvl = char.habilidades[hechizo.escuela] ? char.habilidades[hechizo.escuela].total : 0;
    const tirada = Roller.tirarD100();
    const resultado = Roller.resolver(tirada, skillLvl);
    Roller.registrar(resultado, hechizo.escuela);

    if (!resultado.esExito) {
      // ─── MISSCAST: Fallo ───
      // Gastar ROUNDUP(NF / 2) de maná automáticamente
      const nf = resultado.nf || 0;
      const costeMisscast = Math.ceil(nf / 2);

      char.manaConsumido = (char.manaConsumido || 0) + costeMisscast;

      // Verificar daño crónico por sobrepasar límite seguro con el misscast
      const cronicaHTML = this._procesarDanoCronico(costeMisscast);

      this.render();

      const resultDiv = document.getElementById(`spell-result-${hechizo.id}`);
      resultDiv.style.display = 'block';
      resultDiv.style.borderLeftColor = 'var(--danger)';
      resultDiv.innerHTML = `
        <strong style="color:var(--danger); font-size: 1.2rem;">☠ MISSCAST</strong><br>
        <span style="color:var(--text-secondary)">Tirada: ${String(tirada).padStart(2, '0')} vs ${skillLvl} (NF ${nf})</span><br>
        <span style="color:var(--danger)">Maná perdido: ${costeMisscast} (⌈NF ${nf} / 2⌉)</span><br>
        <span style="font-size:0.85rem; color:var(--text-secondary);">El hechizo falla y la energía arcana se disipa sin control.</span>
        ${cronicaHTML}
      `;
      return;
    }

    // ─── ÉXITO: abrir modal para distribuir PL ───
    const ne = resultado.ne;
    const plDisponible = 1 + ne; // PL = 1 + NE
    this._mostrarModalDistribuirPL(hechizo, tirada, resultado, skillLvl, plDisponible);
  },

  // ─────────────────────────────────────────────
  // PASO 2: Modal para distribuir PL (solo en éxito)
  // ─────────────────────────────────────────────
  _mostrarModalDistribuirPL(hechizo, tirada, resultado, skillLvl, plDisponible) {
    const char = window.AppState.personaje;
    const gf = window.GideonFormulas;
    const voluntad = char.atributos["Voluntad"] || 0;
    const vitalidad = char.atributos["Vitalidad"] || 0;
    const maxMana = char.stats.manaMax;
    const manaConsumido = char.manaConsumido || 0;
    const manaActual = maxMana - manaConsumido;
    const limiteSeguro = gf.calcularLimiteSeguro(voluntad, vitalidad);

    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalFooter = document.getElementById('modal-footer');
    const overlay = document.getElementById('modal-overlay');

    modalTitle.textContent = `✓ Éxito — Distribuir PL: ${hechizo.nombre}`;
    
    modalBody.innerHTML = `
      <!-- Resultado de la tirada -->
      <div style="margin-bottom:1rem; padding:0.75rem; background:rgba(34,197,94,0.1); border:1px solid var(--success); border-radius:8px; text-align:center;">
        <strong style="color:var(--success); font-size:1.1rem;">Tirada: ${String(tirada).padStart(2, '0')} vs ${skillLvl} — NE ${resultado.ne}</strong><br>
        <span style="color:var(--accent-primary-light); font-size:1.3rem; font-weight:bold;">PL Disponible: ${plDisponible}</span>
      </div>

      <!-- Estado de maná -->
      <div style="margin-bottom:1rem; padding:0.75rem; background:rgba(0,0,0,0.3); border-radius:8px; border:1px solid rgba(255,255,255,0.1);">
        <div style="display:flex; justify-content:space-between;">
          <span>Maná disponible:</span>
          <strong style="color:${manaActual <= 0 ? 'var(--danger)' : 'var(--accent-primary-light)'};">${manaActual} / ${maxMana}</strong>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span>Ya consumido:</span>
          <span style="color:${manaConsumido > limiteSeguro ? 'var(--danger)' : 'var(--text-secondary)'};">${manaConsumido} / ${limiteSeguro} (Límite Seguro)</span>
        </div>
      </div>

      <p style="color:var(--text-secondary); margin-bottom: 0.75rem;">Distribuye hasta <strong style="color:var(--accent-primary-light);">${plDisponible} PL</strong> entre los aspectos del hechizo. No puedes exceder el PL disponible.</p>
      <div>
        <label style="display:block; margin-bottom: 0.75rem;">
          <span style="font-weight:bold;">PL para Daño</span> <small style="color:var(--text-secondary);">(mín 1)</small>
          <input type="number" id="pl-dano" class="input-field" value="1" min="1" max="${plDisponible}" style="width: 100%; margin-top:0.25rem;">
        </label>
        <label style="display:block; margin-bottom: 0.75rem;">
          <span style="font-weight:bold;">PL para Área</span>
          <input type="number" id="pl-area" class="input-field" value="0" min="0" max="${plDisponible - 1}" style="width: 100%; margin-top:0.25rem;">
        </label>
        <label style="display:block; margin-bottom: 1rem;">
          <span style="font-weight:bold;">PL para Alcance</span>
          <input type="number" id="pl-alcance" class="input-field" value="0" min="0" max="${plDisponible - 1}" style="width: 100%; margin-top:0.25rem;">
        </label>
        <div id="pl-cost-preview" style="padding:0.75rem; background:rgba(0,0,0,0.3); border:1px solid var(--accent-primary); border-radius:8px; text-align:center;">
          <div id="pl-assigned-display" style="color:var(--accent-primary-light); font-weight:bold; font-size:1rem;">PL asignado: 1 / ${plDisponible}</div>
          <div id="pl-cost-value" style="color:var(--text-secondary); font-size:0.9rem; margin-top:0.25rem;">Coste de Maná: 2</div>
          <div id="pl-cost-warning" style="display:none; font-size:0.85rem; margin-top:0.25rem;"></div>
        </div>
      </div>
    `;

    modalFooter.innerHTML = `
      <button class="btn btn-secondary" onclick="document.getElementById('modal-overlay').style.display='none'">Cancelar</button>
      <button class="btn btn-primary" id="btn-confirmar-pl">🔮 Confirmar y Consumir Maná</button>
    `;

    const closeBtn = document.getElementById('modal-close');
    if (closeBtn) closeBtn.onclick = () => overlay.style.display = 'none';
    overlay.style.display = 'flex';

    const updateCost = () => {
      const pDano = Math.max(1, parseInt(document.getElementById('pl-dano').value) || 1);
      const pArea = Math.max(0, parseInt(document.getElementById('pl-area').value) || 0);
      const pAlcance = Math.max(0, parseInt(document.getElementById('pl-alcance').value) || 0);
      const totalPL = pDano + pArea + pAlcance;
      const cost = 1 + totalPL;

      const assignedEl = document.getElementById('pl-assigned-display');
      const costEl = document.getElementById('pl-cost-value');
      const warningEl = document.getElementById('pl-cost-warning');
      const btnConfirmar = document.getElementById('btn-confirmar-pl');

      assignedEl.textContent = `PL asignado: ${totalPL} / ${plDisponible}`;
      costEl.textContent = `Coste de Maná: ${cost}`;

      // Validar que no exceda PL disponible
      if (totalPL > plDisponible) {
        assignedEl.style.color = 'var(--danger)';
        warningEl.style.display = 'block';
        warningEl.style.color = 'var(--danger)';
        warningEl.textContent = `⚠ Has asignado ${totalPL - plDisponible} PL de más. Máximo: ${plDisponible}.`;
        btnConfirmar.disabled = true;
        btnConfirmar.style.opacity = '0.5';
        return;
      }
      
      assignedEl.style.color = totalPL === plDisponible ? 'var(--success)' : 'var(--accent-primary-light)';
      btnConfirmar.disabled = false;
      btnConfirmar.style.opacity = '1';

      const nuevoConsumido = manaConsumido + cost;
      if (nuevoConsumido > maxMana) {
        warningEl.style.display = 'block';
        warningEl.style.color = 'var(--danger)';
        warningEl.textContent = `⚠ Superarás tu Maná Máximo (${maxMana}). Maná resultante: ${maxMana - nuevoConsumido}`;
      } else if (nuevoConsumido > limiteSeguro) {
        warningEl.style.display = 'block';
        warningEl.style.color = 'var(--portento)';
        const puntosSobre = nuevoConsumido - Math.max(limiteSeguro, manaConsumido);
        warningEl.textContent = `⚠ Superarás el Límite Seguro. ${puntosSobre > 0 ? puntosSobre + ' tirada(s) de Tenacidad.' : ''}`;
      } else {
        warningEl.style.display = 'none';
      }
    };

    document.getElementById('pl-dano').addEventListener('input', updateCost);
    document.getElementById('pl-area').addEventListener('input', updateCost);
    document.getElementById('pl-alcance').addEventListener('input', updateCost);
    updateCost();

    document.getElementById('btn-confirmar-pl').addEventListener('click', () => {
      const pDano = Math.max(1, parseInt(document.getElementById('pl-dano').value) || 1);
      const pArea = Math.max(0, parseInt(document.getElementById('pl-area').value) || 0);
      const pAlcance = Math.max(0, parseInt(document.getElementById('pl-alcance').value) || 0);
      const totalPL = pDano + pArea + pAlcance;

      if (totalPL > plDisponible) return; // Seguridad extra

      const cost = 1 + totalPL;
      overlay.style.display = 'none';
      this._resolverExito(hechizo, tirada, resultado, skillLvl, pDano, pArea, pAlcance, cost);
    });
  },

  // ─────────────────────────────────────────────
  // PASO 3: Resolver éxito — consumir maná y mostrar efectos
  // ─────────────────────────────────────────────
  _resolverExito(hechizo, tirada, resultado, skillLvl, pDano, pArea, pAlcance, cost) {
    const char = window.AppState.personaje;
    const gf = window.GideonFormulas;
    if (!char) return;

    // Consumir maná
    char.manaConsumido = (char.manaConsumido || 0) + cost;

    // Verificar daño crónico
    const cronicaHTML = this._procesarDanoCronico(cost);

    // Re-renderizar UI
    this.render();

    // Calcular efectos
    const voluntad = char.atributos["Voluntad"] || 0;
    const danoGenericoBase = gf.calcularDanoGenerico(1, voluntad);
    const danoTotal = danoGenericoBase * pDano;
    const radio = 2 + (1 * pArea);
    const distancia = 10 + (5 * pAlcance);

    const resultDiv = document.getElementById(`spell-result-${hechizo.id}`);
    resultDiv.style.display = 'block';
    resultDiv.style.borderLeftColor = 'var(--success)';
    resultDiv.innerHTML = `
      <strong style="color:var(--success); font-size: 1.1rem;">✓ Lanzamiento Exitoso</strong><br>
      <span style="color:var(--text-secondary)">Tirada: ${String(tirada).padStart(2, '0')} vs ${skillLvl} (NE ${resultado.ne}) — PL disponible: ${1 + resultado.ne}</span><br>
      <span style="color:var(--text-secondary)">Maná consumido: ${cost} (Daño: ${pDano} PL, Área: ${pArea} PL, Alcance: ${pAlcance} PL)</span><br><br>
      <strong style="color:var(--accent-primary-light);">Efectos del Hechizo:</strong>
      <ul style="margin-top: 0.5rem; padding-left: 1.5rem; color: var(--text-primary);">
        <li><strong>Daño:</strong> ${danoTotal} (PL Daño: ${pDano})</li>
        <li><strong>Área:</strong> Esfera de ${radio} unidades de radio (PL Área: ${pArea})</li>
        <li><strong>Alcance:</strong> ${distancia} unidades (PL Alcance: ${pAlcance})</li>
        <li><strong>Coste:</strong> ${hechizo.coste_acciones} Acciones</li>
      </ul>
      ${cronicaHTML}
    `;
  },

  // ─────────────────────────────────────────────
  // Procesar daño crónico (compartido entre éxito y misscast)
  // ─────────────────────────────────────────────
  _procesarDanoCronico(costGastado) {
    const char = window.AppState.personaje;
    const gf = window.GideonFormulas;
    const voluntad = char.atributos["Voluntad"] || 0;
    const vitalidad = char.atributos["Vitalidad"] || 0;
    const limiteSeguro = gf.calcularLimiteSeguro(voluntad, vitalidad);
    const consumidoDespues = char.manaConsumido || 0;
    const consumidoAntes = consumidoDespues - costGastado;

    let tiradasCronicas = [];
    let danoCronicoGanado = 0;

    if (consumidoDespues > limiteSeguro) {
      const puntoInicio = Math.max(limiteSeguro, consumidoAntes);
      const puntosARiesgo = consumidoDespues - puntoInicio;

      for (let i = 0; i < puntosARiesgo; i++) {
        const tenacidadVal = char.habilidades["Tenacidad"] ? char.habilidades["Tenacidad"].total : voluntad;
        const tiradaTenacidad = Roller.tirarD100();
        const resTenacidad = Roller.resolver(tiradaTenacidad, tenacidadVal);
        
        if (!resTenacidad.esExito) {
          danoCronicoGanado++;
          tiradasCronicas.push({ tirada: tiradaTenacidad, objetivo: tenacidadVal, exito: false, nf: resTenacidad.nf });
        } else {
          tiradasCronicas.push({ tirada: tiradaTenacidad, objetivo: tenacidadVal, exito: true, ne: resTenacidad.ne });
        }
      }

      if (danoCronicoGanado > 0) {
        char.danoCronico = (char.danoCronico || 0) + danoCronicoGanado;
        GideonCharacter.recalcularDerivados(char);
      }
    }

    if (tiradasCronicas.length === 0) return '';

    return `
      <div style="margin-top:0.75rem; padding:0.75rem; background:rgba(147,51,234,0.1); border:1px solid var(--pifia); border-radius:8px;">
        <strong style="color:var(--pifia);">⚠ Tiradas de Tenacidad (Sobre Límite Seguro)</strong><br>
        ${tiradasCronicas.map((t, i) => {
          const icon = t.exito ? '✓' : '✗';
          const color = t.exito ? 'var(--success)' : 'var(--danger)';
          const detail = t.exito ? `NE ${t.ne}` : `NF ${t.nf} → +1 Daño Crónico`;
          return `<span style="color:${color}; font-size:0.85rem;">${icon} Tirada ${i + 1}: ${String(t.tirada).padStart(2, '0')} vs ${t.objetivo} — ${detail}</span><br>`;
        }).join('')}
        ${danoCronicoGanado > 0
          ? `<strong style="color:var(--danger); margin-top:0.5rem; display:block;">💀 Daño Crónico ganado: +${danoCronicoGanado} (Total: ${char.danoCronico}). Maná Máx reducido a ${char.stats.manaMax}</strong>`
          : `<span style="color:var(--success);">Todas las tiradas superadas. Sin daño crónico adicional.</span>`
        }
      </div>
    `;
  }
};

window.SpellsManager = SpellsManager;

// Inicializar cuando cargue DOM
document.addEventListener('DOMContentLoaded', () => {
  SpellsManager.init();
});
