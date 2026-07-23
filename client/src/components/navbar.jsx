import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// TODO: cuando exista la ruta real de "Menú", agregarle su path aquí y
// reemplazar por <NavLink> de react-router-dom, derivando "activo" desde
// useLocation() en lugar del prop activeLink.
const ENLACES = [
  { id: 'home', etiqueta: 'Home', ruta: '/home' },
  { id: 'menu', etiqueta: 'Menú', ruta: null },
  { id: 'reportes', etiqueta: 'Reportes', ruta: '/home/facturas' },
  { id: 'caja', etiqueta: 'Cierre de caja', ruta: '/home/cierre' },
]

export default function Navbar({ nombreRestaurante = 'Mi Restaurante', activeLink = 'home', onLogout }) {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)
  const navigate = useNavigate()

  function handleClickEnlace(event, enlace) {
    event.preventDefault()
    if (enlace.ruta) navigate(enlace.ruta)
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ember/15 text-lg">
              🔥
            </span>
            <span className="text-base font-semibold text-ink tracking-tight">
              {nombreRestaurante}
            </span>
          </div>

          <div className="hidden md:flex md:items-center md:gap-1">
            {ENLACES.map((enlace) => (
              <a
                key={enlace.id}
                href="#"
                onClick={(event) => handleClickEnlace(event, enlace)}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    activeLink === enlace.id
                      ? 'text-ember bg-ember/10'
                      : 'text-muted hover:text-ink hover:bg-surface-2'
                  }
                `}
              >
                {enlace.etiqueta}
              </a>
            ))}
          </div>

          <div className="hidden md:flex md:items-center">
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium text-ink border border-line hover:border-danger/50 hover:text-danger transition-colors"
            >
              Cerrar sesión
            </button>
          </div>

          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setMenuMovilAbierto((prev) => !prev)}
            className="md:hidden rounded-md p-2 text-muted hover:text-ink hover:bg-surface-2 transition-colors"
          >
            {menuMovilAbierto ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {menuMovilAbierto && (
          <div className="md:hidden border-t border-line py-3 space-y-1">
            {ENLACES.map((enlace) => (
              <a
                key={enlace.id}
                href="#"
                onClick={(event) => {
                  handleClickEnlace(event, enlace)
                  setMenuMovilAbierto(false)
                }}
                className={`
                  block px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    activeLink === enlace.id
                      ? 'text-ember bg-ember/10'
                      : 'text-muted hover:text-ink hover:bg-surface-2'
                  }
                `}
              >
                {enlace.etiqueta}
              </a>
            ))}
            <button
              type="button"
              onClick={onLogout}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
