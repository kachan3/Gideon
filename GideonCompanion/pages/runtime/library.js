const DATABASE='gideon-pages',STORE='collections';
export function openLibrary(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DATABASE,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE,{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(Error('No se pudo abrir el guardado del navegador.'));});}
export function readCollection(db,id){return new Promise((resolve,reject)=>{const r=db.transaction(STORE).objectStore(STORE).get(id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export function listCollections(db,scope){return new Promise((resolve,reject)=>{const r=db.transaction(STORE).objectStore(STORE).getAll();r.onsuccess=()=>resolve(r.result.filter(x=>x.scope===scope));r.onerror=()=>reject(r.error);});}
export function saveCollection(db,record,expectedRevision){return new Promise((resolve,reject)=>{
 const tx=db.transaction(STORE,'readwrite'),store=tx.objectStore(STORE);let conflict=false;
 const request=store.get(record.id);request.onsuccess=()=>{if(expectedRevision!==undefined&&(request.result?.revision??0)!==expectedRevision){conflict=true;tx.abort();return;}store.put(record);};
 tx.oncomplete=()=>resolve(record);tx.onerror=tx.onabort=()=>reject(Error(conflict?'Tus fichas cambiaron en otra pestaña. Recargá antes de continuar.':'No se pudo guardar. Descargá una copia antes de cerrar esta página.'));
});}
export function bytesToBase64(bytes){let text='';for(let i=0;i<bytes.length;i+=16384)text+=String.fromCharCode(...bytes.subarray(i,i+16384));return btoa(text);}
export function base64ToBytes(text){if(typeof text!=='string'||text.length>50_000_000||!/^[A-Za-z0-9+/]*={0,2}$/.test(text))throw Error('Copia inválida o demasiado grande.');return Uint8Array.from(atob(text),c=>c.charCodeAt(0));}
export function validateArchive(data,manifest){
 if(data?.format!=='gideon-pages-backup'||data.version!==1||!(data.manifest?.schemaVersion===manifest.schemaVersion||(data.manifest?.schemaVersion===40&&manifest.schemaVersion===41)))throw Error('Esta copia no es compatible con esta versión de Gideon. Se conservaron tus fichas actuales.');
 if(!Array.isArray(data.characters)||!data.characters.every(p=>Number.isSafeInteger(p.id)&&p.id>0&&typeof p.nombre==='string'&&/^PJ_[A-Za-z0-9_-]{43}$/.test(p.token)))throw Error('La copia no contiene accesos válidos.');
 if(new Set(data.characters.map(p=>p.id)).size!==data.characters.length)throw Error('La copia contiene personajes repetidos.');
 const bytes=base64ToBytes(data.database);if(new TextDecoder().decode(bytes.subarray(0,16))!=='SQLite format 3\0')throw Error('La copia no contiene fichas SQLite válidas.');
 return bytes;
}
