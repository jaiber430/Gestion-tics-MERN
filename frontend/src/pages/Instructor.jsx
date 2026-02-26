import { useAuth } from '../context/AuthContext'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'

const Instructor = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [sidebarHover, setSidebarHover] = useState(false)
    const mostrarCards = location.pathname === '/instructor'

    const menuItems = [
        // { 
        //     id: 'perfil',
        //     label: 'Perfil', 
        //     icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        //     color: 'text-blue-500'
        // },
        { 
            id: 'campesena',
            label: 'CampeSENA', 
            icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
            color: 'text-yellow-500'
        },
        { 
            id: 'regular',
            label: 'Regular', 
            icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
            color: 'text-green-500'
        },
        { 
            id: 'consultas',
            label: 'Consultas', 
            icon: 'M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'text-purple-500'
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
            
            {/* Sidebar lateral fijo que ocupa toda la altura */}
            <div 
                className="fixed left-0 top-0 h-full z-50"
                onMouseEnter={() => setSidebarHover(true)}
                onMouseLeave={() => setSidebarHover(false)}
            >
                {/* Barra lateral */}
                <div className={`
                    h-full bg-white shadow-2xl transition-all duration-300 ease-in-out
                    ${sidebarHover ? 'w-72' : 'w-20'}
                `}>
                    {/* Logo y perfil del instructor */}
                    <div className="p-4 border-b border-slate-100">
                        <div className={`
                            flex items-center gap-3
                            ${!sidebarHover && 'justify-center'}
                        `}>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                                <span className="text-white font-bold text-xl">
                                    {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
                                </span>
                            </div>
                            
                            {sidebarHover && (
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-slate-800 truncate">
                                        {user?.nombre} {user?.apellido}
                                    </h3>
                                    <p className="text-xs text-slate-500 truncate">
                                        {user?.rol}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Indicador de menú colapsado */}
                    {!sidebarHover && (
                        <div className="flex flex-col items-center py-6">
                            <div className="w-1 h-8 bg-green-500 rounded-full mb-2 animate-pulse"></div>
                            <div className="w-1 h-8 bg-green-500 rounded-full mb-2 animate-pulse delay-75"></div>
                            <div className="w-1 h-8 bg-green-500 rounded-full animate-pulse delay-150"></div>
                        </div>
                    )}

                    {/* Menú de navegación */}
                    <div className="p-4 space-y-2">
                        {sidebarHover && (
                            <div className="mb-6">
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Navegación
                                </h3>
                            </div>
                        )}
                        
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.id)}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                    ${location.pathname.includes(item.id) 
                                        ? 'bg-green-50 text-green-700' 
                                        : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}
                                    ${!sidebarHover && 'justify-center'}
                                `}
                                title={!sidebarHover ? item.label : ''}
                            >
                                <svg className={`w-5 h-5 flex-shrink-0 ${item.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                </svg>
                                {sidebarHover && (
                                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Footer del sidebar */}
                    {sidebarHover && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
                            <div className="flex items-center gap-3 text-slate-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm">
                                    {new Date().toLocaleDateString('es-ES', { 
                                        day: 'numeric', 
                                        month: 'short', 
                                        year: 'numeric' 
                                    })}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Contenido principal con margen para el sidebar */}
            <div className={`flex-1 transition-all duration-300 ${sidebarHover ? 'ml-72' : 'ml-20'}`}>
                <main className="p-8">
                    {/* SOLO mostrar las cards si estamos en /instructor */}
                    {mostrarCards && (
                        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                                {/* CampeSENA Card */}
                                <div className="group bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100">
                                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-3">
                                        CampeSENA
                                    </h2>
                                    <p className="text-slate-500 mb-6 leading-relaxed">
                                        Gestiona las solicitudes del programa CampeSENA de manera eficiente y organizada.
                                    </p>
                                    <button
                                        className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white px-8 py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-500 transition-all duration-300 shadow-lg shadow-yellow-500/25"
                                        onClick={() => navigate('campesena')}
                                    >
                                        Ingresar al módulo
                                    </button>
                                </div>

                                {/* Regular Card */}
                                <div className="group bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100">
                                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-3">
                                        Regular
                                    </h2>
                                    <p className="text-slate-500 mb-6 leading-relaxed">
                                        Administra las solicitudes del programa Regular con facilidad y seguimiento detallado.
                                    </p>
                                    <button
                                        className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-lg shadow-green-500/25"
                                        onClick={() => navigate('regular')}
                                    >
                                        Ingresar al módulo
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Aquí se renderizan las subrutas */}
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Instructor