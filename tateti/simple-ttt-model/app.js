// Ticky Tacky Alien Toe - Neural Controller
// AI plays as 1 (👽), Human plays as -1 (🛸), Empty is 0

// Game State
let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let currentPlayer = -1; // Human starts
let gameActive = false;
let model = null;
let modelLoaded = false;
let scores = { player: 0, ai: 0, draws: 0 };
let currentTurnHistory = []; // Tracks states and actions in current game
let aiVisionActive = false;

// Web Audio API Sound Synthesizer
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSciFiSound(type) {
  try {
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    
    if (type === 'hover') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } 
    else if (type === 'click-player') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.15);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } 
    else if (type === 'click-ai') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
      
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(8, now);
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.18);
      
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + 0.21);
    }
    else if (type === 'win') {
      // Ascending alien melody
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C E G C E G
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        osc.frequency.setValueAtTime(freq * 1.5, now + i * 0.07 + 0.05); // modulation
        gain.gain.setValueAtTime(0.05, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.09);
      });
    }
    else if (type === 'loss') {
      // Low drone with frequency decay
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(120, now);
      osc1.frequency.linearRampToValueAtTime(40, now + 0.8);
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(122, now); // beating effect
      osc2.frequency.linearRampToValueAtTime(41, now + 0.8);
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.81);
      osc2.stop(now + 0.81);
    }
    else if (type === 'draw') {
      // Metallic space chime
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, now);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(440 * 2.414, now); // inharmonic ratio
      
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.41);
      osc2.stop(now + 0.41);
    }
    else if (type === 'train-blip') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.03);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch (e) {
    console.error("Audio error:", e);
  }
}

// Write to the customized Neural Log
function logToConsole(text, type = 'info') {
  const consoleLog = document.getElementById('consoleLog');
  if (!consoleLog) return;
  
  const line = document.createElement('div');
  line.className = 'console-line';
  
  const time = new Date();
  const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
  
  let badge = '[SYSTEM]';
  let badgeClass = 'info';
  if (type === 'success') { badge = '[MEM-OK]'; badgeClass = 'success'; }
  else if (type === 'alert') { badge = '[LEARN]'; badgeClass = 'alert'; }
  else if (type === 'warn') { badge = '[CORS]'; badgeClass = 'warn'; }
  
  line.innerHTML = `
    <span class="timestamp">${timeStr}</span>
    <span class="status-badge ${badgeClass}">${badge}</span>
    <span class="message">${text}</span>
  `;
  
  consoleLog.appendChild(line);
  consoleLog.scrollTop = consoleLog.scrollHeight;
}

// SVGs for player symbols
const playerSaucerSvg = `
<svg viewBox="0 0 100 100" class="symbol-icon player-saucer">
  <path d="M50,20 C60,20 68,26 68,34 C68,40 50,44 50,44 C50,44 32,40 32,34 C32,26 40,20 50,20 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="50" cy="55" rx="35" ry="12" fill="none" stroke="currentColor" stroke-width="5"/>
  <line x1="25" y1="62" x2="15" y2="78" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
  <line x1="50" y1="67" x2="50" y2="85" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
  <line x1="75" y1="62" x2="85" y2="78" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
  <circle cx="30" cy="55" r="3" fill="currentColor"/>
  <circle cx="50" cy="55" r="3" fill="currentColor"/>
  <circle cx="70" cy="55" r="3" fill="currentColor"/>
</svg>`;

const aiAlienSvg = `
<svg viewBox="0 0 100 100" class="symbol-icon ai-alien">
  <path d="M50,15 C25,15 15,35 15,55 C15,75 35,85 50,85 C65,85 85,75 85,55 C85,35 75,15 50,15 Z" fill="none" stroke="currentColor" stroke-width="5"/>
  <path d="M32,48 Q40,38 43,48 Q40,55 32,48 Z" fill="currentColor"/>
  <path d="M68,48 Q60,38 57,48 Q60,55 68,48 Z" fill="currentColor"/>
  <path d="M42,68 Q50,72 58,68" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
</svg>`;

// Create Neural Network Model from Scratch
function createModel() {
  const m = tf.sequential();
  m.add(tf.layers.dense({
    units: 64,
    activation: 'relu',
    inputShape: [9]
  }));
  m.add(tf.layers.dense({
    units: 64,
    activation: 'relu'
  }));
  m.add(tf.layers.dense({
    units: 9,
    activation: 'softmax'
  }));
  
  m.compile({
    optimizer: tf.train.adam(0.015),
    loss: 'categoricalCrossentropy'
  });
  return m;
}

// Load Model
async function loadNeuralModel() {
  logToConsole("Iniciando conexión neural...");
  
  // Try loading from localStorage first
  try {
    model = await tf.loadLayersModel('localstorage://alien-ttt-model');
    model.compile({
      optimizer: tf.train.adam(0.015),
      loss: 'categoricalCrossentropy'
    });
    modelLoaded = true;
    logToConsole("Cerebro neural cargado desde almacenamiento local.", "success");
    return;
  } catch (e) {
    console.log("No saved model found in localStorage. Loading default model...");
  }
  
  // Try loading from filesystem
  try {
    model = await tf.loadLayersModel('model/ttt_model.json');
    model.compile({
      optimizer: tf.train.adam(0.015),
      loss: 'categoricalCrossentropy'
    });
    modelLoaded = true;
    logToConsole("Cerebro neural por defecto cargado exitosamente.", "success");
  } catch (e) {
    console.error("CORS or loading error: ", e);
    logToConsole("CORS/Protocolo local detectado. Creando cerebro neural orgánico in-browser...", "warn");
    
    // Build and compile model locally
    model = createModel();
    modelLoaded = true;
    logToConsole("Cerebro neural orgánico creado e inicializado.", "success");
  }
}

// Start Game
function initGame() {
  board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  currentPlayer = -1; // Human goes first
  gameActive = true;
  currentTurnHistory = [];
  
  // Clean UI
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.innerHTML = `
      <div class="probability-overlay" id="overlay-${cell.dataset.index}">0%</div>
    `;
    cell.className = 'cell empty';
    cell.style.background = '';
  });
  
  updateStatusAlert();
  updateRealTimeAnalysis();
  
  // If AI vision is enabled, calculate and show initial overlay
  if (aiVisionActive) {
    showAIPredictionOverlay();
  }
  
  logToConsole("Nueva partida iniciada. Turno del Humano (🛸).");
}

// Load saved scores
function loadScores() {
  const saved = localStorage.getItem('alien_ttt_scores');
  if (saved) {
    try {
      scores = JSON.parse(saved);
      updateScoreboard();
    } catch (e) {
      console.error(e);
    }
  }
}

function updateScoreboard() {
  document.getElementById('scorePlayer').textContent = scores.player;
  document.getElementById('scoreAI').textContent = scores.ai;
  document.getElementById('scoreDraws').textContent = scores.draws;
  localStorage.setItem('alien_ttt_scores', JSON.stringify(scores));
}

function updateStatusAlert(stateStr) {
  const alertEl = document.getElementById('statusAlert');
  alertEl.className = 'status-alert';
  
  if (stateStr === 'win-player') {
    alertEl.textContent = '¡Victoria Humana! Sistema AI vulnerado.';
    alertEl.classList.add('win-player');
  } else if (stateStr === 'win-ai') {
    alertEl.textContent = 'Victoria Alienígena. Intelecto IA superior.';
    alertEl.classList.add('win-ai');
  } else if (stateStr === 'draw') {
    alertEl.textContent = 'Empate. Fuerza táctica neutralizada.';
    alertEl.classList.add('win-draw');
  } else {
    if (currentPlayer === -1) {
      alertEl.textContent = 'Esperando jugada de humano... (🛸)';
      alertEl.classList.add('active-player');
    } else {
      alertEl.textContent = 'IA procesando vector óptimo... (👽)';
      alertEl.classList.add('active-ai');
    }
  }
}

// Get AI model predictions for the current board
async function predictMoves(currentBoardState) {
  if (!modelLoaded) return new Array(9).fill(1/9);
  
  // Format state from AI perspective
  // AI is 1, Human is -1.
  // The prediction function does tf.tensor2d
  const inputTensor = tf.tensor2d([currentBoardState], [1, 9]);
  const prediction = model.predict(inputTensor);
  const probabilities = await prediction.data();
  
  inputTensor.dispose();
  prediction.dispose();
  
  return Array.from(probabilities);
}

// Show overlay predictions on the board cells
async function showAIPredictionOverlay() {
  if (!gameActive) return;
  
  const probs = await predictMoves(board);
  
  // Normalize among free cells
  let sumFree = 0;
  const normalizedProbs = new Array(9).fill(0);
  
  for (let i = 0; i < 9; i++) {
    if (board[i] === 0) {
      sumFree += probs[i];
    }
  }
  
  for (let i = 0; i < 9; i++) {
    if (board[i] === 0) {
      normalizedProbs[i] = sumFree > 0 ? (probs[i] / sumFree) : 1 / board.filter(v => v === 0).length;
    }
  }
  
  // Set overlay texts and heatmap colors
  for (let i = 0; i < 9; i++) {
    const overlay = document.getElementById(`overlay-${i}`);
    const cell = document.querySelector(`.cell[data-index="${i}"]`);
    
    if (board[i] !== 0) {
      if (overlay) overlay.style.opacity = 0;
      if (cell) cell.style.background = '';
      continue;
    }
    
    const pct = Math.round(normalizedProbs[i] * 100);
    if (overlay) {
      overlay.textContent = `${pct}%`;
      overlay.style.opacity = aiVisionActive ? '0.85' : '0';
    }
    
    if (aiVisionActive && cell) {
      // Heatmap color depending on probability: high matches magenta, low matches space purple
      const alpha = normalizedProbs[i] * 0.45;
      cell.style.background = `rgba(255, 0, 127, ${alpha})`;
    } else if (cell) {
      cell.style.background = '';
    }
  }
}

// Update Real-Time analysis side panel
async function updateRealTimeAnalysis() {
  const chartEl = document.getElementById('probChart');
  if (!chartEl) return;
  
  if (!gameActive) {
    chartEl.innerHTML = '<div class="history-empty-message">Análisis inactivo. Inicia una partida.</div>';
    return;
  }
  
  const probs = await predictMoves(board);
  
  // Get index of max prob among empty cells
  let maxIdx = -1;
  let maxVal = -1;
  
  // Calculate normalized probabilities
  let sumFree = 0;
  const emptyCount = board.filter(v => v === 0).length;
  
  for (let i = 0; i < 9; i++) {
    if (board[i] === 0) {
      sumFree += probs[i];
    }
  }
  
  const displayProbs = probs.map((p, idx) => {
    if (board[idx] !== 0) return 0;
    return sumFree > 0 ? (p / sumFree) : 1 / emptyCount;
  });
  
  // Find highest valid probability
  for (let i = 0; i < 9; i++) {
    if (board[i] === 0 && displayProbs[i] > maxVal) {
      maxVal = displayProbs[i];
      maxIdx = i;
    }
  }
  
  let html = '';
  for (let i = 0; i < 9; i++) {
    const isPlayed = board[i] !== 0;
    const valStr = isPlayed ? 'Ocupada' : `${Math.round(displayProbs[i] * 100)}%`;
    const percent = isPlayed ? 0 : Math.round(displayProbs[i] * 100);
    const isMax = i === maxIdx;
    
    html += `
      <div class="prob-row ${isMax ? 'max-prob' : ''}">
        <div class="prob-label">Celda ${i} ${isMax ? '🤖' : ''}</div>
        <div class="prob-bar-container">
          <div class="prob-bar" style="width: ${percent}%"></div>
        </div>
        <div class="prob-val">${valStr}</div>
      </div>
    `;
  }
  
  chartEl.innerHTML = html;
}

// Human plays
function makeHumanMove(cellIndex) {
  if (!gameActive || board[cellIndex] !== 0 || currentPlayer !== -1) return;
  
  playSciFiSound('click-player');
  
  // Record board state before playing
  const rawState = [...board];
  
  // Perform move
  board[cellIndex] = -1; // -1 represents Human
  
  const cell = document.querySelector(`.cell[data-index="${cellIndex}"]`);
  cell.classList.remove('empty');
  cell.innerHTML += playerSaucerSvg;
  
  checkGameEnd();
  
  if (gameActive) {
    currentPlayer = 1; // AI's turn
    updateStatusAlert();
    updateRealTimeAnalysis();
    if (aiVisionActive) showAIPredictionOverlay();
    
    // Delay AI play to simulate computation
    setTimeout(makeAIMove, 700);
  }
}

// AI plays
async function makeAIMove() {
  if (!gameActive || currentPlayer !== 1) return;
  
  logToConsole("Analizando patrones cósmicos...");
  playSciFiSound('click-ai');
  
  const probs = await predictMoves(board);
  
  // Find highest probability move among empty cells
  let bestMove = -1;
  let maxProb = -1;
  
  for (let i = 0; i < 9; i++) {
    if (board[i] === 0 && probs[i] > maxProb) {
      maxProb = probs[i];
      bestMove = i;
    }
  }
  
  // Fallback if model behaves unexpectedly
  if (bestMove === -1) {
    const emptyCells = board.map((v, i) => v === 0 ? i : null).filter(v => v !== null);
    if (emptyCells.length > 0) {
      bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
  }
  
  if (bestMove !== -1) {
    // Record this decision for learning history
    // We save: state BEFORE move, action taken, and original prediction vector
    currentTurnHistory.push({
      state: [...board],
      action: bestMove,
      probabilities: probs
    });
    
    board[bestMove] = 1; // AI plays
    
    const cell = document.querySelector(`.cell[data-index="${bestMove}"]`);
    cell.classList.remove('empty');
    cell.innerHTML += aiAlienSvg;
    
    logToConsole(`IA colocó su signo en Celda ${bestMove}.`);
    
    checkGameEnd();
    
    if (gameActive) {
      currentPlayer = -1; // Human's turn
      updateStatusAlert();
      updateRealTimeAnalysis();
      if (aiVisionActive) showAIPredictionOverlay();
    }
  }
}

// Check if there is a win, loss or draw
function checkGameEnd() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  
  let winner = 0; // 0: none, 1: AI, -1: Human
  
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] !== 0 && board[a] === board[b] && board[a] === board[c]) {
      winner = board[a];
      
      // Animate winning line
      highlightWinningPattern(pattern);
      break;
    }
  }
  
  if (winner !== 0) {
    gameActive = false;
    if (winner === -1) {
      // Human won
      scores.player++;
      updateStatusAlert('win-player');
      playSciFiSound('win');
      logToConsole("Partida terminada. ¡Victoria humana!", "success");
    } else {
      // AI won
      scores.ai++;
      updateStatusAlert('win-ai');
      playSciFiSound('loss'); // AI win is player loss
      logToConsole("Partida terminada. Victoria de la Inteligencia Artificial.", "alert");
    }
    updateScoreboard();
    finalizeGame(winner);
  } else if (!board.includes(0)) {
    // Draw
    gameActive = false;
    scores.draws++;
    updateStatusAlert('draw');
    playSciFiSound('draw');
    logToConsole("Partida terminada en Empate.");
    updateScoreboard();
    finalizeGame(0);
  }
}

function highlightWinningPattern(pattern) {
  pattern.forEach(idx => {
    const cell = document.querySelector(`.cell[data-index="${idx}"]`);
    if (cell) {
      cell.style.boxShadow = 'inset 0 0 20px var(--text-green)';
      cell.style.borderColor = 'var(--text-green)';
    }
  });
}

// Post-game: learning and detailed analysis display
async function finalizeGame(winner) {
  updateRealTimeAnalysis();
  
  // Render turn history visual log
  renderTurnHistoryPanel();
  
  // Retrain model based on outcome (Memory/Learning Loop)
  if (currentTurnHistory.length > 0 && modelLoaded) {
    logToConsole("Analizando fallas e incoherencias de táctica...");
    
    // We synthesize a nice futuristic loading sound rhythm
    let soundInterval = setInterval(() => {
      if (gameActive) clearInterval(soundInterval);
      else playSciFiSound('train-blip');
    }, 150);
    
    // Prepare training data
    const states = [];
    const targets = [];
    
    for (let turn of currentTurnHistory) {
      const state = turn.state;
      const action = turn.action;
      const originalProbs = turn.probabilities;
      
      // Target probability vector
      const targetVec = [...originalProbs];
      
      if (winner === -1) {
        // AI lost! Penalize the move that led to this
        targetVec[action] = 0.0;
        
        // Find other empty cells to redistribute probabilities
        const emptyIndices = state.map((v, i) => (v === 0 && i !== action) ? i : null).filter(v => v !== null);
        if (emptyIndices.length > 0) {
          emptyIndices.forEach(idx => {
            targetVec[idx] = 1 / emptyIndices.length;
          });
        }
        
        // Zero out occupied cells
        state.forEach((val, idx) => {
          if (val !== 0) targetVec[idx] = 0.0;
        });
      } 
      else if (winner === 1) {
        // AI won! Reinforce this choice
        targetVec.fill(0);
        targetVec[action] = 1.0;
      } 
      else {
        // Draw. Reinforce moderately
        targetVec[action] = 0.6;
        const emptyIndices = state.map((v, i) => (v === 0 && i !== action) ? i : null).filter(v => v !== null);
        if (emptyIndices.length > 0) {
          emptyIndices.forEach(idx => {
            targetVec[idx] = 0.4 / emptyIndices.length;
          });
        }
      }
      
      states.push(state);
      targets.push(targetVec);
    }
    
    // Train Model
    try {
      const xs = tf.tensor2d(states, [states.length, 9]);
      const ys = tf.tensor2d(targets, [targets.length, 9]);
      
      const numEpochs = winner === -1 ? 16 : 8;
      
      logToConsole(`Optimizando red neural por ${numEpochs} épocas...`, 'alert');
      
      const history = await model.fit(xs, ys, {
        epochs: numEpochs,
        batchSize: Math.max(1, states.length),
        verbose: 0
      });
      
      clearInterval(soundInterval);
      
      const finalLoss = history.history.loss[history.history.loss.length - 1];
      logToConsole(`Entrenamiento neural completado. Error final: ${finalLoss.toFixed(4)}`, 'success');
      
      // Save model
      await model.save('localstorage://alien-ttt-model');
      logToConsole("Adaptación guardada en almacenamiento persistente.", "success");
      
      xs.dispose();
      ys.dispose();
    } catch (e) {
      clearInterval(soundInterval);
      console.error("Training error:", e);
      logToConsole("Fallo en actualización neural.", "warn");
    }
  }
}

// Render the historical probability summaries at the end
function renderTurnHistoryPanel() {
  const historyList = document.getElementById('historyList');
  if (!historyList) return;
  
  if (currentTurnHistory.length === 0) {
    historyList.innerHTML = '<div class="history-empty-message">No hay registros de jugadas.</div>';
    return;
  }
  
  let html = '';
  
  currentTurnHistory.forEach((turn, turnIdx) => {
    // Generate mini board HTML
    let boardHtml = '<div class="history-mini-board">';
    for (let i = 0; i < 9; i++) {
      const val = turn.state[i];
      let char = '';
      let cls = '';
      if (val === -1) { char = '🛸'; cls = 'mini-x'; }
      else if (val === 1) { char = '👽'; cls = 'mini-o'; }
      boardHtml += `<div class="mini-cell ${cls}">${char}</div>`;
    }
    boardHtml += '</div>';
    
    // Format probabilities text
    const probStrings = [];
    turn.probabilities.forEach((p, cellIdx) => {
      if (turn.state[cellIdx] === 0) {
        probStrings.push(`C${cellIdx}: ${Math.round(p * 100)}%`);
      }
    });
    const probText = probStrings.join(', ');
    
    html += `
      <div class="history-item">
        ${boardHtml}
        <div class="history-desc">
          <div class="history-turn">Turno IA #${turnIdx + 1}</div>
          <div class="history-move">Colocó en Celda ${turn.action} (Probabilidad: ${Math.round(turn.probabilities[turn.action]*100)}%)</div>
          <div class="history-probs">Evals: ${probText}</div>
        </div>
      </div>
    `;
  });
  
  historyList.innerHTML = html;
}

// Reset Scoreboard
function resetScores() {
  scores = { player: 0, ai: 0, draws: 0 };
  updateScoreboard();
  logToConsole("Historial de puntuaciones borrado.");
  playSciFiSound('draw');
}

// Wipe Model memory
async function clearModelMemory() {
  logToConsole("Limpiando memoria de la IA de almacenamiento local...");
  
  try {
    // Remove model from LocalStorage
    localStorage.removeItem('tensorflowjs_models/alien-ttt-model/info');
    localStorage.removeItem('tensorflowjs_models/alien-ttt-model/model_topology');
    localStorage.removeItem('tensorflowjs_models/alien-ttt-model/weight_specs');
    localStorage.removeItem('tensorflowjs_models/alien-ttt-model/weight_data');
    
    logToConsole("Memoria de almacenamiento local borrada. Reiniciando cerebro...", "success");
    playSciFiSound('loss');
    
    // Reload model from files
    await loadNeuralModel();
    initGame();
  } catch (e) {
    console.error(e);
    logToConsole("Error al borrar memoria.", "warn");
  }
}

// Listeners & Initialization
document.addEventListener('DOMContentLoaded', async () => {
  // Add listeners
  const boardEl = document.getElementById('board');
  
  // Create 9 cells dynamically
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell empty';
    cell.dataset.index = i;
    cell.innerHTML = `<div class="probability-overlay" id="overlay-${i}">0%</div>`;
    
    cell.addEventListener('mouseover', () => {
      if (gameActive && board[i] === 0 && currentPlayer === -1) {
        playSciFiSound('hover');
      }
    });
    
    cell.addEventListener('click', () => {
      makeHumanMove(i);
    });
    
    boardEl.appendChild(cell);
  }
  
  // Button controls
  document.getElementById('btnRestart').addEventListener('click', () => {
    playSciFiSound('hover');
    initGame();
  });
  
  document.getElementById('btnResetScores').addEventListener('click', () => {
    resetScores();
  });
  
  document.getElementById('btnResetMemory').addEventListener('click', () => {
    clearModelMemory();
  });
  
  const switchVision = document.getElementById('switchVision');
  switchVision.addEventListener('click', () => {
    aiVisionActive = !aiVisionActive;
    if (aiVisionActive) {
      switchVision.classList.add('active');
      boardEl.classList.add('show-vision');
      logToConsole("Visor holográfico de calor de la IA activado.");
    } else {
      switchVision.classList.remove('active');
      boardEl.classList.remove('show-vision');
      logToConsole("Visor holográfico desactivado.");
    }
    playSciFiSound('hover');
    showAIPredictionOverlay();
  });
  
  // Initialize
  loadScores();
  await loadNeuralModel();
  initGame();
});
