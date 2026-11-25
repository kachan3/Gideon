import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

export async function checkOrderCreation(browser,url){
 const context=await browser.newContext({acceptDownloads:true}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));let imported;
 try{
  await page.goto(url);await page.locator('#pages-toolbar[data-ready=true]').waitFor();
  await page.getByRole('button',{name:'Crear mi personaje',exact:true}).click();
  await page.locator('[name=nombre]').fill('Caballera de la Orden');await page.locator('[name=linaje_id]').selectOption({label:'Hijos del Sol'});await page.locator('#next').click();
  await page.getByRole('button',{name:'Asignar en orden',exact:true}).click();await page.locator('#next').click();
  await page.locator('[name=dedicacion_id]').selectOption({label:'Soldado'});await page.locator('[name=nacimiento_id]').selectOption({index:1});await page.locator('#next').click();
  await page.locator('[name=clase_id]').selectOption({label:'Senda del Honor'});
  const combat=page.locator('[data-combat-slot]'),ids=await combat.first().locator('option').evaluateAll(options=>options.map(o=>o.value).filter(Boolean));
  for(let i=0;i<4;i++)await combat.nth(i).selectOption(ids[i]);
  const normal=page.locator('[data-normal]');for(let i=0;i<3;i++)await normal.nth(i).fill(String(Number(await normal.nth(i).inputValue())+[20,20,10][i]));
  await page.locator('#next').click();await page.locator('[data-order-segment]').waitFor();
  assert.equal(await page.locator('[data-oath-position]').count(),5);
  await page.locator('[name=orden]').selectOption('dragon-valeroso');
  assert.match(await page.locator('[data-order-benefits]').textContent(),/50/);
  await page.locator('[name=combo_orden_id]').selectOption({label:'Golpe Poderoso'});
  const selected={};for(const code of ['apertura','intencion','permanencia','reafirmacion','remate']){
   const select=page.locator('[name=juramento_'+code+']');await select.selectOption({index:1});selected[code]=await select.inputValue();
  }
  assert.match(await page.locator('[data-oath-preview]').textContent(),/Juro por mi vida/);
  await page.locator('#next').click();await page.locator('#previous').click();
  assert.equal(await page.locator('[name=orden]').inputValue(),'dragon-valeroso');
  for(const [code,value] of Object.entries(selected))assert.equal(await page.locator('[name=juramento_'+code+']').inputValue(),value);
  await page.locator('#next').click();await page.getByRole('button',{name:'Crear y guardar personaje'}).click();
  const gear=page.locator('dialog.gear-dialog[open]');await gear.waitFor();await gear.getByRole('button',{name:'Comenzar aventura',exact:true}).click();await gear.waitFor({state:'hidden'});
  await page.reload();await page.locator('#pages-toolbar[data-ready=true]').waitFor();
  assert.match(await page.locator('[data-order-sheet]').textContent(),/Orden del Dragón Valeroso/);
  assert.match(await page.locator('[data-order-sheet]').textContent(),/50/);
  assert.match(await page.locator('[data-order-sheet]').textContent(),/Golpe Poderoso/);
  assert.match(await page.locator('[data-oath-sheet]').textContent(),/Todavía no tenés frases activas/);
  for(const [code,value] of Object.entries(selected))assert.equal(await page.locator('[data-oath-sheet] [name=juramento_'+code+']').inputValue(),value);
  const downloading=page.waitForEvent('download');await page.locator('#pages-export').click();const download=await downloading,bytes=await readFile(await download.path());
  imported=await browser.newContext();const restored=await imported.newPage();restored.on('pageerror',e=>errors.push(e.message));
  await restored.goto(url);await restored.locator('#pages-toolbar[data-ready=true]').waitFor();
  await restored.locator('#pages-file').setInputFiles({name:'orden.json',mimeType:'application/json',buffer:bytes});
  await restored.locator('[data-order-sheet]').waitFor();assert.match(await restored.locator('[data-order-sheet]').textContent(),/Golpe Poderoso/);
  for(const [code,value] of Object.entries(selected))assert.equal(await restored.locator('[data-oath-sheet] [name=juramento_'+code+']').inputValue(),value);
  assert.deepEqual(errors,[]);
 }finally{await imported?.close();await context.close();}
}
