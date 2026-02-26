import { useParams, useNavigate } from 'react-router-dom'
import { SolicitudProvider } from '../context/SolicitudContext'
import { useSolicitudForm } from '../hooks/useSolicitudForm'
import FormularioSolicitud from '../components/solicitud/FormularioSolicitud'

const CrearSolicitudContent = () => {
    const navigate = useNavigate()
    const { handleSubmit } = useSolicitudForm()
    const { tipo } = useParams()

    const onSubmit = async (e) => {
        const success = await handleSubmit(e)
        if (success) {
            setTimeout(() => navigate('/instructor'), 2000)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header con efecto glassmorphism */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-6 border border-white/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/instructor')}
                                className="group flex items-center gap-2 text-slate-600 hover:text-green-600 transition-all duration-300"
                            >
                                <div className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center group-hover:bg-green-50 transition-all">
                                    <svg className="w-5 h-5 group-hover:text-green-600 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </div>
                                <span className="font-medium">Volver al panel</span>
                            </button>
                        </div>

                        {/* Indicador de tipo de solicitud */}
                        <div className="flex items-center gap-3">
                            <div className={`
                        px-4 py-2 rounded-xl font-semibold text-sm
                        ${tipo === "campesena"
                                    ? 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                                    : 'bg-green-50 text-green-600 border border-green-200'}
                    `}>
                                <div className="flex items-center gap-2">
                                    {tipo === "campesena" ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    )}
                                    <span>Solicitud {tipo === "campesena" ? "CampeSENA" : "Regular"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tarjeta principal del formulario */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                    {/* Barra decorativa superior */}
                    <div className={`
                h-2 w-full
                ${tipo === "campesena"
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                            : 'bg-gradient-to-r from-green-500 to-green-600'}
            `}></div>

                    <div className="p-8">
                        {/* Título de la sección */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                                {tipo === "campesena" ? (
                                    <>
                                        <span className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                        </span>
                                        <span>Nueva Solicitud CampeSENA</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </span>
                                        <span>Nueva Solicitud Regular</span>
                                    </>
                                )}
                            </h1>
                            <p className="text-slate-500 mt-2 ml-16">
                                Complete todos los campos requeridos para crear una nueva solicitud
                            </p>
                        </div>

                        {/* Formulario */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                            <FormularioSolicitud onSubmit={onSubmit} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const CrearSolicitud = () => {
    const { tipo } = useParams()

    return (
        <SolicitudProvider tipo={tipo}>
            <CrearSolicitudContent />
        </SolicitudProvider>
    )
}

export default CrearSolicitud
