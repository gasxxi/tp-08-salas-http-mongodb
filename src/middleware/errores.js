/* eslint-disable no-unused-vars */
function manejarErrores(err, req, res, _next) {
  console.error("Error no controlado:", err);

  if (req.originalUrl.startsWith("/api/")) {
    return res.status(500).json({ error: "Error interno del servidor." });
  }

  res.status(500).render("no-encontrado", {
    titulo: "Error del servidor",
    mensaje: "Ocurrió un error inesperado al procesar la solicitud.",
  });
}

module.exports = { manejarErrores };