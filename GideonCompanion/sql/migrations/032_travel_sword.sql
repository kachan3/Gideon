ALTER TABLE armas ADD COLUMN archivada INTEGER NOT NULL DEFAULT 0 CHECK(archivada IN (0,1));

-- Conserva los registros históricos; los ejemplares pasan a la base vigente.
UPDATE inventario
SET nivel_arma=COALESCE(nivel_arma,(SELECT nivel_arma FROM armas WHERE id=inventario.arma_id)),
    arma_id=(SELECT id FROM armas WHERE nombre='Espada larga')
WHERE arma_id IN (SELECT id FROM armas WHERE nombre='Espada larga de viaje — nivel 4')
  AND EXISTS(SELECT 1 FROM armas WHERE nombre='Espada larga');
UPDATE items_magicos SET arma_id=(SELECT id FROM armas WHERE nombre='Espada larga')
WHERE arma_id IN (SELECT id FROM armas WHERE nombre='Espada larga de viaje — nivel 4')
  AND EXISTS(SELECT 1 FROM armas WHERE nombre='Espada larga');
UPDATE artefactos_arcanos SET arma_id=(SELECT id FROM armas WHERE nombre='Espada larga')
WHERE arma_id IN (SELECT id FROM armas WHERE nombre='Espada larga de viaje — nivel 4')
  AND EXISTS(SELECT 1 FROM armas WHERE nombre='Espada larga');
UPDATE armas SET archivada=1
WHERE nombre='Espada larga de viaje — nivel 4'
  AND EXISTS(SELECT 1 FROM armas WHERE nombre='Espada larga');
UPDATE armas SET nombre='Espada larga',descripcion='Espada larga militar.',puntos_balance_inicial=3
WHERE nombre='Espada larga de viaje — nivel 4' AND archivada=0;
