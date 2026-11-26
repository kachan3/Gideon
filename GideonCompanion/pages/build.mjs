import {exportPlayerCopy} from '../sql/player-copy.mjs';
import {pathContent} from '../sql/paths.mjs';
import {mkdir,readFile,writeFile,copyFile,readdir,access} from 'node:fs/promises';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {openDatabase} from '../sql/server.mjs';
import {rulebook} from '../sql/rulebook.mjs';

const here=dirname(fileURLToPath(import.meta.url)),base=resolve(here,'..');
export const output=resolve(here,'dist');
const quote=s=>'"'+s.replaceAll('"','""')+'"';
async function sourceVersion(){
 const hash=createHash('sha256');
 async function add(dir,pattern){for(const e of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){if(e.isDirectory())await add(join(dir,e.name),pattern);else if(pattern.test(e.name)){hash.update(e.name);hash.update(await readFile(join(dir,e.name)));}}}
 await add(resolve(base,'../10_Reglas'),/\.md$/);await add(resolve(base,'../20_Contenido'),/\.md$/);
 await add(join(base,'content'),/\.(json|xml)$/);await add(join(base,'sql'),/\.(mjs|sql)$/);
 return hash.digest('hex').slice(0,16);
}
export async function build(){
 await mkdir(output,{recursive:true});
 const catalogueVersion=await sourceVersion();
 // Start with a NEW in-memory database. Never read the local players' database.
 const db=openDatabase(':memory:');
 try{
  db.exec('CREATE TABLE IF NOT EXISTS npc_grupos(id TEXT PRIMARY KEY,datos_json TEXT NOT NULL)');
  const tables=db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all().map(r=>r.name);
  const personal=new Set(['personajes','creacion_tiradas','npc_grupos']);
  let changed=true;while(changed){changed=false;for(const t of tables)if(!personal.has(t)&&db.prepare(`PRAGMA foreign_key_list(${quote(t)})`).all().some(k=>personal.has(k.table))){personal.add(t);changed=true;}}
  const triggers=db.prepare("SELECT name,sql FROM sqlite_master WHERE type='trigger'").all();
  db.exec('PRAGMA foreign_keys=OFF');
  for(const t of triggers)db.exec('DROP TRIGGER '+quote(t.name));
  for(const t of tables)if(personal.has(t)){
   db.exec('DELETE FROM '+quote(t));
   db.prepare('DELETE FROM sqlite_sequence WHERE name=?').run(t);
  }
  for(const t of triggers)db.exec(t.sql);
  db.exec('PRAGMA foreign_keys=ON');
  if(db.prepare('PRAGMA foreign_key_check').all().length)throw Error('El catálogo público contiene vínculos inválidos');
  for(const t of tables)if(personal.has(t)&&db.prepare('SELECT COUNT(*) n FROM '+quote(t)).get().n)throw Error('Datos personales en '+t);
  // VACUUM rebuilds the file; deleted example rows cannot remain in free pages.
  const stamp=Date.now(),temporary=join(output,`catalogue-${stamp}.sqlite`);
  db.exec("VACUUM INTO '"+temporary.replaceAll("'","''")+"'");
  await copyFile(temporary,join(output,'catalogue.sqlite'));
  const {unlink}=await import('node:fs/promises');await unlink(temporary);
  await writeFile(join(output,'player-copy.json'),JSON.stringify(exportPlayerCopy(db,pathContent.sendas)));
  const schemaVersion=db.prepare('SELECT MAX(version) n FROM schema_migrations').get().n;
  await writeFile(join(output,'catalogue-manifest.json'),JSON.stringify({format:'gideon-pages',version:1,schemaVersion,catalogueVersion,created:new Date().toISOString(),personalTables:tables.filter(t=>personal.has(t))},null,2));
 }finally{db.close();}

 const files={};
 async function collect(dir,virtual,filter){for(const e of await readdir(dir,{withFileTypes:true})){if(e.isDirectory())await collect(join(dir,e.name),virtual+'/'+e.name,filter);else if(filter(e.name))files[virtual+'/'+e.name]=await readFile(join(dir,e.name),'utf8');}}
 await collect(join(base,'content'),'/GideonCompanion/content',n=>n.endsWith('.json'));
 files['/20_Contenido/Dotes/Ojos_para_las_Eras.md']=await readFile(resolve(base,'../20_Contenido/Dotes/Ojos_para_las_Eras.md'),'utf8');
 // This public creator does not publish private adventure statblocks or links.
 files['/GideonCompanion/NPCs/vinculos.json']=JSON.stringify({version:1,vinculos:[]});
 await mkdir(join(output,'runtime'),{recursive:true});
 await writeFile(join(output,'runtime/files.js'),'export default '+JSON.stringify(files)+';\n');
 for(const e of await readdir(join(here,'runtime')))if(e.endsWith('.js')||e.endsWith('.css'))await copyFile(join(here,'runtime',e),join(output,'runtime',e));
 await mkdir(join(output,'engine/sql'),{recursive:true});
 for(const e of await readdir(join(base,'sql'))){
  if(!e.endsWith('.mjs')||/\.test\.|character-token|check-market|init_and|http-fixture|update-weapons/.test(e))continue;
  let code=await readFile(join(base,'sql',e),'utf8');
  if(e==='rulebook.mjs')code='export const rulebook='+JSON.stringify(rulebook)+';\nexport function updateGenericActions(){throw Error("El catálogo se actualiza al generar el sitio.");}\n';
  code=code.replaceAll(/from 'node:([a-z]+)'/g,(_,name)=>`from '../../runtime/${name}.js'`);
  code=code.replaceAll('import.meta.dirname',"new URL('.',import.meta.url).pathname");
  if(e==='server.mjs')code=code.slice(0,code.indexOf('if(process.argv[1]'));
  await writeFile(join(output,'engine/sql',e),code);
 }
 async function copyTree(from,to){await mkdir(to,{recursive:true});for(const e of await readdir(from,{withFileTypes:true}))if(e.isDirectory())await copyTree(join(from,e.name),join(to,e.name));else if(/\.(js|css|svg|ico|jpg|jpeg|png|webp)$/i.test(e.name))await copyFile(join(from,e.name),join(to,e.name));}
 await copyTree(join(base,'js'),join(output,'js'));await copyTree(join(base,'js'),join(output,'engine/js'));await copyTree(join(base,'css'),join(output,'css'));
 await copyTree(join(base,'src'),join(output,'src'));
 let html=await readFile(join(base,'index.html'),'utf8');
 html=html.replace('src="js/companion.js"','src="runtime/bootstrap.js"').replace('</head>','<link rel="stylesheet" href="runtime/pages.css"></head>');
 await writeFile(join(output,'index.html'),html);await writeFile(join(output,'.nojekyll'),'');
 // CI vendors the pinned dependency. Local source preparation also works without npm.
 try{
  const vendor=resolve(here,'node_modules/sql.js/dist');await access(join(vendor,'sql-wasm.js'));
  await mkdir(join(output,'vendor'),{recursive:true});for(const name of ['sql-wasm.js','sql-wasm.wasm'])await copyFile(join(vendor,name),join(output,'vendor',name));
  await copyFile(resolve(vendor,'../LICENSE'),join(output,'vendor/sql.js-LICENSE'));
 }catch{ /* bootstrap has an explicit, version-pinned CDN fallback */ }
 console.log('GitHub Pages preparado en '+output);
 return output;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await build();
