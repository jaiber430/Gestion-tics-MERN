import { createContext, useState, useEffect } from "react";
import clienteAxios from "../api/axios";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const verificarUsuario = async () => {
            try {
                const { data } = await clienteAxios.get("/usuarios/perfil")
                setUser(data)
            } catch (error) {
                console.log(error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        verificarUsuario()
    }, [])

    const login = async (datos) => {
        const { data } = await clienteAxios.post('/usuarios/login', datos)

        setUser(data)

        return ({ responseAuth: data })
    }

    const logout = async () => {
        await clienteAxios.post("/usuarios/logout", {})
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
