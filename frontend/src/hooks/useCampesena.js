import { useCallback } from 'react'
import { useSolicitud } from '../context/SolicitudContext'

const useCampesena = () => {
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
        max.setMonth(max.getMonth() + 5)
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

export default useCampesena
