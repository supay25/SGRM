import { formatearColones } from '../utils/formato'

function formatearNumero(numeroFactura) {
  return `#${String(numeroFactura).padStart(3, '0')}`
}

function formatearHora(fecha) {
  return new Date(fecha).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
}

export default function FacturaCard({ factura, seleccionada = false, onAbrir }) {
  return (
    <button
      type="button"
      onClick={() => onAbrir(factura.id)}
      className={`
        group flex w-full items-center gap-5 rounded-xl border px-5 py-5 text-left
        transition-all duration-150 hover:-translate-y-0.5
        ${
          seleccionada
            ? 'border-ember bg-ember/10'
            : 'border-line bg-surface hover:border-ember/40'
        }
        ${factura.anulada ? 'opacity-60' : ''}
      `}
    >
      <span
        className={`
          shrink-0 rounded-lg px-3 py-2 text-xl font-extrabold tracking-tight
          ${seleccionada ? 'bg-ember/20 text-ember' : 'bg-surface-2 text-ember'}
        `}
      >
        {formatearNumero(factura.numeroFactura)}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-lg font-semibold text-ink">{factura.nombreMesa}</p>
          {factura.anulada && (
            <span className="shrink-0 rounded-full border border-danger/30 bg-danger/15 px-2 py-0.5 text-xs font-semibold text-danger">
              ANULADA
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-muted">
          {factura.seccion.nombre}
          {' · '}
          {formatearHora(factura.fecha)}
        </p>
      </div>

      <span className="shrink-0 text-2xl font-extrabold text-ink">
        {formatearColones(Number(factura.montoNeto))}
      </span>
    </button>
  )
}
