import { useAuth } from '../context/AuthContext'
import { useNavigate, Outlet } from 'react-router-dom'

const Instructor = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">

            {/* Header */}
            <header className="bg-slate-900 text-white p-6 shadow-md">
                <h1 className="text-2xl font-semibold">
                    Bienvenido {user?.nombre} {user?.apellido}
                </h1>
                <p className="text-sm text-slate-300 mt-1">
                    Panel de Instructor
                </p>
            </header>

            {/* Contenido */}
            <main className="flex-1 p-6">

                {/* SOLO mostrar las cards si estamos en /instructor */}
                {window.location.pathname === '/instructor' && (
                    <div className="flex items-center justify-center h-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">

                            {/* CampeSENA */}
                            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition">
                                <h2 className="text-xl font-bold text-slate-800 mb-4">
                                    CampeSENA
                                </h2>

                                <p className="text-slate-500 mb-6">
                                    Gestionar solicitudes del programa CampeSENA.
                                </p>

                                <button
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                                    onClick={() => navigate('campesena')}
                                >
                                    Ingresar
                                </button>
                            </div>

                            {/* Regular */}
                            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition">
                                <h2 className="text-xl font-bold text-slate-800 mb-4">
                                    Regular
                                </h2>

                                <p className="text-slate-500 mb-6">
                                    Gestionar solicitudes del programa Regular.
                                </p>

                                <button
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                                    onClick={() => navigate('regular')}
                                >
                                    Ingresar
                                </button>
                            </div>

                        </div>
                    </div>
                )}

                {/* Aquí se renderiza CrearSolicitud */}
                <Outlet />

            </main>
        </div>
    )
}

export default Instructor
