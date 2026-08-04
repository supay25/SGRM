import { useEffect, useState } from 'react'

export default function ClienteFormModal({ cliente, onCerrar, onGuardar }) {
  const esEdicion = Boolean(cliente)

  const [nombre, setNombre] = useState(cliente?.nombre ?? '')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    function handleEsc(event) {
      if (event.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onCerrar])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!nombre.trim()) {
      setError('El nombre del cliente es obligatorio')
      return
    }

    setError('')
    setGuardando(true)
    try {
      await onGuardar(nombre.trim())
    } catch (error) {
      setError(error.response?.data?.error || 'Error al guardar el cliente')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 px-4 backdrop-blur-sm"
      onClick={onCerrar}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-line bg-surface shadow-2xl"
      >
        <div className="border-b border-line px-6 py-5">
          <h2 className="text-lg font-semibold tracking-tight text-ink">
            {esEdicion ? 'Editar cliente' : 'Nuevo cliente'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div className="space-y-1.5">
            <label
              htmlFor="cliente-nombre"
              className="block text-xs font-semibold uppercase tracking-wider text-muted"
            >
              Nombre
            </label>
            <input
              id="cliente-nombre"
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              placeholder="Ej. Juan Pérez"
              autoFocus
              className="
                w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5
                text-sm text-ink placeholder-muted transition
                focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ember/60
              "
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onCerrar}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-ink"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="rounded-lg bg-ember px-4 py-2 text-sm font-semibold text-orange-50 shadow-md shadow-ember/20 transition hover:bg-ember-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
