import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,access} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('./dist/',import.meta.url));
await access(resolve(root,'vendor/sql-wasm.wasm')).catch(()=>{throw Error('Instalá sql.js con npm install en pages/ y ejecutá build.mjs antes de la prueba de navegador.');});
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright-core');
const networkAPI=[];
const server=createServer(async(req,res)=>{
 try{
  const path=decodeURIComponent(new URL(req.url,'http://local').pathname);
  if(path.startsWith('/api/'))networkAPI.push(path);
  if(!path.startsWith('/Gideon/')){res.writeHead(404);res.end();return;}
  const file=resolve(root,path.slice('/Gideon/'.length)||'index.html');
  if(!file.startsWith(root.endsWith(sep)?root:root+sep))throw Error('Ruta inválida');
  const content=await readFile(file);res.writeHead(200,{'Content-Type':({'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.wasm':'application/wasm'})[extname(file)]??'application/octet-stream'});res.end(content);
 }catch{res.writeHead(404);res.end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url='http://127.0.0.1:'+server.address().port+'/Gideon/';
let browser,diagnosticPage;
try{
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
 const context=await browser.newContext({acceptDownloads:true}),page=await context.newPage(),errors=[];
 diagnosticPage=page;
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.locator('#pages-toolbar').waitFor();
 assert(await page.getByRole('heading',{name:'Creá tu personaje de Gideon'}).isVisible());
 await page.getByRole('button',{name:'Crear mi personaje',exact:true}).click();
 await page.locator('[name=nombre]').fill('Exploradora de Pages');
 await page.locator('[name=linaje_id]').selectOption({label:'Hijos del Sol'});
 await page.locator('#next').click();
 await page.getByRole('button',{name:'Asignar en orden',exact:true}).click();await page.locator('#next').click();
 await page.locator('[name=dedicacion_id]').selectOption({label:'Soldado'});
 await page.locator('[name=nacimiento_id]').selectOption({index:1});await page.locator('#next').click();
 await page.locator('[name=clase_id]').selectOption({label:'Senda del Berserker'});
 const combat=page.locator('[data-combat-slot]'),ids=await combat.first().locator('option').evaluateAll(options=>options.map(o=>o.value).filter(Boolean));
 for(let i=0;i<4;i++)await combat.nth(i).selectOption(ids[i]);
 const normal=page.locator('[data-normal]');for(let i=0;i<3;i++)await normal.nth(i).fill(String(Number(await normal.nth(i).inputValue())+[20,20,10][i]));
 for(const selector of ['select[name^=rasgo_]','select[name^=respuesta_senda_]']){
  const fields=page.locator(selector);for(let i=0;i<await fields.count();i++){
   const value=await fields.nth(i).locator('option').evaluateAll(options=>options.find(o=>o.value&&!o.disabled)?.value);assert(value,'Hay una elección inicial sin opciones válidas.');await fields.nth(i).selectOption(value);
  }
 }
 await page.locator('#next').click();await page.getByRole('button',{name:'Crear y guardar personaje'}).click();
 await page.getByRole('heading',{name:'Exploradora de Pages',exact:true}).waitFor();
 await page.evaluate(()=>sessionStorage.clear());await page.reload();await page.locator('#pages-toolbar').waitFor();
 await page.getByRole('heading',{name:'Exploradora de Pages',exact:true}).waitFor();
 assert(await page.locator('#pages-status').textContent());
 const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Descargar copia',exact:true}).click()]);
 const bytes=await readFile(await download.path()),backup=JSON.parse(bytes.toString());assert.equal(backup.characters[0].nombre,'Exploradora de Pages');
 const other=await browser.newContext(),visitor=await other.newPage();visitor.on('pageerror',e=>errors.push(e.message));
 await visitor.goto(url);await visitor.locator('#pages-toolbar').waitFor();assert.equal(await visitor.locator('#pages-characters button').count(),0,'Cada visitante debe tener sus propias fichas');
 await visitor.locator('#pages-file').setInputFiles({name:'gideon.json',mimeType:'application/json',buffer:bytes});
 await visitor.getByRole('heading',{name:'Exploradora de Pages',exact:true}).waitFor();
 await page.locator('#pages-file').setInputFiles({name:'gideon.json',mimeType:'application/json',buffer:bytes});
 await page.locator('#pages-collection').waitFor();assert.equal(await page.locator('#pages-collection option').count(),2,'Importar conserva la colección anterior');
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Desborde en móvil');
 assert.deepEqual(networkAPI,[],'No debe existir una API HTTP para jugar');assert.deepEqual(errors,[]);
 console.log('OK: creación real con WebAssembly, Pages en subcarpeta, guardado, recarga, visitantes aislados, copia portable, importación sin pérdida y móvil.');
}catch(error){
 if(diagnosticPage)console.error('Estado de la página:',await diagnosticPage.evaluate(()=>({url:location.href,error:document.querySelector('#error')?.textContent,connection:document.querySelector('#connection')?.textContent,step:document.querySelector('#step-label')?.textContent})).catch(()=>null));
 throw error;
}finally{await browser?.close();await new Promise(r=>server.close(r));}
