const mongoose = require("mongoose");
const dns = require("node:dns");
const { leerUriMongo } = require("./entorno");

// Resolutores DNS para evitar problemas de conexión con Atlas
dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function conectarBaseDatos() {
  await mongoose.connect(leerUriMongo(), {
    serverSelectionTimeoutMS: 5000,
  });
}

async function desconectarBaseDatos() {
  await mongoose.disconnect();
}

module.exports = { conectarBaseDatos, desconectarBaseDatos };
