import test from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {listenLocal} from './startup.mjs';
function serverWith(code){const server=new EventEmitter();server.listen=(port,host,ready)=>queueMicrotask(()=>code?server.emit('error',Object.assign(Error('listen '+code),{code})):ready());return server;}
test('arranca una instancia local y publica su URL',async()=>{
 const output=[],server=serverWith();assert.equal(await listenLocal(server,{log:s=>output.push(s)}),'started');assert(output[0].includes('http://localhost:8000'));assert.equal(server.listenerCount('error'),0);
});
test('abrir por segunda vez reconoce Gideon sin excepción ni otra instancia',async()=>{
 const output=[];assert.equal(await listenLocal(serverWith('EADDRINUSE'),{probe:async()=>true,log:s=>output.push(s)}),'already-running');assert(output.some(s=>s.includes('ya está iniciado')));
});
test('un puerto ocupado por otra aplicación muestra una explicación sin stacktrace',async()=>{
 const output=[];assert.equal(await listenLocal(serverWith('EADDRINUSE'),{probe:async()=>false,error:s=>output.push(s)}),'failed');assert(output[0].includes('puerto 8000'));assert(output[1].includes('Ctrl+C'));
});
test('otros errores de escucha también se manejan y se rechaza PORT inválido',async()=>{
 const output=[];assert.equal(await listenLocal(serverWith('EACCES'),{error:s=>output.push(s)}),'failed');assert(output[0].includes('EACCES'));assert.throws(()=>listenLocal(serverWith(),{port:0}),/PORT/);
});
