import { Routes, Route } from 'react-router-dom'

import Login from './pages/login'
import Preinscripcion from './pages/Preinscripcion'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'

function App() {
  return (
    <Routes>

      <Route path='/' element={<Login />}></Route>
      <Route path='/register' element={<Register />}></Route>
      <Route path='/dashboard' element={<Dashboard />}></Route>
      <Route path="/preinscripcion-aspirante/:id" element={<Preinscripcion />} />

    </Routes>
  )
}

export default App
