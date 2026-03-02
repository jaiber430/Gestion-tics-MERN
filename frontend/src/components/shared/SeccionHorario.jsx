import { useSolicitud } from '../../context/SolicitudContext'
import useCampesena from '../../hooks/useCampesena'

const SeccionHorario = () => {
    const { tipo, formData, handleChange, fechaFin } = useSolicitud()
    const { handleFechaInicioChange } = useCampesena()

    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
    const labelClass = "block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1"

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className={labelClass}>Fecha de inicio <span className="text-red-500">*</span></label>
                    <input type="date" name="fechaInicio" onChange={handleFechaInicioChange}
                        value={formData.fechaInicio} className={inputClass} required />
                    <p className="text-xs text-gray-400 mt-1">
                        {tipo === 'campesena' ? 'Rango máximo 5 meses' : 'Rango máximo 2 meses'}
                    </p>
                </div>
                <div>
                    <label className={labelClass}>Hora inicio <span className="text-red-500">*</span></label>
                    <input type="time" name="horaInicio" onChange={handleChange}
                        value={formData.horaInicio} className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Hora fin <span className="text-red-500">*</span></label>
                    <input type="time" name="horaFin" onChange={handleChange}
                        value={formData.horaFin} className={inputClass} required />
                </div>
            </div>

            <div>
                <label className={labelClass}>Fecha de finalización</label>
                <div className="relative">
                    <input type="text" readOnly
                        value={fechaFin || 'Se calcula al seleccionar los días'}
                        className={`w-full px-3 py-2 border rounded-lg bg-gray-50 ${
                            fechaFin ? 'border-green-500 text-green-700 font-medium' : 'border-gray-200 text-gray-400'
                        }`} />
                    {fechaFin && (
                        <svg className="w-5 h-5 text-green-600 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SeccionHorario
