> **Módulo nuevo — canonizado por Hassan el 2026-07-15.** Transcripción del aporte verbal/escrito de Hassan sobre el diseño y balance de armas. Complementa `Core_14_Equipamiento.md` (§14). Herramienta de DM para construir y balancear armas a pedido de los jugadores.

# DMs_Blacksmit — La Herrería del Máster

## 1. Principio de diseño

Las armas son una **pieza clave de Gideon**. Toda arma puede entenderse por sus **propiedades** y sus **atributos**. Este módulo no solo lista armas terminadas para que los personajes las empleen: entrega también las **bases para armar cualquier combinación** que un jugador pueda solicitar, siempre dentro de las **normas de balance** que siguen.

## 2. El arma base: el palo

Tomamos como referencia un **palo**:

- Se usa **a una mano**.
- **Solo transmite la fuerza del usuario + 1** al daño.

El palo es el **arma base** desde la cual se balancean todas las demás. Todo lo que un arma "gana" o "pierde" se mide, conceptualmente, contra este punto de partida.

> **Unificación con §14.1.** El "+1" del palo coincide con la regla canónica de que *las armas suman su nivel al daño* (§14.1): un palo es un arma de **nivel 1**, luego aporta **+1**. Ambas reglas describen lo mismo desde ángulos distintos.

## 3. Nivel y daño (1–10)

Toda arma **suma al daño una cantidad igual a su nivel**, en una escala de **1 a 10**.

Una cosa es un **palo viejo** y otra un **palo divino de un árbol sagrado con incrustaciones de gemas**. Del mismo modo, **la peor y la mejor espada del mundo comparten las mismas propiedades**; lo que varía entre ellas es el **daño** (es decir, el **nivel**).

Esto separa dos ejes independientes de un arma:

- **Nivel (1–10)** → cuánto **daño** aporta. Representa calidad/estatus del arma (ver §14.6.1, "Nivel de Equipo").
- **Propiedades** → la **variedad** mecánica (positivas y negativas). No afectan el daño base; afectan el **balance**.

## 4. Las tres categorías de arma

La distinción entre categorías **no** está en el daño, sino en el **balance mecánico** de partida. Cada categoría arranca con una **reserva de puntos de balance** distinta:

| Categoría | Puntos de balance iniciales | Lectura |
|---|---|---|
| **Armas Burdas** | **0** | Toscas; sin margen para ventajas gratis. |
| **Armas Cotidianas** | **+1** | De uso común; un pequeño margen. |
| **Armas Militares** | **+2** | Diseñadas para la guerra; **dos propiedades positivas antes de necesitar una negativa** que compense. |

> **Por qué el balance no siempre está en el arma.** No todas las armas están balanceadas del mismo modo, porque **el balance puede residir en otro sitio** (requisitos, contexto de uso, acceso, coste) y no en el arma en sí. Las categorías son la forma explícita de repartir ese margen.

## 5. Regla de los puntos de balance

Cada arma parte de los puntos de su categoría y se ajusta al añadir propiedades. Las propiedades tienen **magnitud** *(canon 2026-07-15)*: existen en grados **+1, +2, +3** (positivas) y **−1, −2, −3** (negativas). El grado mide su peso.

- Añadir una **propiedad positiva** → **resta** su magnitud (1, 2 o 3) de puntos de balance.
- Añadir una **propiedad negativa** → **suma** su magnitud (1, 2 o 3) de puntos de balance.

**Condición de validez:** toda arma debe **terminar en 0 o más**. Un arma puede quedar por encima de 0, pero eso la vuelve **poco deseable**. El sistema **no prohíbe la mala optimización**: la deja ser. Un costal de harina empuñado como arma será **Pesada** y no tendrá ninguna ventaja sobre un simple palo — es válido, solo malo. *(Ver §4: el balance puede residir fuera del arma.)*

**Cómo se traduce por categoría** (con la condición "≥ 0", asumiendo grados +1):

- **Burda (0):** cualquier positiva la dejaría en negativo. Por tanto **solo puede tomar positivas si las empareja con negativas** de igual magnitud (canje neto 0). *(Intencional — confirmado por Hassan: una Burda nunca supera al palo salvo por canje.)*
- **Cotidiana (+1):** dispone de **1 punto** de margen (una positiva +1, o parte de una mayor pagada con negativas).
- **Militar (+2):** dispone de **2 puntos** de margen (dos positivas +1, o una +2) antes de necesitar una negativa.

## 6. Catálogo de propiedades (base para construir armas)

Punto de partida solicitado por Hassan: **las propiedades ya definidas en `Core_14_Equipamiento.md` §14.4**. Se listan aquí como inventario de piezas para armar combinaciones. Hassan agregará más propiedades.

**Regla de clasificación** *(canon 2026-07-15)*: las propiedades que son **limitación o penalización** cuentan como **negativas** (devuelven puntos); las que **aportan** son **positivas** (cuestan puntos).

| Propiedad | Efecto (resumen de §14.4) | Signo |
|---|---|---|
| Versátil (X) | A dos manos suma X al daño. | **+** |
| Multiuso | Más de un tipo de daño a elección. | **+** |
| Sutil | Usa Fuerza o Agilidad (elige) para el daño. | **+** |
| Alcance | Cuerpo a cuerpo de 2 bloques en vez de 1. | **+** |
| Ventaja de Rango | El oponente necesita el mismo rasgo para contraatacar/riposte. | **+** |
| Ejecución | Herida garantizada (posible muerte) a criatura en su límite. | **+** |
| Arrojadiza (X/Y) | Puede lanzarse: óptimo X / extendido Y con desventaja. | **+** |
| A Distancia (X/Y) | Ataque con Instinto a rango; óptimo X / extendido Y. | **+** |
| Compleja | Suma 2 de daño por cada NE en la tirada de ataque (en lugar de 1). | **+** |
| Ágil | Evita el estado *Arrebatado* bajo condiciones. | **+** |
| Guardia | Habilita Deflectar y Parry (§11.9). | **+** |
| Penetración (X) | Ignora X de Protección. **X = ½ del nivel del arma, redondeado hacia arriba.** | **+** |
| Wounding (X) | Inflige heridas adicionales. **X = ½ del nivel del arma, redondeado hacia arriba.** *(nueva, 2026-07-15)* | **+** |
| Pesada (X) | Requiere X de Fuerza; sin requisito, penaliza. | **−** |
| A Dos Manos | No puede usarse a una mano. | **−** |
| Imprecisa (X) | Sin X de Instinto, apuntar es Muy Difícil o peor. | **−** |
| Lenta (X) | Requiere X acciones adicionales para atacar. | **−** |

> **Magnitud de cada propiedad.** El signo queda fijado arriba; el **grado exacto (±1/±2/±3)** de cada propiedad se asigna al construir/canonizar cada arma. Cuando una propiedad lleva parámetro (Versátil (X), Pesada (X), etc.), la magnitud puede ligarse a X.
> **Penetración y Wounding** tienen **X fijada por fórmula** (½ del nivel del arma, redondeo hacia arriba), no elegible libremente.

> `[ESQUELETO]` **Propiedades adicionales.** Hassan indicó que agregará más propiedades a este catálogo.

## 7. Plantilla para construir un arma a pedido

1. Elegir **categoría** → fija los puntos iniciales (Burda 0 / Cotidiana +1 / Militar +2).
2. Elegir **nivel (1–10)** → fija el **daño** que suma el arma.
3. Añadir **propiedades**: cada positiva **resta** su magnitud (1/2/3), cada negativa **suma** su magnitud (1/2/3). Penetración y Wounding fijan su X por fórmula (½ nivel, redondeo arriba).
4. Verificar la **condición ≥ 0**. Si queda > 0, el arma es válida pero subóptima (permitido).

---

## 8. Falencias — estado (resueltas por Hassan 2026-07-15)

**F-1 ✅ Resuelta.** Clasificación por deducción: propiedad que **limita o penaliza** = negativa; propiedad que **aporta** = positiva. Aplicado en §6.

**F-2 ✅ Resuelta.** Se añade flexibilidad: las propiedades existen en grados **+1/+2/+3** y **−1/−2/−3**; el coste/devolución escala con la magnitud. Aplicado en §5.

**F-3 ✅ Confirmada como intencional.** Una Burda no puede superar al palo sin cargar una desventaja: es a propósito. Registrado en §5.

**F-4 ✅ Resuelta.** **Penetración** y **Wounding** fijan su parámetro por fórmula: **X = ½ del nivel del arma, redondeado hacia arriba.** Aplicado en §6.

**F-5 — No es falencia (decisión de diseño).** El sistema **no prohíbe la mala optimización**; la permite. Un arma en > 0 es simplemente subóptima, no inválida (p. ej. un costal de harina = Pesada sin ventajas). Registrado en §5.

**F-6 — No es falencia.** Hassan no se opone a los niveles como concepto aplicado a cosas distintas de los jugadores (armas, equipo). El uso de "nivel 1–10" para armas es correcto.
