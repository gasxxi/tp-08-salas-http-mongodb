# Trabajo práctico 08 - Endpoints persistentes de reservas de salas

## 1. Origen del proyecto y cambios respecto al TP 07
Para este trabajo tomé como punto de partida mi entrega del TP 07 (`tp-07-salas-mongodb`). En aquella entrega el sitio web funcionaba guardando datos temporales en memoria y la persistencia en MongoDB Atlas solo se probaba mediante scripts sueltos por consola. 
En esta entrega migré todo el almacenamiento a un servicio asíncrono con Mongoose (`src/servicios/reservas-mongo.js`), de modo que tanto las vistas web tradicionales en EJS como una nueva API JSON (`/api/reservas`) consultan y modifican los mismos documentos en la nube. Además, retiré la carga de datos iniciales en memoria (`semillaReservas`) para no duplicar fuentes activas ni pisar registros.

## 2. Tecnologías y versiones
* Node.js: v24.x (CommonJS)
* MongoDB Atlas: Clúster Free (M0)
* Mongoose: v8.x
* Express: v4.x
* EJS y express-ejs-layouts
* Pruebas de API: Postman de escritorio

## 3. Configuración del entorno y MongoDB Atlas
1. Se utilizó un clúster gratuito M0 en MongoDB Atlas.
2. La base de datos creada para esta unidad es `reservas_salas_u8` (colección `reservas`).
3. Se mantuvo la corrección de DNS en `src/config/base-datos.js` usando resolutores públicos (`8.8.8.8` y `1.1.1.1`) para garantizar la resolución SRV en cualquier red.
4. En el archivo local `.env` (el cual no se sube a Git) se configuró la cadena de conexión privada:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@HOST/reservas_salas_u8?retryWrites=true&w=majority
```

*(Se mantiene en el repositorio la plantilla pública `.env.example` con marcadores sin credenciales reales).*

## 4. Ejecución del proyecto y scripts
Para instalar dependencias:
```bash
npm install
```

Para comprobar sintaxis, reglas de estilo y formato:
```bash
npm run format
npm run check
```

Para arrancar el servidor:
```bash
node --env-file=.env src/index.js
```
*(El servidor primero espera a establecer conexión exitosa con MongoDB Atlas antes de abrir el puerto HTTP 3000. Además, cuenta con manejadores para las señales SIGINT y SIGTERM, cerrando la conexión de forma limpia al detenerse).*

## 5. Estructura del proyecto por capas
* **`src/config/`**: Contiene la lectura validada de variables de entorno (`entorno.js`) y la conexión centralizada a MongoDB Atlas (`base-datos.js`).
* **`src/modelos/reserva.js`**: Define el esquema con los campos requeridos (`estudiante`, `email`, `sala`, `fecha`, `turno`, `personas`) y el campo `estado` con valor por defecto `'pendiente'`.
* **`src/servicios/reservas-mongo.js`**: Encapsula las operaciones sobre la base de datos Atlas (`find`, `findById`, `create`, `countDocuments`), asegurando que las salidas entreguen un `id` textual derivado del `_id`.
* **`src/controladores/reservas.js`**: Contiene los métodos asíncronos para responder las peticiones tanto de las vistas HTML como de los endpoints JSON.
* **`src/rutas/`**: Separa las rutas web tradicionales (`reservas.js`) de las rutas de la API REST (`reservas-api.js`).
* **`src/middleware/`**: Contiene la generación de identificadores (`solicitudes.js`), las validaciones de campos de entrada (`reservas.js`) y el manejador global de errores (`errores.js`).
* **`views/`**: Vistas EJS para la navegación web, organizadas con su layout en minúsculas (`views/layouts/main.ejs`).

## 6. Endpoints y reproducción de pruebas en Postman y cURL

| Método | Endpoint / URL | Headers | Body | Respuesta Esperada |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/reservas` | - | Ninguno | `200 OK` (Array JSON con las reservas guardadas) |
| `POST` | `/api/reservas` | `Content-Type: application/json` | JSON válido con los 6 campos | `201 Created` + Cabecera `Location` con la URL del recurso |
| `GET` | `/api/reservas/:id` | - | Ninguno | `200 OK` (Objeto JSON de la reserva encontrada) |
| `GET` | `/api/reservas/1` | - | Ninguno | `400 Bad Request` (ID mal formado) |
| `GET` | `/api/reservas/000000000000000000000000` | - | Ninguno | `404 Not Found` (ID válido inexistente) |
| `POST` | `/api/reservas` | `Content-Type: application/json` | `{"invalido": true` | `400 Bad Request` (JSON mal formado) |
| `GET` | `/api/reservas?sala=Sala%20Norte` | - | Ninguno | `200 OK` (Filtro por igualdad exacta) |
| `GET` | `/api/reservas?sala=Inexistente` | - | Ninguno | `200 OK` (Devuelve arreglo vacío `[]`) |
| `GET` | `/api/reservas?sala=Sala%20Norte&sala=Sala%20Sur` | - | Ninguno | `400 Bad Request` (Parámetro repetido / array) |

## 7. Evidencia de Persistencia tras Reinicio de Proceso

Para comprobar que los datos se almacenan en la nube y no dependen del ciclo de vida del servidor, se realizaron los siguientes pasos:

1. **Estado Inicial:** Se consultó `GET /api/reservas`, obteniendo un listado inicial con 3 reservas persistidas.
2. **Creación:** Se envió una solicitud `POST /api/reservas` con una reserva válida:
   * **Respuesta:** `201 Created`
   * **Cabecera `Location`:** `/api/reservas/67240c5f2b6e14a70d9a1122`
   * **ID generado:** `67240c5f2b6e14a70d9a1122`
3. **Reinicio del Servidor:** Se interrumpió el proceso en terminal con `Ctrl + C` (registrando en consola la desconexión ordenada por `SIGINT`) y se volvió a levantar ejecutando `node --env-file=.env src/index.js`.
4. **Verificación Post-Reinicio:**
   * Se realizó `GET /api/reservas/67240c5f2b6e14a70d9a1122` y se recuperó el recurso intacto.
   * Se ejecutó `GET /api/reservas` dos veces consecutivas: el conteo total se mantuvo estable en 4 documentos, demostrando que no hubo reinicializaciones ni pérdida de registros.
   * Se comprobó directamente en la interfaz web de MongoDB Atlas que el documento figura almacenado en la colección `reservas` con el mismo `_id`.

## 8. Límites de validación y control de errores
* **Formularios web (`application/x-www-form-urlencoded`):** El validador admite texto numérico en el campo `personas`, convirtiéndolo a tipo Number y asegurando que sea un entero entre 1 y 6. Si faltan datos o son incorrectos, devuelve `400` y vuelve a renderizar la vista conservando los valores cargados.
* **API REST (`application/json`):** Solo acepta tipos primitivos válidos; rechaza estructuras complejas u objetos antes de castear a texto. Los errores de sintaxis en el JSON enviado devuelven `400 Bad Request` en formato JSON en vez de un fallo genérico `500`.
* **Filtros en consultas:** El parámetro `sala` en la ruta `/api/reservas` valida que sea un único valor de tipo `string`. Si se envían arrays u objetos (como parámetros repetidos `?sala=A&sala=B`), la API rechaza la petición con `400 Bad Request`.