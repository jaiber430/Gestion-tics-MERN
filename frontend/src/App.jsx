import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import Login from './pages/login'
import Register from './pages/Register'
import Preinscripcion from './pages/Preinscripcion'
import VerDetallesAspirantes from './components/VerDetallesAspirantes'

import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Instructor from './pages/Instructor'
import CrearSolicitud from './pages/CrearSolicitud'
import ConsultasInstructor from './pages/ConsultasInstructor'
import GestionAspirantes from './pages/GestionAspirantes'
import ReportesCoordinador from './pages/ReportesCoordinador'

import Coordinador from './pages/Coordinador'
import Funcionario from './pages/Funcionario'
import ReportesFuncionario from './pages/ReportesFuncionario'
import DetallesSolicitudes from './components/DetallesSolicitudes'
function App() {
  return (
    <AuthProvider>
      <Routes>

        <Route path='/' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path="/preinscripcion-aspirante/:id" element={<Preinscripcion />} />

        <Route path='/dashboard' element={<Dashboard />}></Route>

        <Route element={<ProtectedRoute />}>
          <Route path='/instructor' element={<Instructor />}></Route>
          <Route path='/instructor/crear-solicitud/:tipo' element={<CrearSolicitud />}></Route>
          <Route path='/instructor/consultas-instructor' element={<ConsultasInstructor />}></Route>
          <Route path='/instructor/gestion-aspirantes' element={<GestionAspirantes />}></Route>
          <Route path="/instructor/ver-detalles-aspirantes/:id" element={<VerDetallesAspirantes />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path='/coordinador' element={<Coordinador />}></Route>
          <Route path='/coordinador/reportes' element={<ReportesCoordinador />}></Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path='/funcionario' element={<Funcionario />}></Route>
          <Route path='/funcionario/reportes' element={<ReportesFuncionario />}></Route>
          <Route path='/funcionario/conocer-detalles-solicitud/:id' element={<DetallesSolicitudes />}></Route>
        </Route>


      </Routes>
    </AuthProvider>
  )
}

export default App
