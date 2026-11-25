export function shieldStats(base, level=1) {
  const n=Math.min(10,Math.max(1,Number(level)));
  const curve=(40000**((n-1)/9)-1)/39999;
  return {...base,nivel_equipo:n,
    coste_oro:Math.round(base.precio_min+(base.precio_max-base.precio_min)*curve),
    proteccion_bloqueo:Math.ceil(base.multiplicador_proteccion*n),
    peso_kg:Math.floor(base.peso_min+(base.peso_max-base.peso_min)*curve)};
}
