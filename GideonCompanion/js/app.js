// app.js — Router SPA e inicialización de Gideon Companion

// Estado Global de la App
window.AppState = {
  personaje: null,
  contenido: null,
  vistaActual: 'wizard'
};

const App = {
  // ─────────────────────────────────────────────
  // Inicialización
  // ─────────────────────────────────────────────
  async init() {
    this._bindEvents();
    
    try {
      // 1. Mostrar pantalla de carga
      this._mostrarCarga(true);
      
      // 2. Cargar todo el contenido XML
      const contenido = await ContentLoader.cargarTodo();
      window.AppState.contenido = contenido;
      
      // 3. Inicializar módulos
      window.Wizard.init(contenido);
      window.Roller.init();
      window.Viewer.init();
      
      // 4. Configurar I/O
      // 4. Configurar I/O (no requiere inicialización)
      
      // 5. Ocultar pantalla de carga
      this._mostrarCarga(false);
      
      // 6. Mostrar vista inicial (Wizard)
      this.cambiarVista('wizard');
      
    } catch (error) {
      console.error("Error inicializando la app:", error);
      this._mostrarCarga(false);
      this.mostrarToast("Error al cargar contenido XML. Verifica la consola.", "error");
    }
  },

  // ─────────────────────────────────────────────
  // Bind de eventos globales (Navegación, I/O)
  // ─────────────────────────────────────────────
  _bindEvents() {
    // Tabs de navegación
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const vista = e.currentTarget.dataset.view;
        this.cambiarVista(vista);
      });
    });

    // Import/Export
    const btnImport = document.getElementById('btn-import');
    const fileImport = document.getElementById('file-import');
    const btnExport = document.getElementById('btn-export');

    if (btnImport && fileImport) {
      btnImport.addEventListener('click', () => fileImport.click());
      fileImport.addEventListener('change', async (e) => {
        if (e.target.files.length > 0) {
          try {
            const char = await window.XmlIO.importarPersonaje(e.target.files[0]);
            this.onPersonajeCargado(char);
            this.mostrarToast(`Personaje ${char.nombre || ''} importado correctamente`, 'success');
          } catch (error) {
            console.error(error);
            this.mostrarToast("Error al importar personaje. XML inválido.", "error");
          }
          // Resetear input file para permitir seleccionar el mismo archivo de nuevo
          fileImport.value = '';
        }
      });
    }

    if (btnExport) {
      btnExport.addEventListener('click', () => {
        if (window.AppState.personaje) {
          window.XmlIO.exportarPersonaje(window.AppState.personaje);
        } else {
          this.mostrarToast("No hay personaje activo para exportar", "warning");
        }
      });
    }

    // Guardar personaje actual a localStorage/JSON
    const btnGuardar = document.getElementById('btn-guardar');
    if (btnGuardar) {
      btnGuardar.addEventListener('click', () => {
        if (window.AppState.personaje) {
          const ok = window.CharStorage.guardar(window.AppState.personaje);
          if (ok) {
            this.mostrarToast(`Personaje ${window.AppState.personaje.nombre || ''} guardado`, 'success');
          } else {
            this.mostrarToast('Error al guardar personaje', 'error');
          }
        } else {
          this.mostrarToast('No hay personaje activo para guardar', 'warning');
        }
      });
    }

    // Abrir gestor de personajes
    const btnGestionar = document.getElementById('btn-gestionar');
    if (btnGestionar) {
      btnGestionar.addEventListener('click', () => {
        if (window.CharStorage) window.CharStorage.mostrarGestor();
      });
    }
  },

  // ─────────────────────────────────────────────
  // Cambio de Vistas (SPA Router)
  // ─────────────────────────────────────────────
  cambiarVista(vista) {
    if (!['wizard', 'viewer', 'roller', 'spells'].includes(vista)) return;

    window.AppState.vistaActual = vista;

    // Actualizar tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.view === vista);
    });

    // Actualizar vistas
    document.querySelectorAll('.view').forEach(v => {
      v.classList.toggle('active', v.id === `view-${vista}`);
    });

    // Acciones específicas al entrar a una vista
    if (vista === 'viewer') {
      window.Viewer.actualizar();
    } else if (vista === 'roller') {
      window.Roller.actualizar();
    } else if (vista === 'spells') {
      if (window.SpellsManager) window.SpellsManager.render();
    }
  },

  // ─────────────────────────────────────────────
  // Callbacks de estado
  // ─────────────────────────────────────────────
  onPersonajeCreado(personaje) {
    this.mostrarToast(`¡Personaje ${personaje.nombre} creado!`, 'success');
    this.cambiarVista('viewer');
  },

  onPersonajeCargado(personaje) {
    window.AppState.personaje = personaje;
    // Si el wizard estaba a medias, lo limpiamos y volvemos al inicio
    if (window.Wizard) window.Wizard.reiniciar();
    this.cambiarVista('viewer');
  },

  // ─────────────────────────────────────────────
  // UI Helpers (Loading, Toasts)
  // ─────────────────────────────────────────────
  _mostrarCarga(mostrar) {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.style.display = mostrar ? 'flex' : 'none';
    }
  },

  mostrarToast(mensaje, tipo = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo} fade-in`;
    toast.innerHTML = `
      <div class="toast-icon">${tipo === 'success' ? '✓' : tipo === 'error' ? '✗' : tipo === 'warning' ? '⚠' : 'ℹ'}</div>
      <div class="toast-message">${mensaje}</div>
    `;

    container.appendChild(toast);

    // Animación de entrada
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto eliminar
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

window.App = App;

// Bootstrap al cargar DOM
document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
