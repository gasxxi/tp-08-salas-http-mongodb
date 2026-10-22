const express = require("express");
const {
  prepararAreaReservas,
  validarReserva,
} = require("../middleware/reservas");
const controlador = require("../controladores/reservas");

function crearRouterReservas() {
  const router = express.Router();

  router.use(prepararAreaReservas);

  router.get("/", controlador.listarHtml);
  router.get("/nueva", controlador.formularioNueva);
  router.get("/:id", controlador.mostrarDetalleHtml);
  router.post("/", validarReserva, controlador.crearHtml);

  return router;
}

module.exports = { crearRouterReservas };
