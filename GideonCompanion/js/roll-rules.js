// Core §11.1: 00–99; bandas automáticas y capicúas independientes.
export const CIRCUMSTANCES=[['Muy Fácil',30],['Fácil',20],['Sencilla',10],['Normal',0],['Complicada',-10],['Difícil',-20],['Muy Difícil',-30],['Extrema',-40]];
export function resolveRoll(dado,valor,{circunstancia='Normal',dificultad=0,ne=0,nf=0,salvataje=null,ventaja=0,desventaja=0,asegurado=false,neExito=0}={}){
 if(!Number.isInteger(dado)||dado<0||dado>99||!Number.isFinite(valor))throw Error('Tirada inválida');
 const circumstance=CIRCUMSTANCES.find(c=>c[0]===circunstancia);if(!circumstance)throw Error('Circunstancia inválida');
 const objetivo=valor+circumstance[1],automatico=dado<=5?'Éxito automático':dado>=95?'Fallo automático':null;
 const original=asegurado||dado<=5||(dado<95&&dado<=objetivo),capicua=dado%11===0;
 const ajuste=ventaja-desventaja;
 let exito=original;
 let NE=original?Math.max(0,(capicua?10:Math.floor(dado/10))+ne+ajuste):0;
 let NF=original?0:Math.max(0,(capicua?10:dado%10)+nf-ajuste);
 const salvado=!original&&salvataje!=null&&NF<=salvataje;
 if(salvado){exito=true;NE=NF;NF=0;}
 if(exito)NE+=neExito;
 const supera=exito&&NE>=dificultad;
 return {dado,valor,objetivo,circunstancia,dificultad,exito,supera,ne:NE,nf:NF,salvado,salvataje,asegurado,ventaja,desventaja,capicua,automatico,critico:capicua?(original?'Portento':'Pifia'):null,
  resultado:exito?`${capicua&&original?'Portento':salvado?'Éxito por Salvataje':'Éxito'} · NE ${NE}${!supera?' · no alcanza la Exigencia de '+dificultad:''}`:`${capicua&&!original?'Pifia':'Fallo'} · NF ${NF}`};
}
export const rollIndex=(dado,valor,options={})=>CIRCUMSTANCES.map(([circunstancia])=>resolveRoll(dado,valor,{...options,circunstancia}));
