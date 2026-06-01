# Tateti Alienígena Inteligente - Cerebro Neural Adaptativo 🛸👽

Este es un juego interactivo de **Tateti (Tic-Tac-Toe)** desarrollado con una interfaz futurista/alienígena. Cuenta con una Inteligencia Artificial integrada que utiliza una red neuronal profunda en **TensorFlow.js**. La IA posee un mecanismo de **aprendizaje adaptativo en tiempo real** que le permite recordar y corregir sus errores partida tras partida, optimizándose en el propio navegador.

Desarrollado por **Maxi Colman**.

---

## 🚀 Características Clave

1. **Inteligencia Artificial con TensorFlow.js**: 
   - El juego carga un modelo preentrenado local (`model/ttt_model.json`).
   - Cuenta con un **fallback orgánico** en el frontend: si el navegador detecta restricciones de CORS (al abrir el archivo HTML de manera local), inicializa y compila instantáneamente una red neuronal equivalente en memoria.
2. **Aprendizaje Continuo en Caliente (Bucle de Memoria)**:
   - Al terminar cada partida, la IA analiza sus jugadas.
   - **Si pierde**, el modelo es reentrenado con `model.fit()` penalizando la jugada fallida (probabilidad de esa casilla establecida a `0`) y redistribuyendo la probabilidad en las celdas vacías alternativas.
   - **Si gana**, la jugada exitosa es reforzada (one-hot vector `1.0` para esa celda).
   - **Persistencia**: Los pesos actualizados se guardan dinámicamente en el `localStorage` del navegador, logrando que el "cerebro" de la IA mantenga los conocimientos adquiridos incluso al recargar la página.
3. **Visor de Calor ("Visión IA")**:
   - Al activar la Visión IA, se proyecta un mapa de calor magenta sobre las casillas vacías del tablero indicando las probabilidades normalizadas que la IA asigna a cada celda.
4. **Análisis Táctico en Tiempo Real**:
   - Un panel lateral dinámico muestra los porcentajes exactos de decisión de la IA antes de cada jugada mediante barras de energía interactivas.
5. **Historial Táctico de Partida**:
   - Al finalizar un juego, se genera un desglose paso a paso de cada turno de la IA, mostrando diagramas del tablero miniatura, el movimiento realizado y el estado de probabilidades en ese instante.
6. **Sintetizador de Audio Sci-Fi Integrado**:
   - Implementado usando la **Web Audio API** nativa del navegador. Genera ondas sinusoidales, triangulares y de sierra con filtros de paso bajo para reproducir sonidos de láseres, chimes de victoria, drones alienígenas y blips de entrenamiento neural sin necesidad de cargar archivos de audio externos.
7. **Estética Visual Inmersiva (Dark Mode / Alien)**:
   - Paleta de colores cósmica (negros profundos, violetas, cianes y verdes neón).
   - Estrellas de fondo animadas con CSS, efectos glassmórficos con desenfoque de fondo y luces parpadeantes.

---

## 🧠 Arquitectura de la Red Neuronal

La IA está sustentada por una red neuronal artificial secuencial con la siguiente topología:
- **Entrada (9 neuronas)**: Representan el estado actual del tablero (1D vector) desde la perspectiva de la IA (`1` para fichas de la IA 👽, `-1` para fichas del Humano 🛸, `0` para casillas vacías).
- **Capa Oculta 1 (64 neuronas)**: Densamente conectada con activación `ReLU`.
- **Capa Oculta 2 (64 neuronas)**: Densamente conectada con activación `ReLU`.
- **Capa de Salida (9 neuronas)**: Densamente conectada con activación `Softmax` para generar una distribución de probabilidad de conveniencia para las 9 celdas.

---

## 📦 Estructura del Proyecto

El código está estructurado de manera modular y limpia:
```bash
tateti/
├── simple-ttt-model/
│   ├── index.html        # Estructura del dashboard y maquetación responsiva
│   ├── style.css         # Diseño alienígena, animaciones neón y estrellas
│   ├── app.js            # Lógica del juego, entrenamiento neural y sintetizador de audio
│   ├── ttt_states.jpg    # Diagrama de referencia del modelo
│   └── model/
│       ├── ttt_model.json          # Archivo de arquitectura del modelo preentrenado
│       └── ttt_model.weights.bin   # Pesos binarios del modelo preentrenado
└── README.md             # Este archivo descriptivo de presentación
```

---

## 🛠️ Instalación y Uso

Para ejecutar el juego localmente, puedes usar cualquier servidor web estático sencillo para evitar problemas de CORS del modelo TensorFlow.js local:

### Opción 1: Usando Python (Recomendado)
Abre una terminal en la carpeta `/simple-ttt-model` y ejecuta:
```bash
python -m http.server 8000
```
Luego, abre tu navegador e ingresa a: **`http://localhost:8000`**

### Opción 2: Usando Node.js / NPX
Ejecuta en tu terminal:
```bash
npx serve simple-ttt-model
```
Y abre la dirección de host local indicada.

### Opción 3: Ejecución directa sin servidor
Puedes dar doble clic al archivo `index.html` y abrirlo directamente. El juego iniciará de forma automática en modo de red neuronal orgánica autogenerada.

---

## 🎯 Instrucciones para Probar el Aprendizaje Neural

Para validar que la IA aprende de sus errores:
1. Inicia una partida y busca ganar empleando una trampa simple (ej. armar una línea en diagonal colocando fichas en las posiciones `0` y `4`).
2. Si la IA no está entrenada aún en ese escenario, jugará en una casilla diferente sin bloquear tu victoria.
3. Completa la partida ganando. Observarás que el panel de **Bitácora de Aprendizaje Neural** se ilumina en color fucsia indicando: `[LEARN] Optimizando red neural por 16 épocas...`.
4. Escucharás una serie de chirridos de carga de datos sintetizados.
5. Inicia una nueva partida y **repite exactamente los mismos movimientos del juego anterior**.
6. Activa la **Visión IA** u observa el panel de **Análisis Táctico**. Notarás que el porcentaje de la casilla de bloqueo (`8`) ha ascendido notablemente y la IA jugará allí para detener tu jugada, demostrando que asimiló su error y modificó su comportamiento.
