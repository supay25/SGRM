import { useState } from 'react'
import CategoriaListItem from './CategoriaListItem'
import CategoriaFormModal from './CategoriaFormModal'
import ProductoMenuCard from './ProductoMenuCard'
import ProductoFormModal from './ProductoFormModal'
import ConfirmarAccionModal from './ConfirmarAccionModal'
import useMenu from '../hooks/useMenu'
import useAvisoError from '../hooks/useAvisoError'

export default function MenuTab() {
  const avisarError = useAvisoError()
  const {
    cargando,
    categorias,
    productosFiltrados,
    categoriaActivaId,
    setCategoriaActivaId,
    agregarCategoria,
    actualizarCategoria,
    eliminarCategoria,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
  } = useMenu()

  const [modalCategoria, setModalCategoria] = useState(null) // null | 'nueva' | categoria
  const [modalProducto, setModalProducto] = useState(null) // null | 'nuevo' | producto
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null)
  const [productoAEliminar, setProductoAEliminar] = useState(null)

  const categoriaActiva = categorias.find((categoria) => categoria.id === categoriaActivaId) ?? null

  async function handleGuardarCategoria(nombre) {
    if (modalCategoria && modalCategoria !== 'nueva') {
      await actualizarCategoria(modalCategoria.id, nombre)
    } else {
      await agregarCategoria(nombre)
    }
    setModalCategoria(null)
  }

  // El borrado no corre acá: solo abre la confirmación.
  function handleEliminarCategoria(categoria) {
    setCategoriaAEliminar(categoria)
  }

  async function handleConfirmarEliminarCategoria() {
    try {
      await eliminarCategoria(categoriaAEliminar.id)
    } catch (error) {
      avisarError(error, 'Error al eliminar la categoría')
    } finally {
      setCategoriaAEliminar(null)
    }
  }

  async function handleGuardarProducto(datos) {
    if (modalProducto && modalProducto !== 'nuevo') {
      await actualizarProducto(modalProducto.id, datos)
    } else {
      await agregarProducto(datos)
    }
    setModalProducto(null)
  }

  function handleEliminarProducto(producto) {
    setProductoAEliminar(producto)
  }

  async function handleConfirmarEliminarProducto() {
    try {
      await eliminarProducto(productoAEliminar.id)
    } catch (error) {
      avisarError(error, 'Error al eliminar el producto')
    } finally {
      setProductoAEliminar(null)
    }
  }

  if (cargando) {
    return <div className="py-16 text-center text-sm text-muted">Cargando menú...</div>
  }

  return (
    <>
      <p className="text-sm text-muted">Administra las categorías y productos de tu restaurante.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-10">
        {/* COLUMNA IZQUIERDA — categorías (~30%) */}
        <aside className="lg:col-span-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Categorías</h2>

          <div className="mt-3 space-y-1.5">
            <button
              type="button"
              onClick={() => setCategoriaActivaId(null)}
              className={`
                w-full rounded-lg border px-4 py-3 text-left text-sm font-semibold transition-colors
                ${
                  categoriaActivaId === null
                    ? 'border-ember/40 bg-ember/10 text-ember'
                    : 'border-transparent text-muted hover:bg-surface-2 hover:text-ink'
                }
              `}
            >
              Todas
            </button>

            {categorias.map((categoria) => (
              <CategoriaListItem
                key={categoria.id}
                categoria={categoria}
                activa={categoria.id === categoriaActivaId}
                onSeleccionar={() => setCategoriaActivaId(categoria.id)}
                onEditar={() => setModalCategoria(categoria)}
                onEliminar={() => handleEliminarCategoria(categoria)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setModalCategoria('nueva')}
            className="mt-4 w-full rounded-lg border border-dashed border-line px-4 py-3 text-sm font-semibold text-muted transition-colors hover:border-ember/50 hover:text-ember"
          >
            + Nueva categoría
          </button>
        </aside>

        {/* COLUMNA DERECHA — productos (~70%) */}
        <section className="lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Productos{categoriaActiva ? ` · ${categoriaActiva.nombre}` : ''}
            </h2>
            <button
              type="button"
              onClick={() => setModalProducto('nuevo')}
              className="rounded-lg bg-ember px-4 py-2.5 text-sm font-semibold text-orange-50 shadow-md shadow-ember/20 transition hover:bg-ember-dark active:scale-[0.98]"
            >
              + Nuevo producto
            </button>
          </div>

          {productosFiltrados.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-line py-20 text-center">
              <span className="mb-3 block text-4xl">🍽️</span>
              <p className="text-sm text-muted">Todavía no hay productos en esta categoría.</p>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {productosFiltrados.map((producto) => (
                <ProductoMenuCard
                  key={producto.id}
                  producto={producto}
                  onEditar={() => setModalProducto(producto)}
                  onEliminar={() => handleEliminarProducto(producto)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {modalCategoria !== null && (
        <CategoriaFormModal
          categoria={modalCategoria === 'nueva' ? null : modalCategoria}
          onCerrar={() => setModalCategoria(null)}
          onGuardar={handleGuardarCategoria}
        />
      )}

      {modalProducto !== null && (
        <ProductoFormModal
          producto={modalProducto === 'nuevo' ? null : modalProducto}
          categorias={categorias}
          categoriaSugeridaId={categoriaActivaId}
          onCerrar={() => setModalProducto(null)}
          onGuardar={handleGuardarProducto}
        />
      )}

      {categoriaAEliminar && (
        <ConfirmarAccionModal
          titulo="Eliminar categoría"
          mensaje={`¿Eliminar la categoría "${categoriaAEliminar.nombre}"?`}
          advertencia="Esta acción no se puede deshacer."
          onCancelar={() => setCategoriaAEliminar(null)}
          onConfirmar={handleConfirmarEliminarCategoria}
        />
      )}

      {productoAEliminar && (
        <ConfirmarAccionModal
          titulo="Eliminar producto"
          mensaje={`¿Eliminar "${productoAEliminar.nombre}" del menú?`}
          advertencia="Esta acción no se puede deshacer."
          onCancelar={() => setProductoAEliminar(null)}
          onConfirmar={handleConfirmarEliminarProducto}
        />
      )}
    </>
  )
}
