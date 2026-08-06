# Pendientes para el Primer Playtest

> **Fase 11 — 2026-07-03.** Actualiza y reemplaza como referencia operativa al diagnóstico `90_Control/Analisis_Mini_Campana_Prueba.md` (2026-06-28), incorporando todo el canon C-1…C-11 y D-1…D-8. Objetivo: llegar cuanto antes a un **RPG Mínimo Viable (MVRPG)** para validar el sistema en mesa.
> Etiquetas: **[Motor]** reglas fundamentales · **[Contenido]** lo que las usa · **[Mejora]** opcional/avanzado · **[Expansión]** versiones futuras.
> Toda regla marcada **[PROVISIONAL]** es una propuesta mía para no frenar el playtest (las pediste en el punto 3 de la Fase 11): **requiere tu visto bueno antes de usarse** y no es canon.
>
> **Revisión de vigencia — 2026-07-13.** Verificado contra los archivos Core: la última marca de canon en todo el repo sigue siendo 2026-07-03, así que **no hubo cambios desde el cierre de este documento**. Confirmé que los tres bloqueadores numéricos persisten tal cual (§14 con columnas de daño vacías — `Espada corta | — | — | — | —`; grados de Competencia sin cuantificar en 00–99; Resistencia del Linaje sin número por subraza). Sin incongruencias lógicas internas: los conteos 11✅/7🟡/10🔴 suman 28 y el cálculo (11 + 7×0,5)/28 ≈ 52 % verifica. **El documento sigue plenamente válido; no requiere reescritura.**

---

## 0. Conclusión ejecutiva

El motor quedó casi cerrado tras las decisiones del 2026-07-03. Lo que impide jugar hoy **no son reglas complejas: son números que faltan** (Resistencia del Linaje, valores de Competencia, daño de armas) **y la ausencia total de enemigos**. Con **7 pendientes críticos** —cinco de los cuales son tablas de números que se deciden en una tarde— y un puñado de provisionales, se puede correr una mini campaña de 2–3 sesiones.

**Atajo recomendado:** el primer playtest puede correr con las **4 fichas pregeneradas de la Canva 1e** (Valor, Arcanista, Hierofante, Silente — ya tienen stats, entrenamientos, armas con daño, conjuros y dotes). Eso esquiva de entrada los bloqueadores de creación de personaje y deja la prueba enfocada en el motor: **Playtest A (pregens) ≈ a 1 sesión de trabajo de distancia; Playtest B (con chargen completo) ≈ 2–3 sesiones de trabajo.**

---

## 1. Bloqueadores CRÍTICOS — sin esto no se juega

| # | Pendiente | Tipo | Qué falta exactamente | ¿Sustituible por provisional? |
|---|---|---|---|---|
| C1 | **Escalado Vital del Linaje (factor multiplicador por subraza)** | [Motor] | Base de `MH = ROUNDUP(Escalado Vital × Nivel de Vitalidad)`. | Resuelto — **[CANON]** Factor 2 (Viento/Río), 2.5 (Estrellas/Bosque/Luna), 3 (Hielo/Tierra/Sol), 5 (Jottun). |
| C2 | **Valor numérico de las Competencias** (Novicio/Entrenado/Experto/Maestro/Leyenda) | [Motor] | Cada senda reparte competencias y hay fórmulas que suman "Competencia de entrenado", pero nunca se cuantificó en la escala 00–99 | Sí — **[PROVISIONAL]** Novicio +0 · Entrenado +10 · Experto +20 · Maestro +30 · Leyenda +40 (sujeto al techo 80 en creación) |
| C3 | **Daño de armas** (tablas §14.2/§14.3 vacías) | [Contenido] | Ningún arma tiene daño/peso/precio en el Core | Sí — **[PROVISIONAL]** usar el catálogo de las fichas 1e como tabla mínima: Espada Bastarda 3 C/P (Versátil +1) · Cimitarra 3 · Maza 2 Cont (Penetración 2) · Daga 2 P/C (Ágil, Ligera, Arrojadiza) · Arco Corto 4 P (Rango 20) · Jabalina (Arrojadiza 60). Añadir 3–4 genéricas a ojo del DM |
| C4 | **Statblock de criaturas + bestiario mínimo** | [Contenido] | No existe formato de enemigo ni un solo adversario. Solo Minions/Tropas (§11.16) | Parcial — **[PROVISIONAL]** construir enemigos como "personajes rápidos" con la hoja X (atributos 3d4×5, Resistencia provisional, 1 arma) + regla de Minions para grupos. Alcanza para el playtest; el formato real sigue pendiente |
| C5 | **Procedimiento unificado de ataque** | [Motor] | Todas las piezas ya son canon (tirada vs skill → Reacción Defensiva → zona 1d6 → `Daño = NE + arma + Nivel de Fuerza` → mitigación → heridas), pero están repartidas en §11.8, §11.8.bis, §11.9, §11.3 y Canva #168-B. El §11.8 aún dice `[ESQUELETO: flujo completo]` | Sí — es **redacción, no diseño**: consolidar media página con los 6 pasos. Sin esto el DM improvisa el orden en cada golpe |
| C6 | **Estados de combate invocados sin regla** | [Motor] | **Aturdimiento** (heridas en cabeza generan contadores que no hacen nada), **Incapacitado** (lo invocan Cubrirse y Concentración), **Asustado** (Concentración Demandante) | Sí — **[PROVISIONAL]** Aturdimiento: mientras tengas contadores, −1 acción por turno y descartás 1 contador al final de tu turno · Incapacitado: no podés actuar ni reaccionar · Asustado: como Aterrado (§18, ya definido) |
| C7 | **Repertorio de conjuros del caster** (INCONG #55 — aprendizaje/almacenamiento) | [Motor] | Sin regla de cuántos conjuros se conocen ni cómo se aprenden: no se puede operar un lanzador | Sí — **[PROVISIONAL]** congelar el modelo de la ficha 1e: **3 trucos + 3 conjuros + 1 ritual + 1 Mística**, sin aprendizaje durante el playtest. El sistema real de aprendizaje queda para después |

**Con C1–C7 resueltos (o en provisional aprobado), la campaña se puede jugar de principio a fin.**

## 2. IMPORTANTES — se juega, pero el DM improvisará seguido

| # | Pendiente | Tipo | Nota / provisional |
|---|---|---|---|
| I1 | **Consolidación del motor v2 restante** (capas de modificadores, Exigencia/Salvataje, anulación de "NE<0 transforma") — D-2: sigue propuesta | [Motor] | Jugable con la regla vieja de §11.1 + escala circunstancial (±10/20/30/40). Riesgo: dos redacciones conviviendo. **[PROVISIONAL]** declarar que el playtest usa §11.1 vigente + escala circunstancial y anotar cada fricción para decidir el v2 con datos de mesa |
| I2 | **Desempates de enfrentadas** (mayor NE es canon implícito; dado→Valor→re-tirar es propuesta v2) | [Motor] | **[PROVISIONAL]** usar los desempates del borrador v2 (los implementa el Simulador) |
| I3 | **Curación natural** (¿cómo se recuperan Heridas y graves fuera de Desmayado/magia/Tratar Heridas?) | [Motor] | **[PROVISIONAL]** descanso largo: −1 Herida; herida grave: cierra con NE ≥ X de Medicina o 1 semana de reposo (número a fijar en mesa) |
| I4 | **Cadencia de XP** ([PENDIENTE] en la propuesta de XP) | [Motor] | **[PROVISIONAL]** 1 XP por sesión + 1 XP por milestone. Con el feat Entrenamiento a 1 XP por sesión de uso (D-8), esto da un ritmo de mejora medible |
| I5 | **Skills garantizadas de Dedicaciones** (solo Médico y Soldado definidas) | [Contenido] | Solo afecta al Playtest B (chargen). Provisional: limitar la mesa a las Dedicaciones definidas o fijar mínimos análogos a ojo |
| I6 | **Misscast** (tabla por escuela) | [Motor] | **[PROVISIONAL]** fallo de manifestación = se pierde el Maná del intento, sin efecto adverso; Pifia = el DM improvisa una complicación |
| I7 | **Dificultad de encuentros** (guía DM) | [Mejora] | **[PROVISIONAL]** encuentros espejo: enemigos con stats similares a los PCs; superioridad numérica ≤ +50%; UN solo enemigo tier +1 en toda la mini campaña (para medir el +8) |
| I8 | **Omen/Inspiración** — funcional por Canva (gatillantes + gasto = éxito automático con tu NE/NF); reglas PP viejas sin migrar | [Mejora] | Jugable tal cual; migración después |
| I9 | **Penalizaciones por zona re-expresadas** ("−3 NE por brazo", "Aturdimiento = NE del impacto") — vocabulario viejo pero operativo | [Motor] | Jugable literal; re-expresión con el vocabulario v2 cuando se ratifique |

## 3. Falsos bloqueadores — parecen necesarios y NO lo son

| Sistema | Por qué parece bloqueador | Sustituto provisional |
|---|---|---|
| **Economía y moneda** | "No hay precios ni gp definido" | Recursos fijos: cada PC arranca con su equipo de ficha + 3 "recursos" abstractos canjeables por reabastecimiento. Sin compras durante la prueba |
| **Presupuesto de puntos de skill en creación** | `[ESQUELETO]` en §11.2/Creación | No hace falta: las hijas ya empiezan = atributo padre; con Dedicación + Especializaciones alcanza. O directamente **pregens** |
| **Sendas niveles 3+** | Todas en esqueleto | El playtest corre a Grado de Senda bajo; techo natural de la prueba |
| **Sacrificio Arcano (números)** | Bloqueador de PCs/villanos por esa ruta | El villano lo usa **narrativamente** (nadie del grupo lo juega mecánicamente) |
| **Ritos (§17)** | 4 de 6 vacíos | Fuera del alcance de una mini campaña |
| **Milagro y Pecado (§19)** | Sin mecánicas | El Hierofante pregen ya trae plegarias/milagros con chequeo de Fe — suficiente |
| **Muerte y Sucesión / herencia de XP** | Propuesta sin ratificar | Regla de mesa: cada jugador tiene 1 backup mínimo (Linaje+Senda+Origen); si nadie muere, no se usa |
| **Encumbrance, viajes, idiomas, crafting, reputación, monturas, guerra** | Esperables del género | Adjudicación del DM durante la prueba. [Expansión] |
| **Razas no disponibles, Hierodragones, tiers ±2/+3** | Contenido de mundo | La prueba es tier 0 (+ un encuentro tier +1) |

## 4. Alcance Mínimo Jugable (MVRPG) — según este diseño

Lo que el diseño real de Gideon exige para una aventura completa (y nada más):

1. **Resolución** — d100 ≤ Valor, NE/NF, bandas automáticas, Portento/Pifia, enfrentadas, escala circunstancial. **[Motor — hoy ✅ salvo desempates]**
2. **Personajes** — 4 pregens 1e **o** chargen con: atributos 3d4×5, techo 80, linaje (con C1), Dedicación, senda nivel 1, competencias (C2). 
3. **Combate** — iniciativa situacional, 3 acciones/Arrebatado, procedimiento de ataque (C5), zonas, Reacciones Defensivas, daño→heridas→estados (C-1), estados de combate (C6), tier +8 (un encuentro).
4. **Magia** — Spellcasting v2 + repertorio fijo (C7) + Maná/Límite Seguro/Daño Crónico.
5. **Recuperación** — descansos + curación provisional (I3).
6. **Progresión** — feat Entrenamiento (canon C-4/D-8) + XP por milestone (I4). *Es de las mecánicas más nuevas: probarla es un objetivo del playtest en sí.*
7. **Adversarios** — 6 statblocks provisionales (C4) + Minions.
8. **Equipo** — tabla mínima de armas (C3) + armaduras/escudos (ya existen).
9. **DM** — 1 página: encuentros espejo, recompensas, cuándo pedir tirada simple vs enfrentada.

**Explícitamente fuera del MVRPG:** economía, crafting, ritos, Sacrificio Arcano jugable, exploración reglada, reputación, sendas 3+, razas extra, subsistemas de miedo, Traumas psíquicos (tabla 1d10 pendiente — el DM narra).

## 5. Checklist de Playtest

| Elemento | Estado | Nota |
|---|---|---|
| Resolución básica (≤, NE/NF, bandas, Portento/Pifia) | ✅ | Cerrado C-7/C-8/D-1 + aclaración capicúa |
| Rango/Tier (+8 NE, +10 daño, 2+ sin tirar) | ✅ | D-3; esqueletos menores (escalones múltiples, Pifia del superior) no bloquean |
| Iniciativa (jerarquía situacional + Instinto) | ✅ | Canva #167-B |
| Economía de acciones / Arrebatado / Intervenciones | ✅ | Canva #169-B |
| Reacciones Defensivas + Sentidos Precisos + Iluminación | ✅ | §11.9 completo |
| Daño → heridas → estados críticos | ✅ | C-1 (½ umbral, ¼ reducción, Comatoso 4) |
| Descansos | ✅ | §11.12 |
| Progresión (feat Entrenamiento) | ✅ | C-4 + D-5/D-8 |
| Atributos, habilidades, generación, techo 80 | ✅ | + hoja X operativa |
| Fichas pregeneradas (4) | ✅ | Canva 1e |
| Motor de spellcasting (PL, coste, DG, concentración) | ✅ | §13.6 |
| Armaduras y escudos | 🟡 | Tablas existen; Resistencia por Nivel en esqueleto (no bloquea) |
| Tiradas enfrentadas (desempates) | 🟡 | Criterio NE canon; desempates en propuesta (I2) |
| Modificadores / capas (motor v2 restante) | 🟡 | D-2 propuesta; jugable con regla vieja (I1) |
| Sendas nivel 1–2 | 🟡 | Honor vacía; dependen de C2 |
| Dedicaciones / Nacimiento / Regalos & Perjuicios | 🟡 | Solo 2 Dedicaciones con mínimos (I5) |
| Listas de conjuros | 🟡 | Mínimas (fichas 1e + §13.9 parcial) |
| Omen/Inspiración | ✅ | Actualizado en §11.13 (sin control narrativo, añade ignorar daño) |
| Curación natural | 🔴 | I3 — provisional fácil |
| Resistencia del Linaje (número) | 🔴 | **C1 — crítico** |
| Valores de Competencia | 🔴 | **C2 — crítico** |
| Tabla de armas con daño | 🔴 | **C3 — crítico** (provisional: catálogo 1e) |
| Bestiario / statblock | 🔴 | **C4 — crítico** (provisional: PCs rápidos) |
| Procedimiento unificado de ataque | 🔴 | **C5 — crítico** (solo redacción) |
| Estados de combate (Aturdimiento, Incapacitado, Asustado) | 🔴 | **C6 — crítico** (provisionales) |
| Repertorio/aprendizaje de conjuros | 🔴 | **C7 — crítico** (provisional: repertorio fijo) |
| Misscast | 🔴 | I6 — provisional |
| Economía / recompensas materiales | 🔴 | Falso bloqueador (recursos fijos) |

**Preparación:** 11 ✅ + 7 🟡 + 10 🔴 sobre 28 → **(11 + 7×0,5) / 28 ≈ 52 % en canon puro**.
**Con los provisionales de este documento aprobados:** los 7 críticos y 4 de los 🔴 restantes quedan cubiertos → **≈ 85 % listo para mesa**. La distancia real al Playtest A es **una tanda de decisiones de números + una tarde de redacción**, no meses de diseño.

### Añadidos 2026-07-13 (sesión de reglas físicas)

| Elemento | Estado | Nota |
|---|---|---|
| Agotamiento / Cansancio | ✅ | §18 — 3 niveles, −1 acción/nivel, inanición |
| Monturas (Dócil / Aliada / Involuntaria) | ✅ | §11.11.bis (Involuntaria cierra el ex-esqueleto Hostil) |
| Daño de caída | ✅ | §11.11.ter — metros totales, techo 400 m |
| Acciones genéricas + acción Moverse / notación PA | ✅ | `Acciones_Genericas.md` |
| Forcejeo (motor de agarre) | ✅ | Atletismo enfrentado; impone Cegado/Silenciado/Tumbado/Agarrado |
| Estado **Silenciado** (nuevo) / **Tumbado** | ✅ | §18 definidos |
| **Estado Agarrado — EFECTOS/penalizaciones** | 🔴 | ⚠️ **CLAVE (Hassan lo pidió):** el escape está definido (1 PA/intento, Atletismo enfrentado) pero faltan las penalizaciones de estar Agarrado |
| Acción Épica (categoría de criatura) | 🔴 | Esqueleto — depende del statblock (C4) |
| Sistema de cobertura por niveles | 🔴 | Invocado por Tumbado; no existe aún |
| Peso / Sobrecarga (capacidad de carga) | 🔴 | Pendiente; bloquea la "carga del jinete" de monturas |

## 6. Hoja de Ruta recomendada (motor primero, contenido después)

**Paso 0 — Decisiones tuyas (una sesión, sin escribir reglas nuevas):** aprobar/ajustar los provisionales C1, C2, C6, C7, I1–I4, I6, I7 de este documento. Cada uno es una elección de números u opción binaria.

**Paso 1 — Números que desbloquean fórmulas** *(las dos tablas más baratas y de mayor impacto)*: Resistencia del Linaje por subraza (C1) y valores de Competencia (C2). → Actualizar hoja X (H1) y §20.bis.

**Paso 2 — Redacción del combate:** procedimiento unificado de ataque (C5, media página) + los 3 estados faltantes (C6). Todo el material ya es canon; es consolidación.

**Paso 3 — Contenido mínimo:** tabla de armas (C3, ~10 filas) → 6 enemigos provisionales (C4): bandido, bestia salvaje, cultista Drakaris, no-muerto, matón con escudo, y UNA criatura tier +1 como set-piece.

**Paso 4 — Declarar provisionales de magia y recuperación:** repertorio fijo (C7), Misscast simple (I6), curación (I3), XP por milestone (I4). Una página de "Reglas del Playtest".

**Paso 5 — 🎲 PLAYTEST A (pregens 1e, 2–3 sesiones).** Medir en mesa, en este orden de interés: ① letalidad C-1 (ritmo de graves/Comatoso 4), ② bandas + Portento/Pifia (frecuencia percibida), ③ economía del feat Entrenamiento (¿1 XP por sesión de uso se siente bien?), ④ el encuentro tier +1 (+8 NE: ¿el grupo tiene chance real?), ⑤ economía de acciones/Arrebatado, ⑥ el caster con repertorio fijo (¿PL/Maná/Daño Crónico funcionan?).

**Paso 6 — Post-playtest:** con datos de mesa, ratificar o descartar el motor v2 restante (I1/I2 — es la decisión que más contenido re-escribe, mejor tomarla con evidencia), diseñar el aprendizaje real de conjuros y las Dedicaciones faltantes, y recién entonces abrir Playtest B con chargen completo.

**Después (no antes):** Misscast real, statblock format definitivo + bestiario, economía, Omen migrado, sendas 3+, y el resto de la lista de género del diagnóstico 06-28 (exploración, crafting, reputación…).

---

*Fase 11 cerrada 2026-07-03. Ninguna regla provisional de este documento es canon hasta que la apruebes; están marcadas para que puedas ratificarlas en bloque o una por una.*
