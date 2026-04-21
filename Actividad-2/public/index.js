import express from "express"

// Creamos la aplicación de Express
const app = express()

// Definimos el puerto donde correrá el servidor
const PORT = 3000

// Le decimos a Express que sirva archivos estáticos
// desde la carpeta "public"
app.use(express.static("public"))

// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`)
})