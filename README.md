# Trabajo práctico 08 - Endpoints persistentes de reservas de salas

## 1. Origen del proyecto y cambios respecto al TP 07
Para este trabajo tomé como punto de partida mi entrega del TP 07 (`tp-07-salas-mongodb`). En aquella entrega el sitio web funcionaba guardando datos temporales en memoria y la persistencia en MongoDB Atlas solo se probaba mediante scripts sueltos por consola. 
En esta entrega migré todo el almacenamiento a un servicio asíncrono con Mongoose (`src/servicios/reservas-mongo.js`), de modo que tanto las vistas web tradicionales en EJS como una nueva API JSON (`/api/reservas`) consultan y modifican los mismos documentos en la nube. Además, retiré la carga de datos iniciales en memoria (`semillaReservas`) para no duplicar fuentes activas.

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
3. Se mantuvo la corrección de DNS en `src/config/base-datos.js` usando resolutores públicos (`8.8.8.8` y `1.1.1.1`) para garantizar la resolución SRV.
4. En el archivo local `.env` (el cual no se entrega ni se sube a Git) se configuró la cadena privada:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@HOST/reservas_salas_u8?retryWrites=true&w=majority