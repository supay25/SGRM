import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import ParametrosTabs from '../components/ParametrosTabs'
import DatosNegocioTab from '../components/DatosNegocioTab'
import MenuTab from '../components/MenuTab'
import SeccionesTab from '../components/SeccionesTab'
import MesasTab from '../components/MesasTab'
import ClientesTab from '../components/ClientesTab'

export default function Parametros() {
  const navigate = useNavigate()
  const [tabActivo, setTabActivo] = useState('negocio')

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('accountType')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-page">
      <Navbar nombreRestaurante="La Buena Mesa" activeLink="parametros" onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Parámetros</h1>
          <p className="mt-1 text-sm text-muted">Configuración general del restaurante.</p>
        </header>

        <div className="mt-6">
          <ParametrosTabs tabActivo={tabActivo} onCambiarTab={setTabActivo} />
        </div>

        <div className="mt-6">
          {tabActivo === 'negocio' && <DatosNegocioTab />}
          {tabActivo === 'menu' && <MenuTab />}
          {tabActivo === 'secciones' && <SeccionesTab />}
          {tabActivo === 'mesas' && <MesasTab />}
          {tabActivo === 'clientes' && <ClientesTab />}
        </div>
      </main>
    </div>
  )
}
