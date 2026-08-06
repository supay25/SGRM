import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const ENLACES = [
  { etiqueta: 'Inicio', ruta: '/admin' },
  { etiqueta: 'Agregar', ruta: '/admin/agregar' },
  { etiqueta: 'Configuración', ruta: '/admin/configuracion' },
]

function leerUsuario() {
  try {
    return JSON.parse(localStorage.getItem('user') ?? 'null')
  } catch {
    return null
  }
}

export default function AdminNavbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const navigate = useNavigate()
  const usuario = leerUsuario()

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('accountType')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // "Inicio" solo se marca activo en la ruta exacta; el resto por prefijo
  const claseEnlace = ({ isActive }) => `
    relative px-3 py-2 text-sm font-medium transition-colors
    ${isActive ? 'text-ember' : 'text-muted hover:text-ink'}
    after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full
    ${isActive ? 'after:bg-ember' : 'after:bg-transparent'}
  `

  const claseEnlaceMovil = ({ isActive }) => `
    block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
    ${isActive ? 'bg-ember/10 text-ember' : 'text-muted hover:bg-surface-2 hover:text-ink'}
  `

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ember/15 text-lg">
              🛡️
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold tracking-tight text-ink">
                Panel de administración
              </p>
              {usuario?.name && (
                <p className="truncate text-xs text-muted">{usuario.name}</p>
              )}
            </div>
          </div>

          <nav className="hidden md:flex md:items-center md:gap-1">
            {ENLACES.map((enlace) => (
              <NavLink
                key={enlace.ruta}
                to={enlace.ruta}
                end={enlace.ruta === '/admin'}
                className={claseEnlace}
              >
                {enlace.etiqueta}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:block">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-danger/50 hover:text-danger"
            >
              Cerrar sesión
            </button>
          </div>

          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto((previo) => !previo)}
            className="rounded-md p-2 text-muted transition-colors hover:bg-surface-2 hover:text-ink md:hidden"
          >
            {menuAbierto ? (
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

        {menuAbierto && (
          <div className="space-y-1 border-t border-line py-3 md:hidden">
            {ENLACES.map((enlace) => (
              <NavLink
                key={enlace.ruta}
                to={enlace.ruta}
                end={enlace.ruta === '/admin'}
                onClick={() => setMenuAbierto(false)}
                className={claseEnlaceMovil}
              >
                {enlace.etiqueta}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-danger transition-colors hover:bg-danger/10"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
