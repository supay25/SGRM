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
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-lg leading-none text-ink transition hover:bg-surface-2 active:scale-95"
        >
          −
        </button>
        <span className="w-6 text-center text-base font-semibold text-ink">{linea.cantidad}</span>
        <button
          type="button"
          onClick={() => onIncrementar(linea.productoId)}
          aria-label={`Agregar una unidad de ${linea.nombre}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-lg leading-none text-ink transition hover:bg-surface-2 active:scale-95"
        >
          +
        </button>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold leading-snug text-ink">{linea.nombre}</p>
        <p className="mt-0.5 text-xs text-muted">{formatearColones(linea.precio)} c/u</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-base font-bold text-ink">{formatearColones(subtotalLinea)}</span>
        <button
          type="button"
          onClick={() => onEliminar(linea.productoId)}
          aria-label={`Eliminar ${linea.nombre} de la orden`}
          className="text-muted transition-colors hover:text-danger"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
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
