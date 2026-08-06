// Ruta de inicio según el tipo de cuenta y el rol: se usa al iniciar sesión
// y cuando alguien intenta entrar a una ruta que no le corresponde.
export function rutaInicial(accountType, role) {
  if (accountType === 'RESTAURANT') return '/home'
  if (role === 'SUPER_ADMIN') return '/admin'
  return '/owner'
}
