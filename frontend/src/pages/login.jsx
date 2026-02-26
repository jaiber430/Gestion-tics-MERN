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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 via-green-600 to-green-500 relative overflow-hidden">
            
            {/* Patrón de fondo con logo del SENA */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-64 h-64 border-8 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 border-8 border-white rounded-full translate-x-1/3 translate-y-1/3"></div>
                <div className="absolute top-1/2 left-1/2 w-48 h-48 border-4 border-white rounded-full"></div>
            </div>

            {/* Tarjeta principal con efecto vidrio */}
            <div className="relative w-full max-w-md">
                {/* Logo del SENA */}
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-white rounded-2xl shadow-xl mb-4">
                        <svg className="w-16 h-16 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 2.5L19.5 9 12 13.5 4.5 9 12 4.5zM4 15.5v-5l6 3v5l-6-3zm10 3v-5l6-3v5l-6 3z"/>
                        </svg>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        SENA
                    </h1>
                    <p className="text-green-100 font-medium">
                        Sistema de Gestión
                    </p>
                </div>

                {/* Tarjeta de login con efecto glassmorphism */}
                <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Bienvenido
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Ingresa tus credenciales para acceder al sistema
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700">
                                Número de identificación
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={numeroIdentificacion}
                                    onChange={(e) => setNumeroIdentificacion(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-gray-50"
                                    placeholder="Tu número de identificación"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-gray-50"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-600">
                                <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                Recordarme
                            </label>
                            <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Iniciar sesión
                        </button>

                    </form>

                    {/* Footer con información institucional */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-center text-xs text-gray-400">
                            Servicio Nacional de Aprendizaje - SENA
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login