import { formatearColones } from '../utils/formato'

function formatearNumero(numeroFactura) {
  return `#${String(numeroFactura).padStart(3, '0')}`
}

function formatearHora(fecha) {
  return new Date(fecha).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
}

export default function OwnerFacturaItem({ factura }) {
  return (
    <div className="flex w-full items-center gap-5 rounded-xl border border-line bg-surface px-5 py-4">
      <span className="shrink-0 rounded-lg bg-surface-2 px-3 py-2 text-lg font-extrabold tracking-tight text-ember">
        {formatearNumero(factura.numeroFactura)}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-ink">{factura.nombreMesa}</p>
        <p className="mt-0.5 text-sm text-muted">
          {factura.seccion.nombre}
          {' · '}
          {formatearHora(factura.fecha)}
        </p>
      </div>

      <span className="shrink-0 text-lg font-extrabold text-ink">
        {formatearColones(Number(factura.montoNeto))}
      </span>
    </div>
  )
}
