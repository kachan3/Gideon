ALTER TABLE personajes ADD COLUMN oro INTEGER NOT NULL DEFAULT 200 CHECK(oro>=0);
ALTER TABLE personajes ADD COLUMN equipo_inicial_completo INTEGER NOT NULL DEFAULT 0;
ALTER TABLE inventario ADD COLUMN ubicacion TEXT NOT NULL DEFAULT 'Pendiente';
ALTER TABLE inventario ADD COLUMN destinatario TEXT NOT NULL DEFAULT '';
ALTER TABLE inventario ADD COLUMN nivel_arma INTEGER CHECK(nivel_arma BETWEEN 1 AND 10);
UPDATE inventario SET nivel_arma=(SELECT nivel_arma FROM armas WHERE id=inventario.arma_id) WHERE arma_id IS NOT NULL;
UPDATE inventario SET ubicacion=CASE WHEN transportado=0 THEN 'Campamento' WHEN equipado=1 AND armadura_id IS NOT NULL THEN 'Armadura' WHEN equipado=1 AND mano='Principal' THEN 'Mano principal' WHEN equipado=1 AND mano='Secundaria' THEN 'Mano secundaria' ELSE 'Mochila' END WHERE retirado=0;
CREATE TABLE compras_equipo (
 id INTEGER PRIMARY KEY, personaje_id INTEGER NOT NULL REFERENCES personajes(id),
 solicitud TEXT NOT NULL, inventario_id INTEGER NOT NULL REFERENCES inventario(id),
 coste_oro INTEGER NOT NULL CHECK(coste_oro>=0), fecha TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(personaje_id,solicitud)
);
