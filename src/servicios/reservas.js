function crearServicioReservas(datosIniciales = []) {
  const reservas = [...datosIniciales];
  let proximoId =
    reservas.length > 0 ? Math.max(...reservas.map((r) => r.id)) + 1 : 1;

  return {
    obtenerTodas() {
      return reservas;
    },
    obtenerPorId(id) {
      return reservas.find((r) => r.id === Number(id));
    },
    contar() {
      return reservas.length;
    },
    crear(datos) {
      const nuevaReserva = {
        id: proximoId++,
        ...datos,
      };
      reservas.push(nuevaReserva);
      return nuevaReserva;
    },
  };
}

module.exports = {
  crearServicioReservas,
};
