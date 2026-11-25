// Internal tokens are output only; old automatically annotated text is stripped.
export const referencePattern = /\u27e6([a-z0-9-]+)\u00a6([^\u27e6\u27e7\n]+)\u27e7/g;
export const unmark = text => text.replace(/\u27e6[a-z0-9-]+(?:\+[a-z0-9-]+)*\u00a6([^\u27e6\u27e7\n]+)\u27e7/g, (_, label) => label);
export const explicitReferencePattern = /\[\[([^\[\]|\n]+)(?:\|([^\[\]\n]+))?\]\]/g;
export const normalizeName = text => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
export const referenceLabel = text => text.replace(explicitReferencePattern, (_, target, label) => label ?? target);
// A pipe within a reference is not a Markdown table separator.
export const splitReferenceCells = line => line.split(/\|(?!(?:[^\[\]]*)\]\])/);

export function referenceMatcher(aliases, report = () => {}) {
  const terms = new Map(), ids = new Set(aliases.map(a => a.regla_id));
  for (const {alias, regla_id} of aliases) {
    const key = normalizeName(alias);
    if (!terms.has(key)) terms.set(key, new Set());
    terms.get(key).add(regla_id);
  }
  return text => unmark(text).replace(explicitReferencePattern, (token, target, label) => {
    const key = target.trim();
    const options = ids.has(key) ? [key] : [...(terms.get(normalizeName(key)) ?? [])];
    if (options.length !== 1) {
      report({target:key, reason:options.length ? 'ambiguous' : 'missing', candidates:options});
      return token;
    }
    return '\u27e6' + options[0] + '\u00a6' + (label ?? target) + '\u27e7';
  });
}
