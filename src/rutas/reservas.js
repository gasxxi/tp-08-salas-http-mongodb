const express = require("express");
const {
  listarHtml,
  formularioNueva,
  mostrarDetalleHtml,
  crearHtml,
} = require("../controladores/reservas");
const {
  prepararAreaReservas,
  validarReserva,
} = require("../middleware/reservas");

function crearRouterReservas() {
  const router = express.Router();

  router.use(prepararAreaReservas);

  router.get("/", listarHtml);
  router.get("/nueva", formularioNueva);
  router.get("/:id", mostrarDetalleHtml);
  router.post("/", validarReserva, crearHtml);

  return router;
}

module.exports = { crearRouterReservas };
