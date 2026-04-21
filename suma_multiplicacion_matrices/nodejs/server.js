/**
 * ============================================
 * SERVIDOR BACKEND - SUMA Y MULTIPLICACIÓN
 * ============================================
 * Backend Node.js/Express para operaciones de matrices
 * 
 * ENDPOINTS:
 * POST /api/suma - Realiza suma de matrices
 * POST /api/multiplicacion - Realiza multiplicación de matrices
 */

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware: Permitir JSON en requests y servir archivos estáticos
app.use(bodyParser.json());
app.use(express.static('public'));

/**
 * FUNCIÓN: validarMatrices()
 * 
 * LÓGICA:
 * 1. Verifica que ambos parámetros sean arrays
 * 2. Verifica que los arrays no estén vacíos
 * 3. Verifica que todos los elementos sean números válidos
 * 4. Retorna objeto con { valido: true/false, error: mensaje }
 * 
 * PARÁMETROS:
 * - matrizA: Array 2D con valores
 * - matrizB: Array 2D con valores
 * 
 * RETORNA: Object { valido: Boolean, error: String }
 */
function validarMatrices(matrizA, matrizB) {
    // Verificar que sean arrays
    if (!Array.isArray(matrizA) || !Array.isArray(matrizB)) {
        return { valido: false, error: 'Las matrices deben ser arrays' };
    }

    // Verificar que no estén vacíos
    if (matrizA.length === 0 || matrizB.length === 0) {
        return { valido: false, error: 'Las matrices no pueden estar vacías' };
    }

    // Verificar estructura y valores de cada matriz
    for (let i = 0; i < matrizA.length; i++) {
        // Verificar que cada fila sea un array
        if (!Array.isArray(matrizA[i]) || !Array.isArray(matrizB[i])) {
            return { valido: false, error: 'Estructura de matriz inválida' };
        }

        // Verificar cada elemento
        for (let j = 0; j < matrizA[i].length; j++) {
            // Convertir a número y verificar si es válido (no NaN)
            if (isNaN(parseFloat(matrizA[i][j])) || matrizA[i][j] === '') {
                return { valido: false, error: 'Matriz A contiene valores no numéricos' };
            }
            if (isNaN(parseFloat(matrizB[i][j])) || matrizB[i][j] === '') {
                return { valido: false, error: 'Matriz B contiene valores no numéricos' };
            }
        }
    }

    // Todos los validaciones pasaron
    return { valido: true };
}

/**
 * FUNCIÓN: sumaMatrices()
 * 
 * LÓGICA:
 * 1. Crea array resultado vacío
 * 2. Para cada posición (i,j) suma: resultado[i][j] = A[i][j] + B[i][j]
 * 3. Retorna la matriz suma
 * 
 * FÓRMULA: C = A + B → C[i,j] = A[i,j] + B[i,j]
 * 
 * PARÁMETROS:
 * - matrizA: Array 2D
 * - matrizB: Array 2D
 * 
 * RETORNA: Array 2D con resultado
 */
function sumaMatrices(matrizA, matrizB) {
    const resultado = [];

    for (let i = 0; i < matrizA.length; i++) {
        resultado[i] = [];
        for (let j = 0; j < matrizA[i].length; j++) {
            // SUMA: A[i][j] + B[i][j]
            resultado[i][j] = parseFloat(matrizA[i][j]) + parseFloat(matrizB[i][j]);
        }
    }

    return resultado;
}

/**
 * FUNCIÓN: multiplicaMatrices()
 * 
 * LÓGICA:
 * 1. Crea array resultado vacío
 * 2. Para cada posición (i,j):
 *    - Suma de productos: A[i][k] * B[k][j] para cada k
 * 3. Retorna la matriz resultado
 * 
 * FÓRMULA: C = A × B → C[i,j] = Σ(A[i,k] × B[k,j])
 * 
 * PARÁMETROS:
 * - matrizA: Array 2D
 * - matrizB: Array 2D
 * 
 * RETORNA: Array 2D con resultado
 */
function multiplicaMatrices(matrizA, matrizB) {
    const filas = matrizA.length;
    const columnas = matrizA[0].length;
    const resultado = [];

    for (let i = 0; i < filas; i++) {
        resultado[i] = [];
        for (let j = 0; j < columnas; j++) {
            resultado[i][j] = 0; // Inicializar en 0

            // Loop importante: suma de productos
            for (let k = 0; k < columnas; k++) {
                // Fórmula: Suma += A[i][k] * B[k][j]
                resultado[i][j] += parseFloat(matrizA[i][k]) * parseFloat(matrizB[k][j]);
            }
        }
    }

    return resultado;
}

/**
 * ENDPOINT: POST /api/suma
 * 
 * LÓGICA:
 * 1. Recibir matrices A y B del cliente (formato JSON)
 * 2. Validar que tengan estructura correcta
 * 3. Calcular suma
 * 4. Enviar resultado al cliente
 * 
 * REQUEST: { matrizA: [...], matrizB: [...] }
 * RESPONSE: { resultado: [...], operacion: "Suma (A + B)" }
 */
app.post('/api/suma', (req, res) => {
    try {
        // Obtener matrices del body del request
        const { matrizA, matrizB } = req.body;

        // Validar antes de calcular
        const validacion = validarMatrices(matrizA, matrizB);
        if (!validacion.valido) {
            // Si hay error, enviar respuesta 400 (Bad Request)
            return res.status(400).json({ error: validacion.error });
        }

        // Calcular suma
        const resultado = sumaMatrices(matrizA, matrizB);

        // Enviar resultado en formato JSON
        res.json({ 
            resultado: resultado, 
            operacion: 'Suma (A + B)' 
        });

    } catch (error) {
        // Si hay error no controlado, enviar error 500
        res.status(500).json({ 
            error: 'Error en el servidor: ' + error.message 
        });
    }
});

/**
 * ENDPOINT: POST /api/multiplicacion
 * 
 * LÓGICA:
 * 1. Recibir matrices A y B del cliente (formato JSON)
 * 2. Validar que tengan estructura correcta
 * 3. Calcular multiplicación
 * 4. Enviar resultado al cliente
 * 
 * REQUEST: { matrizA: [...], matrizB: [...] }
 * RESPONSE: { resultado: [...], operacion: "Multiplicación (A × B)" }
 */
app.post('/api/multiplicacion', (req, res) => {
    try {
        // Obtener matrices del body del request
        const { matrizA, matrizB } = req.body;

        // Validar antes de calcular
        const validacion = validarMatrices(matrizA, matrizB);
        if (!validacion.valido) {
            // Si hay error, enviar respuesta 400
            return res.status(400).json({ error: validacion.error });
        }

        // Calcular multiplicación
        const resultado = multiplicaMatrices(matrizA, matrizB);

        // Enviar resultado en formato JSON
        res.json({ 
            resultado: resultado, 
            operacion: 'Multiplicación (A × B)' 
        });

    } catch (error) {
        // Si hay error no controlado, enviar error 500
        res.status(500).json({ 
            error: 'Error en el servidor: ' + error.message 
        });
    }
});

/**
 * INICIAR SERVIDOR
 * 
 * El servidor escucha en puerto 3000
 * Presiona Ctrl+C para detener
 */
app.listen(PORT, () => {
    console.log(`✓ Servidor escuchando en http://localhost:${PORT}`);
    console.log('► Presiona Ctrl+C para detener el servidor');
});
