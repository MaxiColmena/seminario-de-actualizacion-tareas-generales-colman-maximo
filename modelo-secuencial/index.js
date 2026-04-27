// DOM Elements
const trainBtn = document.getElementById('train-btn');
const predictBtn = document.getElementById('predict-btn');
const predictInput = document.getElementById('predict-input');
const predictionOutput = document.getElementById('prediction-output');
const trainingStatus = document.getElementById('training-status');
const modelStatus = document.getElementById('model-status');

// Create a simple model.
let model;

function createModel() {
    model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
}

async function trainModel() {
    // UI Update: Disable buttons and show training state
    trainBtn.disabled = true;
    trainBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrenando...';
    trainingStatus.innerHTML = '<i class="fas fa-info-circle"></i> Entrenando modelo con y = 2x + 6...';
    trainingStatus.parentElement.classList.add('training');

    // Generate 9 synthetic data points for training: y = 2x + 6
    const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4, 5, 6, 7], [9, 1]);
    const ys = tf.tensor2d([4, 6, 8, 10, 12, 14, 16, 18, 20], [9, 1]);

    // Train the model
    await model.fit(xs, ys, {
        epochs: 500,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                trainingStatus.innerHTML = `<i class="fas fa-sync fa-spin"></i> Entrenando... Época: <strong>${epoch + 1}</strong>/500`;
                if (epoch % 50 === 0) {
                    console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
                }
            }
        }
    });

    // UI Update: Training complete
    trainBtn.innerHTML = '<i class="fas fa-check"></i> Entrenamiento Completo';
    trainingStatus.innerHTML = '<i class="fas fa-check-circle"></i> Modelo entrenado exitosamente.';
    trainingStatus.style.background = '#d1fae5';
    trainingStatus.style.color = '#059669';
    
    modelStatus.textContent = 'Entrenado';
    modelStatus.classList.add('trained');
    predictBtn.disabled = false;
}

function predict() {
    const val = parseFloat(predictInput.value);
    if (isNaN(val)) return;

    const output = model.predict(tf.tensor2d([val], [1, 1]));
    const result = output.dataSync()[0];
    
    // Smooth transition for result
    predictionOutput.style.opacity = 0;
    setTimeout(() => {
        predictionOutput.textContent = result.toFixed(2);
        predictionOutput.style.opacity = 1;
        predictionOutput.style.transition = 'opacity 0.3s ease';
    }, 100);
}

// Event Listeners
trainBtn.addEventListener('click', trainModel);
predictBtn.addEventListener('click', predict);

// Initialize
createModel();