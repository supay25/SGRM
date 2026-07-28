import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import OrdenMesa from './pages/OrdenMesa'
import Menu from './pages/Menu'
import Facturas from './pages/Facturas'
import CierreCaja from './pages/CierreCaja'
import RutaProtegida from './components/RutaProtegida'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={
        <RutaProtegida>
          <Home />
        </RutaProtegida>
      } />
      <Route path="/home/mesas/:mesaId" element={
        <RutaProtegida>
          <OrdenMesa />
        </RutaProtegida>
      } />
      <Route path="/home/menu" element={
        <RutaProtegida>
          <Menu />
        </RutaProtegida>
      } />
      <Route path="/home/facturas" element={
        <RutaProtegida>
          <Facturas />
        </RutaProtegida>
      } />
      <Route path="/home/cierre" element={
        <RutaProtegida>
          <CierreCaja />
        </RutaProtegida>
      } />
      <Route path="/Dashboard" element={
        <RutaProtegida>
          <Dashboard />
        </RutaProtegida>
      } />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App