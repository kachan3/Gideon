# Propuesta — Filosofía de Diseño: Senda del Honor

> **Estado:** ✅ INCORPORADO AL CORE — 2026-08-06. Los elementos canónicos fueron trasladados a `20_Contenido/Senda_Honor/` y los archivos Core fueron actualizados.
> **Autor del diseño:** Hassan
> **Fecha de inicio:** 2026-08-03
> **Fecha de incorporación:** 2026-08-06
> **Documento generado por:** Sesión de diseño colaborativo (Hassan + Antigravity)

---

## Decisiones Resueltas

| # | Decisión | Resolución |
|---|---|---|
| 1 | **Nivel de Honor en fórmulas** | ⌈ Honor ÷ 10 ⌉ redondeado **arriba**. Regla universal para todo "Nivel" en el sistema. Rango 0–10. |
| 2 | **Pérdida por mentir** | Proporcional: escala de 5 grados, desde −1d4 (desliz) hasta pérdida total (perjurio existencial). |
| 3 | **Compromiso Solemne — penalización** | Penaliza abandono, no fallo honesto. Fallo genuino = 0 a −1 pt. Abandono = pérdida proporcional. |
| 4 | **Compromiso Solemne cuesta Mana** | Acto cuasi-divino que desgasta el alma. Tipo de coste (fijo vs. NE) pendiente. |
| 5 | **Compromiso Solemne — restricciones** | ~20 palabras, escrita físicamente, 1 activa, sin cláusulas, gramaticalmente correcta. |
| 6 | **Compromiso Solemne — reemplazo** | Declarar nueva vow con otra activa = Fracaso. Penalización = ×2 la recompensa del voto reemplazado. |

## Decisiones Pendientes

| # | Decisión | Opciones | Impacto |
|---|---|---|---|
| 1 | **Valor inicial de Honor** | ¿0? ¿20–30? ¿Tirada (1d4×5)? ¿Pool? | Curva de poder temprana |
| 2 | **Coste de Mana del Compromiso Solemne** | ¿Fijo? ¿Restar NE? | Recurso compartido con magia |
| 3 | **Desactivación de feats** | ¿Inmediata? ¿Fin de escena? ¿Requiere reafirmación? | Qué tan castigador es perder Honor |
| 4 | **Pérdida de arma jurada** | ¿Pierde el feat? ¿Puede jurar otra? ¿Ritual? | Relación con el equipo |
| 5 | **Herencia de Sendas** | ¿Regla para TODAS las Sendas? ¿Solo las divinas? | Alcance del lore nuevo |
| 6 | **Veritae + Honor** | ¿Requisito de Honor mínimo? ¿Arcana? ¿Ambos? | Techo de poder multiclase |

---

## §1. Adición al Lore: Herencia de las Sendas

### Regla Cosmológica Propuesta

Las Sendas son **heredadas** de los Primigenios a los Dríades. Actos que sucedieron en vida, muerte o reencarnaciones de los Primigenios **repercuten mecánicamente** en los seguidores de su Senda.

### Ejemplos Canónicos Formalizados

| Senda | Primigenio | Evento | Efecto heredado |
|---|---|---|---|
| Sombra / Silente | Theledar (No Ser) | Ritual de suicidio → cuerpo muerto, alma persistente en las sombras | Manipulación de sombras |
| Honor | Gawain (Vivo-no-muerto) | Maldición de Naya'il + años sin morir defendiendo | Resistencia sobrenatural |
| Hierofante | Mirra (Demesteria) | Cruzó a otro plano como emisaria | Canalización divina a distancia planar |
| Heraldo | Rayan la Elocuente | Redactó el Lexicón Marcial | Corpus doctrinal = fuente de poder táctico |
| Monje | Gideon (vagabundo amnésico) | Descubrió la Senda no-divina; vive sin fragmento mayor | Independencia de lo divino |

### Por Qué Funciona

1. **Unifica narrativa y mecánica.** Ya no hay que justificar por qué un Silente maneja sombras "porque sí" — la explicación es orgánica.
2. **Crea consecuencias vivas.** Si un Primigenio sufre un cambio (ej. Gawain es liberado de su maldición), la Senda podría mutar. Bomba narrativa esperando a detonarse.
3. **Explica variaciones entre Sendas.** Por qué algunas son divinas y otras no, por qué los poderes tienen el "sabor" que tienen.

> **[DECISIÓN PENDIENTE]** ¿Aplica retroactivamente a TODAS las Sendas, o solo a las que tienen Primigenio tutor? El Monje (Gideon) es no-divino. ¿Los monjes heredan algo de la amnesia/vagabundeo de Gideon, o su independencia es justamente la herencia?

---

## §2. El Atributo Honor (0–99)

### Mecánica

- Atributo extra **exclusivo** de la Senda del Honor, rango **0–99**.
- Se usa para **checks** igual que cualquier otro atributo (roll-under en d100).
- **Mejora:** Solo cuando el DM lo autoriza (completar quest, cumplir palabra empeñada).
  - Usa la misma lógica de Tirada de Mejora existente: `1d100 ≥ valor actual` → éxito → `+1d6` (o `+1d4` si ≥76).
  - **No se puede usar XP** para comprarlo vía Entrenamiento.
- **Interactúa con todas las herramientas del Honor** (Juramentos, Compromiso Solemne, feats).

### Integración con el Sistema Existente

- Mismo rango (0–99), misma resolución (roll-under), misma curva de mejora.
- Al no usar XP, no alimenta el Grado de Senda ni el Dado de Senda — es un eje de progresión **paralelo** y puramente narrativo.
- Las bandas automáticas (00–05 éxito auto, 95–99 fallo auto) y los críticos capicúa aplican naturalmente.

### Nivel de Honor = ⌈ Honor ÷ 10 ⌉ (Redondeo Arriba)

Regla universal para TODOS los atributos que usen "Nivel" en el sistema.

| Honor | Nivel | Ejemplo de efecto |
|---|---|---|
| 0 | 0 | Sin bonificación |
| 1–10 | 1 | +1 daño / −1 reducción |
| 11–20 | 2 | +2 daño / −2 reducción |
| 21–30 | 3 | +3 daño / −3 reducción |
| 31–40 | 4 | +4 daño / −4 reducción |
| 41–50 | 5 | +5 daño / −5 reducción |
| 51–60 | 6 | +6 daño / −6 reducción |
| 61–70 | 7 | +7 daño / −7 reducción |
| 71–80 | 8 | +8 daño / −8 reducción |
| 81–90 | 9 | +9 daño / −9 reducción |
| 91–99 | 10 | Techo teórico — prácticamente inalcanzable |

El sistema d100 ya usa las decenas como métrica significativa (NE en éxitos = dígito de decenas). El Nivel de Honor habla el mismo idioma. El redondeo hacia arriba hace que incluso 1 punto de Honor ya tenga peso (Nivel 1), evitando la zona muerta del 0.

### Filosófico: Honor ≠ Bondad

> *"La clase demanda honestidad y carácter, no bondad o virtud."*

El atributo mide **alineación entre palabra y acción**, no moralidad. Un tirano que promete desollar a un pueblo y lo cumple **gana Honor**. Esto produce:

- **Villanos honorables** como arquetipo jugable (y NPC).
- **Héroes que caen** por una mentira piadosa, no por un acto malvado.
- **Tensión dramática constante:** ¿Digo la verdad y mantengo mi poder, o miento para salvar a alguien y lo pierdo?

Esto se alinea perfectamente con la paradoja fundacional de los Leones de Pircar: una orden de la verdad sostenida sobre una mentira. Percival, el impostor, sería mecánicamente **incapaz** de tener Honor alto.

### Pérdida de Honor: Escala Proporcional (5 Grados)

| Grado | Transgresión | Pérdida | Ejemplo |
|---|---|---|---|
| **1 — Desliz** | Exageración, media verdad, omisión menor | **−1d4** | "Maté a diez" (fueron siete). |
| **2 — Mentira** | Mentira deliberada sobre un hecho | **−1d6** | "No estuve ahí esa noche." |
| **3 — Traición menor** | Romper una promesa hecha a alguien | **−2d6** | Prometiste proteger al mercader y lo abandonaste. |
| **4 — Traición mayor** | Romper un juramento formal o traicionar a un aliado cercano | **−3d6 a −5d6** | Juraste lealtad a tu señor y conspiraste contra él. |
| **5 — Perjurio existencial** | Traicionar tu Juramento Declarado, negar todo lo que representas | **Todo el Honor (→ 0)** | Un paladín de Honor que vende a sus hermanos, niega su juramento y miente sobre haberlo hecho. |

**Principios:**
- La realidad juzga, no la audiencia. No importa si te creen — importa si dijiste la verdad.
- **Intención deliberada** dispara la pérdida. Una promesa fallida por incapacidad genuina no es mentira (ver Compromiso Solemne §4).
- Grado 5 = **reset existencial**. Reconstruir desde 0 es posible pero es un arco narrativo entero.
- El DM asigna el grado según contexto. La tabla es guía, no ley rígida.

> **[DECISIÓN PENDIENTE]** Valor inicial de Honor en creación de personaje. Si empieza en 0, los primeros checks son fallos casi garantizados (solo 00 tiene éxito). Opciones: empezar en ~20–30, tirar 1d4×5, o asignarlo desde el Pool Normal de la Senda.

---

## §3. Juramento Declarado — Sistema de Feats de Juramento

### Estructura

El jugador **construye su Juramento** progresivamente eligiendo feats de juramento. Cada feat añade una **frase** al juramento con ventaja mecánica y narrativa. La combinación de frases define el estilo de juego — es un **motor combinatorio** donde las frases forman un texto coherente.

### Tier 1 — Anclas: "Juro por mi ___"

Definen **sobre qué** juras. Beneficios pasivos/reactivos atados a una apuesta personal.

| Frase de Juramento | Efecto Mecánico | Notas |
|---|---|---|
| *"Juro por mi vida"* | Puedes ignorar **una herida grave** | Eco directo de Gawain. ¿Una vez por descanso? ¿Por sesión? |
| *"Juro por mi arma"* | Suma tu **Nivel de Honor** al daño de tu arma jurada | Define un arma inseparable del personaje. |
| *"Juro por mis compañeros"* | Puedes **interponerte** a ataques dentro de ½ de tu velocidad de movimiento como **reacción** | Tanque/protector. Limita a 1/ronda naturalmente. |

### Tier 2 — Verbos: "Juro ___"

Definen **qué haces** con tu juramento. Habilidades activas que sustituyen Honor por otro atributo.

| Frase de Juramento | Efecto Mecánico | Notas |
|---|---|---|
| *"Luchar"* | Usa **Honor en lugar de Melee** para atacar | Pieza central filosófica. No es tu brazo — es el mundo. |
| *"Proteger"* | Resta tu **Nivel de Honor** a un ataque por ronda | Reducción de daño pasiva que escala. |
| *"Guiar"* | Acción **Help gratis** por turno | Soporte/líder táctico. |

### Filosofía del Motor de Juramento

La diferencia con otros sistemas (Invocations de Warlock, Tenets de Paladín, Aspects de FATE) es que **las frases forman un texto coherente** — el juramento del personaje. No es una lista de feats, es una **declaración de identidad** que además tiene reglas.

Cada combinación genera un arquetipo distinto (Duelista, Guardián, Comandante, Cruzado...). Escala orgánicamente con Honor. Las Anclas crean **vulnerabilidades temáticas**.

> **[DECISIÓN PENDIENTE]** Requisitos de Honor para feats. Ciertos feats requieren un nivel mínimo de Honor y se **deshabilitan** si caes por debajo. Necesita umbrales definidos por feat y reglas de desactivación (¿inmediata? ¿fin de escena? ¿requiere reafirmación?).

---

## §4. Compromiso Solemne — Juramento Rápido

### Mecánica Base

- El personaje **declara en voz alta** qué va a lograr.
- **Coste Dinámico:** Moldear la realidad cuesta **Maná igual a tu Nivel de Honor**.
- Solo puede tener **1 Compromiso Solemne activo** a la vez. Declarar uno nuevo reemplaza el anterior (con penalización, ver §4.7).
- **Acción Gratuita — "¡Mi Honor lo Exige!":** Mientras el compromiso esté activo, obtienes acceso a esta Free Action (una vez por turno). Si fallas una tirada relacionada con cumplir tu compromiso, puedes usarla para lanzar una **tirada de Honor**. Si tienes éxito, este éxito reemplaza al fallo anterior.
- **Reserva de Usos:** Tienes un número de usos de "¡Mi Honor lo Exige!" igual a tu **Nivel de Honor**.
- **Recarga Castigadora:** Si agotas tus usos antes de cumplir el voto, para recuperar usos debes declarar un Nuevo Compromiso, lo que cuenta como un **Abandono** del anterior.

### §4.1 Coste de Mana Dinámico

Usar un Compromiso Solemne es esencialmente canalizar una fracción del poder de Veritae. El sistema se auto-regula mediante economía de recursos:
Declarar un Compromiso Solemne cuesta un **Punto de Maná por cada Nivel de Honor** que tenga el personaje (Ej. Nivel 4 = 4 Maná).

A mayor Honor, tus palabras te otorgan más usos mecánicos (Nivel de Honor), pero tienen un coste espiritual mucho más pesado.

### §4.2 Restricciones Formales

El Compromiso Solemne no es un deseo ni un contrato legal. Es una **declaración de intención pura**.

| Regla | Descripción | Justificación |
|---|---|---|
| **~20 palabras máximo** | La frase debe ser corta y directa | Si no puedes decirlo en 20 palabras, es un contrato, no una declaración. |
| **Escrita físicamente** | El jugador debe escribirla en papel o enviarla por mensaje | Peso ritual. Evita revisionismo ("yo no dije eso"). |
| **1 activa a la vez** | Solo una Compromiso Solemne puede estar vigente | Evita acumular votos como buffs. |
| **Gramaticalmente correcta** | Sin errores ortográficos ni gramaticales | Las palabras de poder deben ser precisas. |
| **Retries permitidos** | Corregir errores no gasta usos, pero no frenar la partida | Pragmatismo de mesa. |
| **SIN cláusulas ni condiciones** | Prohibido "si", "cuando", "siempre que", "en caso de", excepciones | **Regla crítica** — ver §4.3. |

### §4.3 Por Qué Prohibir Cláusulas: El Problema del Abogado

**Ejemplo malo:** *"Mataré a todos los enemigos que pueda matar fácilmente."*

Dos problemas:

1. **Es una cláusula.** "Que pueda matar fácilmente" es una condición de escape. Anula la tensión central del sistema.

2. **Es ambigua y la realidad no negocia.** ¿Qué significa "fácilmente"? El DM puede (y debe) interpretarlo literalmente:
   - *Tres sesiones atrás dejaron a un tipo preso. Es tu enemigo. Está en una celda. Matarlo sería "fácil". Tu voto dice que debes hacerlo.*
   - El jugador quería flexibilidad; recibió una cadena.

**Efectos de la regla anti-cláusulas:**
- **Fuerza compromiso real.** Sin puertas traseras.
- **Premia la precisión lingüística.** La skill expression del Honor es VERBAL.
- **El DM puede advertir, no prohibir.** Crea tensión narrativa genuina.

**Nota para DMs:** La advertencia del DM es herramienta de calibración, no obligación. Un DM benevolente advierte siempre. Un DM duro deja que las palabras hablen por sí mismas. Ambos son válidos — establezcan el tono en sesión 0.

### §4.4 Principio Central: Penaliza el Abandono, No el Fracaso

> *"Lo importante es la intención y la acción realizada. Si prometes derrotar a un monstruo y luchas hasta que tu cuerpo se rinde, no podrían llamarte mentiroso. Cumpliste en intención."*

**Regla:** El Compromiso Solemne no penaliza el **fallo honesto** (luchaste y perdiste). Penaliza el **arrepentimiento y el abandono** (juraste y te rajaste). La pérdida por fallo genuino es **mínima o nula** (0 a −1 pt).

### §4.5 Completación: Recompensa de Honor

**Todo Compromiso Solemne está diseñado para ser cumplido o finalizado.** Al completar un voto, el personaje recibe una recompensa **directa** de Honor (suma directa al atributo, no usa la tirada de mejora estándar):

| Magnitud del voto cumplido | Recompensa | Ejemplo |
|---|---|---|
| **Trivial** | **+1d4** Honor | "Pelearé en esta taberna." |
| **Menor** | **+1d6** Honor | "Defenderé esta caravana hasta llegar al pueblo." |
| **Significativo** | **+1d8** Honor | "Mataré a todos los bandidos de este bosque." |
| **Mayor / Épico** | **+1d10** Honor | "Liberaré a los prisioneros de la fortaleza de Ashgar." |

### §4.6 Anti-Cheese: Cómo el Sistema se Defiende Solo

El hecho de que los votos deben completarse para dar recompensa, combinado con las restricciones formales, crea **4 trampas naturales** contra el cheese:

#### Trampa 1 — El Juramento Trivial
> *"Juro que hoy pelearé."*

El jugador entra en cualquier pelea. Lanza un golpe. Voto cumplido. Gana +1d4. **Problema:** Gastó su única Compromiso Solemne activa en algo que le dio +1d4. Perdió acceso a usar Honor como sustituto de habilidad para cualquier cosa significativa. Se disparó en el pie.

#### Trampa 2 — El Juramento Eterno
> *"Pelearé con honor toda mi vida."*

El voto no se completa hasta que muera (en décadas). Cuando "se cumpla", recibe +1d10... estando muerto. Mientras tanto, su Compromiso Solemne está **bloqueada permanentemente**. El jugador se encadenó solo. La Compromiso Solemne es poderosa PORQUE es flexible — congelarla la desperdicia.

#### Trampa 3 — El Juramento Ambiguo
> *"Mataré muchos enemigos."*

¿Cuántos es "muchos"? El DM decide cuándo se cumple y puede interpretarlo de formas inesperadas. La ambigüedad perjudica al jugador, no al sistema. Recompensa baja porque la premisa fue vaga.

#### Trampa 4 — El Juramento Autoreferencial
> *"Hoy cumpliré todo lo que me proponga."*

Se puede hacer. Pero la primera tirada fallida — cualquier check que no pase — es una contradicción directa con el voto. Prometiste cumplir TODO. Fallaste ALGO. **Fin deshonroso.** Los votos autorreferenciales son inherentemente frágiles.

### §4.7 Reemplazo de Compromiso Solemne = Fracaso (×2)

**Regla:** Declarar una nueva Compromiso Solemne mientras hay otra activa sin completar cuenta como **Fracaso**. La penalización es el **doble del Honor que se iba a recibir** al completar el voto abandonado.

| Voto abandonado iba a dar... | Penalización por reemplazo |
|---|---|
| +1d4 (trivial) | **−2d4** |
| +1d6 (menor) | **−2d6** |
| +1d8 (significativo) | **−2d8** |
| +1d10 (mayor/épico) | **−2d10** |

**Por qué funciona:**
- **Proporcionalidad perfecta.** Abandonar "pelearé en esta taberna" duele poco (−2d4, ~−5). Abandonar "derrotaré al Dragón Ancestral" es devastador (−2d10, ~−11).
- **Previene el vow-hopping.** Sin esta regla, un jugador podría rotar votos indefinidamente. El coste ×2 lo hace autodestructivo.
- **El Juramento-Campaña tiene peso real.** Abandonar el voto épico puede causar caída de 1-2 Niveles de Honor con feats desactivándose en cadena.
- **Crea un momento dramático.** Cada reemplazo es una escena narrativa de peso.

### §4.8 El Problema del Juramento-Campaña (Lock)

> *"Juro que derrotaré al Dragón Ancestral."* (el villano final de la campaña)

Esto es **legal** y **poderoso**: otorga usos de "¡Mi Honor lo Exige!" para checks contra el Dragón. Pero tiene un coste enorme:

- **No recibirá la recompensa de Honor hasta que lo logre** — posiblemente la campaña entera.
- **Su Compromiso Solemne está bloqueada** — una vez que gaste sus usos, no tendrá más recargas sin penalización.
- Si abandona o recarga declarando otro compromiso, sufre penalización ×2 del voto épico (−2d10).

**Esto NO es un bug — es una feature.** Representa al héroe que apuesta TODO a una causa. Es temáticamente perfecto (Gawain apostó todo en Alta Roca).

**Consejo para DMs:** Si un jugador hace un Juramento-Campaña, reconócelo narrativamente. Los NPCs deberían reaccionar — tanto positiva (inspiración, seguidores) como negativamente (enemigos que ahora saben tu objetivo).

### §4.9 Tabla Completa de Resultados del Compromiso Solemne

| Resultado | Honor | Mana | Nota |
|---|---|---|---|
| **Cumplido** | **+1d4 a +1d10** (según magnitud) | Coste ya pagado | Suma directa al atributo |
| **Fallo honesto** | **0 a −1 pt** | Gastado | Luchaste hasta no poder. La realidad lo reconoce. |
| **Abandono voluntario** | **−1d6 a −2d6** (Grado 2–3) | Gastado | Cortaste tu palabra voluntariamente. |
| **Reemplazo** (nueva vow) | **−2× la recompensa** del voto reemplazado | Nuevo coste | Voto +1d8 → penalización −2d8. |
| **Fin deshonroso** (autoreferencial) | **−1d6** | Gastado | El voto se rompió solo. |
| **Expiración inútil** (eterno) | **0** | Gastado | Slot congelado. No ganas ni pierdes. |

### §4.10 Ejes de Auto-Balanceo

**Eje 1: General vs. Específico**

| Eje | General | Específico |
|---|---|---|
| Versatilidad | Alta (cubre más situaciones) | Baja (cubre solo lo declarado) |
| Riesgo de abandono | Alto (más formas de fallar) | Bajo (más fácil de cumplir) |
| Gasto de recurso | Eficiente (un voto, múltiples objetivos) | Ineficiente (un voto, un objetivo) |
| Habilidad del jugador | Premia la audacia | Premia la prudencia |

**Eje 2: Facilidad × Recompensa × Duración**

| | Fácil de cumplir | Difícil de cumplir |
|---|---|---|
| **Recompensa** | Baja (+1d4) | Alta (+1d10) |
| **Duración** | Corta (consume usos rápidamente) | Larga (bloquea el slot a largo plazo) |
| **Riesgo** | Bajo | Alto (riesgo de agotar usos sin poder recargar) |
| **Uso táctico** | Breve | Prolongado pero finito |

**Matriz 2×2 combinada:**

| | Específico | General |
|---|---|---|
| **Fácil** | *"Mataré a ese guardia."* — Seguro, rápido, recompensa mínima. | *"Pelearé contra todos en esta taberna."* — Amplio pero controlado. |
| **Difícil** | *"Destruiré la filacteria del Lich."* — Claro, largo plazo, slot bloqueado. | *"Liberaré a todos los esclavos de Ashiria."* — Épico, riesgo máximo. |

El sistema **no necesita reglas extra** para balancear — la naturaleza de las palabras crea el equilibrio. Un jugador experimentado calibra la amplitud de su declaración. **Skill expression narrativa**, no optimización numérica.

---

## §5. La Metafísica del Honor — "Conductos de la Realidad"

### Concepto Central

> *"Los Honores se manifiestan como conductos y heraldos de algo mayor, la realidad misma. Si sus palabras y acciones no representan ese mundo que creen y crean, pierden poder. Por eso puede decir: 'Yo te voy a pegar' y usan Honor en vez de melee, porque es el mundo en sí y la inercia existencial la que guía su mano, no su habilidad."*

Esto es **la pieza filosófica más fuerte del diseño**. Define todo lo demás:

- **Por qué Honor reemplaza Melee:** No es habilidad marcial, es alineación con la voluntad del mundo.
- **Por qué mentir destruye Honor:** Tus palabras son tu conexión con la realidad. Si falsificas esa conexión, se corta.
- **Por qué un tirano honorable funciona:** La realidad no juzga moralidad — juzga **coherencia** entre intención declarada y acción ejecutada.
- **Por qué la conexión con Veritae es natural:** Veritae es el idioma de la magia. Un Honor puro cuyas palabras son ley está a un paso de hablar el idioma del universo.

### Conexión con Gawain

> *"Gawain en muchas formas era similar a Gideon y era el más cercano a lograr alinearse con la voluntad superior. Lo único que le faltó fue Flexibilidad y Humildad."*

Gawain era el **más cercano a la perfección**, pero su rigidez — la misma que lo hizo inquebrantable en Alta Roca — fue lo que le impidió trascender. La Senda del Honor hereda esa **grandeza incompleta**: poder inmenso, pero con una fragilidad inherente. La rigidez del juramento es su fuerza Y su debilidad.

---

## §6. Conexión con Veritae y Multiclase Mago

### Propuesta
Honor + Mago = acceso al lenguaje **Veritae**.

### Implicaciones

Veritae es el idioma en que Naya'il maldijo a Gawain. Un Honor/Mago que habla Veritae es literalmente alguien cuyas palabras **alteran la realidad** — no como metáfora, sino como mecánica.

Esto abre:
- **Juramentos en Veritae** con efectos mágicos (no solo marciales).
- **Maldiciones involuntarias** tipo Naya'il.
- **Un techo de poder aterrador** — y con él, un techo de riesgo.

> **[ESQUELETO]** La interacción Honor + Veritae es potencialmente el sistema más poderoso del juego. Desarrollar como módulo propio una vez que las mecánicas base del Honor estén sólidas.

---

## §7. Evaluación Conceptual

### Lo Que Funciona Extraordinariamente Bien

1. **El Juramento como identidad mecánica.** No estás eligiendo "feats de una lista" — estás escribiendo una declaración de quién eres. Cada personaje de Honor tendrá un juramento diferente, y ese juramento ES su build.

2. **Honor como atributo narrativo.** Al separarlo del XP y ponerlo en manos del DM, se gana viviendo de acuerdo a tu palabra. Fuerza roleplay orgánico, no optimización.

3. **La dualidad poder/fragilidad.** Un Honor alto te hace devastador. Una sola mentira puede deshabilitar feats en cadena. El jugador camina sobre una cuerda floja.

4. **Coherencia cosmológica.** La explicación de "conducto de la realidad" justifica CADA mecánica. Honor reemplaza Melee porque la realidad actúa. Mentir debilita porque cortaste tu conexión. Compromiso Solemne funciona porque declaraste tu intención al universo.

5. **El eco de Gawain.** La clase hereda la grandeza y la tragedia de su Primigenio.

6. **Compromiso Solemne: General vs. Específico.** El auto-balanceo por amplitud de la declaración es diseño elegante. La estructura del lenguaje crea el riesgo. **Skill expression narrativa**: ser bueno con Honor es saber qué decir y cuándo.

7. **Fallo honesto ≠ Mentira.** Gawain luchó hasta que su cuerpo no pudo más — y eso no fue deshonor. Esta regla reproduce esa ética.

8. **Sistema antifrágil.** Cada intento de cheese se castiga solo — juramentos triviales, eternos, ambiguos y autorreferenciales se destruyen por su propia naturaleza. Los únicos votos que funcionan bien son los honestos, claros y de alcance razonable.

### Lo Que Necesita Cuidado

1. **Espiral de pérdida.** Si perder Honor desactiva feats → debilidad → más pérdida. La decisión de no penalizar el fallo honesto mitiga esto (la espiral solo se activa por elección activa del jugador, no por mala suerte).

2. **Interacción Dado de Senda / Grado.** Honor sube por narrativa, feats se compran con XP. Dos ejes independientes. Las habilidades deben decir claramente cuál usan.

### Veredicto

**El diseño es sólido, ambicioso y temáticamente brillante.** Es la clase más "Gideon" de todas — filosóficamente rica, mecánicamente exigente, narrativamente integrada. Las piezas encajan. Lo que falta es calibración numérica y definir los bordes.

---

## §8. Propuesta de Estructura de Carpeta (Post-Aprobación)

Una vez resueltas las decisiones pendientes y aprobado el diseño, crear:

```
20_Contenido/
└── Senda_Honor/
    ├── Honor_00_Filosofia_de_Diseño.md    ← Cosmología, metafísica, herencia de Gawain
    ├── Honor_01_Atributo_Honor.md          ← Mecánica del atributo, mejora, pérdida
    ├── Honor_02_Juramento_Declarado.md     ← Sistema de frases, tiers, combinaciones
    ├── Honor_03_Quick_Vow.md              ← Mecánica del voto rápido
    └── Honor_04_Veritae_y_Multiclase.md   ← [ESQUELETO] Interacción con magia
```

Documentos Core a actualizar:
- `40_Mundo/Core_01_Cosmologia_y_Mitologia.md` → Agregar regla de Herencia de Sendas.
- `20_Contenido/Core_12_Sendas_Mecanicas.md` → Reemplazar `[ESQUELETO]` del Honor con referencia a la carpeta.
- `40_Mundo/Core_02_Personajes_Notables.md` → Agregar nota sobre Gawain y la voluntad superior (§2.8).
