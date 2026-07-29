const TABS = [
  { id: 'resumen', etiqueta: 'Resumen' },
  { id: 'reportes', etiqueta: 'Estadísticas' },
  { id: 'facturacion', etiqueta: 'Reportes' },
]

export default function OwnerRestauranteTabs({ tabActivo, onCambiarTab }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
      {TABS.map((tab) => {
        const activo = tab.id === tabActivo
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onCambiarTab(tab.id)}
            className={`
              shrink-0 rounded-full border px-4 py-2 text-sm font-medium
              transition-all duration-150
              ${
                activo
                  ? 'bg-surface-2 border-line text-ink shadow-sm'
                  : 'bg-transparent border-transparent text-muted hover:text-ink hover:bg-surface'
              }
            `}
          >
            {tab.etiqueta}
          </button>
        )
      })}
    </div>
  )
}
