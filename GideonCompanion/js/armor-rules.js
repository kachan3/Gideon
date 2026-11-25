export function armorStats(base, level) {
  const n = Math.min(10, Math.max(1, Number(level)));
  const curve = (40000 ** ((n - 1) / 9) - 1) / 39999;
  const ranges = {Ligera:[5,30000,2,8],Mediana:[10,50000,4,20],Pesada:[20,100000,6,200]};
  const [minPrice,maxPrice,minWeight,maxWeight] = ranges[base.categoria];
  return {...base,nivel_equipo:n,
    reduccion_s:Math.ceil(base.multiplicador_s*n),
    reduccion_p:Math.ceil(base.multiplicador_p*n),
    reduccion_b:Math.ceil(base.multiplicador_b*n),
    coste_oro:Math.min(maxPrice,Math.round(minPrice+(maxPrice-minPrice)*curve)),
    peso_kg:Math.floor(minWeight+(maxWeight-minWeight)*curve)};
}
