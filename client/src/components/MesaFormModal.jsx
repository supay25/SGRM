import { useEffect, useState } from 'react'

export default function MesaFormModal({ mesa, secciones, seccionSugeridaId, onCerrar, onGuardar }) {
  const esEdicion = Boolean(mesa)
  const [nombre, setNombre] = useState(mesa?.nombre ?? '')
  const [seccionId, setSeccionId] = useState(
    mesa?.seccionId ?? seccionSugeridaId ?? secciones[0]?.id ?? ''
  )
  const [error, setError] = useState('')

  useEffect(() => {
    function handleEsc(event) {
      if (event.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onCerrar])

  function handleSubmit(event) {
    event.preventDefault()

    if (!nombre.trim()) {
      setError('El nombre de la mesa es obligatorio')
      return
    }
    if (!seccionId) {
      setError('Selecciona una sección')
      return
    }

    onGuardar({ nombre: nombre.trim(), seccionId })
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
            {esEdicion ? 'Editar mesa' : 'Agregar nueva mesa'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="mesa-nombre"
              className="block text-xs font-semibold text-muted uppercase tracking-wider"
            >
              Nombre
            </label>
            <input
              id="mesa-nombre"
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              placeholder="Ej. Mesa 5"
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

          <div className="space-y-1.5">
            <label
              htmlFor="mesa-seccion"
              className="block text-xs font-semibold text-muted uppercase tracking-wider"
            >
              Sección
            </label>
            <select
              id="mesa-seccion"
              value={seccionId}
              onChange={(event) => setSeccionId(event.target.value)}
              className="
                w-full px-3 py-2.5 rounded-lg
                bg-surface-2 border border-line
                text-sm text-ink
                focus:outline-none focus:ring-2 focus:ring-ember/60 focus:border-transparent
                transition
              "
            >
              {secciones.map((seccion) => (
                <option key={seccion.id} value={seccion.id}>
                  {seccion.nombre}
                </option>
              ))}
            </select>
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
              className="px-4 py-2 rounded-lg text-sm font-semibold text-orange-50 bg-ember hover:bg-ember-dark shadow-md shadow-ember/20 transition"
            >
              {esEdicion ? 'Guardar cambios' : 'Agregar mesa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
