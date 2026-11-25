import {checkSelectiveReferences} from './reference-browser-checks.test.mjs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {Readable} from 'node:stream';
import {openDatabase,makeServer} from './server.mjs';

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
  await page.locator('#rule-select').waitFor();
  await checkSelectiveReferences(page);
  assert.deepEqual(errors,[]);
  console.log('Referencias verificadas en reglamento y ficha, con ratón, teclado y pantalla estrecha.');
} finally { await browser.close();db.close(); }
