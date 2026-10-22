const { Reserva } = require("../modelos/reserva");

function formatearReserva(doc) {
  return {
    id: doc._id.toString(),
    estudiante: doc.estudiante,
    email: doc.email,
    sala: doc.sala,
    fecha: doc.fecha,
    turno: doc.turno,
    personas: doc.personas,
    estado: doc.estado,
  };
}

async function listarReservas(filtro = {}) {
  const criterio = {};
  if (filtro.sala) {
    criterio.sala = filtro.sala;
  }
  const docs = await Reserva.find(criterio).lean();
  return docs.map(formatearReserva);
}

async function obtenerReservaPorId(id) {
  const doc = await Reserva.findById(id).lean();
  if (!doc) {
    return null;
  }
  return formatearReserva(doc);
}

async function contarReservas() {
  return await Reserva.countDocuments();
}

async function crearReserva(datos) {
  // El cliente solo envía los 6 campos del formulario; estado toma el default
  const nuevoDoc = await Reserva.create({
    estudiante: datos.estudiante,
    email: datos.email,
    sala: datos.sala,
    fecha: datos.fecha,
    turno: datos.turno,
    personas: datos.personas,
  });
  return formatearReserva(nuevoDoc.toObject());
}

module.exports = {
  listarReservas,
  obtenerReservaPorId,
  contarReservas,
  crearReserva,
};
