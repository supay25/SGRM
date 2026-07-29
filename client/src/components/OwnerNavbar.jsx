import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const ENLACES = [
  { id: 'restaurantes', etiqueta: 'Mis restaurantes', ruta: '/owner' },
  { id: 'comparativa', etiqueta: 'Comparativa', ruta: '/owner/comparativa' },
  { id: 'configuracion', etiqueta: 'Configuración', ruta: '/owner/configuracion' },
]

export default function OwnerNavbar() {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('accountType')
    localStorage.removeItem('user')
    navigate('/login')
  }

  function handleClickEnlace(enlace) {
    setMenuMovilAbierto(false)
    navigate(enlace.ruta)
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ember/15 text-lg">
              🏪
            </span>
            <span className="text-base font-semibold text-ink tracking-tight">Panel del dueño</span>
          </div>

          <div className="hidden md:flex md:items-center md:gap-1">
            {ENLACES.map((enlace) => (
              <button
                key={enlace.id}
                type="button"
                onClick={() => handleClickEnlace(enlace)}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    pathname === enlace.ruta
                      ? 'text-ember bg-ember/10'
                      : 'text-muted hover:text-ink hover:bg-surface-2'
                  }
                `}
              >
                {enlace.etiqueta}
              </button>
            ))}
          </div>

          <div className="hidden md:flex md:items-center">
            <button
              type="button"
              onClick={handleLogout}
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
              <button
                key={enlace.id}
                type="button"
                onClick={() => handleClickEnlace(enlace)}
                className={`
                  block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    pathname === enlace.ruta
                      ? 'text-ember bg-ember/10'
                      : 'text-muted hover:text-ink hover:bg-surface-2'
                  }
                `}
              >
                {enlace.etiqueta}
              </button>
            ))}
            <button
              type="button"
              onClick={handleLogout}
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
