import { useMemo, useState } from 'react'
import MesaFormModal from './MesaFormModal'
import ConfirmarAccionModal from './ConfirmarAccionModal'
import useMesas from '../hooks/useMesas'

export default function MesasTab() {

  const { secciones, mesas, cargando, agregarMesa, actualizarMesa, eliminarMesa } = useMesas()

  const [modalAbierto, setModalAbierto] = useState(false)
  const [mesaEnEdicion, setMesaEnEdicion] = useState(null)
  const [mesaAEliminar, setMesaAEliminar] = useState(null)
  const [filtroSeccionId, setFiltroSeccionId] = useState('todas')

  const seccionesVisibles = useMemo(
    () => (filtroSeccionId === 'todas' ? secciones : secciones.filter((s) => s.id === filtroSeccionId)),
    [secciones, filtroSeccionId]
  )

  const mesasPorSeccion = useMemo(() => {
    return mesas.reduce((acc, mesa) => {
      acc[mesa.seccionId] = [...(acc[mesa.seccionId] ?? []), mesa]
      return acc
    }, {})
  }, [mesas])

  function handleAbrirNuevaMesa() {
    setMesaEnEdicion(null)
    setModalAbierto(true)
  }

  function handleEditarMesa(mesa) {
    setMesaEnEdicion(mesa)
    setModalAbierto(true)
  }

  // El borrado no corre acá: solo abre la confirmación.
  function handleEliminarMesa(mesa) {
    setMesaAEliminar(mesa)
  }

  async function handleConfirmarEliminarMesa() {
    await eliminarMesa(mesaAEliminar.id)
    setMesaAEliminar(null)
  }

  function handleGuardarMesa(datos) {
    if (mesaEnEdicion) {
      actualizarMesa(mesaEnEdicion.id, datos)
    } else {
      agregarMesa(datos)
    }
    setModalAbierto(false)
    setMesaEnEdicion(null)
  }

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-muted">Crea y organiza las mesas de cada sección.</p>
        <button
          type="button"
          onClick={handleAbrirNuevaMesa}
          disabled={secciones.length === 0}
          className="rounded-lg bg-ember px-4 py-2.5 text-sm font-semibold text-orange-50 shadow-md shadow-ember/20 transition hover:bg-ember-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          + Nueva mesa
        </button>
      </div>

      {cargando ? (
        <div className="py-16 text-center text-sm text-muted">Cargando mesas...</div>
      ) : secciones.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-line py-20 text-center">
          <p className="text-sm text-muted">
            Primero crea una sección en la pestaña «Secciones» para poder agregar mesas.
          </p>
        </div>
      ) : (
        <>
          {/* Filtro por sección */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
            {[{ id: 'todas', nombre: 'Todas' }, ...secciones].map((seccion) => {
              const activa = seccion.id === filtroSeccionId
              return (
                <button
                  key={seccion.id}
                  type="button"
                  onClick={() => setFiltroSeccionId(seccion.id)}
                  className={`
                    flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium
                    transition-all duration-150
                    ${
                      activa
                        ? 'border-line bg-surface-2 text-ink shadow-sm'
                        : 'border-transparent bg-transparent text-muted hover:bg-surface hover:text-ink'
                    }
                  `}
                >
                  {seccion.colores && <span className={`h-2 w-2 rounded-full ${seccion.colores.solido}`} />}
                  {seccion.nombre}
                </button>
              )
            })}
          </div>

          <div className="mt-6 space-y-8">
            {seccionesVisibles.map((seccion) => {
              const mesasDeLaSeccion = mesasPorSeccion[seccion.id] ?? []

              return (
                <section key={seccion.id}>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${seccion.colores?.solido ?? 'bg-line'}`} />
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
                      {seccion.nombre}
                    </h2>
                    <span className="rounded-full bg-surface-2 px-1.5 py-0.5 text-xs font-semibold text-muted">
                      {mesasDeLaSeccion.length}
                    </span>
                  </div>

                  {mesasDeLaSeccion.length === 0 ? (
                    <div className="mt-3 rounded-xl border border-dashed border-line py-10 text-center">
                      <p className="text-sm text-muted">Todavía no hay mesas en {seccion.nombre}.</p>
                    </div>
                  ) : (
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {mesasDeLaSeccion.map((mesa) => (
                        <div
                          key={mesa.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-ink">{mesa.nombre}</p>
                            <p className="mt-0.5 text-xs text-muted">{seccion.nombre}</p>
                          </div>

                          <div className="flex shrink-0 gap-1">
                            <button
                              type="button"
                              onClick={() => handleEditarMesa(mesa)}
                              className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-ink"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEliminarMesa(mesa)}
                              className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-danger transition hover:bg-danger/10"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        </>
      )}

      {modalAbierto && (
        <MesaFormModal
          mesa={mesaEnEdicion}
          secciones={secciones}
          seccionSugeridaId={filtroSeccionId === 'todas' ? null : filtroSeccionId}
          onCerrar={() => {
            setModalAbierto(false)
            setMesaEnEdicion(null)
          }}
          onGuardar={handleGuardarMesa}
        />
      )}

      {mesaAEliminar && (
        <ConfirmarAccionModal
          titulo="Eliminar mesa"
          mensaje={`¿Eliminar "${mesaAEliminar.nombre}"?`}
          advertencia="Esta acción no se puede deshacer."
          onCancelar={() => setMesaAEliminar(null)}
          onConfirmar={handleConfirmarEliminarMesa}
        />
      )}
    </>
  )
}
