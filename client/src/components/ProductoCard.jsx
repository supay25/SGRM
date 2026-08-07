import { formatearColones } from '../utils/formato'

export default function ProductoCard({ producto, cantidadEnBorrador = 0, onAgregar }) {
  return (
    <button
      type="button"
      onClick={() => onAgregar(producto)}
      className={`
        relative flex min-h-36 flex-col justify-between rounded-2xl border-2 p-4 text-left
        transition-all duration-200 ease-out active:scale-[0.97]
        ${
          cantidadEnBorrador > 0
            ? 'border-ember bg-ember/15 shadow-lg shadow-ember/20'
            : 'border-line-strong bg-surface-2 shadow-md shadow-black/25 hover:-translate-y-0.5 hover:border-ember hover:shadow-lg hover:shadow-black/40'
        }
      `}
    >
      {cantidadEnBorrador > 0 && (
        <span className="absolute -right-2.5 -top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-ember text-base font-bold text-orange-50 shadow-md shadow-ember/40 ring-2 ring-page">
          {cantidadEnBorrador}
        </span>
      )}
      <span className="text-xl font-bold leading-snug tracking-tight text-ink">{producto.nombre}</span>
      <span className="mt-3 text-lg font-bold tabular-nums text-ember-light">
        {formatearColones(producto.precio)}
      </span>
    </button>
  )
}
