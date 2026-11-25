import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,cpSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Readable} from 'node:stream';
import {DatabaseSync} from 'node:sqlite';
import {openDatabase,makeServer} from './server.mjs';
import {issueCharacterToken} from './access.mjs';
import {NPC_ROOT,loadNPCs,initNPCs,createGroup,changeGroup,npcGroups,npcRoll,writeLink,playerCompanions,writeNPC} from './npcs.mjs';
import {npcHealth,validateNPC,actionsUsed,memberActions,setNPCAguante} from '../js/npc-rules.js';
function fixture(t){const root=mkdtempSync(join(tmpdir(),'gideon-npcs-'));cpSync(NPC_ROOT,root,{recursive:true});const db=openDatabase(':memory:');initNPCs(db);t.after(()=>{db.close();rmSync(root,{recursive:true,force:true});});return {db,root};}
test('el catálogo incluye las siete fichas de la grieta con acciones utilizables',t=>{
 const {db,root}=fixture(t),catalog=loadNPCs(root),ids=['lagarto_cebado_grieta','saqueador_saurio','hostigador_saurio','kor_zath_greba_rota','mercenario_grieta','medico_grieta','asistente_grieta'];
 for(const id of ids){const npc=catalog.find(n=>n.id===id);assert(npc,id);assert(!npc.datos_demo);const g=createGroup(db,{npc_id:id,cantidad:1},root);assert(!npcHealth(g.npc,g.integrantes[0]).caido);for(const a of npc.acciones.filter(a=>a.valor!=null))assert(npcRoll(npc,{accion_id:a.id},()=>0).exito);}
 assert.equal(catalog.find(n=>n.id==='kor_zath_greba_rota').salud.maximo,14);
 assert.equal(catalog.find(n=>n.id==='medico_grieta').especialidades.medicina,65);
});
test('las casillas de aguante conservan rasgos, actualizan límites y aíslan catálogo y grupos',t=>{
 const {db,root}=fixture(t),base=loadNPCs(root).find(n=>n.id==='saqueador_saurio');
 let g=createGroup(db,{npc_id:base.id,cantidad:2},root);const member=g.integrantes[0].id;
 const patch=b=>g=changeGroup(db,g.id,{revision:g.revision,...b});
 patch({operacion:'impacto',integrante_id:member});patch({operacion:'impacto',integrante_id:member});assert(npcHealth(g.npc,g.integrantes[0]).caido);
 patch({operacion:'aguante',vigoroso:3,duro:2});assert(!npcHealth(g.npc,g.integrantes[0]).caido);assert(g.npc.rasgos.some(r=>r.id==='inmune_temor'));
 assert.equal(loadNPCs(root).find(n=>n.id===base.id).rasgos.find(r=>r.id==='vigoroso').cantidad,2);
 patch({operacion:'impacto',integrante_id:member,grave:true});assert(npcHealth(g.npc,g.integrantes[0]).caido);
 patch({operacion:'aguante',vigoroso:null,duro:2});assert(!npcHealth(g.npc,g.integrantes[0]).caido);
 patch({operacion:'impacto',integrante_id:member,grave:true});assert(npcHealth(g.npc,g.integrantes[0]).caido);
 patch({operacion:'aguante',vigoroso:null,duro:null});assert(!g.npc.rasgos.some(r=>['vigoroso','duro'].includes(r.id)));
 const revision=g.revision;assert.throws(()=>patch({operacion:'aguante',vigoroso:0,duro:null}));assert.equal(npcGroups(db).find(n=>n.id===g.id).revision,revision);
 assert.throws(()=>setNPCAguante(base,{duro:1.5}));assert.throws(()=>setNPCAguante(base,{vigoroso:201}));
 assert.throws(()=>setNPCAguante(loadNPCs(root).find(n=>n.id==='kor_zath_greba_rota'),{duro:2}),/salud por golpes/);
 const changed=setNPCAguante(base,{vigoroso:4,duro:3});writeNPC({carpeta:base.carpeta,npc:changed},root);
 assert.equal(loadNPCs(root).find(n=>n.id===base.id).rasgos.find(r=>r.id==='vigoroso').cantidad,4);
 assert.equal(npcGroups(db).find(n=>n.id===g.id).npc.rasgos.filter(r=>['vigoroso','duro'].includes(r.id)).length,0);
 assert.equal(base.rasgos.find(r=>r.id==='vigoroso').cantidad,2);
});
test('fichas estáticas validan y los grupos conservan snapshot tras editar catálogo',t=>{
 const {db,root}=fixture(t),catalog=loadNPCs(root);assert.equal(catalog.filter(n=>n.datos_demo).length,4);
 for(const n of catalog)assert.equal(validateNPC(n),n);
 const npc=structuredClone(catalog[0]);delete npc.defensas.ug;assert.throws(()=>validateNPC(npc));
 const g=createGroup(db,{npc_id:catalog[0].id,cantidad:3},root);npc.nombre='Nueva edición';npc.defensas.ug=5;
 writeNPC({carpeta:catalog[0].carpeta,npc},root);assert.equal(loadNPCs(root)[0].version,catalog[0].version+1);assert.equal(npcGroups(db)[0].npc.nombre,catalog[0].nombre);
 assert.equal(new Set(g.integrantes.map(m=>m.id)).size,3);
});
test('un golpe, Vigoroso, Grave, Duro y Duro sin Vigoroso tienen límites correctos',t=>{
 const {root}=fixture(t),base=loadNPCs(root).find(n=>n.id==='soldado_demo'),m={golpes:0,graves:0,heridas:0};
 const plain={...base,rasgos:[]};assert(!npcHealth(plain,m).caido);assert(npcHealth(plain,{...m,golpes:1}).caido);
 assert(!npcHealth(base,{...m,golpes:1}).caido);assert(npcHealth(base,{...m,golpes:2}).caido);assert(npcHealth(base,{...m,golpes:1,graves:1}).caido);
 const hard={...base,rasgos:[{id:'duro',cantidad:2}]};assert(!npcHealth(hard,{...m,golpes:100}).caido);assert(!npcHealth(hard,{...m,graves:1}).caido);assert(npcHealth(hard,{...m,graves:2}).caido);
 const both={...base,rasgos:[{id:'duro',cantidad:2},{id:'vigoroso',cantidad:3}]};assert(!npcHealth(both,{...m,golpes:2,graves:1}).caido);assert(npcHealth(both,{...m,golpes:3,graves:1}).caido);
});
test('impacto simultáneo, economía conjunta, excepciones individuales y defensa básica',t=>{
 const {db,root}=fixture(t);let g=createGroup(db,{npc_id:'soldado_demo',cantidad:3},root);
 const patch=b=>g=changeGroup(db,g.id,{revision:g.revision,...b});
 patch({operacion:'impacto',todos:true,grave:true});assert(g.integrantes.every(m=>m.golpes===1&&m.graves===1));
 const m=g.integrantes[0].id;patch({operacion:'integrante',integrante_id:m,golpes:0,graves:0,ajuste_acciones:1});
 patch({operacion:'defensa',integrante_id:m});assert.throws(()=>patch({operacion:'defensa',integrante_id:m}));
 patch({operacion:'ronda'});patch({operacion:'integrante',integrante_id:m,estados:['Arrebatado']});assert.throws(()=>patch({operacion:'defensa',integrante_id:m}));
 patch({operacion:'integrante',integrante_id:m,estados:[]});
 assert.throws(()=>patch({operacion:'extra',integrante_id:m}));for(let i=0;i<3;i++)patch({operacion:'accion'});
 patch({operacion:'extra',integrante_id:m});assert.equal(actionsUsed(g,g.integrantes[0]),4);assert.equal(memberActions(g,g.integrantes[0]),4);assert.throws(()=>patch({operacion:'extra',integrante_id:m}));
 patch({operacion:'integrante',integrante_id:g.integrantes[1].id,ajuste_acciones:-2});assert.equal(actionsUsed(g,g.integrantes[1]),1);
 assert.throws(()=>changeGroup(db,g.id,{revision:0,operacion:'ronda'}),/cambió/);
});
test('enemigos acumulan heridas, conservan valores estáticos y permiten corrección',t=>{
 const {db,root}=fixture(t);let g=createGroup(db,{npc_id:'bandido_demo',cantidad:1},root),id=g.integrantes[0].id;
 g=changeGroup(db,g.id,{revision:g.revision,operacion:'impacto',integrante_id:id,heridas:6});assert.equal(g.integrantes[0].graves,1);assert.equal(npcHealth(g.npc,g.integrantes[0]).restante,14);
 g=changeGroup(db,g.id,{revision:g.revision,operacion:'impacto',integrante_id:id,heridas:14});assert(npcHealth(g.npc,g.integrantes[0]).caido);
 g=changeGroup(db,g.id,{revision:g.revision,operacion:'integrante',integrante_id:id,heridas:0,graves:0});assert(!npcHealth(g.npc,g.integrantes[0]).caido);
});
test('vínculo por ID queda en JSON, despliegue en SQLite y resultado compartido usa mismo dado',t=>{
 const {db,root}=fixture(t);const links=writeLink(db,{npc_id:'zombi_demo',personaje_id:1,cantidad:2,control:'esclavo',nombre:'Mis zombis'},root),link=links.vinculos.at(-1);
 assert.equal(JSON.parse(readFileSync(join(root,'vinculos.json'),'utf8')).vinculos.at(-1).personaje_id,1);
 createGroup(db,{npc_id:'zombi_demo',cantidad:2,vinculo_id:link.id},root);assert.equal(playerCompanions(db,1,root).at(-1).grupos.length,1);assert.deepEqual(playerCompanions(db,9999,root),[]);
 const n=loadNPCs(root).find(n=>n.id==='soldado_demo'),r=npcRoll(n,{habilidad:'vigor',ventaja:1},()=>33);assert.equal(r.dado,33);assert.equal(r.ne,11);assert.equal(r.capicua,true);
 assert.throws(()=>npcRoll(n,{habilidad:'inexistente'},()=>33));
});
test('una excepción explícita permite dos defensas avanzadas y respeta Arrebatado',t=>{
 const {db,root}=fixture(t),npc=loadNPCs(root)[0];npc.defensa_esbirro={maniobras_por_ronda:2,version:'avanzada'};writeNPC({carpeta:npc.carpeta,npc},root);
 let g=createGroup(db,{npc_id:npc.id,cantidad:1},root);const id=g.integrantes[0].id;
 for(let i=0;i<2;i++)g=changeGroup(db,g.id,{revision:g.revision,operacion:'defensa',integrante_id:id});
 assert.throws(()=>changeGroup(db,g.id,{revision:g.revision,operacion:'defensa',integrante_id:id}));
 g=changeGroup(db,g.id,{revision:g.revision,operacion:'ronda'});g=changeGroup(db,g.id,{revision:g.revision,operacion:'integrante',integrante_id:id,estados:['Arrebatado']});
 assert.throws(()=>changeGroup(db,g.id,{revision:g.revision,operacion:'defensa',integrante_id:id}));
});
test('el seguimiento sobrevive a cerrar y reabrir SQLite en disco',t=>{
 const {root}=fixture(t),file=join(root,'encounter-test.db');let db=new DatabaseSync(file);initNPCs(db);
 const g=createGroup(db,{npc_id:'soldado_demo',cantidad:2},root);changeGroup(db,g.id,{revision:0,operacion:'impacto',todos:true,grave:true});db.close();
 db=new DatabaseSync(file);try{const persisted=npcGroups(db);assert.equal(persisted[0].id,g.id);assert(persisted[0].integrantes.every(m=>m.graves===1));}finally{db.close();}
});
test('API protege DM, compañeros del PJ y archivos; cambios persisten al recrear servidor',async t=>{
 const {db,root}=fixture(t),dmToken='DM_test_only';let server=makeServer(db,{dmToken,npcRoot:root,random100:()=>43});
 const token=issueCharacterToken(db,1,{replace:true});
 // Ejecuta el handler HTTP real sin sockets: el sandbox bloquea loopback.
 const req=(path,{method='GET',body,dm=false,pj=false}={})=>new Promise((done,reject)=>{
  const request=Readable.from(body===undefined?[]:[Buffer.from(JSON.stringify(body))]);request.url=path;request.method=method;request.headers={host:'localhost',...(dm?{'x-gideon-dm-token':dmToken}:{}),...(pj?{authorization:'Bearer '+token}:{})};request.socket={remoteAddress:'127.0.0.1'};
  let status;server.emit('request',request,{writeHead(s){status=s;},end(raw){try{done({status,data:JSON.parse(raw)});}catch(e){reject(e);}}});
 });
 assert.equal((await req('/api/dm/npcs')).status,403);assert.equal((await req('/api/dm/npcs',{pj:true})).status,403);assert.equal((await req('/NPCs/minons/soldado_demo.json')).status,404);
 assert.equal((await req('/sql/dm-access.local.json')).status,404);assert.equal((await req('/api/personajes/1/companeros')).status,401);
 const link=await req('/api/dm/npcs/vinculos',{method:'POST',dm:true,body:{personaje_id:1,npc_id:'zombi_demo',cantidad:2,control:'esclavo'}});assert.equal(link.status,200);
 const v=link.data.vinculos.at(-1);const roster=await req('/api/dm/npcs/grupos',{method:'POST',dm:true,body:{npc_id:v.npc_id,cantidad:2,vinculo_id:v.id}});assert.equal(roster.status,201);
 const g=roster.data.grupos[0];assert.equal((await req('/api/dm/npcs/grupos/'+g.id,{method:'PATCH',pj:true,body:{revision:0,operacion:'ronda'}})).status,403);
 const aguante=await req('/api/dm/npcs/grupos/'+g.id,{method:'PATCH',dm:true,body:{revision:g.revision,operacion:'aguante',vigoroso:3,duro:2}});assert.equal(aguante.status,200);assert.equal(aguante.data.grupos[0].npc.rasgos.find(r=>r.id==='duro').cantidad,2);
 const own=await req('/api/personajes/1/companeros',{pj:true});assert.equal(own.data.at(-1).npc.id,'zombi_demo');assert(!JSON.stringify(own.data).includes('bandido_demo'));
 assert.equal((await req('/api/personajes/9999/companeros',{pj:true})).status,404);
 assert.equal((await req('/api/personajes/1/companeros/tiradas',{method:'POST',pj:true,body:{vinculo_id:'no',habilidad:'vigor'}})).status,404);
 const roll=await req('/api/personajes/1/companeros/tiradas',{method:'POST',pj:true,body:{vinculo_id:v.id,habilidad:'vigor'}});assert.equal(roll.status,200);assert.equal(roll.data.dado,43);
 server=makeServer(db,{dmToken,npcRoot:root});assert.equal((await req('/api/dm/npcs',{dm:true})).data.grupos[0].id,g.id);
});
