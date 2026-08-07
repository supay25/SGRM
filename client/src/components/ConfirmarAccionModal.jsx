import { useEffect, useState } from 'react'

/**
 * Confirmación de Sí/No para acciones que no se pueden deshacer. Reemplaza al
 * window.confirm(): igual que él, la acción solo corre si el usuario confirma.
 *
 * `onConfirmar` puede ser async: mientras corre, los botones quedan bloqueados
 * para que no se dispare dos veces. Cerrar el modal es responsabilidad de quien
 * lo abre (así puede dejarlo abierto si algo falló).
 */
export default function ConfirmarAccionModal({
  titulo,
  mensaje,
  advertencia,
  textoConfirmar = 'Sí, eliminar',
  destructiva = true,
  onCancelar,
  onConfirmar,
}) {
  const [procesando, setProcesando] = useState(false)

  useEffect(() => {
    function handleEsc(event) {
      // Con la acción en curso, cancelar ya no es una opción válida.
      if (event.key === 'Escape' && !procesando) onCancelar()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onCancelar, procesando])

  async function handleConfirmar() {
    setProcesando(true)
    try {
      await onConfirmar()
    } finally {
      setProcesando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 px-4 backdrop-blur-sm"
      onClick={() => {
        if (!procesando) onCancelar()
      }}
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
            onClick={handleConfirmar}
            disabled={procesando}
            className={`
              rounded-lg px-5 py-2.5 text-sm font-semibold shadow-md transition
              disabled:cursor-not-allowed disabled:opacity-60
              ${
                destructiva
                  ? 'bg-danger text-stone-950 shadow-danger/20 hover:bg-rose-300'
                  : 'bg-ember text-orange-50 shadow-ember/20 hover:bg-ember-dark'
              }
            `}
          >
            {procesando ? 'Procesando...' : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}
