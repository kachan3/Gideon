> **Módulo canónico** — Senda del Berserker. Creado el 2026-08-12 como desarrollo completo de §12.3.

# Habilidades Insignia — Berserker

> Generación de Ira, Vida Temporal, Furia Desatada y duración del Trance actualizadas el 2026-11-24.

## Pool de Ira

La Ira es el recurso central del Berserker. Representa la acumulación de furia ante el daño sufrido por el personaje y sus seres queridos.

- **Máximo de Ira.** Dividí tu Voluntad por 10 y **redondeá hacia arriba**. Si el resultado tiene decimales, usá el entero siguiente. Con Voluntad 30 podés acumular 3 cargas y con Voluntad 31 podés acumular 4.
- **Inicio de combate:** 0 cargas (salvo que un dote o motivo narrativo otorgue cargas iniciales).

| Voluntad | Nivel | Pool máx. de Ira |
|---|---|---|
| 1–10 | 1 | 1 |
| 11–20 | 2 | 2 |
| 21–30 | 3 | 3 |
| 31–40 | 4 | 4 |
| 41–50 | 5 | 5 |
| 51–60 | 6 | 6 |
| 61–70 | 7 | 7 |
| 71–80 | 8 | 8 |
| 81–90 | 9 | 9 |
| 91–99 | 10 | 10 |

### Generación de Ira

- **Al inicio de tu turno en combate**, ganás **1 carga de Ira** si estás por debajo de tu **máximo de Ira menos 1**. Con un máximo de 4 cargas, esta regla te permite llegar hasta 3.
- **Cuando vos o un aliado recibe una herida grave o mortal**, ganás **1 carga de Ira**. Esta carga puede llenar la reserva y activar el Trance.

> `[ESQUELETO: fuentes adicionales de Ira vía dotes o motivos narrativos — pendiente Hassan.]`

### Vida Temporal por Ira

Al inicio de tu turno en combate, después de resolver la generación de Ira, obtenés **1 punto de [Vida Temporal](../../10_Reglas/Vida_y_Salud.md#vida-temporal) por cada carga de Ira que tengas en ese momento**.

Perdés la Vida Temporal restante de este Rasgo **al inicio de tu próximo turno**, antes de generar la nueva, **o al finalizar el combate**, lo que ocurra primero.

### Decaimiento

La Ira **no decae** durante el combate. Fuera de combate, la Ira se drena a 0 cuando el personaje se calma (a discreción del DM).

---

### Furia Desatada (Uso Activo de Ira)

La Furia Desatada es la decisión de canalizar toda tu rabia acumulada en tus golpes, sacrificando tu guardia.

- **Declaración:** Al inicio de tu turno, antes de atacar, declaras Furia Desatada.
- **Efecto:** Sumas tu **Ira acumulada actual** como daño extra plano a **todos** tus ataques con armas **melee o arrojadizas** durante este turno.
- **Costo.** Quedás [Arrebatado](../../10_Reglas/Core_18_Estados_Alterados.md) hasta el inicio de tu próximo turno.
- **Ira.** Activar Furia Desatada no consume cargas. El decaimiento de la Ira se aplica normalmente.

> *Ejemplo: un Berserker con 5 cargas de Ira declara Furia Desatada. Realiza 2 ataques con su hacha: cada ataque suma +5 al daño. Queda Arrebatado hasta su próximo turno.*

---

### Desquite (Golpe Puntual con Ira)

Podés gastar **1 carga de Ira** en [Desquite](../Dotes/_esqueleto_Desquite.md) en el mismo turno que Furia Desatada. Consultá [Enemigo Declarado](Berserker_03_Enemigo_Declarado.md#efectos) para su excepción al costo.

---

## Trance

Cuando la Ira del Berserker alcanza su máximo, su furia nubla su mente y pierde su individualidad. Se convierte en la encarnación de la Furia.

### Gatillo y Costo
Se activa **automáticamente** cuando tu Pool de Ira alcanza su **máximo** (= Nivel de Voluntad).

- **Costo de Maná:** Al entrar en Trance, gastas tantos **Puntos de Maná como cargas de Ira** tengas (= Nivel de Voluntad). La ira consume el alma del dríade para entrar en ese estado de ira divina. Si no tenés suficiente Maná, el Trance se activa igualmente pero el déficit se resta como [Daño Crónico](../../10_Reglas/Core_13_Sistema_de_Magia_y_Energia.md#límite-seguro-y-daño-crónico).
- **Fuerza Aliota.** Si ya obtuviste este Rasgo, consultá su [uso al entrar en Trance](Berserker_02_Dotes_de_Senda.md#fuerza-aliota).

### Duración
El Trance dura **tantos turnos como tu Nivel de Voluntad**. No podés terminarlo voluntariamente.

| Voluntad | Nivel | Pool max | Duración Trance |
|---|---|---|---|
| 30 | 3 | 3 cargas | 3 turnos |
| 40 | 4 | 4 cargas | 4 turnos |
| 50 | 5 | 5 cargas | 5 turnos |
| 60 | 6 | 6 cargas | 6 turnos |
| 70 | 7 | 7 cargas | 7 turnos |

### Efectos Durante el Trance

- **Durante el Trance**, la Ira se conserva hasta que matás al enemigo o lo hacés huir, salvo las cargas que gastes.
- **"I Feel No Pain"** — Ignoras **todas** las penalizaciones por heridas (normales, graves y mortales). Las heridas siguen existiendo — si te morís, te morís. Pero si por tener un brazo roto restás NE a tus tiradas, lo ignorás.
- **Ignoras las penalizaciones del [sistema de Miedo](../../10_Reglas/Core_19_Miedo_y_Coraje.md)** — los 4 niveles de Miedo (Pavoroso, Asustado, Aterrado, Pánico) no restan NE ni restringen tus acciones mientras estés en Trance.
- Permanecés [Arrebatado](../../10_Reglas/Core_18_Estados_Alterados.md) mientras dure el Trance.
- **No puedes lanzar conjuros.** No puedes iniciar ni continuar Spellweave. Si estás canalizando un hechizo al entrar en Trance, la canalización se interrumpe y los NE acumulados se pierden.

### Fin del Trance

El Trance termina cuando:
1. Se agota su duración.
2. No percibís enemigos hostiles.
3. Matás o hacés huir a todos los enemigos.

---

## Post-Trance (Consecuencia)

Al terminar el Trance:

- **La Ira se drena a 0.**
- **No puedes acumular Ira durante 3 turnos.**
- Las penalizaciones por heridas que ignorabas **vuelven de golpe** — si tenías un brazo roto, ahora lo sentís.
- Si tenías heridas mortales activas, sus efectos aplican normalmente.
