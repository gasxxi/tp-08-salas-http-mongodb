const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const path = require("node:path");
const {
  crearIdentificadorSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");
const { manejarErrores } = require("./middleware/errores");
const { mostrarInicio, obtenerEstado } = require("./controladores/reservas");
const { crearRouterReservas } = require("./rutas/reservas");
const { crearRouterReservasApi } = require("./rutas/reservas-api");

function crearApp() {
  const app = express();

  // Motor de plantillas y layouts
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));
  app.set("layout", "layouts/main");

  // Middlewares globales
  app.use(morgan("dev"));
  app.use(crearIdentificadorSolicitud());
  app.use(medirDuracion);
  app.use(expressLayouts);
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Rutas principales y de estado
  app.get("/", mostrarInicio);
  app.get("/estado", obtenerEstado);

  // Routers
  app.use("/reservas", crearRouterReservas());
  app.use("/api/reservas", crearRouterReservasApi());

  // 404 para rutas inexistentes
  app.use((req, res) => {
    if (req.originalUrl?.startsWith("/api/") || req.path?.startsWith("/api/")) {
      return res.status(404).json({ error: "Ruta no encontrada." });
    }
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      mensaje: "La dirección solicitada no existe.",
    });
  });

  // Middleware global de errores
  app.use(manejarErrores);

  return app;
}

module.exports = { crearApp };
