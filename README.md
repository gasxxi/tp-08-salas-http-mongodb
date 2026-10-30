# Trabajo práctico 08 - Endpoints persistentes de reservas de salas

## 1. Origen del proyecto y cambios respecto al TP 07
Para este trabajo práctico partí de mi entrega del TP 07 (`tp-07-salas-mongodb`). En esa versión anterior, la aplicación web Express gestionaba las reservas temporalmente en la memoria del servidor, mientras que la base de datos en MongoDB Atlas solo se utilizaba de forma experimental a través de pequeños scripts sueltos por consola.

En esta entrega completé la integración total:
* Migré todo el almacenamiento a un servicio asíncrono unificado con Mongoose (`src/servicios/reservas-mongo.js`).
* Tanto las pantallas web renderizadas con EJS como la nueva API REST (`/api/reservas`) consultan y modifican los mismos documentos reales alojados en Atlas.
* Retiré la semilla de reservas en memoria (`semillaReservas`) para asegurar que no existan dos fuentes de datos activas ni datos efímeros.

## 2. Tecnologías y versiones
* **Node.js**: v24.x (entorno de ejecución en CommonJS)
* **MongoDB Atlas**: Clúster Free (M0)
* **Mongoose**: v8.x / v9.x (modelado de datos y persistencia)
* **Express**: v4.x / v5.x (servidor web y ruteo HTTP)
* **EJS y express-ejs-layouts**: Motor de plantillas y layouts para las vistas HTML
* **Postman**: Herramienta de escritorio para la verificación y prueba de endpoints de la API

## 3. Configuración del entorno y MongoDB Atlas
1. Se configuró un clúster gratuito M0 en MongoDB Atlas con un usuario con permisos de lectura y escritura, y se habilitó la IP actual en *Network Access*.
2. La base de datos creada específicamente para esta entrega es `reservas_salas_u8` (colección física `reservas`).
3. Se mantuvo la corrección de DNS en `src/config/base-datos.js` mediante `dns.setServers(["8.8.8.8", "1.1.1.1"])` para garantizar la resolución adecuada de registros SRV en cualquier red.
4. Las variables privadas se gestionan localmente en un archivo `.env` (el cual está protegido en `.gitignore` y no se sube a Git):

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@HOST/reservas_salas_u8?retryWrites=true&w=majority