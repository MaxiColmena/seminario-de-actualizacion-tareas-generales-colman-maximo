"""
============================================
SERVIDOR BACKEND - SUMA Y MULTIPLICACIÓN
============================================
Backend Python/Flask para operaciones de matrices

ENDPOINTS:
POST /api/suma - Realiza suma de matrices
POST /api/multiplicacion - Realiza multiplicación de matrices
"""

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def validar_matrices(matriz_a, matriz_b):
    """
    FUNCIÓN: validar_matrices()
    
    LÓGICA:
    1. Verifica que ambos parámetros sean listas
    2. Verifica que las listas no estén vacías
    3. Verifica que todos los elementos sean números válidos
    4. Retorna diccionario con { 'valido': True/False, 'error': mensaje }
    
    PARÁMETROS:
    - matriz_a: Lista 2D con valores
    - matriz_b: Lista 2D con valores
    
    RETORNA: Diccionario { 'valido': Boolean, 'error': String }
    """
    
    # Verificar que sean listas
    if not isinstance(matriz_a, list) or not isinstance(matriz_b, list):
        return {'valido': False, 'error': 'Las matrices deben ser listas'}
    
    # Verificar que no estén vacías
    if len(matriz_a) == 0 or len(matriz_b) == 0:
        return {'valido': False, 'error': 'Las matrices no pueden estar vacías'}
    
    try:
        # Verificar estructura y valores de cada matriz
        for i in range(len(matriz_a)):
            # Verificar que cada fila sea una lista
            if not isinstance(matriz_a[i], list) or not isinstance(matriz_b[i], list):
                return {'valido': False, 'error': 'Estructura de matriz inválida'}
            
            # Verificar cada elemento de la fila
            for j in range(len(matriz_a[i])):
                # Intentar convertir a número (flotante)
                float(matriz_a[i][j])
                float(matriz_b[i][j])
                
    except (ValueError, TypeError):
        # Si falla la conversión, el valor no es válido
        return {'valido': False, 'error': 'Las matrices contienen valores no numéricos'}
    
    # Todas las validaciones pasaron
    return {'valido': True}

def suma_matrices(matriz_a, matriz_b):
    """
    FUNCIÓN: suma_matrices()
    
    LÓGICA:
    1. Crea lista resultado vacía
    2. Para cada posición (i,j) suma: resultado[i][j] = A[i][j] + B[i][j]
    3. Retorna la matriz suma
    
    FÓRMULA: C = A + B → C[i,j] = A[i,j] + B[i,j]
    
    PARÁMETROS:
    - matriz_a: Lista 2D
    - matriz_b: Lista 2D
    
    RETORNA: Lista 2D con resultado
    """
    
    resultado = []
    
    for i in range(len(matriz_a)):
        fila = []
        for j in range(len(matriz_a[i])):
            # SUMA: A[i][j] + B[i][j]
            fila.append(float(matriz_a[i][j]) + float(matriz_b[i][j]))
        resultado.append(fila)
    
    return resultado

def multiplica_matrices(matriz_a, matriz_b):
    """
    FUNCIÓN: multiplica_matrices()
    
    LÓGICA:
    1. Crea lista resultado vacía
    2. Para cada posición (i,j):
       - Suma de productos: A[i][k] * B[k][j] para cada k
    3. Retorna la matriz resultado
    
    FÓRMULA: C = A × B → C[i,j] = Σ(A[i,k] × B[k,j])
    
    PARÁMETROS:
    - matriz_a: Lista 2D
    - matriz_b: Lista 2D
    
    RETORNA: Lista 2D con resultado
    """
    
    filas = len(matriz_a)
    columnas = len(matriz_a[0])
    resultado = []
    
    for i in range(filas):
        fila = []
        for j in range(columnas):
            valor = 0  # Inicializar en 0
            
            # Loop importante: suma de productos
            for k in range(columnas):
                # Fórmula: Suma += A[i][k] * B[k][j]
                valor += float(matriz_a[i][k]) * float(matriz_b[k][j])
            
            fila.append(valor)
        resultado.append(fila)
    
    return resultado

@app.route('/')
def index():
    """
    ENDPOINT: GET /
    
    Servir la página principal (index.html)
    """
    return render_template('index.html')

@app.route('/api/suma', methods=['POST'])
def api_suma():
    """
    ENDPOINT: POST /api/suma
    
    LÓGICA:
    1. Recibir matrices A y B del cliente (formato JSON)
    2. Validar que tengan estructura correcta
    3. Calcular suma
    4. Enviar resultado al cliente
    
    REQUEST: { matrizA: [...], matrizB: [...] }
    RESPONSE: { resultado: [...], operacion: "Suma (A + B)" }
    """
    
    try:
        # Obtener datos del request en formato JSON
        datos = request.get_json()
        matriz_a = datos.get('matrizA')
        matriz_b = datos.get('matrizB')
        
        # Validar antes de calcular
        validacion = validar_matrices(matriz_a, matriz_b)
        if not validacion['valido']:
            # Si hay error, enviar respuesta 400 (Bad Request)
            return jsonify({'error': validacion['error']}), 400
        
        # Calcular suma
        resultado = suma_matrices(matriz_a, matriz_b)
        
        # Enviar resultado en formato JSON
        return jsonify({
            'resultado': resultado, 
            'operacion': 'Suma (A + B)'
        })
        
    except Exception as e:
        # Si hay error no controlado, enviar error 500
        return jsonify({'error': f'Error en el servidor: {str(e)}'}), 500

@app.route('/api/multiplicacion', methods=['POST'])
def api_multiplicacion():
    """
    ENDPOINT: POST /api/multiplicacion
    
    LÓGICA:
    1. Recibir matrices A y B del cliente (formato JSON)
    2. Validar que tengan estructura correcta
    3. Calcular multiplicación
    4. Enviar resultado al cliente
    
    REQUEST: { matrizA: [...], matrizB: [...] }
    RESPONSE: { resultado: [...], operacion: "Multiplicación (A × B)" }
    """
    
    try:
        # Obtener datos del request en formato JSON
        datos = request.get_json()
        matriz_a = datos.get('matrizA')
        matriz_b = datos.get('matrizB')
        
        # Validar antes de calcular
        validacion = validar_matrices(matriz_a, matriz_b)
        if not validacion['valido']:
            # Si hay error, enviar respuesta 400
            return jsonify({'error': validacion['error']}), 400
        
        # Calcular multiplicación
        resultado = multiplica_matrices(matriz_a, matriz_b)
        
        # Enviar resultado en formato JSON
        return jsonify({
            'resultado': resultado, 
            'operacion': 'Multiplicación (A × B)'
        })
        
    except Exception as e:
        # Si hay error no controlado, enviar error 500
        return jsonify({'error': f'Error en el servidor: {str(e)}'}), 500

# Punto de entrada: ejecutar servidor
if __name__ == '__main__':
    print('✓ Servidor escuchando en http://localhost:5000')
    print('► Presiona Ctrl+C para detener el servidor')
    app.run(debug=True, port=5000)
