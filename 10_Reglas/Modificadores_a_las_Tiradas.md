# Modificadores de tiradas

## Dificultad de la tirada

La dificultad modifica el valor de habilidad con el que se compara el resultado.

| Circunstancia | Modificador al valor |
|---|---|
| Muy Fácil | +30 |
| Fácil | +20 |
| Sencilla | +10 |
| Normal | 0 |
| Complicada | −10 |
| Difícil | −20 |
| Muy Difícil | −30 |
| Extrema | −40 |


## Dados de Bonificación y Penalización

Cuando corresponde Bonificación o Penalización, se tiran d10 de decenas adicionales. Con **Bonificación**, el jugador elige qué decena usar; con **Penalización**, el Director elige la peor. La decena elegida y el dado de unidades forman el resultado que se leerá en los pasos siguientes.

## Ventaja y Desventaja

**Ventaja X** suma X a los NE de un éxito o resta X a los NF de un fallo. **Desventaja X** resta X a los NE de un éxito o suma X a los NF de un fallo.

| Modificador | Si la tirada es un éxito | Si la tirada es un fallo |
|---|---|---|
| Ventaja X | NE + X | NF − X |
| Desventaja X | NE − X | NF + X |

Ventaja y Desventaja se aplican después de determinar el éxito o fallo y resolver la capicúa. Se modifica únicamente el nivel que corresponde al resultado obtenido, NE para un éxito o NF para un fallo.

Los valores de las Ventajas se acumulan entre sí, al igual que los de las Desventajas. Luego ambos totales se compensan. **Ventaja 3 y Desventaja 2** dejan **Ventaja 1**. **Ventaja 2 y Desventaja 3** dejan **Desventaja 1**. Si ambos totales son iguales, se cancelan por completo.

**El mínimo final de NE y NF es 0.** Primero se compensan Ventaja y Desventaja, luego se aplica el modificador resultante y, si el nivel queda por debajo de 0, se utiliza 0. Un éxito reducido a NE 0 conserva su condición de éxito y un fallo reducido a NF 0 conserva su condición de fallo. Ventaja y Desventaja modifican el nivel y conservan la condición de éxito o fallo determinada anteriormente.

## Exigencia y Salvataje

**Primero se evalúa Salvataje y después se comprueba Exigencia.** Ambas comprobaciones usan los niveles obtenidos tras resolver la capicúa y aplicar Ventaja o Desventaja.

**Salvataje (X)** permite convertir un fallo con **NF ≤ X** en éxito con **NE iguales a los NF finales de ese fallo**. Si **NF > X**, sigue siendo fallo. Los NE del éxito convertido ya incorporan el efecto del modificador aplicado a los NF. Ventaja o Desventaja se aplica una sola vez, antes de Salvataje.

**Los fallos automáticos de la banda 95–99 también pueden convertirse en éxito mediante Salvataje.** La banda determina que la tirada es inicialmente un fallo. Después se resuelven la capicúa, Ventaja o Desventaja y Salvataje en el orden habitual.

El valor que se compara con Salvataje es el **NF resultante del procedimiento**. Una capicúa fallida produce **Pifia, NF 10**, sobre los que se aplica Ventaja o Desventaja antes de comprobar Salvataje. Por ejemplo, con habilidad 40, una tirada de **66** sin Ventaja ni Desventaja produce **NF 10** y supera el umbral de **Salvataje 7**, por lo que permanece como fallo. La tirada **99** también produce Pifia con NF 10 antes de estos modificadores.

**Exigencia de X NE** requiere que un éxito alcance al menos X NE. Se comprueba sobre los éxitos obtenidos por la comparación con la habilidad, por una banda de éxito automático o por Salvataje. Si los NE finales alcanzan el umbral, se cumple la Exigencia; si quedan por debajo, el éxito incumple ese requisito.

Con habilidad 40, una tirada de **91** falla con **NF 1**. Sin Ventaja ni Desventaja, **Salvataje 2** la convierte en éxito con **NE 1**. Ese éxito cumple una Exigencia de 1 NE y queda por debajo de una Exigencia de 3 NE.

| Habilidad | Tirada | Ventaja o Desventaja | Salvataje | Exigencia | Resultado |
|---|---|---|---|---|---|
| 40 | 04 | — | — | 2 NE | Éxito automático, NE 0. Incumple la Exigencia. |
| 40 | 04 | Ventaja 2 | — | 2 NE | Éxito automático, NE 0 + 2 = 2. Cumple la Exigencia. |
| 40 | 91 | Desventaja 2 | 2 | — | Fallo, NF 1 + 2 = 3. Salvataje 2 no lo convierte. |
| 100 | 95 | — | 5 | 5 NE | Fallo automático con NF 5 convertido en éxito con NE 5. Cumple la Exigencia. |
| 100 | 99 | — | 9 | — | Fallo automático y Pifia, NF 10. Salvataje 9 no lo convierte. |
| 100 | 99 | Ventaja 1 | 9 | 9 NE | Fallo automático y Pifia, NF 10 − 1 = 9. Salvataje 9 lo convierte en éxito con NE 9. Cumple la Exigencia. |
