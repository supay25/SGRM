import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import ResumenTarjeta from '../components/ResumenTarjeta'
import ConfirmarCierreModal from '../components/ConfirmarCierreModal'
import HistorialCierreCard from '../components/HistorialCierreCard'
import useCierreCaja from '../hooks/useCierreCaja'
import { formatearColones } from '../utils/formato'

export default function CierreCaja() {
  const navigate = useNavigate()
  const { cargando, diaCerrado, resumenHoy, anulados, historial, cerrando, cerrarCaja } = useCierreCaja()
  const [modalAbierto, setModalAbierto] = useState(false)

  function handleLogout() {
    // TODO: si se agrega endpoint de logout en el backend, invocarlo aquí antes de limpiar el storage
    localStorage.removeItem('token')
    localStorage.removeItem('accountType')
    localStorage.removeItem('user')
    navigate('/login')
  }
 
  async function handleConfirmarCierre() {
    await cerrarCaja()
    setModalAbierto(false)
  }

  const rangoFacturas =
    resumenHoy.cantidad > 0
      ? `#${String(resumenHoy.primeraFactura).padStart(3, '0')} al #${String(resumenHoy.ultimaFactura).padStart(3, '0')}`
      : '—'

  return (
    <div className="min-h-screen bg-page">
      <Navbar nombreRestaurante="La Buena Mesa" activeLink="caja" onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-ink tracking-tight">Cierre de caja</h1>

        {cargando ? (
          <div className="mt-10 text-center text-muted">Cargando...</div>
        ) : (
          <>
            {diaCerrado ? (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-success/30 bg-success/10 px-5 py-4">
                <span className="text-xl">🔒</span>
                <p className="text-sm font-medium text-success">
                  El día de hoy ya está cerrado. No se pueden registrar más facturas.
                </p>
              </div>
            ) : (
              <p className="mt-1 text-sm text-muted">Resumen en vivo de lo facturado hoy.</p>
            )}

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
              {/* Columna principal: cifras del día */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-2 gap-4">
                  <ResumenTarjeta etiqueta="Facturas" valor={resumenHoy.cantidad} />
                  <ResumenTarjeta etiqueta="Consecutivos" valor={rangoFacturas} />
                  <ResumenTarjeta etiqueta="Total neto" valor={formatearColones(resumenHoy.totalNeto)} />
                  <ResumenTarjeta
                    etiqueta="Impuesto de servicio"
                    valor={formatearColones(resumenHoy.totalServicio)}
                  />
                </div>

                <div className="mt-4">
                  <ResumenTarjeta
                    etiqueta="Ingreso real"
                    valor={formatearColones(resumenHoy.ingresoReal)}
                    destacada
                  />
                </div>

                {!diaCerrado && (
                  <button
                    type="button"
                    onClick={() => setModalAbierto(true)}
                    disabled={resumenHoy.cantidad === 0}
                    className="mt-6 w-full rounded-xl bg-ember px-4 py-4 text-base font-bold text-orange-50 shadow-lg shadow-ember/25 transition hover:bg-ember-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ember"
                  >
                    Cerrar caja del día
                  </button>
                )}
              </div>

              {/* Columna lateral: anulados + historial */}
              <div className="space-y-8 lg:col-span-2 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
                {anulados.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold text-ink tracking-tight">Productos anulados hoy</h2>
                    <div className="mt-4 space-y-2">
                      {anulados.map((anulado, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface px-5 py-3.5"
                        >
                          <div>
                            <p className="text-base font-medium text-ink">{anulado.nombreProducto}</p>
                            <p className="mt-0.5 text-sm text-muted">{anulado.nombreMesa}</p>
                          </div>
                          <span className="text-base font-semibold text-danger">×{anulado.cantidad}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section>
                  <h2 className="text-lg font-semibold text-ink tracking-tight">Cierres anteriores</h2>
                  {historial.length === 0 ? (
                    <p className="mt-3 text-sm text-muted">Todavía no hay cierres registrados.</p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {historial.map((cierre) => (
                        <HistorialCierreCard key={cierre.id} cierre={cierre} />
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </>
        )}
      </main>

      {modalAbierto && (
        <ConfirmarCierreModal
          cerrando={cerrando}
          onCancelar={() => setModalAbierto(false)}
          onConfirmar={handleConfirmarCierre}
        />
      )}
    </div>
  )
}
