# Carga y transporte

Primera versión de Hassan, actualizada el 2026-11-17.

## Peso personal

Cada personaje debe conocer y registrar su **peso personal** en la hoja. Los aventureros están acostumbrados a sostener y desplazar su propio peso natural y pueden actuar normalmente con él. El peso corporal propio no se suma al equipo para determinar la carga transportada.

Cuando otra criatura transporta al personaje, debe contar su **peso personal más el peso del equipo que lleva**.

El peso personal se calcula durante la **creación del personaje**, utilizando los valores completos de Fuerza y Vitalidad:

**Peso personal (kg) = promedio de Fuerza y Vitalidad × Escalado Vital del linaje**, redondeado hacia abajo al múltiplo de **5 kg**.

En fórmula: `5 × floor(((Fuerza + Vitalidad) / 2 × Escalado Vital) / 5)`.

Por ejemplo, Fuerza 30, Vitalidad 40 y Escalado Vital 2,5 dan 87,5 kg antes del redondeo: el peso personal es **85 kg**.

Se recomienda recalcular el peso personal cuando el Entrenamiento aumente **Fuerza o Vitalidad**.

**Requisito para el Companion:** calcular el peso personal automáticamente en la creación y actualizarlo automáticamente cuando el Entrenamiento aumente Fuerza o Vitalidad.

## Equipo cómodo

El equipo que un personaje puede llevar cómodamente comprende:

- Su armadura.
- Tres armas, contando el escudo entre esos tres espacios. Solo una puede ser a dos manos.
- Un carcaj de hasta 20 flechas o seis armas arrojadizas, como hachuelas, dagas o jabalinas.
- Una alforja con tres espacios genéricos para equipo a mano y de acceso rápido. Como simplificación, cada espacio de herramienta suele pesar 2 kg.

Los límites de peso se calculan con el **valor completo de la skill Carga**, en kg. El **peso cómodo** equivale a la mitad de ese valor. El peso del equipo y estos límites se registran en la hoja.

Por ejemplo, con Carga 60, el peso cómodo es 30 kg, el máximo en Encumbered es 60 kg y el máximo en Carga Dedicada es 120 kg.

## Mochila y exceso de equipo

El equipo adicional se transporta en una **mochila**, llevada en una mano o a la espalda. Luchar cargando una mochila hace perder una acción.

## Incómodo

El personaje está **Incómodo** si supera los espacios de equipo disponibles **o** su peso cómodo. Toda acción física es **Complicada**. Su velocidad se reduce en **un cuarto de su valor habitual, redondeando esa reducción hacia arriba**. Por ejemplo, una velocidad de 6 se reduce en 2 y queda en 4.

## Encumbered

Al alcanzar un peso transportado igual al **valor completo de su skill Carga, en kg**, el personaje está **Encumbered**:

- Se mueve a la mitad de su velocidad.
- Toda acción física es **Difícil**.
- Pierde una acción.
- Recibe el doble de daño por caída.
- No puede nadar ni volar, a discreción del DM.

Su carga máxima en este estado es el **valor de su skill Carga en kg**. **Encumbered reemplaza a Incómodo**: se aplican las penalizaciones de Encumbered en lugar de las de Incómodo.

La pérdida de una acción por Encumbered se acumula con la de combatir cargando una mochila: un personaje en ambas condiciones pierde **dos acciones**.

## Carga Dedicada

El personaje se coloca en posición y dedica toda su atención a transportar objetos o criaturas extremadamente pesados. Para comenzar debe completar con éxito la acción [Levantar objeto voluminoso](Acciones_Genericas.md#levantar-objeto-voluminoso).

Puede transportar **tantos objetos o criaturas pesados como manos libres tenga para sostenerlos**, siempre que su peso total, sumado al de su equipo, no supere **el doble del valor de su skill Carga, en kg**. Cada objeto o criatura transportado ocupa una de esas manos. Por ejemplo, un bárbaro con dos manos libres puede cargar a dos magos con sus túnicas y bastones si el peso conjunto está dentro de su límite.

La criatura dedica todo su cuerpo a mover la carga. Esta modalidad permite concentrarse en transportar un peso voluminoso, incluido el rescate de una criatura en una situación extrema. Las acciones y maniobras disponibles son:

- **Moverse** a toda su velocidad, por **1 PA**.
- **Tirarse al piso** con su coste habitual.
- **Levantarse** con su coste habitual, si supera una tirada de **Carga**.
- **[¡A CUBIERTO!](Reacciones_Defensivas.md)** con una tirada de **Agilidad (Evasión) Difícil (−20)** y los requisitos habituales de la maniobra.

Si al comenzar Carga Dedicada la criatura no estaba **Incómoda ni Encumbered**, el peso adicional de la Carga Dedicada no activa ninguno de esos estados mientras mantenga la modalidad. Si ya estaba en cualquiera de ellos, el peso adicional se evalúa según las reglas de carga habituales. Se conservan los efectos del estado que corresponda, con dos excepciones propias de Carga Dedicada: puede usar Moverse a toda su velocidad y no pierde la acción de Encumbered.

En cada turno, la primera acción de Moverse no tiene coste de Stamina. **Cada acción de Moverse posterior a la primera cuesta 1 Stamina adicional**.

## Arrastrar y empujar

Las reglas de esta acción se encuentran en [Acciones Genéricas](Acciones_Genericas.md#arrastrar-y-empujar).

## Ubicaciones de equipo en el Companion

Cada objeto debe tener una ubicación asignada. Se distinguen las manos principal y secundaria, armadura, los tres espacios de armas contando escudos, tres espacios de alforja, carcaj, mochila, piso, campamento y un destinatario externo (compañero, mula o asistente).

Las manos cuentan dentro del límite de tres armas de acceso; una sola puede ser a dos manos. El arma a dos manos reserva ambas manos. El carcaj admite hasta veinte flechas o seis armas arrojadizas. La armadura solo aplica su protección cuando ocupa su espacio y las armas solo habilitan ataques equipados cuando están en las manos.

El peso de los objetos en espacios de acceso, manos, armadura, alforja, carcaj y mochila se suma a la carga. Piso, campamento y destinatario externo no suman a la carga personal. Los objetos pendientes de ubicación no conceden beneficios.

Cuando hay objetos en la mochila, el personaje cuenta como cargando mochila. Puede soltar su contenido al piso desde el inventario. La pérdida de una acción en combate se suma a la de Encumbered. La interfaz calcula y muestra peso cómodo, estado, movimiento y acciones perdidas.

La opción de destinatario externo registra la ubicación y el nombre del receptor. La integración con inventarios de otros personajes o criaturas queda como placeholder.