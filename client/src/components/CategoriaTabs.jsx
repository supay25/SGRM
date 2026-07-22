export default function CategoriaTabs({ categorias, categoriaActivaId, onCambiarCategoria, conteos }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
      {categorias.map((categoria) => {
        const activa = categoria.id === categoriaActivaId
        return (
          <button
            key={categoria.id}
            type="button"
            onClick={() => onCambiarCategoria(categoria.id)}
            className={`
              flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium
              transition-all duration-150
              ${
                activa
                  ? 'bg-surface-2 border-line text-ink shadow-sm'
                  : 'bg-transparent border-transparent text-muted hover:text-ink hover:bg-surface'
              }
            `}
          >
            {categoria.nombre}
            <span
              className={`
                rounded-full px-1.5 py-0.5 text-xs font-semibold
                ${activa ? 'bg-surface text-ink' : 'bg-surface-2 text-muted'}
              `}
            >
              {conteos[categoria.id] ?? 0}
            </span>
          </button>
        )
      })}
    </div>
  )
}
