import { formatearColones } from '../utils/formato'

export default function ProductoCard({ producto, cantidadEnBorrador = 0, onAgregar }) {
  return (
    <button
      type="button"
      onClick={() => onAgregar(producto)}
      className={`
        relative flex min-h-[132px] flex-col justify-between rounded-xl border p-4 text-left
        transition-all duration-150 active:scale-[0.97]
        ${
          cantidadEnBorrador > 0
            ? 'border-ember/50 bg-ember/10'
            : 'border-line bg-surface hover:border-ember/40 hover:bg-surface-2'
        }
      `}
    >
      {cantidadEnBorrador > 0 && (
        <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ember text-sm font-bold text-orange-50 shadow-md shadow-ember/30">
          {cantidadEnBorrador}
        </span>
      )}
      <span className="text-lg font-semibold leading-snug text-ink">{producto.nombre}</span>
      <span className="mt-3 text-base font-bold text-ember">{formatearColones(producto.precio)}</span>
    </button>
  )
}
