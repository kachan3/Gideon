const TOKEN='gideon.token',KNOWN='gideon.personajes';
const valid=t=>typeof t==='string'&&/^PJ_[A-Za-z0-9_-]{43}$/.test(t);
export function currentToken(){return sessionStorage.getItem(TOKEN)??'';}
export function savedCharacters(){try{return JSON.parse(sessionStorage.getItem(KNOWN)??'[]').filter(p=>Number.isSafeInteger(p.id)&&typeof p.nombre==='string'&&valid(p.token));}catch{return [];}}
export function saveAccess(p,token){
 if(!valid(token))throw Error('Token de personaje inválido');
 sessionStorage.setItem(TOKEN,token);const known=savedCharacters().filter(x=>x.id!==p.id);known.push({id:p.id,nombre:p.nombre,token});sessionStorage.setItem(KNOWN,JSON.stringify(known));
}
export function selectAccess(id){const p=savedCharacters().find(p=>p.id===id);if(p)sessionStorage.setItem(TOKEN,p.token);}
export function clearAccess(){sessionStorage.removeItem(TOKEN);sessionStorage.removeItem(KNOWN);}
export function accessHeaders(){const token=currentToken();return token?{Authorization:'Bearer '+token}:{};}
export async function copyToken(){
 const token=currentToken();if(!token)throw Error('Ingresá con tu personaje para copiar su token');
 try{await navigator.clipboard.writeText(token);return true;}catch{
  const field=document.createElement('textarea');field.value=token;field.style.position='fixed';field.style.opacity='0';document.body.append(field);field.focus();field.select();let copied=false;try{copied=document.execCommand('copy');}finally{field.remove();}return copied;
 }
}
