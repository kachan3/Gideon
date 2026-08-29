> **Módulo extraído literalmente de `Gideon Core.md`** (última edición 2026-07-01) en la reestructuración documental del 2026-07-02. Contenido sin modificar. El documento maestro original se conserva íntegro en `99_Archivo/Gideon Core_ORIGINAL_2026-07-01.md`.

## 13. SISTEMA DE MAGIA Y ENERGÍA

### 13.1 Stamina y Maná *(fuentes: X canoniza fórmulas; T explica la naturaleza)*

El sistema distingue **dos recursos fundamentales**.

#### Stamina *(canónico — "Vigor" está obsoleto/deprecado)*
Refleja fuerza física y resistencia del cuerpo. Se recupera mediante descanso, alimento y reposo adecuado. **Sólo se gasta en habilidades puntuales que lo requieran directamente** (ej.: Combos, ciertas habilidades de senda). No es un recurso de uso constante.

> **Stamina = Nivel de Vitalidad − (heridas graves activas)** *(NV eliminado — Hassan 2026-06-28; antes `Nivel + Nivel de Vitalidad − graves`)*
>
> *(Fórmula X a actualizar: era `G31 = SUM(D9, G2) − C20`; ahora `G31 = D9 − C20`)*

**Lectura conceptual (Hassan).** *"Cuanto más herido estás, menos energía tienes"* — cada herida grave activa reduce 1 punto de Stamina máximo, reflejando que el cuerpo dañado tiene menos reservas. *[Resuelve INCONG #29, #43, #45]*

> **Vigor deprecado.** Cualquier mención previa a "Vigor" en este documento o en fuentes (M, T) debe leerse como **Stamina**.

#### Maná (= PM, Puntos de Maná) — *fuentes: X canoniza fórmula*

Manifestación del alma: chispa interna de potencial espiritual. **Recurso limitado y no recuperable por medios convencionales.** En ciertos seres, como los Dríades, **la pérdida total de Maná implica la pérdida de la propia esencia vital**.

> **Maná Máximo = Voluntad + Nivel de Voluntad − Daño Crónico** *(NV eliminado — Hassan 2026-06-28; antes `Voluntad + (Nivel × Nivel de Voluntad) − Daño Crónico`)*
>
> *(Fórmula X a actualizar: era `G30 = SUM(C12, G2*D12, −M30)`; ahora `G30 = SUM(C12, D12, −M30)`. **Nota:** en un personaje inicial el resultado es idéntico.)*
>
> **Maná Actual = Maná Máximo − Consumido**

**Aclaración de Hassan.** Cuando un hechizo dice que cuesta "PM", se refiere a **Puntos de Maná** de este sistema (no a los antiguos "Puntos de Magia" de M).

> 🆕 **INCONG #44 (mayor).** Tres fórmulas distintas conviven en el material:
> - **M:** PM = bono Voluntad + bono Vitalidad (antes "Constitución"). Lineal y modesto.
> - **T:** Maná = Voluntad × Nivel de Voluntad × Nivel. Multiplicativo y muy generoso.
> - **X:** Maná = Voluntad + (Nivel × Nivel de Voluntad). Aditivo con un componente escalable.
>
> **Se canoniza la fórmula de X**, porque es la que la hoja de personaje calcula automáticamente. Ejemplo: Voluntad 50, Nv Voluntad 5, Nivel del personaje 1 → X = 55; T = 250.

#### Límite Seguro y Daño Crónico *(fuente: X)*

> **Límite Seguro de Maná = Nivel de Voluntad + Nivel de Vitalidad**
>
> *(Fórmula X: `K30 = D12 + D9`)*

- Mientras tu **Maná Consumido ≤ Límite Seguro**, todo está en orden.
- Si tu Maná Consumido **excede** el Límite Seguro, el exceso pasa a contarse como **Daño Crónico**, que **reduce permanentemente tu Maná Máximo** hasta ser sanado por medios mágicos/rituales.
- *(Fórmula X: `L30 = I30 > K30`; `M30 = IF(L30, I30)`)*

> Esto formaliza por qué "Maná no se recupera convencionalmente" (T): pasar el Límite Seguro significa quemar la propia esencia, no sólo cansancio.

**Recuperación del Daño Crónico** *(canónico — Hassan 2026-06-09)*. El Daño Crónico se recupera de forma natural a un ritmo de **1 punto aproximadamente cada dos meses**. Existen vías alternativas (rituales, artefactos), pero ninguna elimina el costo fundamental —solo lo acelera. La imagen canónica es la del ser destruido por su propio poder. `[ESQUELETO: rituales/artefactos específicos que aceleran la recuperación y sus costos]`

### 13.2 Mística *(fuente: T — "Mística")*

La **Mística** es algo que rodea a los conocedores de lo arcano. La conexión con las influencias mágicas altera definitivamente tu entendimiento del mundo y de los seres que lo habitan. Como consecuencia, tienes particularidades místicas.

**Las Místicas son efectos pasivos constantes:**
- Mientras estés vivo, la Mística funciona.
- Cada Mística está relacionada a una **escuela de magia**.

**Místicas conocidas (ejemplos):**

- **Sentír la pérdida** *(asociada presumiblemente a Naial — escuela de almas y emociones)*. Cuando hablas con una persona, puedes intuir con veracidad si está pasando por un duelo (pérdida de alguien cercano, objeto significativo, esperanza o ideal). También sientes un estruendo cuando una persona querida o importante para ti muere.

- **Un Mago no llega tarde** *(escuela `[ESQUELETO: ¿Cronibor? T no lo especifica]`)*. Siempre llegarás en un buen momento: cuando alguien requiere tu ayuda, cuando puedes evitar una tragedia, o quizás cuando aún hay tiempo de provocarla. En menor medida hace que los viajes posean menos complicaciones. El DM debería reducir un poco el tiempo de viaje entre lugares cuando un miembro del grupo posee esta Mística.

`[ESQUELETO: una Mística por cada una de las 6 escuelas — Ivganny, Naial, Yrgramar, Cronibor, Gelmir, Ignamor]`

### 13.3 Los Seis Flujos Arcanos *(canónico — Hassan 2026-05-18)*

**Qué es la magia en Kindremor.** La magia **no es una habilidad ajena al mundo, sino una de las energías mismas con las que el mundo físico y espiritual rige sus normas**. Los seis flujos arcanos son **aspectos del propio funcionamiento del mundo**, no áreas de estudio convencionales.

| Flujo | Aspecto del mundo que es |
|---|---|
| **Ivganny** | Mente, pensamientos, ideas |
| **Naial** | **Emocionalidad** — almas, emociones, su manifestación |
| **Cronibor** | **El flujo del tiempo** |
| **Ignamor** | **Termodinámica** — energía, calor, frío, fuego, rayo |
| **Yrgramar** | **La energía de la muerte** |
| **Gelmir** | **Las leyes físicas** del mundo material |

**Naya'il como diosa de la magia.** Al ser **la Mente del eje Mente–Cuerpo** (§1.4.0), Naya'il puede **moldear estos aspectos del mundo** — por eso es la diosa de la magia. Los **Dríades, al ser sus hijos favoritos, son seres innatamente mágicos** para términos de cualquier estándar externo: en Kindremor, **el control básico de las energías del mundo es parte de la vida diaria** de los Dríades. No es un don que requiera entrenamiento extraordinario para activarse — es **inherente a la naturaleza Dríade**.

> **Definición canónica de Magia (canon, Hassan).** Para los Dríades y para la definición operativa del mundo: **la magia es el intento de los mortales de controlar lo que no PUEDEN** — es decir, **la ambición por superar las capacidades naturales**.
>
> - Lo que un Dríade hace de manera **innata y cotidiana** (sentir, influenciar levemente, encender, percibir flujos) **no es "magia" en el sentido pleno** — es parte de su biología arcana.
> - **Magia** es cuando va **más allá** de esa línea: cuando el Dríade quiere moldear lo que su naturaleza no le permite todavía. De ahí los riesgos (Misscast, Daño Crónico), de ahí el coste, de ahí la diferencia entre un Dríade haciendo lo suyo y un mago empujando los flujos.
>
> Esto resuelve una falencia anterior (#68): **no son sólo los primigenios** los que dominan la magia. Todos los Dríades lo hacen, y la "magia" como disciplina es lo que ocurre **cuando un Dríade ambiciona superar lo que naturalmente puede**.

**Niveles de proficiencia en flujo:** Novicio (Sentir), Entrenado (Influenciar), Experto (Manipular), Maestro (Denegar), Leyenda (Alterar). *(de M; aplican como grados de cuánto puede el mortal forzar el aspecto del mundo asociado al flujo)*

#### 13.3.1 Naial — Refinamiento *(fuente: T — "Nayal Escuela de magia"; expandido Hassan 2026-08-18)*

> **No confundir con Ivganny: esto no son ilusiones, son manifestaciones de la voluntad representadas con emociones.**

La escuela de Naial se basa en el alma y en la manifestación de las emociones mediante constructos o artes. Es la escuela más diversa, pero no lo puede todo. Muchos Arcanistas, Magos y Hechiceros necesitan dominarla aunque sea parcialmente para ampliar su repertorio de hechizos.

**Ejemplos de manifestaciones por emoción:**
- **Culpa** → grilletes.
- **Ira** → proyectiles hirientes.
- **Impaciencia** → prisa.
- **Cautela** → barreras etéreas.

Naial es la escuela que más permite **variar el tipo de hechizos**.

**Diseño intencional: Naial como "la escuela más genérica" *(canónico — Hassan 2026-08-18).*** Naial es deliberadamente la escuela más amplia y cómoda. Muchos hechizos que son difíciles de ubicar temáticamente en otro flujo pueden ir aquí, porque Naial opera sobre una **evocación pura**: el lanzador siente una emoción → la emoción se manifiesta como efecto tangible en la realidad. *"Te odio → quiero dañarte → salen los virotes para manifestar tu deseo de destruir."* Los efectos de Naial son **visibles, tangibles y físicamente reales**: constructos, proyectiles, barreras, entidades. Son creaciones del alma materializadas en el mundo.

#### 13.3.2 Ivganny — Refinamiento *(canónico — Hassan 2026-08-18)*

> **Ivganny es la escuela de la manipulación invisible.**

Mientras Naial es un **output** (lo que el alma del lanzador evoca hacia afuera como manifestación tangible), Ivganny es un **input** (lo que el lanzador introduce en la mente, los sentidos y la percepción de otros).

**Ivganny no crea nada tangible ni físico.** Nada viene a golpearte, nada te atrapa, nada se materializa. Lo que cambia es **lo que percibes, lo que crees y lo que decides**. Ivganny embota los sentidos del enemigo, mueve hilos más profundos y altera la interpretación de la realidad sin alterar la realidad misma.

**Propiedad fundamental: Magia Invisible.** Los efectos de Ivganny son **invisibles por defecto** — a menos que la intención del lanzador sea hacerlos visibles (por ejemplo, una ilusión diseñada para ser vista). No hay destellos, no hay marcas arcanas, no hay evidencia externa de que se ha lanzado un conjuro. La víctima no sabe que está siendo manipulada, salvo que tenga los medios para detectar intrusión mental.

**Ejemplos de aplicación:**
- *"No soy tu enemigo, no hace falta que me ataques."* → el objetivo te percibe como aliado o neutral.
- *"Todos aquí te odian. No sabes a quién atacar. Golpea a cualquiera."* → el objetivo ataca indiscriminadamente a amigos y enemigos.
- *"No hay nada ahí."* → el objetivo no percibe un objeto, una persona o un pasaje.
- *"Te duele profundamente."* → dolor fantasma sin herida real, pero el cuerpo reacciona como si la hubiera.

**Distinción operativa con Naial:**

| | **Naial** | **Ivganny** |
|---|---|---|
| **Vector** | OUTPUT — del alma hacia la realidad | INPUT — del lanzador hacia la mente del objetivo |
| **Visibilidad** | Visible y tangible | **Invisible por defecto** |
| **Mecanismo** | Evocación pura: emoción → manifestación real | Manipulación: percepción, cognición, sentidos |
| **Daño** | Físicamente real (el proyectil existe, la barrera golpea) | No tangible (dolor fantasma, confusión, incapacitación mental) |
| **Ejemplo ofensivo** | "Te odio" → virotes de energía que te impactan | "Todos te odian" → atacas a tus propios aliados |
| **Ejemplo defensivo** | "Cautela" → barrera etérea visible | "No estoy aquí" → el enemigo no te percibe |



### 13.4 Herramientas Arcanas
Lanzar sin herramienta = pintar con los dedos. Sin herramienta: −3 NE y +5 NF (salvo Rasgo Hechicero, lanzadores natos).

**Si dominas al menos una herramienta, puedes usar todas — pero sólo obtienes los beneficios particulares de la herramienta dominada.**

- **El Arma.** Si tu herramienta es un arma: al atacar con ella, suma tu Nivel de Voluntad al daño.
- **El Libro (Fuente de Conocimiento).** Corrige fallos y pule técnica. Al lanzar, puedes optar por *con perfección* (+1 NE) o *con cuidado* (-1 NF). **Todo o Nada** *(rasgo de Fuente de Conocimiento — migrado desde §12.6, Hassan 2026-08-17)*: cuando lanzas un conjuro y fallas, puedes optar por **re-rolear** o **interrumpir el casteo**. Si interrumpes, pierdes **1 PM** pero nada más sucede. Si re-roleas, debes quedarte con el resultado final (aunque sea peor).
- **El Amuleto (Símbolo de Poder).** Cuando lanzas con el amuleto, tu fervor se ve incrementado. `[ESQUELETO: beneficio mecánico — la oración queda cortada en M]`
- `[ESQUELETO: otras herramientas — bastón, cristal, etc.]`

### 13.5 ~~Tejer~~ — Mecánica eliminada *(Hassan, 2026-05-23)*

La mecánica de **Tejer** (lanzar magia libremente con tirada en Tabla de Tejer) queda **eliminada del canon**. Sólo permanece el sistema de **Manifestar Hechizo** descrito en §13.6.

> `[ESQUELETO: si en el futuro se reintroduce algún sistema de improvisación mágica, va aquí]`

### 13.6 Manifestar Hechizo (Spellcasting v2) *(fuente: T — "Spellcasting"; reemplaza la versión de M)*

Manifestar un hechizo es el acto básico mediante el cual una criatura usa los conjuros que tenga a su disposición, sin importar el origen (repertorio personal, objeto arcano u otra fuente). Una manifestación es una instancia en la que, de forma sutil o grandilocuente, **un mortal impone una instrucción o configuración sobre el mundo y sus habitantes**.

#### 13.6.1 Coste en Acciones y Tirada

- Manifestar un hechizo requiere una acción cuyo **costo en acciones es variable**, definido por el propio conjuro.
- Si un hechizo requiere más de un turno, **todas las acciones necesarias deben invertirse antes** y la tirada de manifestación se realiza **una única vez**, al completar el último turno del proceso.
- Si en cualquier momento (dentro o fuera de tu turno) pierdes la capacidad de cumplir alguno de los requisitos del hechizo, **el proceso se interrumpe y el hechizo falla**.

#### 13.6.2 Coste en Maná, NE y Nivel de Potencia (PL)

- **Todo hechizo consume Maná al ser lanzado.**
- Si el conjuro no especifica costo propio:
  > **Coste base = 1 + Nivel de Potencia (PL)**
- El lanzador puede no usar todo el PL disponible → hechizo más débil pero menos costoso en Maná.
- **Cada hechizo pertenece a un Flujo Arcano.** Al manifestarlo, realiza una prueba de la habilidad correspondiente al flujo.
- De los **NE obtenidos** se determina el PL:
  > **PL = 1 + NE**
- Algunos hechizos requieren un mínimo de NE para ser lanzados; si no se alcanza, falla automáticamente.

#### 13.6.2bis Hechizos Multi-Flujo *(canónico — Hassan 2026-08-19)*

Un hechizo puede involucrar **uno o más Flujos Arcanos** para ser lanzado. Cuando un conjuro requiere más de un flujo, se aplican las siguientes reglas:

- **Listado de Flujos:** El hechizo lista todas las escuelas requeridas (ej.: *Cronibor + Yrgramar* para un conjuro de reanimación temporal).
- **Prerrequisito de Epifanías:** Lanzar un hechizo multi-flujo **suele requerir poseer las Epifanías correspondientes** a cada flujo listado. Sin acceso a una de las escuelas involucradas, el lanzador no puede ejecutar el conjuro.
- **Una sola tirada:** Se realiza **una única tirada de Arcana** para manifestar el hechizo. De todos los flujos listados, se emplea como valor de referencia **el flujo en el que el lanzador posea el valor más bajo**. El hechizo es tan fuerte como el eslabón más débil de la cadena.

> *Ejemplo: un hechizo de "Despertar Temporal" requiere Cronibor (tiempo) + Yrgramar (muerte). El lanzador tiene Cronibor 45 y Yrgramar 30. La tirada se hace contra **30** (el valor más bajo). Si obtiene éxito, el PL se calcula normalmente.*

#### 13.6.3 Inversión de PL

- Los PL pueden asignarse **únicamente en aspectos que el hechizo permita modificar**: daño, alcance, área, duración, número de objetivos.
- **Límite por aspecto:** no puedes invertir más PL en un mismo aspecto que tu **Nivel de Inteligencia**, salvo que el hechizo diga lo contrario.
- Algunos conjuros permiten distribuir PL entre varios parámetros; otros solo en uno específico.

#### 13.6.4 Daño Genérico (DG)

Algunos hechizos usan Daño Genérico:
> **DG = PL × Nivel de Voluntad**

#### 13.6.5 Roles de los Atributos en la Magia

- **Arcana** — Talento y afinidad del personaje con las artes mágicas.
- **Inteligencia** — Capacidad de manipular y optimizar los hechizos (control de PL por aspecto).
- **Voluntad** — Fuerza bruta e impacto final de la magia manifestada (DG).

#### 13.6.6 Componentes *(redefinidos)*

| Componente | Requisito |
|---|---|
| **Verbal** | Recitar oración o fórmula en voz alta |
| **Susurro** | Murmurar palabras apenas audibles |
| **Motrices** | Mover el cuerpo mediante posturas, gestos o danzas. Imposible si estás impedido de moverte |
| **Motrices Finos** | Posiciones precisas de los dedos; al menos una mano completamente libre. **Posible aunque estés agarrado o restringido** |
| **Materiales** | Herramienta, reliquia u objeto específico, que puede consumirse o alterarse durante el lanzamiento |

> **Componentes canónicos (Hassan).** Se usan los **5 componentes de Trello**: Verbal, Susurro, Motrices, Motrices Finos, Materiales. El sistema antiguo de M (Verbal / Somático / Material) queda obsoleto. **Verita** (idioma mágico de M) sigue siendo asumido como vehículo del componente Verbal/Susurro, aunque no está explícitamente confirmado en T. *[Resuelve INCONG #35]*

#### 13.6.7 Concentración

Algunos hechizos requieren mantener Concentración. Los hechizos con concentración tienen un **límite de tiempo**: cuando termina, el lanzador puede pagar de nuevo el Maná para sostener el efecto.

| Nivel | Detalle |
|---|---|
| **Ligera** | Estable y difícil de romper. Puede mantenerse incluso durante pérdida de conciencia. **Sólo se puede sostener una a la vez.** |
| **Demandante** | Requiere superar una prueba de **Enfoque** cada vez que el lanzador recibe daño o sufre el estado **Asustado**. Se pierde automáticamente al quedar Aturdido, Dormido o Agonizando. |
| **Exhaustiva** | Consume la totalidad de capacidad física y mental. Mantenerla requiere invertir **3 acciones por turno**. No exige pruebas de Enfoque al recibir daño, pero se pierde al quedar Incapacitado de forma similar a la Demandante. |

#### 13.6.7.bis Conflictos entre Modificaciones *(canónico — Hassan 2026-06-09)*

Cuando dos efectos de Modificación se oponen directamente —un lanzador intenta imponer una instrucción que contradice la de otro—, se resuelve con una **tirada enfrentada de Voluntad** usando las reglas estándar de tiradas enfrentadas (§11). El efecto del lanzador con mayor resultado prevalece. En caso de empate, el efecto más reciente cede.

#### 13.6.8 Misscast

Algunos hechizos pueden provocar **Misscast**: efectos adversos que se activan al fallar la tirada de manifestación, representando una canalización inestable o peligrosa de la magia. `[ESQUELETO: tabla/criterios concretos de Misscast por escuela]`

#### 13.6.9 Aprendizaje y Almacenamiento de Conjuros *(canónico — Hassan)*

**Los niveles de conjuro de M están descartados.** Ya no se emplean: el sistema prioriza algo **más flexible**, donde el PL = 1 + NE gradúa la potencia de cada lanzamiento. La tabla de "Nv Dríade → Nv Conjuro máx" y la tabla de conjuros por proficiencia de M **quedan obsoletas**.

> **Pendiente — esqueleto definido por Hassan.** Los siguientes aspectos están **en debate interno** y por ahora se dejan como **esqueleto**:
> - Qué conjuros se pueden **aprender**.
> - **Cómo** se aprenden.
> - Cómo se **almacenan** (¿libro de hechizos, memoria, repertorio fijo, intercambiable?).
> - Qué **limitaciones** tiene el repertorio (¿por escuela, por proficiencia, por nivel del personaje, por número absoluto?).
>
> `[ESQUELETO: sistema de aprendizaje/almacenamiento de conjuros — pendiente de Hassan]`

*[Resuelve INCONG #30 — se descartan las tablas de M en favor del modelo flexible Trello, con el detalle de aprendizaje aún por escribir.]*

### 13.7 Artefactos Arcanos *(fuente: T — "Artefactos Arcanos")*

Bastones, varitas y otros dispositivos arcanos son **Artefactos**, creados por los Dríades mediante técnicas secretas que requieren la **entrega de una vida** como parte esencial de su forja.

> **Por qué son tan raros y costosos** *(canónico, Hassan 2026-05-28)*. La forja de artefactos mágicos sería **incomparablemente más sencilla y accesible** si los Dríades contaran con el **Martillo de Oro de Durnn** (§1.9.1) — la reliquia del Dios Servidor que **literalmente otorga Boost de creación de artefactos mágicos** a la cultura que la posea. Pero el Martillo de Oro **fue robado**. Su ausencia explica por qué los artefactos requieren técnicas secretas, entrega de una vida y siguen siendo bienes de altísimo valor. **Recuperarlo es plot mayor** del setting (ver §1.9.1).

**Función.** Almacenan runas y encantamientos diseñados para replicar un conjuro de forma segura y constante, reduciendo los riesgos e inestabilidades de la manifestación directa. Generalmente albergan hechizos de defensa personal o utilidad, concebidos para conveniencia y protección básica de su portador.

**Cargas.**
- Cada artefacto posee un número determinado de cargas, que se consumen al activar sus conjuros.
- Las cargas se recuperan **automáticamente** tras el tiempo especificado en la descripción del objeto.
- El portador puede **transferir Maná propio al artefacto** para restaurar cargas, según la tasa de conversión indicada en el mismo.

**Uso.**
- Mientras sostengas el artefacto con una mano, puedes usar la acción común **Manifestar Hechizo** para activar los conjuros almacenados en él.
- Cada artefacto detalla:
  - Hechizo disponible.
  - Costo en cargas.
  - Límite máximo de almacenamiento.
  - Tasa de conversión Maná → cargas.
  - Tiempo de recarga natural.

**Limitaciones del PL almacenado.**
- Los hechizos lanzados desde un artefacto tienen **PL fijo**, determinado por el objeto.
- **No pueden ser modificados ni potenciados mediante inversión de NE.**
- Si el conjuro emplea Daño Genérico (DG), se calcula usando los **NE obtenidos** en la tirada + el **Nivel del Artefacto** según corresponda.

**Componentes.** Aunque el hechizo esté contenido en el artefacto, **todos sus componentes** (Verbales, Susurros, Motrices, Motrices Finos, Materiales, Concentración) deben ser aportados normalmente por el lanzador. **El artefacto almacena la configuración del conjuro, pero no sustituye la participación activa del ejecutor.**

### 13.8 ~~Fatiga Mágica~~ *(eliminada — canónico, Hassan)*

> **Eliminada.** La Fatiga Mágica de M **se elimina del sistema**. Sus funciones quedan absorbidas por:
> - **Maná + Daño Crónico** (cubre el coste y el riesgo de excederse, §13.1).
> - **Misscast** (cubre los efectos adversos por canalización fallida, §13.6.8).
> - **Stamina** (cubre el cansancio físico general, §13.1).
>
> La tabla de niveles de Fatiga Mágica (Dolor de cabeza → Cansancio → Venas Ardiendo → Exhausto → Atontamiento → Venas Reventadas → Desmayo → Muerte) queda **archivada como referencia histórica** y no aplica al canon vigente. *[Resuelve INCONG #34]*

### 13.9 Escuelas y Conjuros — Listas Iniciales

> **Nota canónica (Hassan).** Los **niveles de conjuro de M (Nv 1–5) están descartados** — ver §13.6.9. Las entradas siguientes conservan el rótulo "Nv 1" por preservación histórica, pero deben **migrarse** al sistema actual: el escalado se hace por **PL = 1 + NE** (las menciones a "Nv superiores: +Xd8 por nivel" deben reinterpretarse como "PL adicionales: +Xd8 por PL invertido en daño"). Los hechizos listados son una **muestra inicial** del antiguo M, no la lista canónica de la escuela.

`[ESQUELETO grande: por escuela falta migrar y completar lista de conjuros bajo el nuevo modelo PL. M sólo da algunos hechizos sueltos]`

#### 13.9.1 Ivganny — Conjuros Nv 1
`[ESQUELETO]`

#### 13.9.2 Naial — Conjuros Nv 1
- ~~**Coraza Arcana.**~~ *(Olvidado por Hassan 2026-05-23 — pendiente de reformulación sin CA.)*
- **Misil Arcano.** Rango: 1 criatura a 120 ft. V, S, pizca de polvo de diamante. 2 PA. Inmediato. Lanza un proyectil mágico imposible de fallar → 1d6 + bono de Voluntad.
- **Invocar Familiar.** Rango: 10 ft. V, S, M (10 gp de carbón, incienso y hierbas consumidas por fuego en un brasero de bronce). 1 hora. Invocas espíritu en forma de animal (murciélago, gato, cangrejo, sapo, halcón, lagarto, pulpo, búho, serpiente venenosa, pez, rata, cuervo, caballito de mar, araña o comadreja). Aparece en espacio desocupado a tu alcance; estadísticas del animal pero clasifica como **espíritu**, no bestia.
  - Independiente, pero obedece. No puede atacar; sí otras acciones.
  - Al recibir todas las heridas que puede soportar: desaparece. Sólo reinvocable lanzando el conjuro otra vez.
  - Puedes despedirlo a una dimensión de bolsillo y reaparecerlo en un espacio a 30 ft (acción).
  - Comunicación telepática a menos de 100 ft; ver por sus ojos como acción (te quedas ciego/sordo respecto a tus sentidos hasta el inicio de tu siguiente turno).
  - Si lanzas un hechizo de toque, el familiar puede entregarlo si está a menos de 100 ft y usa su reacción.
- `[ESQUELETO: el resto de conjuros de Naial nv 1]`

#### 13.9.3 Yrgramar — Filacteria y Ritual de Aprisionamiento
Al aprender Yrgramar obtienes conocimiento para fabricar una **filacteria** sintonizada contigo. Almacena almas. `[ESQUELETO: Capacidad numérica olvidada por Hassan 2026-05-23 — pendiente de redefinir sin usar sistema de niveles d20.]`

**Ritual de Aprisionamiento** (1/día durante descanso corto o largo): llenas tu filacteria tirando 1d100. Por cada múltiplo de 10 → 1 alma. **Si sale 90+ → alma consciente** (proporciona información y mantiene competencia en una escuela de magia o marcial). Usar esa alma para crear un no-muerto le otorga esa misma competencia.

La filacteria sólo almacena **1 alma consciente** simultánea (ocupa un espacio igual al resto). Pierde la mayoría de sus recuerdos tras 1d10 días (secreto del DM).

**Espíritus controlables.** `[ESQUELETO: Estadísticas mecánicas eliminadas por Hassan 2026-05-23 — ya no poseen CA; definir stats de evasión/dodge en formato de statblock.]` Se desvanecen al recibir herida. Umbral 5. Resistencia a daño físico no mágico. Inmunes al veneno. 1 acción y velocidad 40 ft (volando). No provocan AdO.

**Conjuros Nv 1 — Invocar Espíritu:** Rango 5 ft libre. V, S, un alma que se consume. 2 PA. Duración = Tantos minutos como tu Nivel de Éxito (NE) en la tirada de conjuro de Yrgramar. Elige:
- **Envidioso.** Muerde con tu bonificador de ataque mágico. 1d8 + bono de Voluntad de daño necrótico.
- **Fastidioso.** Asusta a una criatura (salvación de Voluntad o aterrada hasta fin de su próximo turno). Puede usar reacción para restar 1d4 a un ataque enemigo. Debe estar cuerpo a cuerpo.
- **Combativo.** Posee un arma; brilla en tono verdoso opaco, frío sepulcral. +1 ataque y daño con esa arma. Requiere invertir puntos de influencia para la posesión. `[ESQUELETO: ¿qué son los "puntos de influencia"?]`

#### 13.9.4 Cronibor — Conjuros Nv 1
- **Predicción.** Uno mismo. V, S, huesos de animal y 3 piedras de distinto color. 1 PA. Predices una tirada futura y la almacenas. Durante 1 minuto la próxima vez que se realice esa tirada, se usa el resultado predicho.
- ~~**Prisa.**~~ *(Eliminado por Hassan 2026-05-23.)*
- ~~**Letargo.**~~ *(Eliminado por Hassan 2026-05-23.)*

#### 13.9.5 Gelmir — Conjuros Nv 1
- **Tirón de Gravedad.** 60 ft. V, S. 1 acción. 1 ronda. Esfera de 10 ft de radio centrada en un punto visible: gravedad aumenta. Cada criatura dentro tira **Vitalidad** vs tu **Spellcasting**. Fallo: 2d8 fuerza, ½ velocidad hasta fin del próximo turno. Éxito: mitad de daño, sin reducción de velocidad. Hasta inicio de tu próximo turno, objetos no llevados/usados dentro requieren tirada de **Fuerza vs tu Spellcasting** para moverlos. Nv superiores: +1d8 por nivel.
- **Caída Suave.** 60 ft. V, M (pluma o plumón). 1 reacción al caer tú u otra criatura. 1 minuto. Hasta 5 criaturas en rango: descenso a 60 ft/ronda. Si aterrizan antes de que acabe, no sufren daño, aterrizan de pie.
- **Endurecimiento de Piel.** Toque. V, M (polvo de granito). 3 acciones. 1 minuto concentración. +2 armadura mágica, +1 a todos los umbrales.
- **Crear o Destruir Agua.** Transmutación nv 1. 30 ft. V, S, M (gota de agua o granos de arena). 1 acción. Instantáneo. Crear hasta 40 L de agua limpia (en contenedor abierto o como lluvia en cubo de 30 ft, extinguiendo llamas). Destruir hasta 40 L (o niebla en cubo de 30 ft). Nv superior: +40 L o +5 ft de cubo por nivel.

#### 13.9.6 Ignamor — Conjuros Nv 1
- **Lanzallamas.** Cono de 15 ft frente a ti. V, S, puñado de fósforo. 2 PA. 3 turnos de concentración. Chorro de fuego: tirada de **Agilidad** o 2d6 fuego (mitad en éxito). Mantenible 3 turnos extra como acción de turno completo (puedes moverte mitad de velocidad y cambiar dirección). Criaturas que entren o inicien turno en área rehacen tirada. Daño consecutivo: +1d6 por instancia (2d6 primera vez, 3d6 segunda, 4d6 tercera).
- **Absorción de Área** [sic; probable "Absolución de Área"]. Punto visible a 60 ft. V, S, lágrima de vidrio. 2 PA. Congela área de 30 ft de radio: tirada de **Vitalidad** o herida por frío (herida leve si éxito). Quienes fallen: velocidad 0. Si **no** usaste carga elemental para potenciar y al menos una criatura falló, **ganas una carga elemental**.
- **Rayo en Cadena.** Criatura a 30 ft. V, S, fragmento de cristal. 2 PA. Tirada de **Agilidad** o herida por rayo (leve si éxito). Si falla, las criaturas a 10 ft repiten la tirada; si hay 1+ que falla, se elige aleatoriamente a quién rebota el rayo (hasta 3 rebotes).

#### 13.9.7 Trucos
- **Misil Ígneo.** 60 ft. V, S. 2 PA. Esfera de fuego: ataque mágico → 1d10 fuego.
- **Golpe de Llamas.** Cuerpo a cuerpo. V, S, arma que sostengas. 2 PA. Enciende tu arma y golpea; si conecta, suma bono de Voluntad al daño.
- **Onda de Trueno.** 5 ft. V, S. 2 PA. Aplauso atronador (audible a 500 ft). Criaturas alrededor reciben 1d8 trueno; tirada de **Vitalidad** o desventaja en su próximo ataque.
- **Rotura Mental.** 1 criatura a 60 ft. V, S. 2 PA. Salvación de Voluntad o herida leve psíquica; resta 1d4 de su próxima salvación de Voluntad hasta el final de tu próximo turno.
- **Distracción.** `[ESQUELETO]`
- **Shock.** `[ESQUELETO]`
- **Prestidigitación.** `[ESQUELETO]`
- **Tirón de Alma.** 1 criatura a 60 ft. V, S. 2 PA. Salvación de Voluntad o herida leve necrótica; si la criatura ya tiene herida normal o grave, recibe dos heridas leves. Si la matas con este hechizo y tienes filacteria → ganas un alma.
- **Regreso.** 1 reacción. Regresas una pieza de munición o arma arrojada segundos atrás a tu mano.

### 13.10 Sacrificio Arcano *(canónico — Hassan 2026-05-25)*

> **Premisa narrativa.** El **Maná Máximo** es un recurso vital y **degradable**: cada vez que un mago se fuerza más allá del **Límite Seguro** (§13.1), las venas le arden como cables en sobretensión y el alma se le drena. El **Daño Crónico de Maná** que resulta **no se recupera por medios convencionales** (queda como `[ESQUELETO]` qué rituales lo curan, ver §13.1). Hay hechizos que **matarían al lanzador** por requerir más energía de la que su alma puede ceder sin colapsar.
>
> El **Sacrificio Arcano** es la ruta opuesta: en lugar de quemar la propia alma, el lanzador **mata a un dríade como parte del lanzamiento** y **canaliza el alma de la víctima** para que sea ella la que sostenga el conjuro. El mago no consume Maná propio; **dirige** la chispa que se libera al cortar el alma del cuerpo.

**Por qué funciona.** Conexión con §13 "la magia emana del alma" y con §1.2 (los Dríades portan fragmentos de Naya'il): un alma dríade liberada en el instante del corte ritual contiene energía arcana inmediata y aprovechable. Funciona análogamente a la forja de **Artefactos Arcanos** (§13.7) — "una vida como parte esencial" — pero el resultado es **un único conjuro de alta potencia**, no un objeto recargable.

**Quién la practica.**
- **Magos pragmáticos e inescrupulosos** que no quieren deteriorar su alma para preparar conjuros poderosos.
- **Estructuras estatales** que la institucionalizan para defensa colectiva (ver §4.1.1 Aurelia y §4.2 Pircar — "combustible" criminal/prisionero; ver §5.15 Los Corderos para la casta institucional de Pircar).
- **Villanos** que escalan su poder matando más para potenciar conjuros mayores.
- **PCs**: ruta de gameplay viable pero con costo moral y político en las facciones del Honor (§5.14 Los Leones), Hierofantes (§12.5) y Peregrinos (§5.3).

**Regla general (versión inicial — pendiente de tuning).**
- **Acción:** el sacrificio es parte indivisible del lanzamiento — se ejecuta el ritual sobre la víctima (atada, contenida o ya derrotada) durante un tiempo de canalización mayor al de un conjuro común (`[ESQUELETO: tiempo concreto; sugerencia inicial: 3 turnos completos para el primer nivel de maestría]`).
- **Efecto base:** el conjuro lanzado se considera como si el mago hubiera invertido en él **una cantidad de Maná igual al Maná Máximo de la víctima** (no el actual — el conjuro consume todo lo que el alma podía portar). El **PL efectivo** se calcula contra ese Maná donado, no contra el del lanzador.
- **El lanzador no paga Maná propio**, pero **debe superar una tirada de canalización** (Spellcasting) — un fallo no devuelve la vida y produce **Misscast** sobre el lanzador (§13.6.8).

**Niveles de Maestría** `[ESQUELETO grande — pendiente de detalle Hassan]`:
- **Iniciado.** Puede sacrificar 1 dríade por ritual. Bonificadores básicos. Requiere víctima inmóvil y consciente o ya derrotada.
- **Adepto.** Puede sacrificar 1 dríade y obtener un rendimiento aumentado (la energía donada se multiplica por un factor de proficiencia). `[ESQUELETO: factor exacto]`
- **Maestro.** Puede encadenar sacrificios — varios dríades en un mismo ritual aportan su Maná Máximo al pool del conjuro. `[ESQUELETO: cuántos, qué penalidades por contención]`
- **Hierático.** *(Ruta de villano de alto nivel; lazo narrativo con los Dracomantes Hieráticos §3.5, que "arrasan poblados enteros para conjurar los más poderosos hechizos".)* Puede sacrificar **masas** (decenas o cientos de almas) en rituales prolongados que doblegan la realidad. `[ESQUELETO: requisitos de templo/altar, tiempo, consecuencias planares]`

**Consentimiento — no es requisito mecánico ni ético del sistema.** *(Canónico, Hassan 2026-05-25.)*
- El Sacrificio Arcano funciona sobre la víctima **consienta o no**.
- **Los Corderos (§5.15) suelen "querer"** ser sacrificados porque están **adoctrinados desde el nacimiento** para verlo como su destino y honor — pero no es necesario que quieran, y un Cordero reticente igual sería sacrificado válidamente.
- **Cualquier dríade puede ofrecerse voluntariamente** sin pertenecer a la casta — donación adulta autónoma. El rito funciona idéntico.
- **Víctimas no consentidas** (prisioneros, criminales condenados, enemigos capturados, sacrificados por la fuerza) funcionan también: el sistema no distingue. Es práctica aureliana ininterrumpida (§4.1.1).

**Pureza es simbólica, no mecánica.** *(Canónico, Hassan 2026-05-25.)* Un Cordero **no rinde más arcanamente** que otro dríade común. La ascética total del Sancta Sanctorum (§5.15) **no produce ventaja mecánica** sobre el ritual. La justificación popular y teológica es ética y simbólica: *al no estar vinculados al mundo por nada, no hay pérdida ni dolor en su partir*. La sociedad acepta el sacrificio porque la víctima "no perdió nada al irse" — no porque la magia rinda mejor.

**Consecuencias y costo no-mecánico.**
- **Cuerpo Impago vs Cuerpo Puro (§3.4 / §10.3).** El alma de un dríade con **Cuerpo Puro** (pagado por Naya'il) podría resistir el ritual o requerir una variante distinta — `[ESQUELETO: ¿el Cuerpo Puro inmuniza a la canalización, o sólo a la magia de sangre? Hassan a definir]`.
- **Reputación con planos exteriores.** Los Celestiales del Bien Mayor (§1.4.2) tratan a los practicantes habituales como **enemigos prioritarios**. Los Daemonis (§1.4.3) los ven como **proveedores útiles** — un Sacrificador Arcano frecuente atrae presencia daemónica.
- **Almas dríades son "especialmente jugosas" (§1.4.3).** Esto explica por qué la ruta es viable: el rendimiento por víctima es superior al sacrificio de otras criaturas. `[ESQUELETO: ¿se puede sacrificar hombres lagarto, animales? Probablemente sí pero con factor reducido — pendiente]`

**Marco institucional vigente (canónico):**
- **Aurelia (§4.1.1):** criminales, prisioneros de guerra y otros indeseables son consumidos como **combustible** para alimentar las defensas mágicas de la ciudad (muros de calor letal, Heliolita). Práctica continua, regulada por la Guardia Dorada.
- **Pircar (§4.2):** el sistema de **Los Corderos** (§5.15) institucionalizó la donación voluntaria/social tras el **Alzamiento de los Cherax** (§0.1).

> **Falencia lógica abierta (Hassan a resolver):**
> - ¿Cuál es la **relación numérica** entre Maná Máximo donado y PL alcanzable? Sin definir, la ruta es libremente abusable.
> - ¿Hay un **techo** al nivel de conjuro alcanzable por sacrificio (para que un Hierático no rompa el balance de campaña con un solo ritual)?

`[ESQUELETO mecánico mayor — Hassan: ratificar números, tiempos, techos y umbrales de maestría]`

---
