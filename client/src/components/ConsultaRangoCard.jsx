import { useState } from 'react'
import ModalReporteRango from './ModalReporteRango'

export default function ConsultaRangoCard({ titulo, onConsultar, children }) {
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [cargando, setCargando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)

  async function handleConsultar() {
    if (!desde || !hasta) return
    setCargando(true)
    try {
      const data = await onConsultar(desde, hasta)
      setResultado(data)
      setModalAbierto(true)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <h2 className="text-sm font-semibold text-ink tracking-tight">{titulo}</h2>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-muted">Desde</span>
          <input
            type="date"
            value={desde}
            onChange={(event) => setDesde(event.target.value)}
            style={{ accentColor: 'var(--color-ember)' }}
            className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm text-ink scheme-dark focus:outline-none focus:ring-2 focus:ring-ember/60 focus:border-transparent transition"
          />
        </label>
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-muted">Hasta</span>
          <input
            type="date"
            value={hasta}
            onChange={(event) => setHasta(event.target.value)}
            style={{ accentColor: 'var(--color-ember)' }}
            className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm text-ink scheme-dark focus:outline-none focus:ring-2 focus:ring-ember/60 focus:border-transparent transition"
          />
        </label>
        <button
          type="button"
          onClick={handleConsultar}
          disabled={!desde || !hasta || cargando}
          className="shrink-0 rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-orange-50 shadow-md shadow-ember/20 transition hover:bg-ember-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cargando ? 'Consultando...' : 'Consultar'}
        </button>
      </div>

      {modalAbierto && (
        <ModalReporteRango titulo={titulo} desde={desde} hasta={hasta} onCerrar={() => setModalAbierto(false)}>
          {children(resultado)}
        </ModalReporteRango>
      )}
    </div>
  )
}
