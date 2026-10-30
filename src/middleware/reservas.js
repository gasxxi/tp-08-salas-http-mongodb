function validarCampos(req, res, next) {
  const valores = req.body ?? {};

  // Rechazar tipos estructurados directos en campos de texto
  if (
    typeof valores.estudiante === "object" ||
    typeof valores.email === "object" ||
    typeof valores.fecha === "object" ||
    typeof valores.sala === "object" ||
    typeof valores.turno === "object"
  ) {
    return responderInvalido(req, res, valores, "Los campos deben ser texto.");
  }

  const estudiante = String(valores.estudiante ?? "").trim();
  const email = String(valores.email ?? "").trim();
  const fecha = String(valores.fecha ?? "").trim();
  const sala = String(valores.sala ?? "").trim();
  const turno = String(valores.turno ?? "").trim();

  // Validar 'personas': rechazar booleanos/objetos y admitir número o texto numérico entero
  if (
    typeof valores.personas === "boolean" ||
    typeof valores.personas === "object"
  ) {
    return responderInvalido(
      req,
      res,
      valores,
      "Personas debe ser un número entero entre 1 y 6.",
    );
  }

  const personasRaw = String(valores.personas ?? "").trim();
  const personasNum = Number(personasRaw);

  const esEnteroValido =
    personasRaw !== "" &&
    !Number.isNaN(personasNum) &&
    Number.isInteger(personasNum) &&
    personasNum >= 1 &&
    personasNum <= 6;

  const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
  const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

  if (
    !estudiante ||
    !email ||
    !email.includes("@") ||
    !fecha ||
    !salasPermitidas.includes(sala) ||
    !turnosPermitidos.includes(turno) ||
    !esEnteroValido
  ) {
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

function responderInvalido(req, res, valores, mensaje) {
  if (req.path.startsWith("/api/")) {
    return res.status(400).json({ error: mensaje });
  }
  return res.status(400).render("reservas/nueva", {
    titulo: "Nueva reserva",
    error: mensaje,
    valores,
  });
}
