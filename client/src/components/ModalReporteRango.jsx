import { useEffect } from 'react'
import BotonCerrarX from './BotonCerrarX'
import BotonImprimir from './BotonImprimir'

function formatearFechaCorta(fecha) {
  return new Date(`${fecha}T12:00:00`).toLocaleDateString('es-CR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function ModalReporteRango({ titulo, desde, hasta, onCerrar, children }) {
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
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-ink tracking-tight">{titulo}</h2>
            <p className="mt-1 text-xs text-muted">
              {formatearFechaCorta(desde)} — {formatearFechaCorta(hasta)}
            </p>
          </div>
          <BotonCerrarX onClick={onCerrar} />
        </div>

        <div className="overflow-y-auto px-6 py-5">{children}</div>

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
