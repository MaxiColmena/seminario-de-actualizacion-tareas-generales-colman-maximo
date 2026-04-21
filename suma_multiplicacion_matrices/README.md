# CALCULADORA DE MATRICES - Suma y Multiplicación

**Autor:** Máximo Colman  
**Institución:** Politécnico - Seminario TPS  
**Versión:** 1.0 - 2026

---

## 📖 ¿QUÉ ES ESTE PROYECTO?

Una **calculadora web de matrices** que permite:
1. ✅ Ingresar las dimensiones de dos matrices
2. ✅ Cargar valores numéricos en cada celda
3. ✅ Validar que los datos sean correctos
4. ✅ Realizar operaciones de **suma** y **multiplicación**
5. ✅ Ver el resultado formateado

**Disponible en 3 versiones:**
- 🟢 **Local** (sin servidor)
- 🔵 **Node.js** (con Express)
- 🟠 **Python** (con Flask)

---

## 🚀 INICIO RÁPIDO

### Versión Local (MÁS FÁCIL)
```
1. Abre en navegador: local/index.html
2. ¡Listo! No requiere instalación
```

### Versión Node.js
```bash
cd nodejs
npm install
npm start
# Luego abre: http://localhost:3000
```

### Versión Python
```bash
cd python
pip install -r requirements.txt
python server.py
# Luego abre: http://localhost:5000
```

---

## 📚 DOCUMENTACIÓN

| Documento | Descripción |
|-----------|-------------|
| **TRABAJO_FINAL.md** | 👈 Lee esto primero (documento principal) |
| **INICIO_RAPIDO.md** | Comandos listos para copiar |
| **REFERENCIA_RAPIDA.md** | Guía rápida de uso |
| **ESTRUCTURA.md** | Desglose detallado de archivos |

---

## 💡 EJEMPLO DE USO

### Entrada:
```
Filas: 2, Columnas: 2

Matriz A:     Matriz B:
1  2          5  6
3  4          7  8
```

### Suma (A + B):
```
6   8
10  12
```

### Multiplicación (A × B):
```
19  22
43  50
```

---

## 📁 ESTRUCTURA

```
local/          → Versión sin servidor
nodejs/         → Versión con Node.js/Express
python/         → Versión con Python/Flask
```

Cada carpeta tiene su propio README con instrucciones específicas.

---

## ✨ CARACTERÍSTICAS

✓ Interfaz moderna y responsiva  
✓ Validación de datos cuadruple  
✓ Soporte para decimales y negativos  
✓ Código completamente comentado  
✓ Múltiples arquitecturas  
✓ SIN dependencias (versión local)  

---

## 🎯 TECNOLOGÍAS

- **HTML5** - Estructura
- **CSS3** - Estilos modernos
- **JavaScript** - Lógica
- **Node.js/Express** - Backend (opcional)
- **Python/Flask** - Backend (opcional)

---

## 📖 CÓMO ENTENDER EL CÓDIGO

Todo el código está comentado con explicaciones de:
- 📌 **QUÉ** hace cada función
- 🔍 **CÓMO** funciona la lógica
- 📐 **FÓRMULAS** matemáticas utilizadas
- 🎯 **PARÁMETROS** que recibe y retorna

### Ejemplo en local/script.js:
```javascript
/**
 * FUNCIÓN: sumaMatrices()
 * 
 * LÓGICA:
 * 1. Valida matrices
 * 2. Crea resultado vacío
 * 3. Suma elemento a elemento
 * 
 * FÓRMULA: C[i,j] = A[i,j] + B[i,j]
 */
```

---

## ✅ VALIDACIONES IMPLEMENTADAS

- ✓ Dimensiones válidas (1-10)
- ✓ Todos los campos completos
- ✓ Valores numéricos válidos
- ✓ Soporta decimales (3.14)
- ✓ Soporta negativos (-5)
- ✓ Mensajes de error claros

---

## 🔧 REQUISITOS

### Versión Local
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Nada más!

### Versión Node.js
- Node.js v14+
- npm

### Versión Python
- Python 3.6+
- pip

---

## 📞 ¿PROBLEMA?

Si algo no funciona:
1. Consulta **INICIO_RAPIDO.md**
2. Verifica en **REFERENCIA_RAPIDA.md**
3. Lee el README de tu versión (local/, nodejs/, python/)

---

## 🎓 OBJETIVO EDUCATIVO

Este proyecto enseña:
- ✅ Operaciones matriciales (suma y multiplicación)
- ✅ Programación web (HTML, CSS, JavaScript)
- ✅ Arquitectura cliente-servidor
- ✅ Validación de datos
- ✅ Buenas prácticas de código

---

## 📊 INFORMACIÓN DEL PROYECTO

**Tipos de operaciones:** Suma, Multiplicación  
**Versiones:** 3 (Local, Node.js, Python)  
**Dimensiones soportadas:** 1x1 a 10x10  
**Archivo principal documentación:** TRABAJO_FINAL.md  
**Código comentado:** SÍ (100%)  

---

## 🎉 ¿LISTO PARA USAR?

**Opción A (Más rápido):** Abre `local/index.html`  
**Opción B (Profesional):** Usa Node.js o Python  

---

## 📖 SIGUIENTE PASO

👉 **[Lee TRABAJO_FINAL.md para entender TODO el proyecto](TRABAJO_FINAL.md)**

---

**Autor:** Máximo Colman | **Versión:** 1.0 | **Estado:** ✅ Completado

