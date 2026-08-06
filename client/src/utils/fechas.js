// Fechas en formato "YYYY-MM-DD": el mismo que usan los inputs type="date" y la API.

export function aISO(fecha) {
  return fecha.toISOString().split('T')[0]
}

export function hoyISO() {
  return aISO(new Date())
}

// Rango por defecto de las estadísticas del owner: los últimos 30 días.
export function rangoUltimos30Dias() {
  const hasta = new Date()
  const desde = new Date()
  desde.setDate(desde.getDate() - 30)
  return { desde: aISO(desde), hasta: aISO(hasta) }
}
