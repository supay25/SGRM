import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import ResumenTarjeta from '../components/ResumenTarjeta'
import ConfirmarCierreModal from '../components/ConfirmarCierreModal'
import ConfirmarAccionModal from '../components/ConfirmarAccionModal'
import HistorialCierreCard from '../components/HistorialCierreCard'
import FacturaCard from '../components/FacturaCard'
import FacturaDetallePanel from '../components/FacturaDetallePanel'
import SeleccionarClienteModal from '../components/SeleccionarClienteModal'
import useCierreCaja from '../hooks/useCierreCaja'
import useFacturas from '../hooks/useFacturas'
import { formatearColones } from '../utils/formato'

export default function CierreCaja() {
  const navigate = useNavigate()
  const { cargando, diaCerrado, resumenHoy, anulados, historial, cerrando, cerrarCaja, recargarResumen } =
    useCierreCaja()
  const {
    cargando: cargandoFacturas,
    facturas,
    facturaSeleccionadaId,
    detalle,
    cargandoDetalle,
    seleccionarFactura,
    cerrarDetalle,
    anularFactura,
    editarCliente,
  } = useFacturas()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [facturaEditandoCliente, setFacturaEditandoCliente] = useState(null)
  const [facturaAAnular, setFacturaAAnular] = useState(null)

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

  // La anulación no corre acá: solo abre la confirmación.
  function handleAnular(factura) {
    setFacturaAAnular(factura)
  }

  async function handleConfirmarAnular() {
    await anularFactura(facturaAAnular.id)
    await recargarResumen()
    setFacturaAAnular(null)
  }

  function handleEditarCliente(factura) {
    setFacturaEditandoCliente(factura)
  }

  async function handleSeleccionarCliente(nombreCliente) {
    await editarCliente(facturaEditandoCliente.id, nombreCliente)
    setFacturaEditandoCliente(null)
  }

  const rangoFacturas =
    resumenHoy.cantidad > 0
      ? `#${String(resumenHoy.primeraFactura).padStart(3, '0')} al #${String(resumenHoy.ultimaFactura).padStart(3, '0')}`
      : '—'

  return (
    <div className="min-h-screen bg-page">
      <Navbar activeLink="caja" onLogout={handleLogout} />

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

            {/* ═══ ZONA 1: Resumen del día ═══ */}
            <section className="mt-6">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <ResumenTarjeta etiqueta="Facturas" valor={resumenHoy.cantidad} />
                <ResumenTarjeta etiqueta="Consecutivos" valor={rangoFacturas} />
                <ResumenTarjeta etiqueta="Ingreso real" valor={formatearColones(resumenHoy.ingresoReal)} />
                <ResumenTarjeta
                  etiqueta="Impuesto de servicio"
                  valor={formatearColones(resumenHoy.totalServicio)}
                />
              </div>

              <div className="mt-4">
                <ResumenTarjeta etiqueta="Total neto" valor={formatearColones(resumenHoy.totalNeto)} destacada />
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

              {anulados.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-ink tracking-tight">Productos anulados hoy</h2>
                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                </div>
              )}
            </section>

            {/* ═══ ZONA 2: Facturas del día ═══ */}
            <section className="mt-10">
              <h2 className="text-xl font-bold text-ink tracking-tight">Facturas del día</h2>

              {cargandoFacturas ? (
                <div className="mt-6 text-center text-muted">Cargando facturas...</div>
              ) : facturas.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-line py-16 text-center">
                  <span className="mb-3 block text-4xl">🧾</span>
                  <p className="text-sm text-muted">Todavía no hay facturas registradas hoy.</p>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-5">
                  <div className="lg:col-span-2">
                    <div className="max-h-100 space-y-3 overflow-y-auto pr-1 lg:max-h-150">
                      {facturas.map((factura) => (
                        <FacturaCard
                          key={factura.id}
                          factura={factura}
                          seleccionada={factura.id === facturaSeleccionadaId}
                          onAbrir={seleccionarFactura}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    {facturaSeleccionadaId === null ? (
                      <div className="flex h-full min-h-60 items-center justify-center rounded-xl border border-dashed border-line text-center">
                        <p className="px-6 text-sm text-muted">Selecciona una factura para ver el detalle.</p>
                      </div>
                    ) : (
                      <FacturaDetallePanel
                        factura={detalle}
                        cargando={cargandoDetalle}
                        onVolver={cerrarDetalle}
                        onAnular={handleAnular}
                        onEditarCliente={handleEditarCliente}
                      />
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* ═══ ZONA 3: Cierres anteriores ═══ */}
            <section className="mt-10">
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

      {facturaAAnular && (
        <ConfirmarAccionModal
          titulo="Anular factura"
          mensaje={`¿Anular la factura #${String(facturaAAnular.numeroFactura).padStart(3, '0')}?`}
          advertencia="Esta acción no se puede deshacer."
          textoConfirmar="Sí, anular"
          onCancelar={() => setFacturaAAnular(null)}
          onConfirmar={handleConfirmarAnular}
        />
      )}

      {facturaEditandoCliente && (
        <SeleccionarClienteModal
          nombreSeleccionado={facturaEditandoCliente.nombreCliente}
          permitirNombreLibre
          onSeleccionar={handleSeleccionarCliente}
          onCerrar={() => setFacturaEditandoCliente(null)}
        />
      )}
    </div>
  )
}
