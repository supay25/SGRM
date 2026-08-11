const OFFSET = '-06:00';
const SEIS_HORAS = 6 * 60 * 60 * 1000;

// Fecha de negocio ('YYYY-MM-DD') a la que pertenece un instante dado
export const fechaNegocioDe = (instante) =>
  new Date(instante.getTime() - SEIS_HORAS).toISOString().slice(0, 10);

export const fechaNegocioHoy = () => fechaNegocioDe(new Date());

export const rangoDelDia = (fechaStr) => ({
  inicio: new Date(`${fechaStr}T00:00:00.000${OFFSET}`),
  fin: new Date(`${fechaStr}T23:59:59.999${OFFSET}`),
});

export const fechaCierre = (fechaStr) => new Date(`${fechaStr}T00:00:00.000Z`);