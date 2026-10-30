async function listar(sala) {
  const filtro = {};
  if (sala) {
    // Igualdad exacta de string, sin operadores MongoDB
    filtro.sala = String(sala);
  }
  return await Reserva.find(filtro);
}
