import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OwnerHeader from '../components/OwnerHeader'
import OwnerRestauranteTabs from '../components/OwnerRestauranteTabs'
import ResumenTarjeta from '../components/ResumenTarjeta'
import OwnerTopProductosChart from '../components/OwnerTopProductosChart'
import OwnerVentasPorSeccionChart from '../components/OwnerVentasPorSeccionChart'
import OwnerTendenciaChart from '../components/OwnerTendenciaChart'
import HistorialCierreCard from '../components/HistorialCierreCard'
import CierreBusquedaModal from '../components/CierreBusquedaModal'
import FacturaBusquedaModal from '../components/FacturaBusquedaModal'
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

  const [tabActivo, setTabActivo] = useState('resumen')

  const { restaurantes } = useOwnerRestaurantes()
  const { cargando, resumen, metricas, cierres, buscarCierrePorFecha, buscarFacturaPorNumero } =
    useOwnerRestauranteDetalle(restauranteId)

  const restaurante = restaurantes.find((r) => r.id === restauranteId)

  const [fechaBusqueda, setFechaBusqueda] = useState('')
  const [buscandoCierre, setBuscandoCierre] = useState(false)
  const [cierreEncontrado, setCierreEncontrado] = useState(null)
  const [fechaModal, setFechaModal] = useState('')
  const [modalCierreAbierto, setModalCierreAbierto] = useState(false)

  const [numeroBusqueda, setNumeroBusqueda] = useState('')
  const [buscandoFactura, setBuscandoFactura] = useState(false)
  const [facturaEncontrada, setFacturaEncontrada] = useState(null)
  const [numeroModal, setNumeroModal] = useState('')
  const [modalFacturaAbierto, setModalFacturaAbierto] = useState(false)

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('accountType')
    localStorage.removeItem('user')
    navigate('/login')
  }

  async function handleBuscarCierre() {
    console.log('fecha:', fechaBusqueda)
    if (!fechaBusqueda) return
    setBuscandoCierre(true)
    try {
      const resultado = await buscarCierrePorFecha(fechaBusqueda)
      setCierreEncontrado(resultado)
      setFechaModal(fechaBusqueda)
      setModalCierreAbierto(true)
    } finally {
      setBuscandoCierre(false)
    }
  }

  async function handleBuscarFactura() {
    if (!numeroBusqueda.trim()) return
    setBuscandoFactura(true)
    try {
      const resultado = await buscarFacturaPorNumero(numeroBusqueda.trim())
      setFacturaEncontrada(resultado)
      setNumeroModal(numeroBusqueda.trim())
      setModalFacturaAbierto(true)
    } finally {
      setBuscandoFactura(false)
    }
  }

  const ultimosCierres = cierres.slice(0, 5)

  return (
    <div className="min-h-screen bg-page">
      <OwnerHeader
        titulo={restaurante?.name ?? 'Restaurante'}
        subtitulo={restaurante?.address}
        onVolver={() => navigate('/owner')}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        {cargando ? (
          <div className="mt-10 text-center text-muted">Cargando...</div>
        ) : (
          <>
            <OwnerRestauranteTabs tabActivo={tabActivo} onCambiarTab={setTabActivo} />

            {tabActivo === 'resumen' && (
              <div className="mt-6">
                <h1 className="text-xl font-bold text-ink tracking-tight">Resumen de hoy</h1>
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
                <section>
                  <br/>
                  <h1 className="text-xl font-bold text-ink tracking-tight">Ultimos Cierres</h1>
                  {ultimosCierres.length === 0 ? (
                    <p className="mt-3 text-sm text-muted">Todavía no hay cierres registrados.</p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {ultimosCierres.map((cierre) => (
                        <HistorialCierreCard key={cierre.id} cierre={cierre} />
                      ))}
                    </div>
                  )}
                </section>
              </div>

            )}

            {tabActivo === 'reportes' && (
              <div className="mt-6">
                <h1 className="text-xl font-bold text-ink tracking-tight">Estadisticas</h1>
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
              </div>
            )}

            {tabActivo === 'facturacion' && (
              <div className="mt-6 space-y-8">


                <section className="rounded-xl border border-line bg-surface p-5">
                  <h2 className="text-sm font-semibold text-ink tracking-tight">Buscar cierre por fecha</h2>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input
                      type="date"
                      value={fechaBusqueda}
                      onChange={(event) => setFechaBusqueda(event.target.value)}
                      style={{ accentColor: 'var(--color-ember)' }}
                      className="w-full flex-1 rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm text-ink scheme-dark focus:outline-none focus:ring-2 focus:ring-ember/60 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={handleBuscarCierre}
                      disabled={!fechaBusqueda || buscandoCierre}
                      className="shrink-0 rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-orange-50 shadow-md shadow-ember/20 transition hover:bg-ember-dark disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {buscandoCierre ? 'Buscando...' : 'Buscar'}
                    </button>
                  </div>
                </section>

                <section className="rounded-xl border border-line bg-surface p-5">
                  <h2 className="text-sm font-semibold text-ink tracking-tight">Buscar factura por número</h2>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input
                      type="number"
                      min="1"
                      inputMode="numeric"
                      placeholder="Ej. 342"
                      value={numeroBusqueda}
                      onChange={(event) => setNumeroBusqueda(event.target.value)}
                      className="w-full flex-1 rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-ember/60 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={handleBuscarFactura}
                      disabled={!numeroBusqueda.trim() || buscandoFactura}
                      className="shrink-0 rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-orange-50 shadow-md shadow-ember/20 transition hover:bg-ember-dark disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {buscandoFactura ? 'Buscando...' : 'Buscar'}
                    </button>
                  </div>
                </section>
              </div>
            )}
          </>
        )}
      </main>

      {modalCierreAbierto && (
        <CierreBusquedaModal
          fechaBuscada={fechaModal}
          cierre={cierreEncontrado}
          onCerrar={() => setModalCierreAbierto(false)}
        />
      )}

      {modalFacturaAbierto && (
        <FacturaBusquedaModal
          numeroBuscado={numeroModal}
          factura={facturaEncontrada}
          onCerrar={() => setModalFacturaAbierto(false)}
        />
      )}
    </div>
  )
}
