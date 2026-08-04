import { formatearColones } from '../utils/formato'

function formatearNumero(numeroFactura) {
  return `#${String(numeroFactura).padStart(3, '0')}`
}

function formatearFechaHora(fecha) {
  return new Date(fecha).toLocaleString('es-CR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function FacturaDetallePanel({ factura, cargando, onVolver, onAnular, onEditarCliente, onImprimir }) {
  if (cargando || !factura) {
    return (
      <div className="flex h-full min-h-60 items-center justify-center rounded-xl border border-line bg-surface text-muted">
        Cargando...
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-line bg-surface">
      <div className="border-b border-line px-6 py-5">
        <button
          type="button"
          onClick={onVolver}
          className="mb-3 text-sm font-medium text-muted transition-colors hover:text-ink md:hidden"
        >
          ← Volver a la lista
        </button>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="inline-block rounded-lg bg-surface-2 px-3 py-1.5 text-xl font-extrabold tracking-tight text-ember">
              {formatearNumero(factura.numeroFactura)}
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink">{factura.nombreMesa}</h2>
            <p className="mt-1 text-sm text-muted">
              {factura.nombreSeccion}
              {' · '}
              {formatearFechaHora(factura.fecha)}
            </p>
            <p className="mt-1 text-sm text-muted">
              Cliente: <span className="font-medium text-ink">{factura.nombreCliente}</span>
            </p>
          </div>

          {factura.anulada && (
            <span className="shrink-0 rounded-full border border-danger/30 bg-danger/15 px-3 py-1 text-xs font-semibold text-danger">
              ANULADA
            </span>
          )}
        </div>
      </div>

      <div className="px-6 py-4">
        {factura.items.map((item) => {
          const subtotalLinea = item.cantidad * Number(item.precioUnitario)
          return (
            <div key={item.id} className="flex items-start gap-3 border-b border-line py-4 last:border-b-0">
              <span className="w-8 shrink-0 text-center text-base font-semibold text-muted">{item.cantidad}×</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold leading-snug text-ink">{item.nombreProducto}</p>
                <p className="mt-0.5 text-xs text-muted">{formatearColones(Number(item.precioUnitario))} c/u</p>
              </div>
              <span className="shrink-0 text-base font-bold text-ink">{formatearColones(subtotalLinea)}</span>
            </div>
          )
        })}
      </div>

      <div className="border-t border-line px-6 py-5">
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span className="font-medium text-ink">{formatearColones(Number(factura.subtotal))}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Impuesto de servicio</span>
            <span className="font-medium text-ink">{formatearColones(Number(factura.montoServicio))}</span>
          </div>
          {Number(factura.montoComision) > 0 && (
            <div className="flex justify-between text-muted">
              <span>Comisión</span>
              <span className="font-medium text-danger">−{formatearColones(Number(factura.montoComision))}</span>
            </div>
          )}
          <div className="flex items-baseline justify-between border-t border-line pt-2">
            <span className="text-base font-semibold text-ink">MONTO NETO</span>
            <span className="text-2xl font-extrabold text-ember">{formatearColones(Number(factura.montoNeto))}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-line px-6 py-5">
        {factura.anulada ? (
          <span className="text-sm font-medium text-muted">Esta factura fue anulada.</span>
        ) : (
          <button
            type="button"
            onClick={() => onAnular(factura)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-danger/40 px-4 py-2.5 text-sm font-semibold text-danger transition hover:bg-danger/10 active:scale-[0.98]"
          >
            Anular factura
          </button>
        )}
        {/* Una factura anulada ya no admite cambios de cliente. */}
        {!factura.anulada && (
          <button
            type="button"
            onClick={() => onEditarCliente(factura)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-muted transition hover:bg-surface-2 hover:text-ink active:scale-[0.98]"
          >
            Editar cliente
          </button>
        )}
        <button
          type="button"
          onClick={() => onImprimir(factura)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-muted transition hover:bg-surface-2 hover:text-ink active:scale-[0.98]"
        >
          Imprimir
        </button>
      </div>
    </div>
  )
}
