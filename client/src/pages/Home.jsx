import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import SeccionTabs from '../components/SeccionTabs'
import MesaCard from '../components/MesaCard'
import MesaFormModal from '../components/MesaFormModal'
import useMesas from '../hooks/useMesas.js'



export default function Home() {
  const navigate = useNavigate()
  const { secciones, mesas, agregarMesa, actualizarMesa, eliminarMesa } = useMesas()

  const [seccionActivaId, setSeccionActivaId] = useState(secciones[0]?.id ?? null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [mesaEnEdicion, setMesaEnEdicion] = useState(null)

  useEffect(() => {
    if (secciones.length > 0 && seccionActivaId === null) {
      setSeccionActivaId(secciones[0].id)
    }
  }, [secciones, seccionActivaId])

  const seccionActiva = useMemo(
    () => secciones.find((seccion) => seccion.id === seccionActivaId) ?? null,
    [secciones, seccionActivaId]
  )

  // Las mesas de cada sección se muestran de forma aislada: nunca se
  // combinan mesas de secciones distintas en el mismo grid.
  const mesasDeLaSeccion = useMemo(
    () => mesas.filter((mesa) => mesa.seccionId === seccionActivaId),
    [mesas, seccionActivaId]
  )

  const conteoPorSeccion = useMemo(() => {
    return secciones.reduce((acc, seccion) => {
      acc[seccion.id] = mesas.filter((mesa) => mesa.seccionId === seccion.id).length
      return acc
    }, {})
  }, [mesas, secciones])

  const resumenSeccion = useMemo(
    () => ({
      libres: mesasDeLaSeccion.filter((mesa) => mesa.estado === 'LIBRE').length,
      ocupadas: mesasDeLaSeccion.filter((mesa) => mesa.estado === 'OCUPADA').length,
    }),
    [mesasDeLaSeccion]
  )

  function handleLogout() {
    // TODO: si se agrega endpoint de logout en el backend, invocarlo aquí antes de limpiar el storage
    localStorage.removeItem('token')
    localStorage.removeItem('accountType')
    localStorage.removeItem('user')
    navigate('/login')
  }

  function handleAbrirNuevaMesa() {
    setMesaEnEdicion(null)
    setModalAbierto(true)
  }

  function handleEditarMesa(mesa) {
    setMesaEnEdicion(mesa)
    setModalAbierto(true)
  }

  function handleEliminarMesa(mesa) {
    // TODO: reemplazar por un diálogo de confirmación propio del sistema de diseño
    const confirmado = window.confirm(`¿Eliminar "${mesa.nombre}"?`)
    if (confirmado) eliminarMesa(mesa.id)
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

  function handleAbrirOrden(mesa) {
    navigate(`/home/mesas/${mesa.id}`)
  }

  return (
    <div className="min-h-screen bg-page">
      <Navbar nombreRestaurante="La Buena Mesa" activeLink="home" onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink tracking-tight">Mesas</h1>
            <p className="mt-1 text-sm text-muted">
              {seccionActiva?.nombre}
              {' · '}
              <span className="text-success font-medium">{resumenSeccion.libres} libres</span>
              {' · '}
              <span className="text-danger font-medium">{resumenSeccion.ocupadas} ocupadas</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleAbrirNuevaMesa}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-orange-50 bg-ember hover:bg-ember-dark shadow-md shadow-ember/20 hover:shadow-lg hover:shadow-ember/30 transition-all active:scale-[0.98]"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z" />
            </svg>
            Agregar mesa
          </button>
        </div>

        <div className="mt-6">
          <SeccionTabs
            secciones={secciones}
            seccionActivaId={seccionActivaId}
            onCambiarSeccion={setSeccionActivaId}
            conteos={conteoPorSeccion}
          />
        </div>

        {mesasDeLaSeccion.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-line py-16 text-center">
            <p className="text-muted text-sm">
              Todavía no hay mesas en {seccionActiva?.nombre ?? 'esta sección'}.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mesasDeLaSeccion.map((mesa) => (
              <MesaCard
                key={mesa.id}
                mesa={mesa}
                seccion={seccionActiva}
                onAbrir={handleAbrirOrden}
                onEditar={handleEditarMesa}
                onEliminar={handleEliminarMesa}
              />
            ))}
          </div>
        )}
      </main>

      {modalAbierto && (
        <MesaFormModal
          mesa={mesaEnEdicion}
          secciones={secciones}
          seccionSugeridaId={seccionActivaId}
          onCerrar={() => setModalAbierto(false)}
          onGuardar={handleGuardarMesa}
        />
      )}
    </div>
  )
}
