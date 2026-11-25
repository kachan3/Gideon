import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {Readable} from 'node:stream';
import {openDatabase,makeServer} from './server.mjs';
import {issueCharacterToken} from './access.mjs';

const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const db=openDatabase(':memory:');
const server=makeServer(db);
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
try {
  const page=await browser.newPage({hasTouch:true});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  // Exercise the normal router and SQLite without requiring a loopback socket.
  await page.route('http://gideon.test/**',async route=>{
    const r=route.request(),req=Readable.from(r.postData()?[r.postData()]:[]);
    const url=new URL(r.url());
    Object.assign(req,{method:r.method(),url:url.pathname+url.search,headers:{host:'gideon.test',...await r.allHeaders()},socket:{remoteAddress:'127.0.0.1'}});
    let status,headers;
    const body=await new Promise(resolve=>{
      server.emit('request',req,{writeHead(s,h){status=s;headers=h;},end:resolve});
    });
    await route.fulfill({status,headers,body:body??''});
  });
  await page.goto('http://gideon.test/');
  await page.locator('#nav-rules').click();
  await page.locator('#rule-select').selectOption('10_Reglas/Core_13_Sistema_de_Magia_y_Energia.md');
  const stunned=page.locator('#rule-reader [data-rule-ref="estado-aturdimiento"]').filter({hasText:/Aturdido/i}).first();
  await stunned.hover();
  const card=page.locator('#reference-preview'), header=card.locator(':scope > strong');
  assert.equal(await header.textContent(),'Aturdimiento');
  assert.match(await card.innerText(),/cancelar 1 de tus acciones/);
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('#reference-preview')).opacity==='1');
  await card.hover();
  assert(await card.isVisible());
  await card.locator('[data-rule-ref="estado-impedido"]').click();
  assert.equal(await header.textContent(),'Impedido');
  await page.mouse.move(0,0);
  await card.waitFor({state:'hidden'});
  await stunned.focus();
  await card.waitFor();
  await page.keyboard.press('Escape');
  await card.waitFor({state:'hidden'});
  assert(!/[⟦⟧]/.test(await page.locator('#rule-reader').innerText()));
  await page.locator('#rule-select').selectOption('20_Contenido/Core_14_Equipamiento.md');
  const swift=page.locator('#rule-reader [data-rule-ref="propiedad-veloz"]').first();
  await swift.hover();
  assert.equal(await header.textContent(),'Veloz');
  assert(await card.locator('[data-rule-ref="estado-arrebatado"]').count()>0);
  await page.reload();
  await page.locator('#access-token').fill(issueCharacterToken(db,1,{replace:true}));
  await page.locator('#access-form button').click();
  await page.locator('#character-content h1').waitFor();
  const gear=page.locator('dialog.gear-dialog[open]');
  if(await gear.count())await gear.locator('[data-close]').click();
  const characterRef=page.locator('#character-content [data-rule-ref="atributo-fuerza"]').first();
  await characterRef.hover();
  assert.match(await card.innerText(),/Capacidad bruta/);
  await page.setViewportSize({width:360,height:640});
  await characterRef.tap();
  const box=await card.boundingBox();
  assert(box&&box.x>=0&&box.x+box.width<=360);
  assert.deepEqual(errors,[]);
  console.log('Referencias verificadas en reglamento y ficha, con ratón, teclado y pantalla estrecha.');
} finally { await browser.close();db.close(); }
