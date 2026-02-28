import { useNavigate } from 'react-router-dom'
import { SolicitudProvider, useSolicitud } from '../context/SolicitudContext'
import useSolicitudBase from '../hooks/useSolicitudBase'
import Alerta from './Alerta'
import SeccionDatosBasicos from './shared/SeccionDatosBasicos'
import SeccionHorario from './shared/SeccionHorario'
import SeccionUbicacion from './shared/SeccionUbicacion'
import SeccionEmpresa from './shared/SeccionEmpresa'
import InfoHoras from './shared/InfoHoras'
import SelectorCalendario from './shared/SelectorCalendario'

const Seccion = ({ titulo, children }) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-700 to-green-600 px-5 py-3">
            <h3 className="text-sm font-semibold text-white">{titulo}</h3>
        </div>
        <div className="p-5">{children}</div>
    </div>
)

const SolicitudCampesenaForm = () => {
    const navigate = useNavigate()
    const { handleSubmit } = useSolicitudBase()
    const { loading, alerta, horasCompletadas, toleranciaAlcanzada, formData } = useSolicitud()

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">

                {/* Título */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Nueva Solicitud CampeSENA</h2>
                            <p className="text-sm text-slate-500 mt-1">Complete todos los campos requeridos</p>
                        </div>
                        <span className="px-3 py-1 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-full">CampeSENA</span>
                    </div>
                    <div className="mt-4 h-1 w-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" />
                </div>

                {alerta?.msg && <Alerta alerta={alerta} />}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Seccion titulo="DATOS DEL PROGRAMA"><SeccionDatosBasicos /></Seccion>
                    <Seccion titulo="DISPONIBILIDAD HORARIA"><SeccionHorario /></Seccion>
                    <Seccion titulo="LUGAR DE EJECUCIÓN"><SeccionUbicacion /></Seccion>
                    {formData.tipoOferta === 'Cerrada' && (
                        <Seccion titulo="DATOS DE LA EMPRESA"><SeccionEmpresa /></Seccion>
                    )}
                    <Seccion titulo="RESUMEN DE HORAS"><InfoHoras /></Seccion>
                    <Seccion titulo="SELECCIÓN DE FECHAS"><SelectorCalendario /></Seccion>

                    <div className="flex justify-end gap-3 pb-8">
                        <button type="button" onClick={() => navigate('/instructor')}
                            className="px-6 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading || !horasCompletadas}
                            className={`px-8 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${loading || !horasCompletadas
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                    : toleranciaAlcanzada
                                        ? 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm'
                                        : 'bg-green-700 text-white hover:bg-green-800 shadow-sm'
                                }`}>
                            {loading ? (
                                <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>Procesando...</>
                            ) : !horasCompletadas ? 'Horas incompletas'
                                : toleranciaAlcanzada ? '⚠ Aprobar con tolerancia'
                                    : '✓ Crear solicitud'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const SolicitudCampesena = () => (
    <SolicitudProvider tipo="campesena">
        <SolicitudCampesenaForm />
    </SolicitudProvider>
)

export default SolicitudCampesena
