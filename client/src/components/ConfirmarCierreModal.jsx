import { useEffect } from 'react'

export default function ConfirmarCierreModal({ cerrando, onCancelar, onConfirmar }) {
  useEffect(() => {
    function handleEsc(event) {
      if (event.key === 'Escape') onCancelar()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onCancelar])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm px-4"
      onClick={onCancelar}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-line bg-surface shadow-2xl"
      >
        <div className="px-6 py-5 border-b border-line">
          <h2 className="text-lg font-semibold text-ink tracking-tight">Cerrar caja del día</h2>
        </div>

        <div className="px-6 py-5">
          <p className="text-base leading-relaxed text-muted">
            Al cerrar la caja no se podrán registrar más facturas el día de hoy. ¿Continuar?
          </p>
        </div>

        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onCancelar}
            disabled={cerrando}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-ink hover:bg-surface-2 transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={cerrando}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-orange-50 bg-ember hover:bg-ember-dark shadow-md shadow-ember/20 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cerrando ? 'Cerrando...' : 'Sí, cerrar caja'}
          </button>
        </div>
      </div>
    </div>
  )
}
