import { formatearColones } from '../utils/formato'

export default function OwnerRestauranteCard({ restaurante, onAbrir }) {
  const { name, address, isActive, resumenHoy } = restaurante

  return (
    <button
      type="button"
      onClick={() => onAbrir(restaurante.id)}
      className="
        group flex w-full flex-col rounded-xl border border-line bg-surface p-5 text-left
        transition-all duration-150 hover:-translate-y-0.5 hover:border-ember/40
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-ink tracking-tight">{name}</h2>
          <p className="mt-0.5 truncate text-sm text-muted">{address}</p>
        </div>
        <span
          className={`
            shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold
            ${isActive ? 'border-success/30 bg-success/10 text-success' : 'border-danger/30 bg-danger/15 text-danger'}
          `}
        >
          {isActive ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Facturas hoy</p>
          <p className="mt-1 text-xl font-extrabold text-ink">{resumenHoy.cantidad}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Ingreso real</p>
          <p className="mt-1 text-xl font-extrabold text-ember">
            {formatearColones(Number(resumenHoy.ingresoReal))}
          </p>
        </div>
      </div>
    </button>
  )
}
