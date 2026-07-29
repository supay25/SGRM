import { formatearColones } from '../utils/formato'

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-CR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    timeZone: 'UTC',
  })
}
export default function HistorialCierreCard({ cierre }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface px-5 py-4">
      <div>
        <p className="text-base font-semibold capitalize text-ink">{formatearFecha(cierre.fecha)}</p>
        <p className="mt-0.5 text-sm text-muted">
          Facturas #{String(cierre.primeraFactura).padStart(3, '0')} al #
          {String(cierre.ultimaFactura).padStart(3, '0')}
        </p>
      </div>
      <span className="text-xl font-extrabold text-ink">{formatearColones(Number(cierre.ingresoReal))}</span>
    </div>
  )
}
