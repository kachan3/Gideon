> **Módulo extraído literalmente de `Gideon Core.md`** (última edición 2026-07-01) en la reestructuración documental del 2026-07-02. Contenido sin modificar. El documento maestro original se conserva íntegro en `99_Archivo/Gideon Core_ORIGINAL_2026-07-01.md`.

## 11. NÚCLEO DEL SISTEMA DE JUEGO (1d100)

### 11.1 Sistema de 1d100 — Fundamento *(canónico — ratificado por Hassan)*

**El sistema es 00–99, no 1–100.** El d100 se simula con dos d10: uno para decenas (0–9, leído como 00, 10, 20…, 90), otro para unidades (0–9). El rango total de resultados es **00, 01, 02… 98, 99** (100 valores discretos).

**Resolución.** Tirada vs valor de habilidad: igual o menor → éxito; mayor → fallo.

**Bandas automáticas *(canon C-7 + D-1/D-6; aclaración final de Hassan 2026-07-03)*:**
- **00–05 → Éxito Automático** (éxito sin importar el Valor).
- **95–99 → Fallo Automático** (fallo sin importar el Valor).
- La banda **no trae ninguna mecánica adicional**: solo fija el éxito o el fallo. El NE/NF se calcula **normal** (decenas/unidades): 04 → éxito, NE 0 · 97 → fallo, NF 7.
- **La capicúa opera igual que en cualquier otro caso** — banda y capicúa son **capas independientes** *(aclarado por Hassan 2026-07-03)*: **00** = éxito automático **y capicúa → Portento (NE 10)**; **99** = fallo automático **y capicúa → Pifia (NF 10)**.
- **Alcance (D-6):** aplican **solo** a **chequeos de habilidad, tiradas de ataque y tiradas enfrentadas**. **No** aplican a Tiradas de Mejora, iniciativa, creación de personaje, Nacimiento (1d100) ni a ningún otro subsistema salvo que se declare explícitamente.

**Casos especiales en los extremos (canónicos):**
- **00 → Éxito Automático + Portento.** 00 cae en la banda 00–05 (éxito automático) y es capicúa → **Portento (NE 10)**. *(Vigente — confirmado por Hassan 2026-07-03; la lectura transitoria "NE 0" queda descartada.)*
- **99 → se resuelve por la regla general; su criticidad viene de la capicúa, no de ser el máximo.** *(canónico — Hassan 2026-06-03: "ignora la regla de máximos, esto es por capicúa")* ~~No existe regla de fallo automático por valor máximo.~~ **SUPERADO (C-7, Hassan 2026-07-03): 99 cae dentro de la banda 95–99 → Fallo Automático; y al ser capicúa es además Pifia (NF 10) — confirmado por Hassan 2026-07-03.** Si 99 > habilidad → fallo, y al ser capicúa → **Fallo Crítico (NF 10)**. Con habilidad ≥ 99 sería éxito capicúa → Crítico de Éxito (NE 10). *[ESQUELETO resuelto]*

**Niveles de Éxito y Fallo (NE/NF):**
- **NE** = dígito de **decenas** de la tirada (si fue éxito).
- **NF** = dígito de **unidades** de la tirada (si fue fallo).
- NE modificado bajo 0 → la tirada se convierte en fallo (base 0 + modificadores).
- NF modificado bajo 0 → la tirada se convierte en éxito (base 0 + modificadores).

**Dificultad y Contrarreste:**
- **Dificultad** — Valor que el NE debe igualar o superar para tener éxito.
- **Contrarreste** — Resta directamente niveles de éxito.

**Críticos (capicúa).**
- Tirada **capicúa** (ambos dados con mismo valor: 00, 11, 22, 33, 44, 55, 66, 77, 88, 99) → **crítico**.
- **Crítico de éxito** → NE 10 (si la tirada fue éxito o si es 00, que siempre lo es).
- **Crítico de fallo** → NF 10 (si la tirada fue fallo).
- Ejemplo: tirada 33 con habilidad 65 → **Portento** (éxito capicúa) con NE 10. Tirada 00 → **Éxito Automático (banda) + Portento (capicúa, NE 10)**. Tirada 99 → **Fallo Automático (banda) + Pifia (capicúa, NF 10)**. *(Vigencia confirmada por Hassan 2026-07-03 — banda y capicúa son capas independientes.)* *[Resuelve INCONG #28]*

> **✅ Aclaración final (Hassan 2026-07-03):** la capicúa opera **en todos los casos**, también dentro de las bandas — la banda fija el éxito/fallo, la capicúa fija el crítico. **Portento** (capicúa en éxito → NE 10) y **Pifia** (capicúa en fallo → NF 10) quedan como **nombres canónicos** del crítico por capicúa; "Crítico de Éxito/Fallo" es alias.

### 11.1.bis Rango (Tier) *(canónico — Hassan 2026-06-03)*

**Qué es.** Valor extra que acompaña a los stats. Escala **lineal e infinita**, pero el rango normal del juego es **−2 a +3**. Cualquier atributo puede rankearse; los más comunes son **Fuerza y Vitalidad**. Su función: que en una misma tirada de d100 convivan desde hormigas hasta seres capaces de dañar una montaña de un puñetazo, con grados de interacción reales entre ellos.

**Escala de referencia** *(ejemplos en Fuerza / Vitalidad / Inteligencia)*:

| Tier | Ejemplos |
|---|---|
| −2 | Hormigas, insectos |
| −1 | Ratones, pájaros, animales pequeños |
| **0** | **Dríades**, perros, alces, osos — criaturas medianas |
| +1 | Elefantes, Jottus, toros |
| +2 | Bestias colosales, dragones jóvenes |
| +3 | Dragones adultos |

**Regla de interacción.** Cuando una tirada **falla**, igualmente cuenta como **éxito contra un tier inferior**; el **NE se determina igual** (dígito de decenas). Es decir: el resultado de un mismo d100 se *lee distinto* según el tier del oponente — no hay tiradas separadas.

**Ventaja de tier *(canon D-3 — aprobado por Hassan 2026-07-03)*:** en enfrentamientos contra un tier inferior, el tier superior **suma +8 NE** a su resultado. *(Reemplaza las variantes previas: "piso de NE 8" del borrador del motor y "+10/+5" del Simulador — ambas obsoletas; el Simulador fue actualizado a +8.)*

**Daño por diferencia de tier.** Al golpear a una criatura con **tier de Vitalidad menor**, se suma **+10 de daño plano por cada 1 de diferencia**.

**Filosofía de diseño (canónica).** Gideon es **Fantasía Heroica, no Super-Heroica**. A diferencia de D&D/Pathfinder — donde un PC nivel 20 puede hacerle shove a una Tarrasca — aquí la brecha entre tiers es real y no se cierra con niveles de personaje.

`[ESQUELETO: ¿el "fallo = éxito vs tier inferior" escala por pasos con diferencias ≥2 (p.ej. fallo vs +0 = éxito vs −1, ¿y vs −2?)? ]`
`[ESQUELETO: el +10 de daño plano — ¿se compara tier de Vitalidad del atacante vs Vitalidad del defensor, o Fuerza del atacante vs Vitalidad del defensor?]`
`[ESQUELETO: ¿penalización inversa al atacar/competir contra un tier superior, o el efecto es solo asimétrico hacia abajo?]`

### 11.2 Atributos y Habilidades *(fuente: T — "Atributos iniciales y mejoras")*

Cada habilidad tiene valor 1–100. **Nivel de Habilidad** = valor / 10 redondeado para abajo.

**Los 10 atributos del sistema se dividen en dos categorías:**

**Atributos Normales:**
- **Fuerza**
- **Vitalidad**
- **Agilidad**
- **Instinto**
- **Voluntad**
- **Inteligencia**
- **Carácter**

**Atributos de Combate:**
- **Melee**
- **Proyectiles**
- **Arcana**

> **Esto resuelve la antigua [INCONG: 18].** Instinto e Inteligencia son atributos oficiales, no aliases. Hay 10 atributos, no 8.

**Habilidades hijas.** Todas comienzan **con el mismo valor que su atributo padre**.

| Atributo padre | Habilidades hijas |
|---|---|
| Melee | Una mano, A dos manos, Armas Dobles, Bloqueo, Paradas, Desarmado |
| Proyectiles | Arcos, Ballestas, Armas de fuego, Asedio, Arrojar |
| Arcana | Yrgrammar, Naial, Cronibor, Ivganny, Ignamor, Gelmir |
| Fuerza | Carga, Escalar, Saltar, Firmeza, Atletismo |
| Agilidad | Sigilo, Acrobacias, Prestidigitacion, Evasion, Montar |
| Vitalidad | Cardio, Resistir, Metabolismo |
| Voluntad | Tenacidad, Coraje, Enfoque, Fe, Templanza |
| Carácter | Elocuencia, Liderazgo, Coaccion, Engañar, Entretener |
| Instinto | Percepcion, Detectar Intenciones, Orientacion, Adaptación, Manejo Animal |
| Inteligencia | Historia, Medicina, Naturaleza, Mecanica, Fisica, Quimica, C. Magico |

> **Habilidades personalizadas por el DM.** Cualquier atributo puede recibir habilidades hijas adicionales a criterio del DM según el mundo o la campaña. No hay un atributo más extensible que otro: un DM puede añadir "Malabares" a Agilidad, "Herrería" a Fuerza, "Bibliotecario" a Inteligencia, o cualquier competencia que el setting requiera. Estas habilidades operan con las mismas reglas de mejora que las canónicas.

> **Nota de actualización.** Tabla canonizada en sesión 2026-06-14. Cambios respecto a versiones anteriores: Levantar+Cargar → Carga; Someter eliminada (absorbida por Atletismo); Supervivencia → Adaptación; Evadir → Evasion; Yrgramar → Yrgrammar; Valor/Determinación/Resistir Influencia → Coraje/Tenacidad/Enfoque; Negociación/Intimidación → Coaccion/Engañar; añadidas Montar (Agilidad), Templanza (Voluntad), Manejo Animal (Instinto), Resistir (Vitalidad), Elocuencia/Entretener (Carácter).

**Descripción de atributos y habilidades hijas** *(canonizado — Hassan 2026-06-14)*

**FUERZA** — Capacidad bruta del cuerpo para ejercer fuerza sobre el mundo. Cuando una acción requiere poder sin técnica —sostener una viga que cede, empujar una puerta que ya está cediendo— se tira Fuerza directamente.

| Habilidad | Descripción |
|---|---|
| Carga | Levantar, arrastrar o transportar peso en esfuerzo sostenido o puntual. |
| Escalar | Trepar superficies verticales o inclinadas. |
| Saltar | Saltos de longitud, altura o precisión, con o sin carrerilla. |
| Firmeza | Resistir ser desplazado, derribado o empujado. Mantener posición bajo presión externa. |
| Atletismo | Uso eficiente y técnico del cuerpo bajo demanda física: sprints, lanzamientos, natación, control o sometimiento de otro cuerpo. Cuando el objetivo puede resistir, se resuelve como tirada enfrentada. |

**VITALIDAD** — Resistencia del organismo como máquina. Cuánto puede exigírsele al cuerpo antes de que ceda.

| Habilidad | Descripción |
|---|---|
| Cardio | Capacidad cardiovascular sostenida: remar horas, picar piedra, mantener esfuerzo físico intenso de forma prolongada. |
| Resistir | Impermeabilidad del cuerpo ante amenazas intrínsecas a la biología: veneno, enfermedad, sangrado, clima extremo, hambruna. Un personaje con alta Resistir puede sobrevivir desiertos y ayunos prolongados. |
| Metabolismo | Velocidad de recuperación del organismo: cuánto tarda en sanar, desintoxicarse y procesar el esfuerzo. |

**AGILIDAD** — Coordinación, finura de movimiento y control del cuerpo en el espacio.

| Habilidad | Descripción |
|---|---|
| Sigilo | Moverse sin ser detectado: minimizar ruido, usar cobertura, controlar la presencia física. |
| Acrobacias | Control del cuerpo en movimiento complejo: volteos, caídas controladas, equilibrio dinámico. |
| Prestidigitacion | Destreza manual fina: trucos, robos de bolsillo, manipulación discreta de objetos pequeños. |
| Evasion | Retirarse del trayecto de un ataque o peligro físico mediante movimiento de cuerpo. |
| Montar | Permanecer sobre una montura en movimiento y dirigirla bajo presión. Requiere ajuste corporal constante y anticipación del animal. |

**INSTINTO** — Percepción y respuesta pre-racional. Lo que el cuerpo y la intuición procesan antes de que la mente consciente intervenga.

| Habilidad | Descripción |
|---|---|
| Percepcion | Detección sensorial pasiva y activa: notar detalles, detectar presencias, leer el entorno inmediato. |
| Detectar Intenciones | Leer el estado emocional y la disposición de otro ser a través de lenguaje corporal, tono y microseñales. |
| Orientacion | Sentido de posición y dirección: saber dónde se está, recordar rutas, no perderse en entornos desconocidos. |
| Adaptación | Conexión somal con el entorno natural. Priorizar instintivamente entre comida, agua y refugio; leer el clima antes de que cambie; sobrevivir leyendo el entorno como lo hace un animal. No es conocimiento académico —es escuchar al cuerpo y al mundo. |
| Manejo Animal | Leer, calmar, comunicarse y dirigir animales. Requiere entender la mente no-racional de una criatura, no fuerza ni palabras. |

**VOLUNTAD** — Temple interno ante la presión, el miedo, la duda o la tentación.

| Habilidad | Descripción |
|---|---|
| Tenacidad | Persistencia ante el agotamiento, el dolor o el fracaso. Seguir cuando el cuerpo y la lógica sugieren parar. |
| Coraje | Actuar con efectividad ante el peligro o el miedo. No es ausencia de miedo —es funcionar a pesar de él. |
| Enfoque | Mantener concentración bajo presión, distracción o estrés. Clave en Spellcasting sostenido y acciones prolongadas. |
| Fe | Convicción en una fuerza exterior —dios, causa, código— que sostiene cuando la voluntad propia no alcanza. |
| Templanza | Control de la respuesta emocional propia. Resistir que una emoción —ira, grief, lujuria, miedo— tome el mando de las acciones. Distinto de Coraje (actuar a pesar del miedo) y de Enfoque (mantener concentración): Templanza niega el timón a la emoción antes o durante su ascenso. Tirada obligatoria al enfrentarse a entidades con etiqueta Daemonis cuando ejecutan un acto Ruin (§1.4.3). |

**INTELIGENCIA** — Conocimiento consciente y razonamiento analítico.

| Habilidad | Descripción |
|---|---|
| Historia | Conocimiento de eventos pasados, linajes, guerras, cronologías y figuras relevantes. |
| Medicina | Anatomía, diagnóstico y tratamiento de heridas y enfermedades. |
| Naturaleza | Conocimiento académico de flora, fauna y ecosistemas. Distinto de Adaptación: esto es saber qué planta es venenosa; aquello es sentir que el clima va a cambiar. |
| Mecanica | Comprensión y manipulación de mecanismos: cerraduras, trampas, engranajes, ingenios. |
| Fisica | Principios del movimiento, la materia y las fuerzas. Aplicable a proyectiles, estructuras y fenómenos físicos. |
| Quimica | Composición y reacciones de sustancias: venenos, explosivos, alquimia, materiales. |
| C. Magico | Conocimiento teórico del campo arcano: historia de la magia, identificación de hechizos ajenos, lectura de runas, uso de ítems desconocidos. Distinto de Arcana: un nigromante experto puede tener Arcana alta y C. Magico bajo —sabe lanzar, pero no sabe qué hace el ítem que encontró. |

**CARÁCTER** — Influencia sobre otros a través de la presencia y la comunicación.

| Habilidad | Descripción |
|---|---|
| Elocuencia | Comunicación persuasiva y clara: discursos, argumentos, negociaciones de buena fe. |
| Liderazgo | Dirección de grupos bajo presión: dar órdenes que se obedezcan, mantener moral, coordinar. |
| Coaccion | Presión psicológica para obtener cumplimiento: intimidación, amenaza velada o explícita. |
| Engañar | Mentira convincente: falsas identidades, información fabricada, manipulación deliberada. |
| Entretener | Actuación, música, narración, humor. Crear una experiencia emocional en una audiencia. |

**MELEE** — Competencia en combate cuerpo a cuerpo.

| Habilidad | Descripción |
|---|---|
| Una mano | Armas empuñadas con una mano: espadas, hachas, mazas. |
| A dos manos | Armas que requieren ambas manos: mandobles, lanzas, martillos de guerra. |
| Armas Dobles | Combate con un arma en cada mano simultáneamente. |
| Bloqueo | Interceptar ataques con escudo. |
| Paradas | Defenderse con el arma propia: desviar o parar ataques. Es la skill de las reacciones **Deflectar** y **Parry** (§11.9); requiere un arma con el rasgo **Guardia**. |
| Desarmado | Combate sin armas con intención de dañar: golpes, patadas, técnicas ofensivas. |

**PROYECTILES** — Competencia en combate a distancia.

| Habilidad | Descripción |
|---|---|
| Arcos | Arcos cortos y largos. |
| Ballestas | Ballestas de mano y de guerra. |
| Armas de fuego | Armas que propulsan proyectiles mediante pólvora u otro mecanismo. |
| Asedio | Catapultas, balistas, cañones y armas de gran escala. |
| Arrojar | Lanzar objetos diseñados para ser arrojados con precisión. Cuando la precisión del impacto es lo que importa. |

**ARCANA** — Afinidad operativa con los flujos mágicos. No es conocimiento teórico —es capacidad de canalizar. Un mago puede tener Arcana alta en un flujo y no saber que los otros existen. Para conocimiento teórico de la magia, ver C. Magico (Inteligencia).

| Habilidad | Descripción |
|---|---|
| Yrgrammar | Flujo de la muerte y la energía necromántica. |
| Naial | Flujo de la emoción y la psique. |
| Cronibor | Flujo del tiempo. |
| Ivganny | Flujo de la mente y la ilusión. |
| Ignamor | Flujo del calor y la energía térmica. |
| Gelmir | Flujo de las leyes físicas y la materia. |

**Asignación inicial de atributos.** Existen dos métodos:
1. **Valores fijos.** Reparte libremente: **50, 45, 40, 35, 30, 30, 30, 20, 20, 15**.
2. **Aleatorio (3d4 × 5).** Tiras por cada uno de los 10 atributos. Si asignas los resultados **libremente**, funcionas normal. Pero si te comprometes a **asignarlos estrictamente en el orden en que salen** (el primer resultado a Fuerza, el segundo a Vitalidad, etc.), ganas **+1 XP inicial extra** (comenzando con 2 XP).
   - *Mulligan (Re-asignación):* Si te comprometiste al orden estricto pero tu tirada es un desastre (No tienes al menos dos atributos >40, tienes más de tres atributos <20, y ningún atributo de combate >40), puedes cancelar el acuerdo. Pierdes el +1 XP extra y puedes reasignar esos números libremente, usar el arreglo fijo, o re-rolear.

> **Nota cronológica.** M decía 50, 45, 40, 35, **35**, 30, 30, 20, 20, 15. T cambió el quinto valor de 35 → 30. **X confirma la versión de T.**
>
> **Tirada canónica de generación (Hassan): 3d4 × 5 → rango 15–60.** T traía "2d6 × 5" (10-60); **X y Hassan canonizan 3d4 × 5** (15-60, distribución triangular concentrada en 35-40). *[Resuelve INCONG #39]*

**Integración de la Senda (Clase).** Una vez asignados los atributos base, el personaje distribuye el **Pool de Combate** (+20, +15, +10, +5) y el **Pool Normal** (+50) otorgados por su Senda directamente a sus **Habilidades Hijas**. Ninguna de las bonificaciones aplicadas durante la creación puede romper el Techo de Creación de **80** (ver Creación de Personaje).

**Mejora de atributos y habilidades.**
- **Puntos de mejora iniciales:** dependen de linaje, clase, ascendencia, edad y Nivel de Voluntad. `[ESQUELETO: tabla de puntos iniciales por combinación]`
- **Tirada de mejora *(canon C-4 — Hassan 2026-07-03)*:** lanza 1d100. Si el resultado es **mayor o igual** al valor actual → mejora exitosa; si no → falla y la Marca **no se consume**. *(Excepción explícita al principio C-8 de "≤ = éxito": aquí tirar alto es bueno. Las bandas 00–05/95–99 **no** aplican a esta tirada — D-6.)* Fuente única: `20_Contenido/Feat_Entrenamiento.md`.
- **Durante la partida**, marca las habilidades que **uses y falles**. La mejora se intenta mediante el feat **Entrenamiento** (gastando Marcas), **no** "al subir de nivel" —el Nivel del personaje fue eliminado (Hassan 2026-06-28). **El feat es una compra repetible (D-8, 2026-07-03):** cada compra cuesta 1 XP y habilita las Tiradas de Mejora de **esa sesión**; se agota al usarse o al terminar la sesión — **no es una pasiva permanente**. Además, **sufrir una Herida Grave otorga inmediatamente una Marca de Entrenamiento de Vitalidad** (D-5, 2026-07-03). Ver `20_Contenido/Feat_Entrenamiento.md`.
- ~~**Puntos de entrenamiento**~~ *(eliminados — C-4, 2026-07-03: absorbidos por la Opción XP del feat Entrenamiento: 1 XP consume la Marca y asegura la mejora)*.
- Una vez que una habilidad/atributo mejora en una instancia, **no puede volver a intentarse en ese mismo momento**.
- **Mejorar un atributo principal mejora automáticamente todas sus habilidades hijas.**

**Incremento al mejorar *(canon C-4 — Hassan 2026-07-03)*:**
- Habilidad con valor **75 o menos** → **+1d6**.
- Habilidad con valor **76 o más** → **+1d4**.
- Atributo → **+1d4**.
- ~~1d4+1 / +3 fijo / 1d6+2 / +5 fijo~~ *(versiones anteriores eliminadas)*.

> **Por qué el incremento de atributo es menor que el de habilidad.** Al mejorar un atributo principal, el incremento (1d4+1 / +3) se aplica automáticamente a todas sus habilidades hijas. El beneficio es amplio; la ganancia individual es menor. Al mejorar una habilidad hija directamente, el incremento (1d6+2 / +5) es mayor pero solo afecta a esa habilidad. El jugador elige entre crecer en amplitud (subir el padre) o en profundidad (subir la hija).

### 11.2.bis Especializaciones *(canonizado — Hassan 2026-06-14)*

Una especialización es un **bono contextual flotante**, independiente del atributo o habilidad que se tire. Representa dominio profundo en un tema, criatura, oficio, región o disciplina específica.

**Cómo funciona.** Cuando una tirada —ya sea de habilidad hija o de atributo directo— involucra el dominio de la especialización, el bono se suma al valor antes de tirar. Una especialización de 10% en Grifos aplica a Historia (saber su origen), Medicina (tratar sus heridas), Montar (volarlos), cualquier tirada de ataque (combatirlos) y Fuerza directa (resistir su envergadura). El dominio define el contexto; el sistema no limita a qué atributo aplica.

**Cómo se obtiene.** Las especializaciones no se entrenan como habilidades. Sus fuentes principales son Feats y Origen; otras fuentes son posibles a criterio del DM. No se marcan ni se mejoran mediante el sistema de tiradas de §11.2.

**Valor.** Variable. No hay piso ni techo fijo; el DM determina el porcentaje al otorgar la especialización. Debe ser razonable en escala —suficiente para ser relevante, no tan alto que eclipse la habilidad base.

**Inteligencia y especializaciones.** Muchos Feats que requieren Inteligencia como prerequisito desbloquean especializaciones como beneficio adicional. Esto hace de Inteligencia un atributo con valor transversal para cualquier tipo de personaje: un guerrero con Inteligencia alta puede acceder a Feats que le otorguen especializaciones en enemigos, armas o tácticas específicas, sumando ese bono a sus tiradas físicas en contexto.

### 11.3 Sistema de Daño y Heridas *(fuentes: X canoniza fórmulas, T da el sistema, M aporta texto)*

> **Filosofía de la Vida (canon — Hassan 2026-06-28).** Los PG/MH **no** son el eje de supervivencia. A diferencia de D&D —donde el HP es un contador abstracto que crece con el nivel— en Gideon la Vida **casi no escala**. Un personaje sobrevive mejor a medida que progresa no por tener más Vida, sino por **defenderse mejor de forma activa**: esquiva, parry, bloqueo, mejor equipo y hechizos defensivos, que debe gastar para vivir. El personaje nunca deja de ser una "bolsa de carne": un veterano puede ser extraordinario, pero si lo toman por sorpresa y expuesto, muere como cualquiera. La supervivencia es una herramienta activa, no un colchón pasivo de HP.

**Máximo de Heridas / Puntos de Golpe Máximos (MH / PG).**
> **MH = Resistencia del Linaje + Nivel de Vitalidad** *(NV eliminado como elemento de juego — Hassan 2026-06-28; antes `Resistencia del Linaje + (Nivel × Nivel de Vitalidad)`)*
>
> *(Fórmula X a actualizar: era `D18 = H1 + G2 × D9`; ahora `D18 = H1 + D9` — se quita el factor Nivel `G2`. **Nota:** en un personaje inicial el resultado es idéntico; sólo se elimina el escalado.)*

> **Nota.** L/M decían "Vitalidad del Linaje + ..."; X dice "Resistencia del Linaje + ...". Es el mismo concepto: cada linaje tiene una **Resistencia** característica que actúa de base.

Si recibes más heridas que MH, entras en **agonía**.

**Conversión Daño → Heridas.** *(fuente: T)*
> **Heridas ganadas = Daño − (Nivel de Vitalidad + Armadura)**

**Categorías de herida.** *(canónico — Hassan: umbral grave = ½ MH)*

| Tipo | Umbral canónico | Notas |
|---|---|---|
| **Herida Grave** | Daño ≥ **MH / 2** *(la mitad)* | Hassan canoniza ½ MH sobre la versión de X que decía MH/4. La hoja de cálculo X deberá actualizarse en consecuencia. |
| **Herida Mortal** | Daño ≥ **MH total** | Sin cambios. |

> 🆕 **INCONG #40 — RESUELTA.** T/M decían Herida Grave = ½ MH; X decía MH/4. **Hassan canoniza ½ MH** (el "umbral grave es la mitad"). La hoja X queda desactualizada en este punto y deberá ajustarse.

**PG Máximos Reales (efecto de heridas graves acumuladas).**
> **PG Reales = MH − (MH/4) × (número de heridas graves)**

> **Dos tasas distintas — no confundir *(canónico — Hassan 2026-06-29)*:**
> - **Umbral para CAUSAR una herida grave = ½ MH** (un golpe único de ≥ la mitad de tus heridas máximas).
> - **Reducción por cada herida grave acumulada = ¼ MH.**
>
> Por eso hacen falta **4 heridas graves** para que tus PG Reales lleguen a 0; al llegar ahí (sin herida mortal) entrás en **Comatoso** —no podés levantarte. *(Resuelve el esqueleto del umbral de Comatoso y la INCONG #51.)*
>
> **✅ Ratificado como canon definitivo — C-1, Hassan 2026-07-03:** reducción de **¼ MH** por herida grave; **Comatoso = 4 heridas graves**. La versión divergente del §20.bis (½ / 2 graves) fue corregida. El umbral para *causar* una grave sigue siendo **½ MH** (son dos tasas distintas).

**Dureza** *(fuente: X)*. La dureza natural (mitigación física básica) es:
> **Dureza = Nivel de Vitalidad** *(`D24 = D9`)*

**Localización (1d6) — sólo para heridas Graves o Mortales:**

| 1d6 | Zona |
|---|---|
| 1 | Pierna derecha |
| 2 | Pierna izquierda |
| 3 | Brazo derecho |
| 4 | Brazo izquierdo |
| 5 | Torso |
| 6 | Cabeza |

**Penalizaciones por parte afectada (herida Grave = temporal; herida Mortal = mutilación permanente):**
- **Brazo** — −3 NE a acciones que usen esa mano.
- **Pierna** — Pierdes 10 ft de movimiento.
- **Torso** — Pierdes 1 acción por turno.
- **Cabeza** — Ganas tantos contadores de **Aturdimiento** como el NE del impacto.
- **Cabeza mutilada → muerte inmediata.**

### 11.4 Estados Críticos *(canónico — Hassan)*

Hassan ratifica **cuatro estados distintos**, cada uno con condición específica. **Desmayado ≠ Moribundo ≠ Comatoso** — son tres cosas distintas, todas inconscientes pero con causa, gravedad y consecuencias diferentes.

| Estado | Condición | Descripción |
|---|---|---|
| **Activo** | PG Reales > Heridas activas | Conciencia, capacidad de actuar. |
| **Desmayado** | Heridas acumuladas hasta el límite que puedes soportar, **pero NINGUNA es mortal** | Inconsciente por agotamiento de la capacidad de aguante, sin herida mortal activa. Recuperable con descanso (procedimiento 5 h, ver abajo). |
| **Moribundo / Agonizando** | **Al menos una herida mortal activa** (y todavía no has muerto) | Inconsciente con una herida que mata. Si nadie te estabiliza o reduce heridas, mueres. **Moribundo y Agonizando son el mismo estado** *(canónico, Hassan)*. |
| **Comatoso** | **4 heridas graves** (PG Reales = 0 por la reducción de ¼ c/u) y **ninguna mortal** | Estado profundo: no puedes despertar, y **puedes morir si te dejan abandonado** (sin atención prolongada, el cuerpo cede). |

> **Aclaración explícita de Hassan:**
> - *"Estás desmayado cuando tienes tantas heridas como puedes soportar pero no tienen ninguna mortal."*
> - *"Moribundo es Agonizando: cuando no sólo no puedes soportar más heridas, sino que tienes una mortal."*
> - *"Si tienes tantas graves que no puedes despertar, estás Comatoso y puedes morir si te dejan abandonado."*

*[Resuelve INCONG #16 (Limbo→estados), #41 (Desmayado vs Moribundo), #46 (Moribundo=Agonizando)]*

**Tiempos y procedimientos:**

**Desmayado** (recuperación estándar):
- No puedes actuar ni tienes conciencia del entorno.
- Permaneces así **5 horas** base.
- Haz una **tirada plana de Vitalidad**:
  - **NF se suman** al tiempo de recuperación.
  - **NE se restan**, mínimo **5 minutos**.
- Al cumplirse el tiempo, restas **1 punto de Herida**, recobras conciencia y puedes actuar.

**Moribundo / Agonizando** (herida mortal activa):
- Haz una **tirada de Vitalidad** (no plana).
  - **Falla** → muerte inmediata.
  - **Éxito** → permaneces Moribundo durante un número de turnos igual al **NE** del resultado. Durante ese tiempo debes recibir tratamiento que te estabilice o que te reste **al menos 1 punto de Herida** — si no, mueres al finalizar los turnos.

**Comatoso** (heridas graves acumuladas, sin mortal):
- Sin recuperación natural.
- No despiertas por descanso normal.
- Si no recibes atención sostenida, mueres por abandono (deshidratación, infección, daño crónico). `[ESQUELETO: tiempo concreto hasta morir por abandono — pendiente]`

> **Nota terminológica.** Las versiones previas usaban "Derrotado" (T) y "Moribundo" como sinónimo de Activo-con-herida-grave (X). **Ambas lecturas quedan obsoletas**: Hassan ratifica las cuatro definiciones de arriba.

### 11.5 Tipos de Daño y Resistencias *(canónico — Hassan)*

**Lista canónica de tipos de daño (12 tipos, todos separados):**

1. **Punzante** *(cortante/punzante/contundente son los tres tipos físicos x/y/z de las armaduras)*
2. **Cortante**
3. **Contundente**
4. **Fuego**
5. **Frío**
6. **Rayo** *(canónico, no "Eléctrico")*
7. **Necrótico** *(aparte, no se mezcla con Radiante ni Espiritual)*
8. **Radiante** *(aparte, no se mezcla con Necrótico ni Espiritual)*
9. **Espiritual** *(aparte)*
10. **Sónico** *(= sonido; aparte)*
11. **Verdadero** *(daño plano que ignora mitigaciones — daño puro)*
12. **Veneno**
13. **Ácido**
14. **Psíquico**

> **Aclaración Hassan:** *"Los tipos de daño Rayo, Necrótico y Radiante aparte. Espiritual aparte. Sónico es sonido y Verdadero es daño plano."* La lista de M (12 tipos) **se restaura como canónica**; la versión reducida de X (10) queda obsoleta. *[Resuelve INCONG #42]*
>
> *(Nota: arriba la enumeración llega a 14 porque se conservan todos los tipos posibles. Si Hassan prefiere una lista fija de 12, puede colapsarse Veneno+Ácido en "Veneno" y dejar Ácido como sub-tipo, o mantener la lista expandida — pendiente.)* `[ESQUELETO: Hassan ratificará el conteo final 12 vs 14]`

**Mitigación por tipo (matriz canónica):**

| Tipo de daño | Mitigación | Lectura |
|---|---|---|
| Punzante | Dureza + Armadura física (Punzante / **y** en x/y/z) | Vitalidad protege; armadura por tipo |
| Cortante | Dureza + Armadura física (Cortante / **x** en x/y/z) | Vitalidad protege; armadura por tipo |
| Contundente | Dureza + Armadura física (Contundente / **z** en x/y/z) | Vitalidad protege; armadura por tipo |
| Fuego | Dureza | Vitalidad protege |
| Frío | Dureza | Vitalidad protege |
| Rayo | Dureza | Vitalidad protege |
| Veneno | Dureza + (Resistencia adicional) | Vitalidad + mod. específicos |
| Ácido | Dureza + (Resistencia adicional) | Vitalidad + mod. específicos |
| **Sónico** | Dureza *(salvo modificadores)* | Sonido; Vitalidad protege parcialmente. `[ESQUELETO: fórmula canónica]` |
| **Necrótico** | Nivel de Vitalidad + (Resistencia espiritual menor) | Drena vida; Vitalidad protege parcialmente. `[ESQUELETO: fórmula canónica]` |
| **Radiante** | Nivel de Voluntad o Nivel de Carácter | Luz pura; depende del alma. `[ESQUELETO: fórmula canónica — Hassan]` |
| **Espiritual** | **Nivel de Voluntad** | Vitalidad **NO** protege; sólo la fuerza del alma |
| **Psíquico** | **Nivel de Inteligencia** | Vitalidad **NO** protege; sólo la fuerza de la mente |
| **Verdadero** | **Ninguna mitigación** | Daño plano. Ignora Dureza, armadura y resistencias. |

> Esto formaliza la aclaración de Hassan: **Vitalidad cubre todo lo físico, pero el daño Espiritual y Psíquico son inmunes a Vitalidad** y dependen exclusivamente de Voluntad e Inteligencia respectivamente.

**Modificadores de tipo aplicables:**
- **Frágil (X val)** — Suma X val.
- **Protección (X val)** — Resta X val.
- **Debilidad** — Duplica el daño.
- **Resistencia** — Daño a la mitad.
- **Afinidad** — Lo ganas como puntos de golpe.

**Daño Psíquico — tabla de traumas.** Herida grave psíquica → **1d10** en la **Tabla de Traumas** `[ESQUELETO]`.

**Magia y almas.** *(fuente: T — Spellcasting)* La magia emana del alma. Las criaturas con alma poseen resistencia natural a efectos mágicos; las criaturas sin alma son tratadas por la magia como meros objetos materiales. Magia y alma tienden a respetarse mutuamente por su origen divino común — pero la magia sigue siendo devastadora contra criaturas espirituales como los dríades.

**Heridas persistentes.** *(fuente: M)* Al obtener herida grave, ganas heridas persistentes que impiden curarte hasta cierto punto pero no disminuyen el MH. Necesitan tratamiento para retirarse. Ejemplo: MH 20 con 5 persistentes → siempre tienes 5 hasta tratamiento; un golpe de 8 no causa herida grave porque la mitad de MH (10) sigue siendo el umbral.

**Infección.** Herida infectada no se cura sola. El DM hace en secreto una salvación de **Vitalidad** → número de días hasta sepsis (Herida Mortal infectada).

> **Nota interna M:** "A REVISAR: además cada herida grave o mortal reduce en 1 tu NE para tus tiradas." `[ESQUELETO: confirmar regla]`

### 11.6 Iniciativa, Turnos y Sorpresa *(fuente: T — "Iniciativa y Turnos")*

> **Modelo de iniciativa situacional *(canónico — Canva 1e / Hassan 2026-06-28; reemplaza la tirada de iniciativa por NE)*.** No se tira iniciativa. Al iniciar el combate (o una situación de riesgo) se ordena a los participantes según su **situación**, en esta jerarquía:
>
> **Emboscadores → Preparados → Desprevenidos → Distraídos → Dormidos.**
>
> Los que estén en el **mismo grupo** juegan en el orden que determinen **verbalmente**. Pero un combatiente del bando rival puede **responder** la acción del rival con un **enfrentado de Instinto** para determinar quién va primero — armando los turnos de forma orgánica.

*(Esto reemplaza también el binario "Sorprendido": la sorpresa ahora es el escalón "Emboscadores" vs los grados inferiores de alerta. Ver §18 para los estados.)*

### 11.7 Acciones

**Dos fases generales:** Dentro y Fuera de iniciativa.

- **Fuera de iniciativa.** Movimiento y acción libres. No hay peligro inmediato.
- **Dentro de iniciativa *(canónico — Canva 1e / Hassan 2026-06-28)*.** Tenés **3 acciones por turno**; una jugada puede costar una o más. Las acciones **no usadas se almacenan como Intervenciones** (se ejecutan fuera de tu turno cuando se cumple su **gatillante**). Para poder ejecutar **Reacciones** debés terminar el turno con **al menos 1 acción** sin gastar. **Si gastás todas tus acciones quedás Arrebatado** (§18) — sin acción sobrante no podés reaccionar. Si una tarea requiere **más de 3 acciones**, seguís aportando acciones al inicio de tus próximos turnos hasta completarla. *(Reemplaza el viejo "3 + 1 reacción + 1 gratuita".)*

**Acción Preparar.** Inviertes 2 acciones para realizar una acción como reacción (ya pagada). Ejecutable cuando quieras fuera de tu turno. También puedes invertir 2 acciones para ayudar a otra criatura en una actividad de combate.

**Acción Ayudar.**
- Ayudante realiza la misma tirada que el ayudado.
- Ambos éxito → suma NE del ayudante al del ayudado.
- Ayudante éxito, ayudado falla → resta NF del ayudado por los NE del ayudante.
- Ayudante falla, ayudado éxito → resta NF del ayudante a los NE del ayudado.
- Ambos fallan → suman sus NF.

**Acciones de Turno Completo.** Requieren todas tus acciones disponibles. Puedes moverte la mitad de tu velocidad.
- **Preparación.** Declarar acción futura. Sólo una a la vez. Movimiento completo en su lugar.
- **Evasión.** Todos los ataques contra ti con desventaja hasta el inicio de tu próximo turno; ventaja en tiradas de Evasión.
- **Escape.** No provocas AdO hasta inicio de tu próximo turno. Movimiento completo.

### 11.8 Combate — Atacar (Golpear y Disparar)

Atacar con un arma que poseas suele consumir **una acción** (1 PA). El sistema diferencia mecánicamente los ataques cuerpo a cuerpo de los ataques a distancia mediante dos **Acciones Genéricas** distintas (ver `Acciones_Genericas.md` para sus reglas completas de targeting y trayectoria):
- **Golpear:** Ataque cuerpo a cuerpo. Tirada: **1d100** vs skill de **Melee**.
- **Disparar:** Ataque a distancia o arrojadizo. Tirada: **1d100** vs skill de **Proyectiles**.
*(Los ataques mágicos se resuelven con la habilidad arcana del flujo correspondiente).*

**Resolución e impacto *(canónico — Hassan 2026-07-22)*.** Si tenés éxito y el objetivo **no se defiende** (no le quedan Reacciones, está Arrebatado, sorprendido o sin Sentido Preciso sobre la fuente), el ataque **impacta**. Si el objetivo reacciona, se resuelve con las **Reacciones Defensivas** (§11.9) en tirada enfrentada:
- Contra **Golpear** (cuerpo a cuerpo): El defensor puede usar **Evadir/Rodar**, **Deflectar/Parry**, o **Interceptar/Cubrirse**.
- Contra **Disparar** (rango): **Los ataques a rango NO se pueden esquivar ni hacer Parry.** El defensor solo puede protegerse si usa la acción **Cubrirse** (con escudo). Evadir/Rodar y Deflectar/Parry no aplican.

**Daño al impactar.** De la tirada de ataque se toman los **NE**:
> **Daño (Golpear y Arrojadizas) = NE + Daño del Arma + Nivel de Fuerza**
> **Daño (Disparar regular) = NE + Daño del Arma** *(no suman bono de atributo)*
> **Daño (Ataques mágicos) = NE + Daño del Hechizo + Nivel de Voluntad** *(en lugar de Fuerza)*

Luego se aplica **mitigación** (Dureza + protecciones por tipo, §11.5) y el resultado se convierte en **heridas** (§11.3). La **zona** se determina según §11.8.bis.

**Salvaciones = tiradas enfrentadas *(canónico — Hassan 2026-06-29)*.** Cuando un efecto (conjuro, edicto, veneno, estado, maniobra) permite "salvarse" o "resistir", el objetivo hace una **tirada enfrentada** de su **atributo defensor** (Voluntad, Vitalidad, Agilidad… el que corresponda a la amenaza) contra la **skill de la fuente** (la habilidad con que el lanzador/atacante produjo el efecto); gana el de mejor NE, y si el objetivo pierde, sufre el efecto. **No existen "CD"/Clase de Dificultad** (ningún número fijo a superar) **ni las categorías Reflejos/Fortaleza/Voluntad** de otros juegos —se usa directamente el atributo que aplique. *(Esto reinterpreta automáticamente todas las menciones de "salvación de X" del documento.)*

### 11.8.bis Zonas de Impacto *(canónico — Hassan 2026-06-10)*

**Tabla estándar (1d6):**

| 1d6 | Zona |
|---|---|
| 1 | Cabeza |
| 2 | Torso |
| 3 | Brazo izquierdo |
| 4 | Brazo derecho |
| 5 | Pierna izquierda |
| 6 | Pierna derecha |

**Método 1 — Tirada libre.** En el combate estándar entre dos objetivos de tamaño similar, o de uno mayor atacando a uno menor, la zona de impacto se determina tirando 1d6 al resolver el ataque.

**Método 2 — Apuntar.** El atacante puede declarar antes de tirar que apunta a una zona específica. Si lo hace, tira tantos d6 como NE (Niveles de Éxito) obtuvo en el ataque. Si al menos un d6 muestra el número de la zona elegida, el golpe impacta allí. Si ninguno lo muestra, el ataque se pierde por completo — la concentración en apuntar no dio resultado. No hay coste adicional ni recurso a gestionar: la penalización es la pérdida del ataque. **Excepción crítica:** un golpe crítico en un ataque declarado como apuntado siempre impacta en la zona elegida, sin importar los d6.

**Método 3 — Narrativa / decisión del DM.** Cuando el contexto determina la zona sin ambigüedad, no se tira. Ejemplos: una trampa de osos siempre impacta en una pierna (tirar moneda para cuál); una piedra que cae desde arriba impacta en la cabeza; una mordida recibida al meter la mano por los barrotes de una jaula impacta en ese brazo.

**Posicionamiento y diferencia de tamaño.** Si una criatura es un tamaño mayor que el atacante, los ataques melee no pueden alcanzar la cabeza a menos que el atacante tenga **Alcance** (p. ej. alabarda). Sin alcance, un resultado de 1 se re-rolea. Con alcance, la restricción no aplica. Los atacantes a **rango** contra criaturas un tamaño mayor que ellos pueden elegir la zona de impacto de forma gratuita, sin declarar apunte ni tirar d6.

### 11.9 Reacciones Defensivas *(canónico — Canva 1e / Hassan 2026-06-28; integra el viejo "Bloqueo con Escudos")*

En el hostil mundo de Kindremor la defensa es tanto pasiva como **activa y reactiva**. La principal forma de defensa reactiva son las **Reacciones Defensivas**. Hay **tres**, y cada una tiene una **respuesta básica** y una **mejorada**, según si se emplea o no una **Reacción**.

- En todos los casos el personaje **no debe estar Arrebatado** (§18) — por eso emplear la **última acción del turno** de forma defensiva puede ser decisivo (te deja con Reacción disponible).
- Toda Reacción Defensiva requiere un **Sentido Preciso** operativo sobre la fuente del ataque (§11.9.bis).
- Se resuelven con **tirada enfrentada** contra el ataque; si el defensor gana, **evita el golpe**.

> **Directriz terminológica — Defensa con arma *(canónico — Hassan 2026-06-28)*.** Cuatro términos que **no** hay que confundir:
> 1. **Paradas** — la **skill** (hija de Melee): competencia de defenderse con el arma; es el valor que se tira en Deflectar y en Parry. *(Antes esta skill se llamaba "Parry"; se renombró para no chocar con la reacción.)*
> 2. **Deflectar** — la reacción defensiva **básica** (no gasta Reacción).
> 3. **Parry** — la reacción defensiva **mejorada** (gasta una Reacción); además interrumpe Combos.
> 4. **Guardia** — la **propiedad del arma** empuñada; sin ella no podés Deflectar ni hacer Parry.

| Modo | Básica | Mejorada | Habilidad |
|---|---|---|---|
| Movimiento | **Evadir** | **Rodar** | Evasión |
| Arma | **Deflectar** | **Parry** | **Paradas** *(requiere arma con rasgo **Guardia**)* |
| Escudo | **Interceptar** | **Cubrirse** | Melee (Bloqueo) |

**Evadir y Rodar.** No estar Arrebatado. Al recibir un ataque cuerpo a cuerpo, hacés una tirada enfrentada de **Evasión**; con éxito, evitás el golpe. Tengas éxito o no, **mientras tu Velocidad no sea 0** podés usar la acción **Step como Reacción** para alejarte del oponente — ese desplazamiento inmediato es la **Rodada**.

**Deflectar y Parry.** Requiere empuñar un arma con el rasgo **Guardia** y no estar Arrebatado, contra una criatura que **no sea dos tamaños mayor** que vos. Podés **Deflectar**; si además te queda una **Reacción** disponible, podés hacer un **Parry**. Ambos usan la **skill Paradas** *(ver Directriz: "Parry" es solo la reacción mejorada, "Guardia" el rasgo del arma)* y se resuelven con tirada enfrentada contra el atacante; con éxito, el ataque es evitado. Un **Parry** que supera a un atacante que estaba ejecutando un **Combo** lo **interrumpe**. *(El contraataque **no** es nativo del Parry: lo habilita una **dote aparte, Riposte** —senda Valor—, que permite atacar al agresor con esa misma Reacción.)*

**Interceptar y Cubrirse (escudo).** Requiere escudo equipado en una mano y no estar Arrebatado *(detalle de escudos en §14.7)*.
- **Interceptar** *(básica)*: tirada enfrentada de **Melee (Bloqueo)** cuando recibís ataques cuerpo a cuerpo.
- **Cubrirse** *(mejorada)*: cuesta **1 acción**. Mientras estés Cubierto, sumás la **Protección del escudo** a todos los ataques entrantes y podés hacer tiradas defensivas contra ataques a **Rango**. Si Cubrirse es tu **última acción** del turno, **no quedás Arrebatado**. Si quedás **Incapacitado**, perdés los beneficios de Cubrirse.

### 11.9.bis Reacciones Defensivas — Requisito de Sentido Preciso *(canónico — Hassan 2026-06-09)*

Toda reacción defensiva —Evadir/Rodar, Deflectar/Parry, Interceptar/Cubrirse (§11.9) y cualquier otra— tiene el siguiente requisito universal:

> **La criatura debe contar con un Sentido Preciso operativo sobre la fuente del ataque** (ver §11.9.ter). Sin él, la reacción defensiva no puede ejecutarse.

### 11.9.ter Sentidos Precisos *(canónico — Hassan 2026-06-09)*

Un **sentido preciso** es cualquier sentido que entregue información detallada y direccional sobre una criatura enemiga —suficiente para reaccionar a su ataque. El sentido preciso por defecto de los Dríades es la **vista** (condicionada por la §11.9.quat Iluminación). Otras especies emplean el suyo propio:

| Criatura | Sentido preciso |
|---|---|
| Dríade (y la mayoría) | Vista *(sujeta a Iluminación §11.9.quat)* |
| Hombre murciélago | Oído — ecolocación |
| Vampiro | Percepción de la sangre en circulación |
| Mago (con Ojo Arcano activo) | Ojo Arcano |

**Anular el sentido preciso** de una criatura —cegarla, ensordecerla, ocultar su sangre, disipar su Ojo Arcano— la deja sin él. Una criatura sin sentido preciso operativo sobre la fuente del ataque **no puede ejecutar reacciones defensivas** contra ese ataque.

### 11.9.quat Iluminación *(canónico — Hassan 2026-06-09)*

La iluminación determina si la vista funciona como sentido preciso. Tres niveles:

| Nivel | Descripción | Efecto sobre la vista |
|---|---|---|
| **Clara** | Luz plena | Sin penalización |
| **Tenue** | Penumbra | Visión dificultada |
| **Nula** | Oscuridad total | La vista no entrega información —la criatura queda efectivamente ciega |

**Visión en la Oscuridad (Darkvision).** Mejora la iluminación **Tenue** a **Clara** para quien la posee. Requiere al menos luz residual —qué cuenta como residual lo determina el DM (antorcha en corredor contiguo, luz de estrellas, brasas medio apagadas, etc.). En oscuridad **Nula** no funciona: la criatura queda igualmente ciega.

### 11.10 Combos *(fuente: T — "Combos")*

Algunas maniobras de combate permiten atacar de forma más óptima. Las **tres básicas**:

- **Golpe Insistente.** Permite reposicionarte rápidamente tras fallar un golpe para intentar otro. Re-rolea un ataque fallido. Si gastas 2 acciones, re-rolea hasta dos veces.
- **Multi Ataque.** Permite aprovechar la ventaja de acertar un golpe extra.
- **Golpe Poderoso.** `[ESQUELETO: descripción mecánica completa — T lo lista pero no detalla]`

**Reglas comunes:**
- Cuestan **1 o 2 acciones**.
- Gastan **1 de Stamina** *(canónico — "Vigor" está deprecado; ver §13.1)*.
- Puedes hacer **1 combo por turno**.

### 11.11 Ataques Aéreos (Airborne) *(fuente: T — "Airborne")*

Los combates en Gideon ocurren rápido y en simultáneo. Cuando una criatura es arrojada al aire, transcurren unos segundos antes de que vuelva a impactar.

**Airborne** es un **Estado Alterado** que representa estar suspendido sin control del propio equilibrio. Aplica también cuando una criatura pierde su superficie de apoyo antes de que comience la caída.

**Mientras estás Airborne:**
- Todas tus tiradas son **Muy Difíciles**.
- **Apuntarte con ataques a Rango** es **Muy Difícil**.
- **Atacarte cuerpo a cuerpo** es **Fácil**.
- Tu **Velocidad es 0** y no puede aumentarse, salvo que tengas **Velocidad de Vuelo**.

**Inicio de turno Airborne:**
- Puedes realizar **1 acción** antes de caer.
- Tras esa acción, impactas contra el suelo y recibes **todo el daño de caída correspondiente**.

### 11.11.bis Monturas *(canónico — Hassan 2026-07-13)*

Montar una criatura tiene **tres procedimientos** según su disposición: **Dócil**, **Aliada** u **Hostil**. La habilidad **Montar** (hija de Agilidad) se tira cuando cabalgar exige control bajo presión.

**Acción "Montar" (Dócil o Aliada).** Cuesta **2 PA**: podés moverte hasta **toda tu velocidad** y montar una criatura voluntariosa. *(Como consume 2 de tus 3 PA, el turno en que montás es de acomodo: no llegás a Galopar ese mismo turno.)*

**Montura Dócil** *(p. ej. un caballo).* No tiene turno propio (funciona como vehículo). En tu turno **empleás su velocidad en lugar de la tuya** y ganás la acción **Galope**: por **2 PA**, te movés **3 veces**. Tus demás acciones las usás con normalidad. *(PA = Punto de Acción; ver `Acciones_Genericas.md`.)*

**Montura Aliada** *(p. ej. un dragón, un grifo, o el bárbaro del grupo).* Ambos **pierden la acción básica de Moverse** y **ganan "Movimiento en Equipo"**. El desplazamiento se vuelve un **recurso compartido** igual al número de acciones de la montura (**normalmente 3**): jinete y montura conservan su turno y sus demás acciones, pero **sólo pueden desplazarse gastando "Movimiento en Equipo"**, y entre los dos **no pueden superar ese total**. El pool es compartido a propósito para que **el jinete no tenga que esperar el turno de la montura para desplazarse** *(ratificado — Hassan 2026-07-13)*.

> *Ejemplo (grifo, 3 acciones): en tu turno te movés 2 veces con él y das 1 ataque; en el turno del grifo, éste se mueve 1 vez (completa el pool de 3) y da 2 zarpazos.*

**Montura Hostil / Involuntaria** *(canónico — Hassan 2026-07-13).* Montás a una criatura **contra su voluntad** —monstruos u otras criaturas que montás para golpear—. Mantiene **turno independiente**.

*Regla básica:*
- La criatura debe ser **un tamaño mayor** que vos.
- **Subirse** es una **tirada enfrentada de Escalar (Fuerza) contra la Evasión de la criatura**, con **ambas manos libres** (coste **1 PA**). No lleva penalización de dificultad, pero **no es éxito automático**: tirás tu Escalar (con 50% caés la mitad de las veces; con 75%, un cuarto) y la criatura tiene su **chance de esquivarte** —no es tan fácil subirse a un elefante—.
- Con éxito **te adherís** y **te movés con ella**, manteniendo siempre **al menos una mano** sujetándote y **ambas piernas**.
- **Mantener el agarre cuesta 1 PA por turno**: mientras sigas montado a la fuerza invertís 1 PA cada turno en sostenerte (te quedan 2 PA para actuar).

*Mecánicas aledañas:*
- **Armas que cuentan como mano libre.** Algunas armas —p. ej. las **dagas**— cuentan como mano libre para **iniciar o mantener** la montura (las clavás para sujetarte). Esto te deja golpear mientras cabalgás a la fuerza.
- **Sacudirse (Acción Épica).** La criatura puede sacudirse para arrojar a quienes la agarran, ejecutándolo como **Acción Épica** (`Acciones_Genericas.md`, `[ESQUELETO]`). Al hacerlo, **todos los que la estén agarrando** deben superar una tirada de **Escalar Difícil** o **caer**.
- **Grapleo.** Si la criatura **puede alcanzarte** (llegar de algún modo a donde estás), puede intentar **Graplearte** para desmontarte (motor de agarre: **Atletismo** vs **Firmeza**; efecto del estado Agarrado aún pendiente, §18).
- **Caída.** Al caer recibís daño **igual a la altura de la criatura** en metros (§11.11.ter).

> **Nota de diseño (2026-07-13).** Se usa **Escalar** —no Firmeza/Resistir— porque lo que se evalúa es **aferrarte a una superficie difícil**, no resistir un empuje. Pendiente: (a) definir la **Acción Épica** (esqueleto en `Acciones_Genericas.md`); (b) el **efecto del estado Agarrado/Restringido** para el grapleo (§18).

**Carga del jinete.** **Toda** montura (Dócil, Aliada u Hostil) debe poder **cargar el peso completo del jinete**; si no puede hacerlo con comodidad, **sus acciones se ven afectadas**. `[Depende del sistema de Peso/Sobrecarga aún NO definido: hace falta una capacidad de carga por criatura para resolver esto — cruce marcado.]`

> **Acciones básicas de desplazamiento.** La acción básica **Moverse** (te desplazás tu velocidad a pie; rasgo **Movimiento**) y las demás quedan definidas en **`Acciones_Genericas.md`**.

### 11.11.ter Daño de Caída *(canónico — Hassan 2026-07-13)*

Una caída inflige **daño contundente físico igual a los metros totales caídos** (los primeros 3 m cuentan), y sólo se aplica **a partir de 3 metros** (caídas menores no dañan). **Techo: 400 m** = velocidad terminal de caída libre (daño máximo 400). Desde los 3 m, quien cae puede tirar **Acrobacias** para **reducir el daño en tanto como su NE**. Este daño **se mitiga con la Dureza (Toughness) pero NO con la armadura** (blindaje/protecciones físicas no aplican a la caída).

> **Alternativa por equipo (intencional).** El **abanico de guerra** (§14) reduce caídas con **Artes Marciales** en lugar de Acrobacias: es una **opción a propósito** para quien porta esa arma, permitiéndole usar una habilidad más entrenada. No es duplicación a corregir.

### 11.12 Descansos

**Descanso Corto:**
- 1 hora.
- No sufrir amenaza ni daño.
- Lugar seco y a temperatura ambiente para sentarse.

**Descanso Largo:**
- 6 h de sueño.
- 1 ración o fuente considerable de 500 g de comida. *(Comer aquí reinicia el reloj de hambre del Agotamiento §18; media ración cuenta como media ración a esos efectos.)*
- Bebida limpia. *(Hidratarse reinicia el reloj de sed del Agotamiento §18.)*
- Sólo se puede realizar **1 descanso largo al día**. Puedes elegir dar por terminado el día y esperar al próximo descanso largo.
- No sufrir amenaza ni daño.
- Lugar seco y a temperatura ambiente para montar cama.
- Protección de los elementos.
- Relativo silencio.

### 11.13 Inspiración (Omen)

La Inspiración se gana **realizando acciones que colaboren de alguna forma con lo especificado en el Omen de tu personaje**.

**Usos de los Puntos de Omen:**
- **Suerte de Héroe:** Puedes gastar un punto de Omen en cualquier momento para **ignorar totalmente una instancia de Daño**.
- **Éxito Asegurado:** Al gastar un punto, obtienes un éxito automático con tu NE/NF en una tirada.
- **Activar Habilidades:** Algunas habilidades y poderes específicos de senda requieren gastar puntos de Omen para activarse.

**Reglas de los Puntos de Omen:**
- **Máximo simultáneo:** 2.
- El punto solo se consume si la acción para la que se gasta es validada por el DM.
- *(Nota de diseño: El antiguo uso de "control narrativo" o Puntos de Profecía fue eliminado para no entorpecer el ritmo de la mesa ni poner presión indebida en el Director de Juego).*

### 11.14 Tamaños

Diminuta, Pequeña, Normal, Grande, Gigante, Colosal, Titánica.

- Armas y armaduras tienen requisito de tamaño.
- Cuando un arma sube de tamaño: se toma como base el arma normal y se **duplican los dados de daño** por cada tamaño. Precio y peso también se duplican.
- Bonificador a la tirada de ataque: **+2** al golpear a una criatura más grande, **-2** al atacar a una más pequeña.

### 11.15 Creación de Personaje — Pasos

#### 11.15.0 Modos de Campaña *(canónico — Hassan 2026-06-15)*

Antes de crear personajes, la mesa define el modo en que se jugará la campaña. El modo determina la relación del grupo con el Enclave del Eclipse (§5.1) y el nivel de estructura narrativa.

**Enclave.** Campaña estructurada y lineal. Los personajes forman parte —o sirven— al Enclave del Eclipse mediante un **contrato formal**: un acuerdo escrito que establece las obligaciones del grupo, sus límites de actuación y las condiciones de remuneración. El trasfondo de cada personaje tiene mayor peso mecánico y narrativo en este modo, ya que el Enclave suele reclutar en función de la utilidad del origen del individuo. `[ESQUELETO: cláusulas tipo del contrato, instancias de ruptura y consecuencias — pendiente de Hassan]`

**Sandbox.** Campaña libre y caótica. Los personajes no responden a ninguna estructura central. No existe contrato; las motivaciones son individuales o grupales pero no institucionales. El trasfondo sigue siendo el punto de partida del personaje, pero no tiene implicaciones contractuales.

---

#### 11.15.1 Pasos de Creación

1. Definir modo de campaña con la mesa (Enclave o Sandbox).
2. Elegir especie (Dríade, Hombre Lagarto o Ser de la Sangre).
3. Elegir subespecie.
4. Elegir **Trasfondo** (§11.15.2): Dedicación, Nacimiento, y opcionalmente Regalo & Perjuicio.
5. Elegir Senda.
6. Elegir virtud y defecto (opcional — §16).
7. Asignar atributos, habilidades y especializaciones.
8. Historia del personaje.

---

#### 11.15.2 Trasfondos (Orígenes) *(canónico — Hassan 2026-06-15)*

Todo trasfondo se compone de **tres elementos**: Dedicación, Nacimiento, y Regalo & Perjuicio. Los tres son subsecciones de la creación de personaje, no mecánicas independientes.

**Dedicación.** El oficio, actitud o vocación que define al personaje antes de convertirse en aventurero. No es sinónimo de Senda —un campesino puede tomar la Senda del Valor, un mercader puede ser Arcanista. La Dedicación informa el pasado del personaje, sus contactos naturales y su relación con el mundo antes de la campaña. `[ESQUELETO: lista canónica de Dedicaciones disponibles — pendiente de Hassan]`

**Nacimiento.** Tirada universal de 1d100, independiente de la Dedicación elegida, que determina el contexto de origen del personaje —familia, circunstancia natal, señal en el momento del nacimiento. La tabla es compartida por todas las Dedicaciones y tiene distribución ponderada: los resultados comunes son más amplios y los raros más acotados. Entre las entradas de baja probabilidad se encuentran condiciones de origen vinculadas a los Primigenios activos. `[ESQUELETO: tabla completa de Nacimiento (1d100) — pendiente de confirmación de Hassan]`

**Regalos y Perjuicios** *(terminología: "Falencia" → **Perjuicio**, canon C-5 — Hassan 2026-07-03)*. Rasgos opcionales de origen. **Son independientes — NO forman pares obligatorios** *(corregido — Hassan 2026-06-29)*: podés tomar un Regalo sin Perjuicio, un Perjuicio sin Regalo, ambos o ninguno. El Regalo otorga una ventaja; el Perjuicio, una desventaja (incluidas las **discapacidades de origen** → estados de §18). Algunos tienen un contrario temático (Dotado↔Anti-Dotado), pero eso no obliga a tomar el opuesto ni todos lo tienen. La mesa puede excluir cualquier Perjuicio de tono pesado antes de empezar. *(Ver §11.15.2.bis.)*

---

#### 11.15.2.bis Regalos y Perjuicios disponibles *(canónico — Hassan 2026-06-15; corregido 2026-06-29; renombrado C-5 2026-07-03)*

Regalos y Perjuicios son **independientes**: el jugador puede tomar solo un Regalo, solo un Perjuicio, ambos o ninguno. Algunos Regalos y Perjuicios son **opuestos y mutuamente excluyentes** (los "contrarios" que se listan abajo): no puedes tomar a la vez un Regalo y su Perjuicio contrario.

---

**Dotado (Regalo) ↔ Anti-Dotado (Perjuicio)** *(contrarios temáticos, no obligan)*

> **Dotado** *(Regalo)*. Al crear el personaje, tira 1d10 y súmalo a **todos** los atributos. Representa una excepcionalidad innata —el cuerpo y la mente del personaje nacieron fuera del rango ordinario.

> **Anti-Dotado** *(Perjuicio)*. Al crear el personaje, tira 1d10 y réstalo de **todos** los atributos. El personaje nació en el extremo opuesto de la distribución: un cuerpo y una mente que parten en desventaja frente al promedio.

---

**Carismático (Regalo) ↔ Desagradable (Perjuicio)** *(contrarios temáticos, no obligan)*

> **Carismático por Naturaleza** *(Regalo)*. El personaje suma **+5 a todas las tiradas de Elocuencia y de Engaño**. No es necesariamente guapo ni elocuente en el sentido clásico: hay algo en él que atrae, que convence, que desarma. La gente lo escucha sin saber muy bien por qué.

> **Desagradable** *(Perjuicio)*. Todas las tiradas de Elocuencia y de Engaño del personaje tienen **DIF 1** —es decir, un grado de dificultad adicional. Además, dependiendo del lugar y del contexto, el personaje y sus compañeros pueden ser socialmente marginados por asociación. Lo desagradable no es necesariamente físico: el personaje suele ir mal vestido, la ropa se le ensucia con rapidez inexplicable, no contiene sus gases, se le puede ver sacándose los mocos o comiendo con la boca abierta. No es maldad ni ignorancia —es una condición que lo sigue.
>
> **Nota de mesa.** El Perjuicio Desagradable puede tener impacto de tono pesado en algunos contextos sociales. Se recomienda que la mesa acuerde antes de empezar la campaña si quieren incluirla o descartarla.

### 11.16 Minions y Tropas *(canónico — Hassan 2026-06-10)*

**Propósito.** La mayoría de los habitantes de una mazmorra, y los soldados o mercenarios que acompañen al grupo, no necesitan una hoja de personaje detallada. No importa si mienten mejor de lo que intimidan, ni su trasfondo o su conocimiento arcano. Lo único que importa de un Minion es: qué tan robusto es, qué capacidades mentales tiene y qué tan hábil es.

**Atributos comodín.** Un Minion se define con tres atributos que funcionan como comodines para todo lo que intente hacer dentro de su categoría:

- **Vigor** — todo lo físico, corporal y de resistencia.
- **Mente** — todo lo intelectual, perceptivo y de voluntad.
- **Destreza** — todo lo de agilidad, precisión y finura.

Cualquier tirada que pida el Minion se resuelve con el comodín que mejor le corresponda; no se desglosa en habilidades hijas.

**Atributos de combate.** Si el Minion combate, se le suman **Melee / Proyectiles / Arcana** según los que posea y use. Si no usa alguno, simplemente no lo tiene.

**Especialidades puntuales.** Si se quiere una Tropa particularmente buena en algo concreto (p. ej. Sigilo), se lista aparte de los comodines genéricos. Todo lo que no se liste cae bajo Vigor / Mente / Destreza por defecto.

**Filosofía de diseño (intencional).** Estas reglas son deliberadamente poco precisas e inestables. Ni el jugador ni el DM saben del todo cómo operará un Minion en una situación dada — y esa imprevisibilidad es parte del efecto buscado. No hace falta llevar registro detallado: lo importante es que los Minions sean fáciles de dirigir y no entorpezcan el combate.

---
