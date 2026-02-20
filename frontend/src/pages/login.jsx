import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import clienteAxios from '../api/axios'

function Login() {
    const [numeroIdentificacion, setNumeroIdentificacion] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const { setUser, setLoading } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            const { data } = await clienteAxios.post('usuarios/login', {
                numeroIdentificacion,
                password
            })

            console.log("LOGIN OK:", data)
            setUser(data)
            //Mapa de rutas por rol
            const rutasPorRol = {
                INSTRUCTOR: '/instructor',
                COORDINADOR: '/coordinador',
                FUNCIONARIO: '/funcionario',
                ADMINISTRADOR: '/administrador',
                CURRICULAR: '/curricular'
            }

            const ruta = rutasPorRol[data.rol] || '/login'

            navigate(ruta)
        } catch (error) {
            setError(error.response?.data?.msg || 'Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

                <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">
                    Gestión Tics
                </h2>

                <p className="text-center text-slate-500 mb-6">
                    Inicia sesión para continuar
                </p>

                {error && (
                    <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            Número de identificación
                        </label>
                        <input
                            type="text"
                            value={numeroIdentificacion}
                            onChange={(e) => setNumeroIdentificacion(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            placeholder="Ej: 123456789"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            placeholder="********"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                    >
                        Ingresar
                    </button>

                </form>

            </div>
        </div>
    )
}

export default Login
