const express = require("express");
const {
  listarApi,
  obtenerPorIdApi,
  crearApi,
} = require("../controladores/reservas");
const { validarReserva } = require("../middleware/reservas");

function crearRouterReservasApi() {
  const router = express.Router();

  router.get("/", listarApi);
  router.get("/:id", obtenerPorIdApi);
  router.post("/", validarReserva, crearApi);

  return router;
}

module.exports = { crearRouterReservasApi };
