import { useEffect, useState } from 'react'

// TODO: GET /api/owner/comparativa — [{ id, name, cantidadFacturas, totalNeto, ingresoReal }]
const COMPARATIVA_MOCK = [
  { id: 1, name: 'La Buena Mesa', cantidadFacturas: 42, totalNeto: '812450.00', ingresoReal: '731205.00' },
  { id: 2, name: 'El Fogón Costeño', cantidadFacturas: 18, totalNeto: '345900.00', ingresoReal: '311310.00' },
  { id: 3, name: 'Soda Doña Marta', cantidadFacturas: 0, totalNeto: '0.00', ingresoReal: '0.00' },
]

export default function useOwnerComparativa() {
  const [cargando, setCargando] = useState(true)
  const [restaurantes, setRestaurantes] = useState([])

  useEffect(() => {
    const cargar = async () => {
      try {
        setRestaurantes(COMPARATIVA_MOCK)
      } catch (error) {
        console.error('Error al cargar la comparativa de restaurantes:', error)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  return { cargando, restaurantes }
}
