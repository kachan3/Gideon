import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {openDatabase,transaction,character} from './server.mjs';
import {migrateArmorProfiles,customItem} from './equipment.mjs';

test('todos los niveles usan perfiles finales y redondean hacia arriba en SQLite',()=>{
 const db=openDatabase(':memory:');try{
  for(const [cat,profile] of [['Ligera',[0.5,0.5,1]],['Mediana',[0.5,1,1]],['Pesada',[1,1,1.5]]])for(let level=1;level<=10;level++){
   const ref=transaction(db,()=>customItem(db,{tipo:'armadura_id',nombre:cat+' '+level,categoria:cat,nivel:level,peso_kg:1}));const row=db.prepare('SELECT * FROM armaduras WHERE id=?').get(ref.armadura_id);
   assert.deepEqual([row.reduccion_s,row.reduccion_p,row.reduccion_b],profile.map(v=>Math.ceil(v*level)));
   assert.deepEqual([row.multiplicador_s,row.multiplicador_p,row.multiplicador_b],profile);
  }
  assert.throws(()=>transaction(db,()=>customItem(db,{tipo:'armadura_id',nombre:'Reparto obsoleto',categoria:'Mediana',nivel:3,peso_kg:1,puntos_s:1})),/perfiles fijos/);
  assert.throws(()=>db.prepare('INSERT INTO armaduras(nombre,categoria,multiplicador_s,multiplicador_p,multiplicador_b) VALUES(?,?,?,?,?)').run('Perfil inválido','Mediana',3,3,3),/perfil fijo/);
  const p=character(db,1);assert.deepEqual(p.equipo.defensas.map(d=>d.valor),[2,3,3]);
 }finally{db.close();}
});

test('migración conserva identificadores, equipo y referencias mágicas',()=>{
 const db=new DatabaseSync(':memory:');try{
  db.exec(readFileSync(new URL('./schema.sql',import.meta.url),'utf8'));
  for(const file of ['001_progression.sql','002_initial_skills.sql','003_creation_rolls.sql','004_inventory.sql','005_damage.sql']){
   if(file==='004_inventory.sql')db.exec('PRAGMA foreign_keys=OFF; PRAGMA legacy_alter_table=ON;');
   db.exec(readFileSync(new URL('./migrations/'+file,import.meta.url),'utf8'));
  }
  db.exec("CREATE TABLE schema_migrations(version INTEGER PRIMARY KEY);INSERT INTO personajes(id,nombre) VALUES(1,'Conservar');INSERT INTO armaduras(id,nombre,categoria,base_general,puntos_asignables,nivel_equipo,puntos_s,puntos_p,puntos_b) VALUES(42,'Mediana anterior','Mediana',1,2,3,1,1,0);INSERT INTO inventario(id,personaje_id,armadura_id,equipado) VALUES(8,1,42,1);INSERT INTO items_magicos(id,nombre,descripcion,armadura_id) VALUES(12,'Armadura mágica','Referencia anterior',42);");
  migrateArmorProfiles(db);
  assert.equal(db.prepare('SELECT armadura_id FROM inventario WHERE id=8').get().armadura_id,42);assert.equal(db.prepare('SELECT equipado FROM inventario WHERE id=8').get().equipado,1);assert.equal(db.prepare('SELECT armadura_id FROM items_magicos WHERE id=12').get().armadura_id,42);
  assert.deepEqual(Object.values(db.prepare('SELECT reduccion_s,reduccion_p,reduccion_b FROM armaduras WHERE id=42').get()),[2,3,3]);assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
 }finally{db.close();}
});
