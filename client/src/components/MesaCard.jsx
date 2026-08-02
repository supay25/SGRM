import { useEffect, useRef, useState } from 'react'

const ESTADO_ESTILOS = {
  LIBRE: {
    etiqueta: 'Libre',
    tarjeta: 'bg-surface border-line',
    badge: 'bg-success/10 text-success border border-success/30',
  },
  OCUPADA: {
    etiqueta: 'Ocupada',
    tarjeta: 'bg-danger/10 border-danger/30',
    badge: 'bg-danger/15 text-danger border border-danger/30',
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
        group relative cursor-pointer overflow-hidden rounded-xl border
        ${estado.tarjeta}
        hover:-translate-y-0.5 hover:border-ember/40
        transition-all duration-150
      `}
    >
      <div className={`h-1.5 w-full ${seccion?.colores.solido ?? 'bg-line'}`} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-ink tracking-tight">{mesa.nombre}</h3>

          {conAcciones && (
          <div ref={menuRef} className="relative -mr-1 -mt-1">
            <button
              type="button"
              aria-label="Opciones de la mesa"
              onClick={(event) => {
                event.stopPropagation()
                setMenuAbierto((prev) => !prev)
              }}
              className="rounded-md p-1 text-muted hover:bg-surface-2 hover:text-ink transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M10 4a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
              </svg>
            </button>

            {menuAbierto && (
              <div
                onClick={(event) => event.stopPropagation()}
                className="absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-lg border border-line bg-surface shadow-lg"
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

        <span
          className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${estado.badge}`}
        >
          {estado.etiqueta}
        </span>
      </div>
    </div>
  )
}
