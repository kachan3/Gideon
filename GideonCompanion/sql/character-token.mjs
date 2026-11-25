// Recuperación local del propietario del servidor. Invalida el token anterior.
import {openDatabase,transaction} from './server.mjs';
import {issueCharacterToken} from './access.mjs';
const id=Number(process.argv[2]);if(!Number.isSafeInteger(id)||id<1)throw Error('Uso: node sql/character-token.mjs ID_DEL_PERSONAJE');
const db=openDatabase();try{const token=transaction(db,()=>issueCharacterToken(db,id,{replace:true}));process.stdout.write(token+'\n');}finally{db.close();}
