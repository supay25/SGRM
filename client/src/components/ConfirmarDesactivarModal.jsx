import { useEffect } from 'react'

export default function ConfirmarDesactivarModal({
  titulo,
  mensaje,
  advertencia,
  textoConfirmar = 'Sí, desactivar',
  procesando,
  onCancelar,
  onConfirmar,
}) {
  useEffect(() => {
    function handleEsc(event) {
      if (event.key === 'Escape') onCancelar()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onCancelar])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 px-4 backdrop-blur-sm"
      onClick={onCancelar}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-line bg-surface shadow-2xl"
      >
        <div className="border-b border-line px-6 py-5">
          <h2 className="text-lg font-semibold tracking-tight text-ink">{titulo}</h2>
        </div>

        <div className="space-y-3 px-6 py-5">
          <p className="text-base leading-relaxed text-muted">{mensaje}</p>
          {advertencia && (
            <p className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm leading-relaxed text-danger">
              ⚠️ {advertencia}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onCancelar}
            disabled={procesando}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-ink disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={procesando}
            className="rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-orange-50 shadow-md shadow-ember/20 transition hover:bg-ember-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {procesando ? 'Guardando...' : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}
