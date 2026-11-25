# Vida y Salud

> **Revisión parcial — 2026-11-16.** Estados críticos y heridas mortales actualizados. Los pendientes se señalan en sus apartados.

## Sistema de Daño y Heridas

> **Filosofía de la Vida (canon — Hassan 2026-06-28).** Los PG/MH **no** son el eje de supervivencia. A diferencia de D&D —donde el HP es un contador abstracto que crece con el nivel— en Gideon la Vida **casi no escala**. Un personaje sobrevive mejor a medida que progresa no por tener más Vida, sino por **defenderse mejor de forma activa**: esquiva, parry, bloqueo, mejor equipo y hechizos defensivos, que debe gastar para vivir. El personaje nunca deja de ser una "bolsa de carne": un veterano puede ser extraordinario, pero si lo toman por sorpresa y expuesto, muere como cualquiera. La supervivencia es una herramienta activa, no un colchón pasivo de HP.

**Máximo de Heridas / Puntos de Golpe Máximos (MH / PG).**
> **MH = ⌈Escalado Vital del Linaje × Nivel de Vitalidad⌉** *(canon de Hassan 2026-07-23, recogido en §20.bis y consolidado con los linajes de demo el 2026-11-05).*

El Escalado Vital se define en el linaje. El resultado se redondea hacia arriba.

Gideon utiliza un **sistema de heridas acumulativas**: recibir daño suma heridas y la curación las resta. **MH** es el límite de heridas que podés soportar y se mantiene como referencia para los umbrales y demás cálculos. El margen que te queda es **MH − heridas acumuladas**; tener «vida superior a 0» significa que ese margen es positivo.

**Categorías de herida.**

| Tipo | Umbral |
|---|---|
| **Herida Grave** | Daño ≥ **MH / 2** |
| **Herida Mortal** | Daño ≥ **MH** |

Una **herida mortal** también cuenta como una **herida grave** a efectos mecánicos y tiene ubicación.

**Heridas graves acumuladas.**

Cada herida grave fija un bloque de **¼ MH** dentro de las heridas causadas por el golpe. El resto son **heridas leves**. El tamaño del bloque es siempre **¼ MH**, independientemente de cuánto daño haya causado el golpe. Este bloque requiere tratamiento y no se elimina con la curación de heridas leves; permanece en el total de heridas acumuladas y cuenta para los demás cálculos. **MH se mantiene sin cambios.** Las heridas mortales también cuentan como graves.

Con **MH 12**, un golpe de **6 de daño** causa **6 heridas en total: 3 del bloque grave y 3 leves**. Un golpe de **10 de daño** causa **10 heridas en total: 3 del bloque grave y 7 leves**; alcanza el umbral de grave, pero no el de mortal.

La ubicación de las heridas se determina según [Zonas de impacto y apuntar](Zonas_de_Impacto_y_Apuntar.md).

**Penalizaciones por parte afectada (herida Grave = temporal; herida Mortal = mutilación permanente):**
- **Brazo** — −3 NE a acciones que usen esa mano.
- **Pierna** — Pierdes 2 unidades de movimiento.
- **Torso** — Pierdes 1 acción por turno.
- **Cabeza** — Ganas tantos contadores de **Aturdimiento** como el NE del impacto.

## Vida Temporal

*Canónico — Hassan, 2026-11-24.*

Cada punto de **Vida Temporal** absorbe **1 herida que ibas a recibir**. Descontá de inmediato los puntos que absorban heridas y usá las heridas restantes para determinar su gravedad y sumarlas a tus heridas acumuladas.

Si recibís Vida Temporal de varias fuentes a la vez, usá solo la cantidad más alta. Si ya tenés Vida Temporal cuando recibís más, compará los puntos que te quedan con la cantidad nueva y quedate con la mayor.

Las heridas causadas por [Hemorragia](Core_18_Estados_Alterados.md#hemorragia-x) se descuentan primero de tu **Vida Temporal**. Sumá a tus heridas acumuladas cualquier exceso.

## Obliteración

Una **Obliteración** ocurre cuando una sola fuente te causa, en una misma aplicación, **daño neto igual o superior a 2 × tu Máximo de Heridas (MH)**. Compará el daño que efectivamente te causaría Heridas tras aplicar las reducciones correspondientes, incluida la Vida Temporal disponible. Con **MH 10**, un impacto de **20 de daño neto** es una Obliteración.

El límite de muerte de **2 × MH en heridas acumuladas** también se aplica cuando alcanzás ese total a lo largo de varios impactos.

## Estados críticos

### Desmayado

Si tenés **más heridas que las que podés soportar**, quedás Desmayado: no podés actuar ni tenés conciencia del entorno. Para despertar por curación, las heridas acumuladas deben quedar **por debajo de MH**, de modo que tengas un margen superior a 0.

Para la recuperación natural del desmayo, realizás una tirada de **Vitalidad (Resistir)**: el tiempo es de **10 horas menos los NE obtenidos en un éxito, o más los NF en un fallo**, con un **mínimo de un turno**. Con NE 10, la recuperación tarda un turno. Al cumplirse ese tiempo, se reducen las heridas leves necesarias para que el total de heridas acumuladas quede en **MH − 1** y despertás con **un punto de margen**. Esta recuperación conserva los bloques de heridas graves y requiere que hayas sobrevivido y que tu estado permita recuperarte del desmayo.

Mientras estás Desmayado, seguís acumulando heridas. Las heridas que exceden tu capacidad se conservan y cuentan para el límite de muerte. **Morís cuando las heridas acumuladas alcanzan 2 × MH.**



### Agonizando

Entrás en **Agonía** si recibís una **herida mortal**, según su ubicación, o si estás **[Herido de gravedad](Core_18_Estados_Alterados.md#herido-de-gravedad)** y alcanzás el máximo de heridas leves que podés soportar. Ese máximo es el margen de **MH** que queda tras contar los bloques de heridas graves: al llenarlo, las heridas acumuladas alcanzan **MH**.

Al entrar en Agonía, realizás una tirada de **Vitalidad (Resistir)**. Si fallás, **morís**. Si tenés éxito, permanecés con vida tantas **rondas como NE** obtengas; al agotarse esas rondas, morís.

### Heridas mortales según ubicación

- **Cabeza:** muerte inmediata.
- **Pecho / Torso:** muerte inmediata.
- **Otras ubicaciones:** entrás en Agonía y aplicás su procedimiento de Resistir.



Todas las heridas mortales causan **[Hemorragia (X)](Core_18_Estados_Alterados.md#hemorragia-x)**, donde **X = ⌊NE del golpe / 2⌋**, siempre redondeando hacia abajo. Puede tratarse mediante la acción [Aplicar torniquete](Acciones_Genericas.md#aplicar-torniquete).

### Coma Traumático

Si los bloques de heridas graves acumulados alcanzan o superan **MH** y seguís con vida, entrás en **Coma Traumático**. No despertás por descanso normal y podés morir si permanecés sin atención.

La recuperación depende del tratamiento de las heridas graves mediante las capacidades de curación correspondientes del proyecto. Los riesgos por falta de atención también afectan a Desmayado y se detallan en [Cansancio — Inconsciencia y falta de atención](Cansancio.md#inconsciencia-y-falta-de-atención).

## Heridas y salud — bloques trasladados de §11.5

El daño psíquico y su tabla se desarrollan por separado en [Daño Psíquico](Dano_Psiquico.md).

**Heridas persistentes.** Los bloques de heridas graves y su tratamiento se describen en Heridas graves acumuladas, más arriba.

**Infección.** Herida infectada no se cura sola. El DM hace en secreto una salvación de **Vitalidad** → número de días hasta sepsis (Herida Mortal infectada).

## Curación natural

Cada criatura sana **1 herida leve por día** sin atención especial. Para el tratamiento de otras heridas, consultá [Cirugía de emergencia](Acciones_Genericas.md#cirugía-de-emergencia) y [Cirugía](Acciones_Genericas.md#cirugía).
