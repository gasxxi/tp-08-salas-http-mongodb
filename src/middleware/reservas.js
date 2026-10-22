const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

function prepararAreaReservas(_req, res, next) {
  res.locals.seccion = "Reservas de salas";
  next();
}

function validarCampos(datos) {
  const valores = datos ?? {};
  const estudiante = String(valores.estudiante ?? "").trim();
  const email = String(valores.email ?? "").trim();
  const sala = String(valores.sala ?? "").trim();
  const fecha = String(valores.fecha ?? "").trim();
  const turno = String(valores.turno ?? "").trim();
  const personas =
    typeof valores.personas === "number" ? valores.personas : NaN;

  if (
    !estudiante ||
    !email.includes("@") ||
    !salasPermitidas.includes(sala) ||
    !fecha ||
    !turnosPermitidos.includes(turno) ||
    !Number.isInteger(personas) ||
    personas < 1 ||
    personas > 6
  ) {
    return null;
  }

  return { estudiante, email, sala, fecha, turno, personas };
}

function validarReserva(req, res, next) {
  const datosValidados = validarCampos(req.body);

  if (!datosValidados) {
    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva reserva",
      error:
        "Por favor revisá los datos. Completá todos los campos correctamente.",
      valores: req.body ?? {},
      salasPermitidas,
      turnosPermitidos,
    });
  }

  req.reservaValidada = datosValidados;
  next();
}

function validarReservaApi(req, res, next) {
  const datosValidados = validarCampos(req.body);

  if (!datosValidados) {
    return res.status(400).json({
      error: "Datos de reserva inválidos o incompletos.",
    });
  }

  req.reservaValidada = datosValidados;
  next();
}

module.exports = {
  prepararAreaReservas,
  validarReserva,
  validarReservaApi,
};
