import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import Alerta from '../components/Alerta'

import useAuth from '../hooks/useAuth'

import logoSena from '../assets/logoSena.png'

const Login = () => {

    const { login } = useAuth()
    const navigation = useNavigate()

    const [numeroIdentificacion, setNumeroIdentificacion] = useState('')
    const [password, setPassword] = useState('')
    const [alerta, setAlerta] = useState({})

    const handleSubmit = async e => {
        e.preventDefault()

        try {

            const { responseAuth } = await login({ numeroIdentificacion, password })
            setAlerta({
                msg: responseAuth?.msg,
                error: false,
            })

            switch (responseAuth.rol) {
                case 'INSTRUCTOR':
                    navigation('/instructor')
                    break;
                case 'COORDINADOR':
                    navigation('/dashboard')
                    break;
                case 'FUNCIONARIO':
                    navigation('/dashboard')
                    break;
                case 'ADMINISTRADOR':
                    navigation('/dashboard')
                    break;
                case 'CURRICULAR':
                    navigation('/dashboard')
                    break;
                default:
                    navigation('/')
                    break;
            }

        } catch (error) {
            setAlerta({
                msg: error?.response?.data?.msg,
                error: true,
            })
            setTimeout(() => {
                setAlerta({})
            }, 1500)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 px-4">
            <div className="w-full max-w-md">
                {/* Card principal con efecto glassmorphism */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">

                    {/* Header con animación sutil */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto w-20 h-20 flex items-center justify-center transform hover:scale-110 transition-all duration-300">
                            <div className="relative w-16 h-16 drop-shadow-lg hover:drop-shadow-xl">
                                <img
                                    src={logoSena}
                                    alt="Logo SENA"
                                    className="w-full h-full object-contain"
                                    style={{
                                        filter: 'brightness(0) invert(0.2) sepia(1) saturate(5) hue-rotate(80deg)',
                                    }}
                                />
                            </div>
                        </div>
                        <h1 className="mt-6 text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Bienvenido al sistema Gestión y Tics
                        </h1>
                        <p className="text-sm text-slate-500 mt-2 flex items-center justify-center gap-1">
                            <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                            Ingresa tus credenciales para continuar
                            <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                        </p>
                    </div>

                    <div className="my-8">
                        {alerta.msg && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <Alerta alerta={alerta} />
                            </div>
                        )}
                    </div>

                    {/* Form con mejoras visuales */}
                    <form
                        className="space-y-5"
                        onSubmit={handleSubmit}
                    >
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Numero documento
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Número de identificación"
                                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white/50 focus:bg-white placeholder:text-slate-400 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300 shadow-sm group-hover:shadow-md"
                                    value={numeroIdentificacion}
                                    onChange={e => setNumeroIdentificacion(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Contraseña
                            </label>
                            <div className="relative group">
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white/50 focus:bg-white placeholder:text-slate-400 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300 shadow-sm group-hover:shadow-md"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Opciones adicionales con mejor diseño */}
                        <div className="flex items-center justify-between pt-2">
                            <a href="#" className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1 transition-all hover:gap-2">
                                ¿Olvidaste tu contraseña?
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>

                        {/* Botón con efecto mejorado */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:scale-[0.99] text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-green-200 hover:shadow-xl flex items-center justify-center gap-2 group"
                        >
                            <span>Ingresar</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </form><br />

                    {/* Footer con mejor diseño */}
                    <div className="text-center">
                        <p className="text-sm text-slate-600">
                            ¿No tienes cuenta?{" "}
                            <Link to="/register" className="text-green-600 font-semibold hover:text-green-700 relative group">
                                Regístrate ahora
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                            </Link>
                        </p>
                    </div>

                    {/* Elemento decorativo */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-200 rounded-full blur-3xl opacity-30 -z-10"></div>
                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-200 rounded-full blur-3xl opacity-30 -z-10"></div>
                </div>
            </div>
        </div>
    )
}

export default Login
