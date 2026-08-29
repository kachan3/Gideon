// xml-io.js — Exportación e importación de personajes a XML

const XmlIO = {
  // Exportar el objeto personaje a un archivo XML y descargarlo
  exportarPersonaje(char) {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<personaje version="1.0">\n`;
    
    xml += `  <nombre>${this.escapar(char.nombre)}</nombre>\n`;
    xml += `  <modo_campana>${this.escapar(char.modoCampana)}</modo_campana>\n`;
    
    if (char.linaje) {
      xml += `  <linaje id="${this.escapar(char.linaje.id)}">\n`;
      xml += `    <nombre>${this.escapar(char.linaje.nombre)}</nombre>\n`;
      xml += `    <escalado_vital>${char.linaje.escalado_vital || 0}</escalado_vital>\n`;
      xml += `  </linaje>\n`;
    }
    
    if (char.senda) {
      xml += `  <senda id="${this.escapar(char.senda.id)}">\n`;
      xml += `    <nombre>${this.escapar(char.senda.nombre)}</nombre>\n`;
      xml += `  </senda>\n`;
    }
    
    if (char.dedicacion) {
      xml += `  <dedicacion id="${this.escapar(char.dedicacion.id)}">\n`;
      xml += `    <nombre>${this.escapar(char.dedicacion.nombre)}</nombre>\n`;
      xml += `  </dedicacion>\n`;
    }
    
    if (char.nacimiento) {
      xml += `  <nacimiento id="${this.escapar(char.nacimiento.id)}" tirada="${char.nacimiento.tirada}">\n`;
      xml += `    <nombre>${this.escapar(char.nacimiento.nombre)}</nombre>\n`;
      xml += `  </nacimiento>\n`;
    }
    
    if (char.regalo) {
      xml += `  <regalo id="${this.escapar(char.regalo.id)}">\n`;
      xml += `    <nombre>${this.escapar(char.regalo.nombre)}</nombre>\n`;
      xml += `  </regalo>\n`;
    } else {
      xml += `  <regalo/>\n`;
    }
    
    if (char.perjuicio) {
      xml += `  <perjuicio id="${this.escapar(char.perjuicio.id)}">\n`;
      xml += `    <nombre>${this.escapar(char.perjuicio.nombre)}</nombre>\n`;
      xml += `  </perjuicio>\n`;
    } else {
      xml += `  <perjuicio/>\n`;
    }
    
    // Atributos
    xml += `  <atributos>\n`;
    for (const [attr, valor] of Object.entries(char.atributos)) {
      xml += `    <atributo nombre="${this.escapar(attr)}" valor="${valor}"/>\n`;
    }
    xml += `  </atributos>\n`;
    
    // Habilidades
    xml += `  <habilidades>\n`;
    const arbol = window.GideonCharacter ? window.GideonCharacter.getSkillTree() : {};
    for (const [hab, datos] of Object.entries(char.habilidades)) {
      let atributoPadre = "";
      for (const [attr, habilidades] of Object.entries(arbol)) {
        if (habilidades.includes(hab)) {
          atributoPadre = attr;
          break;
        }
      }
      xml += `    <habilidad nombre="${this.escapar(hab)}" atributo="${this.escapar(atributoPadre)}" base="${datos.base}" modificacion="${datos.modificacion}" total="${datos.total}"/>\n`;
    }
    xml += `  </habilidades>\n`;
    
    // Especializaciones
    xml += `  <especializaciones>\n`;
    if (char.especializaciones) {
      char.especializaciones.forEach(esp => {
        xml += `    <especializacion nombre="${this.escapar(esp.nombre)}" bono="${esp.bono}"/>\n`;
      });
    }
    xml += `  </especializaciones>\n`;
    
    // Stats
    xml += `  <stats>\n`;
    xml += `    <xp_total>${char.xpTotal}</xp_total>\n`;
    xml += `    <xp_gastada>${char.xpGastada}</xp_gastada>\n`;
    xml += `    <omen>${char.omen}</omen>\n`;
    xml += `    <heridas_graves>${char.heridasGraves}</heridas_graves>\n`;
    xml += `    <heridas_mortales>${char.heridasMortales}</heridas_mortales>\n`;
    xml += `    <dano_cronico>${char.danoCronico}</dano_cronico>\n`;
    xml += `    <mana_consumido>${char.manaConsumido}</mana_consumido>\n`;
    xml += `  </stats>\n`;
    
    xml += `  <notas>${this.escapar(char.notas)}</notas>\n`;
    
    xml += `</personaje>`;
    
    // Descargar
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const filename = char.nombre ? `${char.nombre.replace(/\\s+/g, '_').toLowerCase()}_gideon.xml` : 'personaje_gideon.xml';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  
  // Importar desde archivo
  importarPersonaje(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(e.target.result, "text/xml");
          
          if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
            throw new Error("Error en el formato XML");
          }
          
          const char = window.GideonCharacter ? window.GideonCharacter.crearNuevo() : {};
          
          const getVal = (tag) => {
            const el = xmlDoc.getElementsByTagName(tag)[0];
            return el ? el.textContent : null;
          };
          
          char.nombre = getVal("nombre") || "";
          char.modoCampana = getVal("modo_campana") || "enclave";
          
          const linaje = xmlDoc.getElementsByTagName("linaje")[0];
          if (linaje && linaje.getAttribute("id")) {
            char.linaje = {
              id: linaje.getAttribute("id"),
              nombre: linaje.getElementsByTagName("nombre")[0]?.textContent || "",
              escalado_vital: parseInt(linaje.getElementsByTagName("escalado_vital")[0]?.textContent || 0)
            };
          }
          
          const senda = xmlDoc.getElementsByTagName("senda")[0];
          if (senda && senda.getAttribute("id")) {
            char.senda = {
              id: senda.getAttribute("id"),
              nombre: senda.getElementsByTagName("nombre")[0]?.textContent || ""
            };
          }

          const dedicacion = xmlDoc.getElementsByTagName("dedicacion")[0];
          if (dedicacion && dedicacion.getAttribute("id")) {
            char.dedicacion = {
              id: dedicacion.getAttribute("id"),
              nombre: dedicacion.getElementsByTagName("nombre")[0]?.textContent || ""
            };
          }

          const nacimiento = xmlDoc.getElementsByTagName("nacimiento")[0];
          if (nacimiento && nacimiento.getAttribute("id")) {
            char.nacimiento = {
              id: nacimiento.getAttribute("id"),
              tirada: parseInt(nacimiento.getAttribute("tirada") || 0),
              nombre: nacimiento.getElementsByTagName("nombre")[0]?.textContent || ""
            };
          }
          
          const regalo = xmlDoc.getElementsByTagName("regalo")[0];
          if (regalo && regalo.getAttribute("id")) {
            char.regalo = {
              id: regalo.getAttribute("id"),
              nombre: regalo.getElementsByTagName("nombre")[0]?.textContent || ""
            };
          }

          const perjuicio = xmlDoc.getElementsByTagName("perjuicio")[0];
          if (perjuicio && perjuicio.getAttribute("id")) {
            char.perjuicio = {
              id: perjuicio.getAttribute("id"),
              nombre: perjuicio.getElementsByTagName("nombre")[0]?.textContent || ""
            };
          }

          const atributos = xmlDoc.getElementsByTagName("atributo");
          for (let i = 0; i < atributos.length; i++) {
            const attr = atributos[i];
            char.atributos[attr.getAttribute("nombre")] = parseInt(attr.getAttribute("valor") || 0);
          }
          
          const habilidades = xmlDoc.getElementsByTagName("habilidad");
          for (let i = 0; i < habilidades.length; i++) {
            const hab = habilidades[i];
            char.habilidades[hab.getAttribute("nombre")] = {
              base: parseInt(hab.getAttribute("base") || 0),
              modificacion: parseInt(hab.getAttribute("modificacion") || 0),
              total: parseInt(hab.getAttribute("total") || 0)
            };
          }
          
          const especializaciones = xmlDoc.getElementsByTagName("especializacion");
          for (let i = 0; i < especializaciones.length; i++) {
            const esp = especializaciones[i];
            char.especializaciones.push({
              nombre: esp.getAttribute("nombre"),
              bono: parseInt(esp.getAttribute("bono") || 0)
            });
          }
          
          const stats = xmlDoc.getElementsByTagName("stats")[0];
          if (stats) {
            char.xpTotal = parseInt(stats.getElementsByTagName("xp_total")[0]?.textContent || 1);
            char.xpGastada = parseInt(stats.getElementsByTagName("xp_gastada")[0]?.textContent || 0);
            char.omen = parseInt(stats.getElementsByTagName("omen")[0]?.textContent || 0);
            char.heridasGraves = parseInt(stats.getElementsByTagName("heridas_graves")[0]?.textContent || 0);
            char.heridasMortales = parseInt(stats.getElementsByTagName("heridas_mortales")[0]?.textContent || 0);
            char.danoCronico = parseInt(stats.getElementsByTagName("dano_cronico")[0]?.textContent || 0);
            char.manaConsumido = parseInt(stats.getElementsByTagName("mana_consumido")[0]?.textContent || 0);
          }
          
          char.notas = getVal("notas") || "";
          
          if (window.GideonCharacter) {
            window.GideonCharacter.recalcularDerivados(char);
          }
          
          resolve(char);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("Error leyendo el archivo"));
      reader.readAsText(file);
    });
  },
  
  escapar(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
};

window.XmlIO = XmlIO;
