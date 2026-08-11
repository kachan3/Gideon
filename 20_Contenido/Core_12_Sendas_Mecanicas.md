> **Módulo extraído literalmente de `Gideon Core.md`** (última edición 2026-07-01) en la reestructuración documental del 2026-07-02. Contenido sin modificar. El documento maestro original se conserva íntegro en `99_Archivo/Gideon Core_ORIGINAL_2026-07-01.md`.

## 12. SENDAS — MECÁNICAS

> **Sistema de Senda sin niveles *(canónico — Hassan 2026-06-28; reemplaza los Rangos/Niveles de Senda)*.** No hay "Nivel de Senda" ni desbloqueos por "Nivel 1/2/3". Los rasgos de senda se **desbloquean on-demand**: el jugador elige cuándo tomarlos. Un rasgo puede exigir **prerrequisitos** (otro rasgo previo, un valor de habilidad, un hito narrativo) que forman una **escala natural** en lugar de un nivel numérico. El sistema es deliberadamente más flexible.

**Dado de Senda (SD).** Todas las sendas comparten un **Dado de Senda**; si tienes multisenda, se comparte. Representa la habilidad para usar lo que tu personaje sabe. Su tier **escala según la XP total invertida en el personaje** (no por nivel de senda):

| SD | XP total invertida |
|---|---|
| 1d4 | inicial |
| 1d6 | `[ESQUELETO: umbral]` |
| 1d8 | `[ESQUELETO: umbral]` |
| 1d10 | `[ESQUELETO: umbral]` |
| 1d12 | **50 XP invertida** |

> `[ESQUELETO: umbrales intermedios de XP para 1d6 / 1d8 / 1d10. Hassan fijó sólo el techo: 1d12 = 50 XP invertida (2026-06-28).]`

**Pool de Senda y escalado de habilidades** *(canónico — Hassan 2026-06-28)*. Los dotes de senda son **dotes normales**: se acceden por evento o por pertenecer a la senda, igual que cualquier dote del repertorio. La diferencia es que llevan un **Tag de Senda** (p. ej. `Berserker`). Toda la XP que inviertas en dotes con un Tag dado se acumula en la **Pool de esa Senda** = *XP invertida en la Senda*. Los valores de habilidad que antes escalaban con "nivel de senda" ahora **suben +1 por cada 5 XP invertidos en esa Senda**.

> **Grado de Senda** *(nombre provisional)* `= ⌊ XP invertida en la Senda ÷ 5 ⌋`. Donde una habilidad decía "nivel de [senda]", léase **Grado de [senda]**. La Pool de Senda es un **subconjunto** de la XP total que también gradúa el Dado de Senda (arriba).

> `[ESQUELETO: los breakpoints numéricos heredados "(nv X)" dentro de cada senda (p. ej. Daño Elemental nv 5/11/17, Desquite nv 4/8) deben **re-escalarse** a umbrales de XP de Senda — no son conversión directa porque varios superan el techo de 50 XP. Pendiente Hassan.]`

> **Aviso.** La frase "Cada personajes," que precede a la descripción de Valor en M quedó cortada. `[ESQUELETO: completar la regla]`

### 12.0 Asignación de Pools en Creación *(canónico — Hassan 2026-07-30)*

La Senda no dicta un rol estricto. Para garantizar que todos los personajes sean competentes tanto en combate como en otras áreas, y para permitir construcciones versátiles (como un Berserker lanzador de conjuros o un Heraldo artemarcialista), **la elección de la Senda otorga al personaje dos "Pools" de puntos en la creación**, los cuales se reparten libremente en sus **Habilidades Hijas**:

- **Pool de Combate:** El jugador dispone de los valores **+20, +15, +10 y +5**. Debe asignar cada uno de estos valores a una habilidad distinta perteneciente a los Atributos de Combate (Melee, Proyectiles, Arcana).
- **Pool Normal:** El jugador dispone de **50 puntos** para repartir libremente entre las Habilidades Hijas de los Atributos Normales (Fuerza, Vitalidad, Agilidad, Instinto, Voluntad, Inteligencia, Carácter). **Límite:** Ninguna habilidad puede recibir más de +20 puntos de este pool.

*(Nota: Estos bonos se aplican **antes** de chequear los mínimos garantizados por la Dedicación, ver Creación de Personaje).*

### 12.0.bis Premisa de Senda y Dedicación *(fuente: T)*

**Dedicación.** Las **especializaciones** no son nada más que **Dotes de Clase entrelazados**. Pueden o no requerir pertenencia a una clase para tomarse, y suelen requerir el dote anterior necesario como prerrequisito.

> Esto formaliza el sistema de **progresión modular** que ya estaba implícito en las sendas de M (cada nivel desbloquea dotes que requieren los anteriores).

### 12.1 Valor
*"La Adversidad no hará flaquear tu temple…"*

**Dotes específicos de Valor (T):**

#### Danza de Golpes
> *Si gastas todas tus acciones desplazándote, atacando o usando acciones con el tag "Valor", **no quedas Arrebatado**.*

#### Pose de la Pluma ◆◆◆ *(requiere: Senda Valor)*
Cuando estás en esta pose te meces como una pluma en el viento mientras atacas. Cuando realizas la acción de **Ataque**, inmediatamente puedes hacer la acción **Step** para alejarte del objetivo de tu ataque. **Si eres Hijo del Viento, este step aumenta a 10 ft.**

**Requisito de mantener:** atacar y hacer step **una vez por turno**, y tu Speed no puede ser 0.

##### Salto de la Pluma *(requiere: Pose de la Pluma)*
Tu elegancia y evasividad aumentan. Cuando haces Parry o Deflectar a un ataque, puedes hacer step para alejarte de tu oponente. **Tu step aumenta a 10 ft (15 para Hijos del Viento).**

##### Vuelo de la Pluma *(requiere: Salto de la Pluma)*
Cuando entres en la pose, si eliges entrar en modo Salto de la Pluma, debes atacar a un oponente a hasta 20 ft. Luego de eso estarás volando en el aire. Este vuelo es especial:
- Vuelas **10 ft por encima** de la altura de la criatura que impactaste.
- **Sólo puedes volar en línea recta.**
- Para cambiar de dirección debes atacar, hacer Deflectar o Parry a un oponente.
- Puedes volar **30 ft** antes de atacar a un oponente.
- Este vuelo **no produce ataques de oportunidad**.
- Todos los oponentes tienen **desventaja** al atacarte mientras estés en Vuelo de Pluma.

**Requisito de mantener:** hacer Deflectar, Parry o atacar a alguien como **primera acción** de tu turno.

---

**Continuación de Valor (M, contenido previo):**

*"La Adversidad no hará flaquear tu temple…"*

**Proficiencias iniciales:** Acrobacias, Historia, Intimidación (1 experto, 2 entrenadas) + 1 arte marcial entrenada.

**Nivel 1:**
- **Nervios de acero.** Inmune a la condición *asustado*. Si sufres Miedoso o Paranoico, no eres inmune pero tienes ventaja en tiradas para evitar/terminar el miedo.
- **Reacción rápida.** Reacción extra que sólo puedes usar para **Parry** o **Evadir** (§11.9). Parry exitoso → ataque de oportunidad contra esa criatura si te quedan reacciones.
- **Entrenamiento Superior.** Elige una dote marcial.

**Nivel 2:**
- **Danza del Loto** (acción de turno completo). Iniciar serie de ataques continuos con un arma. Sin penalización habitual por ataques adicionales, pero cada ataque consecutivo sufre **-2 acumulativo** (-2, -4, -6, …). Fallar interrumpe la danza. Cuerpo a cuerpo: ataca a todos los enemigos a tu alcance. A distancia: elige área 10×10 ft dentro de rango; sólo atacas dentro.

`[ESQUELETO: niveles 3 en adelante]`

### 12.2 Honor
*"Todos debemos servir… honor, el honor de proteger…"*

**Lore.** Senda de quienes juran lealtad, servicio y dedicación a los indefensos y necesitados sin clemencia para tiranos o bestias depredadoras. Armaduras pesadas, emblema: león sobre escudo.

**Castigar** (cita): *"Si hay algo que le gusta más a los muchachos que salvaguardar a los inocentes es fustigar a las alimañas." ~ Clayton Siredal, Mariscal de los Leones de Pircar*

> **Mecánicas completas de la Senda del Honor** desarrolladas en la carpeta dedicada `20_Contenido/Senda_Honor/`. La Senda del Honor posee un sistema propio con tres pilares mecánicos únicos:
> - **Atributo Honor (0–99)** — Atributo extra exclusivo, mejora solo por decisión del DM (no por XP). Ver `Senda_Honor/Honor_01_Atributo_Honor.md`.
> - **Juramento Declarado** — Sistema de feats que construyen un juramento progresivo con ventajas mecánicas y narrativas. Ver `Senda_Honor/Honor_02_Juramento_Declarado.md`.
> - **Compromiso Solemne** — Declaración in-game que permite usar Honor en lugar de otra habilidad. Cuesta Mana. Ver `Senda_Honor/Honor_03_Compromiso_Solemne.md`.
>
> Filosofía de diseño y conexión con Veritae en `Senda_Honor/Honor_00_Filosofia_de_Diseño.md` y `Senda_Honor/Honor_04_Veritae_y_Multiclase.md`.

**Nota filosófica.** A diferencia de las demás Sendas, el Honor no demanda bondad ni virtud — demanda **honestidad y carácter**. El atributo Honor mide la alineación entre palabra y acción, no moralidad. Un tirano que cumple sus promesas gana Honor; un héroe que miente lo pierde. Los seguidores de esta Senda son **conductos de la voluntad del mundo**: la realidad misma guía sus acciones cuando sus palabras son verdaderas. *(Canónico — Hassan 2026-08-03.)*

### 12.3 Berserker
**Lore.** La furia y la sed de venganza guían este camino. Definida por la ira y el odio, impulsada por un pánico desesperado por perder lo más preciado.

*"Nuestra Ira es la justicia, Nuestra Furia es nuestra Armadura, Nuestra Rabia es nuestra Herramienta y Vuestra muerte nuestra Paz." ~ Alioth*

**Proficiencias iniciales:** Atletismo, Supervivencia, Coacción (1 experto, 2 entrenadas) + 1 arte marcial entrenada.

**Nivel 1:**
- **Furia.** Generas una carga cuando tú o un aliado reciben daño. Máximo: bono de Voluntad + **Grado de Berserker** (`⌊XP en Berserker ÷ 5⌋`). *(NV eliminado 2026-06-28)*
- **Desquite.** 1/turno, gasta 1 carga para +1d6 (1d8 nv 4, 1d10 nv 8) del mismo tipo en un ataque cualquiera. Si en el d6 sale 1, el arma se rompe. Si lo combinas con Ataque Temerario, se rompe con un 1 en cualquiera de los dos dados; si usas Temerario para anular desventaja y tiras normalmente, se rompe con 1 o 2.
- **Trance.** 1 minuto o hasta que no percibas enemigos. No detenible voluntariamente. Usos/día = Nivel de Voluntad (mín. 1). Tu furia no decrece, ignoras penalizadores de heridas normales (no graves), pero **pierdes tus reacciones defensivas** (Evadir/Rodar, Deflectar/Parry, Interceptar/Cubrirse — §11.9) durante el Trance. No puedes lanzar conjuros. Nv 4+: ventaja en tiradas de Vitalidad y Fuerza; el daño no rompe concentración en hechizos.

**Nivel 2:**
- **Ataque Temerario.** Primer ataque del turno: ventaja en cuerpo a cuerpo y armas arrojadizas; los enemigos tienen ventaja para atacarte hasta el inicio de tu próximo turno.
- **Enemigo Declarado** (acción, declaración interna). Beneficios:
  - +10 ft velocidad acercándote a ese enemigo.
  - Desquite no consume Furia contra él.
  - El miedo no puede impedirte acercarte.
  - El vínculo se rompe sólo si muere; si sigue vivo, debes pasar un descanso largo meditando para cortar el vínculo.
  - Nv 6+: tus armas obtienen propiedad Ágil al atacarlo.

**Nivel 3:** Elige un **talento** (marcial si tienes arte marcial, o mágico si tienes escuela de magia). *(Antes decía "talento universal", pero la categoría Talentos Universales fue eliminada — §15.3. Pendiente Hassan: decidir si los talentos de Senda (§15.2) cubren este hueco, o si hay que reintroducir una categoría general.)* `[ESQUELETO]`

`[ESQUELETO: niveles 4+]`

### 12.4 Elementalista
**Lore.** Fuego, agua, viento y tierra son los elementos del mundo. Suelen ser muy leales a una facción y mostrar simpatía a otros elementalistas (comprenden el balance del mundo).

*"Atrévanse a invadir nuestros hogares… les mostraré una tormenta de fuego y acero." ~ Tanwyn*

**Proficiencias iniciales:** Atletismo, Conocimiento Arcano, Herrería (1 experto, 2 entrenadas) + entrenamiento en **Ignamor**.

**Nivel 1:**
- **Cargas Elementales.** Reserva = mitad de tu **Grado de Elementalista** (`⌊XP en Elementalista ÷ 5⌋`) redondeado arriba. Recuperas 1/hora meditando (incluso en descansos cortos o largos). *(NV eliminado 2026-06-28)*
- **Daño Elemental.** 1d6 → 1d8 (nv 5) → 1d10 (nv 11) → 1d12 (nv 17).
- **Sintonía.** Inmune a efectos negativos de frío o calor extremo (desierto, tundra).
- **Evocación Elemental.** Aprendes los trucos **Proyectil Ígneo, Mordida de Hielo, Chispa Voltaica**. Gasta 1 carga para agregar un dado extra.

**Nivel 2:**
- **Imbución Elemental.** Gasta 1 carga para imbuir un arma en fuego/rayo/hielo durante 1 minuto, +1d6 por carga. 2 cargas a partir de nv 4, 3 a partir de nv 8. **Restricciones de material:**
  - Armas que no sean de **Heliolita** sólo soportan 1 carga de fuego, o se rompen al atacar.
  - Armas que no sean de **Plata Lunar** se quiebran con más de 1 carga de frío.
  - Armas que no sean de **Cristal Brimar** sólo resisten 1 carga eléctrica; con más, se descargan al instante.
- **Potenciación.** Los hechizos y trucos de fuego que lances suman tu bonificador de Voluntad al daño, mientras tengas cargas elementales.

**Nivel 3:**
- **Dedicación.** `[ESQUELETO: la frase queda cortada en M — "Dedicación: Puede"]`

`[ESQUELETO: niveles 4+]`

> **Materiales especiales necesarios:** Heliolita (descrita en §4.1.1), **Plata Lunar** `[ESQUELETO]`, **Cristal Brimar** `[ESQUELETO]`.

### 12.5 Hierofante *(canónico, Hassan — antes "Clérigo" / "Sacerdote")*

*"El Amor que profeso es puro, mi causa hermosa, el Orgullo en lo que nunca seremos nos ciega de la verdadera luz." ~ Mirra*

> **Nombre canónico:** **Hierofante**. A nivel mecánico esta es **siempre la clase** asociada a la senda divina #5 (la de Mirra). El término "Sacerdote" queda reservado, fuera de mecánicas, para **líderes de cultos endógenos** de Kindremor (ej.: el culto del Sol de Aurelia) — esos no son una clase de personaje, son un rol cultural. "Clérigo" queda como sinónimo descriptivo informal pero no como nombre de clase. *[Resuelve INCONG #70]*

**Proficiencias iniciales:** Religión, Historia, Medicina (1 experto, 2 entrenadas) + 1 arte marcial o escuela de magia entrenada.

**Nivel 1:**
- **Intervenciones Divinas.** Los Hierofantes se comunican con Mirra para proteger a los leales y castigar a los impíos. Obtienes Oraciones e Intervenciones.
- **Oraciones.** Establecen conexión con Mirra; bendicen a ti y hasta 12 criaturas acompañantes durante un día. Cambiable en descanso largo.
  - *Feroz Mirra, prestamos tu fuerza para erradicar a los retorcidos:* +1 ataque y daño con ataques físicos o mágicos.
  - *Eres mi luz como yo soy tu siervo, cuida nuestro camino y vela por nuestra fortuna:* Todos ganan un punto de Favor Divino; pueden re-rolar una tirada, pero sólo un punto puede intervenir por tirada.
  - *(La oración "Sagrada Mirra... protégenos del mal" se eliminó por Hassan 2026-05-23.)*
- **Mano de Mirra.** Pozo de Curación = 5 × **Grado de Hierofante** (`⌊XP en Hierofante ÷ 5⌋`) —es decir, ≈ la XP invertida en Hierofante. Acción para tocar a una criatura y sanar los puntos que elijas. *(NV eliminado 2026-06-28)* **5 puntos = sanar una herida.** **20 puntos = sanar herida grave.**

**Nivel 2 — Intervenciones** (se recuperan tras descanso corto):
- **Protección.** Escudo a una criatura como reacción al recibir golpe. Umbral = mitad de Voluntad. Se rompe tras recibir un golpe del umbral; mientras está activo, no sufre daño.
- **Fervor.** Imbuye a una criatura: +2 daño, +10 ft velocidad, -2 penalización por multiataque.
- **Piedad.** Cura una herida y todas las heridas leves de una criatura.
- **Castigo.** Al golpear, infliges +2d8 (1d8 contra aberraciones).

`[ESQUELETO: niveles 3+]`

> **Nota canónica (Hassan).** El cuerpo divino al que sirven los Hierofantes es **Mirra**, y las oraciones llegan a ella directamente. Su alma **no** se reintegró a Naya'il: fue llevada a **Demesteria** (planeta principal del plano del Bien y el Mal, §1.4.1), donde es **emisaria Dríade** y origina el **Milagro**. Desde allí canaliza dones a sus devotos. **Mirra reviviría por su cuenta si regresara a Kindremor**; no necesita ser revivida por Naya'il. El plot mayor del mundo no es "Naya'il necesita el alma de Mirra para revivirla", sino **traer a Mirra de vuelta a Kindremor para que el aspecto Amor de Naya'il fusionado a su alma regrese al mundo material** — sólo así Naya'il puede recomponer su poder. Ver §2.3 y §1.4.0.

### 12.6 Arcanista

**Dote Insignia — Todo o Nada** *(T)*. Los Arcanistas estudian arduamente para lanzar sus conjuros y que no les sean contraproducentes; una de las lecciones más fundamentales es **interrumpir el lanzamiento del conjuro cuando las cosas no son las esperadas**.
- Cuando lances un conjuro y falles, puedes optar por **re-rolear** o **interrumpir el casteo**.
- Si **interrumpes** el casteo, pierdes **1 de Maná** pero nada más sucede.
- Si **re-roleas**, debes quedarte con el resultado final (aunque sea peor).

---

*"No temo los horrores tras el velo, temo la ignorancia sobre nuestro verdadero potencial." ~ Diana*

**Proficiencias iniciales:** Arcana, Lingüística, Arqueología (2 entrenadas, 1 experta) + 1 escuela de magia entrenada.

**Nivel 1:**
- **Conocimiento Prestado.** Al dormir entras en conciencia colectiva → competencia novicio durante un día en un tópico que te interese.
- **Trucos.** Elige 3 trucos de la lista. Trucos = conjuros simples sin esfuerzo de lanzamiento.

**Nivel 2:**
- **Recuperación Superior.** Meditas en vez de dormir. 1 PM por hora meditando. No puedes meditar con fatiga mágica activa ni si mantienes concentración.
- **Expansión de Entendimiento.** Suma nivel de profesión Novicio en una escuela mágica que no conozcas.

**Nivel 3:** Elige un talento elegible.

`[ESQUELETO: niveles 4+]`

### 12.7 Sombra
**Lore.** Senda de especialistas o espías. Buscan cumplir objetivos con rapidez, eficacia y discreción. Suelen moverse en silencio y dentro de organizaciones secretas. Honor, fama y reconocimiento son vergonzosos para ellos: su camino es el de los olvidados.

**Fuente canónica de poder (Hassan 2026-05-28).** Los adeptos de la senda — **los Silentes** — obtienen sus **poderes tétricos** de **la forma actual del primigenio Theledar**: lo que mora en las sombras tras su tránsito al **No Ser** (ver §2.4). La senda **no canaliza la memoria del Theledar vivo** sino su presencia residual y oscurecida. Por eso la senda carga un tono fúnebre, frío y de borradura propio: sus dones vienen de un dios que **eligió no ser** y quedó atrapado en una divinidad que no quería.

**Proficiencias iniciales:** Sigilo, Juego de Manos, Acrobacias, Engaño, Percepción (1 novicio, 2 entrenadas, 1 experta) + 1 escuela de magia o arte marcial entrenada. + competencia experto con herramientas de cerrajero y desarmador.

**Nivel 1:**
- **Sintonía con la oscuridad.** En zona oscurecida, un manto cálido te rodea: suma bono de Voluntad a sigilo. Olor y ruido atenuados. Atacar o lanzar conjuro rompe el velo, pero puedes volver a entrar como acción de turno completo. La oscuridad no te otorga desventaja en combate.
- **Identidad Falsa.** Mentir sobre aspectos de tu vida (senda, facción, etc.) es sencillo. Quienes tienen habilidad para detectar mentiras sólo perciben que "ocultas algo".
- **Agilidad Evasiva.** Acción Destrabarse como acción (no turno completo) mientras no lleves armadura pesada.
- **Asesinato.** *"El Golpe correcto en el momento indicado puede cambiar el rumbo del mundo." ~ Dispater* `[ESQUELETO: Dispater como personaje]`
  - 1/turno, invierte 1-3 acciones. Como parte de la acción, realiza un ataque; al impactar suma tu dado de clase al daño como **daño letal** (tipo especial; quien sea inmune a críticos también lo es a letal). Para usar Asesinato deben cumplirse las condiciones de tu **Estilo de Asesinato**. Sólo puedes realizar una acción con la marca Asesinato por ronda.

**Nivel 2:**
- **Golpe Suertudo.** 1/turno, intenta dar un golpe suertudo con arma o ataque desarmado. Tira 2d6: si sale 7 el golpe es crítico; si no, fallará.

`[ESQUELETO: niveles 3+; Estilos de Asesinato]`

### 12.8 Heraldo

**Premisa (T).** El Heraldo debe ser un **líder y un estratega**, además de ser hábil con la **palabra y la elocuencia**, y sus talentos deben **coaccionar a la party a la victoria**.

**Habilidad Insignia — Comando** *(T)*. **Permite gastar una acción para que otro personaje utilice una acción en tu lugar.**

**Lore (M).** Las palabras son poderosas: mueven ejércitos y derrumban imperios. Senda de elocuencia, estrategia y persuasión. Mediante **edictos** los heraldos imponen su presencia y voluntad en el entorno.

**Tomo doctrinal canónico — El Lexicón Marcial** *(canónico, Hassan 2026-05-28)*. Compilado por **Rayan la Elocuente** (§2.8) durante la guerra contra Amaru y **conservado como texto sagrado** tras la victoria. Codifica logística, trato de tropas, distribución de mando y la estrategia profunda dríade (combate aéreo, los grandes conjuros como activos estratégicos, tipologías de bestias y contramedidas). Es el corpus doctrinal de referencia para todo Heraldo que aspire a comando real, no sólo de party — varios cuerpos militares y académicos toman su texto.

**Proficiencias iniciales:** Persuasión, Engaño, Perspicacia (2 entrenadas, 1 experta) + 1 arte marcial o escuela de magia entrenada.

**Nivel 1:**
- **Resolución de órdenes y edictos *(actualizado — Hassan 2026-06-29)*.** Las órdenes y edictos del Heraldo se resuelven con **tirada enfrentada de Carácter** del Heraldo contra el atributo defensor del objetivo (normalmente **Voluntad**), igual que *Orden imperiosa*. *(Reemplaza "Potencia de Orden" y "Salvación de Carácter = 8 + mod + competencia", que eran fórmula de CD/PF2.)*
- ~~**Carisma desarmante.**~~ *(Olvidado por Hassan 2026-05-23 — pendiente de reformulación sin CA.)*
- **Proyectar voz.** Mensaje de 30 palabras audible a 500 m, tantas veces/día como bono de Voluntad. Si tienes que hacer tirada de Engaño/Persuasión asociada, ventaja en esa tirada.
- **Vocalización maestra.** Si un conjuro tiene componente verbal, puedes ignorar el componente somático.
- **Orden imperiosa.** Acción: ordenar a una criatura que realice una acción no agresiva ni dañina. Se resuelve con una **tirada opuesta: Carácter (Heraldo) vs Voluntad (objetivo)**. Si el Heraldo gana la oposición, la criatura debe cumplir la demanda en el momento: si tiene reacción, la gasta; si no, gana una acción extra para cumplir.

**Nivel 2 — Edictos.** Órdenes imperiosas que rigen un espacio determinado y afectan a las criaturas que entren. Para desobedecer un edicto, enfrentada de Voluntad del objetivo contra tu Carácter. Elige 2 al principio; cambiables al subir nivel. Si usas **Proyectar Voz** al pronunciar el edicto, gastas 2 usos de Proyectar Voz y sumas tu bono de Voluntad a la tirada. Usos/día: 1 (nv 1-4), 2 (5-8), 3 (9+). Sólo uno activo al mismo tiempo; si dos áreas de edicto colisionan, el de mayor nivel de Heraldo decide si reemplaza o comparte el área.
- **Edicto de la Paz.** 200 ft². Las criaturas no pueden atacar ni causar efectos agresivos sobre otras. Si son atacadas pueden superar salvación y actuar normalmente; si se mantienen en paz tras el ataque, el atacante queda sometido al edicto. 1 minuto.
- **Edicto de la Vida.** 200 ft, 10 minutos. Dificulta la muerte; los que caen agonizando o están agonizando superan sus salvaciones de agonía. Los milagros curativos duplican efectos.
- **Edicto del Silencio.** 300 ft, 1 minuto. No se produce ningún sonido; inmunidad al daño de trueno. Salvación para hablar.
- **Edicto de la Verdad.** 100 ft. Las criaturas hablan con sinceridad; mentir requiere salvación. El Heraldo nota a quien falla la salvación intentando mentir (no a quien la supera). Magias de engaño más fáciles de detectar.
- **Edicto del Coraje.** 200 m, 1 minuto. Las criaturas elegidas ganan un bono a tiradas de ataque y daño con armas; no pueden ser asustadas. *(Bono +2 olvidado por Hassan 2026-05-23 — pendiente de redefinir en escala 1d100.)*
- **Edicto de la Muerte.** 100 ft, 1 minuto. Las heridas no sanan; sanar requiere salvación. Duplica el número de heridas recibidas.

`[ESQUELETO: niveles 3+; más edictos]`

### 12.9 Cazador
**Lore.** Viven alejados de las grandes ciudades. Buscan mantener el equilibrio y la amistad con las bestias leales a Naya'il. Su misión: dar caza a aberraciones y monstruosidades.

**Proficiencias iniciales:** Supervivencia, Naturaleza, Movimiento Silencioso (2 entrenadas, 1 experta). Elige una entre Peletería, Alquimia o Herrería para estar entrenado. + 1 arte marcial entrenada.

**Nivel 1:**
- **Rastreador.** Examinar huellas, rastros y marcas → deducir tamaño, constitución, fuerza y tipos de daño de la criatura.
- **Arma Dedicada.** Elige tipo de arma (espadas, hachas, boomerangs, arcos, ballestas, látigos, etc.). Sumas un bono al daño con ese tipo. *(Bono +2 olvidado por Hassan 2026-05-23 — pendiente de redefinir en escala 1d100.)*

**Nivel 2:**
- **Recolección.** Al eliminar una criatura a la que infligiste heridas, extraes materiales para crear **equipo de cazador**. Sólo tú puedes portarlo (tu espíritu depredador asimila a las presas). Piezas portables: 2 (nv 1-4), 3 (nv 5-8), sin límite (nv 9+). Imitan propiedades de la criatura (resistencia al fuego, daño veneno, etc.).

`[ESQUELETO: niveles 3+]`

### 12.10 Monje
**Lore.** No siguen senda predestinada. Crean la suya propia mediante entrenamiento y manipulación del propio espíritu y cuerpo. Fomentan desapego a posesiones materiales, humildad, compasión y dedicación.

**Proficiencias iniciales:** Acrobacias, Percepción, Perspicacia, Historia (2 entrenadas, 1 experta, 1 novicio). + competencia con **Artes Monásticas** a nivel entrenado.

**Nivel 1:**
- **Artes Marciales.** Ataques desarmados ganan propiedad Ágil; usas Agilidad en lugar de Fuerza.
- **Instinto Defensivo.** Sin armadura pesada ni mediana: reacción gratis usable sólo como reacción defensiva, o para AdO con ataque desarmado cuando un enemigo falla un ataque contra ti.
- ~~**Defensa sin Armadura.**~~ *(Olvidado por Hassan 2026-05-23 — pendiente de reformulación sin CA.)*

**Nivel 2 — Manipulación de Ki.** Medita 1 hora en descanso corto o largo para canalizar tu voluntad en una postura.
- **Tigre.** Suma bono de Voluntad al daño con desarmados.
- **Mono.** Suma mitad (redondeado abajo) del bono de Voluntad al daño con un arma que sostengas.
- **Águila.** Suma bono de Voluntad al daño con dichas armas. `[ESQUELETO: ¿"dichas armas" se refiere a las arrojadizas? — el contexto se cortó]`
- **Ciervo.** +5 ft velocidad por punto de bono de Voluntad; lo mismo a distancia de salto.
- **Cuervo.** Suma bono de Voluntad al daño de tus trucos y conjuros.

**Deflectar flechas.** Como reacción defensiva, atrapa flechas y armas arrojadizas. Tirada de **Agilidad** que iguale o supere la tirada de ataque enemiga. Puedes contraatacar con ese proyectil (tirada de ataque del estilo monástico, daño de ataque desarmado).

`[ESQUELETO: niveles 3+; posturas adicionales: Toro, Serpiente, etc.]`

> **Nota canónica (Hassan).** El Monje es la **Senda de la Libertad**, descubierta por Gideon. Es **no divina** (sin primigenio asociado) pero mecánicamente idéntica a las divinas. No tiene restricciones mecánicas adicionales por su carácter no divino. Ver §1.2.

### 12.11 Otras Sendas — Esqueletos
- **Bufón** — Senda no-divina. `[ESQUELETO: lore y mecánicas]`
- **~~Senda del Vacío / Ocultismo~~** — **Fusionada canónicamente** con la **Senda del Silente / Sombras** (los tres nombres son sinónimos, ver §12.8). No es una décima senda.
- **~~Senda propia de Gideon~~** — Es la **Senda del Monje / de la Libertad** (§12.10). No es una senda independiente: es exactamente la senda del Monje que Gideon descubrió y dejó para sus seguidores.
- **Druidismo** — Implicado por el rito "Iniciación Druídica" (§16). `[ESQUELETO]`

---
