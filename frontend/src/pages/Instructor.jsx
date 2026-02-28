import React from 'react'
import CerrarSesion from '../components/CerrarSesion'
import useAuth from '../hooks/useAuth'

const Instructor = () => {

    const { user } = useAuth()
    console.log('Instructor: ', user?.nombre)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
            {/* Header con efecto glassmorphism */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo y título */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-lg">S</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    Panel Instructor
                                </h1>
                                <p className="text-xs text-slate-500">Sistema de Gestión</p>
                            </div>
                        </div>

                        {/* Información del instructor */}
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-slate-700">
                                    {user.nombre} {user.apellido}
                                </p>
                                <p className="text-xs text-green-600 flex items-center gap-1 justify-end">
                                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                                    Instructor
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                                {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Tarjeta de bienvenida */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">
                                ¡Bienvenido, {user.nombre}!
                            </h2>
                            <p className="text-slate-500 mt-1">
                                Selecciona el tipo de programa y la acción que deseas realizar
                            </p>
                        </div>
                    </div>
                </div>

                {/* Panel de selección */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Tarjeta de Programa Regular */}
                    <div
                        className={`bg-white rounded-3xl shadow-xl border-2 transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-2xl`}
                    >
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                        <div className="p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800">Programa Regular</h3>
                                    <p className="text-sm text-slate-500">Gestión de programas estándar</p>
                                </div>
                            </div>

                            <p className="text-slate-600 mb-8">
                                Accede a la gestión de programas regulares del SENA. Podrás crear y consultar información de cursos, horarios y aprendices.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    className={`py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Crear
                                </button>
                                <button
                                    className={`py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 `}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Consultar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta de Programa CampeSENA */}
                    <div
                        className={`bg-white rounded-3xl shadow-xl border-2 transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-2xl `}
                    >
                        <div className="h-2 bg-gradient-to-r from-green-600 to-emerald-500"></div>
                        <div className="p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800">Programa CampeSENA</h3>
                                    <p className="text-sm text-slate-500">Gestión de programas rurales</p>
                                </div>
                            </div>

                            <p className="text-slate-600 mb-8">
                                Accede a la gestión de programas CampeSENA. Podrás crear y consultar información de programas especiales para el sector rural.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    className={`py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Crear
                                </button>
                                <button
                                    className={`py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Consultar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl border border-green-200 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-sm text-slate-600">
                            </p>
                        </div>
                        <button
                            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2`}
                        >
                            <span>Continuar</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Elementos decorativos de fondo */}
            <div className="fixed -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-20 -z-10"></div>
            <div className="fixed -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-20 -z-10"></div>
        </div>

    )
}

export default Instructor
