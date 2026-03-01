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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
            <Header />

            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-green-600">Gestión de Aspirantes</h1>
                        <p className="text-slate-500 mt-1">Personas preinscritas en esta solicitud</p>
                    </div>
                    <div className="bg-white border border-slate-200 shadow-sm px-5 py-3 rounded-2xl flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 leading-none">Total</p>
                            <p className="text-xl font-bold text-slate-800 leading-tight">{aspirantes.length}</p>
                        </div>
                    </div>
                </div>

                {modalEliminar ? '' : alerta?.msg && <Alerta alerta={alerta} />}

                {/* Grid aspirantes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {aspirantes.map((aspirante) => (
                        <div key={aspirante._id}
                            className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all duration-300 overflow-hidden">

                            {/* Acento lateral */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-emerald-400 rounded-l-2xl" />

                            <div className="pl-3">
                                {/* Nombre y PDF */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="font-bold text-slate-800 text-base leading-tight">
                                            {aspirante.nombre} {aspirante.apellido}
                                        </h2>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {aspirante.tipoIdentificacion?.nombreTipoIdentificacion || 'Sin tipo'} • {aspirante.numeroIdentificacion}
                                        </p>
                                    </div>
                                    <button onClick={() => handleVerPDF(aspirante._id)}
                                        className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-green-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition-colors">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        PDF
                                    </button>
                                </div>

                                {/* Info */}
                                <div className="space-y-2 text-sm mb-4">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <svg className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span>{aspirante.telefono}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <svg className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="truncate">{aspirante.email}</span>
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="flex gap-2 pt-3 border-t border-slate-100">
                                    <button onClick={() => abrirModalEditar(aspirante)}
                                        className="flex-1 py-2 text-xs bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 font-medium">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Editar
                                    </button>
                                    <button onClick={() => abrirModalEliminar(aspirante)}
                                        className="flex-1 py-2 text-xs bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 font-medium">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Botones masivos */}
                <div className="mt-8 flex justify-end gap-3">
                    {solicitud.linkPreinscripcion ? (
                        <>
                            <button disabled onClick={handleMasivo}
                                className="px-5 py-2.5 bg-slate-200 text-slate-400 text-sm font-medium rounded-xl cursor-not-allowed">
                                Ver masivo
                            </button>
                            <button disabled onClick={handleVerCombinado}
                                className="px-5 py-2.5 bg-slate-200 text-slate-400 text-sm font-medium rounded-xl cursor-not-allowed">
                                Ver combinado
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleMasivo}
                                className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-medium rounded-xl shadow-md shadow-green-200 transition-all">
                                Ver masivo
                            </button>
                            <button onClick={handleVerCombinado}
                                className="px-5 py-2.5 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white text-sm font-medium rounded-xl shadow-md transition-all">
                                Ver combinado
                            </button>
                        </>
                    )}
                </div>

                {/* Vacío */}
                {aspirantes.length === 0 && (
                    <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center mt-6">
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <p className="text-slate-500 font-medium">No hay aspirantes registrados</p>
                        <p className="text-slate-400 text-sm mt-1">Los aspirantes aparecerán aquí una vez se inscriban</p>
                    </div>
                )}
            </div>

            {/* Modal Editar */}
            {modalAbierto && aspiranteSeleccionado && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar aspirante
                            </h3>
                            <button type="button" onClick={cerrarModal} className="text-white/80 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            {alerta?.msg && <Alerta alerta={alerta} />}

                            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                                {[
                                    { label: 'Nombre', name: 'nombre', type: 'text' },
                                    { label: 'Apellido', name: 'apellido', type: 'text' },
                                    { label: 'Número de documento', name: 'numeroIdentificacion', type: 'text' }
                                ].map(campo => (
                                    <div key={campo.name}>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">{campo.label}</label>
                                        <input type={campo.type} name={campo.name} value={formEditar[campo.name]} onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-blue-50 transition-all" required />
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Tipo de documento</label>
                                    <select name="tipoIdentificacion" value={formEditar.tipoIdentificacion} onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-blue-50 transition-all bg-white" required>
                                        <option value="" disabled>Seleccione tipo</option>
                                        {tiposDoc.map(tipo => (
                                            <option key={tipo._id} value={tipo._id}>{tipo.nombreTipoIdentificacion}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="submit" disabled={actualizando}
                                        className="flex-1 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium">
                                        {actualizando ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                                Guardando...
                                            </>
                                        ) : 'Guardar cambios'}
                                    </button>
                                    <button type="button" onClick={cerrarModal}
                                        className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium">
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Eliminar */}
            {modalEliminar && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Eliminar aspirante
                            </h3>
                            <button type="button" onClick={() => setModalEliminar(false)} className="text-white/80 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            {alerta?.msg && <Alerta alerta={alerta} />}
                            <p className="text-sm text-slate-500 mb-4 mt-2">Selecciona el motivo por el cual se elimina este aspirante. Se le notificará por correo.</p>

                            <select value={motivoSeleccionado} onChange={e => setMotivoSeleccionado(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50 transition-all bg-white mb-5">
                                <option value="" disabled>Selecciona un motivo</option>
                                {motivos.map((m, i) => (
                                    <option key={i} value={m}>{m}</option>
                                ))}
                            </select>

                            <div className="flex gap-3">
                                <button onClick={confirmarEliminar} disabled={eliminando}
                                    className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium">
                                    {eliminando ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                            Eliminando...
                                        </>
                                    ) : 'Confirmar eliminación'}
                                </button>
                                <button onClick={() => setModalEliminar(false)}
                                    className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default VerDetallesAspirantes
