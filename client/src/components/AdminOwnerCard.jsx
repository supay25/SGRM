export default function AdminOwnerCard({ owner, procesando, onToggleActivo }) {
  const { name, email, isActive } = owner
  const cantidadRestaurantes = owner._count?.restaurants ?? 0

  return (
    <div
      className={`
        rounded-xl border bg-surface p-4 transition-colors sm:p-5
        ${isActive ? 'border-line hover:border-ember/40' : 'border-dashed border-line opacity-70 hover:opacity-100'}
      `}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-base font-semibold text-muted">
            {name?.charAt(0).toUpperCase() ?? '?'}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-semibold tracking-tight text-ink">{name}</h3>
              {!isActive && (
                <span className="shrink-0 rounded-full border border-danger/30 bg-danger/15 px-2.5 py-0.5 text-xs font-semibold text-danger">
                  Inactivo
                </span>
              )}
            </div>
            <p className="mt-0.5 truncate text-sm text-muted">{email}</p>
            <p className="mt-1 text-xs text-muted">
              🏪 {cantidadRestaurantes}{' '}
              {cantidadRestaurantes === 1 ? 'restaurante' : 'restaurantes'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleActivo(owner)}
          disabled={procesando}
          className={`
            w-full shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition-colors
            disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto
            ${
              isActive
                ? 'border-line text-muted hover:border-danger/50 hover:text-danger'
                : 'border-success/40 text-success hover:bg-success/10'
            }
          `}
        >
          {procesando ? 'Guardando...' : isActive ? 'Desactivar' : 'Reactivar'}
        </button>
      </div>
    </div>
  )
}
