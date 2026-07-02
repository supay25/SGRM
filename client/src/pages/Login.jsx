import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    // TODO: Aquí conectarás tu servicio de Axios
    // Ejemplo de lo que irá aquí:
    //
    // import authService from '../services/auth.service'
    //
    // try {
    //   const data = await authService.login({ email, password })
    //   // Guardar token, redirigir, etc.
    // } catch (error) {
    //   // Manejar error de credenciales inválidas
    // }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">

      {/* Tarjeta principal */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Encabezado con franja decorativa */}
        <div className="bg-linear-to-r from-amber-600 to-amber-400 px-8 py-7 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
            <span className="text-3xl">🍽️</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">SGRM</h1>
          <p className="text-amber-100 text-sm mt-1">Sistema de Gestión de Restaurante</p>
        </div>

        {/* Formulario */}
        <div className="px-8 py-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">
            Inicia sesión en tu cuenta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Campo Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                  ✉️
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@restaurante.com"
                  required
                  autoComplete="email"
                  className="
                    w-full pl-10 pr-4 py-2.5
                    border border-slate-200 rounded-lg
                    text-sm text-slate-800 placeholder-slate-400
                    bg-slate-50
                    focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
                    transition
                  "
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                  🔒
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="
                    w-full pl-10 pr-4 py-2.5
                    border border-slate-200 rounded-lg
                    text-sm text-slate-800 placeholder-slate-400
                    bg-slate-50
                    focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
                    transition
                  "
                />
              </div>
            </div>

            {/* Enlace olvidé contraseña */}
            <div className="flex justify-end">
              <a
                href="#"
                className="text-xs font-medium text-amber-600 hover:text-amber-700 transition"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              className="
                w-full py-2.5 mt-1
                bg-linear-to-r from-amber-600 to-amber-400
                hover:from-amber-700 hover:to-amber-500
                text-white font-semibold text-sm rounded-lg
                shadow-md hover:shadow-lg
                transition-all duration-200 active:scale-[0.98]
              "
            >
              Iniciar sesión
            </button>

          </form>
        </div>

        {/* Pie de tarjeta */}
        <div className="px-8 pb-6 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Acceso restringido al personal autorizado
          </span>
        </div>

      </div>
    </div>
  )
}
