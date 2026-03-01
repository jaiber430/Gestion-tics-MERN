import { useParams } from "react-router-dom"
import Header from "./Header"
import { useEffect, useState } from "react"
import clienteAxios from "../api/axios"
import Alerta from "../components/Alerta"

const VerDetallesAspirantes = () => {
    const params = useParams()
    const [aspirantes, setAspirantes] = useState([])
    const [solicitud, setSolicitud] = useState([])
    const [tiposDoc, setTiposDoc] = useState([])
    const [cargando, setCargando] = useState(true)
    const [aspiranteSeleccionado, setAspiranteSeleccionado] = useState(null)
    const [modalAbierto, setModalAbierto] = useState(false)
    const [actualizando, setActualizando] = useState(false)
    const [alerta, setAlerta] = useState({})
    const [modalEliminar, setModalEliminar] = useState(false)
    const [aspiranteAEliminar, setAspiranteAEliminar] = useState(null)
    const [motivoSeleccionado, setMotivoSeleccionado] = useState('')
    const [eliminando, setEliminando] = useState(false)

    const motivos = ['Ya haz realizado este curso', 'El pdf no coincide con el numero de documento']


    const [formEditar, setFormEditar] = useState({
        nombre: "",
        apellido: "",
        tipoIdentificacion: "",
        numeroIdentificacion: ""
    })

    useEffect(() => {
        const verAspirantes = async () => {
            try {
                const [aspirantesRes, tiposRes, solicitudRes] = await Promise.all([
                    clienteAxios.get(`/aspirantes/preinscritos-aspirantes/${params.id}`),
                    clienteAxios.get('/aspirantes'),
                    clienteAxios.get(`/solicitudes/info-solicitud/${params.id}`)
                ])
                setSolicitud(solicitudRes.data)
                setAspirantes(aspirantesRes.data)
                setTiposDoc(tiposRes.data)
            } catch (err) {
                console.log(err)
            } finally {
                setCargando(false)
            }
        }
        verAspirantes()
    }, [params.id])

    const abrirModalEditar = (aspirante) => {
        setAspiranteSeleccionado(aspirante)
        setFormEditar({
            nombre: aspirante.nombre || "",
            apellido: aspirante.apellido || "",
            tipoIdentificacion: aspirante.tipoIdentificacion?._id || "",
            numeroIdentificacion: aspirante.numeroIdentificacion || ""
        })
        setAlerta({})
        setModalAbierto(true)
    }

    const cerrarModal = () => {
        setModalAbierto(false)
        setAspiranteSeleccionado(null)
        setAlerta({})
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormEditar(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setActualizando(true)

        try {
            await clienteAxios.put(`/aspirantes/actualizar/${aspiranteSeleccionado._id}`, formEditar)
            const { data } = await clienteAxios.get(`/aspirantes/preinscritos-aspirantes/${params.id}`)
            setAspirantes(data)
            cerrarModal()
            setAlerta({
                msg: data?.msg || 'Aspirante actualizado correctamente',
                error: false
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000)
        } catch (error) {
            setAlerta(error.response?.data?.msg || 'Error al actualizar el aspirante', true)
        } finally {
            setActualizando(false)
        }
    }

    const abrirModalEliminar = (aspirante) => {
        setAspiranteAEliminar(aspirante)
        setMotivoSeleccionado('')
        setModalEliminar(true)
    }

    const confirmarEliminar = async () => {
        if (!motivoSeleccionado) {
            setAlerta({
                msg: 'Selecciona un motivo',
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000)
            return
        }
        try {
            setEliminando(true)
            const { data } = await clienteAxios.delete(`/aspirantes/eliminar/${aspiranteAEliminar._id}`, {
                data: { motivo: motivoSeleccionado }  // body en DELETE
            })
            setAspirantes(aspirantes.filter(a => a._id !== aspiranteAEliminar._id))
            setModalEliminar(false)
            setAlerta({
                msg: data?.msg || 'Aspirante eliminado correctamente',
                error: false
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000)
        } catch (error) {
            setAlerta({
                msg: error.response?.data?.msg || 'Error al eliminar',
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000)
        }
    }

    const handleVerPDF = async (aspiranteId) => {
        try {
            await clienteAxios.get(`consultas/consultas-instructor/${aspiranteId}`)
            window.open(`http://localhost:4000/gestion-tics/api/consultas/consultas-instructor/${aspiranteId}`, '_blank')
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

    const handleMasivo = async () => {
        try {
            await clienteAxios.get(`consultas/revision-coordinador/${params.id}/formato-masivo`)
            window.open(`http://localhost:4000/gestion-tics/api/consultas/revision-coordinador/${params.id}/formato-masivo`, '_blank')
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

    const handleVerCombinado = async () => {
        try {
            await clienteAxios.get(`consultas/revision-coordinador/${params.id}/documento-aspirantes`)
            window.open(`http://localhost:4000/gestion-tics/api/consultas/revision-coordinador/${params.id}/documento-aspirantes`, '_blank')
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

    if (cargando) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">Aspirantes</h1>
                        <p className="text-sm text-gray-500">Gestión de personas preinscritas</p>
                    </div>
                    <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm">
                        <span className="text-sm font-medium">Total: </span>
                        <span className="text-xl font-bold">{aspirantes.length}</span>
                    </div>
                </div>

                {modalEliminar ? '' : alerta?.msg && <Alerta alerta={alerta} />}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {aspirantes.map((aspirante) => (
                        <div key={aspirante._id}
                            className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">

                            <div className="flex items-start justify-between mb-3">
                                <h2 className="font-semibold text-gray-800">
                                    {aspirante.nombre} {aspirante.apellido}
                                </h2>
                                <button onClick={() => handleVerPDF(aspirante._id)}
                                    className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    PDF
                                </button>
                            </div>

                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 w-20">Documento</span>
                                    <span className="text-gray-700 font-medium">{aspirante.numeroIdentificacion}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 w-20">Teléfono</span>
                                    <span className="text-gray-700">{aspirante.telefono}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 w-20">Correo</span>
                                    <span className="text-gray-700 truncate">{aspirante.email}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-3 border-t border-gray-100">
                                <button onClick={() => abrirModalEditar(aspirante)}
                                    className="flex-1 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Editar
                                </button>
                                <button onClick={() => abrirModalEliminar(aspirante)}
                                    className="flex-1 py-2 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {solicitud.linkPreinscripcion ? <div className="mt-6 flex justify-end gap-3">
                    <button
                        disabled
                        onClick={handleMasivo}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                        Ver masivo
                    </button>
                    <button
                        disabled
                        onClick={handleVerCombinado}
                        className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-900 transition-colors">
                        Ver combinado
                    </button>
                </div> :
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={handleMasivo}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                            Ver masivo
                        </button>
                        <button
                            onClick={handleVerCombinado}
                            className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-900 transition-colors">
                            Ver combinado
                        </button>
                    </div>}

                {aspirantes.length === 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                        <p className="text-gray-500">No hay aspirantes registrados</p>
                    </div>
                )}
            </div>

            {
                modalAbierto && aspiranteSeleccionado && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            {alerta?.msg && <Alerta alerta={alerta} />}
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Editar aspirante</h3>

                                {alerta?.msg && <Alerta alerta={alerta} />}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
                                        <input type="text" name="nombre" value={formEditar.nombre} onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-green-600" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Apellido</label>
                                        <input type="text" name="apellido" value={formEditar.apellido} onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-green-600" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Tipo de documento</label>
                                        <select name="tipoIdentificacion" value={formEditar.tipoIdentificacion} onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-green-600 bg-white" required>
                                            <option value="" disabled>Seleccione tipo</option>
                                            {tiposDoc.map(tipo => (
                                                <option key={tipo._id} value={tipo._id}>{tipo.nombreTipoIdentificacion}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Número de documento</label>
                                        <input type="text" name="numeroIdentificacion" value={formEditar.numeroIdentificacion} onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-green-600" required />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button type="submit" disabled={actualizando}
                                            className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                            {actualizando ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                    <span>Guardando...</span>
                                                </>
                                            ) : 'Guardar'}
                                        </button>
                                        <button type="button" onClick={cerrarModal}
                                            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                modalEliminar && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            {alerta?.msg && <Alerta alerta={alerta} />}
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Eliminar aspirante</h3>
                            <p className="text-sm text-gray-500 mb-4">Selecciona el motivo de eliminación</p>

                            <select value={motivoSeleccionado} onChange={e => setMotivoSeleccionado(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-red-500 mb-4">
                                <option value="" disabled>Selecciona un motivo</option>
                                {motivos.map((m, i) => (
                                    <option key={i} value={m}>{m}</option>
                                ))}
                            </select>

                            <div className="flex gap-3">
                                <button onClick={confirmarEliminar} disabled={eliminando}
                                    className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {eliminando ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            Eliminando...
                                        </>
                                    ) : 'Eliminar'}
                                </button>
                                <button onClick={() => setModalEliminar(false)}
                                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}

export default VerDetallesAspirantes
