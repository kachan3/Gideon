import assert from 'node:assert/strict';

// Shared with the public Pages browser test, using a separate visitor collection.
export async function checkArcanistCreation(browser,url){
 const context=await browser.newContext(),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(url);await page.locator('#pages-toolbar[data-ready=true]').waitFor();
  await page.getByRole('button',{name:'Crear mi personaje',exact:true}).click();
  await page.locator('[name=nombre]').fill('Arcanista de los seis flujos');
  await page.locator('[name=linaje_id]').selectOption({label:'Hijos del Sol'});await page.locator('#next').click();
  assert.equal(await page.locator('.class-card').count(),6);
  await page.locator('.class-card').filter({hasText:'Senda del Arcanista'}).click();
  await page.waitForFunction(()=>[...document.querySelectorAll('.class-card img')].every(img=>img.complete&&img.naturalWidth>0));
  for(const flow of ['Ivganny','Cronibor','Ignamor','Gelmir','Yrgrammar','Naial'])assert((await page.locator('.flow-guide').textContent()).includes(flow));
  await page.locator('[name=rasgo_herramienta]').selectOption('Bastón');
  await page.locator('[name=rasgo_artefacto]').selectOption('Blunderblaze');
  const ep=page.locator('[name=rasgo_epifania]');
  assert(!/Evocación Básica/.test(await ep.textContent()));
  const epiphanies=[['Telekinesis','Gelmir','Empujón'],['Sintonía con la Llama','Ignamor','Combustión'],['Emaptomancia','Ivganny','Miedo'],['Virtud Anima','Naial','Anhelo'],['Memento Mori','Yrgrammar','Force Decay'],['Primera Paradoja','Cronibor','Ralentizar'],['Eyes for the Ages / Ojos para las Eras','Cronibor','Predicción']];
  for(const [name,flow,effect] of epiphanies){
   await ep.selectOption({label:name});
   const description=page.locator('[data-trait-choice=epifania] [data-choice-description]');
   assert((await description.textContent()).includes(effect),name);
   assert.equal(await description.locator('.epiphany-detail[open]').count(),1);
   await page.locator('#next').click();
   assert.match(await page.locator('[data-epiphany-advice]').textContent(),new RegExp(flow));
   assert.equal(await page.locator('.epiphany-recommended select').count(),1);
   await page.locator('#previous').click();assert.equal(await ep.inputValue(),'pendiente:'+name);
  }
  await ep.selectOption({label:'Memento Mori'});await page.locator('#next').click();
  await page.getByRole('button',{name:'Asignar en orden',exact:true}).click();
  const values=await page.locator('[name^=attr_]').evaluateAll(nodes=>nodes.map(n=>n.value));
  await page.locator('#previous').click();await page.locator('#next').click();
  assert.deepEqual(await page.locator('[name^=attr_]').evaluateAll(nodes=>nodes.map(n=>n.value)),values);
  await page.locator('#next').click();
  await page.locator('[name=dedicacion_id]').selectOption({label:'Soldado'});await page.locator('[name=nacimiento_id]').selectOption({index:1});await page.locator('#next').click();
  const recommended=page.locator('.allocation-row.epiphany-recommended');assert.match(await recommended.textContent(),/Yrgram/);
  const school=await recommended.getAttribute('data-skill-row');
  await page.locator('[data-combat-slot="20"]').selectOption(school);
  const combat=page.locator('[data-combat-slot]');
  for(let i=1;i<4;i++){
   const value=await combat.nth(i).locator('option').evaluateAll(options=>options.find(o=>o.value&&!o.disabled)?.value);
   await combat.nth(i).selectOption(value);
  }
  const normal=page.locator('[data-normal]');for(let i=0;i<3;i++)await normal.nth(i).fill(String(Number(await normal.nth(i).inputValue())+[20,20,10][i]));
  await page.locator('[name=rasgo_epifania]').selectOption({label:'Telekinesis'});
  assert.match(await page.locator('#pool-epiphany-advice').textContent(),/Gelmir/);
  assert.match(await page.locator('.allocation-row.epiphany-recommended').textContent(),/Gelmir/);
  await page.locator('[name=rasgo_epifania]').selectOption({label:'Memento Mori'});
  await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('#next').click();assert.match(await page.locator('#wizard-body').textContent(),/Memento Mori/);
  await page.getByRole('button',{name:'Crear y guardar personaje'}).click();
  const gear=page.locator('dialog.gear-dialog[open]');await gear.waitFor();await gear.locator('[data-move]').first().click();await gear.locator('[name=ubicacion]').selectOption('Mano principal');await gear.getByRole('button',{name:'Guardar ubicación',exact:true}).click();await gear.locator('.gear-move-form').waitFor({state:'hidden'});await gear.getByRole('button',{name:'Comenzar aventura',exact:true}).click();await gear.waitFor({state:'hidden'});
  await page.reload();await page.locator('#pages-toolbar[data-ready=true]').waitFor();
  const guide=page.locator('[data-arcanist-guide]');await guide.waitFor();
  const learned=guide.locator('.epiphany-detail').filter({hasText:'Memento Mori'}).first();
  await learned.locator('summary').click();assert.match(await learned.textContent(),/Force Decay/);assert.match(await learned.textContent(),/Roting Touch/);
  assert.equal(await guide.locator('.flow-grid dt').count(),6);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth).map(e=>({tag:e.tagName,cl:e.className,width:e.getBoundingClientRect().width,text:e.textContent.slice(0,100)})).slice(0,20))));
  assert.deepEqual(errors,[]);
 }finally{await context.close();}
}
