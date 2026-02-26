import { useSolicitud } from '../../context/SolicitudContext'

const InfoHoras = () => {
    const {
        horasPorDia,
        fechasSeleccionadas,
        horasTotales,
        horasCompletadas,
        toleranciaAlcanzada,
        programaFormacionSeleccionado,
        mensajeHorario
    } = useSolicitud()

    const getTotalColor = () => {
        if (horasCompletadas && !toleranciaAlcanzada) return 'text-green-600'
        if (toleranciaAlcanzada) return 'text-yellow-600'
        if (horasTotales > (programaFormacionSeleccionado?.horas || 0) + (horasPorDia || 0)) return 'text-red-600'
        return 'text-blue-600'
    }

    const getMensajeStyle = () => {
        if (mensajeHorario?.includes('completas')) return 'bg-green-200 text-green-800'
        if (mensajeHorario?.includes('tolerancia')) return 'bg-yellow-200 text-yellow-800'
        if (mensajeHorario?.includes('Excede')) return 'bg-red-200 text-red-800'
        return 'bg-blue-100 text-blue-800'
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            {/* Título de la sección */}
            <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-8 bg-green-700 rounded-full"></div>
                <div>
                    <h3 className="text-base font-semibold text-gray-800">Resumen de Horas</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Monitor de tiempos y disponibilidad</p>
                </div>
            </div>

            {/* Grid de indicadores - 4 columnas en desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Horas por día */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-green-200 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Jornada</span>
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800 mb-1">{horasPorDia || 0}</p>
                    <p className="text-sm text-gray-500">horas por día</p>
                </div>

                {/* Días seleccionados */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-green-200 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Días</span>
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800 mb-1">{fechasSeleccionadas.length}</p>
                    <p className="text-sm text-gray-500">días seleccionados</p>
                </div>

                {/* Total horas */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-green-200 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total</span>
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <p className={`text-3xl font-bold mb-1 ${getTotalColor()}`}>{horasTotales}</p>
                    <p className="text-sm text-gray-500">horas totales</p>
                </div>

                {/* Requeridas / Máximo */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-green-200 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Meta/Máx</span>
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                        <p className="text-2xl font-bold text-gray-800">
                            {programaFormacionSeleccionado?.horas || 0}
                        </p>
                        <span className="text-gray-400 text-lg">/</span>
                        <p className="text-xl font-semibold text-gray-600">
                            {(programaFormacionSeleccionado?.horas || 0) + (horasPorDia || 0)}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">
                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">+1 día extra</span>
                    </p>
                </div>
            </div>

            {/* Programa de formación - Sección destacada */}
            {programaFormacionSeleccionado && (
                <div className="mt-6 pt-5 border-t border-gray-200">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                Programa de formación
                            </p>
                            <p className="text-base font-semibold text-gray-800">
                                {programaFormacionSeleccionado.nombrePrograma}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Código: <span className="font-mono">{programaFormacionSeleccionado.codigo || 'N/A'}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Mensaje de estado */}
            {mensajeHorario && (
                <div className={`mt-5 p-4 rounded-lg border flex items-start gap-3 ${getMensajeStyle()}`}>
                    {mensajeHorario.includes('Completo') || mensajeHorario.includes('completo') ? (
                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : mensajeHorario.includes('Excede') || mensajeHorario.includes('excede') ? (
                        <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    <div>
                        <p className="text-sm font-medium">{mensajeHorario}</p>
                        <p className="text-xs mt-1 opacity-75">
                            {mensajeHorario.includes('Completo') ? 'Puede proceder con la solicitud' :
                                mensajeHorario.includes('Excede') ? 'Se aplicará tolerancia' :
                                    'Seleccione más días para completar las horas requeridas'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InfoHoras
