const servicio = require("../servicios/reservas-mongo");
const mongoose = require("mongoose");

const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

// Controladores para la web HTML
async function mostrarInicio(_req, res) {
  res.status(200).render("inicio", {
    titulo: "Inicio - Sistema de Reservas",
  });
}

async function obtenerEstado(_req, res, next) {
  try {
    const cantidad = await servicio.contarReservas();
    res.status(200).json({
      servicio: "activo",
      cantidad,
      solicitudId: res.locals.solicitudId,
    });
  } catch (error) {
    next(error);
  }
}

async function listarHtml(_req, res, next) {
  try {
    const reservas = await servicio.listarReservas();
    res.status(200).render("reservas/lista", {
      titulo: "Listado de reservas",
      reservas,
    });
  } catch (error) {
    next(error);
  }
}

function formularioNueva(_req, res) {
  res.status(200).render("reservas/nueva", {
    titulo: "Nueva reserva",
    error: null,
    valores: {},
    salasPermitidas,
    turnosPermitidos,
  });
}

async function mostrarDetalleHtml(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
        mensaje: `Identificador inválido: ${id}`,
      });
    }

    const reserva = await servicio.obtenerReservaPorId(id);
    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
        mensaje: `No se encontró la reserva con ID ${id}`,
      });
    }

    res.status(200).render("reservas/detalle", {
      titulo: `Detalle de reserva #${reserva.id}`,
      reserva,
    });
  } catch (error) {
    next(error);
  }
}

async function crearHtml(req, res, next) {
  try {
    const nueva = await servicio.crearReserva(req.reservaValidada);
    res.redirect(302, `/reservas/${nueva.id}`);
  } catch (error) {
    next(error);
  }
}

// Controladores para la API JSON
async function listarApi(req, res, next) {
  try {
    const { sala } = req.query;

    if (Array.isArray(sala)) {
      return res.status(400).json({
        error: "El parámetro 'sala' no puede repetirse.",
      });
    }

    const reservas = await servicio.listarReservas({ sala });
    res.status(200).json(reservas);
  } catch (error) {
    next(error);
  }
}

async function obtenerPorIdApi(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "El identificador proporcionado no es un ObjectId válido.",
      });
    }

    const reserva = await servicio.obtenerReservaPorId(id);
    if (!reserva) {
      return res.status(404).json({
        error: "Reserva no encontrada.",
      });
    }

    res.status(200).json(reserva);
  } catch (error) {
    next(error);
  }
}

async function crearApi(req, res, next) {
  try {
    const nueva = await servicio.crearReserva(req.reservaValidada);
    res.set("Location", `/api/reservas/${nueva.id}`);
    res.status(201).json(nueva);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  mostrarInicio,
  obtenerEstado,
  listarHtml,
  formularioNueva,
  mostrarDetalleHtml,
  crearHtml,
  listarApi,
  obtenerPorIdApi,
  crearApi,
  salasPermitidas,
  turnosPermitidos,
};
