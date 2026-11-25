import assert from 'node:assert/strict';

export async function checkSelectiveReferences(page) {
  assert.equal(await page.locator('[data-rule-ref]').count(),0,'Unmarked Companion content must remain ordinary text');
  const base=new URL('./',page.url()).href;
  await page.evaluate(async base=>{
    const root=document.createElement('main');root.id='reference-test';document.body.append(root);
    const {openRulebook}=await import(new URL('js/rulebook.js',base));
    await openRulebook(root,async()=>[{
      id:'fixture.md',titulo:'Selective references',grupo:'Test',
      texto:'# Aturdimiento\nAturdimiento sin marca. [[Aturdimiento]] y [[Aturdimiento|aturdido]].\n| Estado | Valor |\n| --- | --- |\n| [[Aturdimiento|aturdida]] | 1 |\n`[[Aturdimiento]]`\n~~~\n[[Aturdimiento]]\n~~~\n[Aturdimiento](fixture.md)\n<b>Aturdimiento</b>\n[[Destino inexistente]]'
    }]);
    const old=document.createElement('p');old.id='legacy-reference';old.textContent='\u27e6estado-aturdimiento\u00a6aturdido\u27e7';root.append(old);
  },base);
  const root=page.locator('#reference-test');
  await page.waitForFunction(()=>document.querySelectorAll('#reference-test [data-rule-ref]').length===3);
  assert.equal(await root.locator('[data-rule-ref]').count(),3);
  assert.equal(await root.locator('h2 [data-rule-ref],a [data-rule-ref],code [data-rule-ref],#legacy-reference [data-rule-ref]').count(),0);
  assert.equal(await root.locator('pre code').textContent(),'[[Aturdimiento]]');
  assert.equal(await root.locator('td').count(),2,'A reference label must not split a Markdown table cell');
  assert.equal(await root.locator('code').first().textContent(),'[[Aturdimiento]]');
  assert.equal(await root.locator('#legacy-reference').textContent(),'aturdido');
  assert((await root.innerText()).includes('[[Destino inexistente]]'),'Unresolved selections remain visible');
  assert.equal(await root.locator('b,script').count(),0,'Source HTML remains escaped');
  const ref=root.locator('[data-rule-ref]').first(),card=page.locator('#reference-preview');
  await ref.hover();await card.waitFor();
  assert.equal(await card.locator(':scope > strong').textContent(),'Aturdimiento');
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('#reference-preview')).opacity==='1');
  await card.hover();assert(await card.isVisible());
  await page.mouse.move(0,0);await card.waitFor({state:'hidden'});
  await ref.focus();await card.waitFor();await page.keyboard.press('Escape');await card.waitFor({state:'hidden'});
  await page.setViewportSize({width:360,height:640});
  await ref.click();const box=await card.boundingBox();assert(box&&box.x>=0&&box.x+box.width<=360);
  await page.keyboard.press('Escape');await card.waitFor({state:'hidden'});
  await root.evaluate(el=>el.remove());await page.setViewportSize({width:1280,height:720});
}
