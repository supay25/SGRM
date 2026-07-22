export function formatearColones(monto) {
  return `₡${Math.round(monto).toLocaleString('en-US')}`
}
