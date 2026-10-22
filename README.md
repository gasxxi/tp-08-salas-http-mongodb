# Trabajo práctico 07 - Persistencia inicial de reservas de salas

## 1. Descripción y punto de partida
Para este trabajo práctico tomé como punto de partida la aplicación modular desarrollada en el TP 06 (`tp-06-salas-modular`) y le agregué un laboratorio de persistencia con base de datos NoSQL utilizando MongoDB Atlas y Mongoose.
El sitio web Express desarrollado en el TP 06 se conserva intacto y sigue operando con su servicio y almacenamiento en memoria (las rutas web, los controladores y las vistas no fueron modificados para usar promesas todavía, lo cual queda previsto para la unidad 8). La interacción con la base de datos se realiza de forma desacoplada a través de tres programas de consola independientes desarrollados en Node.js.

## 2. Tecnologías y versiones
* Node.js: v24.x (CommonJS)
* MongoDB Atlas: Clúster gratuito Free (M0)
* Mongoose: v8.x
* Express y EJS para la continuidad del servidor web del TP 06

## 3. Instalación y pasos desde una copia nueva
1. Clonar o descargar el repositorio.
2. Instalar las dependencias del proyecto:
```bash
npm install