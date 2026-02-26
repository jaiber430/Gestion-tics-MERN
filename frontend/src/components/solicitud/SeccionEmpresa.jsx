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
        <div className="col-span-2 mt-6 border-t border-gray-200 pt-6">
            {/* Título de la sección */}
            <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-8 bg-green-700 rounded-full"></div>
                <div>
                    <h3 className="text-base font-semibold text-gray-800">
                        Datos de la Empresa Solicitante
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Información corporativa y de contacto
                    </p>
                </div>
            </div>

            {/* Primera fila: Información básica de la empresa */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <div className="space-y-1.5 md:col-span-1">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Tipo de empresa <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="tipoEmpresa"
                        onChange={handleTipoEmpresaChange}
                        value={formData.tipoEmpresa}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors bg-white"
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
                </div>

                <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Nombre de la empresa <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="nombreEmpresa"
                        placeholder="Ej: Soluciones Tecnológicas SAS"
                        onChange={handleChange}
                        value={formData.nombreEmpresa}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                        required
                    />
                </div>
            </div>

            {/* Segunda fila: NIT y fecha creación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                        NIT <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="nitEmpresa"
                        placeholder="Ej: 900.123.456-7"
                        onChange={handleChange}
                        value={formData.nitEmpresa}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                        type="number"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Fecha de creación <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="fechaCreacionEmpresa"
                        type="date"
                        onChange={handleChange}
                        value={formData.fechaCreacionEmpresa}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                        required
                    />
                </div>
            </div>

            {/* Tercera fila: Dirección (completa) */}
            <div className="mb-5">
                <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Dirección de la empresa <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="direccionEmpresa"
                        placeholder="Ej: Calle 123 # 45-67, Oficina 301, Bogotá"
                        onChange={handleChange}
                        value={formData.direccionEmpresa}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                        required
                    />
                </div>
            </div>

            {/* Cuarta fila: Contacto principal de la empresa */}
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Información del responsable
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Nombre del responsable <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="nombreResponsable"
                        placeholder="Ej: Juan Pérez"
                        onChange={handleChange}
                        value={formData.nombreResponsable}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                        required
                    />
                </div>
            </div>

            {/* Quinta fila: Contacto operativo */}
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Información de contacto
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Email corporativo <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="emailEmpresa"
                        placeholder="Ej: contacto@empresa.com"
                        onChange={handleChange}
                        value={formData.emailEmpresa}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                        type="email"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Teléfono fijo <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="telefonoEmpresa"
                        placeholder="Ej: 6012345678"
                        onChange={handleChange}
                        value={formData.telefonoEmpresa}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                        type="number"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Persona de contacto <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="nombreContactoEmpresa"
                        placeholder="Ej: María González"
                        onChange={handleChange}
                        value={formData.nombreContactoEmpresa}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                        required
                    />
                </div>
            </div>

            {/* Sexta fila: Información laboral */}
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Información laboral
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Número de empleados <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="numeroEmpleadosEmpresa"
                        placeholder="Ej: 50"
                        onChange={handleChange}
                        value={formData.numeroEmpleadosEmpresa}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                        type="number"
                        min="1"
                        required
                    />
                </div>
            </div>

            {/* Séptima fila: Documentos */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Documentos requeridos
                </h4>

                <div className="w-full">
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-3">
                            Carta de solicitud <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setFieldValue('cartaSolicitud', e.target.files[0])}
                            className="w-full px-3 py-2.5 text-sm text-gray-500 border border-gray-300 rounded-lg 
                                        file:mr-3 file:py-1.5 file:px-4 file:rounded-md file:border-0 
                                        file:text-sm file:font-medium file:bg-green-600 file:text-white 
                                        hover:file:bg-green-700 focus:outline-none focus:border-green-600 
                                        focus:ring-1 focus:ring-green-600 transition-colors cursor-pointer"
                        />

                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            PDF - Tamaño máximo 10MB
                        </p>

                        {formData.cartaSolicitud && (
                            <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                {formData.cartaSolicitud.name}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default SeccionEmpresa
