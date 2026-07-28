export default function OwnerHeader({ titulo, subtitulo, onVolver, onLogout }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {onVolver && (
              <button
                type="button"
                aria-label="Volver"
                onClick={onVolver}
                className="shrink-0 rounded-lg p-2 text-muted transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-ink tracking-tight">{titulo}</p>
              {subtitulo && <p className="truncate text-xs text-muted">{subtitulo}</p>}
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="shrink-0 rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-danger/50 hover:text-danger"
          >
            <span className="hidden sm:inline">Cerrar sesión</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 sm:hidden">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m0-8H5a2 2 0 00-2 2v12a2 2 0 002 2h2" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
