async function listarApi(req, res, next) {
  try {
    const { sala } = req.query;

    if (sala !== undefined) {
      // Si es un arreglo o un objeto, responder 400
      if (typeof sala !== "string" || Array.isArray(sala)) {
        return res
          .status(400)
          .json({
            error: "El filtro 'sala' debe ser un único valor de texto.",
          });
      }
    }

    // Pasar string limpio o undefined al servicio (nunca req.query crudo)
    const criterioSala = typeof sala === "string" ? sala.trim() : undefined;
    const reservas = await servicio.listar(criterioSala);
    return res.status(200).json(reservas);
  } catch (error) {
    next(error);
  }
}
