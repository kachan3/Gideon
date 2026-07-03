# NÚCLEO JUGABLE — Crónicas de Gideon

> **Documento de trabajo (2026-06-15).** Reúne en un solo lugar **todo lo que depende de la tirada de 1d100**: el motor de resolución, atributos y mejora, combate, daño/heridas/estados, magia y la hoja de fórmulas. El objetivo es ver el sistema completo de una sola pasada para **re-pensar y definir** lo que falta.
>
> Marcas usadas:
> - 🔎 **REVISAR** — decisión abierta o inconsistencia detectada (sesión 2026-06-15).
> - `[ESQUELETO]` — pieza referenciada pero no desarrollada.
> - *(canónico)* — ya ratificado por Hassan en el Core; se trae tal cual.
>
> Esto **no reemplaza el Core** hasta que ratifiques los puntos del índice.

---

## 0. ÍNDICE DE PENDIENTES (re-pensar / definir)

**Del motor (sesión 2026-06-15, lo más fresco):**

1. 🔎 **Piso de Ranking — inconsistencia.** Dijiste *"el tier superior tiene un éxito de 8 + NE real"*, pero el ejemplo del dragón (96 → éxito 9) sólo cuadra con un **piso de 8** (NE ≥ 8), no con una suma (+8 daría 17). Redactado como piso. **Confirmar:** ¿piso 8 o suma +8?
2. ~~🔎 **Borde de la banda baja.**~~ **✅ RESUELTO (C-7, 2026-07-03): 00–05 éxito crítico / 95–99 fallo crítico.**
3. `[ESQUELETO]` **Empate-fallo en enfrentada.** Regla puesta: gana el menor NF. Pendiente el *wraparound* de unidades (un 60 tiene NF 0 pero está lejos del Valor) y los desempates de NF.
4. `[ESQUELETO]` **Alcance del Ranking entre varios tiers.** ¿El "fallo = éxito vs tier inferior" vale contra todos los tiers menores? ¿El NE degrada por escalón?
5. `[ESQUELETO]` **Pifia del tier superior.** ¿Se relee como éxito hacia abajo o "queda" como fallo para darle aire al inferior? (Con piso 8, hoy una Pifia daría NE ≥ 8 a 1 tier de diferencia.)
6. 🔎 **¿A qué tiradas se aplican bandas, Portentos/Pifias y NE/NF?** Sólo a resolución de tareas, o también a tiradas no-enfrentadas como **mejora de habilidad**, **Nacimiento (1d100)** e **iniciativa**. Hay que fijar el alcance.

**Inconsistencias de terminología/regla con el resto del Core (a unificar):**

7. 🔎 **Enfrentada de Voluntad en magia (§13.6.7.bis)** dice "gana el de mayor *resultado*", pero la regla general de enfrentadas es **mayor NE**. Unificar.
8. 🔎 **Iniciativa (§11.6)** ordena por "más NE … más NF" con desempate por Instinto, mientras que la enfrentada general desempata por dado→habilidad. Alinear ambos criterios y decidir si la iniciativa usa el motor nuevo.
9. 🔎 **Vocabulario de modificadores disperso.** Varias reglas ya existentes son, en realidad, las capas nuevas con otro nombre: "−3 NE por brazo herido", "aturdimiento = NE del impacto", "cada herida grave reduce 1 NE", la Acción Ayudar (suma/resta NE/NF). Conviene reexpresarlas como **Contrarreste/Refuerzo/Agravio/Mitigación**.
10. 🔎 **"DIF 1" (Perjuicio Desagradable — C-5)** y "Muy Difícil/Fácil" (Airborne, Zonas) deben mapearse a la escala circunstancial nueva (y a "el mayor prevalece").
11. ~~🔎 **Tabla §20.bis "Resolución de Tiradas"**~~ **✅ Actualizada (C-7, 2026-07-03): bandas incorporadas y "99 sin máximos" superado.** Portento/Pifia siguen pendientes de ratificación.
12. 🔎 **PL = 1 + NE** con NE hasta 10 (Portento) y con el **desborde >100** puede disparar PL muy alto. Confirmar techo o intención.

**Esqueletos mecánicos ya marcados en el Core (siguen abiertos):**

13. `[ESQUELETO]` Flujo completo de **ataque** (defensas, salvaciones, NE/NF → daño). §11.8.
14. `[ESQUELETO]` **Golpe Poderoso** (combo sin describir). §11.10.
15. ~~`[ESQUELETO]` Umbral de **Comatoso**~~ — **✅ RESUELTO (C-1, 2026-07-03): reducción ¼ MH por grave; Comatoso = 4 graves.**
16. `[ESQUELETO]` Mitigación de **Necrótico / Radiante / Sónico**; conteo final **12 vs 14** tipos de daño. §11.5.
17. `[ESQUELETO]` "Cada herida grave/mortal reduce 1 NE" — confirmar. §11.3.
18. `[ESQUELETO]` **Inspiración (Omen)**: ¿conserva las reglas detalladas de los viejos Puntos de Profecía o se simplifica? §11.13.
19. `[ESQUELETO]` **Misscast** (tabla por escuela) y **aprendizaje/almacenamiento de conjuros**. §13.6.
20. `[ESQUELETO]` Tabla de **Traumas** psíquicos (1d10). §11.5.

---

# PARTE I — MOTOR DE RESOLUCIÓN

## I.1 El Valor y la resolución básica

Toda tarea de resultado incierto se resuelve tirando **1d100 (00–99)** y comparándolo contra un **Valor**: un número en escala 00–99 que representa la competencia o característica que se evalúa en esa tarea. **Igual o menor → éxito; mayor → fallo.**

El Valor es **genérico**: puede ser una habilidad, un atributo, un valor derivado, el Valor de otra criatura (enfrentadas) o un número plano del Director. Para el jugador, lo más común es el valor de una de sus habilidades.

El d100 se simula con dos d10 (decenas + unidades). Siempre se leen **dos cifras**: "7" es **07**.

## I.2 Bandas automáticas

- **00–05 → Éxito automático.** *(🔎 borde a confirmar: 00–05 o 00–04)*
- **95–99 → Fallo automático.**

Absolutas a tu propio tier: **bipasean Salvataje y Exigencia**. Garantizan que un maestro pueda fallar (~5%) y que cualquiera tenga una chance.

## I.3 Niveles de Éxito y Fallo (NE / NF) — lógica BlackJack

- **NE** = dígito de **decenas** (si éxito). **NF** = dígito de **unidades** (si fallo).
- Intuición BlackJack: te acercás a tu Valor **sin pasarte**. El mejor grado de éxito es el resultado más alto que aún no supera tu Valor; tirar muy bajo pasa con holgura pero da NE pobre.
- En una **tirada simple** sólo importa éxito/fallo: NE/NF se calculan únicamente cuando algo los pide.

## I.4 Portentos y Pifias (capicúa) *(reemplaza "críticos")*

Tirada **capicúa** (00, 11, 22, … 99) = crítico.
- Capicúa en éxito → **Portento** (NE 10).
- Capicúa en fallo → **Pifia** (NF 10).

El 10 supera cualquier resultado normal (máx. 9), por lo que los críticos son decisivos.

## I.5 Tiradas enfrentadas

Gana quien lo haga **mejor**:

1. Mayor **NE**.
2. Empate → mayor **valor en el dado**.
3. Empate → mayor **habilidad (Valor)**.
4. Empate → **re-tirar**.

**Si ambos fallan:** gana el de **menor NF**. *(🔎 ver pendiente #3.)*
Portento / Pifia (NE/NF 10) son decisivos.

## I.6 Modificadores — orden de aplicación

**Regla general:** modificadores opuestos se combinan **sólo dentro de su misma capa/unidad**; nunca entre capas distintas.

**Paso 1 — Modificadores de Habilidad (% sobre el Valor).**
- **Explícitos** (feats, equipo, hechizos): **se suman** entre sí.
- **Dificultad circunstancial** (decisión del DM en el momento): **prevalece el mayor** (no se acumulan); bono y penalización del mismo valor se **anulan** → Normal.

| Grado | Mod. | | Grado | Mod. |
|---|---|---|---|---|
| Muy Fácil | +30% | | Complicada | −10% |
| Fácil | +20% | | Difícil | −20% |
| Sencilla | +10% | | Muy Difícil | −30% |
| Normal | +0% | | Extrema | −40% |

**Paso 2 — Dados Extra (d10 de decenas).** Bonificación: el **jugador** elige la decena. Penalización: el **Director** elige la peor. *(Puede crear/romper capicúa.)*

**Paso 3 — Niveles de Éxito:** **Refuerzo** (+NE) / **Contrarreste** (−NE). Piso 0. **No transforma.**

**Paso 4 — Niveles de Fallo:** **Agravio** (+NF) / **Mitigación** (−NF). Piso 0. **No transforma.**

**Paso 5 — Umbrales (única capa que transforma):**
- **Exigencia (X):** NE debe **≥ X** o el éxito pasa a **fallo**.
- **Salvataje (X):** si fallás con **NF < X**, se convierte en **éxito de NE = NF original**; si **NF ≥ X**, queda fallo.
  - *Ej.:* Espadas 50, Salvataje 3, sale 72 → fallo NF 2 → como 2<3, **éxito NE 2**.

## I.7 Habilidad sobre 100 (desborde)

Las decenas que exceden la centena se suman como **NE plano a todos los éxitos**. *Ej.:* Valor 145 → +4 NE. Las bandas siguen vigentes (95–99 falla igual). *(🔎 pendiente #12.)*

## I.8 Ranking (tiers) en enfrentamientos de magnitud distinta

Escala de tier −2 … +3 (ver Parte IV / §11.1.bis del Core).

- **1 tier de diferencia:** enfrentada normal, pero el de **mayor tier lee su resultado hacia abajo** — incluso un fallo (o un fallo automático 95–99) cuenta como **éxito vs el tier inferior**, NE leído igual. Además tiene un **piso de NE de 8**. El inferior sólo gana sacando NE 9 cuando el superior saca bajo, o un Portento. *(🔎 piso 8 vs +8, pendiente #1.)*
  - *Ej.:* Dragón tier +1 saca 96 → para él es fallo, vs humano tier 0 es **éxito NE 9**; el humano gana sólo con Portento (NE 10).
- **2+ tiers de diferencia:** el de mayor tier **gana sin tirar**. El DM puede dejar tirar; sólo un **96–99** del superior abre una ventana estrecha (o el DM directamente no deja tirar).
- **Justificación:** el dado es suerte y circunstancias; el coloso siempre domina; si el inferior gana, el superior resbaló o se dejó. A interpretación del DM.
- **Daño por diferencia de tier:** +10 plano por cada tier de diferencia *(canónico)*.

---

# PARTE II — ATRIBUTOS, HABILIDADES Y MEJORA

## II.1 Atributos y habilidades *(canónico)*

10 atributos: **Fuerza, Vitalidad, Agilidad, Instinto, Voluntad, Inteligencia, Carácter, Melee, Proyectiles, Arcana.** Cada habilidad vale 1–100. **Nivel** = `INT(Valor/10)`. Las habilidades hijas empiezan con el valor de su atributo padre.

| Atributo | Habilidades hijas |
|---|---|
| Melee | Una mano, A dos manos, Armas Dobles, Bloqueo, Paradas, Desarmado |
| Proyectiles | Arcos, Ballestas, Armas de fuego, Asedio, Arrojar |
| Arcana | Yrgrammar, Naial, Cronibor, Ivganny, Ignamor, Gelmir |
| Fuerza | Carga, Escalar, Saltar, Firmeza, Atletismo |
| Agilidad | Sigilo, Acrobacias, Prestidigitacion, Evasion, Montar |
| Vitalidad | Cardio, Resistir, Metabolismo |
| Voluntad | Tenacidad, Coraje, Enfoque, Fe, Templanza |
| Carácter | Elocuencia, Liderazgo, Coaccion, Engañar, Entretener |
| Instinto | Percepcion, Detectar Intenciones, Orientacion, Adaptación, Manejo Animal |
| Inteligencia | Historia, Medicina, Naturaleza, Mecanica, Fisica, Quimica, C. Magico |

*(El DM puede añadir habilidades hijas a cualquier atributo según el setting.)*

## II.2 Generación inicial *(canónico)*

- **Aleatorio (recomendado):** `3d4 × 5` por atributo (rango 15–60); otorga un Dote de Origen extra.
- **Valores fijos:** 50, 45, 40, 35, 30, 30, 30, 20, 20, 15.

## II.3 Mejora de atributos y habilidades *(canónico)*

- **Tirada de mejora *(canon C-4 — 2026-07-03)*:** 1d100 **≥** valor actual → mejora; si no, falla y la Marca no se consume. Fuente única: `20_Contenido/Feat_Entrenamiento.md`. *(🔎 ¿bandas/críticos aplican aquí? pendiente #6.)*
- Durante la partida, marcás las habilidades que **uses y falles**; al subir de nivel intentás una mejora por cada una marcada.
- ~~**Puntos de entrenamiento**~~ *(eliminados — C-4: reemplazados por la Opción XP del feat Entrenamiento)*.
- Mejorar un **atributo** mejora automáticamente todas sus hijas.
- **Incremento *(canon C-4)*:** habilidad ≤75 → **+1d6**; habilidad ≥76 → **+1d4**; atributo → **+1d4**. ~~(1d4+1/+3, 1d6+2/+5)~~
- `[ESQUELETO]` tabla de puntos de mejora iniciales por linaje/clase/edad/Voluntad.

## II.4 Especializaciones *(canónico)*

Bono **contextual flotante**, independiente del atributo que se tire: se suma al Valor antes de tirar cuando la tirada toca el dominio (p. ej. "Grifos 10%" aplica a Historia, Medicina, Montar, ataque y Fuerza contra grifos). Se obtienen por Feats/Origen (no se entrenan ni se tiran para mejorar). Valor variable a criterio del DM.

---

# PARTE III — COMBATE

## III.1 Iniciativa, turnos y sorpresa *(canónico)*

Cada participante tira **iniciativa** (probablemente Instinto; *pendiente confirmar*). Orden: primero el de **más NE**, descendente hasta los de **más NF** (al final). Empate → mayor Instinto. 🔎 *Alinear con el motor de enfrentadas (pendiente #8) y definir si usa bandas.*

Fuera de sorpresa, todas las criaturas tienen sus **3 reacciones** listas. **Sorprendido:** tira iniciativa pero en su primer turno no actúa ni reacciona.

## III.2 Acciones *(canónico)*

**Dentro de iniciativa:** 3 acciones + 1 reacción + 1 acción gratuita por turno. Acción sobrante → reacción extra almacenada.

- **Preparar:** 2 acciones para dejar una acción lista como reacción.
- **Turno completo:** Preparación / Evasión / Escape (mueven media velocidad).

**Acción Ayudar** *(🔎 esto ya es el motor de NE/NF; reexpresar con Refuerzo/Mitigación — pendiente #9):*
- Ambos éxito → suma NE del ayudante al del ayudado (**Refuerzo**).
- Ayudante éxito, ayudado falla → resta NF del ayudado por los NE del ayudante (**Mitigación**).
- Ayudante falla, ayudado éxito → resta NF del ayudante a los NE del ayudado.
- Ambos fallan → suman sus NF.

## III.3 Atacar *(canónico + esqueleto)*

Atacar suele costar **1 acción**. Tirada 1d100 vs skill. Melee: `Melee + Habilidad correspondiente + Especialización`.
`[ESQUELETO]` flujo completo: defensas, salvaciones, NE/NF aplicados al daño (pendiente #13).

## III.4 Zonas de impacto *(canónico)*

Tabla 1d6: 1 Cabeza · 2 Torso · 3 Brazo izq · 4 Brazo der · 5 Pierna izq · 6 Pierna der.
- **Tirada libre:** 1d6 al resolver el ataque.
- **Apuntar:** declarás zona; tirás tantos d6 como **NE**; si alguno muestra la zona, impacta ahí; si no, el ataque se pierde. **Portento apuntado** siempre impacta la zona elegida. *(🔎 "crítico" → Portento.)*
- **Narrativa:** el DM fija la zona sin tirar.
- Contra criatura un tamaño mayor sin Alcance, un 1 (cabeza) se re-rolea; a Rango contra criatura mayor, se elige zona gratis.

## III.5 Reacciones defensivas *(canónico)*

Toda reacción defensiva (Parry, Esquiva, Rodar, Bloqueo de escudo, Deflectar…) **requiere un Sentido Preciso operativo sobre la fuente del ataque**.

- **Sentido Preciso** = sentido direccional y detallado. Por defecto la **vista** (sujeta a Iluminación). Otros: oído-ecolocación (hombre murciélago), percepción de sangre (vampiro), Ojo Arcano (mago). Anularlo deja sin reacciones defensivas contra esa fuente.
- **Iluminación:** Clara (sin penalización) · Tenue (visión dificultada) · Nula (ciego efectivo). **Darkvision** sube Tenue→Clara con luz residual; en Nula no funciona.

**Bloqueo con escudos:** requiere escudo y no estar Arrebatado.
- **Bloqueo activo:** tiradas enfrentadas de `Melee (Bloqueo)` contra ataques melee.
- **Cubrirse** (1 acción): suma la protección del escudo a ataques entrantes y permite defenderse de ataques a Rango; si es tu última acción no quedás Arrebatado; perdés el bono si quedás Incapacitado.

## III.6 Combos, Airborne, Tamaños *(canónico)*

**Combos** (1–2 acciones, 1 Stamina, 1 por turno): **Golpe Insistente** (re-rolea ataque fallido; 2 acciones → hasta 2 re-rolls), **Multi Ataque**, **Golpe Poderoso** `[ESQUELETO]`.

**Airborne** (Estado Alterado): todas tus tiradas **Muy Difíciles**; apuntarte a Rango Muy Difícil; atacarte en melee **Fácil**; Velocidad 0 (salvo vuelo); al inicio de turno 1 acción y luego caes (daño de caída). 🔎 *"Muy Difícil/Fácil" = escala circunstancial; ver pendiente #10.*

**Tamaños:** Diminuta→Titánica. Arma que sube de tamaño duplica dados de daño (y precio/peso) por escalón. **+2** al ataque contra criatura más grande, **−2** contra más pequeña.

## III.7 Descansos *(canónico)*

- **Corto:** 1 h, sin amenaza, lugar seco.
- **Largo:** 6 h sueño + comida (500 g) + bebida limpia + abrigo + relativo silencio; 1 por día.

---

# PARTE IV — DAÑO, HERIDAS Y ESTADOS

## IV.1 Daño y heridas *(canónico)*

- **MH / PG Máximos** = `Resistencia del Linaje + (Nivel × Nivel de Vitalidad)`.
- **Heridas ganadas** = `Daño − (Nivel de Vitalidad + Armadura)`.
- **Dureza** = `Nivel de Vitalidad`.
- **Herida Grave:** Daño ≥ **MH/2** *(Hassan; antes X decía MH/4)*. **Herida Mortal:** Daño ≥ **MH**.
- **PG Reales** = `MH − (MH/4) × heridas_graves` → con **4 graves**, PG Reales = 0. *(✅ canon C-1 — Hassan 2026-07-03; corrige la versión ½/2-graves de este borrador.)*
- **Localización (1d6)** sólo para heridas Graves/Mortales: 1 Pierna der · 2 Pierna izq · 3 Brazo der · 4 Brazo izq · 5 Torso · 6 Cabeza.
- **Penalizaciones por zona** (Grave = temporal, Mortal = mutilación): Brazo **−3 NE** a acciones con esa mano; Pierna −10 ft; Torso −1 acción/turno; Cabeza gana **Aturdimiento = NE del impacto**; cabeza mutilada → muerte.
  - 🔎 *"−3 NE" y "Aturdimiento = NE del impacto" son Contrarreste/lecturas de NE; reexpresar con el vocabulario nuevo (pendiente #9).*
- 🔎 *Nota interna M:* "cada herida grave/mortal reduce 1 NE a tus tiradas" `[ESQUELETO confirmar]` (pendiente #17).
- **Heridas persistentes** (de M): impiden curar del todo, no bajan MH; necesitan tratamiento.
- **Infección:** salvación de Vitalidad en secreto → días hasta sepsis (Herida Mortal).

## IV.2 Tipos de daño y mitigación *(canónico — 🔎 conteo 12 vs 14, pendiente #16)*

Físicos x/y/z: **Cortante (x), Punzante (y), Contundente (z)** → Dureza + Armadura del tipo.
Otros: **Fuego/Frío/Rayo** → Dureza · **Veneno/Ácido** → Dureza + Resistencia específica · **Necrótico** → Dureza + Resist. espiritual menor `[ESQUELETO]` · **Radiante** → Voluntad o Carácter `[ESQUELETO]` · **Sónico** → Dureza parcial `[ESQUELETO]` · **Espiritual** → Nivel de Voluntad (Vitalidad NO protege) · **Psíquico** → Nivel de Inteligencia (Vitalidad NO protege) · **Verdadero** → sin mitigación.

Modificadores de tipo: **Frágil** (+X), **Protección** (−X), **Debilidad** (×2), **Resistencia** (÷2), **Afinidad** (lo ganás como PG).
Daño Psíquico grave → **1d10** en Tabla de Traumas `[ESQUELETO]`.

## IV.3 Estados Críticos *(canónico)*

| Estado | Condición |
|---|---|
| **Activo** | PG Reales > Heridas activas, ninguna mortal |
| **Desmayado** | Heridas al límite soportable, **sin mortal**. Recuperable. |
| **Moribundo / Agonizando** | ≥1 herida **mortal** activa |
| **Comatoso** | **4 heridas graves** (reducción ¼ c/u), sin mortal; muere si lo abandonan *(✅ resuelto C-1 — 2026-07-03)* |

- **Desmayado:** 5 h base; tirada **plana de Vitalidad** → NF suman tiempo, NE restan (mín. 5 min); luego restás 1 Herida y despertás.
- **Moribundo:** tirada de Vitalidad → **falla = muerte**; **éxito** = seguís Moribundo tantos turnos como el **NE**; necesitás estabilización/−1 Herida en ese plazo o morís.
- **Comatoso:** sin recuperación natural; morís por abandono `[ESQUELETO tiempo]`.

---

# PARTE V — MAGIA (resolución)

## V.1 Manifestar Hechizo *(canónico)*

Coste en acciones variable (lo define el conjuro); si dura varios turnos, se invierten antes y la tirada se hace **una vez** al final. Si perdés un requisito en el proceso, el hechizo falla.

- Cada hechizo pertenece a un **Flujo Arcano**; al manifestarlo, prueba de la habilidad de ese flujo.
- **PL (Nivel de Potencia) = 1 + NE.** 🔎 *Con Portento (NE 10) y desborde >100 el PL escala mucho — pendiente #12.*
- **Coste base** = `1 + PL` en Maná (si el conjuro no define otro). Podés usar menos PL → más barato y débil.
- Algunos hechizos piden **NE mínimo**; si no se alcanza, falla.
- **Inversión de PL** sólo en aspectos que el hechizo permita (daño, alcance, área, duración, objetivos). Límite por aspecto = **Nivel de Inteligencia**.
- **Daño Genérico (DG)** = `PL × Nivel de Voluntad`.
- Roles: **Arcana** = afinidad/tirada; **Inteligencia** = control de PL por aspecto; **Voluntad** = impacto (DG).

## V.2 Concentración, conflictos, fallos *(canónico)*

- **Concentración:** Ligera (estable, una a la vez) · Demandante (prueba de **Enfoque** al recibir daño o Asustado; se pierde al Aturdido/Dormido/Agonizando) · Exhaustiva (3 acciones/turno).
- **Conflictos entre Modificaciones:** tirada **enfrentada de Voluntad**; gana el de mayor resultado, empate → cede el más reciente. 🔎 *Dice "mayor resultado" pero la enfrentada general usa NE — unificar (pendiente #7).*
- **Misscast:** efectos adversos al fallar la manifestación `[ESQUELETO tabla por escuela]`.
- **Aprendizaje/almacenamiento de conjuros** `[ESQUELETO]` (pendiente #19).

---

# PARTE VI — HOJA DE FÓRMULAS (referencia rápida)

**Personaje:** Nivel de Atributo = `INT(Valor/10)` · Habilidad hija = `Modificación + Atributo padre` · Generación = `(d4+d4+d4)×5`.

**Vida:** ~~MH = `Resistencia Linaje + (Nivel × Nivel Vit)`~~ *(pre-eliminación de NV 2026-06-28; canon: `Resistencia del Linaje + Nivel de Vitalidad` — y existe propuesta C-3, ver 30_Propuestas)* · Grave = `ROUNDUP(MH/2)` · Mortal = `MH` · PG Reales = `ROUNDUP(MH − (MH/4)×graves)` *(canon C-1 2026-07-03)* · Dureza = `Nivel Vit`.

**Recursos:** ~~Maná Máx = `Voluntad + (Nivel × Nivel Vol) − Daño Crónico` · Stamina = `Nivel + Nivel Vit − graves`~~ *(fórmulas pre-eliminación de NV 2026-06-28 — canon vigente en §20.bis; propuesta C-3 pendiente)* · Límite Seguro Maná = `Nivel Vol + Nivel Vit`.

**Magia:** PL = `1 + NE` · Coste = `1 + PL` · DG = `PL × Nivel Vol` · Límite PL/aspecto = `Nivel Int`.

**Resolución (motor nuevo — reemplaza la tabla vieja del §20.bis):** 00–05 éxito auto · 95–99 fallo auto · éxito `d100 ≤ Valor` · NE = decenas · NF = unidades · capicúa éxito = Portento (NE 10) · capicúa fallo = Pifia (NF 10) · tiers ver Parte I.8. 🔎 *La tabla del Core aún dice "99 sin regla de máximos" — actualizar (pendiente #11).*
