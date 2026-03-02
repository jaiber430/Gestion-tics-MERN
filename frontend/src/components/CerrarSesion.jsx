import React from 'react'
import useAuth from '../hooks/useAuth'

const CerrarSesion = () => {
    const { logout } = useAuth()

    const handleLogOut = async () => {
        await logout()
    }
    return (
        <div>
            <button onClick={handleLogOut} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión</button>
        </div>
    )
}

export default CerrarSesion
