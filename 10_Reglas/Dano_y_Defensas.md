# Daño y Defensas

> **Separado para revisión.** Texto trasladado sin corregir sus reglas, notas históricas ni pendientes. La limpieza se realizará después de esta separación.

### 11.5 Tipos de Daño y Resistencias *(canónico — Hassan)*

#### Clasificación de las amenazas

Cada amenaza que inflige daño indica su **categoría de fuente**, su **medio de ataque** y su **tipo de daño**. La categoría indica si una barrera física puede interponerse. El medio describe cómo llega la amenaza. El tipo indica qué mitigación general corresponde.

**Categoría de fuente**

- **Física.** El daño llega mediante un agente externo tangible que una barrera física puede interceptar si se interpone en su trayectoria. Los golpes con el cuerpo o con armas, los proyectiles de hielo y las llamas directas llevan el tag `Físico`.
- **Energética.** El efecto requiere una barrera especializada para impedirlo. El calor y el frío ambientales, los efectos psíquicos, los rayos eléctricos, el veneno en el aire o dentro del organismo y las maldiciones son fuentes energéticas.

**Medio de ataque**

- **Melee.** Una criatura, artefacto o entidad golpea cuerpo a cuerpo con una parte de su cuerpo, un arma o una pieza móvil.
- **Proyectil.** Una munición, arma arrojadiza o misil de origen mágico, biológico o de otra clase viaja hacia el objetivo.
- **Área de efecto.** La amenaza afecta una zona, como una explosión, un tsunami o el aliento de un dragón.
- **Directo.** El efecto actúa directamente sobre el individuo, como una maldición, un veneno que ya está en su organismo o un hechizo que obra directamente sobre él.

| Ataque | Categoría de fuente | Medio | Tipo de daño |
|---|---|---|---|
| Flecha | Física | Proyectil | Punzante |
| Espadazo | Física | Melee | Cortante |
| Bola de fuego | Física | Área de efecto | Fuego |
| Rayo eléctrico dirigido | Energética | Proyectil | Rayo |
| Maldición necrótica | Energética | Directo | Necrótico |

#### Tipos de daño y mitigación

**Tipos de daño**

1. **Punzante** *(cortante, punzante y contundente son los tipos de daño cubiertos por los valores x/y/z de las armaduras)*
2. **Cortante**
3. **Contundente**
4. **Fuego**
5. **Frío**
6. **Rayo** *(canónico, no "Eléctrico")*
7. **Necrótico**
8. **Radiante**
9. **Espiritual**
10. **Sónico** 
11. **Verdadero** *(daño plano que ignora mitigaciones — daño puro)*
12. **Ácido**
13. **Psíquico**
14. **Toxinas**

Para el daño de Toxinas, la amenaza concreta determina el medio de ataque y la categoría de fuente. Los efectos particulares de cada veneno se describen en su ficha según las [reglas de venenos y antídotos](Reglas_de_Venenos_y_Antidotos.md).

**Mitigación por tipo (matriz canónica):**

| Tipo de daño | Mitigación | Lectura |
|---|---|---|
| Punzante | Dureza + Armadura física (Punzante / **y** en x/y/z) | Vitalidad protege; armadura por tipo |
| Cortante | Dureza + Armadura física (Cortante / **x** en x/y/z) | Vitalidad protege; armadura por tipo |
| Contundente | Dureza + Armadura física (Contundente / **z** en x/y/z) | Vitalidad protege; armadura por tipo |
| Fuego | Dureza | Vitalidad protege |
| Frío | Dureza | Vitalidad protege |
| Rayo | Dureza | Vitalidad protege |
| Ácido | Dureza + (Resistencia adicional) | Vitalidad + mod. específicos |
| **Sónico** | Dureza *(salvo modificadores)* | Sonido; Vitalidad protege parcialmente. `[ESQUELETO: fórmula canónica]` |
| **Radiante** | [ESQUELETO: Voluntad o Carácter, pendiente de definir.] | |
| **Necrótico** | Nivel de Vitalidad + (Resistencia espiritual menor) | Drena vida; Vitalidad protege parcialmente. `[ESQUELETO: fórmula canónica]` |
| **Espiritual** | **Nivel de Voluntad** | Vitalidad **NO** protege; sólo la fuerza del alma |
| **Psíquico** | **Nivel de Inteligencia** | Vitalidad **NO** protege; sólo la fuerza de la mente |
| **Toxinas** | Sin mitigación general especificada | Consultá la ficha del efecto. |
| **Verdadero** | **Ninguna mitigación** | Daño plano. Ignora Dureza, armadura y resistencias. |

> La tabla indica cuándo protege Vitalidad. El daño Espiritual depende de Voluntad y el Psíquico de Inteligencia.

**Modificadores de daño aplicables**
- **Frágil (X val)** — Suma X val.
- **Protección (X val)** — Resta X val.
- **Debilidad** — Duplica el daño.
- **Resistencia** — Daño a la mitad.
- **Afinidad** — Lo ganas como puntos de golpe.

**Magia y almas.** *(fuente: T — Spellcasting)* La magia emana del alma. Las criaturas con alma poseen resistencia natural a efectos mágicos; las criaturas sin alma son tratadas por la magia como meros objetos materiales. Magia y alma tienden a respetarse mutuamente por su origen divino común — pero la magia sigue siendo devastadora contra criaturas espirituales como los dríades.

#### Apéndice — Alcance de las defensas y modificadores de daño

Al diseñar criaturas, dotes, equipo o efectos, podés definir **defensas, mitigaciones, Protecciones, Resistencias, Fragilidades, Debilidades, vulnerabilidades y Afinidades** contra cualquier rasgo identificable de un ataque. La condición puede referirse a la categoría de fuente, el medio, el tipo de daño, el origen, el arma, un tag o una combinación de rasgos.

- Un **enjambre (Swarm)** puede tener **Debilidad a Área de efecto**, sea física o energética.
- Un **ser de acero** puede tener **Resistencia a fuentes Físicas**, aunque un espadazo, un proyectil de hielo y una llamarada inflijan tipos de daño distintos.
- Una **dote** puede dar **Protección 2 contra Proyectiles Físicos**. El ataque debe cumplir ambas condiciones.

Especificá en la ficha qué rasgo activa la regla y qué efecto produce. Si modifica una excepción general, como la del **daño Verdadero**, indicá expresamente cómo interactúa con ella.

## Dureza y conversión de daño — bloques trasladados de §11.3

**Conversión Daño → Heridas.** *(fuente: T)*
> **Heridas ganadas = Daño − (Nivel de Vitalidad + Armadura)**

**Dureza** *(fuente: X)*. Cuando corresponde aplicar Dureza (§11.5), usá la siguiente fórmula.
> **Dureza = Nivel de Vitalidad** *(`D24 = D9`)*

