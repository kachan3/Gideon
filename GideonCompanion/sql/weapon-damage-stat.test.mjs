import test from 'node:test';
import assert from 'node:assert/strict';
import {openDatabase,character} from './server.mjs';
import {equipmentSummary} from './equipment.mjs';
test('Ágil elige automáticamente el mayor atributo de daño y lo muestra en la fórmula',()=>{
 const db=openDatabase(':memory:');try{
  const weapon=db.prepare("SELECT arma_id FROM inventario WHERE personaje_id=1 AND arma_id IS NOT NULL LIMIT 1").get().arma_id;
  const agil=Number(db.prepare("INSERT INTO ventajas_arma(nombre,descripcion) VALUES('Ágil','Fuerza o Agilidad para daño') ON CONFLICT(nombre) DO UPDATE SET descripcion=excluded.descripcion RETURNING id").get().id);
  db.prepare('INSERT OR IGNORE INTO armas_ventajas(arma_id,ventaja_id,grado_aplicado) VALUES(?,?,2)').run(weapon,agil);
  const p=character(db,1),set=(name,v)=>p.skills.find(s=>s.nombre===name).valor=v;
  const attack=()=>equipmentSummary(db,p).ataques.find(a=>a.item_id!==null);
  for(const [strength,agility,chosen,bonus] of [[32,68,'Agilidad',6],[79,41,'Fuerza',7],[55,55,'Fuerza',5]]){
   set('Fuerza',strength);set('Agilidad',agility);const a=attack();assert.equal(a.atributo_dano,chosen);assert.equal(a.dano_base,a.nivel+bonus);assert(a.formula.includes(chosen+' · mayor valor automático'));
  }
  db.prepare('DELETE FROM armas_ventajas WHERE arma_id=? AND ventaja_id=?').run(weapon,agil);
  const veloz=Number(db.prepare("INSERT INTO ventajas_arma(nombre,descripcion) VALUES('Veloz','Evita Arrebatado') ON CONFLICT(nombre) DO UPDATE SET descripcion=excluded.descripcion RETURNING id").get().id);
  db.prepare('INSERT OR IGNORE INTO armas_ventajas(arma_id,ventaja_id,grado_aplicado) VALUES(?,?,1)').run(weapon,veloz);
  set('Fuerza',32);set('Agilidad',68);assert.equal(attack().atributo_dano,'Fuerza');assert.equal(attack().dano_base,attack().nivel+3);
 }finally{db.close();}
});
