/**
 * ============================================
 * CALCULADORA DE MATRICES - VERSIÓN LOCAL
 * ============================================
 * Script simplificado para sumar y multiplicar matrices
 * Sin dependencias externas - JavaScript puro
 */

// Variables globales para almacenar las matrices
let matriz_A = [];
let matriz_B = [];
let filas = 0;
let columnas = 0;

/**
 * FUNCIÓN PRINCIPAL: dibujarMatrices()
 * 
 * LÓGICA:
 * 1. Obtiene las dimensiones del HTML (filas y columnas)
 * 2. Valida que sean números mayores a 0
 * 3. Crea arrays vacíos para las matrices
 * 4. Dibuja la interfaz con inputs para cada celda
 * 
 * PARÁMETROS: Ninguno (lee del HTML)
 * RETORNA: Nada (modifica el DOM)
 */
function dibujarMatrices() {
    // Leer dimensiones desde los inputs del HTML
    filas = parseInt(document.getElementById('rows').value);
    columnas = parseInt(document.getElementById('cols').value);

    // Validar que dimensiones sean válidas (mayores a 0)
    if (filas <= 0 || columnas <= 0) {
        alert('Las dimensiones deben ser mayores a 0');
        return;
    }

    // Crear las matrices como arrays 2D vacios
    matriz_A = Array(filas).fill(null).map(() => Array(columnas).fill(0));
    matriz_B = Array(filas).fill(null).map(() => Array(columnas).fill(0));

    // Dibujar ambas matrices en la página
    crearTablaMatriz('matrixA', matriz_A, 'A');
    crearTablaMatriz('matrixB', matriz_B, 'B');

    // Mostrar el área de matrices e inputs
    document.getElementById('matrixContainer').style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('errorA').textContent = '';
    document.getElementById('errorB').textContent = '';
}

/**
 * FUNCIÓN AUXILIAR: crearTablaMatriz()
 * 
 * LÓGICA:
 * 1. Recibe el nombre de la matriz (A o B)
 * 2. Crea una tabla HTML con inputs para cada celda
 * 3. Cada input actualiza el array cuando se modifica
 * 
 * PARÁMETROS:
 * - elementoID: ID del contenedor (ej: "matrixA")
 * - matriz: Array donde guardar los valores
 * - nombreMatriz: Letra de la matriz (A o B)
 */
function crearTablaMatriz(elementoID, matriz, nombreMatriz) {
    const container = document.getElementById(elementoID);
    container.innerHTML = ''; // Limpiar contenido anterior

    // Crear tabla con clase CSS para estilos
    const table = document.createElement('table');
    table.className = 'matrix-table';

    // Loop para crear cada fila de la matriz
    for (let i = 0; i < filas; i++) {
        const row = document.createElement('tr'); // <tr> para fila

        // Loop para crear cada columna
        for (let j = 0; j < columnas; j++) {
            const cell = document.createElement('td'); // <td> para celda
            const input = document.createElement('input'); // Input numérico

            // Configurar el input
            input.type = 'number';
            input.step = 'any'; // Permite decimales
            input.placeholder = `${nombreMatriz}[${i},${j}]`;

            // Guardar valor cuando el usuario lo modifica
            const [matrizRef, nombreRef] = (nombreMatriz === 'A') 
                ? [matriz_A, 'A'] 
                : [matriz_B, 'B'];

            input.onchange = function () {
                const valor = parseFloat(this.value);
                matrizRef[i][j] = isNaN(valor) ? 0 : valor;
            };

            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    // Agregar tabla al contenedor
    container.appendChild(table);
}


/**
 * FUNCIÓN: validarMatrices()
 * 
 * LÓGICA:
 * 1. Obtiene todos los inputs de ambas matrices del DOM
 * 2. Verifica que TODOS los campos tengan valores
 * 3. Verifica que TODOS los valores sean números válidos
 * 4. Muestra mensajes de error si hay problemas
 * 5. Retorna true si todo está válido, false si hay errores
 * 
 * PARÁMETROS: Ninguno (lee del DOM)
 * RETORNA: Boolean (true = válido, false = hay errores)
 */
function validarMatrices() {
    // Obtener todos los inputs de ambas matrices
    const inputs_A = document.querySelectorAll('#matrixA input');
    const inputs_B = document.querySelectorAll('#matrixB input');
    let errorA = '';
    let errorB = '';

    // Validar MATRIZ A
    inputs_A.forEach((input, index) => {
        const valor = input.value.trim(); // Eliminar espacios en blanco

        // Verificar si está vacío
        if (valor === '') {
            errorA = 'Todos los campos deben estar completados';
            return;
        }

        // Verificar si es un número válido
        if (isNaN(parseFloat(valor))) {
            errorA = 'Todos los valores deben ser numéricos';
            return;
        }

        // Guardar el valor en la matriz
        const i = Math.floor(index / columnas);
        const j = index % columnas;
        matriz_A[i][j] = parseFloat(valor);
    });

    // Validar MATRIZ B (mismo proceso)
    inputs_B.forEach((input, index) => {
        const valor = input.value.trim();

        if (valor === '') {
            errorB = 'Todos los campos deben estar completados';
            return;
        }

        if (isNaN(parseFloat(valor))) {
            errorB = 'Todos los valores deben ser numéricos';
            return;
        }

        const i = Math.floor(index / columnas);
        const j = index % columnas;
        matriz_B[i][j] = parseFloat(valor);
    });

    // Mostrar errores en la página si existen
    document.getElementById('errorA').textContent = errorA;
    document.getElementById('errorB').textContent = errorB;

    // Retornar false si hay algún error
    if (errorA || errorB) {
        return false;
    }

    // Retornar true si todo está correcto
    return true;
}

/**
 * FUNCIÓN: sumaMatrices()
 * 
 * LÓGICA:
 * 1. Valida que las matrices tengan datos correctos
 * 2. Crea una matriz de resultado vacía
 * 3. Suma elemento a elemento: resultado[i][j] = A[i][j] + B[i][j]
 * 4. Muestra el resultado en pantalla
 * 
 * FÓRMULA MATEMÁTICA:
 * C = A + B
 * C[i,j] = A[i,j] + B[i,j]
 * 
 * PARÁMETROS: Ninguno
 * RETORNA: Nada (muestra resultado en pantalla)
 */
function sumaMatrices() {
    // Validar antes de calcular
    if (!validarMatrices()) {
        return; // Si hay errores, salir sin hacer nada
    }

    // Crear matriz de resultado vacía
    const resultado = [];

    // Loop: recorrer cada posición (i, j)
    for (let i = 0; i < filas; i++) {
        resultado[i] = [];
        for (let j = 0; j < columnas; j++) {
            // SUMA: elemento de A + elemento de B
            resultado[i][j] = matriz_A[i][j] + matriz_B[i][j];
        }
    }

    // Mostrar resultado en la página
    mostrarResultado(resultado, 'Suma de Matrices (A + B)');
}

/**
 * FUNCIÓN: multiplicaMatrices()
 * 
 * LÓGICA:
 * 1. Valida que las matrices tengan datos correctos
 * 2. Crea una matriz de resultado vacía
 * 3. Para cada posición (i,j) multiplica y suma:
 *    - Suma = A[i][0]*B[0][j] + A[i][1]*B[1][j] + ...
 * 
 * FÓRMULA MATEMÁTICA:
 * C = A × B
 * C[i,j] = Σ(A[i,k] × B[k,j]) para todo k
 * 
 * PARÁMETROS: Ninguno
 * RETORNA: Nada (muestra resultado en pantalla)
 */
function multiplicaMatrices() {
    // Validar antes de calcular
    if (!validarMatrices()) {
        return; // Si hay errores, salir sin hacer nada
    }

    // Crear matriz de resultado vacía
    const resultado = [];

    // Inicializar con ceros
    for (let i = 0; i < filas; i++) {
        resultado[i] = [];
        for (let j = 0; j < columnas; j++) {
            // MULTIPLICACIÓN: suma de productos
            resultado[i][j] = 0; // Inicializar en 0
            
            // Loop importante: multiplicar y sumar cada elemento
            for (let k = 0; k < columnas; k++) {
                // Fórmula: C[i,j] += A[i,k] * B[k,j]
                resultado[i][j] += matriz_A[i][k] * matriz_B[k][j];
            }
        }
    }

    // Mostrar resultado en la página
    mostrarResultado(resultado, 'Multiplicación de Matrices (A × B)');
}

/**
 * FUNCIÓN: mostrarResultado()
 * 
 * LÓGICA:
 * 1. Recibe la matriz de resultado y un título
 * 2. Crea una tabla HTML con los valores
 * 3. Formatea los números (2 decimales máximo)
 * 4. Inserta la tabla en la página
 * 
 * PARÁMETROS:
 * - matriz: Array 2D con los valores a mostrar
 * - titulo: String con el título (ej: "Suma de Matrices")
 * 
 * RETORNA: Nada (modifica el DOM)
 */
function mostrarResultado(matriz, titulo) {
    // Establecer el título del resultado
    document.getElementById('resultTitle').textContent = titulo;

    // Obtener el contenedor y limpiarlo
    const resultContainer = document.getElementById('resultMatrix');
    resultContainer.innerHTML = '';

    // Crear tabla para mostrar la matriz
    const table = document.createElement('table');
    table.className = 'matrix-table';

    // Recorrer cada fila de la matriz resultado
    for (let i = 0; i < matriz.length; i++) {
        const row = document.createElement('tr');

        // Recorrer cada columna
        for (let j = 0; j < matriz[i].length; j++) {
            const cell = document.createElement('td');
            const valor = matriz[i][j];

            // Formatear el número: si es entero mostrar sin decimales
            // Si tiene decimales, mostrar máximo 2
            cell.textContent = Number.isInteger(valor) 
                ? valor 
                : valor.toFixed(2);

            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    // Agregar la tabla al contenedor
    resultContainer.appendChild(table);

    // Mostrar la sección de resultado
    document.getElementById('resultSection').style.display = 'block';
}
