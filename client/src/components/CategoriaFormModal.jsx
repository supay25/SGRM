import { useEffect, useState } from 'react'

export default function CategoriaFormModal({ categoria, onCerrar, onGuardar }) {
  const esEdicion = Boolean(categoria)
  const [nombre, setNombre] = useState(categoria?.nombre ?? '')
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
      setError('El nombre de la categoría es obligatorio')
      return
    }

    setError('')
    setGuardando(true)
    try {
      await onGuardar(nombre.trim())
    } catch (error) {
      setError(error.response?.data?.error || 'Error al guardar la categoría')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm px-4"
      onClick={onCerrar}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface shadow-2xl"
      >
        <div className="px-6 py-5 border-b border-line">
          <h2 className="text-lg font-semibold text-ink tracking-tight">
            {esEdicion ? 'Editar categoría' : 'Nueva categoría'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="categoria-nombre"
              className="block text-xs font-semibold text-muted uppercase tracking-wider"
            >
              Nombre
            </label>
            <input
              id="categoria-nombre"
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              placeholder="Ej. Postres"
              autoFocus
              className="
                w-full px-3 py-2.5 rounded-lg
                bg-surface-2 border border-line
                text-sm text-ink placeholder-muted
                focus:outline-none focus:ring-2 focus:ring-ember/60 focus:border-transparent
                transition
              "
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-ink hover:bg-surface-2 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-orange-50 bg-ember hover:bg-ember-dark shadow-md shadow-ember/20 transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
