import { useState } from 'react'
import SeccionFormModal from './SeccionFormModal'
import useSecciones from '../hooks/useSecciones'

function Etiqueta({ activa, texto, porcentaje }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold
        ${activa ? 'border-success/30 bg-success/10 text-success' : 'border-line bg-surface-2 text-muted'}
      `}
    >
      {texto}
      {activa ? ` · ${porcentaje}%` : ' · no aplica'}
    </span>
  )
}

export default function SeccionesTab() {
  const { secciones, cargando, agregarSeccion, actualizarSeccion, eliminarSeccion } = useSecciones()

  const [modalSeccion, setModalSeccion] = useState(null) // null | 'nueva' | seccion
  const [error, setError] = useState('')

  async function handleGuardarSeccion(datos) {
    if (modalSeccion && modalSeccion !== 'nueva') {
      await actualizarSeccion(modalSeccion.id, datos)
    } else {
      await agregarSeccion(datos)
    }
    setModalSeccion(null)
  }

  async function handleEliminarSeccion(seccion) {
    // TODO: reemplazar por confirmación propia del sistema de diseño
    const confirmado = window.confirm(
      `¿Eliminar la sección "${seccion.nombre}"? Esta acción no se puede deshacer.`
    )
    if (!confirmado) return

    setError('')
    try {
      await eliminarSeccion(seccion.id)
    } catch (error) {
      // El backend rechaza la sección cuando todavía tiene mesas asociadas.
      setError(error.response?.data?.error || 'Error al eliminar la sección')
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-muted">
          Define las zonas del restaurante y los cargos que aplican en cada una.
        </p>
        <button
          type="button"
          onClick={() => setModalSeccion('nueva')}
          className="rounded-lg bg-ember px-4 py-2.5 text-sm font-semibold text-orange-50 shadow-md shadow-ember/20 transition hover:bg-ember-dark active:scale-[0.98]"
        >
          + Nueva sección
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {cargando ? (
        <div className="py-16 text-center text-sm text-muted">Cargando secciones...</div>
      ) : secciones.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-line py-20 text-center">
          <span className="mb-3 block text-4xl">🪑</span>
          <p className="text-sm text-muted">Todavía no hay secciones registradas.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {secciones.map((seccion) => (
            <div key={seccion.id} className="rounded-xl border border-line bg-surface p-5">
              <h3 className="text-lg font-semibold tracking-tight text-ink">{seccion.nombre}</h3>

              <div className="mt-3 flex flex-wrap gap-2">
                <Etiqueta
                  activa={seccion.aplicaServicio}
                  texto="Servicio"
                  porcentaje={Number(seccion.porcentajeServicio ?? 0)}
                />
                <Etiqueta
                  activa={seccion.aplicaComision}
                  texto="Comisión"
                  porcentaje={Number(seccion.porcentajeComision ?? 0)}
                />
              </div>

              <div className="mt-5 flex gap-2 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={() => setModalSeccion(seccion)}
                  className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink transition hover:border-ember/50 hover:text-ember"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleEliminarSeccion(seccion)}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-danger transition hover:bg-danger/10"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalSeccion !== null && (
        <SeccionFormModal
          seccion={modalSeccion === 'nueva' ? null : modalSeccion}
          onCerrar={() => setModalSeccion(null)}
          onGuardar={handleGuardarSeccion}
        />
      )}
    </>
  )
}
