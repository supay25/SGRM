import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import SeccionTabs from '../components/SeccionTabs'
import MesaCard from '../components/MesaCard'
import MoverProductosModal from '../components/MoverProductosModal'
import useMesas from '../hooks/useMesas.js'

// El Home es solo operación: ver las mesas y entrar a tomar órdenes.
// La administración de mesas vive en Parámetros → Mesas.
export default function Home() {
  const navigate = useNavigate()
  const { secciones, mesas, recargar } = useMesas()

  const [seccionActivaId, setSeccionActivaId] = useState(secciones[0]?.id ?? null)
  const [moverAbierto, setMoverAbierto] = useState(false)

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

  // Tras mover productos las mesas pueden cambiar de estado (LIBRE/OCUPADA),
  // así que se recargan para reflejarlo en el grid.
  async function handleProductosMovidos() {
    setMoverAbierto(false)
    await recargar()
  }

  return (
    <div className="min-h-screen bg-page">
      <Navbar activeLink="home" onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Mesas</h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {seccionActiva?.nombre && (
                <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-3 py-1 text-sm font-semibold text-subtle">
                  <span className={`h-2.5 w-2.5 rounded-full ${seccionActiva.colores.solido}`} />
                  {seccionActiva.nombre}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-sm font-semibold text-success ring-1 ring-success/40">
                <span className="text-base font-bold tabular-nums">{resumenSeccion.libres}</span>
                libres
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/15 px-3 py-1 text-sm font-semibold text-danger ring-1 ring-danger/40">
                <span className="text-base font-bold tabular-nums">{resumenSeccion.ocupadas}</span>
                ocupadas
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMoverAbierto(true)}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-base font-semibold text-ink transition hover:border-ember hover:bg-surface-2 hover:text-ember-light active:scale-[0.98] sm:px-4"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 shrink-0"
            >
              <path d="M4 8h13l-3-3M20 16H7l3 3" />
            </svg>
            <span className="hidden sm:inline">Mover productos</span>
            <span className="sm:hidden">Mover</span>
          </button>
        </div>

        <div className="mt-7">
          <SeccionTabs
            secciones={secciones}
            seccionActivaId={seccionActivaId}
            onCambiarSeccion={setSeccionActivaId}
          />
        </div>

        {mesasDeLaSeccion.length === 0 ? (
          <div className="mt-7 rounded-2xl border-2 border-dashed border-line-strong py-16 text-center">
            <p className="text-base font-medium text-subtle">
              Todavía no hay mesas en {seccionActiva?.nombre ?? 'esta sección'}.
            </p>
          </div>
        ) : (
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

      {moverAbierto && (
        <MoverProductosModal
          mesas={mesas}
          secciones={secciones}
          onCerrar={() => setMoverAbierto(false)}
          onMovido={handleProductosMovidos}
        />
      )}
    </div>
  )
}
