const {
  conectarBaseDatos,
  desconectarBaseDatos,
} = require("../src/config/base-datos");
const { Reserva } = require("../src/modelos/reserva");

async function main() {
  try {
    await conectarBaseDatos();

    const reservas = await Reserva.find({});

    console.log(`Total de reservas recuperadas: ${reservas.length}`);
    reservas.forEach((r, index) => {
      console.log(
        `${index + 1}. [${r._id.toString()}] ${r.estudiante} - Sala: ${r.sala} - Fecha: ${r.fecha} (${r.turno})`,
      );
    });
  } catch (error) {
    console.error("Error al listar las reservas:", error.message);
    process.exitCode = 1;
  } finally {
    await desconectarBaseDatos();
  }
}

main();
