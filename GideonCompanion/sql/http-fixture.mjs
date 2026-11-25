// Credenciales únicamente para bases de prueba; el servidor real exige token.
import {issueCharacterToken} from './access.mjs';
export const TEST_CATALOGUE_TOKEN='catalogue-key-only-for-isolated-tests';
export function fixtureFetch(db){
 const tokens=new Map();return (url,init={})=>{
  const path=new URL(url).pathname,headers=new Headers(init.headers),id=Number(path.match(/^\/api\/personajes\/(\d+)/)?.[1]??1);
  if(db.prepare('SELECT 1 FROM personajes WHERE id=?').get(id)){
   if(!tokens.has(id))tokens.set(id,issueCharacterToken(db,id,{replace:true}));
   headers.set('Authorization','Bearer '+tokens.get(id));
  }
  if(/^\/api\/catalogo\/(rasgos|rasgos-senda)$/.test(path))headers.set('X-Gideon-Catalog-Token',TEST_CATALOGUE_TOKEN);
  return globalThis.fetch(url,{...init,headers});
 };
}
