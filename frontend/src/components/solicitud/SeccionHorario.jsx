import { useSolicitud } from '../../context/SolicitudContext'

const SeccionHorario = () => {
    const {
        formData, handleChange, setMaxFecha, setMostrarCalendario,
        fechaFin
    } = useSolicitud()

    const handleFechaInicioChange = (e) => {
        handleChange(e)
        const inicio = new Date(e.target.value)
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
                value={formData.fechaInicio}
                className="p-2 border rounded"
                required
            />

            <input
                type="time"
                name="horaInicio"
                onChange={handleChange}
                value={formData.horaInicio}
                className="p-2 border rounded"
                required
            />

            <input
                type="time"
                name="horaFin"
                onChange={handleChange}
                value={formData.horaFin}
                className="p-2 border rounded"
                required
            />

            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de finalización del curso
                </label>
                <input
                    type="text"
                    value={fechaFin || 'Selecciona días en el calendario'}
                    readOnly
                    className={`w-full p-2 border rounded bg-gray-50 ${
                        fechaFin ? 'border-green-500 text-green-700 font-semibold' : 'border-gray-300 text-gray-500'
                    }`}
                />
            </div>
        </>
    )
}

export default SeccionHorario
