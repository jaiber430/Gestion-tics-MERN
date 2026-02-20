// components/CalendarioDias.jsx
import React from 'react'
import Calendar from 'react-calendar'
import { formatearFechaCorta, ordenarFechas } from '../utils/horarioUtils'

const CalendarioDias = ({
    fechaInicio,
    maxFecha,
    fechasSeleccionadas,
    onSeleccionDia,
    horasCompletadas,
    toleranciaAlcanzada,
    programaSeleccionado,
    horasPorDia
}) => {

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const fechaStr = `${year}-${month}-${day}`

            if (fechasSeleccionadas.includes(fechaStr)) {
                const fechasOrdenadas = ordenarFechas(fechasSeleccionadas)
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
        }
        return null
    }

    if (!programaSeleccionado) {
        return (
            <div className="col-span-2 p-4 bg-yellow-50 border border-yellow-200 rounded text-center text-yellow-800">
                Selecciona un programa de formación para poder elegir los días
            </div>
        )
    }

    return (
        <div className="col-span-2 mt-4">
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
                onClickDay={onSeleccionDia}
                minDate={new Date(fechaInicio)}
                maxDate={maxFecha}
                tileClassName={tileClassName}
            />

            {fechasSeleccionadas.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="font-semibold text-blue-900 mb-2">
                        Días seleccionados ({fechasSeleccionadas.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {ordenarFechas(fechasSeleccionadas).map((fecha, index, array) => {
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
                                    {formatearFechaCorta(fecha)}
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

export default CalendarioDias
