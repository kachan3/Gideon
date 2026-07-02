# §11 — NÚCLEO DEL SISTEMA DE JUEGO (1d100)

> **Borrador para evaluación — 2026-06-15.** Consolida todo lo trabajado en sesión. Las **🔎 NOTAS DE EVALUACIÓN** marcan decisiones pendientes o una inconsistencia detectada. Los `[ESQUELETO]` son piezas que referenciaste pero dejaste para desarrollar más adelante. Nada de esto reemplaza el Core hasta que lo ratifiques.

---

## 11.1 El Valor y la resolución básica

Toda tarea cuyo resultado es incierto —por dificultad o por factores imprevistos— se resuelve tirando **1d100 (rango 00–99)** y comparándolo contra un **Valor**.

El **Valor** es un número en escala 00–99 que representa la competencia o característica concreta que se está evaluando en esa tarea. Es un concepto **genérico**: puede ser el valor de una habilidad, de un atributo, un valor derivado, el Valor de otra criatura (en enfrentadas) o un número plano que fije el Director. Para el jugador, el Valor más habitual será el de una de sus habilidades, pero el motor es siempre el mismo.

**Resolución:** si el dado es **igual o menor** al Valor → **éxito**; si es **mayor** → **fallo**.

El d100 se simula con dos d10: uno para las **decenas** (00, 10, 20… 90) y otro para las **unidades** (0–9). Siempre se leen las **dos cifras**: una tirada de "7" es **07**.

---

## 11.2 Bandas automáticas

Por encima de cualquier comparación con el Valor, el dado tiene dos bandas que mandan siempre:

- **00–05 → Éxito automático.**
- **95–99 → Fallo automático.**

Las bandas son absolutas a tu propio tier (ver §11.8): **bipasean Salvataje y Exigencia**. Ni la protección contra fallos ni el umbral de éxito pueden alterarlas. Esto garantiza que incluso un maestro puede fallar (~5%) y que casi cualquiera puede tener un golpe de suerte.

> 🔎 **NOTA DE EVALUACIÓN — borde de la banda baja.** La dejé en **00–05** (6 valores) frente a 95–99 (5 valores). Si querías simetría exacta 5/5, debería ser **00–04**. Confirmá cuál.

---

## 11.3 Niveles de Éxito y Fallo (NE / NF) — la lógica del BlackJack

Cuando hacer bien las cosas no basta —cuando hay que medir *cuán bien* o *cuán mal* salió—, se usan los niveles:

- **NE (Nivel de Éxito)** = dígito de las **decenas** de la tirada, si fue éxito. (45 → NE 4; 23 → NE 2.)
- **NF (Nivel de Fallo)** = dígito de las **unidades** de la tirada, si fue fallo. (67 → NF 7; 23 → NF 3.)

La intuición es la del **BlackJack**: buscás acercarte a tu Valor **sin pasarte**. Tu mejor grado de éxito sale del resultado más alto que todavía no supera tu Valor. (Tirar muy bajo te hace pasar con holgura, pero te da un NE pobre.)

> En una **tirada simple** sólo importa éxito/fallo. El NE y el NF únicamente se calculan cuando algo los pide (una enfrentada, un efecto que escale con ellos, un umbral). No hay que computarlos en cada tirada.

---

## 11.4 Portentos y Pifias (capicúa)

*(Reemplaza la antigua terminología de "críticos".)*

Una tirada **capicúa** (ambos dados con el mismo valor: 00, 11, 22, 33, 44, 55, 66, 77, 88, 99) es un crítico:

- Capicúa en **éxito → Portento** (NE 10).
- Capicúa en **fallo → Pifia** (NF 10).

El NE/NF de 10 está por encima de cualquier resultado normal (máximo 9), de modo que los críticos son decisivos en las enfrentadas. El 00 es siempre éxito (además cae en la banda 00–05); el 99, si resulta fallo, es Pifia.

---

## 11.5 Tiradas enfrentadas

Cuando dos fuerzas se oponen, hacer bien las cosas es apenas el mínimo para empezar: gana quien lo haga **mejor**.

1. Gana quien tenga el **NE más alto**.
2. Empate de NE → gana el **valor más alto en el dado**.
3. Sigue el empate → gana la **habilidad (Valor) más alta**.
4. Sigue el empate → se **re-tira**.

**Si ambos fallan:** gana quien tenga el **NF más bajo** (forcejea "menos peor").

Un **Portento** (NE 10) o una **Pifia** (NF 10) son decisivos en la oposición.

> `[ESQUELETO]` La regla "ambos fallan → menor NF gana" abre preguntas por el *wraparound* de las unidades: un 51 (NF 1) es un fallo "casi logrado", pero un 60 (NF 0) cuenta como "mejor fallo" pese a estar más lejos del Valor. Pendiente de afinar (incl. desempates de NF).

---

## 11.6 Modificadores — orden de aplicación

Las tiradas pueden modificarse de varias formas. Los modificadores se aplican **en este orden**. **Regla general:** modificadores opuestos (positivo y negativo) se combinan **sólo dentro de su misma capa/unidad**; nunca se restan entre capas distintas (un dado no se le resta a un porcentaje, ni un porcentaje a un NE).

**Paso 1 — Modificadores de Habilidad (% sobre el Valor).** Dos fuentes:

- **Modificadores explícitos** (feats, equipo, hechizos, reglas): **se suman** entre sí. Suelen venir ya calculados en la hoja.
- **Dificultad circunstancial** (lo que el Director decide en el momento): **prevalece el mayor** (no se acumulan). Si concurren un bono y una penalización del **mismo valor**, se **anulan** → tarea Normal.

| Grado | Mod. |
|---|---|
| Muy Fácil | +30% |
| Fácil | +20% |
| Sencilla | +10% |
| Normal | +0% |
| Complicada | −10% |
| Difícil | −20% |
| Muy Difícil | −30% |
| Extrema | −40% |

**Paso 2 — Dados Extra (Bonificación / Penalización).** Se tiran uno o más **d10 de decenas** adicionales.

- **Bonificación:** el **jugador** elige qué resultado de decena usar.
- **Penalización:** el **Director** elige el peor resultado de decena. *(Descansa en la madurez y el sportmanship de la mesa.)*

*(El dado extra puede crear o romper una capicúa, ya que cambia la decena.)*

**Paso 3 — Niveles de Éxito.** **Refuerzo** (+NE) / **Contrarreste** (−NE). Hacen piso en 0 y **no transforman** un éxito en fallo.

**Paso 4 — Niveles de Fallo.** **Agravio** (+NF) / **Mitigación** (−NF). Hacen piso en 0 y **no transforman** un fallo en éxito.

**Paso 5 — Umbrales (única capa que transforma el resultado).**

- **Exigencia (X):** tu NE debe **igualar o superar X**. Si no lo alcanza, el éxito se convierte en **fallo**.
- **Salvataje (X):** protección contra fallos. Si fallás con **NF < X**, el fallo se convierte en **éxito cuyo NE = el NF original**. Si **NF ≥ X**, el fallo se mantiene.
  - *Ejemplo:* Espadas 50, Salvataje 3. Sale **72** → fallo, NF = 2. Como 2 < 3, se salva → **éxito de NE 2**. (Se usa el NF, no la decena: leer la decena daría "éxito 7", un resultado absurdo mejor que pasar normal.)

> **Cambio respecto al Core.** La versión vieja decía que un NE/NF modificado bajo 0 transformaba el resultado. Eso queda **anulado**: las capas 3 y 4 nunca transforman; la transformación vive **sólo** en el Paso 5 (Exigencia / Salvataje).

---

## 11.7 Habilidad por encima de 100 (desborde)

El Valor puede superar 100 por acumulación de modificadores. En ese caso, las **decenas que exceden la centena** se suman como **NE plano a todos tus éxitos** (un Refuerzo innato por habilidad sobrehumana).

- *Ejemplo:* Valor **145** → lo que excede 100 es 45 → decena **4** → **+4 NE** a cada éxito. Una tirada 32 con Valor 145 = éxito con NE 3 + 4 = **7**.

Las bandas siguen vigentes: aun con Valor 145, un **95–99 falla**.

---

## 11.8 Ranking (tiers) — capa superior en enfrentamientos entre magnitudes distintas

El **Ranking** es la escala de tier (−2 … +3, ver §11.1.bis) que permite que en una misma tirada de d100 convivan desde una hormiga hasta un dragón. Cuando colisionan criaturas de **distinto tier**, se aplica esta capa por encima de las reglas normales.

**Diferencia de 1 tier.** Se hace la enfrentada normal, pero el resultado del de **mayor tier se lee hacia abajo**: aunque su tirada sea un fallo —incluso un fallo automático de 95–99— cuenta como **éxito contra el tier inferior**, con el NE leído igual (decena). Además, el de mayor tier tiene un **piso de NE de 8** en la oposición. Así, el inferior sólo gana si el superior saca muy bajo *y* él saca muy alto (NE 9) o un Portento.

- *Ejemplo (con piso):* Gigante **Fuerza 20%, tier +1** vs Bárbaro **Fuerza 90%, tier 0**. Sin piso, el gigante casi siempre "falla" y el bárbaro casi siempre tiene éxito, así que el duelo se decidiría casi sólo por el dado —azaroso e injusto para una diferencia de tamaño real. Con el piso de 8, el gigante domina salvo que saque pésimo y el bárbaro saque excelente.
- *Ejemplo (lectura hacia abajo):* Dragón **tier +1** saca **96**. Para él es fallo, pero frente a un humano (tier 0) cuenta como **éxito NE 9**; el humano sólo gana con un **Portento (NE 10)**.

**Diferencia de 2 o más tiers.** El de mayor tier **gana sin necesidad de tirar**. Si el Director lo cree oportuno puede dejar tirar, y sólo un **96–99** del superior abre una **ventana estrecha** para el inferior (o el Director directamente decide que no se tira). *Flavor:* el titán está por aplastarte, pero quedás en un bolsillo de aire entre los dedos de su pie.

**Justificación de diseño (canónica).** El dado representa la suerte y las mil circunstancias imprevistas del mundo. Un dragón o un titán siempre es mucho más fuerte que un humano; si el humano "gana", fue porque el coloso resbaló, se distrajo o decidió dejarse. Queda a interpretación del Director, pero esa es la regla. *(Gideon es Fantasía Heroica, no Super-Heroica: la brecha entre tiers es real y no se cierra con niveles de personaje.)*

**Daño por diferencia de tier.** Al golpear a una criatura con tier de Vitalidad menor, se suma **+10 de daño plano por cada tier de diferencia** *(ya canon, §11.1.bis)*.

> 🔎 **NOTA DE EVALUACIÓN — inconsistencia del piso.** Escribiste *"el tier superior tiene un éxito de 8 + NE real"*. Tomado literal, el dragón del ejemplo (96 → NE 9) tendría 8 + 9 = **17**, pero antes dijiste que ese 96 era **éxito 9**. Lo único coherente con **ambas** cosas es un **piso de 8**: el NE del tier superior es **al menos 8**, y su NE real sólo cuenta si lo supera (es decir, 9). Redacté con esa lectura (piso 8). **Confirmá:** ¿piso de 8, o de verdad querías sumar +8?

> `[ESQUELETO]` (1) ¿La lectura "fallo = éxito vs tier inferior" vale contra **todos** los tiers menores, y el NE degrada por cada escalón? (2) ¿Una **Pifia** del tier superior se relee igual como éxito, o "queda" como fallo para darle aire al inferior? Con el piso de 8, hoy hasta una Pifia del superior daría NE ≥ 8 en un duelo de 1 tier de diferencia.
