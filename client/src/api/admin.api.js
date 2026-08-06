import axiosClient from './axiosClient'

// ── OWNERS ──
export const getOwnersRequest = async () => {
  const response = await axiosClient.get('/admin/owners')
  return response.data
}

export const crearOwnerRequest = async (datos) => {
  const response = await axiosClient.post('/admin/owners', datos)
  return response.data
}

export const toggleOwnerActivoRequest = async (id) => {
  const response = await axiosClient.patch(`/admin/owners/${id}/activo`)
  return response.data
}

// ── RESTAURANTES ──
export const getRestaurantesAdminRequest = async () => {
  const response = await axiosClient.get('/admin/restaurantes')
  return response.data
}

export const crearRestauranteRequest = async (datos) => {
  const response = await axiosClient.post('/admin/restaurantes', datos)
  return response.data
}

export const toggleRestauranteActivoRequest = async (id) => {
  const response = await axiosClient.patch(`/admin/restaurantes/${id}/activo`)
  return response.data
}

export const editarPerfilAdminRequest = async (nombre) => {
  const response = await axiosClient.patch('/admin/perfil', { nombre })
  return response.data
}

export const cambiarPasswordAdminRequest = async (passwordActual, passwordNueva) => {
  const response = await axiosClient.patch('/admin/password', { passwordActual, passwordNueva })
  return response.data
}