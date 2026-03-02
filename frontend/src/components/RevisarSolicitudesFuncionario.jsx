import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Alerta from './Alerta'
import clienteAxios from '../api/axios'

const ESTADOS_CONFIG = {
    'CREACIÓN': { barra: 'from-blue-500 to-blue-400', badge: 'bg-blue-50 text-blue-700 border-blue-200', boton: 'from-blue-600 to-blue-500 shadow-blue-200' },
    'CREADA': { barra: 'from-orange-500 to-amber-400', badge: 'bg-orange-50 text-orange-700 border-orange-200', boton: 'from-orange-500 to-amber-500 shadow-orange-200' },
    'LISTA DE ESPERA': { barra: 'from-slate-500 to-slate-400', badge: 'bg-slate-50 text-slate-700 border-slate-200', boton: 'from-slate-600 to-slate-500 shadow-slate-200' },
    'MATRICULADA': { barra: 'from-green-500 to-emerald-400', badge: 'bg-green-50 text-green-700 border-green-200', boton: 'from-green-600 to-emerald-600 shadow-green-200' },
    'RECHAZADA': { barra: 'from-red-500 to-red-400', badge: 'bg-red-50 text-red-700 border-red-200', boton: 'from-red-600 to-red-500 shadow-red-200' },
}

const RevisarSolicitudesFuncionario = ({ solicitud }) => {

    const [estado, setEstado] = useState('')
    const [observacion, setObservacion] = useState('')
    const [alerta, setAlerta] = useState({})

    const handlerChangeStatus = (e) => {
        setEstado(e.target.value)
        if (e.target.value !== 'RECHAZADA') setObservacion('')
    }

    const handlerDocumentosAspirantes = async (idSolicitud) => {
        try {
            const response = await clienteAxios.get(
                `/consultas/revision-funcionario/${idSolicitud}/descargar-documento`,
                { responseType: 'blob' }
            )
            const blob = new Blob([response.data], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'documentos-aspirantes.pdf'
            link.click()
            setTimeout(() => window.URL.revokeObjectURL(url), 10000)
        } catch (error) {
            setAlerta({
                msg: error?.response?.data?.msg || 'Error al descargar el documento',
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000)
        }
    }

    const handlerCartaSolicitud = async (idSolicitud) => {
        try {
            console.log(12)
            const response = await clienteAxios.get(
                `/consultas/revision-funcionario/${idSolicitud}/descargar-carta`,
                { responseType: 'blob' }
            )
            const blob = new Blob([response.data], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'carta-solicitud.pdf'
            link.click()
            setTimeout(() => window.URL.revokeObjectURL(url), 10000)
        } catch (error) {
            setAlerta({
                msg: error?.response?.data?.msg || 'Error al descargar el documento',
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000)
        }
    }

    const handlerFichaCaracterizacion = async (idSolicitud) => {
        try {
            const response = await clienteAxios.get(
                `/consultas/revision-funcionario/${idSolicitud}/descargar-ficha`,
                { responseType: 'blob' }
            )
            const blob = new Blob([response.data], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'ficha-caracterizacion.pdf'
            link.click()
            setTimeout(() => window.URL.revokeObjectURL(url), 10000)
        } catch (error) {
            setAlerta({
                msg: error?.response?.data?.msg || 'Error al descargar el documento',
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000)
        }
    }

    return (
        <div className="space-y-6">

            {alerta.msg && <Alerta alerta={alerta} />}

            {solicitud.map((s, index) => {

                const config = ESTADOS_CONFIG[estado] || { barra: 'from-yellow-500 to-amber-400' }

                return (
                    <div
                        key={s._id}
                        className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* Barra lateral dinámica */}
                        <div className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b ${config.barra}`} />

                        <div className="pl-6 p-6">

                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full font-medium">#{index + 1}</span>
                                        {estado && (
                                            <span className={`px-3 py-0.5 border rounded-full text-xs font-semibold ${config.badge}`}>
                                                {estado}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 leading-tight">
                                        {s.solicitud?.programaFormacion?.nombrePrograma || '—'}
                                    </h2>
                                    <span>{s.solicitud?.tipoSolicitud}</span>
                                </div>

                                {/* Link esquina superior derecha */}
                                <Link
                                    to={`/funcionario/conocer-detalles-solicitud/${s.solicitud?._id}`}
                                    className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium transition-colors shrink-0 ml-4">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Más detalles sobre la solicitud
                                </Link>
                            </div>

                            <form onSubmit={(e) => e.preventDefault()}>

                                {/* Select + Observación */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Estado</label>
                                        <select
                                            value={estado}
                                            onChange={handlerChangeStatus}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-50 transition-all bg-white text-slate-700">
                                            <option value=''>Seleccione un estado</option>
                                            <option value='CREACIÓN'>Creación</option>
                                            <option value='CREADA'>Creada</option>
                                            <option value='LISTA DE ESPERA'>Lista de espera</option>
                                            <option value='MATRICULADA'>Matriculada</option>
                                            <option value='RECHAZADA'>Rechazada</option>
                                        </select>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Observación</label>
                                        <textarea
                                            value={observacion}
                                            onChange={e => setObservacion(e.target.value)}
                                            disabled={estado === 'LISTA DE ESPERA' || estado === ''}
                                            placeholder={estado === 'LISTA DE ESPERA' || estado === '' ? 'Solo disponible al rechazar' : 'Escribe la observación...'}
                                            rows={2}
                                            className={`w-full px-4 py-2.5 border rounded-xl transition-all resize-none focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-50 text-sm
                                                ${estado === 'LISTA DE ESPERA' || estado === ''
                                                    ? 'border-slate-100 bg-slate-100 text-slate-400 cursor-not-allowed'
                                                    : 'border-slate-200 bg-white text-slate-700'
                                                }`}
                                        />
                                    </div>
                                </div>
                                {/* Botones de documentos — lo más importante */}
                                <div className="flex flex-wrap gap-3 mb-6">

                                    {/* Ver aspirantes */}
                                    <button
                                        onClick={() => handlerDocumentosAspirantes(s.solicitud._id)}
                                        className="px-4 py-2.5 text-sm rounded-xl transition-all flex items-center gap-2 font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-sm">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Descargar Documentos Aspirantes
                                    </button>

                                    {/* Excel masivo — destacado */}
                                    <button type="button"
                                        className="px-4 py-2.5 text-sm rounded-xl transition-all flex items-center gap-2 font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-sm">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Descargar Excel masivo
                                    </button>

                                    {/* Ver ficha */}
                                    <button
                                        onClick={() => handlerFichaCaracterizacion(s.solicitud?._id)}
                                        className="px-4 py-2.5 text-sm rounded-xl transition-all flex items-center gap-2 font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-sm">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Descargar ficha Caracterización
                                    </button>

                                    {/* Carta solicitud — siempre disponible */}
                                    <button
                                        onClick={() => handlerCartaSolicitud(s.solicitud?._id)}
                                        className="px-4 py-2.5 text-sm rounded-xl transition-all flex items-center gap-2 font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-sm">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        Descargar Carta solicitud
                                    </button>
                                </div>
                                {/* Footer — botón submit */}
                                <div className="pt-4 border-t border-slate-200 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={estado === ''}
                                        className={`px-6 py-2.5 text-sm rounded-xl transition-all flex items-center gap-2 font-medium shadow-md
                                            ${estado
                                                ? `bg-gradient-to-r ${config.boton} hover:opacity-90 text-white`
                                                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                            }`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {estado || 'Seleccione un estado'}
                                    </button>
                                </div>

                            </form>

                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default RevisarSolicitudesFuncionario
