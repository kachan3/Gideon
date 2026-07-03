# Informe — Canon Update 2026-07-03 (C-1 … C-11)

> Aplicación de las decisiones de diseño del 2026-07-03. Cada cambio lleva la marca *(canon C-N, 2026-07-03)* en el documento afectado. Nada se borró: versiones supersedidas archivadas en `99_Archivo/` o tachadas con nota; todo reversible por git. Verificación de regresión al final.

---

## 1. Documentos actualizados

| C | Decisión aplicada | Documentos modificados |
|---|---|---|
| **C-1** | PG Reales = `MH − (MH/4 × graves)`; **Comatoso = 4 graves**. El umbral para *causar* una grave sigue en ½ MH (dos tasas distintas) | `Core_20bis` (½→¼, Comatoso 2→4) · `Core_11` §11.3 (nota de ratificación; ya decía ¼/4) · `Nucleo_Jugable` (3 lugares) · `Core_20` #51 → ✅ · `Core_21` (esqueleto Comatoso → ✅) · `Analisis_Mini_Campana` (nota). **La hoja X ya implementaba ¼ y ≥4 — no requirió cambios** |
| **C-2** | Sin renumerar. Catálogo completo creado; **Sparring obsoleto** en todas sus apariciones | **`90_Control/Catalogo_INCONG_Duplicadas.md` (nuevo)** · `Falencias_SERIE-B` #171 → ✅ (Sparring obsoleto → Guardia) · `Canva_Guia` fichas (2 marcas ~~Sparring~~ → Guardia) · `Vocabulario` |
| **C-3** | Registrada como **propuesta NO ratificada** (decisión de Hassan en sesión), con «Resilience Level» = **Nivel de Cardio** (aclarado por Hassan) | **`30_Propuestas_No_Ratificadas/Propuesta_C3_Atributos_Derivados.md` (nuevo)** con mapa de migración completo · nota de advertencia en `Core_20bis` §Recursos y en `Nucleo_Jugable` |
| **C-4** | Feat Entrenamiento canónico único (marcas al **fallar**; 1 por skill/atributo; atributo por fallo directo o **3** hijas; 5/2 por sesión; 1d100 **≥** valor; <76→+1d6, ≥76 y atributos→+1d4; fallo **no** consume la Marca; Opción XP) | **`20_Contenido/Feat_Entrenamiento.md` (nuevo, canon)** · v1 y v2 movidas a `99_Archivo/*_OBSOLETO.md` · `Diseno_XP` §G2.bis → puntero al canon · `Core_11` §11.2 (tirada ≥, puntos de entrenamiento eliminados, incrementos nuevos) · `Nucleo_Jugable` II.3 |
| **C-5** | **Perjuicio** reemplaza a "Falencia" (término de juego) | `Creacion_de_Personaje` (2 restos) · `Core_11` §11.15/§11.15.2.bis (10 ocurrencias) · `Core_16` (2) · `Nucleo_Jugable` (1) · `Vocabulario` (disputa → resuelta). El sentido "falencia lógica" del control de canon **no** cambia |
| **C-6** | ~426 DA; "más de mil años" → "más de cuatrocientos años" | `Resumen_del_Mundo_Kindremor` (corregido) · `Core_20` #1 (anotada **SUPERADA**, conservada como registro histórico). Los "mil años" de la **Era del Exilio** (previa a la caída) se conservan — son otra cosa |
| **C-7** | Bandas canónicas: **00–05 éxito crítico / 95–99 fallo crítico** | `Core_11` §11.1 (bandas añadidas; "no existe fallo automático por máximo" → SUPERADO) · `Core_20bis` tabla Resolución (bandas añadidas; fila "99 sin máximos" → SUPERADA) · `Nucleo_Jugable` pendientes #2 y #11 → ✅ |
| **C-8** | Éxito = `d100 ≤ Valor` como principio por defecto | **Hoja X, Roller C2:C11: `<` → `<=` (10 celdas corregidas)**. Era la única comparación estricta del proyecto; docs (§11.1, §20.bis, Canva, Simulador) ya usaban ≤ |
| **C-9** | **No aplicado** — análisis y recomendación en §3 de este informe |
| **C-10** | Set defensivo: **Deflectar** (básica) · **Paradas** (skill) · **Parry** (mejorada) · **Guardia** (rasgo de arma) | `Canva_Guia` resolución #165-B (corrección anotada: la skill es Paradas) · `Vocabulario` (ratificado). `Core_11` §11.2/§11.9 y hoja X ya estaban correctos |
| **C-11** | **Tanwyn** oficial | `Falencias_SERIE-B` #4, #88, #91 y #94 (4 ocurrencias → "Tanwyn *(ex Claudfield)*"). El Core ya estaba limpio; menciones "antes Claudfield" son históricas intencionales y se conservan |

También actualizados: `Vocabulario_Oficial.md` (5 términos nuevos ratificados) e `Indice_General.md` (estados de madurez).

## 2. C-2 — Catálogo de INCONGs duplicadas

Completo en **`90_Control/Catalogo_INCONG_Duplicadas.md`**: las series A (Core §20) y B (Falencias/Canva) comparten **#162–#171** con temas distintos; tabla con ambas entradas, líneas, estado, referencias que apuntan a cada serie (incluida la cita "cierra INCONG #168" de serie B *dentro* del Core §11.8), la anomalía del "#160 inline" en `Core_01` (flag posiblemente sin limpiar tras resolución), y el análisis de impacto de 3 opciones de renumeración (recomendada si renumerás: serie B → #182–#191; ~20 citas a tocar, riesgo bajo). **Nada fue renumerado.**

## 3. C-9 — Ventaja de tier: análisis y recomendación

Tres implementaciones conviven para "1 tier de diferencia" (además del canon común: fallo del superior se lee como éxito hacia abajo; 2+ tiers = gana sin tirar; +10 daño plano por tier):

| Criterio | **A · Piso 8** (borrador motor v2) | **B · Suma +8** (tu frase original literal) | **C · +10/+5** (Simulador) |
|---|---|---|---|
| Satisfacción del jugador | El inferior **siempre tiene una salida**: NE 9 contra tirada baja del superior, o Portento (NE 10). Derrotas legibles ("resbaló") | El inferior **nunca puede ganar**: mínimo 0+8=8 y un éxito normal del superior (3+8=11) supera al Portento (10). Mata el momento David-vs-Goliat | Casi igual que B: +10 en éxito propio hace 10–20; el Portento del inferior solo empata en el mejor caso |
| Profundidad táctica | Refuerzo/Contrarreste/Exigencia siguen importando en la ventana 8–10 | Modificadores de NE irrelevantes: la suma aplasta la escala | Dos casos a memorizar (+10 vs +5) y desborde aparte |
| Justicia percibida | El coloso domina (~90%+) pero no es invencible — coherente con tu justificación canónica ("si el humano gana, el coloso resbaló") | Invencibilidad total a 1 tier — indistinguible de "2+ tiers gana sin tirar", el escalón pierde sentido | Igual que B en la práctica |
| Balance matemático | **NE queda dentro de la escala 0–10**; el daño (que suma NE) queda acotado y no duplica el +10 plano por tier ya canónico | NE hasta 18 → **infla el daño** (Daño = NE + arma + Fuerza) y se **duplica** con el +10 plano por tier | NE hasta ~20; misma doble contabilidad, peor |
| Predictibilidad | Una sola regla: "su NE nunca baja de 8" | Simple pero rompe todos los umbrales (Exigencia X, efectos "NE ≥ X") | La menos predecible |
| Usabilidad DM | Una frase, cero aritmética extra | Fácil de aplicar, difícil de contener (cada efecto por NE se rompe) | Requiere consultar la implementación |
| Interacción con NE | Preserva la semántica NE 0–10 y "Portento decisivo" (axioma del motor) | Rompe "el crítico es decisivo" — contradice §11.4 del borrador y tu propio ejemplo del dragón | Ídem B |
| Interacción con tiers | Compone limpio: 1 tier = piso; 2+ = sin tirada | El escalón 1 tier ≈ 2 tiers (redundante) | Ídem B |

**Prueba decisiva:** tu ejemplo canónico (dragón saca 96 → "éxito NE 9; el humano solo gana con Portento NE 10") **solo es matemáticamente cierto con el piso**: con +8 ese 96 valdría 9+8=17 y ningún Portento lo alcanza.

**Recomendación: A — Piso de NE 8** (el NE real del superior cuenta solo si lo supera). Si la ratificás, quedaría pendiente: corregir el Simulador (hoy +10/+5), y decidir el esqueleto asociado (¿la Pifia del superior se relee como éxito con piso 8, o queda como fallo para darle aire al inferior? — sugiero decidirlo en la misma ratificación). **No implementé nada.**

## 4. Inconsistencias restantes (requieren decisión tuya)

1. **NE/NF de las bandas** (nuevo, urgente tras C-7): ¿qué NE otorga un 00–05 y qué NF un 95–99? ¿La banda respeta la capicúa (00 = NE 10) o fija un valor? Está marcado `[PENDIENTE]` en §11.1 y §20.bis.
2. **Motor v2 completo**: bandas (C-7) y ≤ (C-8) ya son canon, pero **Portento/Pifia, las 5 capas de modificadores, Exigencia/Salvataje y la anulación de "NE<0 transforma"** siguen sin ratificar — §11.1 aún contiene la regla vieja de transformación, ahora parcialmente en tensión con lo ratificado.
3. **C-9** — a la espera de tu aprobación (recomendación: piso 8).
4. **C-2** — renumeración de la serie B (recomendación en el catálogo) y limpieza del flag "#160 inline" de `Core_01`.
5. **C-3** — ratificar o descartar la propuesta; antes conviene cerrar sus 6 conflictos ocultos listados en el archivo de propuesta (Límite Seguro, redondeo de Vitalidad/5, Dureza, etc.).
6. **Alcance de las bandas** (pendiente #6 del Nucleo_Jugable, ahora más urgente): ¿aplican a la Tirada de Mejora (que usa ≥), a la iniciativa, al Nacimiento 1d100?
7. La **"marca forzada"** (1 XP para marcar sin fallo, de la v2 descartada) no está en el canon C-4 — confirmar que se descarta (así lo dejé).

## 5. Posibles conflictos ocultos (reglas indirectamente afectadas)

- **C-7 × capicúa:** 00 y 99 quedan doblemente clasificados (banda + capicúa). Hoy convergen (ambos "críticos"), pero 11, 22 … 88 solo serían críticos si ratificás Portento/Pifia.
- **C-1 × C-3:** si C-3 se ratifica, MH sube (~doble aporte de Vitalidad) y con reducción ¼ los personajes se vuelven notablemente más duros; el umbral de grave (½ MH) también sube en valor absoluto.
- **C-4 × C-8:** la Tirada de Mejora usa ≥ (tirar alto es bueno) — excepción explícita anotada en el propio feat y en §11.2.
- **C-9 × daño:** cualquier opción de tier que infle NE infla el daño (Daño = NE + arma + atributo) *encima* del +10 plano por tier ya canónico — argumento extra para el piso.
- **Comatoso = 4 graves × penalizaciones por zona:** con 4 graves activas las penalizaciones acumuladas (−3 NE por brazo, −1 acción por torso…) ya hacían inviable pelear; coherente, pero el estado **Desmayado** ("heridas al límite") sigue definido por contador de Heridas, no por PG Reales — la frontera exacta Desmayado/Comatoso sigue siendo esqueleto.
- **Simulador:** implementa bandas parametrizables (C16/C17) y ≤ — compatible con C-7/C-8 — pero su ventaja de tier (+10/+5) quedará no-canónica si aprobás el piso 8.

## 6. Verificación de regresión

Greps de reglas obsoletas sobre todo el repo (excluyendo `99_Archivo/` y citas históricas anotadas): **cero** ocurrencias residuales de reducción ½ / "2 graves agotan" / Comatoso ≥2; **cero** "Falencia" como término de juego vigente (solo notas de renombre e histórico); **cero** "más de mil años" sin marca de superado; **cero** "Claudfield" sin anotación; **cero** "Sparring" sin marca de obsoleto (salvo el informe fechado del 07-02, que es registro puntual); **cero** comparaciones `<` estrictas en la hoja X (verificado por script en todo el libro). Los dos borradores de motor (`Motor_v2`, `Nucleo_Jugable`) conservan su texto no ratificado, ahora con las resoluciones C-1/C-4/C-7 anotadas inline para que no reintroduzcan reglas viejas.

## 7. Impacto en el playtest (RPG Mínimo Viable)

**Estas decisiones desbloquean parte del loop pero no lo completan.** Los 6 bloqueantes duros del diagnóstico 2026-06-28 siguen: Resistencia del Linaje numérica (la necesita el canon actual **y** C-3), valor de las competencias, flujo ataque→daño, tablas de armas, estados de combate (Arrebatado ya definido; Aturdimiento/Incapacitado no), y statblocks de criaturas.

**Qué probar primero en la próxima mesa, en este orden:**
1. **Letalidad C-1** — ritmo de heridas con umbral ½ / reducción ¼ / Comatoso 4: ¿los combates se sienten largos? (era la mayor divergencia del canon).
2. **Bandas C-7** — frecuencia percibida del 5-6% de crítico automático en ambos extremos; y definir **antes de la mesa** el NE/NF de banda (inconsistencia restante #1 — sin eso, un 03 con habilidad 20 no sabe cuánto NE da).
3. **Economía del feat Entrenamiento C-4** — con marcas al fallar y sin consumo al fallar la mejora, medir cuántas mejoras reales entrega una sesión (topes 5/2) y si la Opción XP se siente cara o automática.
4. **C-3 (si se ratifica)** — probar con una ficha convertida antes de migrar nada: el doble aporte de Vitalidad a MH cambia todos los tiempos de combate.
5. **Tier (tras aprobar C-9)** — un encuentro de práctica humano vs criatura tier +1 para validar la ventana del piso 8.

---
*Aplicado y verificado 2026-07-03. C-2 (renumeración), C-3 (ratificación) y C-9 (aprobación) quedan en tus manos.*
