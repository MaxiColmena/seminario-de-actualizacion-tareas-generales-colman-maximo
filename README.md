# Seminario de Actualización - Trabajos Generales
## 👤 Autor: Colman Máximo

---

## 📋 Descripción General

Este repositorio contiene diversos trabajos realizados en el **Seminario de Actualización de Tecnologías de Programación y Sistemas (TPS)** del Politécnico. Los proyectos abarcan desde aplicaciones web básicas hasta calculadoras de matrices con múltiples implementaciones.

---

## 📁 Estructura del Repositorio

### **Actividad-1** 📱
Una aplicación web simple con:
- Interfaz interactiva en HTML/CSS
- Lógica implementada en JavaScript vanilla
- Funcionamiento sin servidor (standalone)

**Archivos:** `index.html`, `index.js`, `style.css`

---

### **Actividad-2** 🌐
Aplicación web con servidor Node.js:
- Backend con **Express.js**
- Frontend moderno en HTML/CSS/JavaScript
- Estructura cliente-servidor

**Estructura:**
```
Actividad-2/
├── package.json          # Dependencias
├── servidor.js           # Servidor Express
└── public/               # Archivos estáticos
    ├── index.html
    ├── index.js
    └── style.css
```

---

### **Actividad-3** 🐍
Aplicación web con servidor Python:
- Backend implementado en **Python**
- Frontend en HTML/CSS/JavaScript
- Comunicación con servidor en tiempo real

**Archivos:** `index.html`, `index.js`, `servidor.py`, `style.css`

---

### **suma_multiplicacion_matrices** 🧮
**Calculadora web de matrices** - Operaciones de suma y multiplicación

Permite:
- ✅ Ingresar dimensiones de matrices
- ✅ Cargar valores numéricos
- ✅ Validar datos
- ✅ Realizar suma y multiplicación
- ✅ Ver resultados formateados

**Versiones disponibles:**

#### 📍 **Local** (sin servidor)
```bash
Abre: local/index.html en tu navegador
# No requiere instalación
```

#### 🔵 **Node.js** (con Express)
```bash
cd nodejs
npm install
npm start
# http://localhost:3000
```

#### 🟠 **Python** (con Flask)
```bash
cd python
pip install -r requirements.txt
python server.py
# http://localhost:5000
```

**Estructura:**
```
suma_multiplicacion_matrices/
├── INICIO_RAPIDO.md           # Comandos listos para copiar
├── TRABAJO_FINAL.md           # Documentación principal
├── README.md                  # Información general
├── local/                     # Versión sin servidor
├── nodejs/                    # Versión con Node.js/Express
│   ├── package.json
│   ├── server.js
│   └── public/
└── python/                    # Versión con Python/Flask
    ├── requirements.txt
    ├── server.py
    └── static/
```

---

### **web** 🖥️
#### Seminario de Actualización 2 - Sistema de Registro de Alumnos

Aplicación web para el registro y gestión de estudiantes:
- 📝 Formulario para registrar alumnos (nombre, edad, nota)
- 👥 Listado de estudiantes registrados
- 🗑️ Eliminar datos de estudiantes
- 🍪 Manejo de sesiones por cookies
- 💾 Almacenamiento en memoria por usuario

**Tecnologías:**
- Backend: **Node.js** con **Express.js**
- Frontend: HTML, CSS, JavaScript vanilla
- Almacenamiento: En memoria (sesiones)

**Cómo ejecutar:**
```bash
cd web/seminario-de-actualizacion-2-Tareas-colman-maximo
npm install
npm run dev
# o
node ServidorWeb/server.js
# http://localhost:3000
```

**Estructura:**
```
web/seminario-de-actualizacion-2-Tareas-colman-maximo/
├── package.json
├── README.md
└── ServidorWeb/
    ├── index.html
    └── server.js
```

**API REST:**
- `GET /api/alumnos` - Obtener lista de alumnos
- `POST /api/alumnos` - Agregar nuevo alumno
- `DELETE /api/alumnos` - Eliminar todos los alumnos

---

## 🚀 Requisitos Generales

- **Node.js** 14+ (para proyectos con Node.js)
- **Python** 3.7+ (para proyectos con Python)
- **npm** (incluido con Node.js)
- Navegador web moderno

---

## 📝 Notas Importantes

- Cada carpeta contiene su propio `README.md` con instrucciones específicas
- Algunos proyectos requieren instalación de dependencias antes de ejecutarse
- Todos los proyectos están listos para usar una vez configurados

---

## 📧 Contacto

**Autor:** Máximo Colman  
**Institución:** Politécnico - Seminario TPS

---

*Última actualización: Abril 2026*
