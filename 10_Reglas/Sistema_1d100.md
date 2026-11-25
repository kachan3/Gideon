# Sistema 1d100

## Lectura de la tirada

El sistema usa dos d10, uno para decenas y otro para unidades, que forman un resultado de **00 a 99**. Una tirada de 7 se lee como **07**. El resultado se compara con el valor de la habilidad utilizada, ajustado por las dificultades y modificadores aplicables. Un resultado **igual o menor** obtiene éxito; uno **mayor** obtiene fallo.

En chequeos de habilidad, ataques y tiradas enfrentadas, **00–05 obtiene éxito automático** y **95–99 obtiene fallo automático**, cualquiera sea el valor de habilidad. La aplicación de estas bandas a otro procedimiento requiere que ese procedimiento la indique expresamente.

El **éxito automático** determina que la tirada cuenta como éxito. Si la actividad tiene una **Exigencia de NE**, se comprueba después con los NE finales de ese éxito. Una tirada puede contar como éxito y quedar por debajo de la Exigencia.

**NE es la cifra de las decenas cuando se obtiene éxito. NF es la cifra de las unidades cuando se obtiene fallo.** Las reglas que utilizan esos niveles determinan su efecto concreto, como el daño o la comparación entre resultados.

| Habilidad | Tirada | Resultado antes de aplicar Ventaja, Desventaja y umbrales |
|---|---|---|
| 65 | 43 | Éxito, NE 4 |
| 65 | 72 | Fallo, NF 2 |
| 65 | 04 | Éxito automático, NE 0 |
| 65 | 97 | Fallo automático, NF 7 |
| 65 | 33 | Portento, NE 10 |
| 65 | 77 | Pifia, NF 10 |

Una **capicúa** tiene las dos cifras iguales. Si la tirada tiene éxito, produce **Portento, NE 10**. Si falla, produce **Pifia, NF 10**. Esta lectura también se aplica dentro de las bandas automáticas, de modo que **00 es Portento** y **99 es Pifia**. La Ventaja y la Desventaja se evalúan después de identificar la capicúa.

## Orden de lectura y resolución

1. **Tirar los dados.** Obtener el resultado de 00 a 99, resolviendo los dados de Bonificación o Penalización que correspondan.
2. **Evaluar las bandas automáticas.** Identificar si el resultado pertenece a 00–05 o a 95–99.
3. **Evaluar las dificultades existentes.** Determinar el valor de habilidad aplicable según las circunstancias, bonos y penalizaciones de la tirada.
4. **Determinar éxito o fallo.** Aplicar la banda automática correspondiente o comparar el resultado con el valor de habilidad ajustado. Leer las decenas para NE si hay éxito y las unidades para NF si hay fallo.
5. **Buscar capicúa.** Si las cifras coinciden, aplicar Portento o Pifia según el resultado obtenido.
6. **Aplicar Ventaja o Desventaja.** Ajustar el nivel según [Modificadores de tiradas](Modificadores_a_las_Tiradas.md).
7. **Evaluar Salvataje y después Exigencia.** Si hay un fallo al que pueda aplicarse Salvataje, comparar sus NF finales con el nivel de Salvataje. Si los NF son iguales o menores, convertirlo en éxito con NE iguales a esos NF. Luego comparar los NE del éxito con la Exigencia, si existe. Los éxitos automáticos también deben alcanzar la Exigencia.

