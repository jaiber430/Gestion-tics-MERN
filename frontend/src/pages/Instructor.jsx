import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import Header from '../components/Header'

const Instructor = () => {

    const { user, navigate } = useAuth()

    const [diasMes, setDiasMes] = useState(false)

    const manejarClick = (tipo) => {
        const diaActual = new Date().getDate()

        if (diaActual > 30) {
            setDiasMes(true)

            setTimeout(() => {
                setDiasMes(false)
            }, 4000)

            return
        }

        navigate(`/instructor/crear-solicitud/${tipo}`)

    }

    console.log('Instructor: ', user?.nombre)

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Tarjeta de bienvenida */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-12 border border-slate-100">
                    <h1 className="mt-6 text-2xl font-bold text-slate-800">
                        Sistema de Gestión Académica
                    </h1>

                    <p className="text-sm text-slate-500 mt-2">
                        Plataforma oficial para la creación y administración de solicitudes formativas.
                    </p>

                    <div
                        className={`mt-4 text-xs px-4 py-2 rounded-lg border transition-all duration-300
                        ${diasMes
                                ? "bg-red-50 border-red-300 text-red-700"
                                : "bg-slate-50 border-slate-200 text-slate-600"
                            }`}
                    >
                        {diasMes
                            ? "El periodo de creación de solicitudes se encuentra cerrado. Solo está habilitado durante los primeros 15 días de cada mes."
                            : "La creación de solicitudes está habilitada únicamente durante los primeros 15 días calendario de cada mes."
                        }
                    </div>
                </div>

                {/* Panel de selección */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Programa Regular */}
                    <div className="bg-white rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                        <div className="h-32 bg-amber-500 rounded-t-2xl flex items-center px-6">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-xl font-semibold text-white">Programa Regular</h3>
                                <p className="text-amber-100 text-sm">Formación académica estándar</p>
                            </div>
                        </div>

                        <div className="p-8">
                            <p className="text-slate-600 mb-8 text-sm leading-relaxed">
                                Gestiona programas de formación con control sobre cursos,
                                instructores y planificación académica institucional.
                            </p>

                            <button
                                onClick={() => manejarClick('regular')}
                                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors duration-300">
                                Crear Solicitud Regular
                            </button>
                        </div>
                    </div>

                    {/* Programa CampeSENA */}
                    <div className="bg-white rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                        <div className="h-32 bg-green-600 rounded-t-2xl flex items-center px-6">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M12 21V10m0 0c-1.5-2-3-3-5-3 1 3 2.5 4.5 5 5m0-2c1.5-2 3-3 5-3-1 3-2.5 4.5-5 5" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-xl font-semibold text-white">Programa CampeSENA</h3>
                                <p className="text-green-100 text-sm">Programas de desarrollo rural</p>
                            </div>
                        </div>

                        <div className="p-8">
                            <p className="text-slate-600 mb-8 text-sm leading-relaxed">
                                Administra programas orientados al fortalecimiento rural y
                                desarrollo productivo en territorios agrícolas.
                            </p>

                            <button
                                onClick={() => manejarClick('campesena')}
                                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300">
                                Crear Solicitud CampeSENA
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Instructor
