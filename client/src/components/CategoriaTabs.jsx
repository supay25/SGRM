import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

export default function CategoriaTabs({ categorias, categoriaActivaId, onCambiarCategoria, conteos }) {
  const contenedorRef = useRef(null)
  // Los degradados de los bordes solo se muestran si de verdad queda algo por ver.
  const [hayMasIzquierda, setHayMasIzquierda] = useState(false)
  const [hayMasDerecha, setHayMasDerecha] = useState(false)

  const actualizarBordes = useCallback(() => {
    const contenedor = contenedorRef.current
    if (!contenedor) return

    const desplazamientoMaximo = contenedor.scrollWidth - contenedor.clientWidth
    // 1px de tolerancia: con zoom/DPI fraccionario scrollLeft nunca llega exacto al tope.
    setHayMasIzquierda(contenedor.scrollLeft > 1)
    setHayMasDerecha(contenedor.scrollLeft < desplazamientoMaximo - 1)
  }, [])

  useEffect(() => {
    const contenedor = contenedorRef.current
    if (!contenedor) return

    actualizarBordes()
    // Cubre cambios de tamaño de la ventana y del propio contenedor.
    const observador = new ResizeObserver(actualizarBordes)
    observador.observe(contenedor)
    return () => observador.disconnect()
  }, [actualizarBordes, categorias])

  // Al cambiar de categoría (o al entrar a la mesa) la tab activa queda a la vista.
  useLayoutEffect(() => {
    const contenedor = contenedorRef.current
    if (!contenedor) return

    const tabActiva = contenedor.querySelector('[data-activa="true"]')
    if (!tabActiva) return

    const margen = 16
    const inicio = tabActiva.offsetLeft
    const fin = inicio + tabActiva.offsetWidth

    if (inicio < contenedor.scrollLeft) {
      contenedor.scrollTo({ left: Math.max(0, inicio - margen) })
    } else if (fin > contenedor.scrollLeft + contenedor.clientWidth) {
      contenedor.scrollTo({ left: fin - contenedor.clientWidth + margen })
    }
  }, [categoriaActivaId, categorias])

  return (
    <div className="relative -mx-1 min-w-0">
      <div
        ref={contenedorRef}
        onScroll={actualizarBordes}
        className="scrollbar-tabs flex gap-2.5 overflow-x-auto px-1 pb-1"
      >
        {categorias.map((categoria) => {
          const activa = categoria.id === categoriaActivaId
          return (
            <button
              key={categoria.id}
              type="button"
              aria-pressed={activa}
              data-activa={activa}
              onClick={() => onCambiarCategoria(categoria.id)}
              className={`
                flex min-h-12 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl border
                px-5 py-3 text-base font-semibold
                transition-all duration-200 ease-out
                ${
                  activa
                    ? 'border-ember bg-ember text-orange-50 shadow-lg shadow-ember/25'
                    : 'border-line-strong bg-surface text-subtle hover:border-ember/50 hover:bg-surface-2 hover:text-ink'
                }
              `}
            >
              {categoria.nombre}
              <span
                className={`
                  min-w-6 rounded-full px-2 py-0.5 text-sm font-bold tabular-nums
                  ${activa ? 'bg-black/25 text-orange-50' : 'bg-surface-2 text-ink'}
                `}
              >
                {conteos[categoria.id] ?? 0}
              </span>
            </button>
          )
        })}
      </div>

      {/* Pistas visuales de que la tira sigue hacia los lados */}
      <span
        aria-hidden="true"
        className={`
          pointer-events-none absolute inset-y-0 left-0 flex w-14 items-center justify-start pb-1
          bg-linear-to-r from-page via-page/85 to-transparent
          transition-opacity duration-200 ${hayMasIzquierda ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 shrink-0 text-subtle"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </span>
      <span
        aria-hidden="true"
        className={`
          pointer-events-none absolute inset-y-0 right-0 flex w-14 items-center justify-end pb-1
          bg-linear-to-l from-page via-page/85 to-transparent
          transition-opacity duration-200 ${hayMasDerecha ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 shrink-0 text-subtle"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </span>
    </div>
  )
}
