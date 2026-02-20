// hooks/useHorario.js
import { useState, useEffect } from 'react'
import { calcularDuracion, ordenarFechas, formatearFecha } from '../utils/horarioUtils'

export const useHorario = (programaSeleccionado) => {
    const [fechasSeleccionadas, setFechasSeleccionadas] = useState([])
    const [horasPorDia, setHorasPorDia] = useState(0)
    const [horasTotales, setHorasTotales] = useState(0)
    const [mensajeHorario, setMensajeHorario] = useState('')
    const [fechaFin, setFechaFin] = useState('')
    const [horasCompletadas, setHorasCompletadas] = useState(false)
    const [toleranciaAlcanzada, setToleranciaAlcanzada] = useState(false)

    const [horaInicio, setHoraInicio] = useState('')
    const [horaFin, setHoraFin] = useState('')

    // Actualizar horas por día cuando cambian las horas
    useEffect(() => {
        const duracion = calcularDuracion(horaInicio, horaFin)
        setHorasPorDia(duracion)
    }, [horaInicio, horaFin])

    // Calcular horas totales y validaciones
    useEffect(() => {
        if (!programaSeleccionado || !programaSeleccionado.horas) {
            setHorasTotales(0)
            setMensajeHorario('Selecciona un programa de formación')
            setFechaFin('')
            setHorasCompletadas(false)
            setToleranciaAlcanzada(false)
            return
        }

        const horasRequeridas = programaSeleccionado.horas
        const total = fechasSeleccionadas.length * horasPorDia
        setHorasTotales(total)

        // Calcular límites de tolerancia
        const horasMaximasPermitidas = horasRequeridas + horasPorDia

        // Calcular fecha fin
        if (fechasSeleccionadas.length > 0) {
            const fechasOrdenadas = ordenarFechas(fechasSeleccionadas)
            const ultimaFecha = fechasOrdenadas[fechasOrdenadas.length - 1]
            setFechaFin(formatearFecha(ultimaFecha))
        } else {
            setFechaFin('')
        }

        // Estados de validación
        const completadasExactas = total === horasRequeridas
        const enTolerancia = total > horasRequeridas && total <= horasMaximasPermitidas
        const excedeTolerancia = total > horasMaximasPermitidas
        const faltanHoras = total < horasRequeridas

        setHorasCompletadas(completadasExactas || enTolerancia)
        setToleranciaAlcanzada(enTolerancia)

        // Mensajes de validación
        if (fechasSeleccionadas.length === 0) {
            setMensajeHorario(`Selecciona los días. Requeridas: ${horasRequeridas}h (máx permitido: ${horasMaximasPermitidas}h)`)
        } else if (faltanHoras) {
            const faltan = horasRequeridas - total
            const diasNecesarios = Math.ceil(faltan / horasPorDia)
            setMensajeHorario(`Faltan ${faltan}h (${diasNecesarios} día${diasNecesarios !== 1 ? 's' : ''} más)`)
        } else if (completadasExactas) {
            setMensajeHorario("Horas completas exactas")
        } else if (enTolerancia) {
            const excede = total - horasRequeridas
            setMensajeHorario(`Completado con ${excede}h extra (dentro de tolerancia)`)
        } else if (excedeTolerancia) {
            const excede = total - horasRequeridas
            setMensajeHorario(`Excede por ${excede}h. Máximo permitido: ${horasMaximasPermitidas}h`)
        }
    }, [fechasSeleccionadas, horasPorDia, programaSeleccionado])

    const agregarQuitarFecha = (fechaStr, horasRequeridas) => {
        if (!horasPorDia || horasPorDia <= 0) {
            return { error: "Primero configura el horario de inicio y fin" }
        }

        if (!programaSeleccionado) {
            return { error: "Primero selecciona un programa de formación" }
        }

        const horasMaximasPermitidas = horasRequeridas + horasPorDia

        const yaSeleccionada = fechasSeleccionadas.includes(fechaStr)
        let nuevasFechas = [...fechasSeleccionadas]

        // Si quiere agregar nuevo día
        if (!yaSeleccionada) {
            const horasConNuevoDia = (nuevasFechas.length + 1) * horasPorDia

            if (horasConNuevoDia > horasMaximasPermitidas) {
                const horasActuales = nuevasFechas.length * horasPorDia
                return {
                    error: `No puedes agregar más días. Ya tienes ${horasActuales}h y el máximo permitido es ${horasMaximasPermitidas}h (${horasRequeridas}h + 1 día extra)`
                }
            }
        }

        if (yaSeleccionada) {
            nuevasFechas = nuevasFechas.filter(f => f !== fechaStr)
        } else {
            nuevasFechas.push(fechaStr)
        }

        nuevasFechas = ordenarFechas(nuevasFechas)
        setFechasSeleccionadas(nuevasFechas)

        return { success: true }
    }

    const resetFechas = () => {
        setFechasSeleccionadas([])
        setFechaFin('')
        setHorasCompletadas(false)
        setToleranciaAlcanzada(false)
    }

    return {
        fechasSeleccionadas,
        horasPorDia,
        horasTotales,
        mensajeHorario,
        fechaFin,
        horasCompletadas,
        toleranciaAlcanzada,
        horaInicio,
        horaFin,
        setHoraInicio,
        setHoraFin,
        agregarQuitarFecha,
        resetFechas
    }
}
