import http.server
import socketserver

# Puerto donde correrá el servidor
PORT = 5000

# Configurar el manejador para servir archivos desde la carpeta "public"
Handler = http.server.SimpleHTTPRequestHandler
Handler.directory = "public"  # Carpeta raíz para los archivos estáticos

# Crear el servidor TCP
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Servidor funcionando en http://localhost:{PORT}")
    # Mantener el servidor en ejecución hasta que se interrumpa (Ctrl+C)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")