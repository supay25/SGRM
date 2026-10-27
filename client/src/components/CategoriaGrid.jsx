export default function CategoriaGrid({ categorias, conteos, unidadesEnBorrador, onSeleccionar }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
      {categorias.map((categoria) => {
        const cantidadProductos = conteos[categoria.id] ?? 0
        const unidades = unidadesEnBorrador?.[categoria.id] ?? 0
        // "Todas" es el atajo al catálogo completo: va destacada en ember para distinguirla del resto.
        const esTodas = categoria.id === 'todas'

        return (
          <button
            key={categoria.id}
            type="button"
            onClick={() => onSeleccionar(categoria.id)}
            aria-label={`${categoria.nombre}: ${cantidadProductos} ${cantidadProductos === 1 ? 'producto' : 'productos'}${
              unidades > 0 ? `, ${unidades} en la orden` : ''
            }`}
            className={`
              relative flex min-h-28 min-w-0 cursor-pointer flex-col justify-between rounded-2xl border-2 p-3 text-left
              sm:min-h-32 sm:p-4
              transition-all duration-200 ease-out active:scale-[0.97]
              ${
                esTodas
                  ? 'border-ember bg-ember/10 shadow-md shadow-ember/15 hover:-translate-y-0.5 hover:bg-ember/15 hover:shadow-lg hover:shadow-ember/25'
                  : 'border-line-strong bg-surface-2 shadow-md shadow-ink/8 hover:-translate-y-0.5 hover:border-ember hover:shadow-lg hover:shadow-ink/15'
              }
            `}
          >
            {/* Unidades de esta categoría que ya están en el borrador de la orden */}
            {unidades > 0 && (
              <span className="absolute -right-2.5 -top-2.5 flex h-8 min-w-8 items-center justify-center rounded-full bg-ember px-2 text-base font-bold tabular-nums text-on-ember shadow-md shadow-ember/40 ring-2 ring-page">
                {unidades}
              </span>
            )}

            <span className="wrap-break-word text-lg font-bold leading-snug tracking-tight text-ink sm:text-xl">
              {categoria.nombre}
            </span>

            <span className="mt-3 flex items-center justify-between gap-2">
              <span className="text-sm font-semibold tabular-nums text-muted sm:text-base">
                {cantidadProductos} {cantidadProductos === 1 ? 'producto' : 'productos'}
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`h-5 w-5 shrink-0 ${esTodas ? 'text-ember-light' : 'text-subtle'}`}
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
          </button>
        )
      })}
    </div>
  )
}
