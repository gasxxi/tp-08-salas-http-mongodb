function manejarErrores(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  // Detectar errores de cliente (400) vs internas (500)
  const esJsonMalFormado =
    error.type === "entity.parse.failed" ||
    (error instanceof SyntaxError && error.status === 400 && "body" in error);
  const esValidacion = error.name === "ValidationError";
  const esIdInvalido = error.codigo === "ID_INVALIDO";
  const esFiltroInvalido = error.codigo === "FILTRO_INVALIDO";

  const esEntrada =
    esJsonMalFormado || esValidacion || esIdInvalido || esFiltroInvalido;
  const estado = esEntrada ? 400 : 500;

  let mensaje = esEntrada
    ? "Revisá los datos enviados."
    : "No se pudo completar la operación.";
  if (esJsonMalFormado) mensaje = "JSON mal formado.";
  if (esIdInvalido)
    mensaje = "El identificador debe tener 24 caracteres hexadecimales.";

  // Respuestas API
  if (req.originalUrl.startsWith("/api/") || req.path.startsWith("/api/")) {
    return res.status(estado).json({
      error: mensaje,
      ...(esValidacion && error.errors
        ? { campos: Object.keys(error.errors) }
        : {}),
    });
  }

  // Respuestas HTML
  if (esValidacion && req.method === "POST") {
    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva reserva",
      error: mensaje,
      valores: req.body ?? {},
    });
  }

  return res.status(estado).render("no-encontrado", {
    titulo: esEntrada ? "Solicitud inválida" : "Error del servicio",
    mensaje,
  });
}

module.exports = { manejarErrores };
