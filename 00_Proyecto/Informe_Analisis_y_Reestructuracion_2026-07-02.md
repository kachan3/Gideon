# Informe de Análisis y Reestructuración — 2026-07-02

> **Alcance.** Lectura completa de los 24 archivos de contenido del repositorio (incluidos los dos .xlsx, el .docx y el JSON), análisis en 10 fases y ejecución de la reestructuración física. **Nada fue eliminado**: todo original movido está íntegro en `99_Archivo/` y el repositorio es git (todo es reversible). **Ningún contenido fue reescrito**: los módulos extraídos del Core son literales, verificados línea a línea (3.678/3.678, reconstrucción idéntica).
> Las contradicciones nuevas se listan como **candidatas C-1…C-11** con el criterio estricto del proyecto ("A dice X, B dice Y"). No se integraron a §20: numerarlas como INCONG oficiales es decisión tuya (y existe un problema de numeración previo, ver C-2).

---

## 0. Resumen ejecutivo

El proyecto tenía un documento maestro de 443 KB que mezclaba lore, reglas, control de canon y fórmulas, más 15 satélites con solapamientos y cuatro capas temporales de reglas conviviendo (M viejo → Core → borrador motor v2 → eliminación de NV). Los tres problemas estructurales mayores:

1. **La fórmula de vida está partida en dos versiones dentro del propio canon** (¼ vs ½ de reducción por herida grave; Comatoso a 4 vs 2 graves) — C-1.
2. **Hay dos series de numeración de incongruencias usando los mismos números (#162–#172) para temas distintos** — C-2. El control de canon, que es tu herramienta central, hoy es ambiguo.
3. **La fuente T (Trello), segunda en jerarquía, no existe en el repositorio** (la exportación falló: el JSON es un cascarón sin datos).

La reestructuración ejecutada separa motor de reglas (`10_Reglas`), contenido (`20_Contenido`), propuestas sin ratificar (`30_`), mundo (`40_`), herramientas (`50_`), control de canon (`90_`) y archivo (`99_`).

---

## Fase 1 — Indexación

El índice por archivo (propósito, sistemas, dependencias, madurez) está en **`Indice_General.md`** para que siga vivo tras este informe. Datos globales: 24 archivos de contenido; 1 maestro (3.678 líneas, 234 encabezados); ~90 marcas `[ESQUELETO]` en lore + ~70 en sistema; 181 INCONGs serie A + 171 serie B; 2 propuestas de diseño sin ratificar; 3 archivos derivados obsoletos (HTML, índice viejo, resumen del mundo desactualizado).

**Dependencias de alto nivel:** todo el sistema depende de §11 (motor); §11 está en disputa con el Motor v2 (borrador 06-15); la hoja X es autoridad máxima pero está parcialmente desincronizada del §20.bis; los satélites de GideonCore dependían de un índice (Indice.md) que llevaba 18 días desactualizado.

## Fase 2 y Fase 8 — Pilares reales del sistema

Descubiertos leyendo el conjunto (no son los genéricos del género):

| Pilar | Objetivo | Archivos | Quién lo usa |
|---|---|---|---|
| **Filosofía y Directivas** | Axiomas que enmarcan diseño (costo proporcional de la magia, mortalidad como tema) | `01_Filosofia/*` | Todos |
| **Motor de Resolución 1d100** | Éxito/fallo, NE/NF, críticos, enfrentadas, modificadores, tiers | `Core_11` (§11.1–11.2, 11.6–11.8), `Motor_v2_BORRADOR`, Simulador | Absolutamente todo |
| **Personaje** | Atributos/habilidades, creación, progresión | `Core_11` (§11.2, §11.15), `Creacion_de_Personaje`, propuestas XP/Entrenamiento, hoja X | Combate, Magia, Sendas |
| **Combate, Daño y Estados** | Daño→heridas, estados críticos y alterados, reacciones, zonas | `Core_11` (§11.3–11.5, 11.9–11.16), `Core_18` | Sendas, Equipo, Magia |
| **Magia** | Maná/Stamina, flujos, Spellcasting v2, Sacrificio Arcano | `Core_13`, `Reglas_Directivas_de_la_Magia` | Sendas, Talentos, Artefactos |
| **Sendas** (clases) | Las 10 vocaciones divinas — regla + contenido mezclados | `Core_12` | Personaje |
| **Equipamiento y Talentos** | Armas, armaduras x/y/z, dotes, ritos | `Core_14`, `Core_15`, `Core_17` | Combate |
| **Mundo** | Cronología, cosmología, personajes, geografía, facciones, criaturas | `40_Mundo/*` | Narrativa; el sistema NO debería depender de él |
| **Control de Canon** | INCONGs, esqueletos, fórmulas canónicas, diagnósticos | `90_Control/*` | Tu flujo de trabajo con el asistente |
| **Herramientas** | Ficha automática (X) y simulador | `50_Herramientas/*` | Verificación de mecánicas |

Pilares **ausentes** que el género espera y hoy no existen (del diagnóstico 06-28, sigue vigente): bestiario/statblocks, economía y moneda, exploración/carga, downtime/crafting general, reputación con facciones, catálogo de objetos mágicos, venenos/enfermedades genéricas, idiomas, monturas, guerra a escala.

## Fase 3 — Redundancias detectadas

| # | Documento A | Documento B | Similitud | Recomendación |
|---|---|---|---|---|
| R1 | Core §20 (Incongruencias) | `Falencias_SERIE-B_Canva.md` | Idéntico en #1–#93; divergente después | **Conservar §20 como única serie oficial**; Falencias guarda las resoluciones de la vuelta Canva (#162–#171 serie B) que NO están en §20 → migrar esas entradas a §20 con números nuevos y luego archivar Falencias |
| R2 | `Motor_v2_BORRADOR` (Partes I) | `Nucleo_Jugable_CONSOLIDADO` (Parte I) | Casi idéntico (mismo texto del motor) | Conservar **Nucleo_Jugable** (es superconjunto con índice de 20 pendientes); el borrador queda como referencia hasta ratificación |
| R3 | Core §11.1/§11.6–8 | Motor v2 / Nucleo_Jugable | Mismo concepto, versiones distintas (viejo vs nuevo) | Ratificar UNA versión; la perdedora se archiva con fecha |
| R4 | Core §11.15 (Creación de Personaje — Pasos) | `Creacion_de_Personaje.md` | Parcialmente repetido | SSOT = `Creacion_de_Personaje.md` (más nuevo, 2026-07-02); reducir §11.15 a referencia |
| R5 | `Feat_Entrenamiento_v1` | `Feat_Entrenamiento_v2` | Casi idéntico **pero con reglas opuestas** | Ver C-4; conservar la ratificada, archivar la otra |
| R6 | §G2.bis de `Diseno_XP_Feats…` (Entrenamiento) | Feat_Entrenamiento v1/v2 | Tercera copia del mismo feat | Al decidir C-4, dejar UNA versión y referenciar |
| R7 | Core §20.bis (fórmulas) | Hoja X | Espejo intencional, desincronizado | X es la autoridad: sincronizar §20.bis tras resolver C-1 |
| R8 | `Resumen_del_Mundo_Kindremor` | Core §0–§1 | Mismo concepto, capa pública | Legítimo como doc de jugadores, pero está desactualizado (C-6): regenerarlo desde el Core |
| R9 | `Sulivann…docx` | Core §2.8 + Falencias #80–88 | Compilado declarado | Legítimo (transcripción); mantener como derivado en 40_Mundo |
| R10 | `CLAUDE.md` | `INSTRUCCIONES_ASISTENTE.md` | Idéntico en esencia | Mantener ambos (CLAUDE.md es el que lee la herramienta); editar siempre juntos |
| R11 | `Gideon Core.html`, `Indice.md` viejo, 6 .bak | Core | Derivados congelados | Archivados en `99_Archivo/` ✅ hecho |

## Fase 4 — Contradicciones nuevas (candidatas)

Criterio estricto. Las ocho contradicciones Canva-vs-Core ya resueltas por vos el 2026-06-28 no se repiten aquí.

**C-1 · La fórmula de PG Reales y el umbral de Comatoso — LA MÁS GRAVE.**
- Core **§11.3** (línea 1809 del original): `PG Reales = MH − (MH/4) × graves` → "hacen falta **4 heridas graves**"; §11.4 define Comatoso = **4 graves**. La hoja **X** coincide (D23 usa /4; C32 `>=4`).
- Core **§20.bis** (línea 3591): `PG Reales = ROUNDUP(MH − (MH/2) × graves)` → "**2 graves agotan PG**"; Comatoso "≥2". `Nucleo_Jugable` Parte IV coincide con ½.
- Además la INCONG **#51** describe §11.3 como si dijera ½ — no es lo que §11.3 dice hoy.
- **Por qué importa:** duplica o reduce a la mitad la letalidad de todo el juego.
- **Soluciones posibles:** (a) ratificar **umbral ½ / reducción ¼ / Comatoso 4** (lectura "dos tasas distintas", coherente con X actual) y corregir §20.bis y Nucleo_Jugable; o (b) ratificar **½ en ambas tasas / Comatoso 2** y corregir §11.3, §11.4 y la hoja X (D23, C32).

**C-2 · Colisión de numeración de INCONGs (#162–#172 duplicados).**
- Core §20 (**serie A**): #163 = Tanwyn, #165 = Construcciones pre-dioses, #168 = Ashiria, #170 = Amaru artesano… hasta #181.
- Falencias.md + Canva_Guia (**serie B**): #163 = heridas graves ½, #165 = skill defensiva, #168 = bono a distancia, #170 = Sparring=Deflectar… hasta #171.
- El propio Core §11.8 cita "*cierra INCONG #168*" usando la serie **B** dentro de un documento cuyo §20 usa la serie **A**.
- **Solución posible:** renumerar la serie B como #182–#191 dentro de §20 (conservando nota de equivalencia), y corregir las citas del Core. Requiere tu visto bueno; no lo apliqué.

**C-3 · `Nucleo_Jugable` conserva el Nivel (NV) eliminado.**
- Canon 2026-06-28: NV eliminado; X y §20.bis ya sin NV (`MH = Resistencia del Linaje + Nivel de Vitalidad`).
- `Nucleo_Jugable` Partes IV/VI: `MH = Resistencia + (Nivel × Nivel Vit)`, `Stamina = Nivel + Nivel Vit − graves`, `Maná = Voluntad + (Nivel × Nivel Vol) − DC`.
- Es un doc pre-eliminación; si se ratifica como consolidado del motor, sus fórmulas deben migrarse primero.

**C-4 · Feat Entrenamiento: dos versiones con reglas opuestas.**
- v1 (2026-06-26 15:14, y §G2.bis del doc de XP): la marca se gana **al fallar**; las marcas **se borran** cada sesión.
- v2 (2026-06-26 16:42): la marca se gana **al tener éxito**; las marcas **se conservan**; existe "marca forzada" por 1 XP; compra única.
- Cambia por completo el incentivo de juego (fallar-para-aprender vs practicar-lo-que-funciona). ¿Cuál es canon?

**C-5 · "Falencia" vs "Perjuicio" (misma fecha, 2026-06-29).**
- `Creacion_de_Personaje` §3.3: "lo que antes se llamaba Falencia pasa a llamarse **Perjuicio**" *(canónico 2026-06-29)* — pero su propia Regla de Azar aún dice "el par de Regalo & **Falencia**".
- Core §16 (rescate, también 2026-06-29): usa "**Falencias** de origen" y §11.15.2.bis se titula "Regalo & Falencia".
- Decidir el término y aplicar en ambos documentos.

**C-6 · Edad del mundo: "más de mil años" vs ~426 DA.**
- Canon vigente (2026-06-14, §0): año actual **~426 DA**.
- `Resumen_del_Mundo_Kindremor` (06-06): "Han pasado **más de mil años** desde la caída de Amaru".
- Además la resolución vieja de INCONG #1 dentro de §20 ("usa más de mil años") quedó obsoleta y nadie la marcó como superada → dentro del propio §20 conviven #1-resuelta-con-mil-años y el canon 426.

**C-7 · Dos motores de resolución conviviendo.**
- Core §11.1 + §20.bis: 00 = crítico capicúa; "99 SIN MÁXIMOS"; sin bandas automáticas; NE/NF modificado bajo 0 transforma el resultado.
- Motor v2 (borrador 06-15) + **Simulador (ya lo implementa)**: bandas 00–05/95–99; Portento/Pifia; la transformación vive solo en Exigencia/Salvataje.
- El borrador se declara no-canónico, así que formalmente no es incongruencia — pero el Simulador (herramienta de la fuente X) ya opera con el motor nuevo, y §20.bis nunca se actualizó. Es el **bloqueante de consolidación #6** del diagnóstico 06-28: todo contenido nuevo se redacta contra base movediza hasta que ratifiques uno.

**C-8 · Éxito con "igual" o con "menor estricto".**
- Roller de la hoja X: éxito si `d100 < valor` (estricto).
- Canva ("resultado ≤ habilidad"), Motor v2 y Simulador: éxito si `≤`.
- Diferencia del 1% pero es la tirada nuclear; unificar (y corregir el Roller si corresponde).

**C-9 · Ventaja de tier: tres versiones del beneficio.**
- Tu frase original: "el tier superior tiene un éxito de **8 + NE real**".
- Motor v2 (redacción del asistente): **piso de NE 8**.
- Simulador (implementado): **+10 al NE si además fue éxito propio, +5 si fue fallo releído**.
- Tres números distintos para la misma regla; ya estaba señalada como pendiente #1 de Nucleo_Jugable, pero la tercera versión del Simulador no estaba registrada.

**C-10 · Skill defensiva: "Parry" vs "Paradas".**
- Resolución #165-serie-B (Canva_Guia): "Canónico = skill **Parry**".
- Core §11.2 y hoja X (renombrada 06-29): la skill se llama **Paradas** (Parry queda como nombre de la reacción mejorada).
- Asumo que Paradas es la forma final (es la más reciente y está en X), pero la resolución escrita dice otra cosa: conviene ratificarlo en el Vocabulario.

**C-11 · Falencias.md serie B sigue diciendo "Claudfield".**
- Canon 2026-06-17: Claudfield → **Tanwyn**, "aplicado en todo el Core".
- `Falencias_SERIE-B_Canva.md` entradas #4, #88, #91: siguen diciendo Claudfield. Documento desactualizado respecto del canon que él mismo registra.

**Anexo — errores mecánicos de la hoja X** (no son contradicciones; son bugs de planilla): desfase de una fila en las modificaciones de habilidades de Inteligencia (H21 usa G22…); H25 y H26 comparten G26; fórmula de Stamina actual `=G31-G31:I31` anómala; falta "Pierna Izquierda" en Partes del cuerpo (la tabla de zonas 1d6 sí la tiene); typos "Vitalida", "Descpripcion"; G2 "Nivel: 1" quedó como etiqueta cosmética sin uso (candidata a quitar para no confundir tras la eliminación de NV).

## Fase 5 — Integración (fusiones y divisiones)

Ejecutado: la división del Core (ver Fase 6). Propuesto para cuando ratifiques (no ejecutado, porque cada fusión depende de una decisión abierta):

1. **Motor:** al ratificar el motor v2 → fusionar `Motor_v2_BORRADor` + Partes I–III de `Nucleo_Jugable` dentro de `Core_11`, archivando las redacciones viejas. Motivo: una sola fuente del motor. Impacto: §12–§15 deben re-expresar sus modificadores con el vocabulario nuevo (Refuerzo/Contrarreste/Agravio/Mitigación).
2. **Creación:** mover §11.15 (y §11.2.bis Especializaciones) a `20_Contenido/Creacion_de_Personaje.md` dejando referencia. Motivo: hoy hay dos medias-verdades de chargen.
3. **Control de canon:** una sola serie de INCONGs (ver C-2) y una sola lista de esqueletos (§21 absorbe los pendientes numerados de `Nucleo_Jugable` §0, hoy paralelos).
4. **Entrenamiento:** una sola versión del feat (C-4) referenciada desde el doc de XP.
5. **División futura de `Core_11`** (662 líneas, cuatro responsabilidades): 11-motor, 11-atributos, 11-combate, 11-minions. No lo dividí más porque el corte fino depende de qué motor ratifiques.

## Fase 6 — Arquitectura documental (ejecutada)

```
Gideon/
├── 00_Proyecto/        gobierno (instrucciones, índice, vocabulario, este informe)
├── 01_Filosofia/       directivas de diseño
├── 10_Reglas/          MOTOR — reglas puras
├── 20_Contenido/       lo que usa las reglas
├── 30_Propuestas_No_Ratificadas/
├── 40_Mundo/           lore (Core §0–§10 + resumen + Sulivann)
├── 50_Herramientas/    xlsx (X + Simulador)
├── 90_Control/         INCONGs, fórmulas, esqueletos, diagnósticos
└── 99_Archivo/         originales y obsoletos — nada se borra
```

Criterios: numeración con huecos (12, 21… disponibles para expansiones y suplementos); el estado de ratificación es **visible en la ruta** (`30_` = no canon, `99_` = no vigente); cada módulo del Core lleva encabezado de procedencia; nombres de archivo sin espacios ni acentos para robustez multiplataforma. Preparada para versiones: cuando ratifiques el motor v2, la redacción vieja va a `99_Archivo/` con fecha, igual que hice con el maestro.

**Mapeo completo original → nuevo:** ver `Indice_General.md`. El maestro original quedó íntegro en `99_Archivo/Gideon Core_ORIGINAL_2026-07-01.md`. La carpeta vacía `GideonCore/` no pude eliminarla desde el entorno (permiso del sistema); podés borrarla a mano.

## Fase 7 — Separación reglas / contenido

Ejecutada a nivel de carpetas. Mezclas que persisten **dentro** de archivos (señalización, no las toqué):

- `Core_11` contiene creación de personaje (§11.15) → contenido dentro del motor.
- `Core_12` (Sendas): la premisa de senda y el Grado de Senda son regla; cada senda es contenido. Separables cuando las sendas 3+ se desarrollen.
- `Core_03` (Razas, en 40_Mundo): stats de subrazas = regla incrustada en lore. La "Resistencia del Linaje" numérica —dato que la fórmula de MH necesita— no existe en ninguna parte (bloqueante #3 del diagnóstico).
- `Core_10` (Enfermedades): híbrido legítimo (lore con efectos mecánicos), pero cuando exista un sistema general de enfermedades, estas deben referenciarlo.
- `Core_14`: el sistema x/y/z + Nivel de Equipo es regla; las tablas de ítems son contenido.
- Las fichas pregeneradas dentro de `Canva_Guia_Rapida_1e.md` son contenido de ejemplo dentro de un documento de control.

**Regla de oro adoptada:** `10_Reglas` no menciona ítems, sendas ni facciones concretas salvo como ejemplo marcado; `20_Contenido` y `40_Mundo` siempre referencian la regla, nunca la redefinen.

## Fase 9 — Grafo de dependencias

```
01_Filosofia (axiomas)
   ↓
10_Reglas/Core_11 (motor 1d100 + atributos)   ←— en disputa con Motor_v2 (C-7)
   ↓                    ↓
Core_13 (magia)    Core_18 (estados)
   ↓                    ↓
20_Contenido: Creacion → Sendas → Equipamiento → Talentos → Ritos
   ↓
30_Propuestas (XP/progresión — alimenta a Creacion y Sendas cuando se ratifique)

40_Mundo — no debería recibir dependencias del sistema (hoy: Core_03 exporta stats → invertir: mover stats a 20_Contenido)
90_Control — observa a todos; no es dependencia de juego
50_Herramientas — implementa 10_Reglas; hoy X ⇄ §20.bis desincronizados (C-1)
```

Ciclos detectados: solo uno relevante — **§11.15 (creación) ⇄ Creacion_de_Personaje.md** se referencian mutuamente con detalle distinto; se rompe aplicando la fusión #2 de Fase 5.

## Fase 10 — Normalización

Vocabulario oficial creado en **`Vocabulario_Oficial.md`**: 12 términos canónicos ratificados con sus alias, la desambiguación obligatoria de "Nivel" (seis significados conviviendo; NV eliminado) y 4 términos en disputa que requieren tu decisión (Falencia/Perjuicio, Crítico/Portento-Pifia, Omen/PP, Entrenamiento v1/v2).

Pendiente de pasada exhaustiva (cuando ratifiques el motor): re-expresar "(nv X)" heredados como umbrales de XP de Senda; mapear "DIF 1", "Muy Difícil/Fácil" y los "−3 NE / +2" sueltos a las capas del motor nuevo; purgar restos de CD/salvaciones/bono de competencia de D&D en §12/§15.

---

## Decisiones que solo vos podés tomar (orden sugerido)

1. **C-1** — ¼ vs ½ (letalidad global). Desbloquea corregir X, §20.bis y §11.3 en un solo sentido.
2. **C-7/C-9/C-8** — Ratificar el motor v2 (bandas, Portento/Pifia, capas) y fijar el beneficio de tier y el criterio ≤/<. Desbloquea la consolidación del motor (fusión #1).
3. **C-2** — Aprobar renumeración de la serie B como #182–#191.
4. **C-4** — Entrenamiento v1 o v2. · **C-5** — Falencia o Perjuicio.
5. Re-exportar el tablero de **Trello** al repositorio (la fuente T no está respaldada).
6. Los 6 bloqueantes de jugabilidad del diagnóstico 06-28 siguen vigentes (Resistencia del Linaje, competencias cuantificadas, flujo de ataque, daño de armas, estados de combate, statblock de criaturas).

*Todas las recomendaciones de este informe incluyen motivo e impacto; ninguna modifica canon por sí sola. Sugerencias de diseño adicionales, solo si las pedís.*
