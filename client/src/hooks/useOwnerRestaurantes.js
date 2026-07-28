import { useEffect, useState } from 'react'

// TODO: GET /api/owner/restaurantes — [{ id, name, address, isActive }]
// TODO: GET /api/owner/restaurantes/:id/resumen — { cantidad, totalNeto, totalServicio, ingresoReal } (uno por card, en paralelo)
const RESTAURANTES_MOCK = [
  { id: 1, name: 'La Buena Mesa', address: 'San Pedro, San José', isActive: true },
  { id: 2, name: 'El Fogón Costeño', address: 'Liberia, Guanacaste', isActive: true },
  { id: 3, name: 'Soda Doña Marta', address: 'Cartago Centro', isActive: false },
]

const RESUMEN_HOY_MOCK = {
  1: { cantidad: 42, totalNeto: '812450.00', totalServicio: '81245.00', ingresoReal: '731205.00' },
  2: { cantidad: 18, totalNeto: '345900.00', totalServicio: '34590.00', ingresoReal: '311310.00' },
  3: { cantidad: 0, totalNeto: '0.00', totalServicio: '0.00', ingresoReal: '0.00' },
}

export default function useOwnerRestaurantes() {
  const [cargando, setCargando] = useState(true)
  const [restaurantes, setRestaurantes] = useState([])

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = RESTAURANTES_MOCK.map((restaurante) => ({
          ...restaurante,
          resumenHoy: RESUMEN_HOY_MOCK[restaurante.id],
        }))
        setRestaurantes(data)
      } catch (error) {
        console.error('Error al cargar los restaurantes del owner:', error)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  return { cargando, restaurantes }
}
