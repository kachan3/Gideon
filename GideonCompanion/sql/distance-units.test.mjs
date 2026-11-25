import test from 'node:test';
import assert from 'node:assert/strict';
import {distancesToUnits,distanceDataToUnits} from '../js/distance-units.js';
test('conversión numérica de distancias, rangos, áreas y volúmenes',()=>{
 assert.equal(distancesToUnits('30/60 ft; 10 × 20 pies; 200 ft²; 125 pies cúbicos'),'6/12 unidades; 2 × 4 unidades; 8 unidades²; 1 unidades³');
 assert.equal(distancesToUnits('6 pies; 5 feet; 10–20 ft'),'1.2 unidades; 1 unidad; 2–4 unidades');
 assert.equal(distancesToUnits('120 ft. V, S.'),'24 unidades. V, S.');
 assert.equal(distancesToUnits('Moverse a pie; ponerse de pie; nota al pie'),'Moverse a pie; ponerse de pie; nota al pie');
 assert.equal(distancesToUnits('6 unidades; 3 bloques'),'6 unidades; 3 bloques');
 assert.deepEqual(distanceDataToUnits([['Regla','radio',10,'pies']]),[['Regla','radio',2,'unidades']]);
});
