import { useSolicitud } from '../../context/SolicitudContext'

const SeccionEmpresa = () => {
    const { formData, handleChange, setFieldValue, tiposEmpresa, cargandoTiposEmpresa, setTipoEmpresaSeleccionado } = useSolicitud()

    if (formData.tipoOferta !== 'Cerrada') return null

    const inputClass = "w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
    const labelClass = "block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1"

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                    <label className={labelClass}>Tipo de empresa <span className="text-red-500">*</span></label>
                    <select name="tipoEmpresa" value={formData.tipoEmpresa} className={inputClass} required disabled={cargandoTiposEmpresa}
                        onChange={(e) => { handleChange(e); setTipoEmpresaSeleccionado(tiposEmpresa.find(t => t._id === e.target.value) || null) }}>
                        <option value="">{cargandoTiposEmpresa ? 'Cargando...' : 'Seleccione tipo'}</option>
                        {tiposEmpresa.map(te => <option key={te._id} value={te._id}>{te.tipoEmpresaRegular}</option>)}
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className={labelClass}>Nombre de la empresa <span className="text-red-500">*</span></label>
                    <input name="nombreEmpresa" placeholder="Ej: Soluciones Tecnológicas SAS"
                        onChange={handleChange} value={formData.nombreEmpresa} className={inputClass} required />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className={labelClass}>NIT <span className="text-red-500">*</span></label>
                    <input name="nitEmpresa" type="number" placeholder="Ej: 9001234567"
                        onChange={handleChange} value={formData.nitEmpresa} className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Fecha de creación <span className="text-red-500">*</span></label>
                    <input name="fechaCreacionEmpresa" type="date"
                        onChange={handleChange} value={formData.fechaCreacionEmpresa} className={inputClass} required />
                </div>
            </div>

            <div>
                <label className={labelClass}>Dirección de la empresa <span className="text-red-500">*</span></label>
                <input name="direccionEmpresa" placeholder="Ej: Calle 123 # 45-67"
                    onChange={handleChange} value={formData.direccionEmpresa} className={inputClass} required />
            </div>

            <div>
                <label className={labelClass}>Nombre del responsable <span className="text-red-500">*</span></label>
                <input name="nombreResponsable" placeholder="Ej: Juan Pérez"
                    onChange={handleChange} value={formData.nombreResponsable} className={inputClass} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                    <label className={labelClass}>Email corporativo <span className="text-red-500">*</span></label>
                    <input name="emailEmpresa" type="email" placeholder="contacto@empresa.com"
                        onChange={handleChange} value={formData.emailEmpresa} className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Teléfono <span className="text-red-500">*</span></label>
                    <input name="telefonoEmpresa" type="number" placeholder="6012345678"
                        onChange={handleChange} value={formData.telefonoEmpresa} className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Persona de contacto <span className="text-red-500">*</span></label>
                    <input name="nombreContactoEmpresa" placeholder="Ej: María González"
                        onChange={handleChange} value={formData.nombreContactoEmpresa} className={inputClass} required />
                </div>
            </div>

            <div className="md:w-1/2">
                <label className={labelClass}>Número de empleados <span className="text-red-500">*</span></label>
                <input name="numeroEmpleadosEmpresa" type="number" min="1" placeholder="Ej: 50"
                    onChange={handleChange} value={formData.numeroEmpleadosEmpresa} className={inputClass} required />
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <label className={labelClass}>Carta de solicitud (PDF) <span className="text-red-500">*</span></label>
                <input type="file" accept="application/pdf"
                    onChange={(e) => setFieldValue('cartaSolicitud', e.target.files[0])}
                    className="w-full px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg file:mr-3 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer" required />
                <p className="text-xs text-gray-400 mt-2">Solo PDF — Máximo 10MB</p>
                {formData.cartaSolicitud && (
                    <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {formData.cartaSolicitud.name}
                    </p>
                )}
            </div>
        </div>
    )
}

export default SeccionEmpresa
