import useAvisoImpresion from '../hooks/useAvisoImpresion'

export default function BotonImprimir() {
  // La impresión térmica está pendiente: por ahora solo avisa.
  const avisarImpresionPendiente = useAvisoImpresion()

  return (
    <button
      type="button"
      onClick={avisarImpresionPendiente}
      className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-muted hover:text-ink hover:bg-surface-2 transition"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 shrink-0">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 9V4h12v5M6 18h12v-3H6v3ZM6 14H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-2"
        />
      </svg>
      Imprimir
    </button>
  )
}
