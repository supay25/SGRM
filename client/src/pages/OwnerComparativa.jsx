import OwnerNavbar from '../components/OwnerNavbar'
import OwnerComparativaChart from '../components/OwnerComparativaChart'
import OwnerComparativaItem from '../components/OwnerComparativaItem'
import useOwnerComparativa from '../hooks/useOwnerComparativa'

export default function OwnerComparativa() {
  const { cargando, restaurantes } = useOwnerComparativa()

  return (
    <div className="min-h-screen bg-page">
      <OwnerNavbar />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-ink tracking-tight">Comparativa</h1>
        <p className="mt-1 text-sm text-muted">Ingreso real de hoy entre todos tus restaurantes.</p>

        {cargando ? (
          <div className="mt-10 text-center text-muted">Cargando comparativa...</div>
        ) : restaurantes.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-line py-20 text-center">
            <span className="mb-3 block text-4xl">📊</span>
            <p className="text-sm text-muted">Todavía no hay restaurantes para comparar.</p>
          </div>
        ) : (
          <>
            <div className="mt-6 rounded-xl border border-line bg-surface p-5">
              <h2 className="text-sm font-semibold text-ink tracking-tight">Ingreso real de hoy por restaurante</h2>
              <div className="mt-3">
                <OwnerComparativaChart data={restaurantes} />
              </div>
            </div>

            <h2 className="mt-8 text-lg font-semibold text-ink tracking-tight">Cifras del día</h2>
            <div className="mt-4 space-y-3">
              {restaurantes.map((restaurante) => (
                <OwnerComparativaItem key={restaurante.id} restaurante={restaurante} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
