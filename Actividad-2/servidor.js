import express from "express";

// Creamos la aplicación
const app = express();

// Puerto donde correrá el servidor
const PORT = 3000;

// Le decimos a Express que sirva archivos de la carpeta public
app.use(express.static("public"));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

/* 
 Diferencia entre servidor.js y public/JS/index.js
servidor.js → Es el archivo que ejecuta Node.js para levantar el servidor web. 
Contiene la lógica del backend: configuración de Express, rutas, middlewares, etc. 
En tu caso, simplemente sirve archivos estáticos desde la carpeta public.

public/JS/index.js → Es un archivo JavaScript que se ejecuta en el navegador del cliente 
(frontend). No tiene nada que ver con Node.js directamente. 
Este archivo puede contener código para manipular el DOM, 
hacer peticiones al servidor, etc. Los usuarios lo 
descargan cuando visitan tu página.
*/