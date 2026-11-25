// El arranque duplicado no debe terminar con una excepción sin manejar.
export async function runningCompanion(port){
 try{
  const r=await fetch(`http://127.0.0.1:${port}/api/health`,{signal:AbortSignal.timeout(1200)});
  return r.ok&&(await r.json()).app==='gideon-companion';
 }catch{return false;}
}
export function listenLocal(server,{port=8000,log=console.log,error=console.error,probe=runningCompanion}={}){
 if(!Number.isInteger(port)||port<1||port>65535)throw Error('PORT debe ser un puerto entre 1 y 65535');
 return new Promise(resolve=>{
  const failed=async e=>{
   if(e.code==='EADDRINUSE'){
    if(await probe(port)){
     log(`Gideon Companion ya está iniciado: http://localhost:${port}`);
     log('Usá esa ventana del navegador. No hace falta ejecutar start.cmd otra vez.');
     resolve('already-running');return;
    }
    error(`No se inició otra instancia: el puerto ${port} ya está ocupado.`);
    error(`Si Gideon está abierto, usá http://localhost:${port}. Para reiniciarlo, cerrá su consola anterior con Ctrl+C y volvé a abrir start.cmd.`);
   }else error(`No se pudo iniciar Gideon Companion: ${e.message}`);
   resolve('failed');
  };
  server.once('error',failed);
  server.listen(port,'127.0.0.1',()=>{
   server.removeListener('error',failed);
   log(`Gideon Companion: http://localhost:${port}`);resolve('started');
  });
 });
}
