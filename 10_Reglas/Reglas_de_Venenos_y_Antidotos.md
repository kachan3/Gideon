> **Módulo canónico de reglas** — Sistema de Venenos y Antídotos. Canonizado por Hassan el 2026-09-02.

# Sistema de Venenos y Antídotos

> **Aclaración canónica — Hassan, 2026-11-04.** El veneno es una sustancia con efectos propios, **no un tipo de daño**. Cada formulación especifica sus efectos, ciclos, condiciones de avance y consecuencias de sobredosis. Puede causar estados o muerte directa sin infligir daño. **Si inflige daño, se recomienda que sea Verdadero**, que ignora Dureza, armadura y resistencias al daño; la ficha puede especificar otro [tipo de daño](Dano_y_Defensas.md#tipos-de-daño-y-mitigación), incluido Toxinas. Dureza no descuenta contadores ni se aplica como una segunda defensa frente a los efectos del veneno. La resistencia al veneno modifica sus umbrales y depuración, no mitiga el daño Verdadero.

---

## 1. Filosofía y Premisas

### La Naturaleza del Veneno
En el universo de Gideon, el veneno no es simplemente una toxina biológica mundana. Se comprende como **toda sustancia alquímica, mágica o de cualquier otra naturaleza específicamente diseñada para quebrantar o dañar a una forma de vida o no-vida concreta**.

Filosóficamente, el veneno es un vector de peligro que **debe respetarse mecánicamente**: estar expuesto o envenenado en la naturaleza o en territorio hostil es una amenaza tangible y severa que no puede ignorarse como un mero daño residual por turno.

### El Principio del Target (Objetivo Específico)
En Gideon **no existe el veneno universal**. Toda formulación venenosa posee un **Target** (objetivo determinado) intrínseco a su diseño:

- **Ejemplos de Targets:** *Mamíferos, Bestias/Animales, Insectos, Daemonis, Ángeles, Aberraciones, Fantasmas/Espíritus, Constructos, etc.*
- **Bases materiales radicales:** La composición del veneno responde a la naturaleza ontológica de su presa. Así como un veneno para mamíferos puede extraerse de raíces botánicas o glándulas de saurios, un veneno formulado para **Daemonis** puede sintetizarse a partir de una base de agua bendita con pétalos de rosa macerados y polvo de plata purificada.
- **Alcance:** Si el objetivo se encuentra dentro de la categoría del *Target* del veneno, es susceptible de verse afectado por él. Si el objetivo está fuera de su Target, la sustancia es inocua para él por pura incompatibilidad fisiológica o metafísica.

### Inmunidad al Veneno e Inmunidad Intrínseca
¿Existe la inmunidad al veneno? **Sí, pero bajo dos capas ontológicas:**

1. **Inmunidad por Incompatibilidad de Target (General):**
   - Si una criatura posee "inmunidad al veneno" estándar (por ejemplo, seres incorpóreos, autómatas o entidades divinas), esta opera de forma predeterminada frente a venenos mundanos o biológicos porque la sustancia no fue concebida para su naturaleza. Si un veneno ha sido formulado específicamente para su Target (un veneno para ángeles o para espíritus), la criatura es susceptible a él.

2. **Inmunidad Intrínseca / Fenotípica:**
   - Ciertas criaturas o monstruos poseen rasgos biológicos o mágicos extraordinarios que les confieren inmunidad **incluso contra venenos diseñados para su propio fenotipo o especie**.
   - *Ejemplo:* Una bestia con un **hipermetabolismo celular extremo** capaz de detectar, neutralizar y depurar toxinas en cuestión de segundos antes de que puedan acumular contadores o causar daño.

3. **Regla de Diseño: "Lo Específico vence a lo General":**
   - Aunque una criatura posea una inmunidad intrínseca (como un hipermetabolismo), **esta defensa no es una barrera invulnerable absoluta**.
   - Aplicando la regla fundacional de diseño **"Lo específico vence a lo general"**, siempre es posible que un alquimista o un Silente elabore una formulación altamente especializada o una toxina singular diseñada con el propósito expreso de **ignorar, saturar o burlar esa propiedad defensiva concreta** (por ejemplo, un veneno con catalizadores de parálisis metabólica que anula el hipermetabolismo de esa presa específica).

---

## 2. Mecánica de Exposición y Contadores

### Vías de Contacto
El veneno ingresa o interactúa con el sujeto a través de cuatro medios fundamentales:
1. **Herida:** Inoculación directa al torrente o fluidos vitales mediante un arma punzocortante, proyectil o colmillo.
2. **Inhalación:** Absorción pulmonar o etérea mediante gases, esporas, vapores o polvos en suspensión.
3. **Ósmosis:** Absorción por contacto dérmico directo o exposición a través de mucosas y tegumentos externos.
4. **Sumersión:** Exposición masiva o prolongada al sumergirse parcial o totalmente en la sustancia tóxica.

### Contadores de Veneno (X)
Cada vez que una criatura se ve expuesta a un veneno compatible con su Target, el veneno le aplica un valor de **X Contadores de Veneno**.
- Si una criatura vuelve a exponerse a la misma sustancia, los nuevos contadores se **acumulan** a los ya existentes en su organismo.

### Depuración Natural
El cuerpo o la esencia del sujeto combate activamente la toxina:
- **Tasa base:** Un organismo sano elimina de forma natural **1 Contador de Veneno por día**.

---

## 3. El Estado Envenenado y Tolerancia

### Tolerancia al Veneno
Toda criatura posee un umbral de aguante biológico o espiritual denominado **Tolerancia al Veneno**:
- **Tolerancia Base = Nivel de Resistir**, es decir, `⌊Resistir / 10⌋`. **Resistir es una habilidad hija de Vitalidad**, no de Voluntad. Esta tolerancia pertenece a toda criatura; no implica poseer el rasgo **Resistente al Veneno**.

### Trigger del Estado Envenenado
- Antes de la activación, mientras los contadores sean inferiores al umbral que le corresponda según la tabla siguiente, el sujeto contiene la sustancia de forma subclínica.
- **Al alcanzar o superar su umbral de activación**, el sujeto entra de inmediato en el estado **Envenenado**. El umbral es la Tolerancia base para una criatura estándar, el doble para una resistente y 1 contador para una vulnerable.
- **Persistencia:** La criatura permanece en estado *Envenenado* de forma continua **mientras mantenga Contadores de Veneno activos** en su cuerpo.

### Variaciones de Constitución: Debilidad y Resistencia

| Condición del Sujeto | Activación del Estado | Sobredosis | Depuración Natural |
|---|---|---|---|
| **Criatura Estándar** | Contadores ≥ Tolerancia base | Contadores ≥ 2 × Tolerancia base | Elimina **1 contador / día** |
| **Débil / Vulnerable al Veneno** | **Inmediata al exponerse** (desde 1 contador) | Contadores ≥ 2 × Tolerancia base | **No puede eliminar contadores por su cuenta** |
| **Resistente al Veneno** | Contadores ≥ 2 × Tolerancia base | Contadores ≥ 3 × Tolerancia base | Elimina **2 contadores / día** |

**Umbrales ratificados — Hassan, 2026-11-04.** Ambos multiplicadores se calculan sobre la **Tolerancia base**, no sobre el umbral de activación aumentado. Con Nivel de Resistir 4: una criatura estándar queda Envenenada con **4** contadores y sufre sobredosis con **8**; una resistente queda Envenenada con **8** y sufre sobredosis con **12**. Alcanzar el umbral basta; no hace falta superarlo.

---

## 4. Ciclos, Estados y Sobredosis

### Ficha de Veneno: Ciclos y Etapas
Cada veneno especifica en su descripción qué afecciones produce. Los venenos operan mediante **Ciclos y Estados progresivos** (comúnmente divididos en **3 Estados o Etapas** que se agravan sucesivamente):
- **Intervalo de Ciclo:** Cada veneno dicta el ritmo en que sus estados progresan (por ejemplo: *cada 1 hora*, *cada 6 horas*, o *cada 1 día*).
- **Progresión y sobredosis:** La ficha de cada veneno determina las condiciones de avance de etapa y sus consecuencias concretas. No hay un efecto universal de daño: por ejemplo, una formulación puede paralizar al estar Envenenado y causar muerte directa por sobredosis.

### Tipos de Efectos dentro de las Etapas
1. **Efecto Permanente (de Etapa):** Modificadores, penalizadores o afecciones que se mantienen activos de forma continua **mientras el sujeto permanezca dentro de esa etapa** del veneno.
2. **Efecto Instantáneo:** Consecuencias que se detonan y sufren de golpe **en el momento exacto de cambiar y avanzar de etapa** (por ejemplo: espasmo, pérdida súbita de acciones, sangrado interno, daño directo).

### Sobredosis Tóxica (Colapso Inmediato)
Si los contadores **alcanzan o superan el umbral de sobredosis** de la criatura (**2 × Tolerancia base**, o **3 × Tolerancia base si es resistente al veneno**), se aplica inmediatamente **la consecuencia de sobredosis indicada en la ficha de ese veneno**, sin esperar el siguiente ciclo. La ficha puede indicar su peor etapa, muerte directa u otro efecto; no existe un daño universal de sobredosis.

---

## 5. Antídotos y Tratamiento Alquímico

### Mecánica del Antídoto
- **Eliminación de Contadores:** Un antídoto administrado con éxito **limpia y descuenta tantos contadores de veneno como su potencia indique** (una dosis estándar suele eliminar una cantidad fija de contadores).
- Al descender los contadores a 0, el estado *Envenenado* finaliza (aunque los efectos permanentes ya sufridos o el daño causado puedan requerir sanación regular).

### El Requisito de Especificidad
- Un antídoto genérico no anula venenos específicos: **el antídoto debe ser el indicado específicamente para el veneno que afectó a la víctima** (o compartir su misma formulación y target).

### Ventana de Oportunidad Alquímica
En la naturaleza o durante incursiones en territorio salvaje, estar envenenado puede resultar fatal. No obstante, el sistema otorga una ventana táctica de reacción:
- **Formulación mediante Kit de Alquimista:** Si el grupo o un aliado cuenta con un **Kit de Alquimista** y posee conocimientos adecuados (habilidad **Química** / Alquimia), puede sintetizar el antídoto adecuado en campo **siempre y cuando cuente con una muestra del veneno original** (extraída de la hoja enemiga, del dardo, del proyectil o de la flora/fauna agresora).
