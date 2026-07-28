import { useEffect, useState } from 'react'

export default function ProductoFormModal({ producto, categorias, categoriaSugeridaId, onCerrar, onGuardar }) {
  const esEdicion = Boolean(producto)
  const [nombre, setNombre] = useState(producto?.nombre ?? '')
  const [precio, setPrecio] = useState(producto ? String(Number(producto.precio)) : '')
  const [categoriaId, setCategoriaId] = useState(
    producto?.categoriaId ?? categoriaSugeridaId ?? categorias[0]?.id ?? ''
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
      setError('El nombre del producto es obligatorio')
      return
    }
    const precioNumero = Number(precio)
    if (!precio || Number.isNaN(precioNumero) || precioNumero <= 0) {
      setError('Ingresa un precio válido')
      return
    }
    if (!categoriaId) {
      setError('Selecciona una categoría')
      return
    }

    setError('')
    setGuardando(true)
    try {
      await onGuardar({ nombre: nombre.trim(), precio: precioNumero, categoriaId: Number(categoriaId) })
    } catch (error) {
      setError(error.response?.data?.error || 'Error al guardar el producto')
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
            {esEdicion ? 'Editar producto' : 'Nuevo producto'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="producto-nombre"
              className="block text-xs font-semibold text-muted uppercase tracking-wider"
            >
              Nombre
            </label>
            <input
              id="producto-nombre"
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              placeholder="Ej. Casado con pollo"
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
              htmlFor="producto-precio"
              className="block text-xs font-semibold text-muted uppercase tracking-wider"
            >
              Precio (₡)
            </label>
            <input
              id="producto-precio"
              type="number"
              min="0"
              step="1"
              value={precio}
              onChange={(event) => setPrecio(event.target.value)}
              placeholder="Ej. 5000"
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
              htmlFor="producto-categoria"
              className="block text-xs font-semibold text-muted uppercase tracking-wider"
            >
              Categoría
            </label>
            <select
              id="producto-categoria"
              value={categoriaId}
              onChange={(event) => setCategoriaId(event.target.value)}
              className="
                w-full px-3 py-2.5 rounded-lg
                bg-surface-2 border border-line
                text-sm text-ink
                focus:outline-none focus:ring-2 focus:ring-ember/60 focus:border-transparent
                transition
              "
            >
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
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
              disabled={guardando}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-orange-50 bg-ember hover:bg-ember-dark shadow-md shadow-ember/20 transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
