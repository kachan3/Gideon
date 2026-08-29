// content-loader.js — Carga contenido XML desde las carpetas de contenido

const ContentLoader = {
  basePath: './content',
  cache: {},
  
  // Listas de archivos conocidas
  archivosLinajes: [
    'hijos_del_viento', 'seres_del_rio', 'hijos_de_las_estrellas', 
    'hijos_del_bosque', 'hijos_de_la_luna', 'hijos_del_hielo', 
    'hijos_de_la_tierra', 'hijos_del_sol'
  ],
  
  archivosSendas: [
    'valor', 'honor', 'berserker', 'elementalista', 'hierofante', 
    'arcanista', 'sombra', 'heraldo', 'cazador', 'monje'
  ],
  
  archivosDedicaciones: [
    'soldado', 'medico', 'granjero', 'artesano', 'marinero', 
    'mercader', 'academico', 'banderizo', 'mercenario'
  ],

  async fetchXML(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const xmlString = await response.text();
      return this.parsearXML(xmlString);
    } catch (e) {
      console.error(`Error cargando XML de ${url}:`, e);
      return null;
    }
  },

  async cargarListaDirectorio(carpeta, lista) {
    const promesas = lista.map(archivo => this.fetchXML(`${this.basePath}/${carpeta}/${archivo}.xml`));
    const resultados = await Promise.all(promesas);
    return resultados.filter(res => res !== null); // Filtrar fallos
  },

  async cargarLinajes() {
    return this.cargarListaDirectorio('Linajes', this.archivosLinajes);
  },
  
  async cargarSendas() {
    return this.cargarListaDirectorio('Sendas', this.archivosSendas);
  },
  
  async cargarDedicaciones() {
    return this.cargarListaDirectorio('Dedicaciones', this.archivosDedicaciones);
  },
  
  async cargarNacimientos() {
    return this.fetchXML(`${this.basePath}/Origenes/nacimientos.xml`);
  },
  
  async cargarRegalos() {
    return this.fetchXML(`${this.basePath}/Regalos/regalos.xml`);
  },
  
  async cargarPerjuicios() {
    return this.fetchXML(`${this.basePath}/Perjuicios/perjuicios.xml`);
  },
  
  async cargarArmas() {
    return this.fetchXML(`${this.basePath}/Items/armas.xml`);
  },
  
  async cargarArmaduras() {
    return this.fetchXML(`${this.basePath}/Items/armaduras.xml`);
  },
  
  async cargarEpifanias() {
    return this.fetchXML(`${this.basePath}/Epifanias/placeholder.xml`);
  },
  
  async cargarDotes() {
    return this.fetchXML(`${this.basePath}/Dotes/dotes.xml`);
  },
  
  async cargarTodo() {
    const [linajes, sendas, dedicaciones, nacimientos, regalos, perjuicios, armas, armaduras] = 
      await Promise.all([
        this.cargarLinajes(),
        this.cargarSendas(),
        this.cargarDedicaciones(),
        this.cargarNacimientos(),
        this.cargarRegalos(),
        this.cargarPerjuicios(),
        this.cargarArmas(),
        this.cargarArmaduras()
      ]);
      
    return { linajes, sendas, dedicaciones, nacimientos, regalos, perjuicios, armas, armaduras };
  },
  
  // Parsear XML a objeto JS
  parsearXML(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    return this.xmlToObject(xmlDoc.documentElement);
  },
  
  xmlToObject(node) {
    let obj = {};
    if (node.attributes.length > 0) {
      for (let j = 0; j < node.attributes.length; j++) {
        const attribute = node.attributes.item(j);
        obj[attribute.nodeName] = attribute.nodeValue;
      }
    }
    
    if (node.childNodes.length > 0) {
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes.item(i);
        if (child.nodeType === 1) { // Element node
          const childObj = this.xmlToObject(child);
          if (obj[child.nodeName]) {
            if (!Array.isArray(obj[child.nodeName])) {
              obj[child.nodeName] = [obj[child.nodeName]];
            }
            obj[child.nodeName].push(childObj);
          } else {
            obj[child.nodeName] = childObj;
          }
        } else if (child.nodeType === 3) { // Text node
          const text = child.nodeValue.trim();
          if (text) {
            if (Object.keys(obj).length === 0) {
              return text;
            } else {
              obj['#text'] = text;
            }
          }
        }
      }
    }
    return obj;
  }
};

window.ContentLoader = ContentLoader;
