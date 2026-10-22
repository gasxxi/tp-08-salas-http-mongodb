const express = require("express");
const path = require("node:path");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");

const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");
const { crearRouterReservas } = require("./rutas/reservas");
const { crearRouterReservasApi } = require("./rutas/reservas-api");
const { manejarErrores } = require("./middleware/errores");
const controlador = require("./controladores/reservas");

function crearApp({ formatoRegistro }) {
  const app = express();

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));
  app.use(expressLayouts);
  app.set("layout", "layouts/main");

  app.use(morgan(formatoRegistro));
  app.use(identificarSolicitud);
  app.use(medirDuracion);
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Rutas generales
  app.get("/", controlador.mostrarInicio);
  app.get("/estado", controlador.obtenerEstado);

  // Router HTML y Router API
  app.use("/reservas", crearRouterReservas());
  app.use("/api/reservas", crearRouterReservasApi());

  // 404
  app.use((req, res) => {
    if (req.originalUrl.startsWith("/api/")) {
      return res.status(404).json({ error: "Ruta de API no encontrada." });
    }
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      mensaje: "El recurso solicitado no existe.",
    });
  });

  // Middleware de errores
  app.use(manejarErrores);

  return app;
}

module.exports = { crearApp };
