import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import SeccionTabs from '../components/SeccionTabs'
import MesaCard from '../components/MesaCard'
import useMesas from '../hooks/useMesas.js'

// El Home es solo operación: ver las mesas y entrar a tomar órdenes.
// La administración de mesas vive en Parámetros → Mesas.
export default function Home() {
  const navigate = useNavigate()
  const { secciones, mesas } = useMesas()

  const [seccionActivaId, setSeccionActivaId] = useState(secciones[0]?.id ?? null)

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

  function handleAbrirOrden(mesa) {
    navigate(`/home/mesas/${mesa.id}`)
  }

  return (
    <div className="min-h-screen bg-page">
      <Navbar nombreRestaurante="La Buena Mesa" activeLink="home" onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
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
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
