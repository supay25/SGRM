import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ENLACES = [
  { id: 'home', etiqueta: 'Home', ruta: '/home' },
  { id: 'reportes', etiqueta: 'Reportes', ruta: '/home/reportes' },
  { id: 'caja', etiqueta: 'Cierre de caja', ruta: '/home/cierre' },
  { id: 'parametros', etiqueta: 'Parámetros', ruta: '/home/parametros' },
]

// El restaurante logueado se guarda en localStorage al iniciar sesión,
// de ahí sale el nombre real que se muestra en la barra.
function leerNombreRestaurante() {
  try {
    const usuario = JSON.parse(localStorage.getItem('user') ?? 'null')
    return usuario?.name || null
  } catch {
    return null
  }
}

export default function Navbar({ nombreRestaurante, activeLink = 'home', onLogout }) {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)
  const navigate = useNavigate()

  const nombre = nombreRestaurante ?? leerNombreRestaurante() ?? 'Mi restaurante'

  function handleClickEnlace(event, enlace) {
    event.preventDefault()
    if (enlace.ruta) navigate(enlace.ruta)
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-line-strong bg-surface/95 shadow-lg shadow-black/25 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-18 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span aria-hidden="true" className="h-8 w-1.5 shrink-0 rounded-full bg-ember" />
            <span className="truncate text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {nombre}
            </span>
          </div>

          <div className="hidden md:flex md:items-center md:gap-1.5">
            {ENLACES.map((enlace) => (
              <a
                key={enlace.id}
                href="#"
                onClick={(event) => handleClickEnlace(event, enlace)}
                className={`
                  rounded-lg px-4 py-2.5 text-base font-semibold transition-colors duration-150
                  ${
                    activeLink === enlace.id
                      ? 'bg-ember/15 text-ember-light ring-1 ring-ember/45'
                      : 'text-subtle hover:bg-surface-2 hover:text-ink'
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
              className="rounded-lg border border-line-strong px-4 py-2.5 text-base font-semibold text-subtle transition-colors hover:border-danger/60 hover:text-danger"
            >
              Cerrar sesión
            </button>
          </div>

          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={menuMovilAbierto}
            onClick={() => setMenuMovilAbierto((prev) => !prev)}
            className="rounded-lg border border-line-strong p-2 text-subtle transition-colors hover:bg-surface-2 hover:text-ink md:hidden"
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
          <div className="space-y-1.5 border-t border-line py-3 md:hidden">
            {ENLACES.map((enlace) => (
              <a
                key={enlace.id}
                href="#"
                onClick={(event) => {
                  handleClickEnlace(event, enlace)
                  setMenuMovilAbierto(false)
                }}
                className={`
                  block rounded-lg px-3 py-2.5 text-base font-semibold transition-colors
                  ${
                    activeLink === enlace.id
                      ? 'bg-ember/15 text-ember-light ring-1 ring-ember/45'
                      : 'text-subtle hover:bg-surface-2 hover:text-ink'
                  }
                `}
              >
                {enlace.etiqueta}
              </a>
            ))}
            <button
              type="button"
              onClick={onLogout}
              className="block w-full rounded-lg px-3 py-2.5 text-left text-base font-semibold text-danger transition-colors hover:bg-danger/10"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
