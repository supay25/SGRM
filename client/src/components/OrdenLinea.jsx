import { formatearColones } from '../utils/formato'

export default function OrdenLinea({ linea, onIncrementar, onDecrementar, onEliminar }) {
  const subtotalLinea = linea.precio * linea.cantidad

  return (
    <div className="flex items-start gap-3 border-b border-line py-4 last:border-b-0">
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onDecrementar(linea.productoId)}
          aria-label={`Quitar una unidad de ${linea.nombre}`}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-line-strong bg-surface-2 text-xl leading-none font-bold text-ink transition hover:border-ember hover:text-ember-light active:scale-95"
        >
          −
        </button>
        <span className="w-7 text-center text-lg font-bold tabular-nums text-ink">{linea.cantidad}</span>
        <button
          type="button"
          onClick={() => onIncrementar(linea.productoId)}
          aria-label={`Agregar una unidad de ${linea.nombre}`}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-line-strong bg-surface-2 text-xl leading-none font-bold text-ink transition hover:border-ember hover:text-ember-light active:scale-95"
        >
          +
        </button>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-bold leading-snug text-ink" title={linea.nombre}>
          {linea.nombre}
        </p>
        <p className="mt-1 text-sm font-medium tabular-nums text-subtle">
          {formatearColones(linea.precio)} c/u
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="text-lg font-bold tabular-nums text-ink">{formatearColones(subtotalLinea)}</span>
        <button
          type="button"
          onClick={() => onEliminar(linea.productoId)}
          aria-label={`Eliminar ${linea.nombre} de la orden`}
          className="rounded-lg p-2 text-subtle transition-colors hover:bg-danger/15 hover:text-danger"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0">
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
