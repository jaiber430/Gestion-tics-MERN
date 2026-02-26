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
            <div className="space-y-5">
                {/* Fecha de inicio y horas en grid de 3 columnas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Fecha de inicio */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Fecha de inicio <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="fechaInicio"
                            onChange={handleFechaInicioChange}
                            value={formData.fechaInicio}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                            required
                        />
                    </div>

                    {/* Hora inicio */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Hora inicio <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            name="horaInicio"
                            onChange={handleChange}
                            value={formData.horaInicio}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                            required
                        />
                    </div>

                    {/* Hora fin */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Hora fin <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            name="horaFin"
                            onChange={handleChange}
                            value={formData.horaFin}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                            required
                        />
                    </div>
                </div>

                {/* Fecha de finalización del curso (solo lectura) */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Fecha de finalización del curso
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={fechaFin || 'Selecciona días en el calendario'}
                            readOnly
                            className={`w-full px-3 py-2 border rounded-lg bg-gray-50 transition-colors ${fechaFin
                                    ? 'border-green-600 text-green-700 font-medium'
                                    : 'border-gray-200 text-gray-500'
                                }`}
                        />
                        {fechaFin && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Esta fecha se calcula automáticamente según los días seleccionados
                    </p>
                </div>
            </div>
        </>
    )
}

export default SeccionHorario
