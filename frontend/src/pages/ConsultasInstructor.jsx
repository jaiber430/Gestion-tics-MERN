import { useEffect, useState } from "react"
import Header from "../components/Header"
import clienteAxios from "../api/axios"
import VerFichaCaracterizacion from "../components/VerFichaCaracterizacion"

const ConsultasInstructor = () => {

    const [dataOferta, setDataOferta] = useState([])

    useEffect(() => {

        const verOfertas = async () => {
            try {
                const [ofertasRes] = await Promise.all([
                    clienteAxios.get('/consultas/consultas-instructor')
                ])
                setDataOferta(ofertasRes.data)
                console.log(ofertasRes.data)
            } catch (error) {
                console.log('Se encontro un error', error)
            }
        }
        verOfertas()

    }, [])

    return (
        <div>
            <Header />
            <div className="space-y-6">
                {dataOferta.map((oferta, index) => (
                    <div
                        key={oferta._id}
                        className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* Barra de estado lateral con gradiente según revisado */}
                        <div className={`absolute left-0 top-0 bottom-0 w-2 ${oferta.revisado
                            ? 'bg-gradient-to-b from-green-500 to-emerald-400'
                            : 'bg-gradient-to-b from-yellow-500 to-amber-400'
                            }`}></div>

                        {/* Contenido principal */}
                        <div className="pl-6 p-6">
                            {/* Cabecera con tipo y estado - MEJORADA */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    {/* Icono según tipo de solicitud */}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${oferta.tipoSolicitud?.includes('Regular')
                                        ? 'bg-gradient-to-br from-orange-500 to-amber-500'
                                        : 'bg-gradient-to-br from-green-600 to-emerald-500'
                                        }`}>
                                        {oferta.tipoSolicitud?.includes('Regular') ? (
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M12 21V10m0 0c-1.5-2-3-3-5-3 1 3 2.5 4.5 5 5m0-2c1.5-2 3-3 5-3-1 3-2.5 4.5-5 5" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-xl font-bold text-slate-800">
                                                {oferta.tipoSolicitud}
                                            </h3>
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                                                #{index + 1}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 flex items-center gap-2">
                                            <span>{oferta.programaFormacion?.nombrePrograma}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span>{oferta.tipoOferta}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {oferta.departamento}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Badge de estado mejorado */}
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${oferta.revisado
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                        }`}>
                                        <span className={`w-2 h-2 rounded-full ${oferta.revisado ? 'bg-green-500 animate-pulse' : 'bg-yellow-500 animate-pulse'
                                            }`}></span>
                                        {oferta.revisado ? 'Revisado' : 'Pendiente de revisión'}
                                    </span>
                                </div>
                            </div>

                            {/* Grid de información - MEJORADA */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Columna 1: Programa */}
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Programa de Formación</p>
                                    </div>
                                    <p className="font-bold text-slate-800 text-lg mb-1">{oferta.programaFormacion?.nombrePrograma}</p>
                                    <p className="text-sm text-slate-600 mb-2">Área: <span className="font-medium">{oferta.programaFormacion?.area?.area}</span></p>
                                    <span className="text-sm font-semibold text-blue-600">{oferta.cupo} cupos</span>
                                </div>

                                {/* Columna 2: Horario */}
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Horario y Fechas</p>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg font-bold text-slate-800">{oferta.horaInicio}</span>
                                        <span className="text-slate-400">—</span>
                                        <span className="text-lg font-bold text-slate-800">{oferta.horaFin}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-1">
                                        <span className="font-medium">{new Date(oferta.fechaInicio).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                                        <span className="mx-1">→</span>
                                        <span className="font-medium">{new Date(oferta.fechaFin).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </p>
                                    <p className="text-sm text-slate-600 flex items-center gap-1">
                                        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {oferta.fechasSeleccionadas.length} días de formación
                                    </p>
                                </div>

                                {/* Columna 3: Ubicación/Empresa/Covenio */}
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Ubicación</p>
                                    </div>
                                    <p className="font-bold text-slate-800 mb-1">{oferta.ambiente}</p>
                                    <p className="text-sm text-slate-600 mb-2 flex items-start gap-1">
                                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{oferta.direccionFormacion}</span>
                                    </p>

                                    {/* Condición para mostrar empresa o convenio */}
                                    {oferta.empresaSolicitante ? (
                                        <div className="mt-3 pt-3 border-t border-slate-200">
                                            <p className="text-xs text-slate-500 mb-1">Empresa solicitante</p>
                                            <p className="font-medium text-slate-700 flex items-center gap-2">
                                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                {oferta.empresaSolicitante.nombreEmpresa}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="mt-3 pt-3 border-t border-slate-200">
                                            <p className="text-xs text-slate-500 mb-1">Convenio</p>
                                            <p className="font-medium text-slate-700 flex items-center gap-2">
                                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                {oferta.convenio || 'Convenio SENA'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer con acciones - SOLO BOTÓN DE FICHA */}
                            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Creado: {new Date(oferta.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <VerFichaCaracterizacion id={oferta._id}/>
                                    <button className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 font-medium ${oferta.revisado
                                        ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                        : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200'
                                        }`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Enviar solicitud
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {dataOferta.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-12 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">No hay ofertas disponibles</h3>
                        <p className="text-slate-500">Las solicitudes de ofertas aparecerán aquí cuando sean creadas.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ConsultasInstructor
