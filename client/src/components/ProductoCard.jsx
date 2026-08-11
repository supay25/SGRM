import { formatearColones } from '../utils/formato'

export default function ProductoCard({ producto, cantidadEnBorrador = 0, onAgregar }) {
  return (
    <button
      type="button"
      onClick={() => onAgregar(producto)}
      className={`
        relative flex min-h-32 min-w-0 flex-col justify-between rounded-2xl border-2 p-3 text-left
        sm:min-h-36 sm:p-4
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
      <span className="wrap-break-word text-lg font-bold leading-snug tracking-tight text-ink sm:text-xl">
        {producto.nombre}
      </span>
      <span className="mt-3 text-base font-bold tabular-nums text-ember-light sm:text-lg">
        {formatearColones(producto.precio)}
      </span>
    </button>
  )
}
