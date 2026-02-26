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
            <select
                name="tipoOferta"
                onChange={handleChange}
                value={formData.tipoOferta}
                className="p-2 border rounded"
                required
            >
                <option value="">Tipo Oferta</option>
                <option value="Abierta">Abierta</option>
                <option value="Cerrada">Cerrada</option>
            </select>

            <input
                name="cupo"
                placeholder="Cupo"
                onChange={handleChange}
                value={formData.cupo}
                className="p-2 border rounded"
                type="number"
                min="1"
                required
            />

            <select
                name="area"
                onChange={handleAreaChange}
                value={formData.area}
                className="p-2 border rounded"
                required
            >
                <option value="">Seleccione Área</option>
                {areas.map(a => (
                    <option key={a._id} value={a._id}>{a.area}</option>
                ))}
            </select>

            <select
                name="programaFormacion"
                onChange={handleProgramaChange}
                value={formData.programaFormacion}
                className="p-2 border rounded"
                required
            >
                <option value="">Programa Formación</option>
                {programasFormacion.map(p => (
                    <option key={p._id} value={p._id}>
                        {p.nombrePrograma}
                    </option>
                ))}
            </select>

            {programaFormacionSeleccionado && (
                <div className="col-span-2 grid grid-cols-3 gap-4 mt-2 mb-2">
                    <div>
                        <label className="block text-xs text-gray-500 uppercase font-semibold mb-1">
                            Código del Programa
                        </label>
                        <input
                            type="text"
                            value={programaFormacionSeleccionado.codigoPrograma || 'No disponible'}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 uppercase font-semibold mb-1">
                            Versión
                        </label>
                        <input
                            type="text"
                            value={programaFormacionSeleccionado.versionPrograma || 'No disponible'}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 uppercase font-semibold mb-1">
                            Modalidad
                        </label>
                        <input
                            type="text"
                            value={programaFormacionSeleccionado.modalidad || 'PRESENCIAL'}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-700"
                        />
                    </div>
                </div>
            )}

            <select
                name="programaEspecial"
                onChange={handleProgramaEspecialChange}
                value={formData.programaEspecial}
                className="p-2 border rounded"
                required
            >
                <option value="">Programa Especial</option>
                {programasEspeciales.map(p => (
                    <option key={p._id} value={p._id}>
                        {p.programaEspecial}
                    </option>
                ))}
            </select>

            <select
                name="municipio"
                onChange={handleChange}
                value={formData.municipio}
                className="p-2 border rounded"
                required
            >
                <option value="">Municipio</option>
                {municipios.map(m => (
                    <option key={m._id} value={m._id}>{m.municipios}</option>
                ))}
            </select>

            {tipo === "campesena" && (
                <select
                    name="tipoInstructor"
                    onChange={handleChange}
                    value={formData.tipoInstructor}
                    className="p-2 border rounded col-span-2"
                    required
                >
                    <option value="">Tipo Instructor</option>
                    <option value="TECNICO">Técnico</option>
                    <option value="EMPRESARIAL">Empresarial</option>
                    <option value="FULLPOPULAR">Full Popular</option>
                </select>
            )}
        </>
    )
}

export default SeccionDatosBasicos
