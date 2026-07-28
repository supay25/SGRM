import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import FacturaCard from '../components/FacturaCard'
import FacturaDetallePanel from '../components/FacturaDetallePanel'
import useFacturas from '../hooks/useFacturas'
import { formatearColones } from '../utils/formato'

export default function Facturas() {
  const navigate = useNavigate()
  const {
    cargando,
    facturas,
    resumenDelDia,
    facturaSeleccionadaId,
    detalle,
    cargandoDetalle,
    seleccionarFactura,
    cerrarDetalle,
    anularFactura,
  } = useFacturas()
 
  function handleLogout() {
    // TODO: si se agrega endpoint de logout en el backend, invocarlo aquí antes de limpiar el storage
    localStorage.removeItem('token')
    localStorage.removeItem('accountType')
    localStorage.removeItem('user')
    navigate('/login')
  }

  function handleAnular(factura) {
    // TODO: reemplazar por confirmación propia del sistema de diseño
    const confirmado = window.confirm(
      `¿Anular la factura #${String(factura.numeroFactura).padStart(3, '0')}? Esta acción no se puede deshacer.`
    )
    if (confirmado) anularFactura(factura.id)
  }

  function handleEditarCliente(factura) {
    // TODO: PATCH /api/facturas/:id { nombreCliente }
    console.log('Editar cliente de la factura', factura.id)
  }

  function handleImprimir(factura) {
    // TODO: impresión térmica, pendiente
    console.log('Imprimir factura', factura.id)
  }

  return (
    <div className="min-h-screen bg-page">
      <Navbar nombreRestaurante="La Buena Mesa" activeLink="reportes" onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink tracking-tight">Facturas</h1>
            <p className="mt-1 text-sm text-muted">
              {resumenDelDia.cantidad} {resumenDelDia.cantidad === 1 ? 'factura' : 'facturas'} hoy
              {' · '}
              <span className="font-semibold text-ink">{formatearColones(resumenDelDia.totalNeto)}</span>
              {' facturado'}
            </p>
          </div>
        </div>

        {!cargando && facturas.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="rounded-lg border border-line bg-surface px-4 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Impuesto de servicio
              </span>
              <p className="text-base font-semibold text-ink">{formatearColones(resumenDelDia.totalServicio)}</p>
            </div>
          </div>
        )}

        {cargando ? (
          <div className="mt-10 text-center text-muted">Cargando facturas...</div>
        ) : facturas.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-line py-20 text-center">
            <span className="mb-3 block text-4xl">🧾</span>
            <p className="text-sm text-muted">Todavía no hay facturas registradas hoy.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className={`space-y-3 lg:col-span-2 ${facturaSeleccionadaId !== null ? 'hidden lg:block' : ''}`}>
              {facturas.map((factura) => (
                <FacturaCard
                  key={factura.id}
                  factura={factura}
                  seleccionada={factura.id === facturaSeleccionadaId}
                  onAbrir={seleccionarFactura}
                />
              ))}
            </div>

            <div className={`lg:col-span-3 lg:sticky lg:top-24 lg:self-start ${facturaSeleccionadaId === null ? 'hidden lg:block' : ''}`}>
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
                  onImprimir={handleImprimir}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
