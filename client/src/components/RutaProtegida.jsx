import { Navigate } from 'react-router-dom'
import { rutaInicial } from '../utils/rutas'

function leerUsuario() {
  try {
    return JSON.parse(localStorage.getItem('user') ?? 'null')
  } catch {
    return null
  }
}

export default function RutaProtegida({ children, rolRequerido }) {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (rolRequerido) {
    const accountType = localStorage.getItem('accountType')
    const usuario = leerUsuario()

    // Si no tiene el rol, lo mandamos al panel que sí le corresponde
    if (accountType !== 'USER' || usuario?.role !== rolRequerido) {
      return <Navigate to={rutaInicial(accountType, usuario?.role)} replace />
    }
  }

  return children
}
