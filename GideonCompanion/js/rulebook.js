import {referenceLabel,splitReferenceCells} from './reference-format.js';
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug=s=>referenceLabel(s).toLowerCase().replace(/[^\p{L}\p{N} -]/gu,'').trim().replace(/ +/g,'-');
const plain=s=>s.replace(/<a [^>]*><\/a>/g,'').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/\*\*|\x60/g,'');
function markup(doc,docs){
 const inline=s=>escape(s.replace(/<a [^>]*><\/a>/g,'')).replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,label,path)=>{
  const dest=new URL(path,'https://gideon.local/'+doc.id);
  const target=docs.find(d=>d.id===dest.pathname.slice(1));
  return target?'<a href="#rule-reader" data-doc="'+escape(target.id)+'" data-section="'+escape(dest.hash.slice(1))+'">'+label+'</a>':label;
 }).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\x60([^\x60]+)\x60/g,'<code>$1</code>');
 const lines=doc.texto.split(/\r?\n/),out=[];
 for(let i=0;i<lines.length;i++){
  const line=lines[i].trim();
  const fence=line.match(/^(`{3,}|~{3,})/);
  if(fence){
   const code=[];
   while(++i<lines.length&&!lines[i].trim().startsWith(fence[1]))code.push(lines[i]);
   out.push('<pre><code>'+escape(code.join('\n'))+'</code></pre>');continue;
  }
  if(!line||line==='---')continue;
  if(line.startsWith('|')){
   const table=[];
   while(i<lines.length&&lines[i].trim().startsWith('|')){
    const cells=splitReferenceCells(lines[i++].trim().slice(1,-1));
    if(cells.every(c=>/^\s*:?-+:?\s*$/.test(c)))continue;
    const tag=table.length?'td':'th';table.push('<tr>'+cells.map(c=>'<'+tag+'>'+inline(c.trim())+'</'+tag+'>').join('')+'</tr>');
   }
   i--;out.push('<div class="table-wrap"><table>'+table.join('')+'</table></div>');continue;
  }
  const heading=line.match(/^(#{1,6}) (.+)/);
  if(heading){const tag='h'+Math.min(6,heading[1].length+1);out.push('<'+tag+' data-anchor="'+escape(slug(plain(heading[2])))+'">'+inline(heading[2])+'</'+tag+'>');continue;}
  out.push('<p>'+inline(line.replace(/^>\s?/,'').replace(/^- /,'• '))+'</p>');
 }
 return out.join('');
}
export async function openRulebook(root,load,id,section){
 const docs=await load();
 root.innerHTML='<div class="panel"><h1>Reglas de mesa</h1><label>Procedimiento<select id="rule-select"></select></label><article id="rule-reader"></article></div>';
 const select=root.querySelector('select'),article=root.querySelector('article');
 for(const grupo of new Set(docs.map(d=>d.grupo))){
  const group=document.createElement('optgroup');group.label=grupo;
  for(const d of docs.filter(d=>d.grupo===grupo))group.append(new Option(d.titulo,d.id));select.append(group);
 }
 function display(id,section){
  const doc=docs.find(d=>d.id===id)??docs[0];select.value=doc.id;article.innerHTML=markup(doc,docs);
  if(section){const name=decodeURIComponent(section);const target=[...article.querySelectorAll('[data-anchor]')].find(h=>h.dataset.anchor===name||h.dataset.anchor.startsWith(name+'-'));(target??article).scrollIntoView();}
 }
 select.onchange=()=>display(select.value);
 article.onclick=e=>{const a=e.target.closest('[data-doc]');if(a){e.preventDefault();display(a.dataset.doc,a.dataset.section);}};
 display(id,section);
}
