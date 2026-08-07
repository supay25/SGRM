import { useEffect, useState } from 'react'
import { formatearColones } from '../utils/formato'
import BotonCerrarX from './BotonCerrarX'
import BotonImprimir from './BotonImprimir'
import SeleccionarClienteModal from './SeleccionarClienteModal'

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

export default function FacturaBusquedaModal({ numeroBuscado, factura, onCerrar, onEditarCliente }) {
  const [modalClienteAbierto, setModalClienteAbierto] = useState(false)

  useEffect(() => {
    function handleEsc(event) {
      // El sub-modal de cliente maneja su propio Escape.
      if (event.key === 'Escape' && !modalClienteAbierto) onCerrar()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onCerrar, modalClienteAbierto])

  async function handleSeleccionarCliente(nombreCliente) {
    await onEditarCliente(nombreCliente)
    setModalClienteAbierto(false)
  }

  return (
    <>
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm px-4"
      onClick={onCerrar}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-sm max-h-[85vh] flex-col rounded-2xl border border-line bg-surface shadow-2xl"
      >
        {factura ? (
          <>
            <div className="flex items-start justify-between gap-3 border-b border-line px-6 py-5">
              <div className="min-w-0">
                <span className="inline-block rounded-lg bg-surface-2 px-3 py-1.5 text-lg font-extrabold tracking-tight text-ember">
                  {formatearNumero(factura.numeroFactura)}
                </span>
                <h2 className="mt-3 text-xl font-bold tracking-tight text-ink">{factura.nombreMesa}</h2>
                <p className="mt-1 text-sm text-muted">
                  {factura.seccion.nombre}
                  {' · '}
                  {formatearFechaHora(factura.fecha)}
                </p>
                <p className="mt-1 text-sm text-muted">
                  Cliente: <span className="font-medium text-ink">{factura.nombreCliente}</span>
                </p>
              </div>
              <BotonCerrarX onClick={onCerrar} />
            </div>

            <div className="overflow-y-auto px-6 py-4">
              {factura.items.map((item) => {
                const subtotalLinea = item.cantidad * Number(item.precioUnitario)
                return (
                  <div key={item.id} className="flex items-start gap-3 border-b border-line py-3 last:border-b-0">
                    <span className="w-7 shrink-0 text-center text-sm font-semibold text-muted">
                      {item.cantidad}×
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold leading-snug text-ink">{item.nombreProducto}</p>
                      <p className="mt-0.5 text-xs text-muted">{formatearColones(Number(item.precioUnitario))} c/u</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-ink">{formatearColones(subtotalLinea)}</span>
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
                    <span className="font-medium text-danger">
                      −{formatearColones(Number(factura.montoComision))}
                    </span>
                  </div>
                )}
                <div className="flex items-baseline justify-between border-t border-line pt-2">
                  <span className="text-base font-semibold text-ink">MONTO NETO</span>
                  <span className="text-2xl font-extrabold text-ember">
                    {formatearColones(Number(factura.montoNeto))}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3 border-b border-line px-6 py-5">
              <h2 className="text-lg font-semibold text-ink tracking-tight">Factura {formatearNumero(numeroBuscado)}</h2>
              <BotonCerrarX onClick={onCerrar} />
            </div>
            <div className="overflow-y-auto px-6 py-5">
              <p className="text-sm text-muted">No se encontró ninguna factura con ese número.</p>
            </div>
          </>
        )}

        <div className="flex flex-wrap justify-end gap-3 border-t border-line px-6 py-5">
          {/* Caso típico: la factura se imprimió sin nombre y hay que asignarle el cliente. */}
          {factura && !factura.anulada && (
            <button
              type="button"
              onClick={() => setModalClienteAbierto(true)}
              className="px-4 py-2.5 rounded-lg border border-line text-sm font-semibold text-muted hover:bg-surface-2 hover:text-ink transition active:scale-[0.98]"
            >
              Editar cliente
            </button>
          )}
          <BotonImprimir />
          <button
            type="button"
            onClick={onCerrar}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-ink hover:bg-surface-2 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

    {modalClienteAbierto && (
      <SeleccionarClienteModal
        nombreSeleccionado={factura.nombreCliente}
        permitirNombreLibre
        onSeleccionar={handleSeleccionarCliente}
        onCerrar={() => setModalClienteAbierto(false)}
      />
    )}
    </>
  )
}
