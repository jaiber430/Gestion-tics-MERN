import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Instructor from './pages/Instructor'
import CrearSolicitud from './pages/CrearSolicitud'
import Coordinador from './pages/Coordinador'
import Funcionario from './pages/Funcionario'
import Administrador from './pages/Administrador'
import Curricular from './pages/Curricular'
import Register from './pages/Register'
import ConsultasInstructor from './pages/ConsultasInstructor'
import Preinscripcion from './pages/Preinscripcion'

function App() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/preinscripcion-aspirante/:id" element={<Preinscripcion />} />

      {/* RUTAS INSTRUCTOR */}
      <Route
        path="/instructor"
        element={
          <ProtectedRoute>
            <Instructor />
          </ProtectedRoute>
        }
      >
        <Route path=":tipo" element={<CrearSolicitud />} />
        <Route path="consultas" element={<ConsultasInstructor />} />
      </Route>

      {/* OTRAS RUTAS */}
      <Route
        path="/coordinador"
        element={
          <ProtectedRoute>
            <Coordinador />
          </ProtectedRoute>
        }
      />

      <Route
        path="/funcionario"
        element={
          <ProtectedRoute>
            <Funcionario />
          </ProtectedRoute>
        }
      />

      <Route
        path="/administrador"
        element={
          <ProtectedRoute>
            <Administrador />
          </ProtectedRoute>
        }
      />

      <Route
        path="/curricular"
        element={
          <ProtectedRoute>
            <Curricular />
          </ProtectedRoute>
        }
      />

    </Routes>
  )
}

export default App
