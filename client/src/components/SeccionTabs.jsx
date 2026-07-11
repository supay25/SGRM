export default function SeccionTabs({ secciones, seccionActivaId, onCambiarSeccion, conteos }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
      {secciones.map((seccion) => {
        const activa = seccion.id === seccionActivaId
        return (
          <button
            key={seccion.id}
            type="button"
            onClick={() => onCambiarSeccion(seccion.id)}
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
            <span className={`h-2 w-2 rounded-full ${seccion.colores.solido}`} />
            {seccion.nombre}
            <span
              className={`
                rounded-full px-1.5 py-0.5 text-xs font-semibold
                ${activa ? 'bg-surface text-ink' : 'bg-surface-2 text-muted'}
              `}
            >
              {conteos[seccion.id] ?? 0}
            </span>
          </button>
        )
      })}
    </div>
  )
}
