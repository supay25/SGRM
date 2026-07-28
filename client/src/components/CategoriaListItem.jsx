export default function CategoriaListItem({ categoria, activa, onSeleccionar, onEditar, onEliminar }) {
  return (
    <div
      className={`
        group flex items-center gap-1 rounded-lg border pr-1.5
        transition-colors
        ${activa ? 'border-ember/40 bg-ember/10' : 'border-transparent hover:bg-surface-2'}
      `}
    >
      <button
        type="button"
        onClick={onSeleccionar}
        className={`
          min-w-0 flex-1 truncate px-4 py-3 text-left text-sm font-semibold transition-colors
          ${activa ? 'text-ember' : 'text-muted group-hover:text-ink'}
        `}
      >
        {categoria.nombre}
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onEditar()
        }}
        aria-label={`Editar ${categoria.nombre}`}
        className="shrink-0 rounded-md p-2 text-muted transition-colors hover:bg-surface-2 hover:text-ink"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793 3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onEliminar()
        }}
        aria-label={`Eliminar ${categoria.nombre}`}
        className="shrink-0 rounded-md p-2 text-muted transition-colors hover:bg-danger/10 hover:text-danger"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path
            fillRule="evenodd"
            d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482 41.028 41.028 0 00-2.365-.298V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}
