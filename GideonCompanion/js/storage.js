// storage.js — Persistencia de personajes en JSON (localStorage + export/import)
// Almacena múltiples personajes indexados por nombre+id

const CharStorage = {
  STORAGE_KEY: 'gideon_personajes',

  // ─────────────────────────────────────────────
  // Listar todos los personajes guardados
  // ─────────────────────────────────────────────
  listar() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Error leyendo personajes de localStorage:', e);
      return [];
    }
  },

  // ─────────────────────────────────────────────
  // Guardar personaje (crea o actualiza por id)
  // ─────────────────────────────────────────────
  guardar(personaje) {
    if (!personaje) return false;
    
    // Asegurar que tiene un id único
    if (!personaje._storageId) {
      personaje._storageId = 'pj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    }
    personaje._ultimaModificacion = new Date().toISOString();

    const lista = this.listar();
    const idx = lista.findIndex(p => p._storageId === personaje._storageId);

    if (idx >= 0) {
      lista[idx] = personaje;
    } else {
      lista.push(personaje);
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lista));
      return true;
    } catch (e) {
      console.error('Error guardando personaje:', e);
      return false;
    }
  },

  // ─────────────────────────────────────────────
  // Cargar un personaje por id
  // ─────────────────────────────────────────────
  cargar(storageId) {
    const lista = this.listar();
    const found = lista.find(p => p._storageId === storageId);
    if (!found) return null;

    // Recalcular derivados al cargar
    if (window.GideonCharacter && found.linaje) {
      window.GideonCharacter.recalcularDerivados(found);
    }
    return found;
  },

  // ─────────────────────────────────────────────
  // Eliminar un personaje por id
  // ─────────────────────────────────────────────
  eliminar(storageId) {
    let lista = this.listar();
    lista = lista.filter(p => p._storageId !== storageId);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lista));
      return true;
    } catch (e) {
      console.error('Error eliminando personaje:', e);
      return false;
    }
  },

  // ─────────────────────────────────────────────
  // Exportar todos los personajes como JSON (descarga)
  // ─────────────────────────────────────────────
  exportarTodosJSON() {
    const lista = this.listar();
    if (lista.length === 0) {
      if (window.App) window.App.mostrarToast('No hay personajes guardados para exportar', 'warning');
      return;
    }

    const json = JSON.stringify(lista, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gideon_personajes_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // ─────────────────────────────────────────────
  // Exportar UN personaje como JSON (descarga)
  // ─────────────────────────────────────────────
  exportarPersonajeJSON(personaje) {
    if (!personaje) return;

    const json = JSON.stringify(personaje, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const nombre = personaje.nombre ? personaje.nombre.replace(/\s+/g, '_').toLowerCase() : 'personaje';
    a.href = url;
    a.download = `${nombre}_gideon.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // ─────────────────────────────────────────────
  // Importar personajes desde archivo JSON
  // ─────────────────────────────────────────────
  importarDesdeJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          let importados = 0;

          if (Array.isArray(data)) {
            // Es un array de personajes (backup completo)
            data.forEach(pj => {
              // Re-generar id para evitar colisiones
              pj._storageId = 'pj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
              this.guardar(pj);
              importados++;
            });
          } else if (typeof data === 'object' && data !== null) {
            // Es un solo personaje
            data._storageId = 'pj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
            this.guardar(data);
            importados = 1;
          } else {
            throw new Error('Formato JSON no reconocido');
          }

          resolve(importados);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Error leyendo archivo'));
      reader.readAsText(file);
    });
  },

  // ─────────────────────────────────────────────
  // Mostrar modal de gestión de personajes
  // ─────────────────────────────────────────────
  mostrarGestor() {
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalFooter = document.getElementById('modal-footer');
    const overlay = document.getElementById('modal-overlay');

    modalTitle.textContent = '📂 Gestión de Personajes';

    const lista = this.listar();

    let listaHTML = '';
    if (lista.length === 0) {
      listaHTML = '<p style="color:var(--text-secondary); text-align:center;">No hay personajes guardados.</p>';
    } else {
      listaHTML = lista.map(pj => {
        const nombre = pj.nombre || 'Sin Nombre';
        const linaje = pj.linaje?.nombre || '—';
        const senda = pj.senda?.nombre || '—';
        const fecha = pj._ultimaModificacion
          ? new Date(pj._ultimaModificacion).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
          : '—';

        return `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem; border-bottom:1px solid rgba(255,255,255,0.1);">
            <div>
              <strong style="color:var(--accent-primary-light);">${nombre}</strong><br>
              <small style="color:var(--text-secondary);">${linaje} · ${senda} · ${fecha}</small>
            </div>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn btn-primary btn-sm" onclick="CharStorage._cargarDesdeGestor('${pj._storageId}')">Cargar</button>
              <button class="btn btn-secondary btn-sm" onclick="CharStorage.exportarPersonajeJSON(CharStorage.cargar('${pj._storageId}'))">📥 JSON</button>
              <button class="btn btn-danger btn-sm" onclick="CharStorage._eliminarDesdeGestor('${pj._storageId}')">🗑</button>
            </div>
          </div>
        `;
      }).join('');
    }

    modalBody.innerHTML = `
      <div style="max-height:400px; overflow-y:auto; margin-bottom:1rem;">
        ${listaHTML}
      </div>
      <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:1rem;">
        <p style="font-weight:bold; margin-bottom:0.5rem;">Importar desde JSON:</p>
        <input type="file" id="json-import-file" accept=".json" class="input-field" style="width:100%;">
      </div>
    `;

    modalFooter.innerHTML = `
      <button class="btn btn-secondary" onclick="CharStorage.exportarTodosJSON()">📥 Exportar Todo</button>
      <button class="btn btn-secondary" onclick="document.getElementById('modal-overlay').style.display='none'">Cerrar</button>
    `;

    // Cerrar
    const closeBtn = document.getElementById('modal-close');
    if (closeBtn) closeBtn.onclick = () => overlay.style.display = 'none';

    overlay.style.display = 'flex';

    // Bind importar JSON
    document.getElementById('json-import-file')?.addEventListener('change', async (e) => {
      if (e.target.files.length > 0) {
        try {
          const count = await this.importarDesdeJSON(e.target.files[0]);
          if (window.App) window.App.mostrarToast(`${count} personaje(s) importado(s) desde JSON`, 'success');
          this.mostrarGestor(); // Re-renderizar
        } catch (err) {
          console.error(err);
          if (window.App) window.App.mostrarToast('Error importando JSON', 'error');
        }
      }
    });
  },

  // ─────────────────────────────────────────────
  // Acciones internas del gestor
  // ─────────────────────────────────────────────
  _cargarDesdeGestor(storageId) {
    const pj = this.cargar(storageId);
    if (pj) {
      document.getElementById('modal-overlay').style.display = 'none';
      if (window.App) {
        window.App.onPersonajeCargado(pj);
        window.App.mostrarToast(`Personaje ${pj.nombre || ''} cargado`, 'success');
      }
    }
  },

  _eliminarDesdeGestor(storageId) {
    if (confirm('¿Eliminar este personaje permanentemente?')) {
      this.eliminar(storageId);
      if (window.App) window.App.mostrarToast('Personaje eliminado', 'info');
      this.mostrarGestor(); // Re-renderizar
    }
  }
};

window.CharStorage = CharStorage;
