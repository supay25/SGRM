export default function SeccionTabs({ secciones, seccionActivaId, onCambiarSeccion }) {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1.5 -mx-1 px-1 scrollbar-thin">
      {secciones.map((seccion) => {
        const activa = seccion.id === seccionActivaId
        return (
          <button
            key={seccion.id}
            type="button"
            aria-pressed={activa}
            onClick={() => onCambiarSeccion(seccion.id)}
            className={`
              flex shrink-0 items-center gap-2.5 rounded-xl border px-5 py-3 text-base font-semibold
              transition-all duration-200 ease-out
              ${
                activa
                  ? 'border-ember bg-ember text-orange-50 shadow-lg shadow-ember/25'
                  : 'border-line-strong bg-surface text-subtle hover:border-ember/50 hover:bg-surface-2 hover:text-ink'
              }
            `}
          >
            <span
              className={`
                h-3 w-3 shrink-0 rounded-full transition-shadow duration-200
                ${seccion.colores.solido}
                ${activa ? 'ring-2 ring-white/70' : 'ring-2 ring-white/15'}
              `}
            />
            {seccion.nombre}
          </button>
        )
      })}
    </div>
  )
}
