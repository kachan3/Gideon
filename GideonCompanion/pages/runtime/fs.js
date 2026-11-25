import initial from './files.js';
import {resolve} from './path.js';
const root=decodeURIComponent(new URL('../',import.meta.url).pathname);
let overrides={};
function key(path){let p=path instanceof URL?decodeURIComponent(path.pathname):String(path);if(p.startsWith(root+'engine/'))p='/GideonCompanion/'+p.slice((root+'engine/').length);else if(p.startsWith(root))p='/'+p.slice(root.length);return resolve(p);}
export function readFileSync(path){const k=key(path),value=overrides[k]??initial[k];if(value===undefined)throw Error('Archivo no disponible: '+k);return value;}
export function writeFileSync(path,value){overrides[key(path)]=String(value);}
export function existsSync(path){const k=key(path);return k in overrides||k in initial||Object.keys({...initial,...overrides}).some(p=>p.startsWith(k+'/'));}
export function readdirSync(path){const prefix=key(path)+'/';return [...new Set(Object.keys({...initial,...overrides}).filter(p=>p.startsWith(prefix)).map(p=>p.slice(prefix.length).split('/')[0]))];}
export function statSync(path){const k=key(path);return {isFile:()=>k in overrides||k in initial,isDirectory:()=>!(k in overrides)&&!(k in initial)};}
export function copyFileSync(from,to){writeFileSync(to,readFileSync(from));}
export function renameSync(from,to){writeFileSync(to,readFileSync(from));delete overrides[key(from)];}
export const exportFiles=()=>({...overrides});
export function restoreFiles(files={}){for(const [p,v] of Object.entries(files))if(!p.startsWith('/GideonCompanion/NPCs/')||p.includes('..')||typeof v!=='string')throw Error('Archivo de NPC inválido');overrides={...files};}
