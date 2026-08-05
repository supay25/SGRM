import { useEffect, useMemo } from 'react'
import BotonCerrarX from './BotonCerrarX'
import useMoverProductos from '../hooks/useMoverProductos'
import { formatearColones } from '../utils/formato'

// Flecha simple (mueve 1) y doble (mueve todo), espejadas según el lado del panel.
function Flecha({ doble, haciaIzquierda }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 ${haciaIzquierda ? 'rotate-180' : ''}`}
    >
      {doble ? <path d="M6 5l7 7-7 7M13 5l7 7-7 7" /> : <path d="M9 5l7 7-7 7" />}
    </svg>
  )
}

function PanelMesa({ titulo, etiqueta, items, resumen, haciaIzquierda, onMover, deshabilitado }) {
  return (
    <div className="flex min-h-0 flex-col rounded-xl border border-line bg-page/40">
      <div className="flex items-baseline justify-between gap-2 border-b border-line px-4 py-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{etiqueta}</p>
          <p className="truncate text-sm font-semibold text-ink">{titulo}</p>
        </div>
        <span className="shrink-0 text-xs text-muted">
          {resumen.unidades} {resumen.unidades === 1 ? 'ítem' : 'ítems'}
        </span>
      </div>

      <div className="max-h-64 min-h-[7rem] flex-1 overflow-y-auto px-4 sm:max-h-80">
        {items.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">Sin productos</p>
        ) : (
          items.map((linea) => (
            <div
              key={linea.productoId}
              className={`flex items-center gap-3 border-b border-line py-3 last:border-b-0 ${
                haciaIzquierda ? 'flex-row-reverse' : ''
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold leading-snug text-ink">{linea.nombre}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {linea.cantidad} × {formatearColones(linea.precio)}
                  {' · '}
                  <span className="font-semibold text-ember">
                    {formatearColones(linea.precio * linea.cantidad)}
                  </span>
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onMover(linea.productoId, false)}
                  disabled={deshabilitado}
                  aria-label={`Mover una unidad de ${linea.nombre} a la otra mesa`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink transition hover:bg-surface-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Flecha haciaIzquierda={haciaIzquierda} />
                </button>
                <button
                  type="button"
                  onClick={() => onMover(linea.productoId, true)}
                  disabled={deshabilitado}
                  aria-label={`Mover todas las unidades de ${linea.nombre} a la otra mesa`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink transition hover:bg-surface-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Flecha doble haciaIzquierda={haciaIzquierda} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2 border-t border-line px-4 py-3">
        <span className="text-xs text-muted">Total</span>
        <span className="text-base font-extrabold text-ember">{formatearColones(resumen.monto)}</span>
      </div>
    </div>
  )
}

function SelectorMesa({ id, etiqueta, valor, onCambiar, mesasPorSeccion, mesaBloqueadaId }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-muted">
        {etiqueta}
      </label>
      <select
        id={id}
        value={valor}
        onChange={(event) => onCambiar(event.target.value)}
        className="w-full rounded-lg border border-line bg-page px-3 py-2.5 text-sm text-ink outline-none transition focus:border-ember"
      >
        <option value="">Elegí una mesa…</option>
        {mesasPorSeccion.map((grupo) => (
          <optgroup key={grupo.id ?? 'sin-seccion'} label={grupo.nombre}>
            {grupo.mesas.map((mesa) => (
              <option
                key={mesa.id}
                value={String(mesa.id)}
                disabled={String(mesa.id) === mesaBloqueadaId}
              >
                {mesa.nombre} · {mesa.estado === 'OCUPADA' ? 'Ocupada' : 'Libre'}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}

/**
 * Intercambio de productos entre dos mesas. Los movimientos son locales;
 * al confirmar se manda el estado final de ambas y el backend reemplaza cada orden.
 */
export default function MoverProductosModal({ mesas, secciones, onCerrar, onMovido }) {
  const {
    mesaOrigenId,
    setMesaOrigenId,
    mesaDestinoId,
    setMesaDestinoId,
    itemsOrigen,
    itemsDestino,
    resumenOrigen,
    resumenDestino,
    ambasElegidas,
    cargando,
    guardando,
    error,
    moverItem,
    confirmar,
  } = useMoverProductos()

  useEffect(() => {
    function handleEsc(event) {
      if (event.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onCerrar])

  // Todas las mesas del restaurante, agrupadas por sección para los dropdowns.
  const mesasPorSeccion = useMemo(() => {
    const grupos = secciones.map((seccion) => ({
      id: seccion.id,
      nombre: seccion.nombre,
      mesas: mesas.filter((mesa) => mesa.seccionId === seccion.id),
    }))
    const sueltas = mesas.filter((mesa) => !secciones.some((seccion) => seccion.id === mesa.seccionId))
    if (sueltas.length > 0) grupos.push({ id: null, nombre: 'Sin sección', mesas: sueltas })
    return grupos.filter((grupo) => grupo.mesas.length > 0)
  }, [mesas, secciones])

  const nombreMesa = (id) => mesas.find((mesa) => String(mesa.id) === id)?.nombre ?? ''

  async function handleConfirmar() {
    const exito = await confirmar()
    if (exito) onMovido()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 px-4 backdrop-blur-sm"
      onClick={onCerrar}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl border border-line bg-surface shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight text-ink">Mover productos</h2>
            <p className="mt-0.5 text-sm text-muted">Pasá productos de una mesa a otra.</p>
          </div>
          <BotonCerrarX onClick={onCerrar} />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SelectorMesa
              id="mesa-origen"
              etiqueta="Mesa origen"
              valor={mesaOrigenId}
              onCambiar={setMesaOrigenId}
              mesasPorSeccion={mesasPorSeccion}
              mesaBloqueadaId={mesaDestinoId}
            />
            <SelectorMesa
              id="mesa-destino"
              etiqueta="Mesa destino"
              valor={mesaDestinoId}
              onCambiar={setMesaDestinoId}
              mesasPorSeccion={mesasPorSeccion}
              mesaBloqueadaId={mesaOrigenId}
            />
          </div>

          {!ambasElegidas ? (
            <div className="mt-5 rounded-xl border border-dashed border-line py-14 text-center">
              <p className="text-sm text-muted">Elegí la mesa origen y la mesa destino para empezar.</p>
            </div>
          ) : cargando ? (
            <div className="mt-5 rounded-xl border border-dashed border-line py-14 text-center">
              <p className="text-sm text-muted">Cargando productos…</p>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <PanelMesa
                etiqueta="Mesa origen"
                titulo={nombreMesa(mesaOrigenId)}
                items={itemsOrigen}
                resumen={resumenOrigen}
                haciaIzquierda={false}
                deshabilitado={guardando}
                onMover={(productoId, todo) => moverItem('origen', productoId, todo)}
              />
              <PanelMesa
                etiqueta="Mesa destino"
                titulo={nombreMesa(mesaDestinoId)}
                items={itemsDestino}
                resumen={resumenDestino}
                haciaIzquierda
                deshabilitado={guardando}
                onMover={(productoId, todo) => moverItem('destino', productoId, todo)}
              />
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-line px-5 py-5 sm:px-6">
          {error && (
            <p className="mb-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCerrar}
              disabled={guardando}
              className="flex-1 rounded-lg border border-line px-4 py-3 text-sm font-semibold text-muted transition hover:bg-surface-2 hover:text-ink active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmar}
              disabled={!ambasElegidas || cargando || guardando}
              className="flex-1 rounded-lg bg-ember px-4 py-3 text-sm font-bold text-orange-50 shadow-lg shadow-ember/25 transition hover:bg-ember-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ember"
            >
              {guardando ? 'Guardando…' : 'Confirmar cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
