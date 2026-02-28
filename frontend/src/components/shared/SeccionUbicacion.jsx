import { useSolicitud } from '../../context/SolicitudContext'

const SeccionUbicacion = () => {
    const { formData, handleChange } = useSolicitud()

    const inputClass = "w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
    const labelClass = "block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1"

    return (
        <div className="space-y-4">
            <div>
                <label className={labelClass}>Dirección de formación <span className="text-red-500">*</span></label>
                <input name="direccionFormacion" placeholder="Ej: Centro Industrial, Calle 50 # 25-30"
                    onChange={handleChange} value={formData.direccionFormacion} className={inputClass} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className={labelClass}>Subsector económico <span className="text-red-500">*</span></label>
                    <input name="subSectorEconomico" placeholder="Ej: Manufactura"
                        onChange={handleChange} value={formData.subSectorEconomico} className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Convenio <span className="text-red-500">*</span></label>
                    <input name="convenio" placeholder="Ej: 001-2024"
                        onChange={handleChange} value={formData.convenio} className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Ambiente <span className="text-red-500">*</span></label>
                    <input name="ambiente" placeholder="Ej: Aula 101"
                        onChange={handleChange} value={formData.ambiente} className={inputClass} required />
                </div>
            </div>
        </div>
    )
}

export default SeccionUbicacion
