import axiosClient from './axiosClient'

export const getConfigRequest = async () => {
  const response = await axiosClient.get('/restaurante/config')
  return response.data
}

export const actualizarConfigRequest = async (datos) => {
  const response = await axiosClient.patch('/restaurante/config', datos)
  return response.data
}