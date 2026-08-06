import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import OrdenMesa from './pages/OrdenMesa'
import Parametros from './pages/Parametros'
import CierreCaja from './pages/CierreCaja'
import Reportes from './pages/Reportes'
import RutaProtegida from './components/RutaProtegida'
import Dashboard from './pages/Dashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import OwnerRestaurante from './pages/OwnerRestaurante'
import OwnerComparativa from './pages/OwnerComparativa'
import OwnerConfiguracion from './pages/OwnerConfiguracion'
import AdminInicio from './pages/AdminInicio'
import AdminAgregar from './pages/AdminAgregar'
import AdminConfiguracion from './pages/AdminConfiguracion'

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
      <Route path="/home/parametros" element={
        <RutaProtegida>
          <Parametros />
        </RutaProtegida>
      } />
      <Route path="/home/cierre" element={
        <RutaProtegida>
          <CierreCaja />
        </RutaProtegida>
      } />
      <Route path="/home/reportes" element={
        <RutaProtegida>
          <Reportes />
        </RutaProtegida>
      } />
      <Route path="/Dashboard" element={
        <RutaProtegida>
          <Dashboard />
        </RutaProtegida>
      } />

      <Route path="/owner" element={
        <RutaProtegida>
          <OwnerDashboard />
        </RutaProtegida>
      } />
      <Route path="/owner/restaurantes/:id" element={
        <RutaProtegida>
          <OwnerRestaurante />
        </RutaProtegida>
      } />
      <Route path="/owner/comparativa" element={
        <RutaProtegida>
          <OwnerComparativa />
        </RutaProtegida>
      } />
      <Route path="/owner/configuracion" element={
        <RutaProtegida>
          <OwnerConfiguracion />
        </RutaProtegida>
      } />

      <Route path="/admin" element={
        <RutaProtegida rolRequerido="SUPER_ADMIN">
          <AdminInicio />
        </RutaProtegida>
      } />
      <Route path="/admin/agregar" element={
        <RutaProtegida rolRequerido="SUPER_ADMIN">
          <AdminAgregar />
        </RutaProtegida>
      } />
      <Route path="/admin/configuracion" element={
        <RutaProtegida rolRequerido="SUPER_ADMIN">
          <AdminConfiguracion />
        </RutaProtegida>
      } />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App