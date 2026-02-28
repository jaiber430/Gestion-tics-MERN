import { useSolicitud } from '../../context/SolicitudContext'
import clienteAxios from '../../api/axios'

const SeccionDatosBasicos = () => {
    const {
        tipo, formData, setFormData, handleChange, resetEmpresa,
        areas, programasFormacion, programasEspeciales, municipios,
        programaFormacionSeleccionado,
        setProgramaFormacionSeleccionado, setProgramaEspecialSeleccionado,
        setProgramasFormacion, setFechasSeleccionadas, setFechaFin,
        setHorasCompletadas, setToleranciaAlcanzada, mostrarAlerta
    } = useSolicitud()

    const inputClass = "w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors bg-white"
    const labelClass = "block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1"

    const handleAreaChange = async (e) => {
        handleChange(e)
        const areaId = e.target.value
        if (!areaId) { setProgramasFormacion([]); setProgramaFormacionSeleccionado(null); return }
        try {
            const { data } = await clienteAxios.get(`/catalogos/programas-formacion/${areaId}`)
            setProgramasFormacion(data)
            setProgramaFormacionSeleccionado(null)
            setFormData(prev => ({ ...prev, programaFormacion: '' }))
        } catch { mostrarAlerta('Error al cargar programas de formación', true) }
    }

    const handleProgramaChange = (e) => {
        handleChange(e)
        const prog = programasFormacion.find(p => p._id === e.target.value)
        setProgramaFormacionSeleccionado(prog || null)
        setFechasSeleccionadas([])
        setFechaFin('')
        setHorasCompletadas(false)
        setToleranciaAlcanzada(false)
    }

    const handleProgramaEspecialChange = (e) => {
        handleChange(e)
        const prog = programasEspeciales.find(p => p._id === e.target.value)
        setProgramaEspecialSeleccionado(prog || null)
    }

    const handleTipoOfertaChange = (e) => {
        handleChange(e)
        if (e.target.value === 'Abierta') resetEmpresa()
    }

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Tipo de Oferta <span className="text-red-500">*</span></label>
                    <select name="tipoOferta" onChange={handleTipoOfertaChange} value={formData.tipoOferta} className={inputClass} required>
                        <option value="">Seleccione tipo de oferta</option>
                        <option value="Abierta">Abierta</option>
                        <option value="Cerrada">Cerrada</option>
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Cupo disponible <span className="text-red-500">*</span></label>
                    <input name="cupo" type="number" min="1" placeholder="Ej: 30"
                        onChange={handleChange} value={formData.cupo} className={inputClass} required />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Área <span className="text-red-500">*</span></label>
                    <select name="area" onChange={handleAreaChange} value={formData.area} className={inputClass} required>
                        <option value="">Seleccione un área</option>
                        {areas.map(a => <option key={a._id} value={a._id}>{a.area}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Programa de Formación <span className="text-red-500">*</span></label>
                    <select name="programaFormacion" onChange={handleProgramaChange} value={formData.programaFormacion}
                        className={inputClass} required disabled={!formData.area}>
                        <option value="">{formData.area ? 'Seleccione un programa' : 'Primero seleccione un área'}</option>
                        {programasFormacion.map(p => <option key={p._id} value={p._id}>{p.nombrePrograma}</option>)}
                    </select>
                </div>
            </div>

            {programaFormacionSeleccionado && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Código</p>
                        <p className="text-sm font-mono text-gray-700">{programaFormacionSeleccionado.codigoPrograma || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Versión</p>
                        <p className="text-sm text-gray-700">{programaFormacionSeleccionado.versionPrograma || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Horas requeridas</p>
                        <p className="text-sm font-bold text-green-700">{programaFormacionSeleccionado.horas || 'N/A'}h</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Programa Especial <span className="text-red-500">*</span></label>
                    <select name="programaEspecial" onChange={handleProgramaEspecialChange} value={formData.programaEspecial} className={inputClass} required>
                        <option value="">Seleccione un programa especial</option>
                        {programasEspeciales.map(p => <option key={p._id} value={p._id}>{p.programaEspecial}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Municipio <span className="text-red-500">*</span></label>
                    <select name="municipio" onChange={handleChange} value={formData.municipio} className={inputClass} required>
                        <option value="">Seleccione un municipio</option>
                        {municipios.map(m => <option key={m._id} value={m._id}>{m.municipios}</option>)}
                    </select>
                </div>
            </div>

            {tipo === 'campesena' && (
                <div>
                    <label className={labelClass}>Tipo de Instructor <span className="text-red-500">*</span></label>
                    <select name="tipoInstructor" onChange={handleChange} value={formData.tipoInstructor} className={inputClass} required>
                        <option value="">Seleccione tipo de instructor</option>
                        <option value="TECNICO">Técnico</option>
                        <option value="EMPRESARIAL">Empresarial</option>
                        <option value="FULLPOPULAR">Full Popular</option>
                    </select>
                </div>
            )}
        </div>
    )
}

export default SeccionDatosBasicos
