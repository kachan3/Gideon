import {markup} from './rulebook.js';
const esc = value => String(value ?? '').replace(/[&<>"']/g,
  c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'})[c]);

function choiceField(question, selected) {
  const options = question.opciones.map(option =>
    `<option value="${option.id}" ${option.id === selected ? 'selected' : ''}>${esc(option.nombre)}</option>`
  ).join('');
  return `<label>${esc(question.texto)}
    <select name="respuesta_senda_${question.id}" required><option value="">Seleccionar…</option>${options}</select>
  </label><p class="description" data-path-choice-description="${question.id}">${esc(question.opciones.find(o=>o.id===selected)?.descripcion??'')}</p>`;
}

export function bindPathChoices(root,catalog,draft){
 for(const question of (catalog.preguntas_senda??[]).filter(q=>q.clase_id===draft.clase_id&&q.es_insignia)){
  const select=root.querySelector(`[name="respuesta_senda_${question.id}"]`);if(!select)continue;
  select.onchange=()=>{
   const option=question.opciones.find(o=>String(o.id)===select.value);
   if(option)(draft.elecciones_senda??={})[question.id]=option.id;else if(draft.elecciones_senda)delete draft.elecciones_senda[question.id];
   root.querySelector(`[data-path-choice-description="${question.id}"]`).textContent=option?.descripcion??'';
  };
 }
}

export function creationPathChoices(catalog, draft, {review = false} = {}) {
  const questions = (catalog.preguntas_senda ?? []).filter(q => q.clase_id === draft.clase_id && q.es_insignia);
  return questions.map(question => {
    const selected = draft.elecciones_senda?.[question.id];
    if (!review) return choiceField(question, selected);
    const option = question.opciones.find(o => o.id === selected);
    return option ? `<p><strong>${esc(option.nombre)}</strong> · ${esc(option.descripcion)}</p>` : '';
  }).join('');
}

export const isManifestation = action => ['Intervención', 'Milagro'].includes(action.tipo);

export function devotionSheet(character) {
  const questions = character.elecciones_senda ?? [];
  const prayers = character.plegarias ?? [];
  const actions = character.acciones.filter(isManifestation);
  if (!questions.length && !prayers.length && !actions.length) return '';
  const choices = questions.map(question => {
    const option = question.opciones.find(o => o.id === question.opcion_id);
    if (option) return `<p><strong>${esc(option.nombre)}</strong> · ${esc(option.descripcion)}</p>`;
    return `<form class="stack" data-senda-choice="${question.id}">
      ${choiceField(question)}<button type="submit">Guardar elección</button>
    </form>`;
  }).join('');
  const prayerList = prayers.map(p => `<details class="list-item">
    <summary>${esc(p.nombre)}</summary>
    <p>${esc(p.activacion)} Tirada de ${esc(p.tirada)}. ${esc(p.duracion)}</p>
    <p class="description">${esc(p.descripcion)}</p><small>${esc(p.fuentes.join(', '))}</small>
  </details>`).join('');
  const actionList = type => actions.filter(a => a.tipo === type).map(a => {
    const timing = a.es_reaccion
      ? (a.nro_acciones_pa ? `${a.nro_acciones_pa} PA o reacción` : 'Reacción')
      : `${a.nro_acciones_pa} PA`;
    const costs = [timing, a.coste_mana ? `${a.coste_mana} PM` : '', a.coste_omen ? `${a.coste_omen} Omen` : ''].filter(Boolean);
    return `<details class="list-item"><summary>${esc(a.nombre)} · ${esc(costs.join(' · '))}</summary>
      <div class="player-description">${markup({id:'accion-'+a.id,texto:a.descripcion})}</div><small>${esc(a.fuentes.join(', '))}</small>
    </details>`;
  }).join('');
  return `<section class="panel"><h2>Devoción</h2>${choices}
    ${prayers.length || actions.length ? '<p class="hint">Resuelve estas capacidades y sus costes en la mesa.</p>' : ''}
    ${prayerList ? `<h3>Plegarias</h3>${prayerList}` : ''}
    ${actions.some(a => a.tipo === 'Intervención') ? `<h3>Intervenciones</h3>${actionList('Intervención')}` : ''}
    ${actions.some(a => a.tipo === 'Milagro') ? `<h3>Milagros</h3>${actionList('Milagro')}` : ''}
  </section>`;
}
