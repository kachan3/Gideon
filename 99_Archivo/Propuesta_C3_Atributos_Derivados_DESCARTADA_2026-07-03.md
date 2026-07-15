# Propuesta C-3 — Nuevos Atributos Derivados *(2026-07-03, NO RATIFICADA)*

> **Estado:** propuesta de Hassan registrada el 2026-07-03. Rotulada "NEW PROPOSAL"; por decisión de Hassan (misma fecha) se registra aquí con su mapa de migración **sin tocar el canon** de `90_Control/Core_20bis_Formulas_Canonicas.md` hasta ratificación explícita.

## Fórmulas propuestas

| Derivado | Fórmula propuesta | Canon vigente (§20.bis) | Efecto del cambio |
|---|---|---|---|
| **MH / PG Máximos** | `Resistencia del Linaje + Vitalidad / 5` | `Resistencia del Linaje + Nivel de Vitalidad` (= Vitalidad/10) | **Duplica** el aporte de Vitalidad a la vida (Vit 50: 10 → 25 sin contar linaje) |
| **Stamina** | `Nivel de Cardio − heridas graves` *(«Resilience Level» = **Nivel de la skill Cardio**, aclarado por Hassan 2026-07-03)* | `Nivel de Vitalidad − heridas graves` | La Stamina pasa a depender de una **skill entrenable** (Cardio, hija de Vitalidad). Al inicio Cardio = Vitalidad, así que arranca igual y luego diverge con el entrenamiento |
| **Maná** | `Voluntad − Daño Crónico` | `Voluntad + Nivel de Voluntad − Daño Crónico` | Reduce el Maná en `Nivel de Voluntad` puntos (Vol 50: 55 → 50) |

## Mapa de migración (si se ratifica)

| Documento / herramienta | Qué cambiar |
|---|---|
| `90_Control/Core_20bis_Formulas_Canonicas.md` | Filas MH, Stamina y Maná Máximo (y revisar Maná Actual, que deriva del máximo) |
| `10_Reglas/Core_11_Nucleo_del_Sistema_1d100.md` §11.3 | `MH = Resistencia del Linaje + Nivel de Vitalidad` → nueva fórmula |
| `10_Reglas/Core_13_Sistema_de_Magia_y_Energia.md` §13.1 | Fórmulas de Stamina y Maná Máximo |
| `10_Reglas/Nucleo_Jugable_CONSOLIDADO_2026-06-15.md` Partes IV/VI | Ya anotadas como pre-NV; migrar directo a C-3 si se ratifica |
| **Hoja X** (`50_Herramientas/Auto Character Sheet.xlsx`) | `D18` (= `H1+D9` → `H1 + C9/5`), `G31` (Stamina: `D9-C20` → `I16/10 - C20`, donde Cardio total = H16), `G30` (Maná: quitar `D12`) — además corregir el bug preexistente de `H31` |
| `90_Control/Canva_Guia_Rapida_1e.md` (fichas 1e) | Los derivados de las 4 fichas pregeneradas quedan desactualizados |
| `90_Control/Analisis_Mini_Campana_Prueba.md` bloqueante #3 | La "Resistencia del Linaje numérica" sigue sin existir por subraza — la nueva fórmula **también** la necesita |

## Conflictos ocultos a resolver ANTES de ratificar

1. **Límite Seguro de Maná** (`Nivel de Voluntad + Nivel de Vitalidad`) no fue mencionado: ¿se conserva? Si Maná ya no suma `Nivel de Voluntad`, el Límite Seguro queda proporcionalmente más alto respecto del pool.
2. **Daño Genérico** (`DG = PL × Nivel de Voluntad`) sigue usando Nivel de Voluntad — sin cambio, pero conviene confirmarlo.
3. **Dureza = Nivel de Vitalidad** — sin cambio declarado; confirmar que no migra a Cardio.
4. **Stamina por skill (Cardio):** las skills se entrenan con el feat Entrenamiento → la Stamina se vuelve mejorable por juego. ¿Intencional? (Parece que sí: recompensa entrenar Cardio.) Nota: Cardio también puede recibir Marcas y subir con atributo padre.
5. **MH con Vitalidad/5:** ¿redondeo? (propuesta: `INT(Vitalidad/5)` por consistencia con `INT(Valor/10)` — a confirmar).
6. Con MH más alta y reducción de ¼ por grave (C-1), los umbrales absolutos de Grave (½ MH) y Mortal (MH) suben — personajes sensiblemente más duros. Impacto directo en letalidad; probar en playtest antes de ratificar.
