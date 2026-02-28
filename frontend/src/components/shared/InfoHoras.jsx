import { useSolicitud } from '../../context/SolicitudContext'

const InfoHoras = () => {
    const { horasPorDia, fechasSeleccionadas, horasTotales, horasCompletadas,
        toleranciaAlcanzada, programaFormacionSeleccionado, mensajeHorario } = useSolicitud()

    const horasRequeridas = programaFormacionSeleccionado?.horas || 0
    const horasMaximas = horasRequeridas + (horasPorDia || 0)

    const colorTotal = horasCompletadas && !toleranciaAlcanzada ? 'text-green-600'
        : toleranciaAlcanzada ? 'text-yellow-600'
            : horasTotales > horasMaximas ? 'text-red-600' : 'text-blue-600'

    const colorBarra = horasCompletadas && !toleranciaAlcanzada ? 'bg-green-500'
        : toleranciaAlcanzada ? 'bg-yellow-500'
            : horasTotales > horasMaximas ? 'bg-red-500' : 'bg-blue-500'

    const colorMensaje = horasCompletadas && !toleranciaAlcanzada ? 'bg-green-50 border-green-200 text-green-800'
        : toleranciaAlcanzada ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
            : 'bg-blue-50 border-blue-200 text-blue-800'

    const Card = ({ titulo, valor, sub, colorValor }) => (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{titulo}</p>
            <p className={`text-2xl font-bold ${colorValor || 'text-gray-800'}`}>{valor}</p>
            <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
        </div>
    )

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Jornada</p>
                    <p className="text-2xl font-bold text-gray-800">{horasPorDia || 0}</p>
                    <p className="text-xs text-gray-500 mt-0.5">horas por día</p>
                </div>
                <Card titulo="Días" valor={fechasSeleccionadas.length} sub="días seleccionados" />
                <Card titulo="Total" valor={horasTotales} sub="horas totales" colorValor={colorTotal} />
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Meta / Máx</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-gray-800">{horasRequeridas}</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-lg font-semibold text-gray-500">{horasMaximas}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">+1 día tolerancia</p>
                </div>
            </div>

            {horasRequeridas > 0 && (
                <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progreso</span>
                        <span>{Math.min(Math.round((horasTotales / horasRequeridas) * 100), 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all duration-300 ${colorBarra}`}
                            style={{ width: `${Math.min((horasTotales / horasMaximas) * 100, 100)}%` }} />
                    </div>
                </div>
            )}

            {mensajeHorario && (
                <div className={`p-3 rounded-lg border text-sm font-medium ${colorMensaje}`}>
                    {mensajeHorario}
                </div>
            )}
        </div>
    )
}

export default InfoHoras
