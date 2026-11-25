> **Módulo nuevo — canonizado por Hassan el 2026-07-15.** Transcripción del aporte verbal/escrito de Hassan sobre el diseño y balance de armas. Complementa `Core_14_Equipamiento.md` (§14). Herramienta de DM para construir y balancear armas a pedido de los jugadores.

# DMs_Blacksmit — La Herrería del Máster

## 1. Principio de diseño

El presupuesto de propiedades y la exigencia de balance 0 del catálogo del Core se aplican únicamente a los ítems mundanos. Los ítems mágicos pueden superar a sus equivalentes mundanos y exceder su presupuesto sin compensar las ventajas adicionales.

Las armas son una **pieza clave de Gideon**. Toda arma puede entenderse por sus **propiedades** y sus **atributos**. Este módulo no solo lista armas terminadas para que los personajes las empleen: entrega también las **bases para armar cualquier combinación** que un jugador pueda solicitar, siempre dentro de las **normas de balance** que siguen.

## 2. Referencia de diseño

Las armas se construyen a partir del presupuesto de su categoría, su nivel y sus propiedades.

## 3. Nivel y daño (1–10)

Toda arma **suma al daño una cantidad igual a su nivel**, en una escala de **1 a 10**.

**la peor y la mejor espada del mundo comparten las mismas propiedades**; lo que varía entre ellas es el **daño** (es decir, el **nivel**).

Esto separa dos ejes independientes de un arma:

- **Nivel (1–10)** → cuánto **daño** aporta. Representa calidad/estatus del arma (ver §14.6.1, "Nivel de Equipo").
- **Propiedades** → la **variedad** mecánica (positivas y negativas). No afectan el daño base; afectan el **balance**.

## 4. Las tres categorías de arma

La distinción entre categorías **no** está en el daño, sino en el **balance mecánico** de partida. Cada categoría arranca con una **reserva de puntos de balance** distinta:

| Categoría | Puntos de balance iniciales | Lectura |
|---|---|---|
| **Armas Burdas** | **0** | Toscas; sin margen para ventajas gratis. |
| **Armas Cotidianas** | **+1** | De uso común; un pequeño margen. |
| **Armas Militares** | **+3** | Disponen de tres puntos para adquirir ventajas antes de necesitar limitaciones que compensen. |

> **Por qué el balance no siempre está en el arma.** No todas las armas están balanceadas del mismo modo, porque **el balance puede residir en otro sitio** (requisitos, contexto de uso, acceso, coste) y no en el arma en sí. Las categorías son la forma explícita de repartir ese margen.

## 5. Regla de los puntos de balance

Cada arma parte de los puntos de su categoría y se ajusta al añadir propiedades. Las propiedades tienen **magnitud** *(canon 2026-07-15)*: existen en grados **+1, +2, +3** (positivas) y **−1, −2, −3** (negativas). El grado mide su peso.

- Añadir una **propiedad positiva** → **resta** su magnitud (1, 2 o 3) de puntos de balance.
- Añadir una **propiedad negativa** → **suma** su magnitud (1, 2 o 3) de puntos de balance.

**Coste de las ventajas.** Las magnitudes 1, 2 y 3 se descuentan de la reserva del arma. Para valorar una ventaja, usá estos criterios:

| Coste | Efecto sobre el balance | Criterio y ejemplos |
|---:|---:|---|
| 1 | −1 | Aporta practicidad o una opción extra. **Multiuso** permite elegir el tipo de daño y **Ventaja de Rango** limita los contraataques. |
| 2 | −2 | Suele aumentar el daño. Es el coste de referencia para las ventajas cuyo beneficio principal es ofensivo y se expresa en daño adicional. |
| 3 | −3 | Cambia una condición fundamental del combate o concede un beneficio muy específico de gran impacto. **Alcance (Reach)** permite atacar cuerpo a cuerpo a 2 bloques en vez de 1. |

Las armas ofrecidas en el **catálogo del Core** deben gastar toda su reserva y terminar con **balance 0**. Una Burda puede lograrlo sin propiedades o compensando ventajas con limitaciones de igual coste total.

**Condición de validez:** toda arma debe **terminar en 0 o más**. Un arma puede quedar por encima de 0, pero eso la vuelve **poco deseable**. El sistema **no prohíbe la mala optimización**: la deja ser. Un costal de harina empuñado como arma será **Pesada** y no tendrá ventajas adicionales — es válido, solo malo. *(Ver §4: el balance puede residir fuera del arma.)*

**Cómo se traduce por categoría** (con la condición "≥ 0", asumiendo grados +1):

- **Burda (0):** cualquier positiva la dejaría en negativo. Por tanto **solo puede tomar positivas si las empareja con negativas** de igual magnitud (canje neto 0). *(Intencional — confirmado por Hassan: una Burda adquiere ventajas mediante canjes.)*
- **Cotidiana (+1):** dispone de **1 punto** de margen (una positiva +1, o parte de una mayor pagada con negativas).
- **Militar (+3):** dispone de **3 puntos** de margen antes de necesitar una negativa.

## 6. Catálogo de propiedades (base para construir armas)

Los efectos de las propiedades se definen en [Equipamiento](Core_14_Equipamiento.md#144-propiedades-de-las-armas). Esta tabla indica su signo al diseñar un arma.

**Regla de clasificación** *(canon 2026-07-15)*: las propiedades que son **limitación o penalización** cuentan como **negativas** (devuelven puntos); las que **aportan** son **positivas** (cuestan puntos).

| Propiedad | Signo |
|---|---|
| Versátil (propiedad) | **0** |
| Multiuso | **+** |
| Ágil (antes Sutil) | **+** (coste 2) |
| Alcance | **+** |
| Ventaja de Rango | **+** |
| Desventaja de Rango | **−** (devuelve 1) |
| Ejecución | **+** |
| Arrojadiza (X/Y) | **+** |
| A Distancia (X/Y) en armas de Proyectiles | **0** |
| Recarga | **−** |
| Veloz | **+** (coste 1) |
| Guardia | **0** |
| Carece de Guardia | **−** (devuelve 1) |
| Penetración (X) | **+** |
| Wounding (X) | **+** |
| Brutal | **+** |
| Resistente | **+** (coste 1) |
| Pesada (X) | **−** |
| A Dos Manos | **−** |
| Imprecisa (X) | **−** |
| Lenta (X) | **−** |
| Complicada / Difícil / Muy Difícil | **−** (devuelven 1 / 2 / 3) |
| Torpe (5 / 2 / 0) | **−** (devuelve 1 / 2 / 3) |
| Special Training | **−** |

> **Magnitud de cada propiedad.** El signo queda fijado arriba; el **grado exacto (±1/±2/±3)** de cada propiedad se asigna al construir/canonizar cada arma. Cuando una propiedad lleva parámetro (Versátil (X), Pesada (X), etc.), la magnitud puede ligarse a X.
> Para Penetración y Wounding, usá el valor de X indicado en Equipamiento.

> `[ESQUELETO]` **Propiedades adicionales.** Hassan indicó que agregará más propiedades a este catálogo.

### Desventaja de Rango

**Desventaja de Rango** es una propiedad negativa de magnitud **1**, que devuelve **+1 punto** al balance del arma. Para las acciones que requieren Ventaja de Rango, como Contraataque, un arma con Desventaja de Rango solo cumple la condición frente a otra arma que también tenga Desventaja de Rango. Por ejemplo, una daga puede contraatacar a otra daga o arma corta con esta propiedad.

### Guardia y Carece de Guardia

**Guardia** tiene coste **0** y habilita Deflectar y Parry con el arma. **Carece de Guardia** es una desventaja que devuelve **1 punto** al balance e impide usar esas maniobras con el arma. Ambas propiedades son mutuamente excluyentes. Las armas A Distancia son incapaces de tener Guardia por su funcionamiento y no reciben puntos por Carece de Guardia. Esta restricción no se extiende a las armas melee con Arrojadiza.

### Ágil, Veloz y Versátil *(canónico — Hassan, 2026-11-21)*

**Ágil** permite usar Fuerza o Agilidad para calcular el daño. Cuesta **2 puntos** (−2 al balance). **Veloz** evita Arrebatado bajo las condiciones definidas en Equipamiento. Cuesta **1 punto** (−1 al balance).

**Versátil (propiedad)** tiene coste **0**. Permite empuñar el arma a una o dos manos y contiene una propiedad positiva que se activa mientras se usa a dos manos. Por ejemplo, **Versátil (Wounding)** otorga Wounding al empuñarla a dos manos. La propiedad contenida forma parte de Versátil y no agrega un coste separado al presupuesto.

### Perfiles de armas definidos por Hassan — 2026-11-20

| Arma | Propiedades |
|---|---|
| Daga (Militar) | Veloz, Ágil, Arrojadiza, Carece de Guardia, Desventaja de Rango |
| Espada larga (Longsword) | Guardia, Multiuso, Ventaja de Rango, Versátil (Wounding) |
| Hacha de batalla | Brutal, Wounding, Carece de Guardia |
| Martillo de guerra (Warhammer) | Penetración, Resistente, Carece de Guardia |
| Pica | Alcance (Reach), Pesada (70), Penetración |

La espada larga posee Wounding mientras se empuña a dos manos. La pica requiere 70 de Fuerza por Pesada (70). Las lanzas pueden tener perfiles distintos según su tipo. Estos perfiles registran las propiedades indicadas por Hassan; los costes individuales aún pendientes se fijan al cerrar el catálogo.

### Lenta y combos

**Lenta (1)** agrega **1 acción** al coste de todos los combos realizados con esa arma, excepto **Golpe Brutal**, cuyo coste no aumenta por esta propiedad. Este incremento es el coste adicional de Lenta aplicado al combo.

### Dificultad del arma

Estas desventajas aplican una penalización de dificultad a las tiradas de ataque realizadas con el arma y devuelven los puntos de balance indicados.

| Desventaja | Penalización al ataque | Balance |
|---|---:|---:|
| Complicada | −10 | +1 |
| Difícil | −20 | +2 |
| Muy Difícil | −30 | +3 |

### Torpe (X)

El oponente puede evitar el impacto mediante **Evasión (Dodge)** obteniendo un **Nivel de Éxito igual o mayor que X**. Cuanto menor es X, más sencillo resulta esquivar el ataque y más puntos devuelve la desventaja.

| Desventaja | NE requerido en Evasión | Balance |
|---|---:|---:|
| Torpe (5) | ≥ 5 | +1 |
| Torpe (2) | ≥ 2 | +2 |
| Torpe (0) | ≥ 0 | +3 |

En Torpe (0), una tirada exitosa de Evasión con NE 0 alcanza para evitar el impacto.

### Special Training — entrenamiento especial

**Special Training** es una **propiedad negativa del arma**. Para usarla efectivamente, el personaje debe poseer el **dote de entrenamiento correspondiente**. Este dote puede ser secreto o tener requisitos adicionales de XP o de otras habilidades.

Si el personaje intenta emplear el arma **sin poseer ese dote**:

- El **valor de la habilidad marcial utilizada para atacar con esa arma se reduce a la mitad**.
- **No obtiene los beneficios de los rasgos positivos del arma**.

## 7. Plantilla para construir un arma a pedido

1. Elegir **categoría** → fija los puntos iniciales (Burda 0 / Cotidiana +1 / Militar +3).
2. Elegir **nivel (1–10)** → fija el **daño** que suma el arma.
3. Añadir **propiedades**: cada positiva **resta** su magnitud (1/2/3), cada negativa **suma** su magnitud (1/2/3).
4. Verificar la **condición ≥ 0**. Si queda > 0, el arma es válida pero subóptima (permitido).

---

## 8. Falencias — estado (resueltas por Hassan 2026-07-15)

**F-1 ✅ Resuelta.** Clasificación por deducción: propiedad que **limita o penaliza** = negativa; propiedad que **aporta** = positiva. Aplicado en §6.

**F-2 ✅ Resuelta.** Se añade flexibilidad: las propiedades existen en grados **+1/+2/+3** y **−1/−2/−3**; el coste/devolución escala con la magnitud. Aplicado en §5.

**F-3 ✅ Confirmada como intencional.** Una Burda no puede superar al palo sin cargar una desventaja: es a propósito. Registrado en §5.

**F-4 ✅ Resuelta.** Ver [propiedades de armas](Core_14_Equipamiento.md#144-propiedades-de-las-armas).

**F-5 — No es falencia (decisión de diseño).** El sistema **no prohíbe la mala optimización**; la permite. Un arma en > 0 es simplemente subóptima, no inválida (p. ej. un costal de harina = Pesada sin ventajas). Registrado en §5.

**F-6 — No es falencia.** Hassan no se opone a los niveles como concepto aplicado a cosas distintas de los jugadores (armas, equipo). El uso de "nivel 1–10" para armas es correcto.

---

## 9. La Herrería de Armaduras *(canonizado por Hassan 2026-08-10)*

> Este módulo complementa la Herrería de Armas (§§1–8) con el sistema equivalente para **diseñar y balancear armaduras** a pedido de los jugadores. Las reglas canónicas completas están en `Core_14_Equipamiento.md` §14.6.

### 9.1 Principio de diseño

Las armaduras, al igual que las armas, son **piezas clave de Gideon**. Desde la decisión de Hassan del 2026-11-04, la categoría fija los multiplicadores finales y el nivel determina la protección. El motor vigente elimina el reparto de puntos para simplificar el diseño y el balance.

### 9.2 Perfiles finales por categoría *(Hassan — 2026-11-04)*

| Categoría | Cortante | Punzante | Contundente |
|---|---|---|---|
| Ligera | 0,5 | 0,5 | 1 |
| Mediana | 0,5 | 1 | 1 |
| Pesada | 1 | 1 | 1,5 |

Estos son multiplicadores **finales**. No se añade una base general y no se reparten puntos entre tipos.

### 9.3 Fórmula vigente

> **Reducción de Daño por tipo = ⌈Multiplicador del perfil × Nivel de Equipo⌉**.

Se redondea **hacia arriba** cada resultado. En la ficha se anotan los tres valores finales C/P/B. Esta decisión reemplaza el motor anterior de base + puntos y su redondeo hacia abajo.

<details>
<summary>Perfiles y fórmula anteriores — histórico, sin vigencia desde 2026-11-04</summary>

### 9.2 Las tres categorías

| Categoría | Puntos Asignables | General (base por tipo) | Lectura |
|---|---|---|---|
| **Ligera** | **1** | 0.5 | Protección básica; liviana, barata, compatible con Dotes veloces. |
| **Mediana** | **2** | 1.0 | Balance entre protección y movilidad; accesible a todos. |
| **Pesada** | **3** | 1.5 | Máxima protección; requiere Dote y Carga suficiente. |

- **General** se aplica automáticamente a los tres tipos de daño (S/P/B).
- **Puntos Asignables** se distribuyen libremente (pueden fraccionarse) entre **S** (Cortante), **P** (Punzante) y **B** (Contundente) al momento de diseñar la armadura.

### 9.3 La fórmula

> **Multiplicador de un tipo = General + Puntos asignados a ese tipo**
>
> **Reducción de Daño = Multiplicador × Nivel de Equipo (round down)**

El jugador anota en su ficha los **tres números finales** (ej. S:7 / P:2 / B:2). En combate solo consulta esos valores.

</details>

### 9.4 Nivel de Equipo (1–10)

Mismo concepto que en armas (§3): representa la **calidad y estatus** de la pieza.

| Nivel | Significado |
|---|---|
| 1 | Improvisado, mala calidad |
| 5 | Estándar militar |
| 10 | Mítico / divino |

### 9.5 Requisitos de portado

**Ligeras y medianas:** sin restricciones. Cualquier personaje puede portarlas.

**Pesada:** requiere cumplir **ambas** condiciones:

1. **Dote: Entrenado en Armadura Pesada** (varias clases lo otorgan de base).
2. **Nivel de Carga ≥ Nivel de Equipo** de la armadura.

**Sin cumplir cualquiera:** el personaje obtiene la protección pero sufre:

- Tiradas de **Fuerza, Agilidad, Melee y Proyectiles** → **Difícil**.
- **No puede realizar componentes somáticos**.
- **Pierde una acción** por turno.

**Penalizaciones inherentes de la pesada** (incluso cumpliendo requisitos): desventaja en **sigilo**, posibles modificadores a discreción del DM.

### 9.6 Plantilla para crear una armadura

1. Elegir categoría: Ligera, Mediana o Pesada; fija el perfil final.
2. Elegir Nivel de Equipo (1–10).
3. Multiplicar cada coeficiente por el nivel y redondear hacia arriba.
4. Anotar C/P/B y verificar los requisitos de portado.

### 9.7 Ejemplos vigentes

| Armadura | Nivel | Perfil C/P/B | Reducciones C/P/B |
|---|---|---|---|
| Ligera | 3 | 0,5 / 0,5 / 1 | **2 / 2 / 3** |
| Mediana | 3 | 0,5 / 1 / 1 | **2 / 3 / 3** |
| Pesada | 5 | 1 / 1 / 1,5 | **5 / 5 / 8** |

<details>
<summary>Plantilla y ejemplos anteriores — histórico, sin vigencia desde 2026-11-04</summary>

### 9.6 Plantilla para construir una armadura a pedido

1. Elegir **categoría** → fija los Puntos Asignables y el General.
2. Elegir **Nivel de Equipo (1–10)** → determina la potencia y los requisitos (en pesada: Carga ≥ NE).
3. **Distribuir los Puntos Asignables** entre S, P y B (pueden fraccionarse).
4. Calcular **Multiplicador** de cada tipo = General + Asignado.
5. Calcular **Reducción** de cada tipo = Multiplicador × Nivel de Equipo (round down).
6. Anotar los tres valores finales en la ficha.

### 9.7 Ejemplos de diseño

#### Ejemplo A — Gambesón acolchado (ligera, NE 3, anti-contundente)

Un jugador quiere un gambesón barato que amortigüe golpes. Nivel 3 (artesano local).

| Tipo | General | Asignado | Mult | × NE 3 | **Reducción** |
|---|---|---|---|---|---|
| S | 0.5 | 0 | 0.5 | 1.5 | **1** |
| P | 0.5 | 0 | 0.5 | 1.5 | **1** |
| B | 0.5 | 1 | 1.5 | 4.5 | **4** |

**Ficha:** S:1 / P:1 / B:4

#### Ejemplo B — Cota de malla (mediana, NE 5, anti-cortante y punzante)

Armadura estándar militar. El jugador distribuye: 1 en S, 1 en P, 0 en B.

| Tipo | General | Asignado | Mult | × NE 5 | **Reducción** |
|---|---|---|---|---|---|
| S | 1.0 | 1 | 2.0 | 10 | **10** |
| P | 1.0 | 1 | 2.0 | 10 | **10** |
| B | 1.0 | 0 | 1.0 | 5 | **5** |

**Ficha:** S:10 / P:10 / B:5

#### Ejemplo C — Armadura de placas ceremonial (pesada, NE 7, balanceada)

Un paladín con el Dote y Carga 7. Distribuye: 1 en S, 1 en P, 1 en B.

| Tipo | General | Asignado | Mult | × NE 7 | **Reducción** |
|---|---|---|---|---|---|
| S | 1.5 | 1 | 2.5 | 17.5 | **17** |
| P | 1.5 | 1 | 2.5 | 17.5 | **17** |
| B | 1.5 | 1 | 2.5 | 17.5 | **17** |

**Ficha:** S:17 / P:17 / B:17

#### Ejemplo D — Armadura especializada anti-lanza (pesada, NE 5, concentrada en P)

Un guerrero que enfrenta piqueros. Concentra: 0 en S, 3 en P, 0 en B.

| Tipo | General | Asignado | Mult | × NE 5 | **Reducción** |
|---|---|---|---|---|---|
| S | 1.5 | 0 | 1.5 | 7.5 | **7** |
| P | 1.5 | 3 | 4.5 | 22.5 | **22** |
| B | 1.5 | 0 | 1.5 | 7.5 | **7** |

**Ficha:** S:7 / P:22 / B:7

> **Nota para el DM.** Concentrar todos los puntos en un solo tipo genera armaduras muy especializadas. Esto es intencional: el jugador sacrifica protección general a cambio de supremacía contra un tipo de daño. El entorno (enemigos, campaña) determina si esa apuesta es sabia o temeraria.

</details>

## Precios de armas mundanas en oro

El precio se calcula automáticamente según la categoría y el Nivel de Equipo (N, de 1 a 10). Los rangos definidos por Hassan son:

| Categoría | Precio nivel 1 | Tope y precio nivel 10 |
|---|---:|---:|
| Militar | 5 | 20.000 |
| Cotidiana / Civil | 3 | 15.000 |
| Burda | 0 | 10.000 |

Para conservar la curva exponencial elegida y permitir un precio inicial de cero, se usa una curva normalizada común:

F(N) = (40.000^((N − 1) / 9) − 1) / 39.999

Precio(N) = min(Pmáx, max(Pmín, redondear(Pmín + (Pmáx − Pmín) × F(N))))

Se redondea al oro entero más cercano. Cada categoría guarda Pmín y Pmáx; el usuario no calcula el precio. El tope se aplica al resultado. Las militares usan Pmín = 5 y Pmáx = 20.000, manteniendo esta curva normalizada común. Los rangos de armaduras se definen a continuación y usan la misma fórmula y redondeo.
### Precios de armaduras en oro

| Categoría | Precio nivel 1 | Tope y precio nivel 10 |
|---|---:|---:|
| Ligera | 5 | 30.000 |
| Mediana | 10 | 50.000 |
| Pesada | 20 | 100.000 |

Se aplica la curva normalizada F(N) y la fórmula de precio anteriores con los extremos de cada categoría. El cálculo es automático y respeta el tope correspondiente.

## Armaduras por base y nivel — actualización vigente

Esta decisión reemplaza el perfil único por categoría y los nueve ejemplos de niveles fijos del catálogo anterior. Existen nueve bases especializadas. Cada ejemplar del personaje guarda su base y su nivel (1–10). Se calculan protección, coste y peso automáticamente.
| Categoría | Especialidad | Cortante | Punzante | Contundente |
|---|---|---:|---:|---:|
| Ligera | Cortante | 1 | 0,5 | 0,5 |
| Ligera | Punzante | 0,5 | 1 | 0,5 |
| Ligera | Contundente | 0,5 | 0,5 | 1 |
| Mediana | Cortante | 1,5 | 0,5 | 0,5 |
| Mediana | Punzante | 0,5 | 1,5 | 0,5 |
| Mediana | Contundente | 0,5 | 0,5 | 1,5 |
| Pesada | Cortante | 1,5 | 1 | 1 |
| Pesada | Punzante | 1 | 1,5 | 1 |
| Pesada | Contundente | 1 | 1 | 1,5 |

Protección por tipo = techo(coeficiente de la base × nivel). Los tres resultados se redondean hacia arriba por separado.

F(N) = (40.000^((N − 1) / 9) − 1) / 39.999

Coste = redondear(Pmín + (Pmáx − Pmín) × F(N)), con tope Pmáx.
Peso en kg = piso(Wmín + (Wmáx − Wmín) × F(N)).

| Categoría | Precio mínimo / máximo en oro | Peso mínimo / máximo en kg |
|---|---|---|
| Ligera | 5 / 30.000 | 2 / 8 |
| Mediana | 10 / 50.000 | 4 / 20 |
| Pesada | 20 / 100.000 | 6 / 200 |

El frontend usa estos cálculos para las vistas previas. El backend comparte las mismas fórmulas para calcular defensas y carga del personaje. Las condiciones de uso de cada categoría siguen aplicándose.
### 14.7 Escudos — bases y nivel

Existen tres bases. Cada escudo del personaje tiene Nivel de Equipo de 1 a 10 y ocupa una mano. Equiparlo cuesta 1 acción.

| Base | Protección física al bloquear | Peso nivel 1–10 | Precio nivel 1–10 en oro | Propiedad |
|---|---|---|---|---|
| Broquel | techo(0,5 × nivel) | 1–5 kg | 5–8.000 | Permite Deflectar y Parry usando Bloqueo en lugar de Paradas. |
| Rodela | techo(1 × nivel) | 3–20 kg | 10–12.000 | Sin propiedad adicional. |
| Torre | techo(1,5 × nivel) | 5–100 kg | 20–18.000 | Al alzarlo mediante Cubrirse, otorga Cobertura Media mientras permanece alzado. |

La protección se aplica a Cortante, Punzante y Contundente cuando corresponde bloquear según [Reacciones Defensivas](../10_Reglas/Reacciones_Defensivas.md#defensa-con-escudo). No es una protección pasiva permanente. El broquel mantiene los requisitos habituales de Deflectar y Parry, sustituyendo el arma con Guardia y la habilidad Paradas por el broquel y Bloqueo.

Se usa la curva común F(N) = (40.000^((N − 1) / 9) − 1) / 39.999.
Peso = piso(Peso mínimo + (Peso máximo − Peso mínimo) × F(N)), en kg.
Precio = redondear(Precio mínimo + (Precio máximo − Precio mínimo) × F(N)), en oro.
Protección se redondea hacia arriba; peso hacia abajo y precio al entero más cercano. Se respetan los extremos de nivel 1 y 10. El frontend calcula estos valores al elegir base y nivel.

Cobertura Media aplica las reglas de [Coberturas](../10_Reglas/Coberturas.md): hacer blanco es Complicado y se recibe la mitad del daño de Ráfagas físicas cuando el escudo se interpone.