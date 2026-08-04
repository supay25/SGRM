import { useEffect, useMemo, useState } from 'react'
import BotonCerrarX from './BotonCerrarX'
import { formatearColones } from '../utils/formato'

/**
 * Paso previo al modal de confirmar: el mesero elige cuántas unidades de cada producto
 * entran en esta sub-cuenta. Lo seleccionado se manda como `itemsAFacturar`;
 * el resto se queda en la orden para cobrarlo después.
 */
export default function DividirCuentaModal({
  lineas,
  seleccionInicial = {},
  onConfirmar,
  onCancelar,
}) {
  // { productoId: cantidad } — cuántas unidades de cada línea van en esta sub-cuenta.
  const [seleccion, setSeleccion] = useState(() => {
    const inicial = {}
    lineas.forEach((linea) => {
      inicial[linea.productoId] = Math.min(seleccionInicial[linea.productoId] ?? 0, linea.cantidad)
    })
    return inicial
  })

  useEffect(() => {
    function handleEsc(event) {
      if (event.key === 'Escape') onCancelar()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onCancelar])

  const { unidades, subtotal } = useMemo(() => {
    return lineas.reduce(
      (acc, linea) => {
        const cantidad = seleccion[linea.productoId] ?? 0
        return {
          unidades: acc.unidades + cantidad,
          subtotal: acc.subtotal + linea.precio * cantidad,
        }
      },
      { unidades: 0, subtotal: 0 }
    )
  }, [lineas, seleccion])

  // Nunca menos de 0 ni más de lo que hay disponible en la orden.
  function cambiarCantidad(linea, delta) {
    setSeleccion((prev) => {
      const actual = prev[linea.productoId] ?? 0
      const nueva = Math.min(Math.max(actual + delta, 0), linea.cantidad)
      return { ...prev, [linea.productoId]: nueva }
    })
  }

  function handleFacturarSeleccionados() {
    if (unidades === 0) return
    const items = lineas
      .map((linea) => ({ ...linea, cantidad: seleccion[linea.productoId] ?? 0 }))
      .filter((linea) => linea.cantidad > 0)
    onConfirmar(items)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 px-4 backdrop-blur-sm"
      onClick={onCancelar}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl border border-line bg-surface shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight text-ink">Dividir cuenta</h2>
            <p className="mt-0.5 text-sm text-muted">Elegí cuánto se cobra en esta cuenta.</p>
          </div>
          <BotonCerrarX onClick={onCancelar} />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-2">
          {lineas.map((linea) => {
            const cantidad = seleccion[linea.productoId] ?? 0
            const activo = cantidad > 0

            return (
              <div
                key={linea.productoId}
                className="flex items-center gap-3 border-b border-line py-4 last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold leading-snug text-ink">
                    {linea.nombre}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {formatearColones(linea.precio)} c/u · {linea.cantidad} en la mesa
                  </p>
                  {activo && (
                    <p className="mt-1 text-xs font-semibold text-ember">
                      {formatearColones(linea.precio * cantidad)}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => cambiarCantidad(linea, -1)}
                    disabled={cantidad === 0}
                    aria-label={`Quitar una unidad de ${linea.nombre} de esta cuenta`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-lg leading-none text-ink transition hover:bg-surface-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    −
                  </button>
                  <span
                    className={`w-10 text-center text-base font-bold ${
                      activo ? 'text-ember' : 'text-muted'
                    }`}
                  >
                    {cantidad}
                    <span className="text-xs font-normal text-muted">/{linea.cantidad}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => cambiarCantidad(linea, 1)}
                    disabled={cantidad >= linea.cantidad}
                    aria-label={`Agregar una unidad de ${linea.nombre} a esta cuenta`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-lg leading-none text-ink transition hover:bg-surface-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="shrink-0 border-t border-line px-6 py-5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-muted">
              {unidades} {unidades === 1 ? 'ítem seleccionado' : 'ítems seleccionados'}
            </span>
            <span className="text-xl font-extrabold text-ember">{formatearColones(subtotal)}</span>
          </div>

          {unidades === 0 && (
            <p className="mt-3 rounded-lg border border-line bg-surface-2/40 px-4 py-3 text-sm text-muted">
              Seleccioná al menos un ítem para facturar esta cuenta.
            </p>
          )}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCancelar}
              className="flex-1 rounded-lg border border-line px-4 py-3 text-sm font-semibold text-muted transition hover:bg-surface-2 hover:text-ink active:scale-[0.98]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleFacturarSeleccionados}
              disabled={unidades === 0}
              className="flex-1 rounded-lg bg-ember px-4 py-3 text-sm font-bold text-orange-50 shadow-lg shadow-ember/25 transition hover:bg-ember-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ember"
            >
              Facturar seleccionados
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
