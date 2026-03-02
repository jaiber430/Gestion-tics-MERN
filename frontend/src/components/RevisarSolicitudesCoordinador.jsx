import React, { useState } from 'react'
import { formatearFechaInicio } from '../helpers/formatearFechas'
import useAuth from '../hooks/useAuth'
import clienteAxios from '../api/axios'
import Alerta from './Alerta'

const RevisarSolicitudesCoordinador = ({ ofertas }) => {

    const [estado, setEstado] = useState()
    const [observacion, setObservacion] = useState('')
    const [alerta, setAlerta] = useState({})
    const { user } = useAuth()
    console.log(user)

    const handlerChangeStatus = (e) => {
        const value = e.target.value
        if (value === '') {
            setEstado('')
        } else {
            setEstado(value === 'true')  // convierte string a booleano
        }
    }
    // const idSolicitud = ofertas.map(o => o._id)
    // console.log(idSolicitud)

    const handleCartaSolicitud = async (idSolicitud) => {
        try {
            const response = await clienteAxios.get(
                `/consultas/revision-coordinador/${idSolicitud}/carta-solicitud`,
                { responseType: 'blob' }
            )
            const blob = new Blob([response.data], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            window.open(url, '_blank')
            setTimeout(() => window.URL.revokeObjectURL(url), 10000)
        } catch (error) {
            console.error('Error:', error)
            setAlerta({
                msg: error?.response?.data?.msg || 'Ocurrio un error',
                error: true
            })

            setTimeout(() => {
                setAlerta({})
            }, 3000)
        }
    }

    const handleClick = async (idSolicitud) => {
        try {
            const response = await clienteAxios.get(
                `/consultas/consultas-coordinador/${idSolicitud}/ficha-caracterizacion`,
                { responseType: 'blob' }
            )
            const blob = new Blob([response.data], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            window.open(url, '_blank')
            setTimeout(() => window.URL.revokeObjectURL(url), 10000)
        } catch (error) {
            console.error('Error:', error)
            setAlerta({
                msg: error?.response?.data?.msg || 'Ocurrio un error',
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000)
        }
    }

    const handleVerCombinado = async (idSolicitud) => {
        try {
            await clienteAxios.get(`consultas/revision-coordinador/${idSolicitud}/documento-aspirantes`)
            window.open(`http://localhost:4000/gestion-tics/api/consultas/revision-coordinador/${idSolicitud}/documento-aspirantes`, '_blank')
        } catch (error) {
            setAlerta({
                msg: error?.response?.data?.msg || 'Ocurrio un error',
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000)
        }
    }

    const handleMasivo = async (idSolicitud) => {
        try {
            await clienteAxios.get(`consultas/revision-coordinador/${idSolicitud}/formato-masivo`)
            window.open(`http://localhost:4000/gestion-tics/api/consultas/revision-coordinador/${idSolicitud}/formato-masivo`, '_blank')
        } catch (error) {
            setAlerta({
                msg: error?.response?.data?.msg || 'Ocurrio un error',
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000)
        }
    }


    return (
        <div className="space-y-6">

            {alerta.msg && (<Alerta alerta={alerta} />)}
            {ofertas.map((o, index) => (
                <div
                    key={o._id}
                    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                >
                    {/* Barra lateral */}
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-yellow-500 to-amber-400" />

                    <div className="pl-6 p-6">

                        {/* Cabecera */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${o.tipoSolicitud?.includes('Regular')
                                    ? 'bg-gradient-to-br from-orange-500 to-amber-500'
                                    : 'bg-gradient-to-br from-green-600 to-emerald-500'
                                    }`}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-xl font-bold text-slate-800">{o.tipoSolicitud?.toUpperCase()}</h3>
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">#{index + 1}</span>
                                    </div>
                                    <p className="text-sm text-slate-500">{o.programaFormacion?.nombrePrograma}</p>
                                </div>
                            </div>

                            <span className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-xl text-xs font-semibold self-start">
                                {formatearFechaInicio(o.fechaSolicitud)}
                            </span>
                        </div>

                        {/* Grid de datos */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                            {/* Programa */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Programa</p>
                                </div>
                                <p className="font-bold text-slate-800 text-base">{o.programaFormacion?.nombrePrograma}</p>
                            </div>

                            {/* Instructor */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Instructor solicitante</p>
                                </div>
                                <p className="font-bold text-slate-800 text-base">{o.usuarioSolicitante?.nombre} {o.usuarioSolicitante?.apellido}</p>
                            </div>

                            {/* Empresa / Convenio */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">
                                        {o.empresaSolicitante ? 'Empresa' : 'Convenio'}
                                    </p>
                                </div>
                                <p className="font-bold text-slate-800 text-base">
                                    {o.empresaSolicitante ? o.empresaSolicitante.nombreEmpresa : o.convenio || '—'}
                                </p>
                            </div>
                        </div>

                        {/* Decisión */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Estado</label>
                                <select value={estado} onChange={handlerChangeStatus}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-50 transition-all bg-white text-slate-700">
                                    <option value=''>Seleccione un estado</option>
                                    <option value='true'>Aprobado</option>
                                    <option value='false'>Rechazado</option>
                                </select>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Observación</label>
                                <textarea
                                    value={observacion}
                                    onChange={e => setObservacion(e.target.value)}
                                    disabled={estado !== false}
                                    placeholder={estado !== false ? 'Solo disponible al rechazar' : 'Escribe la observación...'}
                                    rows={2}
                                    className={`w-full px-4 py-2.5 border rounded-xl transition-all resize-none focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-50 text-sm
                                ${estado !== false
                                            ? 'border-slate-100 bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : 'border-slate-200 bg-white text-slate-700'
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Footer acciones */}
                        <div className="pt-4 border-t border-slate-200 flex justify-end items-center gap-2">

                            <button
                                onClick={() => handleClick(o._id)}
                                className="px-4 py-2 text-sm rounded-xl transition-colors flex items-center gap-2 font-medium bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Ver ficha
                            </button>

                            {o.empresaSolicitante ? (
                                <button
                                    onClick={() => handleCartaSolicitud(o._id)}
                                    className="px-4 py-2 text-sm rounded-xl transition-colors flex items-center gap-2 font-medium bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Carta solicitud
                                </button>
                            ) : (
                                <button disabled className="px-4 py-2 text-sm rounded-xl flex items-center gap-2 font-medium bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Carta solicitud
                                </button>
                            )}

                            <button
                                onClick={() => handleVerCombinado(o._id)}
                                className="px-4 py-2 text-sm rounded-xl transition-colors flex items-center gap-2 font-medium bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Ver aspirantes
                            </button>

                            <button
                                onClick={() => handleMasivo(o._id)}
                                className="px-4 py-2 text-sm rounded-xl transition-colors flex items-center gap-2 font-medium bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Ver masivo
                            </button>

                            <button
                                disabled={estado === ''}
                                className={`px-4 py-2 text-sm rounded-xl transition-all flex items-center gap-2 font-medium shadow-md
                                        ${estado === true
                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-green-200'
                                        : estado === false
                                            ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-red-200'
                                            : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                    }`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {estado === true ? 'Aprobar solicitud' : estado === false ? 'Rechazar solicitud' : 'Seleccione un estado'}
                            </button>

                        </div>

                    </div>
                </div>
            ))}
        </div>
    )
}

export default RevisarSolicitudesCoordinador
