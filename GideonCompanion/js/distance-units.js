// Las unidades de tablero se convierten numéricamente, incluidos rangos y áreas.
const number='\\d+(?:[.,]\\d+)?';
const quantity=`${number}(?:\\s*(?:/|×|x|–|—|→|a)\\s*${number})*`;
const imperial=new RegExp(`(?<![\\w.,])(${quantity})\\s*(?:feet|feets|foot|ft|pies|pie)(?:\\s*(cuadrados?|cúbicos?)|([²³])|\\^([23]))?(?![\\w])`,'gi');
const format=n=>String(Number(n.toFixed(10)));
export function distancesToUnits(text){
 const converted=text.replace(imperial,(_,values,word,power,caret)=>{
  const dimension=power==='²'||caret==='2'||/cuadrad/i.test(word??'')?2:power==='³'||caret==='3'||/cúbic/i.test(word??'')?3:1;
  const converted=values.replace(/\d+(?:[.,]\d+)?/g,n=>format(Number(n.replace(',','.'))/5**dimension));
  return `${converted} ${dimension===2?'unidades²':dimension===3?'unidades³':Number(converted)===1?'unidad':'unidades'}`;
 });
 return converted;
}
export function metricDistancesToUnits(text){
 const metric=new RegExp(`(?<![\\w.,])(${quantity})\\s*(kilómetros?|kilometros?|km|metros?|m)([²³])?(?![\\w])`,'gi');
 return text.replace(metric,(_,values,unit,power)=>{
  const dimension=power==='²'?2:power==='³'?3:1,factor=(/^k/i.test(unit)?1000:1)/1.5;
  return values.replace(/\d+(?:[.,]\d+)?/g,n=>format(Number(n.replace(',','.'))*factor**dimension))+' unidades'+(power??'');
 });
}
export function distanceDataToUnits(value){
 if(typeof value==='string')return distancesToUnits(value);
 if(Array.isArray(value)){
  const out=value.map(distanceDataToUnits);
  if(out.length>=4&&typeof out[2]==='number'&&/^(pies|feet|feets|ft)$/i.test(out[3])){out[2]/=5;out[3]='unidades';}
  return out;
 }
 if(value&&typeof value==='object'){
  const out=Object.fromEntries(Object.entries(value).map(([k,v])=>[k,distanceDataToUnits(v)]));
  if(/^(pies|feet|feets|ft)$/i.test(out.unidad??'')&&typeof out.valor==='number'){out.valor/=5;out.unidad='unidades';}
  return out;
 }
 return value;
}
