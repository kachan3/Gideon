> **Módulo canónico** — Senda del Hierofante. Creado el 2026-10-22 como desarrollo completo de §12.5.

# Dogmas del Bien Mayor — Hierofante (V1)

Al ingresar a la Senda del Hierofante y elegir el bando del **Bien Supremo**, el personaje escoge uno de los tres Dogmas iniciales de Demesteria. Este dogma define su orientación espiritual, su **Plegaria pasiva**, sus dos **Intervenciones iniciales** y su **Milagro supremo**.

---

## 1. Dogma del Amor Incondicional

> *"El Amor no calcula el coste ni teme el sacrificio; es el escudo que se interpone entre la herida y la vida."*

Enfocado en la preservación vital, la curación milagrosa y la prevención de daños letales.

### A. Plegaria Diaria — Viaje Seguro
* **Activación:** Chequeo matutino de **Fe** al concluir un descanso largo.
* **Efecto:** Otorga un umbral de protección preventiva igual a **$1 + \text{NE}$** (o **$0$** en caso de fallo, manteniéndose ese resultado durante toda la jornada).
* **Mecánica:** Durante el día, la **próxima instancia de daño que supere dicho umbral es completamente ignorada** (*«una suerte celestial evitó que sufrieras daño»*).
* *Filosofía de diseño:* Al activarse solo con daños que superen el umbral, un NE alto evita que la protección se desperdicie en rasguños menores (chip damage), reservando la salvación para impactos demoledores.

### B. Intervenciones (Coste fijo: 2 PM)

1. **Curar Heridas Menores:**
   * **Coste de Acciones:** **2 Acciones**. Toque a un objetivo.
   * **Tirada:** Chequeo de **Fe**.
   * **Efecto:** Restaura tantos puntos de heridas como **$\text{NE} + \text{Voluntad}$**. Si el total restaurado **supera el Umbral Grave** del objetivo, además **cierra una herida grave**.

2. **Proteger al Compañero:**
   * **Coste de Acciones:** **1 Reacción**.
   * **Gatillo:** Cuando un aliado a **6 unidades** o menos esté a punto de sufrir daño.
   * **Tirada:** Chequeo de **Fe**.
   * **Efecto:** Reduce el daño que sufriría el aliado en una cantidad igual al **$\text{NE}$** obtenido en la tirada.

### C. Milagro (Coste fijo: 5 PM + 1 Punto de [Omen](../../10_Reglas/Inspiracion_y_Omen.md) — 3 Acciones)
* **Restablecimiento Grupal:**
  * **Efecto:** Manifiesta una ola expansiva de compasión celestial. Aplica el efecto de *Curar Heridas Menores* ($\text{NE} + \text{Voluntad}$ y cierre de herida grave si supera umbral grave) a **todas las unidades aliadas situadas a 6 unidades o menos** del Hierofante de forma simultánea.

---

## 2. Dogma de la Justicia

> *"El Bien no puede ser pasivo ante el mal; un bondadoso débil solamente espera a que los villanos tengan piedad."*

Los Hierofantes de la Justicia son la **mano armada de Demesteria**. Operan bajo la convicción de que la auténtica protección consiste en erradicar la maldad antes de que tenga la oportunidad de golpear.

### Mecánica Clave: *Faithblow* (Golpe de Fe)
* **Efecto:** Suma el **Nivel/Valor de Fe** al daño de un ataque exitoso, manteniendo el mismo tipo de daño del ataque original.
* **Otorgamiento a Aliados:** Si un aliado recibe usos de Faithblow procedentes del Hierofante, **utiliza el valor de Fe del Hierofante** que se lo otorgó.
* **Veto Celestial:** El DM puede anular o vetar el daño extra de Faithblow si el ataque se dirige contra una criatura inocente.

### A. Plegaria Diaria — Oración de los Cruzados
* **Activación:** Chequeo matutino de **Fe** frente a la congregación.
* **Efecto:** Todas las criaturas aliadas congregadas para escuchar la oración obtienen tantos usos individuales de **Faithblow** durante el día como **$1 + \text{NE}$** obtenido en la tirada. Cada aliado decide individualmente en qué momento del día descarga sus usos.

### B. Intervenciones (Coste fijo: 2 PM)

1. **Juicio Divino (*Divine Trial*):**
   * **Coste de Acciones:** **2 Acciones**. Chequeo de **Fe**.
   * **Objetivo:** Designa al menos una criatura objetivo visible.
   * **Condición Sagrada:** Si la criatura está dañando al prójimo de forma injustificada o si neutralizarla hace del mundo un lugar más seguro, obtienes tantos usos de **Faithblow contra ese objetivo** como **$\text{NE} + 2$**.
   * **Resolución:** Al finalizar el combate habiendo incapacitado o abatido a todos los objetivos enjuiciados, el Hierofante **recupera heridas iguales a $\text{NE} \times 2$** (mínimo 2 heridas) y **restaura 1 Punto de Maná**.
   * *Riesgo Moral:* Si una sola de las criaturas elegidas al abrir el juicio resulta ser inocente, **la intervención fracasa por completo**.

2. **Juicio Pesado (*Heavy Judgment*):**
   * **Coste de Acciones:** **2 Acciones**. Rango visual / voz audible.
   * **Narrativa:** Vociferas un reproche reverberante e incontestable sobre los actos indignos cometidos por el transgresor. El mensaje trasciende dialectos y convicciones personales.
   * **Tirada:** Tirada enfrentada de **Fe (Hierofante) vs. Voluntad o Carácter (Objetivo)**.
   * **Efecto:** Resta los NE del defensor a los del Hierofante. Si quedan NE a favor del Hierofante, el transgresor sufre tantos **contadores de aturdimiento (*Stun*)** como **$\text{NE}$ neto restante** (mínimo 1 contador en éxito).

### C. Milagro (Coste fijo: 5 PM + 1 Punto de [Omen](../../10_Reglas/Inspiracion_y_Omen.md) — 3 Acciones)
* **Favor del Juez:**
  * **Narrativa:** *"Imploras a los cielos que una gran injusticia está por cometerse y suplicas que se incline la balanza a tu favor."*
  * **Tirada:** Chequeo de **Fe**.
  * **Efecto:** Obtienes un pozo de **Tokens de Favor** igual a **$\text{NE} + 2$**, utilizables durante el encuentro para activar libremente:
    * **Castigo Radiante:** Inflige $\text{Nv. Fe} + 5$ de daño radiante a un objetivo a 12 unidades o menos.
    * **Bendición Bélica:** Concede **3 usos de Faithblow** a una criatura aliada.
    * **Escudo de Rectitud:** Otorga $\text{Nv. Fe} + 3$ Puntos de Golpe Temporales a un objetivo a 12 unidades o menos.
    * **Preservación Vital:** Estabiliza instantáneamente a una criatura moribunda.

*(Nota de grado avanzado: La intervención **Mano del Juez / Hand of the Judge** —invocar una mano colosal desde un portal para golpear con $5 + \text{NE} + \text{NV}$ y derribar, empujar o apresar— queda reservada como dote de nivel superior).*

---

## 3. Dogma de la Libertad

> *"Ningún tirano, ningún juramento injusto ni los propios hierros del mundo tienen derecho a retener a un alma nacida bajo la luz de Demesteria."*

Enfocado en romper cadenas, frustrar el control de masas enemigo, reposicionar a la party y desbaratar asedios opresivos.

### A. Plegaria Diaria — Paso sin Grilletes (*Unchained Path*)
* **Activación:** Chequeo matutino de **Fe**.
* **Efecto:** Todas las criaturas congregadas reciben una bendición de ingravidez que otorga **+2 unidades a su velocidad de movimiento base** durante toda la jornada.

### B. Intervenciones (Coste fijo: 2 PM)

1. **Cadenas Rotas (*Shatter Bonds*):**
   * **Coste de Acciones:** **2 Acciones** (o **1 Reacción** si el Hierofante es la víctima del efecto). Toque o hasta 6 unidades.
   * **Tirada:** Chequeo de **Fe**.
   * **Efecto:** Remueve instantáneamente estados de **Apresamiento (*Grapple*)**, **Inmovilización**, **Ralentización** o **Contadores de Aturdimiento** en el objetivo, hasta un total de efectos o contadores igual a tu **$\text{NE}$**.
   * **Impacto Material:** Si el objetivo estaba sujeto con cuerdas, cadenas o grilletes no mágicos, estos estallan o se desanudan de inmediato.

2. **Grito de Emancipación (*Shout of Defiance*):**
   * **Coste de Acciones:** **1 Reacción**.
   * **Gatillo:** Cuando un aliado a 6 unidades o menos queda rodeado por 2 o más enemigos, o sufre una herida grave / impacto crítico.
   * **Tirada:** Chequeo de **Fe**.
   * **Efecto:** Emites un pulso eólico y luminoso. Todos los enemigos adyacentes al aliado son **empujados 2 unidades hacia atrás**, y el aliado puede **desplazarse de inmediato hasta la mitad de su velocidad** como acción gratuita sin provocar reacciones ni ataques de oportunidad.

### C. Milagro (Coste fijo: 5 PM + 1 Punto de [Omen](../../10_Reglas/Inspiracion_y_Omen.md) — 3 Acciones)
* **El Gran Éxodo (*The Great Exodus*):**
  * **Narrativa:** *"Ni cadenas de hierro, ni ejércitos de tiranos, ni la propia gravedad pueden contener la voluntad de quien camina con Demesteria."*
  * **Tirada:** Chequeo de **Fe**.
  * **Efecto:** Una ráfaga cósmica estalla en un radio de **8 unidades** alrededor del Hierofante:
    1. **Purga Colectiva:** Todos los aliados en el área quedan libres de cualquier estado de inmovilización, aturdimiento, ralentización o apresamiento.
    2. **Ruptura de Barreras:** Todas las puertas, barrotes, cadenas, cerrojos y jaulas no mágicas (y mágicas de rango inferior a la Fe del Hierofante) en el área **se abren de par en par o estallan en astillas**.
    3. **Viento Favorable:** Durante toda la ronda actual, todos los aliados en el área **duplican su velocidad de movimiento** y son **inmunes a ataques de oportunidad y reacciones enemigas** mientras se desplazan.

---

### Opciones de Grados Superiores / Dotes Avanzados (Dogma de la Libertad)

Quedan formalizadas para expansiones y progresión con XP:
* **Intervención — Paso Efímero (*Frictionless Step*):** (1 Acción, 2 PM). Ignora terreno difícil, trampas de presión y permite atravesar enemigos sin colisión. Desbalancea o derriba al pasar si $\text{NE} \ge 2$.
* **Intervención — Desacato Celestial (*Contempt of Authority*):** (2 Acciones, 2 PM). Rompe dominaciones mentales, órdenes imperiosas y anula auras de mando enemigas durante $\text{NE}$ turnos.
* **Milagro — Vuelo del Desatado (*The Unbound*):** (3 Acciones, 5 PM + 1 [Omen](../../10_Reglas/Inspiracion_y_Omen.md)). Vuelo pleno durante $\text{NE} + 1$ turnos, inmunidad a presas y reacción de teletransporte evasivo que mitiga $\text{Fe} + 5$ de daño.
* **Milagro — Baluarte del Refugiado (*Sanctuary of the Free*):** (3 Acciones, 5 PM + 1 [Omen](../../10_Reglas/Inspiracion_y_Omen.md)). Área consagrada de 6 unidades; enemigos deben superar Voluntad vs Fe para entrar; aliados son inmunes a derribo y aturdimiento, y no pueden morir (quedan estabilizados automáticamente).
