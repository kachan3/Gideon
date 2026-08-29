# PROPUESTA: Spellcasting Modular v3
## Reemplazo de §13.6 — Manifestar Hechizo

> **Estado:** Propuesta No Ratificada — pendiente de revisión por Hassan.
> **Fecha:** 2026-08-26
> **Alcance:** Reemplaza §13.6 (Manifestar Hechizo / Spellcasting v2) y §13.6.9 (Aprendizaje y Almacenamiento de Conjuros). **No modifica** §13.4 (Herramientas Arcanas), §13.7 (Artefactos Arcanos), ni las Epifanías existentes.

---

## Filosofía de Diseño

### El Problema del Sistema Actual (§13.6)

El sistema vigente de *Manifestar Hechizo* presenta una fricción fundamental: **el lanzador invierte tiempo de acción antes de lanzar, luego tira una vez, y el resultado es binario con escalado incierto**. Esto produce:

1. **Inversión temporal pre-lanzamiento + riesgo post-lanzamiento.** El lanzador gasta múltiples acciones/turnos antes de tirar, y después puede fallar por varios flancos: no alcanzar el NE mínimo, no lograr el reach deseado, o producir daño insuficiente.
2. **Curva de frustración.** Un Arcanista que invierte 2–3 turnos preparando un hechizo y falla la tirada pierde toda esa inversión. Esto desincentiva los hechizos ambiciosos.
3. **Conflicto con la fantasía del rol.** La fantasía del spellcaster es *preparar la bomba atómica para la situación desesperada*: tomar tiempo, confeccionar algo devastador, y lanzarlo como un punto de inflexión. El sistema actual no entrega esa fantasía porque la incertidumbre no está en la *preparación* sino en un dado final que puede anular todo.

### La Propuesta: Spellcasting Modular

> **Premisa central:** El lanzador confecciona su hechizo eligiendo módulos (Efecto, Medium, Forma, Modificador, Duración), cada uno con un coste en PL. Luego acumula NE progresivamente mediante tiradas de **Spellweave** hasta alcanzar el PL total. El hechizo no se lanza hasta que el lanzador complete la canalización — la tensión está en *cuánto tardas*, no en *si lo logras*.

---

## §13.6 Spellcasting Modular — Mecánica Completa

### 13.6.1 Los Cinco Módulos

Un hechizo se confecciona apilando hasta cinco módulos. El lanzador elige de entre las opciones que sus **Epifanías** y su conocimiento le permitan.

#### Módulo 1 — Efecto *(obligatorio)*

El Efecto es **qué hace el hechizo**. Se desbloquea mediante Epifanías.

| Ejemplo de Efecto | Epifanía Requerida | Coste Base (PL) | Escalado |
|---|---|---|---|
| Daño de Fuego | Evocación Tempestuosa (Ignamor) | 1 PL | ×N para multiplicar |
| Daño de Frío | Evocación Tempestuosa (Ignamor) | 1 PL | ×N para multiplicar |
| Daño de Rayo | Evocación Tempestuosa (Ignamor) | 1 PL | ×N para multiplicar |
| Daño Necrótico | Memento Mori (Yrgramar) | 1 PL | ×N para multiplicar |
| Daño Psíquico | Ilusionismo (Ivganny) | 1 PL | ×N para multiplicar |
| Daño de Fuerza (gravedad) | Gelmiromancia (Gelmir) | 1 PL | ×N para multiplicar |
| Daño de Alma (constructo) | Virtud Anima (Naial) | 1 PL | ×N para multiplicar |
| Pavor (estado Asustado) | `[ESQUELETO]` | `[PL]` | — |
| Barrera (protección) | Virtud Anima (Naial) | `[PL]` | — |
| Manipulación mental | Ilusionismo (Ivganny) | `[PL]` | — |

> **Escalado del Efecto y Fórmula de Daño *(canónico — Hassan 2026-08-26)*.** El lanzador puede multiplicar el Efecto. Si "Daño de fuego" cuesta 1 PL y quiere triplicar su potencia, paga 3 PL por el Efecto. **Cada aspecto del hechizo (daño, alcance, área, duración) se calcula exclusivamente en base al PL asignado a su segmento correspondiente**, no al PL total del hechizo.
>
> **Daño = PL(Efecto) × Nivel de Voluntad.** En el ejemplo: 3 PL en Efecto × Nv Voluntad 5 = **15 de daño**. El PL invertido en Medium, Shape, Modificador o Duración no afecta el daño — solo afecta su propio aspecto (alcance, forma, etc.).

`[ESQUELETO: catálogo completo de Efectos por Epifanía — Hassan a definir]`

---

#### Módulo 2 — Medium *(obligatorio)*

El Medium es **cómo viaja el hechizo** desde el lanzador hasta su destino. Todos los lanzadores conocen **Self** y **Touch** de base.

| Medium | Descripción | Coste (PL) | Notas |
|---|---|---|---|
| **Self** | Sobre ti mismo | 0 PL | Universal. Ej.: inmolarte con la bola de fuego |
| **Touch** | A una criatura/objeto que toques | 0 PL | Universal. Ej.: golpear con puño de fuego |
| **A point you can see** | Un punto visible | 1 PL | Reach base: 10 + (5 × PL total del hechizo) unidades |
| **A creature you designate** | Una criatura que designes | 1 PL | Reach base: 10 + (5 × PL total del hechizo) unidades |
| **Rune Trigger** | Punto que toque una runa preparada | 1 PL | Requiere preparación previa |
| `[ESQUELETO: más Mediums]` | — | — | — |

> **Reach.** Los Mediums a distancia tienen un alcance base de **10 + (5 × PL total)** unidades. Esto significa que a mayor PL total del hechizo, mayor es su alcance natural — el hechizo más poderoso llega más lejos. Este alcance se calcula *después* de sumar todos los módulos.

> **Interacción con Touch/Self.** Self y Touch cuestan 0 PL precisamente porque implican riesgo posicional — estás en el punto de impacto o en contacto con el objetivo. Esto es intencional: *"En una situación ridícula, puedes meter una piña que haga Bola de Fuego, o puedes inmolarte explotando desde ti."*

---

#### Módulo 3 — Shape / Configuración *(obligatorio)*

La Configuración determina la **forma del área** en la que el hechizo se manifiesta.

| Shape | Descripción | Coste (PL) | Notas |
|---|---|---|---|
| **Proyectil** | Impacto en un solo objetivo | 0 PL | Forma más básica |
| **Cono (30 unidades)** | Área cónica desde el punto de origen, 30u | 1 PL | — |
| **Cono (60 unidades)** | Área cónica desde el punto de origen, 60u | 2 PL | — |
| **Esfera (15 unidades radio)** | Explosión esférica | 1 PL | — |
| **Esfera (30 unidades radio)** | Explosión esférica grande | 2 PL | — |
| **Línea (60 unidades)** | Rayo en línea recta | 1 PL | — |
| **Anillo** | Onda expansiva circular | 2 PL | — |
| **Rayo del cielo** | Columna vertical desde arriba | 2 PL | Requiere cielo abierto o similar |
| **Serpiente** | Viaja siguiendo un camino sinuoso | 2 PL | Raro; evade obstáculos |
| **Tsunami** | Oleada masiva en una dirección | 3 PL | Muy raro |

> **Shapes raros.** No todos los Shapes están disponibles para todos los lanzadores. Los Shapes estándar (Proyectil, Cono, Esfera, Línea) son universales. Los Shapes raros (Serpiente, Tsunami, Rayo del cielo, Anillo) pueden requerir dotes adicionales, conocimiento específico o Epifanías avanzadas.

`[ESQUELETO: requisitos específicos de Shapes raros — Hassan a definir]`

---

#### Módulo 4 — Modificador *(opcional)*

Los Modificadores son efectos puntuales adicionales que se aplican al hechizo.

| Modificador | Efecto | Coste (PL) | Ejemplo |
|---|---|---|---|
| **Pavor** | El hechizo produce estado Asustado en los afectados | +1 PL | Bola de fuego que infunde terror |
| **Empuje** | El hechizo empuja a los afectados X unidades | +1 PL | Onda de fuego que arroja enemigos |
| **Silenciar** | El hechizo produce estado Silenciado | +1 PL | Bloquea contra-lanzamiento |
| **Persistente** | El hechizo deja una zona de daño continuo | +2 PL | Muro de fuego que persiste |
| `[ESQUELETO: catálogo de Modificadores]` | — | — | — |

> **Interacción Multi-Flujo.** Si un Modificador pertenece a un flujo distinto al del Efecto principal (ej.: Efecto = Daño de Fuego/Ignamor + Mod = Pavor/Ivganny), se aplican las **reglas de Multicasting** (§13.6.2bis): la tirada de Spellweave usa el valor de la escuela más baja del lanzador entre las involucradas.

---

#### Módulo 5 — Duración *(obligatorio)*

| Duración | Efecto | Coste (PL) |
|---|---|---|
| **Inmediata** | Se ejecuta y termina instantáneamente | 0 PL |
| **Concentración Ligera** (§13.6.7) | Se mantiene con concentración ligera | +1 PL |
| **Concentración Demandante** (§13.6.7) | Se mantiene con concentración demandante | +2 PL |
| **Concentración Exhaustiva** (§13.6.7) | Consume 3 PA por turno | +3 PL |
| **Temporal** (X minutos = NE de Spellweave) | Dura sin concentración | +2 PL |

---

### 13.6.2 Cálculo del PL Total y Coste de Maná

Una vez elegidos los módulos, se suman todos los costes de PL:

> **PL Total = PL(Efecto) + PL(Medium) + PL(Shape) + PL(Modificador) + PL(Duración)**

> **Coste de Maná = PL Total**

#### Ejemplo: Bola de Fuego Cónica

| Módulo | Elección | PL |
|---|---|---|
| Efecto | Daño de Fuego ×3 | 3 |
| Medium | A un punto visible (10 + 5×PL unidades) | 1 |
| Shape | Cono de 60 unidades | 2 |
| Modificador | Ninguno | 0 |
| Duración | Inmediata | 0 |
| **Total** | | **6 PL, 6 Maná** |

El lanzador necesita acumular **6 NE** en Spellweave para lanzar este hechizo.

---

### 13.6.3 Spellweave — Acumulación de NE

**Spellweave** es la habilidad activa mediante la cual el lanzador canaliza los flujos arcanos para tejer su hechizo confeccionado.

#### Procedimiento

1. El lanzador declara el hechizo confeccionado y su PL total.
2. En cada turno, el lanzador puede usar acciones para realizar **tiradas de Spellweave**.
3. Cada tirada de Spellweave es un **chequeo de la habilidad de la escuela de magia involucrada** (ej.: Ignamor para fuego). Si hay múltiples flujos (Multi-Flujo), usa el valor más bajo (§13.6.2bis vigente).
4. **Los NE obtenidos se acumulan** entre tiradas. El hechizo no necesita completarse en una sola tirada.
5. Cuando los NE acumulados **≥ PL total**, el hechizo se lanza exitosamente.
6. **El Maná se gasta al momento del lanzamiento**, no durante las tiradas.

#### Fallo en Spellweave — Capacidad de Salvamento *(canónico — Hassan 2026-08-26)*

> **Cuando una tirada de Spellweave falla, el lanzador obtiene NF.**
>
> **Si NF ≤ Nivel de Inteligencia del lanzador** → Salvamento exitoso: la tirada cuenta como 0 NE (la acción se pierde, pero la canalización no se interrumpe. Los NE acumulados previamente se conservan intactos).
>
> **Si NF > Nivel de Inteligencia del lanzador** → Fallo real: **se pierden Acumulaciones de Éxito iguales a la diferencia:**
>
> $$\text{NE Perdidos} = \text{NF} - \text{Nivel de Inteligencia}$$
>
> La canalización **no se interrumpe** — el lanzador puede continuar intentando en turnos sucesivos, habiendo retrocedido solo en el exceso que su intelecto no logró contener. Si los NE acumulados bajan a 0 o menos, simplemente quedan en 0 (no hay deuda negativa).

> **Rol de la Inteligencia.** La Inteligencia opera aquí como una **armadura activa** contra la pérdida de progreso: un lanzador con Inteligencia alta no solo ignora fallos menores, sino que reduce drásticamente el impacto de pifias o fallos graves.

#### Ejemplo de Spellweave

Bola de Fuego Cónica — PL 6, el lanzador tiene Ignamor 55 e Inteligencia 60 (Nivel de Int = 6).

| Turno | Tirada | Resultado | NE Acumulado | Notas |
|---|---|---|---|---|
| 1 | 23 | Éxito, NE 2 | 2 | — |
| 2 | 31 | Éxito, NE 3 | 5 | — |
| 3 | 78 | Fallo, NF 8 | 3 | NF 8 > Nivel Int 6 → **Fallo real.** Pierde $8 - 6 = 2\text{ NE}$ (tenía 5, baja a 3) |
| 4 | 15 | Éxito, NE 1 | 4 | Recupera el ritmo |
| 5a | 20 | Éxito, NE 2 | 6 | **¡PL alcanzado (6 ≥ 6)! Hechizo listo para detonar.** |
| 5b | — | **Lanzamiento** | 6 | Se gasta 6 PM de Maná, se elige punto y detona el cono de 60u |

---

#### Coste en Acciones de Spellweave *(canónico — Hassan 2026-08-26)*

Cada tirada de Spellweave cuesta **2 PA**.

- En un turno normal (3 PA), un lanzador puede hacer **1 tirada de Spellweave** y le sobra 1 PA para movimiento o interacción.
- **Whole Turn Spellweave *(exclusivo de Arcanista)*:** Los Arcanistas pueden gastar **3 PA (turno completo)** para realizar **2 tiradas de Spellweave** en el mismo turno. Esta es una acción de turno completo exclusiva de la Senda del Arcanista, reflejando su entrenamiento superior en canalización simultánea.

> **Interacción con "Denme algo de tiempo".** Si el Arcanista usó "Denme algo de tiempo" en el turno anterior (obteniendo 5 PA totales: 3 base + 2 almacenadas), puede distribuir esos PA entre tiradas de Spellweave a 2 PA cada una — máximo **2 tiradas** (4 PA) con 1 PA sobrante.

`[ESQUELETO: confirmar la interacción exacta entre acciones almacenadas y Whole Turn — ¿se pueden apilar o es una u otra?]`

---

### 13.6.4 Acción: "Denme Algo de Tiempo" *(refinado — Hassan 2026-08-26)*

> *"El mago cierra los ojos, mueve los labios en silencio, y retrocede dos pasos. El guerrero entiende: algo se viene."*

**Acción exclusiva de Arcanistas** (o personajes con el dote Lanzador de Conjuros). Durante su turno, el lanzador puede declarar:

**"Denme Algo de Tiempo"** — Coste: **3 PA (turno completo)**.

#### Cuándo se Usa

Esta acción es tanto una **herramienta** como una **penalización**. El lanzador la toma cuando llega su turno y **no tiene preparado el hechizo a lanzar** — necesita tiempo para confeccionar o para acumular NE suficientes. Un buen jugador ya tendrá sus hechizos acomodados de antemano y aplicará variantes para evitar tener que recurrir a esta acción; pero cuando la situación requiere improvisar algo nuevo o el Spellweave necesita más turnos, esta es la vía.

#### Efecto

1. El lanzador **se mueve su Speed** como parte de la acción.
2. Su **turno se desplaza a justo antes de que termine la ronda** (actúa último o casi último).
3. **Almacena 2 acciones extra** que solo pueden usarse para **Spellweave** en su siguiente turno.
4. En su siguiente turno, tiene **5 acciones totales** (3 normales + 2 almacenadas), pero las 2 extra están **reservadas para Spellweave**.

#### Interacción con Iniciativa Situacional (§11.6)

El desplazamiento de turno interactúa con el modelo de iniciativa situacional:

- **Un solo caster usa "Denme algo de tiempo":** Su turno pasa a justo antes de que la ronda termine. Actúa después de todos los demás participantes.
- **Múltiples casters del mismo grupo lo usan:** Deciden entre ellos el orden (regla estándar del mismo grupo en §11.6).
- **Múltiples casters de bandos opuestos lo usan:** Tiran **enfrentado de Instinto** (§11.6) para determinar quién actúa primero entre los desplazados.

#### Filosofía

Esta acción está diseñada para que el jugador pueda, tanto en roleplay como mecánicamente:
- **Roll-on:** Retirarse del frente, preparar dramáticamente su hechizo.
- **Roll-off:** Pedir a sus compañeros que le cubran mientras confecciona algo devastador.

El desplazamiento al final de la ronda es un coste real — da a los enemigos la oportunidad de interrumpirte, reposicionarse o presionarte antes de que lances. Es un trade-off de **tempo por potencia**.

> **Repetible *(canónico — Hassan 2026-08-26)*.** Esta acción **puede usarse en turnos consecutivos**. Un lanzador puede dedicar múltiples turnos completos moviéndose y almacenando PA de Spellweave. La vulnerabilidad posicional acumulada (varios turnos actuando último, sin reacciones, sin ataques) es el contrapeso natural.

---

### 13.6.5 Confección del Hechizo, Recetas y Filosofía Táctica

El lanzador puede confeccionar su hechizo en dos momentos:

1. **Recetas Pre-Armadas (Ficha / Grimorio):** El estándar recomendado. El jugador llega a la sesión con combinaciones de módulos ya calculadas y anotadas en su hoja (ej.: *Dardo de Calor [PL 2]*, *Estallido en Cono [PL 4]*, *Cataclismo de Ignamor [PL 8]*). Al llegar su turno, simplemente declara qué receta canaliza sin frenar la mesa en cálculos aritméticos.
2. **Confección sobre la marcha (Improvisación):** Si la situación exige una respuesta inédita (ej.: aplicar *Pavor* a una llama o reducir el radio para no golpear a un aliado), el lanzador puede ensamblar una combinación nueva en el momento de forma declarativa.

> **No hay límite de recetas conocidas**, pero el lanzador solo puede estar canalizando **un hechizo a la vez** vía Spellweave (los NE se acumulan para un solo objetivo).

#### Filosofía de Diseño: Lectura Táctica y el "Error del Mago Novato" *(canónico — Hassan 2026-08-26)*

El sistema premia intencionalmente la **habilidad y astucia del jugador** al evaluar el escenario de combate:

- **El Error del Mago Novato:** Intentar forzar siempre la "bomba atómica" de 8–10 PL en cualquier combate menor. Invertir 3 o más turnos en canalizar un conjuro colosal cuando la escaramuza requería resolución rápida es un error de juicio del lanzador. El juego permite equivocarse y no protege al jugador de sobre-comprometerse.
- **La Astucia del Buen Arcanista:** Un lanzador veterano sabe **dimensionar el conjuro a la necesidad**:
  - *¿Hay una horda de esbirros (§18.bis)?* Confecciona un hechizo modesto de 2–3 PL con área amplia (Cono/Esfera) y poco daño, suficiente para limpiar amenazas débiles en 1 solo turno.
  - *¿Un enemigo blindado o un jefe imponente?* Coordina con sus aliados, pide *"Denme algo de tiempo"*, y canaliza pacientemente el daño concentrado de 6–8 PL mientras la vanguardia sostiene la línea.
  - *¿Combate dinámico o en retirada?* Prioriza hechizos Touch/Self o proyectiles rápidos de 1–2 PL para actuar y moverse en el mismo asalto.

### 13.6.6 Interrupción de la Canalización

Si durante el proceso de Spellweave el lanzador:
- Pierde la capacidad de cumplir algún **Componente** del hechizo (§13.6.6 original — Verbal, Susurro, Motrices, Motrices Finos, Materiales),
- Queda en estado **Aturdido**, **Dormido** o **Agonizando** (§18),
- O sufre un **Fallo real** en Spellweave que exceda su Salvamento,

...la canalización se **interrumpe**. Los NE acumulados se pierden. El Maná **no se gasta** (porque se gasta al lanzar, no al canalizar).

---

### 13.6.7 Aprendizaje de Hechizos — El Catálogo Modular

En este sistema, **no se aprenden "hechizos" predefinidos**. Lo que el lanzador aprende son los **módulos**:

- **Efectos** → desbloqueados por Epifanías (§ Arcanista_03).
- **Mediums** → Self y Touch son universales; **cada Epifanía desbloquea al menos un Medium adicional** *(canónico — Hassan 2026-08-26)*. Los Mediums avanzados se obtienen por las mismas vías que los conjuros (XP, statblocks, libros, milestones — §G2/§G3).
- **Shapes** → **Cada Epifanía desbloquea al menos un Shape** *(canónico — Hassan 2026-08-26)*. Los Shapes avanzados o raros se obtienen por las mismas vías que los conjuros.
- **Modificadores** → Se adquieren como dotes o XP, al igual que los Feats (§G2).
- **Duraciones** → Universales (Inmediata y las tres Concentraciones son innatas).

> **Esto resuelve el esqueleto abierto de §13.6.9** — el aprendizaje no es "qué conjuros conoces" sino "qué bloques de construcción posees". La creatividad y la combinatoria hacen el resto. **Las Epifanías son la puerta de entrada** (desbloquean Efecto + al menos 1 Medium + al menos 1 Shape), y el crecimiento posterior sigue las reglas estándar de obtención de conjuros.

---

## Análisis Crítico

### ✅ Fortalezas de la Propuesta

#### 1. Fantasía del Rol Cumplida
El sistema entrega la fantasía del spellcaster que prepara una bomba atómica. La inversión de tiempo es significativa, pero la incertidumbre está en *cuántos turnos tardas* — no en *si logras algo*. Esto elimina la frustración de "invertí 3 turnos y saqué un fallo total".

#### 2. Agencia del Jugador
El jugador decide qué construir. No elige de una lista de hechizos — **diseña el hechizo** para la situación. Esto alinea perfectamente con la filosofía del Arcanista como estudioso que comprende los flujos y los combina creativamente.

#### 3. Escalado Orgánico
El PL como suma de módulos escala naturalmente: hechizos más ambiciosos cuestan más, tardan más en canalizarse, y el lanzador asume más riesgo con "Denme algo de tiempo". No hay "niveles de conjuro" artificiales.

#### 4. Inteligencia con Rol Mecánico Claro
La Inteligencia como red de seguridad en Spellweave le da un propósito concreto y diferenciado de Arcana (talento puro) y Voluntad (potencia bruta). Tríada funcional: *Arcana para tirar, Inteligencia para no perder, Voluntad para pegar*.

#### 5. Compatibilidad con Subsistemas Existentes
No modifica Herramientas (§13.4), Artefactos (§13.7), Maná/Stamina (§13.1), Concentración (§13.6.7), Componentes (§13.6.6), ni Epifanías. Los encaja como fuentes de módulos.

---

### ⚠️ Problemas Detectados — Estado de Resolución *(actualizado 2026-08-26)*

#### ✅ Problema 1: Consecuencia del Fallo Real — RESUELTO

> **Decisión (Hassan 2026-08-26):** Se pierden Acumulaciones de Éxito iguales a la diferencia: $\text{NE Perdidos} = \text{NF} - \text{Nivel de Inteligencia}$. No se interrumpe la canalización; el lanzador puede volver a intentar en turnos sucesivos. Integrado en §13.6.3 arriba.

#### ✅ Problema 2: Coste en PA de Spellweave — RESUELTO

> **Decisión (Hassan 2026-08-26):** Cada tirada cuesta **2 PA**. Los Arcanistas pueden hacer **Whole Turn Spellweave (3 PA = 2 tiradas)** como exclusividad de senda. Integrado en §13.6.3 arriba.

#### ✅ Problema 3: Fórmula de Daño y Lectura Táctica — RESUELTO

> **Decisión (Hassan 2026-08-26):** El daño y todos los demás aspectos del tejido se calculan **en base al PL asignado a cada segmento**. Daño = PL(Efecto) × Nivel de Voluntad. El PL de otros módulos no afecta el daño. El sistema asume que un buen jugador dimensiona su hechizo (limpiar esbirros con poco PL y área grande vs cargar bombas solo cuando el objetivo lo amerita). Integrado en §13.6.1 y §13.6.5.

#### ✅ Problema 4: "Denme Algo de Tiempo" — Repetible — RESUELTO

> **Decisión (Hassan 2026-08-26):** **Sí es repetible** en turnos consecutivos. El lanzador puede sacrificar múltiples turnos moviéndose y acumulando acciones reservadas. El coste de tempo (última iniciativa) y la vulnerabilidad posicional son suficiente contrapeso.

#### ⚠️ Problema 5: Compatibilidad Efecto × Shape — PARCIALMENTE RESUELTO

> **Decisión (Hassan 2026-08-26):** La compatibilidad es **puntual por caso**. No hay una tabla universal — cada hechizo/efecto puede tener restricciones específicas. Ejemplo: un hechizo que abre puertas está limitado a **Touch** solamente. Las restricciones se definen por efecto individual en el catálogo.
>
> `[ESQUELETO: definir restricciones de Medium/Shape por efecto en el catálogo cuando se desarrolle]`

#### ✅ Problema 6: "Todo o Nada" (El Libro) — RESUELTO

> **Decisión (Hassan 2026-08-26):** *Todo o Nada* **opera igual** que en el sistema vigente, pero el **Re-Roll se limita a una vez por turno**. El usuario de Libro puede re-rolear una tirada de Spellweave fallida por turno, o interrumpir perdiendo 1 PM.

#### ⚠️ Problema 7: Hechizos Existentes (§13.9) como Recetas — PARCIALMENTE RESUELTO

> **Decisión (Hassan 2026-08-26):** **Sí, se plantea que los hechizos existentes se reinterpreten como recetas canónicas** (combinaciones predefinidas de módulos), pero los detalles están por definir.
>
> `[ESQUELETO: migración de hechizos §13.9 al formato modular — pendiente]`

#### ✅ Problema 8: Cuándo se Elige el Objetivo — RESUELTO

> **Decisión (Hassan 2026-08-26):** **El objetivo se elige al lanzar**, cumpliendo las condiciones establecidas en la confección (Medium, Reach). La confección define *qué tipo* de objetivo y a qué distancia máxima; el *punto/criatura exacta* se declara al completar el Spellweave.

#### ✅ Problema 9: Catálogo de Efectos por Epifanía — RESUELTO (diferido)

> **Decisión (Hassan 2026-08-26):** Esto es **contenido**, se desarrollará cuando se definan las Epifanías en detalle.

#### ✅ Problema 10: Requisitos de Shapes y Mediums — RESUELTO

> **Decisión (Hassan 2026-08-26):** Las **Epifanías desbloquean Shapes y Mediums básicos** — al menos uno de cada tipo al adquirir la Epifanía. Operan las **mismas reglas que la obtención de conjuros** (descubrimiento mediante XP, statblocks, libros, milestones — §G2/§G3). Los Shapes y Mediums avanzados se obtienen como dotes/feats adicionales.

---

## Resumen de Estado

| # | Decisión | Estado |
|---|---|---|
| 1 | Consecuencia del Fallo Real (NF > Int) | ✅ Resuelto — pierde NE = (NF − Nivel Int) |
| 2 | Coste en PA de Spellweave | ✅ Resuelto — 2 PA; Arcanista: 3 PA = 2 tiradas |
| 3 | Fórmula de daño y filosofía táctica | ✅ Resuelto — PL(segmento) × Nv Voluntad; lectura de combate |
| 4 | "Denme algo de tiempo" repetible | ✅ Resuelto — sí, repetible |
| 5 | Compatibilidad Efecto × Shape | ⚠️ Parcial — puntual por caso, catálogo pendiente |
| 6 | "Todo o Nada" para Spellweave | ✅ Resuelto — 1 Re-Roll por turno |
| 7 | Hechizos §13.9 como recetas | ⚠️ Parcial — sí, pero migración pendiente |
| 8 | Cuándo se elige el objetivo | ✅ Resuelto — al lanzar |
| 9 | Catálogo de Efectos | ✅ Diferido — es contenido |
| 10 | Shapes/Mediums desbloqueados por Epifanías | ✅ Resuelto — mismas reglas que conjuros |

---

> **Nota del asistente.** Este documento es una transcripción estructurada de la propuesta de Hassan con análisis crítico. Decisiones marcadas con fecha 2026-08-26 son canónicas dentro de esta propuesta (pendiente de ratificación final). Los valores numéricos de PL en las tablas son ilustrativos y sujetos a calibración. Las celdas marcadas `[ESQUELETO]` requieren definición de Hassan.

