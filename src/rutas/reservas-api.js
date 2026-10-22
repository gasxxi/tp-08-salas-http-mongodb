const express = require("express");
const { validarReservaApi } = require("../middleware/reservas");
const controlador = require("../controladores/reservas");

function crearRouterReservasApi() {
  const router = express.Router();

  router.get("/", controlador.listarApi);
  router.get("/:id", controlador.obtenerPorIdApi);
  router.post("/", validarReservaApi, controlador.crearApi);

  return router;
}

module.exports = { crearRouterReservasApi };
