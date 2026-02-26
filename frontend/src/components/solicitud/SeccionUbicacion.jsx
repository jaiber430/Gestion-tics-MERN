import { useSolicitud } from '../../context/SolicitudContext'

const SeccionUbicacion = () => {
    const { formData, handleChange } = useSolicitud()

    return (
        <>
            <div className="space-y-4">
                {/* Dirección de formación (ocupa todo el ancho) */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Dirección de formación <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="direccionFormacion"
                        placeholder="Ej: Centro Industrial, Calle 50 # 25-30"
                        onChange={handleChange}
                        value={formData.direccionFormacion}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                        required
                    />
                </div>

                {/* Grid de 3 columnas para los otros campos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Subsector económico */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Subsector económico <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="subSectorEconomico"
                            placeholder="Ej: Manufactura, Servicios"
                            onChange={handleChange}
                            value={formData.subSectorEconomico}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                            required
                        />
                    </div>

                    {/* Convenio */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Convenio <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="convenio"
                            placeholder="Ej: 001-2024"
                            onChange={handleChange}
                            value={formData.convenio}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                            required
                        />
                    </div>

                    {/* Ambiente */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Ambiente <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="ambiente"
                            placeholder="Ej: Aula 101, Taller A"
                            onChange={handleChange}
                            value={formData.ambiente}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                            required
                        />
                    </div>
                </div>

                {/* Nota informativa opcional */}
                <p className="text-xs text-gray-400 flex items-center gap-1 pt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Especifique claramente el lugar donde se desarrollará la formación
                </p>
            </div>
        </>
    )
}

export default SeccionUbicacion
