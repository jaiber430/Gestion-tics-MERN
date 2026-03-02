import { Navigate, Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const ProtectedRoute = () => {

    const { user, loading } = useAuth()

    if (loading) return <p>Cargando...</p>

    return user ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoute
