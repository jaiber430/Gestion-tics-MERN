import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useSolicitud } from '../../context/SolicitudContext'

const SelectorCalendario = () => {
    const {
        mostrarCalendario,
        programaFormacionSeleccionado,
        formData,
        maxFecha,
        fechasSeleccionadas,
        setFechasSeleccionadas,
        setError,
        horasPorDia,
        horasCompletadas,
        toleranciaAlcanzada
    } = useSolicitud()

    const handleSeleccionDia = (date) => {
        if (!horasPorDia || horasPorDia <= 0) {
            setError("Primero configura el horario de inicio y fin")
            return
        }

        if (!programaFormacionSeleccionado) {
            setError("Primero selecciona un programa de formación")
            return
        }

        const horasRequeridas = programaFormacionSeleccionado.horas
        const horasMaximasPermitidas = horasRequeridas + horasPorDia

        const fecha = new Date(date)
        const year = fecha.getFullYear()
        const month = String(fecha.getMonth() + 1).padStart(2, '0')
        const day = String(fecha.getDate()).padStart(2, '0')
        const fechaStr = `${year}-${month}-${day}`

        const yaSeleccionada = fechasSeleccionadas.includes(fechaStr)
        let nuevasFechas = [...fechasSeleccionadas]

        if (!yaSeleccionada) {
            const horasConNuevoDia = (nuevasFechas.length + 1) * horasPorDia

            if (horasConNuevoDia > horasMaximasPermitidas) {
                const horasActuales = nuevasFechas.length * horasPorDia
                setError(`No puedes agregar más días. Ya tienes ${horasActuales}h y el máximo permitido es ${horasMaximasPermitidas}h (${horasRequeridas}h + 1 día extra)`)
                return
            }
        }

        if (yaSeleccionada) {
            nuevasFechas = nuevasFechas.filter(f => f !== fechaStr)
        } else {
            nuevasFechas.push(fechaStr)
        }

        nuevasFechas.sort((a, b) => new Date(a) - new Date(b))
        setFechasSeleccionadas(nuevasFechas)
        setError(null)
    }

    const tileClassName = ({ date, view }) => {
        if (view !== 'month') return null

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const fechaStr = `${year}-${month}-${day}`

        if (fechasSeleccionadas.includes(fechaStr)) {
            const fechasOrdenadas = [...fechasSeleccionadas].sort((a, b) => new Date(a) - new Date(b))
            const esUltima = fechaStr === fechasOrdenadas[fechasOrdenadas.length - 1]

            if (esUltima && horasCompletadas) {
                return toleranciaAlcanzada
                    ? "bg-yellow-500 text-white hover:bg-yellow-600 rounded-full font-bold border-2 border-yellow-700"
                    : "bg-green-600 text-white hover:bg-green-700 rounded-full font-bold border-2 border-green-800"
            }
            return "bg-blue-600 text-white hover:bg-blue-700 rounded-full"
        }

        if (horasCompletadas && toleranciaAlcanzada) {
            return "opacity-40 cursor-not-allowed"
        }

        return null
    }

    if (!mostrarCalendario) return null

    if (!programaFormacionSeleccionado) {
        return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-center text-yellow-800">
                Selecciona un programa de formación para poder elegir los días
            </div>
        )
    }

    return (
        <div className="mt-4">
            <h3 className="font-semibold mb-2 flex items-center justify-between">
                <span>Selecciona los días de formación:</span>
                {horasCompletadas && (
                    <span className={`text-sm px-2 py-1 rounded-full ${
                        toleranciaAlcanzada ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                        {toleranciaAlcanzada ? 'Con tolerancia' : 'Completado'}
                    </span>
                )}
            </h3>

            <Calendar
                onClickDay={handleSeleccionDia}
                minDate={new Date(formData.fechaInicio)}
                maxDate={maxFecha}
                tileClassName={tileClassName}
            />

            {fechasSeleccionadas.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="font-semibold text-blue-900 mb-2">
                        Días seleccionados ({fechasSeleccionadas.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {[...fechasSeleccionadas]
                            .sort((a, b) => new Date(a) - new Date(b))
                            .map((fecha, index, array) => {
                                const [year, month, day] = fecha.split('-')
                                const fechaObj = new Date(year, month - 1, day)
                                const esUltima = index === array.length - 1

                                return (
                                    <span
                                        key={fecha}
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            esUltima && horasCompletadas
                                                ? toleranciaAlcanzada
                                                    ? 'bg-yellow-500 text-white shadow-md'
                                                    : 'bg-green-500 text-white shadow-md'
                                                : 'bg-blue-500 text-white'
                                        }`}
                                    >
                                        {fechaObj.toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: 'short'
                                        })}
                                        {esUltima && horasCompletadas && (toleranciaAlcanzada ? ' *' : ' +')}
                                    </span>
                                )
                            })}
                    </div>
                </div>
            )}

            {horasCompletadas && (
                <div className={`mt-3 p-3 rounded text-center font-semibold ${
                    toleranciaAlcanzada
                        ? 'bg-yellow-100 border border-yellow-300 text-yellow-800'
                        : 'bg-green-100 border border-green-300 text-green-800'
                }`}>
                    {toleranciaAlcanzada
                        ? 'Tolerancia aplicada (1 día extra). No puedes agregar más días.'
                        : 'Horas completadas exactamente. No puedes agregar más días.'}
                </div>
            )}
        </div>
    )
}

export default SelectorCalendario
