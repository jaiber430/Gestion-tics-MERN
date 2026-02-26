import { useSolicitud } from '../../context/SolicitudContext'

const SeccionEmpresa = () => {
    const {
        formData,
        handleChange,
        setFieldValue,
        tiposEmpresa,
        cargandoTiposEmpresa,
        setTipoEmpresaSeleccionado 
    } = useSolicitud()

    if (formData.tipoOferta !== "Cerrada") return null

    const handleTipoEmpresaChange = (e) => {
        const selectedId = e.target.value
        const selectedTipo = tiposEmpresa.find(t => t._id === selectedId)

        handleChange(e)
        setTipoEmpresaSeleccionado(selectedTipo || null)
    }

    return (
        <div className="col-span-2 mt-4 border-t pt-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Datos de la Empresa Solicitante
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <input
                    name="nombreEmpresa"
                    placeholder="Nombre de la empresa"
                    onChange={handleChange}
                    value={formData.nombreEmpresa}
                    className="p-2 border rounded"
                    required
                />
                <input
                    name="nitEmpresa"
                    placeholder="NIT"
                    onChange={handleChange}
                    value={formData.nitEmpresa}
                    className="p-2 border rounded"
                    type="number"
                    required
                />
                <input
                    name="nombreResponsable"
                    placeholder="Nombre del responsable"
                    onChange={handleChange}
                    value={formData.nombreResponsable}
                    className="p-2 border rounded"
                    required
                />
                <input
                    name="emailEmpresa"
                    placeholder="Email de la empresa"
                    onChange={handleChange}
                    value={formData.emailEmpresa}
                    className="p-2 border rounded"
                    type="email"
                    required
                />
                <input
                    name="telefonoEmpresa"
                    placeholder="Teléfono"
                    onChange={handleChange}
                    value={formData.telefonoEmpresa}
                    className="p-2 border rounded"
                    type="number"
                    required
                />
                <input
                    name="fechaCreacionEmpresa"
                    type="date"
                    placeholder="Fecha de creación"
                    onChange={handleChange}
                    value={formData.fechaCreacionEmpresa}
                    className="p-2 border rounded"
                    required
                />
                <input
                    name="direccionEmpresa"
                    placeholder="Dirección de la empresa"
                    onChange={handleChange}
                    value={formData.direccionEmpresa}
                    className="p-2 border rounded col-span-2"
                    required
                />
                <input
                    name="nombreContactoEmpresa"
                    placeholder="Nombre del contacto"
                    onChange={handleChange}
                    value={formData.nombreContactoEmpresa}
                    className="p-2 border rounded"
                    required
                />
                <input
                    name="numeroEmpleadosEmpresa"
                    placeholder="Número de empleados"
                    onChange={handleChange}
                    value={formData.numeroEmpleadosEmpresa}
                    className="p-2 border rounded"
                    type="number"
                    required
                />

                <select
                    name="tipoEmpresa"
                    onChange={handleTipoEmpresaChange}
                    value={formData.tipoEmpresa}
                    className="p-2 border rounded col-span-2"
                    required
                    disabled={cargandoTiposEmpresa}
                >
                    <option value="">
                        {cargandoTiposEmpresa
                            ? 'Cargando tipos de empresa...'
                            : 'Seleccione tipo de empresa'}
                    </option>
                    {tiposEmpresa.map(te => (
                        <option key={te._id} value={te._id}>
                            {te.tipoEmpresaRegular}
                        </option>
                    ))}
                </select>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Carta de solicitud (PDF)
                    </label>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) =>
                            setFieldValue('cartaSolicitud', e.target.files[0])
                        }
                    />
                </div>
            </div>
        </div>
    )
}

export default SeccionEmpresa
