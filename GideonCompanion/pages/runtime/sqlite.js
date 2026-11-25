// The existing rules use Node's synchronous prepared-statement API.
// Adapt that small surface to SQLite compiled to WebAssembly.
export class DatabaseSync{
 constructor(database){this.raw=database;this.exec('PRAGMA foreign_keys=ON');}
 exec(sql){this.raw.run(sql);}
 prepare(sql){const db=this;return {
  all(...args){const s=db.raw.prepare(sql);try{s.bind(args);const rows=[];while(s.step())rows.push(s.getAsObject());return rows;}finally{s.free();}},
  get(...args){const s=db.raw.prepare(sql);try{s.bind(args);return s.step()?s.getAsObject():undefined;}finally{s.free();}},
  run(...args){db.raw.run(sql,args);return {changes:db.raw.getRowsModified(),lastInsertRowid:db.raw.exec('SELECT last_insert_rowid() AS id')[0]?.values[0][0]??0};}
 };}
 export(){const bytes=this.raw.export();this.exec('PRAGMA foreign_keys=ON');return bytes;}
 close(){this.raw.close();}
}
