let numeroDeSolicitud = 0;

function identificarSolicitud(req, res, next) {
  numeroDeSolicitud += 1;
  res.locals.solicitudId = `BIB-${String(numeroDeSolicitud).padStart(4, "0")}`;
  next();
}

function medirDuracion(req, res, next) {
  const inicio = process.hrtime.bigint();

  res.on("finish", () => {
    const fin = process.hrtime.bigint();
    const duracionMs = Number(fin - inicio) / 1_000_000;
    const log = `[${res.locals.solicitudId || "SIN-ID"}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duracionMs.toFixed(2)} ms)`;
    console.log(log);
  });

  next();
}

module.exports = {
  identificarSolicitud,
  medirDuracion,
};
