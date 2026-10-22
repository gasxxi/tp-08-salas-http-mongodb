const { leerConfiguracion } = require("./config/entorno");
const {
  conectarBaseDatos,
  desconectarBaseDatos,
} = require("./config/base-datos");
const { crearApp } = require("./app");

async function main() {
  const { puerto, formatoRegistro } = leerConfiguracion();

  // Conectar a Atlas antes de escuchar peticiones
  await conectarBaseDatos();
  console.log("Conectado a MongoDB Atlas.");

  const app = crearApp({ formatoRegistro });

  const servidor = app.listen(puerto, () => {
    console.log(`Servidor disponible en http://localhost:${puerto}`);
  });

  // Cierre ordenado
  async function cerrar() {
    console.log("\nCerrando servidor...");
    servidor.close(async () => {
      await desconectarBaseDatos();
      console.log("Conexión a MongoDB cerrada.");
      process.exit(0);
    });
  }

  process.on("SIGINT", cerrar);
  process.on("SIGTERM", cerrar);
}

main().catch((error) => {
  console.error("No se pudo iniciar la aplicación:", error.message);
  process.exit(1);
});
