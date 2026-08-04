import { useEffect, useMemo, useState } from 'react'
import BotonCerrarX from './BotonCerrarX'
import SeleccionarClienteModal, { CLIENTE_POR_DEFECTO } from './SeleccionarClienteModal'
import { formatearColones } from '../utils/formato'

/**
 * Previsualización del desglose. Replica la fórmula de factura.service.js:
 * el descuento se resta del precio bruto y el servicio se calcula sobre el total YA descontado.
 * El cálculo definitivo lo hace el backend al facturar.
 */
function calcularDesglose(precioBruto, seccion, descuento) {
  const precioTotal = precioBruto - descuento

  const montoServicio = seccion?.aplicaServicio
    ? (precioTotal * Number(seccion.porcentajeServicio)) / 100
    : 0
  const montoComision = seccion?.aplicaComision
    ? (precioTotal * Number(seccion.porcentajeComision)) / 100
    : 0

  const total = precioTotal - montoComision
  const subtotal = total - montoServicio

  return { subtotal, montoServicio, montoComision, total }
}

/**
 * `itemsAFacturar` son las líneas que se van a cobrar: toda la orden en modo normal,
 * o solo las elegidas cuando se viene del modal de dividir cuenta. El desglose se
 * calcula sobre esos items, no sobre la mesa completa.
 */
export default function ConfirmarFacturaModal({
  itemsAFacturar,
  seccion,
  esDividida = false,
  onDividir,
  onFacturar,
  onCerrar,
}) {
  // El descuento se guarda siempre como MONTO en colones: es lo que espera el backend.
  const [descuento, setDescuento] = useState(0)
  const [tipoDescuento, setTipoDescuento] = useState('monto') // 'monto' | 'porcentaje'
  const [valorDescuento, setValorDescuento] = useState('')

  const [nombreCliente, setNombreCliente] = useState(CLIENTE_POR_DEFECTO)
  const [modalClienteAbierto, setModalClienteAbierto] = useState(false)

  const [error, setError] = useState('')
  const [facturando, setFacturando] = useState(false)

  useEffect(() => {
    function handleEsc(event) {
      // El sub-modal de cliente maneja su propio Escape.
      if (event.key === 'Escape' && !modalClienteAbierto) onCerrar()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onCerrar, modalClienteAbierto])

  // Precio bruto = solo lo que se está cobrando en esta factura.
  const precioBruto = useMemo(
    () => itemsAFacturar.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [itemsAFacturar]
  )
  const unidades = useMemo(
    () => itemsAFacturar.reduce((acc, item) => acc + item.cantidad, 0),
    [itemsAFacturar]
  )

  const { subtotal, montoServicio, montoComision, total } = calcularDesglose(
    precioBruto,
    seccion,
    descuento
  )

  function handleAplicarDescuento() {
    const valor = Number(valorDescuento)

    if (valorDescuento === '' || valor === 0) {
      setError('')
      setDescuento(0)
      return
    }
    if (Number.isNaN(valor) || valor < 0) {
      setError('El descuento no es válido')
      return
    }

    const monto =
      tipoDescuento === 'porcentaje' ? Math.round((precioBruto * valor) / 100) : Math.round(valor)

    if (monto > precioBruto) {
      setError('El descuento no puede ser mayor que el total')
      return
    }

    setError('')
    setDescuento(monto)
  }

  async function handleFacturar() {
    setError('')
    setFacturando(true)
    try {
      await onFacturar({ descuento, nombreCliente })
    } catch (error) {
      setError(error.response?.data?.error || 'Error al facturar')
      setFacturando(false)
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 px-4 backdrop-blur-sm"
        onClick={onCerrar}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl border border-line bg-surface shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3 border-b border-line px-6 py-5">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold tracking-tight text-ink">Confirmar factura</h2>
              <p className="mt-0.5 text-sm text-muted">
                {esDividida ? 'Cuenta dividida · ' : ''}
                {unidades} {unidades === 1 ? 'ítem' : 'ítems'}
              </p>
            </div>
            <BotonCerrarX onClick={onCerrar} />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {/* Items de esta factura */}
            <div className="rounded-lg border border-line bg-surface-2/40 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                {esDividida ? 'Ítems de esta cuenta' : 'Ítems a facturar'}
              </p>
              <ul className="mt-2 space-y-1.5">
                {itemsAFacturar.map((item) => (
                  <li
                    key={item.productoId}
                    className="flex items-baseline justify-between gap-3 text-sm"
                  >
                    <span className="min-w-0 truncate text-ink">
                      <span className="font-semibold text-ember">{item.cantidad}×</span>{' '}
                      {item.nombre}
                    </span>
                    <span className="shrink-0 font-medium text-muted">
                      {formatearColones(item.precio * item.cantidad)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cliente */}
            <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-2/40 px-4 py-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Cliente</p>
                <p className="mt-0.5 truncate text-sm font-medium text-ink">{nombreCliente}</p>
              </div>
              <button
                type="button"
                onClick={() => setModalClienteAbierto(true)}
                aria-label="Seleccionar cliente"
                className="shrink-0 rounded-lg border border-line p-2 text-muted transition hover:border-ember/50 hover:text-ember"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
                </svg>
              </button>
            </div>

            {/* Descuento */}
            <div className="mt-4 space-y-3 rounded-lg border border-line bg-surface-2/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Descuento</p>

              <div className="flex gap-2">
                {[
                  { id: 'monto', etiqueta: 'Monto ₡' },
                  { id: 'porcentaje', etiqueta: 'Porcentaje %' },
                ].map((opcion) => {
                  const activo = tipoDescuento === opcion.id
                  return (
                    <button
                      key={opcion.id}
                      type="button"
                      onClick={() => setTipoDescuento(opcion.id)}
                      className={`
                        flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition
                        ${
                          activo
                            ? 'border-ember/50 bg-ember/10 text-ember'
                            : 'border-line text-muted hover:text-ink'
                        }
                      `}
                    >
                      {opcion.etiqueta}
                    </button>
                  )
                })}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="number"
                  min="0"
                  step={tipoDescuento === 'porcentaje' ? '0.01' : '1'}
                  value={valorDescuento}
                  onChange={(event) => setValorDescuento(event.target.value)}
                  placeholder={tipoDescuento === 'porcentaje' ? 'Ej. 10' : 'Ej. 4000'}
                  className="
                    w-full flex-1 rounded-lg border border-line bg-surface-2 px-3 py-2.5
                    text-sm text-ink placeholder-muted transition
                    focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ember/60
                  "
                />
                <button
                  type="button"
                  onClick={handleAplicarDescuento}
                  className="shrink-0 rounded-lg border border-ember px-4 py-2.5 text-sm font-semibold text-ember transition hover:bg-ember/10 active:scale-[0.98]"
                >
                  Aplicar descuento
                </button>
              </div>
            </div>

            {/* Desglose */}
            <div className="mt-5 space-y-1.5 border-t border-line pt-4 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="font-medium text-ink">{formatearColones(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>
                  Impuesto de servicio
                  {seccion?.aplicaServicio ? ` (${seccion.porcentajeServicio}%)` : ''}
                </span>
                <span className="font-medium text-ink">{formatearColones(montoServicio)}</span>
              </div>
              {descuento > 0 && (
                <div className="flex justify-between text-muted">
                  <span>Descuento aplicado</span>
                  <span className="font-medium text-danger">−{formatearColones(descuento)}</span>
                </div>
              )}
              {montoComision > 0 && (
                <div className="flex justify-between text-muted">
                  <span>Comisión</span>
                  <span className="font-medium text-danger">−{formatearColones(montoComision)}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-line pt-2">
                <span className="text-base font-semibold text-ink">TOTAL</span>
                <span className="text-2xl font-extrabold text-ember">{formatearColones(total)}</span>
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-line px-6 py-5 sm:flex-row">
            <button
              type="button"
              onClick={onDividir}
              disabled={facturando}
              className="flex-1 rounded-lg border border-line px-4 py-3 text-sm font-semibold text-muted transition hover:bg-surface-2 hover:text-ink active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              {esDividida ? 'Cambiar división' : 'Dividir cuenta'}
            </button>
            <button
              type="button"
              onClick={handleFacturar}
              disabled={facturando}
              className="flex-1 rounded-lg bg-ember px-4 py-3 text-sm font-bold text-orange-50 shadow-lg shadow-ember/25 transition hover:bg-ember-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-ember"
            >
              {facturando ? 'Facturando...' : 'Facturar'}
            </button>
          </div>
        </div>
      </div>

      {modalClienteAbierto && (
        <SeleccionarClienteModal
          nombreSeleccionado={nombreCliente}
          onSeleccionar={(nombre) => {
            setNombreCliente(nombre)
            setModalClienteAbierto(false)
          }}
          onCerrar={() => setModalClienteAbierto(false)}
        />
      )}
    </>
  )
}
