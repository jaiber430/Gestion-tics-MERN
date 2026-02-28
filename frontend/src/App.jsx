import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import Login from './pages/login'
import Register from './pages/Register'
import Preinscripcion from './pages/Preinscripcion'

import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Instructor from './pages/Instructor'
import Coordinador from './pages/Coordinador'

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
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path='/coordinador' element={<Coordinador />}></Route>
        </Route>

      </Routes>
    </AuthProvider>
  )
}

export default App
