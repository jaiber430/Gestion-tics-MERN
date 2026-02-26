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
        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">

            {mensaje && (
                <div className="col-span-2 bg-green-100 border border-green-400 text-green-700 p-3 rounded">
                    {mensaje}
                </div>
            )}

            {error && (
                <div className="col-span-2 bg-red-100 border border-red-400 text-red-700 p-3 rounded">
                    {error}
                </div>
            )}

            <SeccionDatosBasicos />
            <SeccionHorario />
            <SeccionUbicacion />
            <SeccionEmpresa />

            <div className="col-span-2">
                <InfoHoras />
            </div>

            <div className="col-span-2">
                <SelectorCalendario />
            </div>

            <button
                type="submit"
                disabled={loading || !horasCompletadas}
                className={`col-span-2 py-3 rounded text-white font-bold text-lg transition-colors ${
                    loading || !horasCompletadas
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
                }`}
            >
                {loading ? "Creando solicitud..." :
                    !horasCompletadas ? "Complete las horas requeridas" :
                    toleranciaAlcanzada ? "Crear Solicitud (con tolerancia)" :
                    "Crear Solicitud"}
            </button>
        </form>
    )
}

export default FormularioSolicitud
