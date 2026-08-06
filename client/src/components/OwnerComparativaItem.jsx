import { formatearColones } from '../utils/formato'

export default function OwnerComparativaItem({ restaurante }) {
  const { nombre, cantidadFacturas, totalNeto, ingresoReal } = restaurante

  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p className="truncate text-base font-semibold text-ink tracking-tight">{nombre}</p>

      <div className="mt-3 grid grid-cols-3 gap-3 border-t border-line pt-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Facturas</p>
          <p className="mt-1 text-base font-bold text-ink">{cantidadFacturas}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Total neto</p>
          <p className="mt-1 text-base font-bold text-ink">{formatearColones(totalNeto)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Ingreso real</p>
          <p className="mt-1 text-base font-bold text-ember">{formatearColones(ingresoReal)}</p>
        </div>
      </div>
    </div>
  )
}
