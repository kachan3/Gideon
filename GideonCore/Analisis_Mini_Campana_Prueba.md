# Análisis — Elementos para una Mini Campaña de Prueba

> **Fecha:** 2026-06-28. **Rol:** diagnóstico (cataloga falencias lógicas; **no propone diseño** — eso sólo si Hassan lo pide).
> **Pregunta:** qué hace falta para correr una mini campaña de prueba **con base de sistema completa y sin contenido**, más qué mecánicas pueden faltar respecto a lo esperable del género.
> **Fuentes leídas:** `Gideon Core.md` §11–§20.bis, `nucleo_jugable.md`, `11 - Nucleo del Sistema (borrador 2026-06-15)`, `Creacion de Personaje.md`, `Reglas Directivas de la Magia.md`, `GideonCore/*` (XP/Feats, Muerte y Sucesión, Entrenamiento), `Falencias.md`, `Auto Character Sheet.xlsx`, `Simulador_Tiradas_Enfrentadas.xlsx`.
> **Severidad:** 🔴 duro (impide por completo) · 🟠 parcial (hay *workaround* manual) · 🟡 menor.

---

## 0. Veredicto rápido

**Lo que YA está sólido** (no bloquea): motor de resolución (en versión borrador), árbol de atributos/habilidades, conversión daño→heridas, estados críticos (Activo/Desmayado/Moribundo/Comatoso), economía mágica (Maná/Stamina/Límite Seguro/Daño Crónico), Rango/tiers, zonas de impacto, reacciones defensivas + sentidos precisos + iluminación, tamaños, descansos, Minions/Tropas, tabla de armaduras/escudos, virtudes y desgracias.

**La conclusión central:** el sistema tiene un **esqueleto casi completo a nivel de índice**, pero el *loop* mínimo de juego se rompe en **cuatro puntos duros**: (1) no se puede **terminar una ficha** (faltan presupuesto de habilidades, Resistencia del Linaje numérica y el valor de las competencias); (2) no se puede **resolver un ataque a daño** (flujo §11.8 + tablas de armas vacías); (3) el combate **invoca estados que no existen** (Arrebatado, Aturdimiento, etc.); (4) no hay **regla de cómo sube el "Nivel"** que alimenta casi todas las fórmulas. Con esos cuatro resueltos (aunque sea provisionalmente) hay juego.

---

## 1. BLOQUEANTES (sin esto no hay mini campaña)

Ordenados por el *loop* de juego: crear → resolver → combatir → usar senda → lanzar → progresar → dirigir.

### 1.A — Crear personaje

| # | Falencia | Dónde | Sev. |
|---|---|---|---|
| 1 | **Presupuesto y reparto de habilidades en creación.** Los atributos tienen método (3d4×5 o arreglo fijo, §11.2). Las habilidades hijas sólo "empiezan = atributo padre"; **no hay puntos para subirlas en creación** ni regla de reparto (sólo el techo global de 80%). | §11.15.1 paso 7; `Creación` §3.1 `[ESQUELETO]` | 🔴 |
| 2 | **Puntos de mejora iniciales** "dependen de linaje/clase/edad/Voluntad" pero la tabla no existe. | §11.2 `[ESQUELETO]` | 🔴 |
| 3 | **Resistencia del Linaje (número) por subraza.** Es la base de `MH = Resistencia del Linaje + Nivel × Nivel Vit`. La tabla §3.1 **no da ese número** (su columna "Resistencia" lista resistencias a tipos de daño, no la base de Vida). La hoja X la deja en **0**. Sin esto **no se calcula la Vida**. | §3.1 / fórmula §11.3 | 🔴 |
| 4 | **Valor numérico de las Competencias** (Novicio/Entrenado/Experto/Maestro/Leyenda). Cada senda reparte "1 experto, 2 entrenadas" y hay fórmulas que suman "Competencia de entrenado" (§12.8), pero **nunca se cuantifica** a cuánto equivale cada grado en la escala 00–99. Transversal a todas las sendas. | §12.x, §12.8 | 🔴 |
| 5 | **Chargen incompleto pero parcheable:** Dedicaciones sin "skills garantizadas" (sólo Médico y Soldado definidas); tabla de Nacimiento marcada *provisional*; subrazas **Hijos de la Tierra** e **Hijos del Hielo** en `[ESQUELETO]`. Jugable sólo si la mesa elige lo ya definido. | `Creación` §3.1–3.2; §3.1 | 🟠 |

### 1.B — Motor de resolución

| # | Falencia | Dónde | Sev. |
|---|---|---|---|
| 6 | **Dos versiones del motor sin unificar.** El Core §11.1 (canónico) **no tiene** las bandas automáticas 00–05 / 95–99 y **sí** conserva la regla vieja "NE/NF modificado bajo 0 transforma el resultado". El borrador 2026-06-15 + el simulador **añaden** bandas y **anulan** esa transformación (sólo transforman Exigencia/Salvataje). Hay que ratificar **una sola**. Además quedan abiertas las decisiones #1–#12 del `nucleo_jugable` (piso de tier **8** vs **+8** vs **+10/+5** del simulador; borde **00–05** vs **00–04**; criterio de iniciativa; a qué tiradas aplican bandas/NE/NF). | §11.1 vs `nucleo_jugable` / `Simulador` | 🔴 (de consolidación) |

### 1.C — Combate

| # | Falencia | Dónde | Sev. |
|---|---|---|---|
| 7 | **Flujo de ataque completo.** §11.8 dice "tira 1d100 vs skill" y deja en `[ESQUELETO]` lo esencial: ¿hay defensa pasiva o sólo reacción?, cómo se aplican **NE/NF al daño**. La hoja X sugiere `Daño = Daño de Arma + Bono(=Nivel del atributo) + NE`, pero **no está escrito en el Core**. Es el corazón del combate. | §11.8 | 🔴 |
| 8 | **Valores de daño de armas.** Las tablas de armas **melee (§14.2)** y **a distancia (§14.3)** están **vacías** (sólo nombres). Ningún arma tiene daño, peso ni precio. | §14.2 / §14.3 | 🔴 |
| 9 | **Estados/condiciones referenciados pero no definidos.** §18 está mayormente en `[ESQUELETO]`, y reglas **canónicas** invocan estados sin reglas: **Arrebatado** (escudos/Ágil/combos), **Aturdimiento** (heridas en cabeza generan contadores "que no hacen nada definido"), **Incapacitado** (escudos/concentración), **Asustado** (concentración/miedo), **Pánico/Miedo** (desgracias/Berserker), **Cansancio por niveles** (armadura pesada sin competencia). | §18 / refs en §11.9, §13.6.7, §14.4, §14.6 | 🔴 |
| 10 | **Qué número de armadura entra en la fórmula.** §11.3 resta "(Nivel Vit + **Armadura**)"; §11.5 mitiga por tipo **x/y/z**; §14.6 lista "**Blindaje**". La reconciliación Blindaje ↔ x/y/z está marcada como pendiente (§14.6.1). Ambigüedad en **cada** cálculo de daño. | §11.3 / §11.5 / §14.6.1 | 🟠 |
| 11 | **Umbral de Comatoso** con el nuevo MH/2 (¿≥2 graves?). | §11.4 / §11.3 `[ESQUELETO]` | 🟡 |
| 12 | **Iniciativa:** atributo sin confirmar ("probablemente Instinto"). | §11.6 | 🟡 |

### 1.D — Sendas (clases)

| # | Falencia | Dónde | Sev. |
|---|---|---|---|
| 13 | **Todas las sendas sólo llegan a nivel 1–2;** "niveles 3+/4+" en `[ESQUELETO]`. **Honor está vacía** (sólo *flavor*). Para un test de **nivel bajo (1–2)** son jugables salvo Honor — pero dependen del bloqueante #4 (competencias) y de #14. Techo de nivel jugable ≈ **2**. | §12.1–§12.11 | 🟠 |
| 14 | **Capa de traducción incompleta.** Mucho contenido de senda/talento sigue en idioma D&D-5e incompatible con el 1d100: **CA** (varias habilidades "olvidadas por usar CA"), **salvaciones tipo CD** (`Salvación de Carácter = 8 + bono + competencia`, §12.8), **+2 planos** "olvidados pendientes de redefinir", **bono de competencia**. (*Ventaja/Desventaja* sí mapea a Dados Extra. "Bono de atributo" ≈ Nivel del atributo según la hoja X, pero **no está escrito en prosa**.) Algunas ya están marcadas; muchas no. | §12, §15 | 🟠 |

### 1.E — Magia

| # | Falencia | Dónde | Sev. |
|---|---|---|---|
| 15 | **Aprendizaje y almacenamiento de conjuros.** Sin definir si es repertorio fijo, libro, *slots* por escuela o repertorio flexible. **No se puede operar un lanzador en mesa.** (Ya marcado por ti como "bloqueo de mayor prioridad", INCONG #55.) | §13.6.9 `[ESQUELETO]` | 🔴 |
| 16 | **Listas de conjuros por escuela incompletas** y en idioma "Nv" viejo que requiere migración a PL. Hay muestras para improvisar, pero no lista canónica ni consistente. | §13.9 `[ESQUELETO grande]` | 🟠 |
| 17 | **Misscast** sin tabla/criterio; lo referencian conjuros y el Sacrificio Arcano. | §13.6.8 `[ESQUELETO]` | 🟠 |
| 18 | **Mitigación de Necrótico / Radiante / Sónico** sin fórmula, y **conteo 12 vs 14 tipos de daño** sin cerrar. Esos tipos no se pueden defender hasta definirlos. (INCONG #52/#53.) | §11.5 `[ESQUELETO]` | 🟠 |
| 19 | **Sacrificio Arcano sin números** (rendimiento por víctima, techos de PL, tiempos). Avanzado: no bloquea un test básico. (INCONG #71.) | §13.10 `[ESQUELETO]` | 🟡 |

### 1.F — Progresión

| # | Falencia | Dónde | Sev. |
|---|---|---|---|
| 20 | **Cómo sube el "Nivel" del personaje.** "Nivel" alimenta MH, Maná y los *gates* de senda (Nivel 1/2/3), pero **no hay regla de cómo se gana un nivel**. La XP compra feats/conjuros (propuesta no ratificada), **no** niveles; la mejora por marcas sube *skills*, no Nivel. Sin esto no hay progresión ni escalado de fórmulas (bloquea campaña; **no** un *one-shot* de nivel fijo). | fórmulas §11.3/§13.1; refs "al subir de nivel" | 🔴 (para campaña) |
| 21 | **El sistema XP/Feats es propuesta no ratificada,** con "**lista genérica de inicio**" marcada `[PENDIENTE — bloqueante]` y costos `[INVENTADO]`. Para test corto es opcional. | `GideonCore/XP_Feats…` | 🟠 |

### 1.G — Herramientas del DM

| # | Falencia | Dónde | Sev. |
|---|---|---|---|
| 22 | **Formato de statblock de criaturas + criaturas de muestra.** Sólo existe Minions/Tropas (§11.16). No hay plantilla de monstruo "real" (tier, MH, ataques, daño, feats que dropea) **ni un solo enemigo de ejemplo**, pese a que el sistema XP asume "el statblock indica…". El DM no tiene con qué armar encuentros. | §11.16 / `XP_Feats` | 🔴 (práctico) |
| 23 | **Equipo/economía.** Precios de armaduras/escudos sí; **armas sin datos**; sin catálogo general de bienes/servicios; **moneda ("gp") sin definir**; sin riqueza/equipo inicial por trasfondo. | §14 | 🟠 |

---

## 2. MECÁNICAS ESPERABLES DEL GÉNERO (no bloqueantes, pero típicas de un TTRPG de alta fantasía)

Lo que un grupo que viene de D&D/Pathfinder/Runequest/Symbaroum esperaría encontrar y hoy falta o está apenas insinuado. No impiden la prueba, pero su ausencia se nota en cuanto la campaña dura.

1. **Bestiario y reglas de creación de monstruos.** Más allá de Minions: cómo construir un adversario con stats completas y una pequeña colección inicial. (Cruza con bloqueante #22.)
2. **Glosario estandarizado de condiciones.** La lista típica (Cegado, Ensordecido, Envenenado, Sangrando, Agarrado, Restringido, Tumbado, Petrificado, Inconsciente, Aturdido…) está enumerada pero casi toda en `[ESQUELETO]` (§18). (Cruza con #9.)
3. **Diseño de encuentros / presupuesto de dificultad** y **presupuesto de tesoro/recompensa.** No hay guía de cuánto desafío/recompensa por sesión.
4. **Economía y riqueza inicial.** Moneda, lista de precios de bienes y servicios, equipo de partida. (Cruza con #23.)
5. **Exploración y viaje.** Ritmo de marcha, perderse (hay skill Orientación), raciones/forrajeo (hay Adaptación), **carga/encumbrance** (las columnas de peso existen pero no hay regla de capacidad de carga). La luz/visión sí está (Iluminación §11.9.quat).
6. **Downtime y *crafting* general.** Se referencian materiales (Heliolita, Plata Lunar, Cristal Brimar) y *crafting* puntual (Artefactos, Recolección del Cazador), pero no hay reglas generales de fabricación ni de actividades entre aventuras.
7. **Subsistema social / reputación / facciones.** Hay skills sociales potentes y los Edictos del Heraldo, pero no hay sistema de **reputación o influencia con facciones** (las facciones existen abundantemente en el lore; el contrato del Enclave está sólo insinuado).
8. **Catálogo de objetos mágicos y tablas de tesoro.** Existen Artefactos Arcanos e Ítems Inteligentes (con sintonía por XP, propuesta), pero no un catálogo ni tablas de botín.
9. **Catálogo de venenos y enfermedades.** §10 cubre casos de lore (Blood Brand, Plaga, infección) pero no un sistema general reutilizable.
10. **Idiomas y comunicación.** Se menciona "Verita" (idioma mágico) y lengua de señas; falta lista de idiomas y reglas de comunicación.
11. **Monturas y vehículos.** Hay skill Montar y monturas insinuadas; sin reglas de vehículos/combate montado.
12. **Combate masivo / guerra.** El Heraldo, el Lexicón Marcial y las Tropas apuntan a ello, pero no hay subsistema de batalla a gran escala.
13. **Lista completa de Dedicaciones/Orígenes** como contenido cerrado de creación (hoy mayormente `[ESQUELETO]`).

---

## 3. Nota de consolidación (lo más importante de atacar primero)

El **motor** (bloqueante #6) es la pieza de la que cuelga todo lo demás: armas, sendas y conjuros se redactarán distinto según cómo queden bandas, NE/NF, tiers y capas de modificadores. Mientras el Core §11.1 y el borrador 2026-06-15 digan cosas distintas, **cualquier contenido nuevo nace contra una base movediza**. Conviene ratificar el motor (y volcarlo al Core, hoy desactualizado: la hoja X aún usa MH/4 y Comatoso ≥4; la tabla §20.bis aún dice "99 sin regla de máximos").

**Mínimo viable para una prueba jugable** (los que de verdad cortan el *loop*): #3 (Vida), #4 (competencias), #7 (ataque→daño), #8 (daño de armas), #9 (estados de combate), #22 (algún enemigo). Con eso —y fijando el nivel para esquivar #20— se puede correr una sesión de combate y exploración básica.

---

*Diagnóstico cerrado el 2026-06-28. Puedo proponer el diseño de cualquiera de estos puntos si lo pedís explícitamente.*
