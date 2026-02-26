import { useSolicitud } from '../../context/SolicitudContext'
import clienteAxios from '../../api/axios'

const SeccionDatosBasicos = () => {
    const {
        formData,
        handleChange,
        areas,
        programasFormacion,
        programasEspeciales,
        municipios,
        programaFormacionSeleccionado,
        setProgramaFormacionSeleccionado,
        setProgramaEspecialSeleccionado,
        setFechasSeleccionadas,
        setFechaFin,
        setHorasCompletadas,
        setToleranciaAlcanzada,
        setProgramasFormacion,
        setFormData,
        tipo
    } = useSolicitud()

    const handleProgramaChange = (e) => {
        const selectedId = e.target.value
        const selectedProgram = programasFormacion.find(p => p._id === selectedId)

        handleChange(e)
        setProgramaFormacionSeleccionado(selectedProgram || null)
        setFechasSeleccionadas([])
        setFechaFin('')
        setHorasCompletadas(false)
        setToleranciaAlcanzada(false)
    }

    const handleProgramaEspecialChange = (e) => {
        const selectedId = e.target.value
        const selectedProgram = programasEspeciales.find(p => p._id === selectedId)

        handleChange(e)
        setProgramaEspecialSeleccionado(selectedProgram || null)
    }

    const handleAreaChange = async (e) => {
        const areaId = e.target.value
        handleChange(e)

        if (!areaId) {
            setProgramasFormacion([])
            setProgramaFormacionSeleccionado(null)
            return
        }

        try {
            const { data } = await clienteAxios.get(`/catalogos/programas-formacion/${areaId}`)
            setProgramasFormacion(data)
            setProgramaFormacionSeleccionado(null)
            setFormData(prev => ({ ...prev, programaFormacion: '' }))
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            <div className="space-y-5">
                {/* Fila 1: Tipo Oferta y Cupo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Tipo de Oferta <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="tipoOferta"
                            onChange={handleChange}
                            value={formData.tipoOferta}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors bg-white text-gray-700"
                            required
                        >
                            <option value="">Seleccione tipo de oferta</option>
                            <option value="Abierta">Abierta</option>
                            <option value="Cerrada">Cerrada</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Cupo disponible <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="cupo"
                            placeholder="Ej: 30"
                            onChange={handleChange}
                            value={formData.cupo}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                            type="number"
                            min="1"
                            required
                        />
                    </div>
                </div>

                {/* Fila 2: Área y Programa Formación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Área <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="area"
                            onChange={handleAreaChange}
                            value={formData.area}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors bg-white text-gray-700"
                            required
                        >
                            <option value="">Seleccione un área</option>
                            {areas.map(a => (
                                <option key={a._id} value={a._id}>{a.area}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Programa de Formación <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="programaFormacion"
                            onChange={handleProgramaChange}
                            value={formData.programaFormacion}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors bg-white text-gray-700"
                            required
                        >
                            <option value="">Seleccione un programa</option>
                            {programasFormacion.map(p => (
                                <option key={p._id} value={p._id}>
                                    {p.nombrePrograma}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Detalles del Programa (si está seleccionado) */}
                {programaFormacionSeleccionado && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Detalles del programa seleccionado
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Código del Programa</label>
                                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 font-mono">
                                    {programaFormacionSeleccionado.codigoPrograma || 'No disponible'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Versión</label>
                                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">
                                    {programaFormacionSeleccionado.versionPrograma || 'No disponible'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Modalidad</label>
                                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">
                                    {programaFormacionSeleccionado.modalidad || 'PRESENCIAL'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Fila 3: Programa Especial y Municipio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Programa Especial <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="programaEspecial"
                            onChange={handleProgramaEspecialChange}
                            value={formData.programaEspecial}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors bg-white text-gray-700"
                            required
                        >
                            <option value="">Seleccione un programa especial</option>
                            {programasEspeciales.map(p => (
                                <option key={p._id} value={p._id}>
                                    {p.programaEspecial}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Municipio <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="municipio"
                            onChange={handleChange}
                            value={formData.municipio}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors bg-white text-gray-700"
                            required
                        >
                            <option value="">Seleccione un municipio</option>
                            {municipios.map(m => (
                                <option key={m._id} value={m._id}>{m.municipios}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tipo Instructor (solo para CampeSENA) */}
                {tipo === "campesena" && (
                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Tipo de Instructor <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="tipoInstructor"
                            onChange={handleChange}
                            value={formData.tipoInstructor}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors bg-white text-gray-700"
                            required
                        >
                            <option value="">Seleccione tipo de instructor</option>
                            <option value="TECNICO">Técnico</option>
                            <option value="EMPRESARIAL">Empresarial</option>
                            <option value="FULLPOPULAR">Full Popular</option>
                        </select>
                    </div>
                )}
            </div>
        </>
    )
}

export default SeccionDatosBasicos
