import { useEffect, useState } from 'react'

export default function SeccionFormModal({ seccion, onCerrar, onGuardar }) {
  const esEdicion = Boolean(seccion)

  const [nombre, setNombre] = useState(seccion?.nombre ?? '')
  const [aplicaServicio, setAplicaServicio] = useState(seccion?.aplicaServicio ?? false)
  // Los porcentajes llegan como STRING (Prisma Decimal): se normalizan con Number().
  const [porcentajeServicio, setPorcentajeServicio] = useState(
    seccion?.porcentajeServicio != null ? Number(seccion.porcentajeServicio) : ''
  )
  const [aplicaComision, setAplicaComision] = useState(seccion?.aplicaComision ?? false)
  const [porcentajeComision, setPorcentajeComision] = useState(
    seccion?.porcentajeComision != null ? Number(seccion.porcentajeComision) : ''
  )

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
      setError('El nombre de la sección es obligatorio')
      return
    }
    if (aplicaServicio && porcentajeServicio === '') {
      setError('Indica el porcentaje de servicio')
      return
    }
    if (aplicaComision && porcentajeComision === '') {
      setError('Indica el porcentaje de comisión')
      return
    }

    setError('')
    setGuardando(true)
    try {
      await onGuardar({
        nombre: nombre.trim(),
        aplicaServicio,
        porcentajeServicio: aplicaServicio ? Number(porcentajeServicio) : 0,
        aplicaComision,
        porcentajeComision: aplicaComision ? Number(porcentajeComision) : 0,
      })
    } catch (error) {
      setError(error.response?.data?.error || 'Error al guardar la sección')
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
            {esEdicion ? 'Editar sección' : 'Nueva sección'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div className="space-y-1.5">
            <label
              htmlFor="seccion-nombre"
              className="block text-xs font-semibold uppercase tracking-wider text-muted"
            >
              Nombre
            </label>
            <input
              id="seccion-nombre"
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              placeholder="Ej. Terraza"
              autoFocus
              className="
                w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5
                text-sm text-ink placeholder-muted transition
                focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ember/60
              "
            />
          </div>

          {/* Servicio */}
          <div className="space-y-3 rounded-lg border border-line bg-surface-2/40 p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={aplicaServicio}
                onChange={(event) => setAplicaServicio(event.target.checked)}
                style={{ accentColor: 'var(--color-ember)' }}
                className="h-4 w-4 rounded border-line"
              />
              <span className="text-sm font-medium text-ink">Aplica servicio</span>
            </label>

            {aplicaServicio && (
              <div className="space-y-1.5">
                <label
                  htmlFor="seccion-porcentaje-servicio"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Porcentaje de servicio (%)
                </label>
                <input
                  id="seccion-porcentaje-servicio"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={porcentajeServicio}
                  onChange={(event) => setPorcentajeServicio(event.target.value)}
                  placeholder="Ej. 10"
                  className="
                    w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5
                    text-sm text-ink placeholder-muted transition
                    focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ember/60
                  "
                />
              </div>
            )}
          </div>

          {/* Comisión */}
          <div className="space-y-3 rounded-lg border border-line bg-surface-2/40 p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={aplicaComision}
                onChange={(event) => setAplicaComision(event.target.checked)}
                style={{ accentColor: 'var(--color-ember)' }}
                className="h-4 w-4 rounded border-line"
              />
              <span className="text-sm font-medium text-ink">Aplica comisión</span>
            </label>

            {aplicaComision && (
              <div className="space-y-1.5">
                <label
                  htmlFor="seccion-porcentaje-comision"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Porcentaje de comisión (%)
                </label>
                <input
                  id="seccion-porcentaje-comision"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={porcentajeComision}
                  onChange={(event) => setPorcentajeComision(event.target.value)}
                  placeholder="Ej. 5"
                  className="
                    w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5
                    text-sm text-ink placeholder-muted transition
                    focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ember/60
                  "
                />
              </div>
            )}
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
              {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear sección'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
