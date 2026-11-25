// Text updates use stable identities and never replace the visitor's database.
export function ensurePathTraits(db, paths) {
  for(const path of paths){
    const parent=db.prepare('SELECT id FROM clases WHERE nombre=?').get(path.nombre);if(!parent)continue;
    for(const trait of path.rasgos){
      if(db.prepare('SELECT id FROM clases_rasgos WHERE clase_id=? AND nombre=?').get(parent.id,trait.nombre))continue;
      let row=db.prepare("SELECT id FROM rasgos WHERE nombre=? AND tipo='Capacidad'").get(trait.nombre);
      if(!row)row={id:Number(db.prepare("INSERT INTO rasgos(nombre,descripcion,tipo) VALUES(?,?,'Capacidad')").run(trait.nombre,trait.descripcion).lastInsertRowid)};
      db.prepare('INSERT INTO clases_rasgos(clase_id,rasgo_id,nombre,descripcion,xp_clase_requerida,es_insignia) VALUES(?,?,?,?,?,?)')
        .run(parent.id,row.id,trait.nombre,trait.descripcion,trait.xp_requerida,Number(trait.xp_requerida===0));
    }
  }
  // As Marcial specifically requires investment in Valor feats, whereas the
  // other path thresholds use all dedicated XP. Preserve that distinction.
  db.exec(`DROP VIEW v_rasgos_senda_estado;
    CREATE VIEW v_rasgos_senda_estado AS
    WITH base AS (
      SELECT cr.*,pc.personaje_id,
        CASE WHEN cr.nombre='As Marcial' THEN
          (SELECT COALESCE(SUM(pr.xp_gastada),0) FROM progresion pr JOIN dotes d ON d.id=pr.dote_id
           WHERE pr.personaje_id=pc.personaje_id AND (d.clase_id=cr.clase_id OR EXISTS(
             SELECT 1 FROM dotes_tags dt JOIN rasgos tag ON tag.id=dt.rasgo_id
             WHERE dt.dote_id=d.id AND tag.nombre='Valor')))
        ELSE COALESCE(xp.xp_invertida,0) END AS xp_dedicada
      FROM v_rasgos_senda_catalogo cr JOIN personajes_clases pc ON pc.clase_id=cr.clase_id
      LEFT JOIN v_xp_senda xp ON xp.personaje_id=pc.personaje_id AND xp.clase_id=cr.clase_id
    ) SELECT base.*,xp_dedicada>=xp_requerida AS requisito_cumplido,
      xp_dedicada>=xp_requerida AS obtenido,xp_dedicada>=xp_requerida AS activo FROM base;`);
}

const textTables=['clases','clases_rasgos','rasgos','dotes','acciones','epifanias','efectos','misticas','trucos','hierophant_passives'];
export function exportPlayerCopy(db, paths) {
  return {version:1,paths,fields:textTables.flatMap(table=>db.prepare('SELECT * FROM '+table).all().map(r=>({table,id:r.id,nombre:r.nombre,descripcion:r.descripcion,...('tipo' in r?{tipo:r.tipo}:{}),...('clase_id' in r?{clase_id:r.clase_id}:{})}))),
    definitions:db.prepare('SELECT * FROM reglas_atomicas').all(),aliases:db.prepare('SELECT * FROM alias_reglas').all(),documents:db.prepare('SELECT * FROM documentos_reglas').all()};
}
export function applyPlayerCopy(db, copy) {
  if(copy.version!==1)throw Error('Contenido de lectura incompatible');
  ensurePathTraits(db,copy.paths);
  for(const field of copy.fields){
    if(!textTables.includes(field.table))throw Error('Tabla de lectura inválida');
    // IDs can differ between an older collection and a new catalogue. Use the
    // semantic identity, and never overwrite unrelated custom rows by ID.
    const keys=['nombre',...('tipo' in field?['tipo']:[]),...('clase_id' in field?['clase_id']:[])];
    const where=keys.map(k=>k+' IS ?').join(' AND '),values=keys.map(k=>field[k]);
    const matches=db.prepare('SELECT id FROM '+field.table+' WHERE '+where).all(...values);
    if(matches.length===1)db.prepare('UPDATE '+field.table+' SET descripcion=? WHERE id=?').run(field.descripcion,matches[0].id);
  }
  for(const path of copy.paths){
    const parent=db.prepare('SELECT id FROM clases WHERE nombre=?').get(path.nombre);if(!parent)continue;
    db.prepare('UPDATE clases SET descripcion=? WHERE id=?').run(path.descripcion,parent.id);
    db.prepare('UPDATE clases_origen SET elecciones=?,notas=? WHERE clase_id=?').run(JSON.stringify(path.elecciones),JSON.stringify(path.notas),parent.id);
    for(const trait of path.rasgos){
      const row=db.prepare('SELECT id,rasgo_id FROM clases_rasgos WHERE clase_id=? AND nombre=?').get(parent.id,trait.nombre);
      db.prepare('UPDATE clases_rasgos SET descripcion=? WHERE id=?').run(trait.descripcion,row.id);
      db.prepare('UPDATE rasgos SET descripcion=? WHERE id=?').run(trait.descripcion,row.rasgo_id);
    }
  }
  // These three tables contain derived reading material, never character state.
  db.exec('DELETE FROM alias_reglas; DELETE FROM reglas_atomicas; DELETE FROM documentos_reglas; DELETE FROM textos_catalogo;');
  for(const r of copy.definitions)db.prepare('INSERT INTO reglas_atomicas VALUES(?,?,?)').run(r.id,r.nombre,r.texto);
  for(const r of copy.aliases)db.prepare('INSERT INTO alias_reglas VALUES(?,?)').run(r.alias,r.regla_id);
  for(const r of copy.documents)db.prepare('INSERT INTO documentos_reglas VALUES(?,?,?,?)').run(r.id,r.titulo,r.grupo,r.texto);
}
