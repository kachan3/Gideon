# Diseño — El Miedo como Estado Alterado ("El Veneno del Alma")

> **⚠️ REENCUADRE 2026-07-17:** Hassan aportó la idea de **Determinación** — barra secundaria del alma (inicial = Voluntad, 00–99) que el Miedo ataca directamente, con acciones Recall que la sanan. Ver `Aportes_2026-07-17_Caida_Montura_Determinacion.md` §3. Pendiente decidir si la barra reemplaza al track de 3 niveles de este documento o si conviven (niveles como síntomas por umbrales de la barra).

> **PROPUESTA NO RATIFICADA — brainstorm solicitado por Hassan 2026-07-15.** Nada de este documento es canon hasta ratificación explícita. Unifica y reemplazaría, de aprobarse, los tres estados solapados de §18: Terror/Aterrado, Asustado `[ESQUELETO]` y Pánico/Miedo `[ESQUELETO]`.

---

## 0. Falencias del estado actual (detectadas 2026-07-15)

| # | Falencia | Ubicación |
|---|---|---|
| F-M1 | Aterrado usa "desventaja" — vocabulario D&D no mapeado a la escala circunstancial (mismo caso que pendiente #10) | `Core_18` §18 |
| F-M2 | Tres estados solapados sin jerarquía: Terror/Aterrado, Asustado, Pánico/Miedo | `Core_18` §18 |
| F-M3 | "Salvación de Voluntad" en Fastidioso — mecánica inexistente (¿Templanza?) | `Core_13` §13.9.3 |
| F-M4 | "Nervios de acero" (inmune a *asustado*) y Furia ("el miedo no puede impedirte acercarte") presuponen estados que no dialogan entre sí | `Core_12` |
| F-M5 | El quiebre por miedo necesita la Tabla de Traumas 1d10, aún `[ESQUELETO]` | `Core_11` §11.5 |

## 1. Principios de diseño (derivados del motor y del tono)

1. **Fantasía Heroica:** el miedo casi nunca quita el control del personaje. La regla ya está escrita en el Core: *"Coraje no es ausencia de miedo — es funcionar a pesar de él"*. El miedo grava decisiones; no las elimina.
2. **Anti-frustración:** perder el turno ya es territorio de Agotamiento 3 / Aturdido. El miedo nunca dice "no jugás": dice "jugar contra ESTO te cuesta más".
3. **Elegancia = piezas nativas:** escala circunstancial (−10/−20/−30), Templanza/Coraje/Fe, economía de 3 PA, patrón de 3 niveles de Agotamiento, patrón de rasgo `Torpe (X)`, capicúa Portento/Pifia.
4. **Tema:** *"el miedo es el veneno del alma"* → simetría-contraste con Agotamiento: el Agotamiento envenena el **cuerpo** (resta acciones; el 4.º punto **mata**). El Miedo envenena el **alma** (resta eficacia y posición; el 4.º punto no mata: **quiebra** → Trauma).

---

## 2. PROPUESTA A — Track unificado de Miedo, 3 niveles + quiebre *(recomendada)*

Un único estado **Miedo (fuente)** con 3 niveles, siempre ligado a una fuente concreta. Absorbe Asustado/Aterrado/Pánico como peldaños de una sola escalera.

| Nivel | Nombre | Efecto |
|---|---|---|
| 1 | **Asustado** | Toda tirada contra la fuente o bajo su presión es **Complicada (−10)**. Podés acercarte. |
| 2 | **Aterrado** | **Difícil (−20)**. No podés acercarte voluntariamente a la fuente. |
| 3 | **Despavorido** | **Muy Difícil (−30)**. No podés acercarte; si empezás tu turno viendo la fuente, tu **primera acción** debe ser alejarte o Cubrirse — el cuerpo manda. |
| 4.º punto | **PÁNICO (quiebre)** | 1 ronda sin control: tus 3 PA se gastan huyendo por la ruta más segura (sin ruta: Cubrirse y nada más). Al terminar, volvés a nivel 3 y, si la fuente era sobrenatural (Daemonis, Primigenio, acto Ruin), tirás **1d10 en la Tabla de Traumas**. El miedo no mata: **quiebra**. |

### Adquisición — rasgo Pavor (X)

Las fuentes de miedo llevan **Pavor (X)** (mismo patrón que `Torpe (X)`). Al exponerte por primera vez en la escena —o cuando la fuente ejecuta un acto aterrador— tirás **Templanza** con Dificultad X:

- **Éxito** → inmune a esa fuente el resto de la escena. *(Clave anti-frustración: nunca se re-tira cada ronda.)*
- **Fallo** → +1 nivel de Miedo. **NF ≥ 5** → +2 niveles. **Pifia** → Pánico directo.
- La **Templanza obligatoria ante actos Ruin de entidades Daemonis (§1.4.3)** ya existente pasa a ser simplemente un gatillante de Pavor: encaja sin regla nueva.

### Agencia — Morder el Freno (1 PA)

El corazón jugable: el miedo se convierte en una decisión de economía de acciones.

- **Morder el Freno (1 PA):** tirada de **Coraje** (o **Fe**, a elección de quien la tiene). Éxito → ignorás TODOS los efectos del Miedo hasta tu próximo turno (penalizaciones y restricción de acercarte). Si además **NE ≥ X** de la fuente → bajás 1 nivel.
- **Portento en Coraje** → limpiás todo tu Miedo y los aliados que te ven bajan 1 nivel (momento heroico).
- **Pifia en Coraje** → +1 nivel.

¿Pago 1 de mis 3 PA para funcionar a pleno esta ronda, o actúo mermado y guardo la acción? Esa pregunta ES el gameplay del miedo.

### Recuperación

Al final de tu turno **sin línea de visión** a la fuente (o con la fuente muerta/ida): −1 nivel. El miedo se disipa rápido; **el Trauma es lo que queda**. Fuera de escena, el Miedo desaparece por completo.

### Interacciones (resuelve F-M4)

- **Nervios de acero:** inmune al nivel 1 de Miedo (nunca quedás Asustado por fuentes mundanas; las sobrenaturales te llevan directo a nivel 1 en vez de 2). *(Alternativa: cap de nivel 2.)*
- **Furia ("el miedo no puede impedirte acercarte"):** ignora las restricciones de aproximación de niveles 2–3 y la huida de Pánico; conserva las penalizaciones de tirada.
- **Concentración Demandante (§13.6.7):** prueba de Enfoque al **ganar un nivel** de Miedo (reemplaza "al ser Asustado").
- **Fastidioso (§13.9.3):** reescribir como *"Pavor 2: Templanza o Miedo 1 hasta el fin de su próximo turno"* (resuelve F-M3).

---

## 3. Alternativas evaluadas

### PROPUESTA B — Miedo como Contrarreste
Cada nivel de Miedo **resta niveles de éxito (NE)** en tiradas contra la fuente, en vez de mover la dificultad. Más granular y matemáticamente invisible. **Contra:** duplica contabilidad con la escala circunstancial; el −X% en d100 es más visceral y legible en mesa. Descartada por redundancia con A.

### PROPUESTA C — Miedo como impuesto de PA
Cada nivel de Miedo "congela" 1 PA mientras veas la fuente (Agotamiento situacional y reversible). Brutal y elegante en abstracto. **Contra:** pisa el diseño de Agotamiento (misma moneda, mismo efecto) y stackear ambos deja personajes con 0 acciones — exactamente la frustración que se quiere evitar. Descartada.

### PROPUESTA D — Miedo binario, sin niveles
Un solo estado: no podés acercarte + tiradas Difíciles contra la fuente; Coraje (1 PA) para suprimir. Máxima sencillez, cero tracking. **Contra:** sin escalada no hay dramatismo ni peldaño para Pánico/Trauma — y los horrores del setting (Primigenios, Naya'il, Arghaar, lo que vio Diana) piden escalada. Viable como versión MVRPG si A resulta pesada en playtest.

---

## 4. Pendientes que esta propuesta activaría (si se ratifica A)

1. Desarrollar la **Tabla de Traumas 1d10** (F-M5 — hoy el DM narra).
2. Asignar valores de **Pavor (X)** a criaturas existentes (¿escala junto al Tier?: un dragón adulto +3 difícilmente tenga Pavor bajo).
3. Reescribir Fastidioso, Concentración Demandante, Nervios de acero y Furia con la terminología nueva.
4. Decidir si el Pánico de PJs ante fuentes mundanas (no Daemonis) también tira Trauma o solo narra.

---

*Propuesta redactada 2026-07-15 — a la espera de ratificación, ajuste o descarte por Hassan.*
