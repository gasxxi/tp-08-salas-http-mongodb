const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

function prepararAreaReservas(_req, res, next) {
  res.locals.seccion = "Reservas de salas";
  next();
}

function responderInvalido(req, res, valores, mensaje) {
  if (req.originalUrl?.startsWith("/api/") || req.path?.startsWith("/api/")) {
    return res.status(400).json({ error: mensaje });
  }

  return res.status(400).render("reservas/nueva", {
    titulo: "Nueva reserva",
    error: mensaje,
    valores,
    salasPermitidas,
    turnosPermitidos,
  });
}

function validarReserva(req, res, next) {
  const valores = req.body ?? {};

  // Rechazar tipos estructurados (arrays u objetos) en campos de texto
  if (
    (valores.estudiante !== undefined &&
      typeof valores.estudiante === "object") ||
    (valores.email !== undefined && typeof valores.email === "object") ||
    (valores.sala !== undefined && typeof valores.sala === "object") ||
    (valores.fecha !== undefined && typeof valores.fecha === "object") ||
    (valores.turno !== undefined && typeof valores.turno === "object")
  ) {
    return responderInvalido(req, res, valores, "Los campos deben ser texto.");
  }

  const estudiante = String(valores.estudiante ?? "").trim();
  const email = String(valores.email ?? "").trim();
  const fecha = String(valores.fecha ?? "").trim();
  const sala = String(valores.sala ?? "").trim();
  const turno = String(valores.turno ?? "").trim();

  // Rechazar booleanos y objetos en personas
  if (
    typeof valores.personas === "boolean" ||
    typeof valores.personas === "object"
  ) {
    return responderInvalido(
      req,
      res,
      valores,
      "Personas debe ser un entero entre 1 y 6.",
    );
  }

  // Permitir conversión de texto numérico a número entero
  const personasRaw = String(valores.personas ?? "").trim();
  const personasNum = Number(personasRaw);

  const esEnteroValido =
    personasRaw !== "" &&
    !Number.isNaN(personasNum) &&
    Number.isInteger(personasNum) &&
    personasNum >= 1 &&
    personasNum <= 6;

  const esValido =
    estudiante &&
    email &&
    email.includes("@") &&
    fecha &&
    salasPermitidas.includes(sala) &&
    turnosPermitidos.includes(turno) &&
    esEnteroValido;

  if (!esValido) {
    return responderInvalido(req, res, valores, "Revisá los datos enviados.");
  }

  req.reservaValidada = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas: personasNum,
  };

  next();
}

module.exports = {
  prepararAreaReservas,
  validarReserva,
  salasPermitidas,
  turnosPermitidos,
};
