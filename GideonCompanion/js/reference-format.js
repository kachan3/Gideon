// The display label is verbatim. IDs contain only ASCII letters, digits and hyphens.
export const referencePattern = /⟦([a-z0-9-]+(?:\+[a-z0-9-]+)*)¦([^⟦⟧\n]+)⟧/g;
export const unmark = text => text.replace(referencePattern, (_, id, label) => label);
export const normalizeName = text => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
const quote = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function referenceMatcher(aliases) {
  const terms = new Map();
  for (const {alias, regla_id} of aliases) {
    const key = alias.toLowerCase();
    if (!terms.has(key)) terms.set(key, new Set());
    terms.get(key).add(regla_id);
  }
  const alternatives = [...terms.keys()].sort((a,b) => b.length - a.length).map(quote);
  const words = new RegExp('(?<![\\p{L}\\p{N}_])(' + alternatives.join('|') + ')(?![\\p{L}\\p{N}_])', 'giu');
  return (text, self = '', context = '') => {
    if (!alternatives.length) return text;
    const decorate = part => part.replace(words, (label, _, index) => {
      const ids = [...terms.get(label.toLowerCase())];
      const before = normalizeName(part.slice(Math.max(0,index-38),index));
      let type;
      if (/\b(shape|configuracion)$/.test(before)) type = 'shape';
      else if (/\b(medio|medio de ataque)$/.test(before)) type = 'medio';
      else if (/\b(herramienta|herramienta de lanzador)$/.test(before)) type = 'herramienta';
      else if (/\b(arma|armas)$/.test(before)) type = 'arma';
      else if (/\b(estado|queda|quedas|quedo|sufre|nivel de)$/.test(before)) type = 'estado';
      else if (/\b(tirada de|habilidad de)$/.test(before)) type = 'habilidad';
      else if (/\b(efecto|efecto de)$/.test(before)) type = 'efecto';
      const preferred = kind => ids.find(id => kind && id.startsWith(kind + '-'));
      const id = ids.length === 1 ? ids[0] : preferred(type) || preferred(context) || preferred('dificultad') || ids.filter(id=>id!==self).sort().join('+');
      return id && id !== self ? '⟦' + id + '¦' + label + '⟧' : label;
    });
    if(!text.includes('⟦')) return decorate(text);
    return text.split(/(⟦[^⟦⟧\n]+⟧)/).map(part=>part.startsWith('⟦')?part:decorate(part)).join('');
  };
}
