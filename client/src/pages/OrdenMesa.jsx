import { useNavigate, useParams } from 'react-router-dom'
import CategoriaTabs from '../components/CategoriaTabs'
import ProductoCard from '../components/ProductoCard'
import OrdenLinea from '../components/OrdenLinea'
import useOrdenMesa from '../hooks/useOrdenMesa'
import { formatearColones } from '../utils/formato'

export default function OrdenMesa() {
  const { mesaId } = useParams()
  const navigate = useNavigate()
 
  const {
    cargando,
    mesa,
    seccion,
    categorias,
    categoriaActivaId,
    setCategoriaActivaId,
    conteoPorCategoria,
    productosFiltrados,
    lineas,
    cantidadesEnBorrador,
    agregarProducto,
    incrementarLinea,
    decrementarLinea,
    eliminarLinea,
    subtotal,
    montoServicio,
    total,
    ingresarOrden,
    reiniciar,
    facturar,
  } = useOrdenMesa(mesaId)

  if (cargando || !mesa) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center text-muted">
        Cargando...
      </div>
    )
  }


  const totalUnidades = lineas.reduce((acc, linea) => acc + linea.cantidad, 0)
  const hayProductos = lineas.length > 0

  return (
    <div className="flex min-h-screen flex-col bg-page md:h-screen md:overflow-hidden md:flex-row">
      {/* COLUMNA IZQUIERDA — la orden */}
      <aside className="flex w-full shrink-0 flex-col border-b border-line bg-surface md:h-full md:w-[38%] md:min-h-0 md:border-b-0 md:border-r xl:w-[35%]">
        <div className="shrink-0 border-b border-line p-4">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            ← Volver
          </button>
          <h1 className="mt-2 text-xl font-bold tracking-tight text-ink">{mesa.nombre}</h1>
          <p className="mt-0.5 text-sm text-muted">
            {seccion.nombre}
            {' · '}
            {totalUnidades} {totalUnidades === 1 ? 'ítem' : 'ítems'}
          </p>
        </div>

        <div className="md:flex-1 md:min-h-0 md:overflow-y-auto">
          {hayProductos ? (
            <div className="px-4">
              {lineas.map((linea) => (
                <OrdenLinea
                  key={linea.productoId}
                  linea={linea}
                  onIncrementar={incrementarLinea}
                  onDecrementar={decrementarLinea}
                  onEliminar={eliminarLinea}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-60 flex-col items-center justify-center px-4 py-12 text-center">
              <span className="mb-3 text-4xl">🍽️</span>
              <p className="text-sm text-muted">Todavía no hay productos en esta orden.</p>
              <p className="mt-1 text-xs text-muted">Toca un producto del catálogo para agregarlo.</p>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-line p-4">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span className="font-medium text-ink">{formatearColones(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Servicio{seccion.aplicaServicio ? ` (${seccion.porcentajeServicio}%)` : ''}</span>
              <span className="font-medium text-ink">{formatearColones(montoServicio)}</span>
            </div>
            <div className="flex items-baseline justify-between border-t border-line pt-2">
              <span className="text-base font-semibold text-ink">TOTAL</span>
              <span className="text-2xl font-extrabold text-ember">{formatearColones(total)}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={reiniciar}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-line px-4 py-3 text-sm font-semibold text-muted transition hover:bg-surface-2 hover:text-ink active:scale-[0.98]"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path
                  fillRule="evenodd"
                  d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 002.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0112.88 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                  clipRule="evenodd"
                />
              </svg>
              Reiniciar
            </button>

            <button
              type="button"
              onClick={ingresarOrden}
              disabled={!hayProductos}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-ember px-4 py-3 text-sm font-semibold text-ember transition hover:bg-ember/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              Ingresar orden
            </button>
          </div>

          <button
            type="button"
            onClick={facturar}
            disabled={!hayProductos}
            className="mt-3 w-full rounded-xl bg-ember px-4 py-4 text-base font-bold text-orange-50 shadow-lg shadow-ember/25 transition hover:bg-ember-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ember"
          >
            Facturar
          </button>
        </div>
      </aside>

      {/* COLUMNA DERECHA — el catálogo */}
      <main className="flex flex-1 flex-col md:h-full md:min-h-0">
        <div className="shrink-0 border-b border-line p-4">
          <CategoriaTabs
            categorias={categorias}
            categoriaActivaId={categoriaActivaId}
            onCambiarCategoria={setCategoriaActivaId}
            conteos={conteoPorCategoria}
          />
        </div>

        <div className="p-4 md:flex-1 md:min-h-0 md:overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
            {productosFiltrados.map((producto) => (
              <ProductoCard
                key={producto.id}
                producto={producto}
                cantidadEnBorrador={cantidadesEnBorrador[producto.id] ?? 0}
                onAgregar={agregarProducto}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
