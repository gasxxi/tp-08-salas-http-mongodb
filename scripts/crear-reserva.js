const {
  conectarBaseDatos,
  desconectarBaseDatos,
} = require("../src/config/base-datos");
const { Reserva } = require("../src/modelos/reserva");

async function main() {
  try {
    await conectarBaseDatos();
    const reserva = await Reserva.create({
      estudiante: "Gastón Albarracín",
      email: "gaston@ejemplo.com",
      sala: "Sala Multimedia",
      fecha: "2026-10-25",
      turno: "Tarde",
      personas: 3,
    });
    console.log("Reserva guardada. _id:", reserva._id.toString());
  } catch (error) {
    console.error("No se pudo crear la reserva:", error.name);
    if (error.errors) {
      console.error("Campos a revisar:", Object.keys(error.errors).join(", "));
    }
    console.error("Revisar datos, configuración y disponibilidad de MongoDB.");
    process.exitCode = 1;
  } finally {
    await desconectarBaseDatos();
  }
}

main();
