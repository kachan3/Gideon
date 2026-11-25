export const LOCATIONS=['Pendiente','Mano principal','Mano secundaria','Armadura','Arma 1','Arma 2','Arma 3','Alforja 1','Alforja 2','Alforja 3','Carcaj','Mochila','Piso','Campamento','Transferir'];
export function weaponPrice(category,level){
 const ranges={Militar:[5,20000],Cotidiana:[3,15000],Burda:[0,10000]};
 const [min,max]=ranges[category];
 return Math.round(min+(max-min)*(40000**((level-1)/9)-1)/39999);
}
export const carriedLocation=location=>['Mano principal','Mano secundaria','Armadura','Arma 1','Arma 2','Arma 3','Alforja 1','Alforja 2','Alforja 3','Carcaj','Mochila'].includes(location);
