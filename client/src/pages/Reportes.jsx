import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConsultaRangoCard from '../components/ConsultaRangoCard'
import EstadisticaInline from '../components/EstadisticaInline'
import CierreBusquedaModal from '../components/CierreBusquedaModal'
import FacturaBusquedaModal from '../components/FacturaBusquedaModal'
import { editarClienteFacturaRequest } from '../api/cliente.api'
import { formatearColones } from '../utils/formato'
import Navbar from '../components/navbar'

import {
  getMisVentasRequest,
  getMisServicioRequest,
  getMisProductosRequest,
  getMisConsecutivoRequest,
  getMisCierrePorFechaRequest,
  getMisFacturaPorNumeroRequest,
  crearCierreFechaRequest
} from '../api/reportes.api'

export default function Reportes() {
  // Buscar cierre por fecha (TODO: backend del restaurante)
  const navigate = useNavigate()
  const [fechaCierre, setFechaCierre] = useState('')
  const [cierreEncontrado, setCierreEncontrado] = useState(null)
  const [fechaCierreBuscada, setFechaCierreBuscada] = useState('')
  const [modalCierreAbierto, setModalCierreAbierto] = useState(false)
  const [buscandoCierre, setBuscandoCierre] = useState(false)
  const [hayFacturas, setHayFacturas] = useState(false)


  // Buscar factura por número (TODO: backend del restaurante)
  const [numeroFactura, setNumeroFactura] = useState('')
  const [facturaEncontrada, setFacturaEncontrada] = useState(null)
  const [numeroFacturaBuscado, setNumeroFacturaBuscado] = useState('')
  const [modalFacturaAbierto, setModalFacturaAbierto] = useState(false)
  const [buscandoFactura, setBuscandoFactura] = useState(false)



  async function handleBuscarCierre() {
    if (!fechaCierre) return
    setBuscandoCierre(true)
    try {
      const resultado = await getMisCierrePorFechaRequest(fechaCierre)
      setCierreEncontrado(resultado.cierre)        // el cierre pelado (o null)
      setHayFacturas(resultado.hayFacturas)         // el flag aparte
      setFechaCierreBuscada(fechaCierre)
      setModalCierreAbierto(true)
    } finally {
      setBuscandoCierre(false)
    }
  }

  async function handleBuscarFactura() {
    if (!numeroFactura.trim()) return
    setBuscandoFactura(true)
    try {
      const resultado = await getMisFacturaPorNumeroRequest(numeroFactura.trim())
      setFacturaEncontrada(resultado)
      setNumeroFacturaBuscado(numeroFactura.trim())
      setModalFacturaAbierto(true)
    } finally {
      setBuscandoFactura(false)
    }
  }


  async function handleCerrarDia(fecha) {
    const cierre = await crearCierreFechaRequest(fecha)   // crea el cierre de ese día
    setCierreEncontrado(cierre)                           // ahora el modal pasa al caso 1
    setHayFacturas(false)
  }


  async function handleEditarClienteFactura(nombreCliente) {
    try {
      await editarClienteFacturaRequest(facturaEncontrada.id, nombreCliente)
      setFacturaEncontrada((prev) => ({ ...prev, nombreCliente }))
    } catch (error) {
      alert(error.response?.data?.error || 'Error al editar el cliente')
    }
  }


  function handleLogout() {

    localStorage.removeItem('token')
    localStorage.removeItem('accountType')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-page">
      <Navbar nombreRestaurante="La Buena Mesa" activeLink="reportes" onLogout={handleLogout} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-ink">Reportes</h1>
          <p className="mt-1 text-sm text-muted">Consultas y reportes por período.</p>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Buscar cierre por fecha */}
          <div className="rounded-xl border border-line bg-surface p-5">
            <h2 className="text-sm font-semibold tracking-tight text-ink">Buscar cierre por fecha</h2>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="flex-1">
                <span className="mb-1 block text-xs font-medium text-muted">Fecha</span>
                <input
                  type="date"
                  value={fechaCierre}
                  onChange={(event) => setFechaCierre(event.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  style={{ accentColor: 'var(--color-ember)' }}
                  className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm text-ink scheme-dark focus:outline-none focus:ring-2 focus:ring-ember/60 focus:border-transparent transition"
                />
              </label>
              <button
                type="button"
                onClick={handleBuscarCierre}
                disabled={!fechaCierre || buscandoCierre}
                className="shrink-0 rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-orange-50 shadow-md shadow-ember/20 transition hover:bg-ember-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {buscandoCierre ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>

          {/* Buscar factura por número */}
          <div className="rounded-xl border border-line bg-surface p-5">
            <h2 className="text-sm font-semibold tracking-tight text-ink">Buscar factura por número</h2>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="flex-1">
                <span className="mb-1 block text-xs font-medium text-muted">Número</span>
                <input
                  type="number"
                  value={numeroFactura}
                  onChange={(event) => setNumeroFactura(event.target.value)}
                  placeholder="Ej. 342"
                  className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-ember/60 focus:border-transparent transition"
                />
              </label>
              <button
                type="button"
                onClick={handleBuscarFactura}
                disabled={!numeroFactura.trim() || buscandoFactura}
                className="shrink-0 rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-orange-50 shadow-md shadow-ember/20 transition hover:bg-ember-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {buscandoFactura ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>

          {/* Ventas por período */}
          <ConsultaRangoCard
            titulo="Ventas por período"
            onConsultar={(desde, hasta) => getMisVentasRequest(desde, hasta)}
          >
            {(r) => (
              <div className="grid grid-cols-2 gap-3">
                <EstadisticaInline etiqueta="Facturas" valor={r.cantidadFacturas} />
                <EstadisticaInline etiqueta="Subtotal" valor={formatearColones(Number(r.subtotal))} />
                <EstadisticaInline etiqueta="Impuesto de servicio" valor={formatearColones(Number(r.totalServicio))} />
                <EstadisticaInline etiqueta="Total neto" valor={formatearColones(Number(r.totalNeto))} />
                <div className="col-span-2">
                  <EstadisticaInline etiqueta="Ingreso real" valor={formatearColones(Number(r.ingresoReal))} destacada />
                </div>
              </div>
            )}
          </ConsultaRangoCard>

          {/* Impuesto de servicio */}
          <ConsultaRangoCard
            titulo="Impuesto de servicio"
            onConsultar={(desde, hasta) => getMisServicioRequest(desde, hasta)}
          >
            {(r) => (
              <div className="grid grid-cols-2 gap-3">
                <EstadisticaInline etiqueta="Total de servicio" valor={formatearColones(Number(r.totalServicio))} destacada />
                <EstadisticaInline etiqueta="Facturas" valor={r.cantidadFacturas} />
              </div>
            )}
          </ConsultaRangoCard>

          {/* Productos por categoría */}
          <ConsultaRangoCard
            titulo="Productos vendidos por categoría"
            onConsultar={(desde, hasta) => getMisProductosRequest(desde, hasta)}
          >
            {(r) => (
              <div className="space-y-4">
                {r.length === 0 ? (
                  <p className="text-sm text-muted">No hay ventas en este período.</p>
                ) : (
                  r.map((cat) => (
                    <div key={cat.categoria}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ember">{cat.categoria}</p>
                      <div className="space-y-1.5">
                        {cat.productos.map((p) => (
                          <div key={p.producto} className="flex items-center justify-between text-sm">
                            <span className="text-ink">
                              {p.producto} <span className="text-muted">×{p.cantidad}</span>
                            </span>
                            <span className="font-medium text-ink">{formatearColones(Number(p.monto))}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </ConsultaRangoCard>

          {/* Consecutivo de facturas */}
          <ConsultaRangoCard
            titulo="Consecutivo de facturas"
            onConsultar={(desde, hasta) => getMisConsecutivoRequest(desde, hasta)}
          >
            {(r) => (
              <div>
                {r.cantidad === 0 ? (
                  <p className="text-sm text-muted">No hay facturas en este período.</p>
                ) : (
                  <p className="text-lg font-semibold text-ink">
                    Del #{String(r.primera).padStart(3, '0')} al #{String(r.ultima).padStart(3, '0')}
                    <span className="ml-2 text-sm font-normal text-muted">· {r.cantidad} facturas</span>
                  </p>
                )}
              </div>
            )}
          </ConsultaRangoCard>
        </div>
      </div>

      {modalCierreAbierto && (
        <CierreBusquedaModal
          fechaBuscada={fechaCierreBuscada}
          cierre={cierreEncontrado}
          hayFacturas={hayFacturas}
          onCerrarDia={handleCerrarDia}
          onCerrar={() => setModalCierreAbierto(false)}
        />
      )}

      {modalFacturaAbierto && (
        <FacturaBusquedaModal
          numeroBuscado={numeroFacturaBuscado}
          factura={facturaEncontrada}
          onEditarCliente={handleEditarClienteFactura}
          onCerrar={() => setModalFacturaAbierto(false)}
        />
      )}
    </div>
  )
}