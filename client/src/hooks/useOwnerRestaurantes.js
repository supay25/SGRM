import { useEffect, useState } from 'react'
import {getMisRestaurantesRequest} from '../api/owner.api.js'


export default function useOwnerRestaurantes() {
  const [cargando, setCargando] = useState(true)
  const [restaurantes, setRestaurantes] = useState([])

  useEffect(() => {
    const cargar = async () => {
      try {
        
        const misRestData = await getMisRestaurantesRequest()
        setRestaurantes(misRestData)
      } catch (error) {
        console.error('Error al cargar los restaurantes del owner:', error)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  return { cargando, restaurantes}
}
