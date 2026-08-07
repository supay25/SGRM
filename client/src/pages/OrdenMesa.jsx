import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CategoriaTabs from '../components/CategoriaTabs'
import ProductoCard from '../components/ProductoCard'
import OrdenLinea from '../components/OrdenLinea'
import ConfirmarFacturaModal from '../components/ConfirmarFacturaModal'
import DividirCuentaModal from '../components/DividirCuentaModal'
import useOrdenMesa from '../hooks/useOrdenMesa'
import { formatearColones } from '../utils/formato'

export default function OrdenMesa() {
  const { mesaId } = useParams()
  const navigate = useNavigate()
  // null (cerrado) | 'confirmar' | 'dividir'
  const [vistaFactura, setVistaFactura] = useState(null)
  // null = se factura toda la orden; si no, son las líneas elegidas en el modal de dividir.
  const [itemsDivididos, setItemsDivididos] = useState(null)

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
    reiniciando,
    facturar,
    vaciarOrdenBackend,
    debeVaciar,
  } = useOrdenMesa(mesaId)

  if (cargando || !mesa) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center text-lg font-medium text-subtle">
        Cargando...
      </div>
    )
  }


  const totalUnidades = lineas.reduce((acc, linea) => acc + linea.cantidad, 0)
  const hayProductos = lineas.length > 0

  // Lo que se va a cobrar en esta factura: la orden completa o solo la sub-cuenta elegida.
  const itemsAFacturar = itemsDivididos ?? lineas

  function cerrarFacturacion() {
    setVistaFactura(null)
    setItemsDivididos(null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-page md:h-screen md:overflow-hidden md:flex-row">
      {/* COLUMNA IZQUIERDA — la orden */}
      <aside className="flex w-full shrink-0 flex-col border-b border-line-strong bg-surface md:h-full md:w-[38%] md:min-h-0 md:border-b-0 md:border-r xl:w-[35%]">
        <div className="shrink-0 border-b border-line-strong p-4">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="inline-flex items-center gap-2 rounded-xl border border-line-strong bg-surface-2 px-4 py-2.5 text-base font-semibold text-subtle transition hover:border-ember hover:text-ember-light active:scale-[0.98]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 shrink-0"
            >
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Volver
          </button>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{mesa.nombre}</h1>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-line-strong bg-surface-2 px-3 py-1 text-sm font-semibold text-subtle">
              {seccion.nombre}
            </span>
            <span
              className={`
                inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold
                ${
                  totalUnidades > 0
                    ? 'bg-ember/15 text-ember-light ring-1 ring-ember/45'
                    : 'border border-line-strong bg-surface-2 text-subtle'
                }
              `}
            >
              <span className="text-base font-bold tabular-nums">{totalUnidades}</span>
              {totalUnidades === 1 ? 'ítem' : 'ítems'}
            </span>
          </div>
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
              <p className="text-base font-semibold text-ink">Todavía no hay productos en esta orden.</p>
              <p className="mt-1.5 text-sm text-subtle">Toca un producto del catálogo para agregarlo.</p>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-line-strong p-4">
          <div className="space-y-2 text-base">
            <div className="flex justify-between text-subtle">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold tabular-nums text-ink">{formatearColones(subtotal)}</span>
            </div>
            <div className="flex justify-between text-subtle">
              <span className="font-medium">
                Servicio{seccion.aplicaServicio ? ` (${seccion.porcentajeServicio}%)` : ''}
              </span>
              <span className="font-semibold tabular-nums text-ink">{formatearColones(montoServicio)}</span>
            </div>
            <div className="flex items-baseline justify-between border-t border-line-strong pt-3">
              <span className="text-lg font-bold tracking-wide text-ink">TOTAL</span>
              <span className="text-3xl font-extrabold tabular-nums text-ember-light">
                {formatearColones(total)}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={reiniciar}
              disabled={reiniciando}
              title="Descarta los cambios no ingresados y vuelve a lo guardado"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-line-strong bg-surface-2 px-4 py-3.5 text-base font-semibold text-subtle transition hover:border-ink/40 hover:text-ink active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line-strong disabled:hover:text-subtle"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className={`h-5 w-5 ${reiniciando ? 'animate-spin' : ''}`}>
                <path
                  fillRule="evenodd"
                  d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 002.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0112.88 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                  clipRule="evenodd"
                />
              </svg>
              Reiniciar
            </button>

            {debeVaciar ? (
              <button
                type="button"
                onClick={vaciarOrdenBackend}
                title="La orden quedó vacía: libera la mesa"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-danger px-4 py-3.5 text-base font-bold text-danger transition hover:bg-danger/15 active:scale-[0.98]"
              >
                Vaciar orden
              </button>
            ) : (
              <button
                type="button"
                onClick={ingresarOrden}
                disabled={!hayProductos}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ember px-4 py-3.5 text-base font-bold text-ember-light transition hover:bg-ember/15 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              >
                Ingresar orden
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setItemsDivididos(null)
              setVistaFactura('confirmar')
            }}
            disabled={!hayProductos}
            className="mt-3 w-full rounded-xl bg-ember px-4 py-4 text-lg font-bold tracking-wide text-orange-50 shadow-lg shadow-ember/30 transition hover:bg-ember-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ember"
          >
            Facturar
          </button>
        </div>
      </aside>
      {/* COLUMNA DERECHA — el catálogo */}
      <main className="flex flex-1 flex-col md:h-full md:min-h-0">
        <div className="shrink-0 border-b border-line-strong p-4">
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

      {vistaFactura === 'confirmar' && (
        <ConfirmarFacturaModal
          // El precio bruto sale de estos items; el descuento se aplica dentro del modal.
          itemsAFacturar={itemsAFacturar}
          esDividida={itemsDivididos !== null}
          seccion={seccion}
          onDividir={() => setVistaFactura('dividir')}
          onFacturar={async (datos) => {
            // Si la orden queda con productos, `facturar` recarga y nos deja en la mesa.
            await facturar({ items: itemsAFacturar, ...datos })
            cerrarFacturacion()
          }}
          onCerrar={cerrarFacturacion}
        />
      )}

      {vistaFactura === 'dividir' && (
        <DividirCuentaModal
          lineas={lineas}
          // Al volver a dividir se mantiene lo que ya venía seleccionado.
          seleccionInicial={Object.fromEntries(
            (itemsDivididos ?? []).map((item) => [item.productoId, item.cantidad])
          )}
          onConfirmar={(items) => {
            setItemsDivididos(items)
            setVistaFactura('confirmar')
          }}
          onCancelar={() => {
            // Cancelar vuelve al modal de confirmar con la orden completa.
            setItemsDivididos(null)
            setVistaFactura('confirmar')
          }}
        />
      )}
    </div>
  )
}
