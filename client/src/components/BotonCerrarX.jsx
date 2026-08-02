export default function BotonCerrarX({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Cerrar"
      className="shrink-0 rounded-lg p-1.5 text-muted hover:text-ink hover:bg-surface-2 transition"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
      </svg>
    </button>
  )
}
