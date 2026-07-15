> **Módulo extraído literalmente de `Gideon Core.md`** (última edición 2026-07-01) en la reestructuración documental del 2026-07-02. Contenido sin modificar. El documento maestro original se conserva íntegro en `99_Archivo/Gideon Core_ORIGINAL_2026-07-01.md`.

## 20.bis HOJA DE FÓRMULAS CANÓNICAS *(extraídas de X — Auto Character Sheet)*

Referencia rápida para validar cálculos de personaje sin abrir el .xlsx.

### Atributos y Habilidades
| Item | Fórmula |
|---|---|
| Nivel de Atributo | `INT(Valor / 10)` |
| Generación aleatoria | `(d4 + d4 + d4) × 5` por atributo |
| Habilidad hija | valor base = valor del atributo padre; al sumar modificación: `Total = Modificación + Atributo Padre` |
| Nivel de Habilidad | `INT(Total / 10)` |

### Vida y Heridas *(canónico Hassan — umbrales actualizados)*
| Item | Fórmula |
|---|---|
| MH / PG Máximos | `Resistencia del Linaje + Nivel de Vitalidad` *(NV eliminado 2026-06-28)* |
| **Umbral Herida Grave** | `ROUNDUP(MH / 2)` *(½ MH — Hassan; reemplaza la versión X de MH/4)* |
| Umbral Herida Mortal | `MH` |
| **PG Reales** | `ROUNDUP(MH − (MH/4) × heridas_graves)` *(cada grave resta **¼ de MH**; hacen falta **4 graves** para llegar a 0 — **canon C-1, Hassan 2026-07-03**; coincide con la hoja X. La versión ½/2-graves que figuraba aquí queda corregida.)* |
| Dureza | `Nivel de Vitalidad` |
| Heridas Mortales por zona | 1d6: 1.Pierna Der · 2.Pierna Izq · 3.Brazo Der · 4.Brazo Izq · 5.Torso · 6.Cabeza |

### Recursos

> **✅ Propuesta C-3 DESCARTADA (Hassan 2026-07-03, D-5):** las fórmulas de esta tabla son el **canon definitivo**; no se migra a la versión experimental. La propuesta quedó archivada en `99_Archivo/`.

| Item | Fórmula |
|---|---|
| Maná Máximo | `Voluntad + Nivel de Voluntad − Daño Crónico` *(NV eliminado 2026-06-28)* |
| Maná Actual | `Maná Máximo − Consumido + Daño Crónico` *(donde Daño Crónico ya bajó el máximo)* |
| Stamina | `Nivel de Vitalidad − heridas_graves` *(NV eliminado 2026-06-28)* |
| Límite Seguro de Maná | `Nivel de Voluntad + Nivel de Vitalidad` |
| Excedido (booleano) | `Consumido > Límite Seguro` |
| Daño Crónico (al exceder) | `IF(Excedido, Consumido_total)` *(se aplica al máximo)* |

### Estados Críticos *(canónico Hassan)*
| Estado | Condición |
|---|---|
| **Activo** | `PG Reales > Heridas Actuales` y ninguna mortal |
| **Desmayado** | Heridas hasta el límite que puedes soportar **sin ninguna mortal**. Recuperable. |
| **Moribundo / Agonizando** | Al menos **1 herida mortal** activa |
| **Comatoso** | **4 heridas graves** acumuladas (PG Reales = 0 por la reducción de ¼ c/u). Sin mortal. Muere si lo abandonan. *(canon C-1, 2026-07-03)* |

### Mitigación por Tipo de Daño *(canónico Hassan — lista completa de 14 tipos)*
| Tipo | Mitigación |
|---|---|
| **Cortante (x)** | Dureza + Armadura Cortante |
| **Punzante (y)** | Dureza + Armadura Punzante |
| **Contundente (z)** | Dureza + Armadura Contundente |
| Fuego / Frío / Rayo | Dureza |
| Veneno / Ácido | Dureza + Resistencia específica |
| **Necrótico** *(aparte)* | Dureza + Resistencia espiritual menor `[ESQUELETO]` |
| **Radiante** *(aparte)* | Voluntad o Carácter `[ESQUELETO]` |
| **Sónico** *(sonido)* | Dureza (parcial) `[ESQUELETO]` |
| **Espiritual** *(aparte)* | Nivel de Voluntad *(Vitalidad NO protege)* |
| **Psíquico** | Nivel de Inteligencia *(Vitalidad NO protege)* |
| **Verdadero** *(daño plano)* | **Ninguna mitigación** — ignora todo |

### Resolución de Tiradas
**Rango canónico: 00–99** (no 1–100). 00 es el mínimo, 99 es el máximo.

| Caso | Resultado |
|---|---|
| **00–05** | **Éxito Automático** — éxito sin importar el Valor; NE normal (04 → NE 0). La capicúa aplica como capa aparte: **00 = además Portento (NE 10)** *(C-7 + aclaración Hassan 2026-07-03)* |
| **95–99** | **Fallo Automático** — fallo sin importar el Valor; NF normal (97 → NF 7). La capicúa aplica como capa aparte: **99 = además Pifia (NF 10)** *(C-7 + aclaración Hassan 2026-07-03)* |
| 00 (mínimo + capicúa) | **Éxito Automático + Portento (NE 10)** — banda y capicúa son capas independientes *(confirmado Hassan 2026-07-03)* |
| Éxito | `d100 ≤ valor_habilidad` |
| Fallo | `d100 > valor_habilidad` |
| NE (éxito) | dígito de **decenas** de la tirada |
| NF (fallo) | dígito de **unidades** de la tirada |
| Capicúa en éxito | **Portento** (Crítico de Éxito) → NE 10 — aplica **en todos los casos**, también dentro de las bandas *(Hassan 2026-07-03)* |
| Capicúa en fallo | **Pifia** (Crítico de Fallo) → NF 10 — aplica **en todos los casos**, también dentro de las bandas *(Hassan 2026-07-03)* |
| ~~99~~ | ~~Sin regla de máximos: resuelve normal~~ **SUPERADO (C-7, 2026-07-03):** 99 cae en la banda 95–99 → **Fallo Automático + Pifia (NF 10)** *(capicúa confirmada — Hassan 2026-07-03)* |
| Tiers distintos | Un **fallo** cuenta como **éxito vs tier inferior** (NE = decenas, igual); el tier superior suma **+8 NE** en enfrentadas *(canon D-3, 2026-07-03)* — ver §11.1.bis |

> **✅ RESUELTO (D-1/D-6 + aclaración final, Hassan 2026-07-03):** las bandas solo fijan el éxito/fallo automático (NE/NF normales, sin mecánica adicional); la **capicúa es una capa independiente que aplica siempre** — **Portento** (NE 10) / **Pifia** (NF 10), también dentro de las bandas. **Alcance de las bandas (D-6):** solo chequeos de habilidad, ataques y enfrentadas — NO aplican a Mejora, iniciativa, creación ni Nacimiento.

> *(Nota de integridad — 2026-07-03: el archivo se encontró truncado a mitad de esta tabla; la sección de Resolución y la de Magia fueron restauradas de la versión previa, con las decisiones D-1/D-3 aplicadas.)*

### Magia (Spellcasting v2)
| Item | Fórmula |
|---|---|
| Nivel de Potencia (PL) | `1 + NE` |
| Coste base de hechizo | `1 + PL` en Maná (si el conjuro no define otro) |
| Daño Genérico (DG) | `PL × Nivel de Voluntad` |
| Límite de PL por aspecto | `Nivel de Inteligencia` (salvo que el hechizo diga otra cosa) |

---
