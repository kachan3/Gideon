# Vigoris Mortis

> *"La carne viva se desgarra y sangra; el alma imbuida del sepulcro, en cambio, devora el impacto y lo transfigura en pura energía arcana."*

* **Tag de Senda:** `Arcanista` (Flujo: `Yrgrammar`).
* **Coste de Adquisición:** **2 XP** (arranca en **Nivel 1**).
* **Prerrequisito:** Poseer al menos **50 puntos en la habilidad de Yrgrammar** ($\text{Yrgrammar} \ge 50$).
* **Progresión y Niveles:** Este dote es escalable. Puede mejorarse invirtiendo **2 XP adicionales por cada nivel**, hasta un máximo de **Nivel 5**:
  - **Nivel 1:** Adquisición inicial (2 XP invertidos).
  - **Nivel 2:** +2 XP (4 XP acumulados en el dote).
  - **Nivel 3:** +2 XP (6 XP acumulados en el dote).
  - **Nivel 4:** +2 XP (8 XP acumulados en el dote).
  - **Nivel 5 (Maestría Máxima):** +2 XP (10 XP acumulados en el dote).

#### Mecánica de Redirección de Daño
Al recibir daño físico —**después de haber aplicado todas las resistencias y el valor de Dureza (*Toughness*)**—, el lanzador puede optar voluntariamente por **redirigir ese daño físico restante hacia su reserva de Maná**.

* **Tasa de Conversión:** Por cada **1 PM de Maná consumido**, se absorben y neutralizan puntos de daño físico iguales al **Nivel actual del Dote** ($\text{LV del Feat}$):

| Nivel de Vigoris Mortis | Inversión Total XP | Daño Físico absorbido por cada 1 PM |
|:---:|:---:|:---:|
| **Nivel 1** | 2 XP | **1 punto** de daño físico |
| **Nivel 2** | 4 XP | **2 puntos** de daño físico |
| **Nivel 3** | 6 XP | **3 puntos** de daño físico |
| **Nivel 4** | 8 XP | **4 puntos** de daño físico |
| **Nivel 5** | 10 XP | **5 puntos** de daño físico |

*Ejemplo:* Un arcanista con *Vigoris Mortis (Nivel 3)* sufre un impacto físico que deja 9 puntos de daño tras descontar Dureza y armadura. Decide activar el dote: a una tasa de 3 puntos de daño por cada 1 PM, redirige los 9 de daño consumiendo 3 PM.

#### Sinergia con la Senda del Arcanista: Optimización de Maná
Este dote interactúa directamente con la Habilidad Insignia **Eficiencia** del Arcanista ([Habilidades insignia](../Senda_Arcanista/Arcanista_01_Habilidades_Insignia.md)):
* Al gastar Maná para absorber daño con *Vigoris Mortis*, **aplica la optimización de Eficiencia** (**pagas 2 PM por cada 3 PM de gasto**, fórmula $\text{Coste Real} = \text{Coste Original} - \lfloor\text{Coste Original}/3\rfloor$).
* *Continuando el ejemplo:* Si el coste para absorber los 9 puntos de daño era de 3 PM, gracias a Eficiencia el arcanista paga únicamente **2 PM**.

#### Interacción con Límite Seguro y Daño Crónico (§13.1)
El Maná consumido mediante *Vigoris Mortis* después de aplicar Eficiencia cuenta como gasto a efectos del [Límite Seguro y el Daño Crónico](../../10_Reglas/Core_13_Sistema_de_Magia_y_Energia.md).

`[ESQUELETO: ¿La redirección consume una Reacción defensiva formal (§11.9), o es una decisión pasiva/libre al recibir el daño? ¿Existe un tope máximo de daño absorbible por impacto/turno, o el único límite es el Maná disponible del lanzador? — Hassan a definir]`
