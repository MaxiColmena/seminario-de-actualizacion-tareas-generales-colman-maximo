# Sistema Distribuido de Registro de Alumnos en 3 Máquinas Virtuales

**Autor:** Colman Máximo  
**Fecha:** Mayo 2026  
**Institución:** Seminario de Actualización - Tareas Generales

---

## 🎯 Objetivo del Ejercicio

Implementar un **sistema distribuido real** en 3 máquinas virtuales Linux independientes para gestionar un registro de alumnos. El objetivo es:

- Separar responsabilidades en capas: Base de Datos, Backend y Frontend
- Configurar comunicación remota entre servicios
- Asegurar persistencia de datos
- Habilitar acceso remoto mediante SSH y HTTP
- Demostrar comprensión de arquitectura distribuida, virtualización, redes, bases de datos y desarrollo backend/frontend

---

## 📋 Requisitos Previos

### Software Necesario
- **VirtualBox** (versión 7.0 o superior)
- **PuTTY** o terminal para SSH
- **Navegador web** (Chrome, Firefox, Edge, etc.)
- **PowerShell** (Windows) o terminal (Linux/Mac)

### Imagen de Sistema Operativo
- **Ubuntu Server 24.04.4 LTS**: https://releases.ubuntu.com/24.04/ubuntu-24.04.4-live-server-amd64.iso

---

## 🖥️ Infraestructura de Red

El proyecto utiliza una **red NAT en VirtualBox** con la siguiente configuración:

### Direcciones IP Estáticas (Red NAT)
| Máquina Virtual | Rol | IP Estática | Acceso SSH Local |
|---|---|---|---|
| **VM1** | Base de Datos (MariaDB) | 10.0.2.15 | localhost:2221 |
| **VM2** | Backend (Node.js/Python) | 10.0.2.16 | localhost:2222 |
| **VM3** | Frontend (Apache) | 10.0.2.17 | localhost:2223 |

### Reenvío de Puertos en VirtualBox
Para acceder remotamente a las máquinas desde el host, configuramos NAT Port Forwarding:

```
VM1 (Base de Datos):
  Protocolo: TCP
  Host: 127.0.0.1:2221 → Guest: 10.0.2.15:22
  
VM2 (Backend):
  Protocolo: TCP
  Host: 127.0.0.1:2222 → Guest: 10.0.2.16:22
  
VM3 (Frontend):
  Protocolo: TCP
  Host: 127.0.0.1:2223 → Guest: 10.0.2.17:22
```

### Acceso Frontend desde el Host
Para acceder a la interfaz web desde la PC física:
```
URL: http://192.168.100.50:8080/Sistema
(Reemplazar 192.168.100.50 con la IP real de tu máquina host)
```

---

## 📝 Paso a Paso: Creación de las Máquinas Virtuales

### Paso 1: Crear la Primera Máquina Virtual (BD)

#### 1.1 Crear la VM en VirtualBox
```powershell
# Desde PowerShell con VirtualBox instalado
cd "C:\Program Files\Oracle\VirtualBox"

# Crear la máquina virtual
.\VBoxManage createvm --name "BD" --ostype "Ubuntu_64" --register

# Configurar memoria RAM: 2048 MB
.\VBoxManage modifyvm "BD" --memory 2048

# Configurar CPUs: 2
.\VBoxManage modifyvm "BD" --cpus 2

# Crear disco duro virtual (20 GB)
.\VBoxManage createmedium disk --filename "C:\Ruta\Al\Directorio\BD\BD.vdi" --size 20480 --format VDI

# Crear controlador de almacenamiento SATA
.\VBoxManage storagectl "BD" --name "SATA" --add sata --bootable on

# Adjuntar el disco al controlador
.\VBoxManage storageattach "BD" --storagectl "SATA" --port 0 --device 0 --type hdd --medium "C:\Ruta\Al\Directorio\BD\BD.vdi"

# Adjuntar la imagen ISO para la instalación
.\VBoxManage storageattach "BD" --storagectl "SATA" --port 1 --device 0 --type dvddrive --medium "C:\Ruta\A\ubuntu-24.04.4-live-server-amd64.iso"
```

#### 1.2 Configurar Red NAT
```powershell
# Asignar adaptador de red NAT
.\VBoxManage modifyvm "BD" --nic1 nat

# Configurar port forwarding para SSH
.\VBoxManage modifyvm "BD" --natpf1 "SSH,tcp,127.0.0.1,2221,,22"
```

#### 1.3 Iniciar la VM e instalar Ubuntu
```powershell
# Iniciar la máquina en modo GUI
.\VBoxManage startvm "BD" --type gui
```

**Durante la instalación de Ubuntu:**
- Seleccionar idioma, zona horaria y teclado
- Seleccionar instalación automática con LVM
- Configurar usuario: `usuario`
- Habilitar SSH server durante la instalación
- Completar la instalación y reiniciar

### Paso 2: Configurar la Red en Ubuntu (BD)

Después de instalar Ubuntu, configurar IP estática:

```bash
# Acceder por SSH desde el host
ssh -p 2221 usuario@localhost

# Ver configuración de red
ip a

# Editar el archivo de configuración de netplan
sudo nano /etc/netplan/01-netcfg.yaml
```

**Contenido del archivo para VM1 (Base de Datos):**
```yaml
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: false
      addresses:
        - 10.0.2.15/24
      gateway4: 10.0.2.1
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]
```

```bash
# Aplicar la configuración
sudo netplan apply

# Verificar que la IP se asignó correctamente
ip a
ping 10.0.2.1
```

### Paso 3: Crear VM2 (Backend) y VM3 (Frontend)

Repetir los pasos 1 y 2 para las otras máquinas virtuales con los siguientes cambios:

**Para VM2 (Backend):**
- Nombre: `backend`
- IP: `10.0.2.16`
- Puerto SSH: `2222`
- Archivo VDI: `backend.vdi`

**Para VM3 (Frontend):**
- Nombre: `frontend`
- IP: `10.0.2.17`
- Puerto SSH: `2223`
- Archivo VDI: `frontend.vdi`

**Scripts PowerShell para VM2 y VM3:**

```powershell
# VM2 - Backend
.\VBoxManage createvm --name "backend" --ostype "Ubuntu_64" --register
.\VBoxManage modifyvm "backend" --memory 2048 --cpus 2
.\VBoxManage createmedium disk --filename "C:\Ruta\backend.vdi" --size 20480 --format VDI
.\VBoxManage storagectl "backend" --name "SATA" --add sata --bootable on
.\VBoxManage storageattach "backend" --storagectl "SATA" --port 0 --device 0 --type hdd --medium "C:\Ruta\backend.vdi"
.\VBoxManage storageattach "backend" --storagectl "SATA" --port 1 --device 0 --type dvddrive --medium "C:\Ruta\ubuntu-24.04.4-live-server-amd64.iso"
.\VBoxManage modifyvm "backend" --nic1 nat
.\VBoxManage modifyvm "backend" --natpf1 "SSH,tcp,127.0.0.1,2222,,22"

# VM3 - Frontend
.\VBoxManage createvm --name "frontend" --ostype "Ubuntu_64" --register
.\VBoxManage modifyvm "frontend" --memory 2048 --cpus 2
.\VBoxManage createmedium disk --filename "C:\Ruta\frontend.vdi" --size 20480 --format VDI
.\VBoxManage storagectl "frontend" --name "SATA" --add sata --bootable on
.\VBoxManage storageattach "frontend" --storagectl "SATA" --port 0 --device 0 --type hdd --medium "C:\Ruta\frontend.vdi"
.\VBoxManage storageattach "frontend" --storagectl "SATA" --port 1 --device 0 --type dvddrive --medium "C:\Ruta\ubuntu-24.04.4-live-server-amd64.iso"
.\VBoxManage modifyvm "frontend" --nic1 nat
.\VBoxManage modifyvm "frontend" --natpf1 "SSH,tcp,127.0.0.1,2223,,23"
```

---

## 🗄️ VM1: Servidor de Base de Datos (MariaDB)

### Instalación de MariaDB

```bash
# Conectar por SSH
ssh -p 2221 usuario@localhost

# Actualizar paquetes
sudo apt update
sudo apt upgrade -y

# Instalar MariaDB Server
sudo apt install mariadb-server -y

# Iniciar el servicio
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Ejecutar instalación segura
sudo mysql_secure_installation
```

### Configuración de MariaDB para Acceso Remoto

```bash
# Editar el archivo de configuración
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf

# Buscar la línea: bind-address = 127.0.0.1
# Cambiar a: bind-address = 0.0.0.0
# Guardar con Ctrl+O, Enter, Ctrl+X
```

### Crear Base de Datos y Tabla

```bash
# Conectar a MariaDB como root
sudo mysql -u root

# Ejecutar los siguientes comandos SQL:
```

```sql
CREATE DATABASE registro_alumnos;
USE registro_alumnos;

CREATE TABLE alumnos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  apellidos VARCHAR(100) NOT NULL,
  nombres VARCHAR(100) NOT NULL,
  dni VARCHAR(20) UNIQUE NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear usuario remoto para consultas
CREATE USER 'usuario_consulta'@'%' IDENTIFIED BY 'password_seguro';
GRANT SELECT, INSERT, UPDATE, DELETE ON registro_alumnos.* TO 'usuario_consulta'@'%';
FLUSH PRIVILEGES;

-- Verificar usuarios
SELECT User, Host FROM mysql.user;

EXIT;
```

### Reiniciar MariaDB

```bash
sudo systemctl restart mariadb

# Verificar que está escuchando en todas las interfaces
sudo netstat -tuln | grep 3306
```

### Prueba de Conexión Remota

```bash
# Desde el host (PowerShell)
mysql -h 127.0.0.1 -P 3306 -u usuario_consulta -p

# Ingresar password: password_seguro
# Ejecutar:
USE registro_alumnos;
SELECT * FROM alumnos;
```

---

## ⚙️ VM2: Servidor Backend (Node.js)

### Instalación de Node.js

```bash
# Conectar por SSH
ssh -p 2222 usuario@localhost

# Actualizar paquetes
sudo apt update && sudo apt upgrade -y

# Instalar Node.js y npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version
npm --version
```

### Crear Aplicación Backend

```bash
# Crear directorio del proyecto
mkdir -p ~/backend
cd ~/backend

# Inicializar proyecto Node
npm init -y

# Instalar dependencias
npm install express mysql2 cors body-parser
```

### Crear Servidor Backend (app.js)

```bash
# Crear archivo app.js
nano app.js
```

**Contenido de app.js:**
```javascript
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuración de base de datos
const dbConfig = {
  host: '10.0.2.15',
  user: 'usuario_consulta',
  password: 'password_seguro',
  database: 'registro_alumnos'
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Ruta: Grabar alumno
app.post('/grabaAlumnos', async (req, res) => {
  try {
    const { apellidos, nombres, dni } = req.body;

    if (!apellidos || !nombres || !dni) {
      return res.json({ resultado: 0, mensaje: 'Campos obligatorios faltantes' });
    }

    const connection = await pool.getConnection();
    
    // Verificar si el DNI ya existe
    const [rows] = await connection.query('SELECT * FROM alumnos WHERE dni = ?', [dni]);
    
    if (rows.length > 0) {
      connection.release();
      return res.json({ resultado: 0, mensaje: 'DNI ya registrado' });
    }

    // Insertar nuevo alumno
    await connection.query(
      'INSERT INTO alumnos (apellidos, nombres, dni) VALUES (?, ?, ?)',
      [apellidos, nombres, dni]
    );
    
    connection.release();
    res.json({ resultado: 1, mensaje: 'Alumno registrado exitosamente' });
  } catch (error) {
    console.error('Error:', error);
    res.json({ resultado: 0, mensaje: 'Error en el servidor' });
  }
});

// Ruta: Consultar alumnos
app.get('/consultarAlumnos', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM alumnos ORDER BY apellidos, nombres'
    );
    connection.release();
    
    res.json({ resultado: 1, data: rows });
  } catch (error) {
    console.error('Error:', error);
    res.json({ resultado: 0, mensaje: 'Error en el servidor' });
  }
});

// Iniciar servidor
const PORT = 3454;
app.listen(PORT, () => {
  console.log(`Servidor Backend escuchando en puerto ${PORT}`);
});
```

### Ejecutar Backend

```bash
# Ejecutar la aplicación
node app.js

# Mantener el proceso corriendo (usar PM2 para producción)
npm install -g pm2
pm2 start app.js --name "backend"
pm2 startup
pm2 save
```

---

## 🌐 VM3: Servidor Frontend (Apache)

### Instalación de Apache

```bash
# Conectar por SSH
ssh -p 2223 usuario@localhost

# Actualizar paquetes
sudo apt update && sudo apt upgrade -y

# Instalar Apache
sudo apt install apache2 -y

# Iniciar Apache
sudo systemctl start apache2
sudo systemctl enable apache2

# Verificar que está corriendo
sudo systemctl status apache2
```

### Crear Estructura de Directorios

```bash
# Crear directorio para la aplicación
sudo mkdir -p /var/www/html/Sistema

# Dar permisos
sudo chown -R usuario:usuario /var/www/html/Sistema
```

### Crear Interfaz Frontend

```bash
# Crear archivo index.html
nano /var/www/html/Sistema/index.html
```

**Contenido de index.html:**
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Registro de Alumnos</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 40px;
            max-width: 600px;
            width: 100%;
        }

        h1 {
            color: #333;
            margin-bottom: 30px;
            text-align: center;
            font-size: 2em;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: #555;
            font-weight: 500;
        }

        input {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 1em;
            transition: border-color 0.3s;
        }

        input:focus {
            outline: none;
            border-color: #667eea;
        }

        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            font-size: 1em;
            cursor: pointer;
            margin-right: 10px;
            transition: transform 0.2s;
        }

        button:hover {
            transform: translateY(-2px);
        }

        button:active {
            transform: translateY(0);
        }

        .mensaje {
            margin-top: 20px;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            font-weight: 500;
            display: none;
        }

        .mensaje.exito {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .mensaje.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .tabla-container {
            margin-top: 40px;
            display: none;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            margin-top: 20px;
        }

        table thead {
            background: #667eea;
            color: white;
        }

        table th, table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        table tbody tr:hover {
            background: #f5f5f5;
        }

        .botones-grupo {
            display: flex;
            gap: 10px;
        }

        .botones-grupo button {
            flex: 1;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📚 Sistema de Registro de Alumnos</h1>

        <!-- Formulario de Registro -->
        <div id="formulario">
            <div class="form-group">
                <label for="apellidos">Apellidos:</label>
                <input type="text" id="apellidos" placeholder="Ej: García López" required>
            </div>

            <div class="form-group">
                <label for="nombres">Nombres:</label>
                <input type="text" id="nombres" placeholder="Ej: Juan Carlos" required>
            </div>

            <div class="form-group">
                <label for="dni">DNI:</label>
                <input type="text" id="dni" placeholder="Ej: 12345678" required>
            </div>

            <div class="botones-grupo">
                <button onclick="grabarAlumno()">💾 Grabar Alumno</button>
                <button onclick="consultarAlumnos()">👁️ Ver Alumnos</button>
            </div>

            <div id="mensaje" class="mensaje"></div>
        </div>

        <!-- Tabla de Alumnos -->
        <div class="tabla-container" id="tablaContainer">
            <h2>📋 Alumnos Registrados</h2>
            <table id="tablaAlumnos">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Apellidos</th>
                        <th>Nombres</th>
                        <th>DNI</th>
                        <th>Fecha de Registro</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            <button onclick="volverAlFormulario()" style="margin-top: 20px; width: 100%;">← Volver al Formulario</button>
        </div>
    </div>

    <script>
        const BACKEND_URL = 'http://10.0.2.16:3454';

        async function grabarAlumno() {
            const apellidos = document.getElementById('apellidos').value.trim();
            const nombres = document.getElementById('nombres').value.trim();
            const dni = document.getElementById('dni').value.trim();
            const mensaje = document.getElementById('mensaje');

            if (!apellidos || !nombres || !dni) {
                mostrarMensaje('Por favor completa todos los campos', 'error');
                return;
            }

            try {
                const response = await fetch(`${BACKEND_URL}/grabaAlumnos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ apellidos, nombres, dni })
                });

                const data = await response.json();

                if (data.resultado === 1) {
                    mostrarMensaje('✅ Alumno registrado exitosamente', 'exito');
                    limpiarFormulario();
                } else {
                    mostrarMensaje('❌ ' + data.mensaje, 'error');
                }
            } catch (error) {
                mostrarMensaje('❌ Error de conexión con el servidor backend', 'error');
                console.error('Error:', error);
            }
        }

        async function consultarAlumnos() {
            try {
                const response = await fetch(`${BACKEND_URL}/consultarAlumnos`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (data.resultado === 1 && data.data.length > 0) {
                    llenarTabla(data.data);
                    mostrarTabla();
                } else {
                    mostrarMensaje('❌ No hay alumnos registrados', 'error');
                }
            } catch (error) {
                mostrarMensaje('❌ Error de conexión con el servidor backend', 'error');
                console.error('Error:', error);
            }
        }

        function llenarTabla(alumnos) {
            const tbody = document.querySelector('#tablaAlumnos tbody');
            tbody.innerHTML = '';

            alumnos.forEach(alumno => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${alumno.id}</td>
                    <td>${alumno.apellidos}</td>
                    <td>${alumno.nombres}</td>
                    <td>${alumno.dni}</td>
                    <td>${new Date(alumno.fecha_registro).toLocaleDateString('es-ES')}</td>
                `;
                tbody.appendChild(fila);
            });
        }

        function mostrarTabla() {
            document.getElementById('formulario').style.display = 'none';
            document.getElementById('tablaContainer').style.display = 'block';
        }

        function volverAlFormulario() {
            document.getElementById('formulario').style.display = 'block';
            document.getElementById('tablaContainer').style.display = 'none';
        }

        function mostrarMensaje(texto, tipo) {
            const mensaje = document.getElementById('mensaje');
            mensaje.textContent = texto;
            mensaje.className = `mensaje ${tipo}`;
            mensaje.style.display = 'block';

            if (tipo === 'exito') {
                setTimeout(() => {
                    mensaje.style.display = 'none';
                }, 3000);
            }
        }

        function limpiarFormulario() {
            document.getElementById('apellidos').value = '';
            document.getElementById('nombres').value = '';
            document.getElementById('dni').value = '';
            document.getElementById('apellidos').focus();
        }
    </script>
</body>
</html>
```

### Configurar Apache para servir la aplicación

```bash
# Crear archivo de configuración virtual host
sudo nano /etc/apache2/sites-available/sistema.conf
```

**Contenido de sistema.conf:**
```apache
<VirtualHost *:8080>
    ServerName localhost
    ServerAdmin admin@localhost
    DocumentRoot /var/www/html/Sistema

    <Directory /var/www/html/Sistema>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

```bash
# Editar puerto de Apache
sudo nano /etc/apache2/ports.conf

# Cambiar: Listen 80
# Por: Listen 8080

# Habilitar el sitio
sudo a2ensite sistema.conf

# Habilitar módulo proxy (si es necesario)
sudo a2enmod proxy
sudo a2enmod proxy_http

# Probar configuración
sudo apache2ctl configtest

# Reiniciar Apache
sudo systemctl restart apache2

# Verificar que está escuchando en puerto 8080
sudo netstat -tuln | grep 8080
```

---

## 🔧 Optimización: Desactivar Cloud-Init

**Nota:** Si tus servidores inician lentamente, desactiva cloud-init:

```bash
# Opción 1: Crear archivo de desactivación
sudo touch /etc/cloud/cloud-init.disabled

# Opción 2: Detener los servicios
sudo systemctl stop cloud-init
sudo systemctl disable cloud-init
sudo systemctl mask cloud-init
sudo systemctl disable cloud-config
sudo systemctl disable cloud-final
sudo systemctl disable cloud-init-local

# Desactivar el servicio que espera la red
sudo systemctl disable systemd-networkd-wait-online.service
sudo systemctl mask systemd-networkd-wait-online.service

# Verificar estado
dpkg -l | grep cloud-init
ls -l /etc/cloud/cloud-init.disabled
systemctl status cloud-init
```

---

## 🚀 Acceso Final desde el Host

### Acceso a las Máquinas Virtuales

```bash
# Desde PowerShell o terminal del host

# VM1 (Base de Datos)
ssh -p 2221 usuario@localhost

# VM2 (Backend)
ssh -p 2222 usuario@localhost

# VM3 (Frontend)
ssh -p 2223 usuario@localhost
```

### Acceso a la Aplicación Web

Abrir navegador en la máquina host y acceder a:
```
http://192.168.100.50:8080/Sistema
```
*(Reemplazar 192.168.100.50 con la IP real del host)*

---

## 📦 Clonar y Recrear en Otra Computadora

### Paso 1: Preparar los Archivos

```powershell
# En la computadora origen, localizar los archivos VirtualBox
cd C:\Users\[Usuario]\VirtualBox VMs\

# Copiar las carpetas:
Copy-Item -Path "BD" -Destination "D:\backup-maquinas\" -Recurse
Copy-Item -Path "backend" -Destination "D:\backup-maquinas\" -Recurse
Copy-Item -Path "frontend" -Destination "D:\backup-maquinas\" -Recurse
```

### Paso 2: Transferir a la Nueva Computadora

- Comprimir las carpetas en un archivo ZIP
- Transferir por USB, OneDrive, Google Drive o similar
- Descomprimir en la computadora destino

### Paso 3: Importar las Máquinas Virtuales

```powershell
cd "C:\Program Files\Oracle\VirtualBox"

# Importar VM1 (BD)
.\VBoxManage registervm "C:\Ruta\Nueva\BD\BD.vbox"

# Importar VM2 (Backend)
.\VBoxManage registervm "C:\Ruta\Nueva\backend\backend.vbox"

# Importar VM3 (Frontend)
.\VBoxManage registervm "C:\Ruta\Nueva\frontend\frontend.vbox"

# Verificar que se registraron
.\VBoxManage list vms
```

### Paso 4: Iniciar las Máquinas

```powershell
# Iniciar todas las máquinas
.\VBoxManage startvm "BD" --type headless
.\VBoxManage startvm "backend" --type headless
.\VBoxManage startvm "frontend" --type headless

# O desde la GUI haciendo doble clic en cada VM
```

### Paso 5: Verificar Conectividad

```bash
# Probar acceso SSH
ssh -p 2221 usuario@localhost
ssh -p 2222 usuario@localhost
ssh -p 2223 usuario@localhost

# Probar acceso web
# Abrir navegador: http://192.168.100.50:8080/Sistema
```

---

## 📊 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                      HOST (Máquina Física)                  │
│                    192.168.100.50:8080                      │
└─────────────────────────────────────────────────────────────┘
                              ↑
                    NAT Port Forwarding
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     VIRTUALBOX (NAT Network)                │
│                        10.0.2.0/24                          │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────┐   │
│  │  VM1 (BD)      │  │ VM2 (Backend)  │  │VM3 (Frontend)│  │
│  │10.0.2.15:3306 │  │ 10.0.2.16:3454 │  │10.0.2.17:80 │  │
│  │   MariaDB      │  │    Node.js     │  │   Apache    │  │
│  │                │  │                │  │             │  │
│  │ :2221→ssh      │  │:2222→ssh       │  │ :2223→ssh   │  │
│  └────────────────┘  └────────────────┘  └─────────────┘  │
│         ↑                    ↑                     ↑         │
│         └────────────────────┼─────────────────────┘         │
│                   Comunicación Interna                       │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist de Verificación

- [ ] Las 3 máquinas virtuales están creadas y ejecutándose
- [ ] Cada VM tiene una IP estática asignada correctamente (10.0.2.15, 10.0.2.16, 10.0.2.17)
- [ ] El reenvío de puertos SSH está configurado (puertos 2221, 2222, 2223)
- [ ] MariaDB está instalado en VM1 y escuchando en 0.0.0.0:3306
- [ ] La tabla `alumnos` está creada con los campos correctos
- [ ] Node.js Backend está ejecutándose en VM2:3454
- [ ] Apache está serviendo contenido en VM3:8080
- [ ] Se puede acceder remotamente por SSH a las 3 máquinas
- [ ] Se puede acceder a la interfaz web desde el navegador del host
- [ ] El frontend se comunica correctamente con el backend
- [ ] El backend se comunica correctamente con la base de datos

---

## 🐛 Solución de Problemas Comunes

### Problema: No puedo conectar por SSH
```bash
# Verificar que SSH está habilitado en la VM
sudo systemctl status ssh

# Habilitar SSH
sudo systemctl enable ssh
sudo systemctl start ssh

# Verificar puerto
sudo netstat -tuln | grep 22
```

### Problema: El Backend no se conecta a la BD
```bash
# Verificar conectividad desde VM2 a VM1
ssh -p 2222 usuario@localhost
ping 10.0.2.15

# Verificar que MariaDB está escuchando
ssh -p 2221 usuario@localhost
sudo netstat -tuln | grep 3306

# Probar conexión desde línea de comandos
mysql -h 10.0.2.15 -u usuario_consulta -p
```

### Problema: El Frontend no muestra datos
```bash
# Verificar que Apache está corriendo
ssh -p 2223 usuario@localhost
sudo systemctl status apache2

# Ver logs de Apache
sudo tail -f /var/log/apache2/error.log

# Verificar conectividad desde VM3 a VM2
ping 10.0.2.16
curl http://10.0.2.16:3454/consultarAlumnos
```

---

## 📚 Referencias

- [VirtualBox Documentation](https://www.virtualbox.org/wiki/Documentation)
- [Ubuntu Server Guide](https://ubuntu.com/server/docs)
- [MariaDB Documentation](https://mariadb.com/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Apache HTTP Server](https://httpd.apache.org/docs/)
- [JavaScript Fetch API](https://developer.mozilla.org/es/docs/Web/API/Fetch_API)

---

## 👤 Autor

**Nombre:** Colman Máximo  
**Institución:** Seminario de Actualización - Tareas Generales  
**Fecha de Creación:** Mayo 2026

---

## 📝 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y no comercial.

---

**Última actualización:** Mayo 2026
