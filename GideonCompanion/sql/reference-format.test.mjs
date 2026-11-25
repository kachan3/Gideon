import test from 'node:test';
import assert from 'node:assert/strict';
import {referenceMatcher,unmark,splitReferenceCells,referenceLabel} from '../js/reference-format.js';

test('only explicit selections resolve; legacy annotations and ambiguity never activate references',()=>{
  const issues=[];
  const match=referenceMatcher([
    {alias:'Aturdimiento',regla_id:'estado-aturdimiento'},
    {alias:'Proyectil',regla_id:'shape-proyectil'},
    {alias:'Proyectil',regla_id:'medio-proyectil'}
  ],issue=>issues.push(issue));
  const ordinary='Aturdimiento, aturdido y Proyectil. #Aturdimiento# <b>Aturdimiento</b>';
  assert.equal(match(ordinary),ordinary);
  assert.equal(match('[[Aturdimiento]]'), '\u27e6estado-aturdimiento\u00a6Aturdimiento\u27e7');
  assert.equal(match('[[Aturdimiento|aturdido]]'), '\u27e6estado-aturdimiento\u00a6aturdido\u27e7');
  assert.equal(match('[[medio-proyectil|proyectiles]]'), '\u27e6medio-proyectil\u00a6proyectiles\u27e7');
  assert.equal(match('[[Proyectil]] [[Inexistente]]'), '[[Proyectil]] [[Inexistente]]');
  assert.deepEqual(issues.map(i=>i.reason),['ambiguous','missing']);
  assert.equal(match('\u27e6estado-aturdimiento\u00a6aturdido\u27e7'),'aturdido');
  assert.equal(match('\u27e6shape-proyectil+medio-proyectil\u00a6Proyectil\u27e7'),'Proyectil');
  assert.equal(unmark(match('[[Aturdimiento|aturdido]]')),'aturdido');
  assert.equal(referenceLabel('[[Aturdimiento|aturdido]]'),'aturdido');
  assert.deepEqual(splitReferenceCells('Estado | [[Aturdimiento|aturdido]] | 1'),['Estado ',' [[Aturdimiento|aturdido]] ',' 1']);
});
