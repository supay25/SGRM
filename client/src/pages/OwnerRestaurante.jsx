import { useNavigate, useParams } from 'react-router-dom'
import OwnerHeader from '../components/OwnerHeader'
import ResumenTarjeta from '../components/ResumenTarjeta'
import OwnerTopProductosChart from '../components/OwnerTopProductosChart'
import OwnerVentasPorSeccionChart from '../components/OwnerVentasPorSeccionChart'
import OwnerTendenciaChart from '../components/OwnerTendenciaChart'
import HistorialCierreCard from '../components/HistorialCierreCard'
import OwnerFacturaItem from '../components/OwnerFacturaItem'
import useOwnerRestaurantes from '../hooks/useOwnerRestaurantes'
import useOwnerRestauranteDetalle from '../hooks/useOwnerRestauranteDetalle'
import { formatearColones } from '../utils/formato'

function TarjetaGrafico({ titulo, children }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <h3 className="text-sm font-semibold text-ink tracking-tight">{titulo}</h3>
      <div className="mt-3">{children}</div>
    </div>
  )
}

export default function OwnerRestaurante() {
  const { id } = useParams()
  const navigate = useNavigate()
  const restauranteId = Number(id)

  const { restaurantes } = useOwnerRestaurantes()
  const { cargando, resumen, metricas, cierres, facturas } = useOwnerRestauranteDetalle(restauranteId)

  const restaurante = restaurantes.find((r) => r.id === restauranteId)

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('accountType')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-page">
      <OwnerHeader
        titulo={restaurante?.name ?? 'Restaurante'}
        subtitulo={restaurante?.address}
        onVolver={() => navigate('/owner')}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {cargando ? (
          <div className="mt-10 text-center text-muted">Cargando...</div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-ink tracking-tight">Resumen de hoy</h1>

            <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <ResumenTarjeta etiqueta="Facturas" valor={resumen.cantidad} />
              <ResumenTarjeta etiqueta="Total neto" valor={formatearColones(Number(resumen.totalNeto))} />
              <ResumenTarjeta
                etiqueta="Impuesto de servicio"
                valor={formatearColones(Number(resumen.totalServicio))}
              />
              <ResumenTarjeta
                etiqueta="Ingreso real"
                valor={formatearColones(Number(resumen.ingresoReal))}
                destacada
              />
            </div>

            <h2 className="mt-10 text-lg font-semibold text-ink tracking-tight">Métricas</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <TarjetaGrafico titulo="Top 5 productos más vendidos">
                <OwnerTopProductosChart data={metricas.masVendidos} />
              </TarjetaGrafico>
              <TarjetaGrafico titulo="Ventas por sección">
                <OwnerVentasPorSeccionChart data={metricas.porSeccion} />
              </TarjetaGrafico>
              <div className="lg:col-span-2">
                <TarjetaGrafico titulo="Tendencia de ingreso real (últimos cierres)">
                  <OwnerTendenciaChart data={metricas.tendencia} />
                </TarjetaGrafico>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <section>
                <h2 className="text-lg font-semibold text-ink tracking-tight">Últimos cierres</h2>
                {cierres.length === 0 ? (
                  <p className="mt-3 text-sm text-muted">Todavía no hay cierres registrados.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {cierres.map((cierre) => (
                      <HistorialCierreCard key={cierre.id} cierre={cierre} />
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h2 className="text-lg font-semibold text-ink tracking-tight">Facturas recientes</h2>
                {facturas.length === 0 ? (
                  <p className="mt-3 text-sm text-muted">Todavía no hay facturas registradas.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {facturas.map((factura) => (
                      <OwnerFacturaItem key={factura.id} factura={factura} />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
