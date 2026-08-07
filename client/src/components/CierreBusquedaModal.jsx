import { useEffect, useState } from 'react'
import { formatearColones } from '../utils/formato'
import BotonCerrarX from './BotonCerrarX'
import BotonImprimir from './BotonImprimir'

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-CR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export default function CierreBusquedaModal({ fechaBuscada, cierre, hayFacturas, onCerrarDia, onCerrar }) {
  const [confirmando, setConfirmando] = useState(false)
  const [cerrando, setCerrando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    function handleEsc(event) {
      if (event.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onCerrar])

  async function handleConfirmarCierre() {
    setCerrando(true)
    setError('')
    try {
      await onCerrarDia(fechaBuscada)
      setConfirmando(false)
      // onCerrarDia se encarga de actualizar el cierre mostrado (pasa a caso 1)
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo cerrar este día.')
    } finally {
      setCerrando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm px-4"
      onClick={onCerrar}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-sm max-h-[85vh] flex-col rounded-2xl border border-line bg-surface shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-6 py-5">
          <h2 className="text-lg font-semibold text-ink tracking-tight capitalize">{formatearFecha(fechaBuscada)}</h2>
          <BotonCerrarX onClick={onCerrar} />
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {cierre ? (
            /* ── CASO 1: hay cierre ── */
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted">
                <span>Facturas</span>
                <span className="font-medium text-ink">
                  #{String(cierre.primeraFactura).padStart(3, '0')} al #
                  {String(cierre.ultimaFactura).padStart(3, '0')}
                </span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Total neto</span>
                <span className="font-medium text-ink">{formatearColones(Number(cierre.totalNeto))}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Impuesto de servicio</span>
                <span className="font-medium text-ink">{formatearColones(Number(cierre.totalServicio))}</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-2 mt-2">
                <span className="text-base font-semibold text-ink">INGRESO REAL</span>
                <span className="text-2xl font-extrabold text-ember">
                  {formatearColones(Number(cierre.ingresoReal))}
                </span>
              </div>
            </div>
          ) : hayFacturas ? (
            /* ── CASO 2: no hay cierre pero sí facturas ── */
            <div className="space-y-4">
              <p className="text-sm text-muted">
                No hay cierre registrado para esta fecha, pero sí hubo ventas. Podés cerrar este día ahora.
              </p>
              {confirmando ? (
                <div className="rounded-lg border border-ember/40 bg-ember/10 px-4 py-3">
                  <p className="text-sm font-medium text-ink">
                    ¿Cerrar la caja del <span className="capitalize">{formatearFecha(fechaBuscada)}</span>?
                  </p>
                  <p className="mt-1 text-xs text-muted">Esta acción no se puede deshacer.</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={handleConfirmarCierre}
                      disabled={cerrando}
                      className="flex-1 rounded-lg bg-ember px-3 py-2 text-sm font-semibold text-orange-50 transition hover:bg-ember-dark disabled:opacity-60"
                    >
                      {cerrando ? 'Cerrando...' : 'Sí, cerrar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmando(false)}
                      disabled={cerrando}
                      className="flex-1 rounded-lg border border-line px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-ink"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmando(true)}
                  className="w-full rounded-lg bg-ember px-4 py-2.5 text-sm font-semibold text-orange-50 shadow-md shadow-ember/20 transition hover:bg-ember-dark"
                >
                  Hacer cierre de este día
                </button>
              )}
              {error && <p className="text-sm text-danger">{error}</p>}
            </div>
          ) : (
            /* ── CASO 3: ni cierre ni facturas ── */
            <p className="text-sm text-muted">No hubo ventas registradas en esta fecha.</p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-line px-6 py-5">
          {cierre && <BotonImprimir />}
          <button
            type="button"
            onClick={onCerrar}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-ink hover:bg-surface-2 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}