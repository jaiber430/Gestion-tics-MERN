import { useCallback } from 'react'
import { useSolicitud } from '../context/SolicitudContext'

const useRegular = () => {
    const {
        handleChange,
        setMaxFecha,
        setMostrarCalendario,
        setFechasSeleccionadas,
        setFechaFin,
        setHorasCompletadas,
        setToleranciaAlcanzada,
    } = useSolicitud()

    const handleFechaInicioChange = useCallback((e) => {
        handleChange(e)
        const inicio = new Date(e.target.value)
        const max    = new Date(inicio)
        max.setMonth(max.getMonth() + 2) // Regular: 2 meses
        setMaxFecha(max)
        setMostrarCalendario(true)
        setFechasSeleccionadas([])
        setFechaFin('')
        setHorasCompletadas(false)
        setToleranciaAlcanzada(false)
    }, [handleChange, setMaxFecha, setMostrarCalendario,
        setFechasSeleccionadas, setFechaFin, setHorasCompletadas, setToleranciaAlcanzada])

    return { handleFechaInicioChange }
}

export default useRegular
