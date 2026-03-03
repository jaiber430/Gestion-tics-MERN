import React, { useState } from 'react'
import clienteAxios from '../api/axios'
import Alerta from './Alerta'

const Usuarios = ({ dataUser }) => {

    const [alerta, setAlerta] = useState({})

    const handleActivarContrato = async (idUsuario) => {
        try {
            const { data } = await clienteAxios.put(`/usuarios/activar-contrato/${idUsuario}`)
            setAlerta({
                msg: data?.msg,
                error: false
            })
            setTimeout(() => {
                setAlerta({})
                window.location.reload()
            }, 3000)
        } catch (error) {
            setAlerta({
                msg: error?.response?.data?.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000)
        }
    }

    const handleVerificar = async (idUsuario) => {
        try {
            const { data } = await clienteAxios.put(`/usuarios/verificar/${idUsuario}`)
            setAlerta({
                msg: data?.msg,
                error: false
            })
            setTimeout(() => {
                setAlerta({})
                window.location.reload()
            }, 3000)
        } catch (error) {
            setAlerta({
                msg: error?.response?.data?.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000)
        }
    }

    console.log(dataUser)

    return (

        <div className="bg-gray-50 min-h-screen p-8">

            {alerta.msg && <Alerta alerta={alerta} />}

            {dataUser?.map(user => {

                return (

                    <div key={user._id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-4 max-w-2xl mx-auto hover:shadow-lg transition-shadow relative">


                        <div className="flex items-center gap-4 mb-4">
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">
                                    {user?.nombre} {user?.apellido}
                                </h1>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {user?.numeroContrato ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500 w-32">N° Contrato:</span>
                                    <span className="text-gray-800">{user?.numeroContrato}</span>
                                </div>
                            ) : null}

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-500 w-32">Rol:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${user?.rol === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                    user?.rol === 'COORDINADOR' ? 'bg-blue-100 text-blue-700' :
                                        user?.rol === 'INSTRUCTOR' ? 'bg-green-100 text-green-700' :
                                            'bg-gray-100 text-gray-700'
                                    }`}>
                                    {user?.rol}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-500 w-32">Identificación:</span>
                                <span className="text-gray-800">{user?.numeroIdentificacion}</span>
                            </div>

                            {user?.coordinadorAsignadoNombre && user?.coordinadorAsignadoApellido ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500 w-32">Coordinador:</span>
                                    <span className="text-gray-800">
                                        {user?.coordinadorAsignadoNombre} {user?.coordinadorAsignadoApellido}
                                    </span>
                                </div>
                            ) : null}

                        </div>

                        {/* Botón dinámico en la parte inferior derecha */}
                        <div className="absolute bottom-6 right-6">
                            {user?.numeroContrato && user?.numeroContrato !== null && !user?.contratoActivo ? (
                                // Caso: TIENE número de contrato Y está inactivo
                                <button
                                    onClick={() => handleActivarContrato(user?._id)}
                                    className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
                                    Activar contrato
                                </button>
                            ) : (
                                // Caso: NO tiene contrato O tiene contrato activo O es de planta
                                <button
                                    onClick={() => handleVerificar(user?._id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
                                    Verificar
                                </button>
                            )}
                        </div>
                    </div>

                )

            })}

        </div>

    )

}

export default Usuarios
