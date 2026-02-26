import { useSolicitud } from '../../context/SolicitudContext'
import SeccionDatosBasicos from './SeccionDatosBasicos'
import SeccionHorario from './SeccionHorario'
import SeccionUbicacion from './SeccionUbicacion'
import SeccionEmpresa from './SeccionEmpresa'
import SelectorCalendario from './SelectorCalendario'
import InfoHoras from './InfoHoras'

const FormularioSolicitud = ({ onSubmit }) => {
    const { loading, horasCompletadas, toleranciaAlcanzada, mensaje, error } = useSolicitud()

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            {/* Mensajes de notificación - Estilo más elegante */}
            {mensaje && (
                <div className="bg-green-50 border-l-4 border-green-600 text-green-800 p-4 rounded-r-lg flex items-start gap-3 shadow-sm">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">{mensaje}</span>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border-l-4 border-red-600 text-red-800 p-4 rounded-r-lg flex items-start gap-3 shadow-sm">
                    <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-500 px-5 py-3">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        DATOS DEL PROGRAMA
                    </h3>
                </div>
                <div className="p-5">
                    <SeccionDatosBasicos />
                </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-500 px-5 py-3">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        DISPONIBILIDAD HORARIA
                    </h3>
                </div>
                <div className="p-5">
                    <SeccionHorario />
                </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-500 px-5 py-3">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        LUGAR DE EJECUCIÓN
                    </h3>
                </div>
                <div className="p-5">
                    <SeccionUbicacion />
                </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-500 px-5 py-3">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        DATOS DE LA EMPRESA
                    </h3>
                </div>
                <div className="p-5">
                    <SeccionEmpresa />
                </div>
            </div>
            {/* Resumen de Horas - Sección destacada */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-500 px-5 py-3">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        RESUMEN DE HORAS
                    </h3>
                </div>
                <div className="p-5">
                    <InfoHoras />
                </div>
            </div>

            {/* Calendario - Sección independiente */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-green-700 to-green-600 px-5 py-3">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        SELECCIÓN DE FECHAS
                    </h3>
                </div>
                <div className="p-5">
                    <SelectorCalendario />
                </div>
            </div>

            {/* Barra de acciones */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={() => navigate('/instructor')}
                    className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={loading || !horasCompletadas}
                    className={`
                w-full sm:w-auto px-8 py-2.5 rounded-lg text-sm font-medium transition-all
                flex items-center justify-center gap-2
                ${loading || !horasCompletadas
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                            : toleranciaAlcanzada
                                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-700 hover:to-amber-600 shadow-sm hover:shadow'
                                : 'bg-gradient-to-r from-green-700 to-green-600 text-white hover:from-green-800 hover:to-green-700 shadow-sm hover:shadow'
                        }
            `}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Procesando...</span>
                        </>
                    ) : !horasCompletadas ? (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Horas incompletas</span>
                        </>
                    ) : toleranciaAlcanzada ? (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Aprobar con tolerancia</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Crear solicitud</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}

export default FormularioSolicitud
