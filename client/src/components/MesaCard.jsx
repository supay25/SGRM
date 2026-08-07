import { useEffect, useRef, useState } from 'react'

// Una mesa ocupada tiene que saltar a la vista: además del badge, la tarjeta
// entera se tiñe y lleva borde de alerta para ubicarla de un vistazo.
const ESTADO_ESTILOS = {
  LIBRE: {
    etiqueta: 'Libre',
    tarjeta: 'bg-surface-2 border-line-strong shadow-md shadow-black/25',
    badge: 'bg-success/15 text-success ring-1 ring-success/50',
    punto: 'bg-success',
    accion: 'Abrir orden',
  },
  OCUPADA: {
    etiqueta: 'Ocupada',
    tarjeta:
      'bg-surface-2 bg-linear-to-br from-danger/25 via-danger/10 to-transparent border-danger shadow-lg shadow-danger/15',
    badge: 'bg-danger text-page ring-1 ring-danger',
    punto: 'bg-page',
    accion: 'Ver orden',
  },
}

export default function MesaCard({ mesa, seccion, onAbrir, onEditar, onEliminar }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuAbierto) return

    function handleClickFuera(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbierto(false)
      }
    }

    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [menuAbierto])

  const estado = ESTADO_ESTILOS[mesa.estado]

  const conAcciones = Boolean(onEditar || onEliminar)

  return (
    <div
      onClick={() => onAbrir(mesa)}
      className={`
        group relative cursor-pointer overflow-hidden rounded-2xl border-2
        ${estado.tarjeta}
        hover:-translate-y-1 hover:border-ember hover:shadow-xl hover:shadow-black/40
        transition-all duration-200 ease-out
      `}
    >
      <div className={`h-2 w-full ${seccion?.colores.solido ?? 'bg-line-strong'}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-2xl font-bold tracking-tight text-ink">{mesa.nombre}</h3>
            {seccion?.nombre && (
              <p className="mt-1 truncate text-xs font-semibold uppercase tracking-wider text-muted">
                {seccion.nombre}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-start gap-1">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${estado.badge}`}
            >
              <span className={`h-2 w-2 rounded-full ${estado.punto}`} />
              {estado.etiqueta}
            </span>

            {conAcciones && (
              <div ref={menuRef} className="relative -mr-1">
                <button
                  type="button"
                  aria-label="Opciones de la mesa"
                  onClick={(event) => {
                    event.stopPropagation()
                    setMenuAbierto((prev) => !prev)
                  }}
                  className="rounded-md p-1 text-subtle transition-colors hover:bg-surface-3 hover:text-ink"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path d="M10 4a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                  </svg>
                </button>

                {menuAbierto && (
                  <div
                    onClick={(event) => event.stopPropagation()}
                    className="absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-lg border border-line-strong bg-surface shadow-lg"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setMenuAbierto(false)
                        onEditar(mesa)
                      }}
                      className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-surface-2"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuAbierto(false)
                        onEliminar(mesa)
                      }}
                      className="block w-full px-3 py-2 text-left text-sm text-danger hover:bg-danger/10"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
          <span
            className={`text-sm font-semibold transition-colors group-hover:text-ember-light ${
              mesa.estado === 'OCUPADA' ? 'text-ink' : 'text-subtle'
            }`}
          >
            {estado.accion}
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-subtle transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-ember-light"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  )
}
