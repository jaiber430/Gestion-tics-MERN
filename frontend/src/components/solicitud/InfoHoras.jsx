import { useSolicitud } from '../../context/SolicitudContext'

const InfoHoras = () => {
    const {
        horasPorDia,
        fechasSeleccionadas,
        horasTotales,
        horasCompletadas,
        toleranciaAlcanzada,
        programaFormacionSeleccionado,
        mensajeHorario
    } = useSolicitud()

    const getTotalColor = () => {
        if (horasCompletadas && !toleranciaAlcanzada) return 'text-green-600'
        if (toleranciaAlcanzada) return 'text-yellow-600'
        if (horasTotales > (programaFormacionSeleccionado?.horas || 0) + (horasPorDia || 0)) return 'text-red-600'
        return 'text-blue-600'
    }

    const getMensajeStyle = () => {
        if (mensajeHorario?.includes('completas')) return 'bg-green-200 text-green-800'
        if (mensajeHorario?.includes('tolerancia')) return 'bg-yellow-200 text-yellow-800'
        if (mensajeHorario?.includes('Excede')) return 'bg-red-200 text-red-800'
        return 'bg-blue-100 text-blue-800'
    }

    return (
        <div className="bg-gray-100 p-4 rounded">
            <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-white p-2 rounded shadow-sm">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Horas por día</p>
                    <p className="text-2xl font-bold text-blue-600">{horasPorDia || 0}</p>
                </div>
                <div className="bg-white p-2 rounded shadow-sm">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Días seleccionados</p>
                    <p className="text-2xl font-bold text-blue-600">{fechasSeleccionadas.length}</p>
                </div>
                <div className="bg-white p-2 rounded shadow-sm">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Total horas</p>
                    <p className={`text-2xl font-bold ${getTotalColor()}`}>
                        {horasTotales}
                    </p>
                </div>
                <div className="bg-white p-2 rounded shadow-sm">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Requeridas / Máx</p>
                    <p className="text-lg font-bold text-purple-600">
                        {programaFormacionSeleccionado?.horas || 0} / {(programaFormacionSeleccionado?.horas || 0) + (horasPorDia || 0)}
                    </p>
                    <p className="text-xs text-gray-500">(+1 día extra)</p>
                </div>
            </div>

            {programaFormacionSeleccionado && (
                <div className="mt-3 text-center">
                    <p className="text-sm text-gray-700 font-medium">
                        Programa: <span className="text-blue-800 font-bold">{programaFormacionSeleccionado.nombrePrograma}</span>
                    </p>
                </div>
            )}

            {mensajeHorario && (
                <div className={`mt-3 p-2 rounded text-center font-bold ${getMensajeStyle()}`}>
                    {mensajeHorario}
                </div>
            )}
        </div>
    )
}

export default InfoHoras
