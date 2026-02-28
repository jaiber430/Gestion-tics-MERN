import { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import CerrarSesion from './CerrarSesion'
import logoSena from '../assets/logoSena.png'

const Header = () => {
    const { user } = useAuth()

    // Si no hay usuario, no renderizar nada o mostrar un placeholder
    if (!user) return null

    const params = useParams()
    console.log(params)

    const [openMenu, setOpenMenu] = useState(false)

    return (
        <>
            {/* Header con efecto glassmorphism mejorado */}
            <div className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo y título con diseño mejorado */}
                        <div className="flex items-center gap-4">
                            {/* Logo con diseño más elegante */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-slate-300 rounded-xl blur-md opacity-40"></div>

                                <div className="relative w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 border border-white/60 rounded-xl flex items-center justify-center shadow-md backdrop-blur-sm transform hover:scale-105 transition-all duration-300 cursor-pointer"
                                >
                                    <img src={logoSena} alt="Logo Sena" className="w-7 h-7 object-contain" />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                                        Panel Instructor
                                    </h1>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-slate-500">Sistema de Gestión de Cursos</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span className="text-slate-400">SENA</span>
                                </div>
                            </div>
                        </div>

                        {/* Información del instructor con diseño premium */}
                        <div className="flex items-center gap-6">

                            {/* Perfil de usuario */}
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-slate-800 flex items-center gap-1 justify-end">
                                        {user.nombre} {user.apellido}
                                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </p>
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span>
                                        <span className="text-xs font-medium text-green-600">Instructor</span>
                                        <span className="text-xs text-slate-400">·</span>
                                        <span className="text-xs text-slate-500">
                                            ID: INS-{new Date().getFullYear()}
                                        </span>
                                    </div>
                                </div>

                                {/* Avatar con diseño mejorado */}
                                <div className="relative group/avatar">
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full blur-md opacity-0 group-hover/avatar:opacity-60 transition-opacity"></div>
                                    <div
                                        onClick={() => setOpenMenu(!openMenu)}
                                        className="relative w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg cursor-pointer transform hover:scale-110 transition-all duration-300"
                                    >
                                        {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                                    </div>

                                    {/* Menú rápido al hacer hover */}
                                    {openMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 transition-all duration-300">
                                            <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                                                Mi Perfil
                                            </a>
                                            <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                                                Configuración
                                            </a>
                                            <div className="border-t border-slate-100 my-1"></div>
                                            <CerrarSesion />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Barra de navegación secundaria */}
                <div className="border-t border-slate-100 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-6 h-12 text-sm">

                            <NavLink
                                to="/instructor"
                                end
                                className={({ isActive }) =>
                                    `h-full flex items-center px-1 border-b-2 transition-colors
                                    ${isActive
                                        ? "text-green-600 border-green-600 font-medium"
                                        : "text-slate-500 border-transparent hover:text-slate-700"
                                    }`
                                }
                            >
                                Dashboard
                            </NavLink>

                            {params.tipo ? (<NavLink
                                className={({ isActive }) =>
                                    `h-full flex items-center px-1 border-b-2 transition-colors
                                        ${isActive
                                        ? "text-green-600 border-green-600 font-medium"
                                        : "text-slate-500 border-transparent hover:text-slate-700"
                                    }`
                                }
                            >
                                Creación de solicitud {`${params.tipo}`}
                            </NavLink>) : ''}

                            <NavLink
                                to="/instructor/consultas-instructor"
                                className={({ isActive }) =>
                                    `h-full flex items-center px-1 border-b-2 transition-colors
                                    ${isActive
                                        ? "text-green-600 border-green-600 font-medium"
                                        : "text-slate-500 border-transparent hover:text-slate-700"
                                    }`
                                }
                            >
                                Consultar Solicitudes
                            </NavLink>

                            <NavLink
                                to="/instructor/gestion-aspirantes"
                                className={({ isActive }) =>
                                    `h-full flex items-center px-1 border-b-2 transition-colors
                                        ${isActive
                                        ? "text-green-600 border-green-600 font-medium"
                                        : "text-slate-500 border-transparent hover:text-slate-700"
                                    }`
                                }
                            >
                                Gestionar Aspirantes
                            </NavLink>

                        </div>
                    </div>
                </div>
            </div>

            {/* Agregar al archivo CSS global o al componente */}
            <style>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    animation: gradient 3s ease infinite;
                    background-size: 200% auto;
                }
            `}</style>
        </>
    )
}

export default Header
