import {randomBytes,createHash,timingSafeEqual} from 'node:crypto';
import {readFileSync} from 'node:fs';
const digest=token=>createHash('sha256').update(token).digest('hex');
export const tokenFormat=token=>typeof token==='string'&&/^PJ_[A-Za-z0-9_-]{43}$/.test(token);
export function issueCharacterToken(db,personId,{replace=false}={}){
 if(!db.prepare('SELECT 1 FROM personajes WHERE id=?').get(personId))throw Error('Personaje inexistente');
 if(!replace&&db.prepare('SELECT 1 FROM personajes_accesos WHERE personaje_id=?').get(personId))throw Error('El personaje ya tiene token');
 for(let attempt=0;attempt<5;attempt++){
  const token='PJ_'+randomBytes(32).toString('base64url'),hash=digest(token);
  if(db.prepare('SELECT 1 FROM personajes_accesos WHERE token_hash=?').get(hash))continue;
  db.prepare('INSERT INTO personajes_accesos(personaje_id,token_hash) VALUES(?,?) ON CONFLICT(personaje_id) DO UPDATE SET token_hash=excluded.token_hash,creado=CURRENT_TIMESTAMP').run(personId,hash);
  return token;
 }
 throw Error('No se pudo generar el token; vuelve a intentarlo');
}
export function identifyCharacter(db,token){
 if(!tokenFormat(token))return null;
 return db.prepare('SELECT p.id,p.nombre FROM personajes p JOIN personajes_accesos a ON a.personaje_id=p.id WHERE a.token_hash=?').get(digest(token))??null;
}
export function bearerToken(req){const match=/^Bearer (PJ_[A-Za-z0-9_-]{43})$/.exec(req.headers.authorization??'');return match?.[1]??'';}
export function catalogueAdmin(req,secret){
 const received=req.headers['x-gideon-catalog-token'];if(!secret||typeof received!=='string')return false;
 const a=createHash('sha256').update(secret).digest(),b=createHash('sha256').update(received).digest();return timingSafeEqual(a,b);
}
export function migrateCharacterAccess(db){
 db.exec(readFileSync(new URL('./migrations/018_character_access.sql',import.meta.url),'utf8'));
 const initial=db.prepare('SELECT id,nombre FROM personajes').all().map(p=>({...p,token:issueCharacterToken(db,p.id)}));
 db.prepare('INSERT INTO schema_migrations(version) VALUES(18)').run();return initial;
}
