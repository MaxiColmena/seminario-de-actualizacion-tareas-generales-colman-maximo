# TensorFlow.js - Regresión Lineal Secuencial
**Autor:** Máximo Colman

Este proyecto es una implementación interactiva de un modelo de aprendizaje automático (Machine Learning) utilizando la biblioteca **TensorFlow.js**. La aplicación entrena una red neuronal simple para aprender la relación matemática entre dos conjuntos de números.

## 🚀 ¿Qué hace este modelo?

El modelo implementa una **Regresión Lineal**, que es una técnica estadística utilizada para predecir el valor de una variable según el valor de otra. En este caso específico, el modelo está diseñado para aprender la ecuación:

**y = 2x + 6**

### Detalles Técnicos:
- **Arquitectura:** Se utiliza un modelo `tf.sequential()` con una sola capa densa (`tf.layers.dense`) que contiene una única neurona.
- **Entrenamiento:** El modelo se entrena durante **500 épocas** utilizando 9 pares de datos (x, y). 
- **Optimizador:** Utiliza el optimizador de **Descenso de Gradiente Estocástico (SGD)**.
- **Pérdida:** Se utiliza el **Error Cuadrático Medio (MSE)** para medir qué tan cerca está el modelo de la respuesta correcta durante el entrenamiento.

## 🧠 ¿Cómo se realiza la predicción?

La predicción no es una simple búsqueda en una tabla, sino el resultado de un proceso de aprendizaje:

1.  **Entrenamiento:** Durante las 500 épocas, el modelo "mira" los 9 ejemplos proporcionados (como x=0, y=6; x=1, y=8, etc.). A través del optimizador, ajusta dos parámetros internos: el **peso** (que debería acercarse a 2) y el **sesgo** (que debería acercarse a 6).
2.  **Inferencia (Predicción):** Cuando ingresas un valor (x) y presionas "Predecir", el modelo toma ese número y lo pasa por su neurona entrenada.
3.  **Cálculo:** La neurona realiza la operación matemática: `resultado = (valor_ingresado * peso) + sesgo`.
4.  **Resultado:** El valor obtenido es la predicción. Debido a que es un modelo probabilístico, el resultado será extremadamente cercano a la respuesta matemática exacta (por ejemplo, para x=4, el resultado será algo muy cercano a 14.00).

## 🛠️ Tecnologías utilizadas

- **HTML5 & CSS3:** Para una interfaz moderna, responsiva y con estética premium.
- **JavaScript (ES6+):** Para la lógica de interacción y control del DOM.
- **TensorFlow.js:** Para la creación, entrenamiento y ejecución del modelo de Machine Learning directamente en el navegador.

---
*Proyecto desarrollado como parte del Seminario de Actualización - Tareas Generales.*
