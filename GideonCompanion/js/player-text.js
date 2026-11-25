// Publishing projection only. The original Markdown remains unchanged.
const internalHeading=/descartad|cuarentena|pendientes?|filosof[ií]a|cosmolog|historial|ejes de auto|anti-cheese|problema del (?:abogado|juramento)|opciones de grados superiores|art[eé]factos pendientes|dotes cl[aá]sicos|dotes de escalado/i;
const editorial=/m[oó]dulo (?:can[oó]nico|extra[ií]do|del core)|nota de (?:gesti[oó]n|lore)|aviso de fuente|trasladado sin modificar|contenido sin modificar|creado el \d|fuentes? (?:originales?|hist[oó]ricas?)|recopilad[oa]|este documento recopila|provenien(?:te|cia)|nombre can[oó]nico|nota can[oó]nica sobre/i;

export function playerText(text,{keepLinks=false}={}) {
  const out=[];let excluded=0;
  for(let line of String(text??'').replace(/\r\n/g,'\n').replace(/<!--[\s\S]*?-->/g,'').split('\n')) {
    const heading=line.match(/^(#{1,6})\s+(.+)/);
    if(heading){
      if(excluded&&heading[1].length<=excluded)excluded=0;
      if(excluded)continue;
      if(internalHeading.test(heading[2])){excluded=heading[1].length;continue;}
    } else if(excluded)continue;
    if(editorial.test(line)||/pendiente de ratific|\[PENDIENTE|\[DECISI[OÓ]N PENDIENTE/i.test(line))continue;
    line=line.replace(/`?\[(?:ESQUELETO|PENDIENTE)[^\]]*\]`?/gi,'');
    if(/\bplaceholder\b|^\s*[>*]*(?:Can[oó]nico|Actualizaci[oó]n can[oó]nica|\(Hassan)/i.test(line))continue;
    if(/^\s*[-*>]?\s*(?:consult[aá]|ver\b|dotes de senda en|enemigo declarado en|multiclase en|las epifan[ií]as disponibles)/i.test(line))continue;
    line=line.replace(/Las versiones heredadas[^.]*\./gi,'').replace(/Este Rasgo se denominaba[^.]*\./gi,'')
      .replace(/Este intervalo es provisional para playtest\./gi,'')
      .replace(/\*?\((?:can[oó]nico|fuente:|NV eliminado|nombre provisional|versi[oó]n|Hassan)[^)]*\)\*?/gi,'')
      .replace(/\s*\(V\d+\)/g,'').replace(/\s*\*?\(Ver\s+`?[^)]*\.md[^)]*\)\*?/gi,'')
      .replace(/\s*\(desarrollados en\s+`?[^)]*\.md[^)]*\)/gi,'');
    // Ordinary document links remain readable; no implicit tooltip is added.
    const withoutLinks=line.replace(/\[([^\]\n]+)\]\([^\n)]+\)/g,'$1');
    if(/(?:\d{2}_[A-Za-z_/]+|Senda_[A-Za-z_/]+|[A-Za-z_]+\.md)/.test(withoutLinks))continue;
    if(!keepLinks)line=withoutLinks;
    line=line.replace(/\*?\([^)]*Hassan[^)]*\)\*?/gi,'');
    line=line.replace(/\(\s*\)/g,'').trimEnd();
    if(/^[\s>*`-]*$/.test(line)){if(!out.at(-1)?.trim())continue;line='';}
    out.push(line);
  }
  return out.join('\n').replace(/\n{3,}/g,'\n\n').trim();
}

export function playerPathDocument(path) {
  const initial=path.rasgos.filter(r=>r.xp_requerida===0),later=path.rasgos.filter(r=>r.xp_requerida>0);
  const trait=r=>'### '+r.nombre+'\n\n'+(r.xp_requerida?'Requiere '+r.xp_requerida+' XP invertidos en la Senda.\n\n':'')+r.descripcion;
  return ['# '+path.nombre,path.descripcion,'## Rasgos iniciales',...initial.map(trait),
    ...path.dotes.map(d=>'### '+d.nombre+'\n\n'+d.descripcion),
    ...(later.length?['## Rasgos de progresión',...later.map(trait)]:[]),
    ...path.notas].join('\n\n');
}

const escape=text=>text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function playerDescription(text) {
  return '<div class="player-description">'+String(text??'').split(/\n\s*\n/).filter(Boolean).map(p=>'<p>'+escape(p).replace(/\n/g,'<br>')+'</p>').join('')+'</div>';
}
