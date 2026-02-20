// components/SelectorHorario.jsx
import React from 'react'

const SelectorHorario = ({ fechaInicio, setFechaInicio, horaInicio, horaFin, setHoraInicio, setHoraFin, setMostrarCalendario, setMaxFecha }) => {

    const handleFechaInicioChange = (e) => {
        const value = e.target.value
        setFechaInicio(value)

        const inicio = new Date(value)
        const max = new Date(inicio)
        max.setMonth(max.getMonth() + 4)
        setMaxFecha(max)
        setMostrarCalendario(true)
    }

    return (
        <>
            <input
                type="date"
                name="fechaInicio"
                onChange={handleFechaInicioChange}
                value={fechaInicio}
                className="p-2 border rounded"
                required
            />

            <input
                type="time"
                name="horaInicio"
                onChange={(e) => setHoraInicio(e.target.value)}
                value={horaInicio}
                className="p-2 border rounded"
                required
            />

            <input
                type="time"
                name="horaFin"
                onChange={(e) => setHoraFin(e.target.value)}
                value={horaFin}
                className="p-2 border rounded"
                required
            />
        </>
    )
}

export default SelectorHorario
