import { useNavigate } from 'react-router-dom'
import OwnerNavbar from '../components/OwnerNavbar'
import OwnerRestauranteCard from '../components/OwnerRestauranteCard'
import useOwnerRestaurantes from '../hooks/useOwnerRestaurantes'

export default function OwnerDashboard() {
  const navigate = useNavigate()
  const { cargando, restaurantes } = useOwnerRestaurantes()

  const usuario = JSON.parse(localStorage.getItem('user') ?? 'null')
  const nombreOwner = usuario?.name ?? 'Dueño'

  function handleAbrirRestaurante(id) {
    navigate(`/owner/restaurantes/${id}`)
  }

  return (
    <div className="min-h-screen bg-page">
      <OwnerNavbar />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-ink tracking-tight">Hola, Dueño</h1>
        <p className="mt-1 text-sm text-muted">Este es el estado de tus restaurantes hoy.</p>

        {cargando ? (
          <div className="mt-10 text-center text-muted">Cargando restaurantes...</div>
        ) : restaurantes.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-line py-20 text-center">
            <span className="mb-3 block text-4xl">🏪</span>
            <p className="text-sm text-muted">Todavía no tenés restaurantes asignados.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {restaurantes.map((restaurante) => (
              <OwnerRestauranteCard
                key={restaurante.id}
                restaurante={restaurante}
                onAbrir={handleAbrirRestaurante}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
