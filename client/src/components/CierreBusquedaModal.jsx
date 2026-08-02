import { useEffect } from 'react'
import { formatearColones } from '../utils/formato'
import BotonCerrarX from './BotonCerrarX'
import BotonImprimir from './BotonImprimir'

function formatearFecha(fecha) {
  return new Date(`${fecha}T12:00:00`).toLocaleDateString('es-CR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default function CierreBusquedaModal({ fechaBuscada, cierre, onCerrar }) {
  useEffect(() => {
    function handleEsc(event) {
      if (event.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onCerrar])

  function handleImprimir() {
    // TODO: impresión térmica pendiente
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm px-4"
      onClick={onCerrar}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-sm max-h-[85vh] flex-col rounded-2xl border border-line bg-surface shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-6 py-5">
          <h2 className="text-lg font-semibold text-ink tracking-tight capitalize">{formatearFecha(fechaBuscada)}</h2>
          <BotonCerrarX onClick={onCerrar} />
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {cierre ? (
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted">
                <span>Facturas</span>
                <span className="font-medium text-ink">
                  #{String(cierre.primeraFactura).padStart(3, '0')} al #
                  {String(cierre.ultimaFactura).padStart(3, '0')}
                </span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Total neto</span>
                <span className="font-medium text-ink">{formatearColones(Number(cierre.totalNeto))}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Impuesto de servicio</span>
                <span className="font-medium text-ink">{formatearColones(Number(cierre.totalServicio))}</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-2 mt-2">
                <span className="text-base font-semibold text-ink">INGRESO REAL</span>
                <span className="text-2xl font-extrabold text-ember">
                  {formatearColones(Number(cierre.ingresoReal))}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">No se encontró ningún cierre registrado para esta fecha.</p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-line px-6 py-5">
          <BotonImprimir onClick={handleImprimir} />
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
  )
}
