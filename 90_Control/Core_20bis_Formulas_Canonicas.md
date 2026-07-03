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
| **PG Reales** | `ROUNDUP(MH − (MH/2) × heridas_graves)` *(con MH/2, 2 heridas graves agotan PG)* |
| Dureza | `Nivel de Vitalidad` |
| Heridas Mortales por zona | 1d6: 1.Pierna Der · 2.Pierna Izq · 3.Brazo Der · 4.Brazo Izq · 5.Torso · 6.Cabeza |

### Recursos
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
| **Comatoso** | Tantas **heridas graves** que no puedes despertar (≥ 2 con MH/2). Sin mortal. Muere si lo abandonan. |

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
| 00 (mínimo + capicúa) | **Éxito automático + Crítico** (NE 10) — siempre |
| Éxito | `d100 ≤ valor_habilidad` |
| Fallo | `d100 > valor_habilidad` |
| NE (éxito) | dígito de **decenas** de la tirada |
| NF (fallo) | dígito de **unidades** de la tirada |
| Capicúa en éxito | Crítico de Éxito → NE 10 |
| Capicúa en fallo | Crítico de Fallo → NF 10 |
| 99 | **Sin regla de máximos** *(canónico Hassan)*: resuelve normal; si falla, crítico por capicúa |
| Tiers distintos | Un **fallo** cuenta como **éxito vs tier inferior** (NE = decenas, igual) — ver §11.1.bis |

### Magia (Spellcasting v2)
| Item | Fórmula |
|---|---|
| Nivel de Potencia (PL) | `1 + NE` |
| Coste base de hechizo | `1 + PL` en Maná (si el conjuro no define otro) |
| Daño Genérico (DG) | `PL × Nivel de Voluntad` |
| Límite de PL por aspecto | `Nivel de Inteligencia` (salvo que el hechizo diga otra cosa) |

---
