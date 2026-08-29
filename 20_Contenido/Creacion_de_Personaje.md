# Creación de Personaje — Crónicas de Gideon

> **Naturaleza de este documento.** Reglas de creación de personaje jugador. Todo lo aquí contenido ocurre en **Ranking 0** — el espacio de los seres humanos y dríades, incluso en su expresión más excepcional. Los Rankings superiores son consecuencia de la campaña, no del origen.

---

## Flujo de Creación y Techo Numérico

> **Ninguna skill puede superar 80 al finalizar la creación de personaje**, sin importar la combinación de puntos, bonos de background, Regalos o cualquier otro modificador. Este techo aplica a la suma final de todos los factores.

Para asegurar que los bonos se apliquen correctamente y respeten el techo de 80, los personajes deben crearse siguiendo este estricto orden matemático:

1. **Paso 1: Atributos Base.** Asignar el arreglo base (o tirada) a los atributos. Las Habilidades Hijas heredan este valor.
2. **Paso 2: Linaje.** Se suman los bonos específicos de la subespecie.
3. **Paso 3: Origen (Trasfondo).** Se chequean los mínimos garantizados de la Dedicación contra los valores actuales (Base + Linaje). Si la habilidad lo supera, se considera **Destacada** y recibe **+5**. Si no, sube al mínimo.
4. **Paso 4: Senda (Clase).** Asignar el **Pool de Combate** (+20, +15, +10, +5) y el **Pool Normal** (+50 puntos). 
5. **Paso 5: Regalo y Desgracia.** Se verifica el **Techo de 80** (puntos excedentes se pierden). Luego se aplican los Regalos y Desgracias (ej. el Regalo *Dotado* tira 1d10 y se suma a todo, ignorando explícitamente el techo de 80).
6. **Paso 6: Compra de XP.** Asignación de la experiencia inicial y resolución del Mulligan.

---

## Paso 0 — Modo de Campaña

La mesa define el modo antes de crear personajes. El modo afecta el peso del trasfondo y la relación del grupo con el Enclave del Eclipse.

**Enclave.** Campaña estructurada. Los personajes firman un contrato formal con el Enclave del Eclipse que establece obligaciones, límites de actuación y condiciones de remuneración. El trasfondo de cada personaje tiene peso mecánico y narrativo: el Enclave recluta según el origen del individuo. `[ESQUELETO: cláusulas tipo del contrato, instancias de ruptura y consecuencias — pendiente de Hassan]`

### El Labor Imperial (Modo Eclipse / Enclave)

En las campañas jugadas en **Modo Eclipse** (o para personajes que se adhieran formalmente al Enclave del Eclipse, ya que pueden unirse o retirarse a lo largo del juego, siendo esto una decisión trascendental), existe un apartado extra en las Hojas de Personaje denominado **"El Labor Imperial"**.

Cada Senda tiene un rol que cumplen en sus misiones, especialmente en los asentamientos. En este ámbito poseen una autoridad bastante certera, operando como emisarios de la voluntad imperial. Esta autoridad **está por encima de las autoridades locales**, a menos que dichas autoridades locales pertenezcan también a una Senda.

- **Senda del Honor (Labor de la Justicia):** Cuando los acontecimientos son poco claros y debe tomarse un accionar para restaurar la paz o elegir una sentencia, la Senda del Honor (especialmente el miembro de mayor rango) sirve como juez provisional.
- **Senda del Silente (Labor del Secretismo y el Orden):** Se encarga de evaluar y ocultar cosas que podrían ser perjudiciales para el mundo civilizado de una forma u otra. Su deber es resolver cómo mantener el secretismo y el orden para que los engranajes de la sociedad sigan girando.
- **Senda del Arcanista (Labor de la Preservación):** Se encarga de preservar, recuperar y evaluar qué destino o importancia pueden tener reliquias, objetos mágicos o artefactos desconocidos, determinando qué tanto vale la pena asegurarlos y resguardarlos.
- **Senda del Elementalista (Labor del Bienestar a Largo Plazo):** Tiene el deber de decidir sobre el bienestar y la salud a largo plazo de una población.
- **Senda del Hierofante (Labor de la Salud Inmediata y Purgación):** Decide sobre la salud inmediata de pacientes afligidos o poblaciones enfermas, y sobre cómo detener o truncar los planes de Agentes Daemonis en este mundo. Tiene autoridad total en ese criterio, siempre que beneficie al imperio y al mundo civilizado.
- **Senda del Heraldo (Labor de la Estrategia y Mediación):** Decide sobre cuestiones estratégicas y logísticas (si es correcto abandonar o trasladar una posición, o si tomar defensas y acuartelarse). Cuando los líderes locales son incompetentes, es su deber poner en marcha a todos los ciudadanos y aldeanos de Kindremor. Además, actúa como mediador entre todos los demás compañeros que pertenecen a las Sendas para recordarles el deber mayor.
- **Senda del Valor (Labor de la Esperanza y el Mando Militar):** Tiene la responsabilidad de traer calma y esperanza general, así como liderar cargas, entrenar milicianos y decidir qué objetivos vale la pena derrotar o cuáles se consideran imposibles. Es un experto militar que sabe qué peleas se pueden ganar aunque parezcan imposibles.
- **Senda del Berserker (Labor de las Medidas Desesperadas):** Es el responsable de tomar las decisiones difíciles y de "cortar el nudo gordiano" cuando hace falta. Guía a la gente a maniobras suicidas, purga poblaciones y se sacrifica a sí mismo (o a otros) por el bien mayor. Es el encargado de hacer lo que nadie quiere, "romper la máquina para seguir adelante", y si hace falta, traer la furia del imperio a cualquier enemigo.
- **Senda del Cazador (Labor de la Inteligencia e Investigación):** Se encarga de reunir información sobre amenazas y problemas a futuro, y evaluar los estados generales cuando faltan piezas. Opera como detective e investigador de campo; sus agudos sentidos no deben ser subestimados.
- **Senda del Monje (Labor de la Sabiduría):** No posee un labor imperial oficial (o no está aclarado en los registros formales). Sin embargo, asumen el deber extraoficial de ser sabios y buscar la solución más lógica y coherente, usando su cabeza fría y su temple para actuar con rectitud ante cualquier situación.

**Sandbox.** Campaña libre. Sin contrato ni estructura central. Las motivaciones son individuales o grupales. El trasfondo es punto de partida narrativo sin implicaciones institucionales.

---

## Paso 1 — Atributos Base

El núcleo numérico del personaje está compuesto por 10 Atributos, divididos en tres categorías formales más un atributo excepcional *(canónico — Hassan 2026-08-17)*:

* **Mentales:** Inteligencia, Carácter, Instinto.
* **Físicos:** Fuerza, Agilidad, Vitalidad.
* **Marciales:** Melee, Proyectiles, Arcana.
* **Espiritual:** Voluntad (es un atributo íntegro y simbólico de la chispa del alma, que existe en su propia categoría).

Todas tus **Habilidades Hijas** nacerán con el mismo valor que su Atributo Padre correspondiente.

Existen dos métodos para obtener los números de tus atributos base:

1. **Valores Fijos (Arreglo):** Repartes libremente los siguientes 10 valores entre tus atributos: **50, 45, 40, 35, 30, 30, 30, 20, 20, 15**.
2. **Aleatorio (3d4 × 5):** Tiras 3d4 y multiplicas el resultado por 5 para cada uno de los 10 atributos. (Este método habilita bonos especiales en el Paso 6 de Experiencia Inicial).

---

## Paso 2 — Especie y Linaje

Para esta demo, la única especie jugable es el **Dríade**, y el jugador debe elegir uno de los siguientes linajes. El linaje determina el **Escalado Vital** para calcular los puntos de vida máximos (MH = Escalado Vital + Nivel de Vitalidad) y otorga **Bonos de Creación** a ciertas habilidades:

- **Hijos del Viento (WindChilds):** Escalado Vital × 2. **Bono:** +10 a Evasión y +5 a Saltar.
- **Seres del Río (Riverdwellers):** Escalado Vital × 2. **Bono:** `[ESQUELETO: bono pendiente]`
- **Hijos de las Estrellas (Starchilds):** Escalado Vital × 2.5. **Bono:** +5 a Cronibor.
- **Hijos del Bosque (Forestkind):** Escalado Vital × 2.5. **Bono:** +5 a cualquier habilidad de Proyectiles.
- **Hijos de la Luna (Moonchilds):** Escalado Vital × 2.5. **Bono:** +5 a Sigilo y +5 a Ivganny (Ilusión).
- **Hijos del Hielo (FrostChilds):** Escalado Vital × 3. **Bono:** +5 a Ignamor.
- **Hijos de la Tierra (Earthfolks):** Escalado Vital × 3. **Bono:** +5 a una habilidad a elección de Melee, Proyectiles o Arcana.
- **Hijos del Sol (Sunchilds):** Escalado Vital × 3. **Bono:** +5 a Ignamor.

*(Ver §3 del Core para detalles estadísticos y narrativos de cada linaje).*

**Personajes Alternativos (Otro tipo de Ser):** 
Existen otras especies que operan dentro del mismo sistema de juego pero poseen elementos que varían drásticamente (por ejemplo, pueden no tener Senda o poseer estadísticas y progresiones diferentes). Se deben elegir como un "tipo distinto de personaje" desde la primera etapa de creación. 
**Entre ellos están los Jottun (Escalado Vital × 5, sin Senda), Hombres Lagarto y Magos de Sangre. Por el momento, NO serán jugables en esta demo.** *(Canónico — Hassan 2026-07-23).*

---

## Paso 3 — Origen (Trasfondo)

Todo trasfondo se compone de tres elementos independientes: **Dedicación**, **Nacimiento** y **Regalo & Perjuicio**. Los tres se combinan libremente — un Nacimiento no limita qué Dedicación puede elegirse ni viceversa.

---

### 3.1 Dedicación

La Dedicación es el oficio o modo de vida del personaje antes de convertirse en aventurero. Define qué practicó, no quién es cosmológicamente ni de dónde viene.

Cada Dedicación otorga:
- **Skills garantizadas**: valores mínimos en las skills core del oficio. Si el personaje termina la creación por debajo de ese mínimo en alguna de ellas, el sistema la sube automáticamente al piso garantizado.
- **Destacado (binario)**: si al finalizar la creación el personaje supera el mínimo garantizado en una skill de su Dedicación, recibe **+5 en esa skill**. No hay gradación — se tiene o no se tiene.
- **4 preguntas de trasfondo**: herramienta narrativa que genera hooks para el jugador y el DM. Las respuestas no tienen peso mecánico directo. Las preguntas marcadas con **(\*)** invitan a coordinar con el DM: si el DM quiere introducir ese elemento en la historia, ese es el momento; si no, el jugador usa su propio headcanon.

`[ESQUELETO: puntos de skill asignables en creación y cómo se distribuyen — pendiente de diseño]`

---

#### Granjero

*Tierra, ciclos y trabajo físico sostenido. El granjero sabe que la tierra no perdona la impaciencia.*

**Skills garantizadas:** `[ESQUELETO: pendiente de Hassan]`

**Preguntas:**
1. ¿A qué te dedicabas: cultivo, ganadería o ambos?
2. ¿La tierra era propia, arrendada o trabajabas para otro?
3. ¿Tienes familia que sigue en el campo? ¿Qué relación mantenés con ellos?
4. ¿Qué te llevó a dejar esa vida?

---

#### Artesano

*Un oficio concreto, una reputación local, manos que saben hacer algo bien.*

**Skills garantizadas:** `[ESQUELETO: pendiente de Hassan]`

**Preguntas:**
1. ¿Cuál era tu oficio específico?
2. ¿Trabajabas solo, en un taller o bajo un maestro? *(\*)*
3. ¿Hay alguna obra tuya de la que estés orgulloso, o que preferirías que no existiera?
4. ¿Por qué dejaste el oficio?

---

#### Marinero

*Agua, viento y la permanente conciencia de que el mar no hace favores.*

**Skills garantizadas:** `[ESQUELETO: pendiente de Hassan]`

**Preguntas:**
1. ¿En qué tipo de embarcación servías: comercio, exploración o corso?
2. ¿Tenías rango o eras tripulante raso?
3. ¿Tienes vínculos con algún puerto o tripulación? *(\*)*
4. ¿Qué viaje o mar recordás con más intensidad?

---

#### Mercader

*Contactos, rutas, riesgo calculado. El mercader vive de que los demás necesiten lo que él tiene.*

**Skills garantizadas:** `[ESQUELETO: pendiente de Hassan]`

**Preguntas:**
1. ¿Qué tipo de bienes comerciabas?
2. ¿Operabas solo, para una casa comercial o con socios? *(\*)*
3. ¿Tenés deudas pendientes o contratos sin cerrar?
4. ¿Qué trato te definió, para bien o para mal?

---

#### Académico / Erudito

*Estudio, registro, análisis. Alguien que pasó años aprendiendo más de lo que la mayoría sospecha que existe.*

**Skills garantizadas:** `[ESQUELETO: pendiente de Hassan]`

**Preguntas:**
1. ¿En qué campo se concentraba tu estudio?
2. ¿Dónde estudiaste: institución formal, aprendizaje autodidacta o bajo un mentor? *(\*)*
3. ¿Hay algo que aprendiste que preferirías no saber?
4. ¿Qué te alejó de la academia o la investigación?

---

#### Médico

*Heridas, enfermedades, decisiones bajo presión. El médico aprende a vivir con los límites de lo que puede hacer.*

**Skills garantizadas:** Medicina 20, Inteligencia 20 *(canónico — Hassan 2026-06-15)*

**Preguntas:**
1. ¿Dónde ejercías: ciudad, campo de batalla, institución religiosa?
2. ¿Fue formación formal o aprendiste por necesidad?
3. ¿Hubo un paciente que no pudiste salvar y no has olvidado? *(\*)*
4. ¿Qué te alejó de la práctica?

---

#### Soldado

*Entrenamiento completo, cadena de mando, experiencia real contra oponentes diversos. Un soldado sabe pelear, no solo atacar.*

**Skills garantizadas:** Melee 35 *(aplica a todos los sub-skills de Melee — canónico, Hassan 2026-06-15)*

`[ESQUELETO: confirmar si Proyectiles también tiene mínimo garantizado para Soldado — pendiente de Hassan]`

**Preguntas:**
1. ¿Para qué ciudad o facción serviste? *(\*)*
2. ¿Abandonaste tu servicio? ¿Por qué?
3. ¿Tienes aliados o amigos en el ejército? *(\*)*
4. ¿Qué momento de tu servicio recordás más?

---

#### Banderizo

*Juramento, lealtad y el peso de servir a alguien en específico. El banderizo no trabaja por dinero — trabaja por vínculo.*

**Skills garantizadas:** `[ESQUELETO: pendiente de Hassan]`

**Preguntas:**
1. ¿A qué casa o señor estabas jurado? *(\*)*
2. ¿Ese juramento sigue vigente, fue roto o el señor ha muerto?
3. ¿Había otros banderizos con quienes te sentías hermano? *(\*)*
4. ¿Qué acto de lealtad o traición te define mejor?

---

#### Mercenario

*Sin lealtad institucional. Trabaja por contrato. Bien recibido en las Islas Libres; visto con recelo en Pircar.*

**Skills garantizadas:** `[ESQUELETO: pendiente de Hassan]`

**Preguntas:**
1. ¿Trabajabas solo o en una compañía? *(\*)*
2. ¿Hay alguien que te quiera muerto por un trabajo pasado?
3. ¿Tenés algún código personal o sos puramente transaccional?
4. ¿Cuál fue el contrato del que más te arrepentís?

---

### 3.2 Nacimiento

El Nacimiento define la **unidad social de concepción** del personaje y el **nivel económico o cultural** de esa unidad. No es de dónde viene geográficamente —eso surge de la combinación con la Dedicación y la narrativa del jugador— sino en qué tipo de estructura nació.

La tabla usa categorías abstractas universales: el mismo resultado tiene nombre distinto según la región, y el DM lo traduce. Un resultado de *Linaje Comprometido* es un Banderizo en el continente principal, un clan juramentado en las Islas Libres, algo equivalente en el Continente Rojo.

**Tirada:** 1d100. Los resultados marcados con ✦ son entradas de baja frecuencia.

`[ESQUELETO: confirmar pesos y rangos exactos con Hassan — tabla provisional abajo]`

| Rango | Nacimiento | Descripción |
|---|---|---|
| 01–28 | Familia Campesina | Criado en trabajo de la tierra o ganadería. Escasos recursos, comunidad cohesionada. |
| 29–43 | Familia Artesana | Oficio familiar transmitido. Clase media-baja urbana o rural. |
| 44–55 | Familia Mercader | Comercio como modo de vida. Movilidad, contactos, cultura del trato. |
| 56–65 | Familia Militar | Tradición de servicio armado. Disciplina y lealtad institucional como valores centrales. |
| 66–73 | Linaje Comprometido | Familia de servicio jurado a una casa, señor o institución. Equivale a Banderizo en el continente principal. |
| 74–78 | Estirpe Elevada ✦ | Nobleza o clase dirigente equivalente. Privilegio, obligaciones y nombre que pesa. |
| 79–86 | Huérfano Institucional | Criado por una institución: gremio, orfanato civil, capilla, orden militar. Sin familia de origen conocida o presente. |
| 87–92 | Origen Ilegítimo ✦ | Nacido fuera del reconocimiento formal. Apellido negado o ambiguo. Estatus incierto. |
| 93–97 | Sin Raíz | Familia nómada, viajera o sin pertenencia fija. Cultura de tránsito, sin comunidad estable. |
| 98–00 | Enigmático | El personaje no sabe su origen, o no lo quiere definir. Sin implicaciones mecánicas. |

> **Nota.** Los orígenes especiales vinculados a Primigenios (Hijo de Alioth, Hijo de Sulivann, Cordero Liberado) son reglas opcionales separadas que no forman parte de esta tabla.

---

## Paso 4 — Senda (Clase)

En este paso, el jugador elige la Senda de su personaje. Como se detalla en el Core (ver §12 Sendas Mecánicas), el jugador recibe sus dos pools de creación:
- **Pool de Combate:** Asigna los valores fijos +20, +15, +10 y +5 a cuatro Habilidades Hijas de combate distintas (de Melee, Proyectiles o Arcana).
- **Pool Normal:** Reparte 50 puntos entre las Habilidades Hijas normales, con un máximo de +20 a una sola habilidad.

*(Nota: Los dotes y rasgos específicos de la Senda se eligen también en este punto).*

### Dotes Insignia *(canónico — Hassan 2026-08-17)*

Los **Dotes Insignia** son los dotes que vienen de base al elegir una Senda. Son las habilidades fundamentales e íntimas de la clase.

- **No se pueden reemplazar** ni optar por no poseer. Son inseparables de la Senda.
- **No son exclusivos** de la Senda. A diferencia de los **Rasgos** (que son exclusivos de la clase y únicamente de la clase), los Dotes Insignia pueden obtenerse también por **Linaje, Origen o Don**. Lo que los hace "insignia" es que la Senda los garantiza, no que los monopolice.
- **Duplicado = +1 XP extra.** Si por tu Linaje, Origen o Don **ya posees** un dote que tu Senda te otorgaría como Insignia, recibes **+1 XP extra** para tu personaje en lugar del dote duplicado.

> *Ejemplo: el Origen "Erudito" otorga el dote "Lanzador de Conjuros". Si además eliges la Senda del Arcanista (cuya Herencia incluye "Lanzador de Conjuros"), ya lo tenés — recibes +1 XP extra.*

---

## Paso 5 — Regalo y Desgracia (Perjuicios)

> **Terminología *(canónico — Hassan 2026-06-29)*.** Lo que antes se llamaba "Falencia" pasa a llamarse **Perjuicio** —término neutro—: una **desventaja de origen**, no un defecto de carácter (una discapacidad no es una falla individual).

Rasgos **opcionales** de origen. Un **Regalo** es una ventaja; un **Perjuicio**, una desventaja. **Son independientes — NO forman pares obligatorios.** Podés tener un Regalo sin Perjuicio, un Perjuicio sin Regalo, ambos, o ninguno.

Algunos Regalos y Perjuicios tienen un **contrario temático** (Dotado ↔ Anti-Dotado; Carismático ↔ Desagradable), pero es sólo sabor: **tener un opuesto no obliga a tomarlo**, y no todos lo tienen. Las **discapacidades de origen** (Ciego, Sordo, Inmovilidad motriz, Amputación) son Perjuicios: se toman de forma independiente y aplican su estado de §18.

**Adquisición *(canónico — Hassan 2026-06-29)*.** Por ahora, **un solo Regalo por personaje** (con su Perjuicio si corresponde). Regla anti-min-max: **el jugador nunca elige los dos lados** — si elegís uno, el otro es aleatorio o lo pone el DM. Métodos:
- **A la suerte:** si **tirás al azar** tu Senda, Linaje y Trasfondo, se te **regala un Regalo aleatorio, sin Perjuicio** — premio por dejarlo al azar.
- **Ambos al azar:** tirás el Regalo y tirás el Perjuicio en la tabla.
- **Elegís el Regalo → el DM te asigna el Perjuicio.** Si no te convence, **rechazás** y tirás ambos al azar.
- **Elegís el Perjuicio → tirás el Regalo.** Es la vía de las **discapacidades**: podés elegir tu discapacidad, pero el beneficio que la acompaña es **aleatorio** (no se estrategiza).
- También es válido **no tomar ninguno**.

*(La tabla de Regalos/Perjuicios es el soporte de estas tiradas; ver Regla de Azar.)*

---

**Dotado (Regalo) ↔ Anti-Dotado (Perjuicio)** — *contrarios temáticos; NO obligan a tomarse juntos (canónico — Hassan 2026-06-15)*

> **Dotado** *(Regalo)*. Al crear el personaje, tirá 1d10 y sumalo a **todos** los atributos. Representa una excepcionalidad innata: el cuerpo y la mente del personaje nacieron fuera del rango ordinario. **Nota:** Este bono ignora el techo de 80, permitiendo que las estadísticas lo superen en la creación.

> **Anti-Dotado** *(Perjuicio)*. Al crear el personaje, tirá 1d10 y restalo de **todos** los atributos. El personaje nació en el extremo opuesto: cuerpo y mente que parten en desventaja estructural frente al promedio.

---

**Carismático (Regalo) ↔ Desagradable (Perjuicio)** — *contrarios temáticos; NO obligan a tomarse juntos (canónico — Hassan 2026-06-15)*

> **Carismático por Naturaleza** *(Regalo)*. +5 a todas las tiradas de **Elocuencia** y **Engaño**. Hay algo en este personaje que atrae, que convence, que desarma — no necesariamente belleza ni elocuencia formal.

> **Desagradable** *(Perjuicio)*. **DIF 1** en todas las tiradas de Elocuencia y Engaño. Además, dependiendo del lugar y del contexto, el personaje y sus compañeros pueden ser marginados socialmente por asociación. Lo desagradable no es necesariamente físico: el personaje suele ir mal vestido, la ropa se le ensucia con rapidez inexplicable, no contiene sus gases, se le puede ver sacándose los mocos o comiendo con la boca abierta.
>
> **Nota de mesa.** Se recomienda acordar antes de empezar la campaña si este par está disponible en la mesa.

---

## Regla de Azar

Si el jugador tira aleatoriamente los **tres elementos del trasfondo** (Dedicación, Nacimiento, y el par de Regalo & Perjuicio) sin elegir ninguno, recibe una **Especialización gratuita adicional** al finalizar la creación. Premia la incertidumbre sin afectar el balance de puntos.

---

## Regla de Destacado

**Binario.** Al finalizar la creación, por cada skill garantizada de la Dedicación:

- Si el valor final está **en el mínimo o por debajo**: el sistema lo sube al mínimo garantizado automáticamente.
- Si el valor final **supera el mínimo garantizado**: el personaje recibe **+5 en esa skill**.

El +5 forma parte del total sujeto al techo de 80%.

---

## Paso 6 — Compra de XP (Experiencia Inicial)

Todo personaje comienza con **1 XP** por defecto.

**Bono por Aleatoriedad Extrema (+1 XP extra):** 
Si el jugador elige generar sus atributos base tirando dados (3d4×5) y **los asigna estrictamente en el orden en el que salieron** (es decir, el primer resultado a Fuerza, el segundo a Vitalidad, y así sucesivamente), obligándose a idear el personaje de forma totalmente aleatoria, el personaje comienza el juego con **2 XP** en total en lugar de 1. 
*Filosofía:* Esto fuerza al jugador a sacar provecho de situaciones atípicas (ej. un personaje con mucha Arcana y Melee, pero poca Inteligencia y Voluntad), recompensando el rolplay adaptativo.

**Regla de Re-asignación (Mulligan):**
La única forma de arrepentirse tras comprometerse a asignar en orden es si la tirada cumple con el criterio de **extrema mala suerte**:
- **NO** tienes al menos dos atributos por encima de 40.
- **Y** tienes más de tres atributos por debajo de 20.
- **Y** ningún atributo de combate (Melee, Proyectiles, Arcana) está por encima de 40.

Si se cumplen todas estas condiciones a la vez, puedes solicitar una re-asignación. Al hacerlo, pierdes el bono de +1 XP extra (volviendo a 1 XP) y puedes optar por: ir al arreglo fijo por defecto, reasignar libremente esos mismos atributos que tiraste, o re-rolear los dados por completo.

---

*Canonizado — Hassan 2026-07-30*
