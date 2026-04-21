// Variables globales
let matriz_A = [];
let matriz_B = [];
let filas = 0;
let columnas = 0;

function dibujarMatrices() {
    filas = parseInt(document.getElementById('rows').value);
    columnas = parseInt(document.getElementById('cols').value);

    if (filas <= 0 || columnas <= 0) {
        alert('Las dimensiones deben ser mayores a 0');
        return;
    }

    // Limpiar matrices anteriores
    matriz_A = [];
    matriz_B = [];

    // Crear matrices vacías
    for (let i = 0; i < filas; i++) {
        matriz_A[i] = new Array(columnas).fill(0);
        matriz_B[i] = new Array(columnas).fill(0);
    }

    // Dibujar matrices
    dibujarMatrizA();
    dibujarMatrizB();

    // Mostrar el contenedor
    document.getElementById('matrixContainer').style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';

    // Limpiar errores
    document.getElementById('errorA').textContent = '';
    document.getElementById('errorB').textContent = '';
}

function dibujarMatrizA() {
    const container = document.getElementById('matrixA');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'matrix-table';

    for (let i = 0; i < filas; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < columnas; j++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.placeholder = `a${i},${j}`;
            input.onchange = function () {
                matriz_A[i][j] = this.value;
            };
            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    container.appendChild(table);
}

function dibujarMatrizB() {
    const container = document.getElementById('matrixB');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'matrix-table';

    for (let i = 0; i < filas; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < columnas; j++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.placeholder = `b${i},${j}`;
            input.onchange = function () {
                matriz_B[i][j] = this.value;
            };
            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    container.appendChild(table);
}

function validarMatrices() {
    const inputs_A = document.querySelectorAll('#matrixA input');
    const inputs_B = document.querySelectorAll('#matrixB input');
    let errorA = '';
    let errorB = '';

    // Validar Matriz A
    inputs_A.forEach((input, index) => {
        const valor = input.value.trim();
        if (valor === '') {
            errorA = 'Todos los campos deben estar completados';
        } else if (isNaN(parseFloat(valor))) {
            errorA = 'Todos los valores deben ser numéricos';
        } else {
            const i = Math.floor(index / columnas);
            const j = index % columnas;
            matriz_A[i][j] = valor;
        }
    });

    // Validar Matriz B
    inputs_B.forEach((input, index) => {
        const valor = input.value.trim();
        if (valor === '') {
            errorB = 'Todos los campos deben estar completados';
        } else if (isNaN(parseFloat(valor))) {
            errorB = 'Todos los valores deben ser numéricos';
        } else {
            const i = Math.floor(index / columnas);
            const j = index % columnas;
            matriz_B[i][j] = valor;
        }
    });

    document.getElementById('errorA').textContent = errorA;
    document.getElementById('errorB').textContent = errorB;

    if (errorA || errorB) {
        return false;
    }

    return true;
}

async function sumaMatrices() {
    if (!validarMatrices()) {
        return;
    }

    await enviarAlServidor('/api/suma', 'Suma de Matrices (A + B)');
}

async function multiplicaMatrices() {
    if (!validarMatrices()) {
        return;
    }

    await enviarAlServidor('/api/multiplicacion', 'Multiplicación de Matrices (A × B)');
}

async function enviarAlServidor(endpoint, titulo) {
    document.getElementById('loadingMessage').style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                matrizA: matriz_A,
                matrizB: matriz_B
            })
        });

        const data = await response.json();

        if (!response.ok) {
            document.getElementById('errorMessage').textContent = 'Error: ' + data.error;
            document.getElementById('errorMessage').style.display = 'block';
            document.getElementById('loadingMessage').style.display = 'none';
            return;
        }

        mostrarResultado(data.resultado, titulo);
        document.getElementById('loadingMessage').style.display = 'none';
    } catch (error) {
        document.getElementById('errorMessage').textContent = 'Error de conexión: ' + error.message;
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('loadingMessage').style.display = 'none';
    }
}

function mostrarResultado(matriz, titulo) {
    document.getElementById('resultTitle').textContent = titulo;
    const resultContainer = document.getElementById('resultMatrix');
    resultContainer.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'matrix-table';

    for (let i = 0; i < matriz.length; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < matriz[i].length; j++) {
            const cell = document.createElement('td');
            const valor = matriz[i][j];
            cell.textContent = Number.isInteger(valor) ? valor : valor.toFixed(2);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    resultContainer.appendChild(table);
    document.getElementById('resultSection').style.display = 'block';
}
