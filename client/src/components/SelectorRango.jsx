import { useEffect, useState } from 'react'
import { hoyISO } from '../utils/fechas'

// Selector de rango reutilizable: mantiene su propio borrador y solo avisa al padre
// con onAplicar(desde, hasta) cuando se presiona "Aplicar".
export default function SelectorRango({ titulo = 'Período', desde, hasta, cargando = false, onAplicar }) {
  const [desdeLocal, setDesdeLocal] = useState(desde)
  const [hastaLocal, setHastaLocal] = useState(hasta)

  // El rango aplicado puede cambiar desde afuera (por ejemplo, el default de 30 días).
  useEffect(() => {
    setDesdeLocal(desde)
    setHastaLocal(hasta)
  }, [desde, hasta])

  const hoy = hoyISO()
  const rangoInvertido = Boolean(desdeLocal && hastaLocal && desdeLocal > hastaLocal)

  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <h2 className="text-sm font-semibold text-ink tracking-tight">{titulo}</h2>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-muted">Desde</span>
          <input
            type="date"
            value={desdeLocal}
            max={hoy}
            onChange={(event) => setDesdeLocal(event.target.value)}
            style={{ accentColor: 'var(--color-ember)' }}
            className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm text-ink scheme-dark focus:outline-none focus:ring-2 focus:ring-ember/60 focus:border-transparent transition"
          />
        </label>
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-muted">Hasta</span>
          <input
            type="date"
            value={hastaLocal}
            max={hoy}
            onChange={(event) => setHastaLocal(event.target.value)}
            style={{ accentColor: 'var(--color-ember)' }}
            className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm text-ink scheme-dark focus:outline-none focus:ring-2 focus:ring-ember/60 focus:border-transparent transition"
          />
        </label>
        <button
          type="button"
          onClick={() => onAplicar(desdeLocal, hastaLocal)}
          disabled={!desdeLocal || !hastaLocal || rangoInvertido || cargando}
          className="shrink-0 rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-orange-50 shadow-md shadow-ember/20 transition hover:bg-ember-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cargando ? 'Aplicando...' : 'Aplicar'}
        </button>
      </div>

      {rangoInvertido && (
        <p className="mt-2 text-xs text-danger">La fecha "Desde" no puede ser mayor que la fecha "Hasta".</p>
      )}
    </div>
  )
}
