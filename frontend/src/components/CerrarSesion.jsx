import React from 'react'
import useAuth from '../hooks/useAuth'

const CerrarSesion = () => {
    const { logout } = useAuth()

    const handleLogOut = async () => {
        await logout()
    }
    return (
        <div>
            <button onClick={handleLogOut}>Cerrar Sesión</button>
        </div>
    )
}

export default CerrarSesion
