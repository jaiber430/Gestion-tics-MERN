import { useState } from 'react'
import { useSolicitud } from '../../context/SolicitudContext'

const DIAS   = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES  = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const SelectorCalendario = () => {
    const {
        mostrarCalendario,
        programaFormacionSeleccionado,
        formData,
        maxFecha,
        fechasSeleccionadas,
        setFechasSeleccionadas,
        mostrarAlerta,
        horasPorDia,
        horasCompletadas,
        toleranciaAlcanzada
    } = useSolicitud()

    // Estado local del mes visible — solo cambia cuando el usuario navega
    const [vistaFecha, setVistaFecha] = useState(() => {
        if (formData.fechaInicio) {
            const [y, m] = formData.fechaInicio.split('-').map(Number)
            return new Date(y, m - 1, 1)
        }
        return new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    })

    if (!mostrarCalendario) return null

    if (!programaFormacionSeleccionado) {
        return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center text-yellow-800 text-sm flex items-center justify-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Selecciona un programa de formación para poder elegir los días
            </div>
        )
    }

    const horasRequeridas = programaFormacionSeleccionado.horas
    const horasMaximas    = horasRequeridas + (horasPorDia || 0)

    const anio = vistaFecha.getFullYear()
    const mes  = vistaFecha.getMonth()

    const primerDia    = new Date(anio, mes, 1).getDay()
    const diasEnMes    = new Date(anio, mes + 1, 0).getDate()

    const irMesAnterior = () => setVistaFecha(new Date(anio, mes - 1, 1))
    const irMesSiguiente = () => setVistaFecha(new Date(anio, mes + 1, 1))

    const fechaInicioDate = formData.fechaInicio
        ? (() => { const [y,m,d] = formData.fechaInicio.split('-').map(Number); return new Date(y, m-1, d) })()
        : null

    const toStr = (y, m, d) =>
        `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`

    const handleClickDia = (dia) => {
        if (!horasPorDia || horasPorDia <= 0) {
            mostrarAlerta('Primero configura el horario de inicio y fin', true)
            return
        }

        const fechaDate = new Date(anio, mes, dia)
        const fechaStr  = toStr(anio, mes, dia)

        // Validar rango
        if (fechaInicioDate && fechaDate < fechaInicioDate) return
        if (maxFecha && fechaDate > maxFecha) return

        const yaSeleccionada = fechasSeleccionadas.includes(fechaStr)
        let nuevas = [...fechasSeleccionadas]

        if (!yaSeleccionada) {
            const horasConNuevo = (nuevas.length + 1) * horasPorDia
            if (horasConNuevo > horasMaximas) {
                mostrarAlerta(`No puedes agregar más días. Máximo ${horasMaximas}h`, true)
                return
            }
            nuevas.push(fechaStr)
        } else {
            nuevas = nuevas.filter(f => f !== fechaStr)
        }

        nuevas.sort((a, b) => new Date(a) - new Date(b))
        setFechasSeleccionadas(nuevas)
    }

    const getDiaEstado = (dia) => {
        const fechaDate = new Date(anio, mes, dia)
        const fechaStr  = toStr(anio, mes, dia)

        if (fechaInicioDate && fechaDate < fechaInicioDate) return 'bloqueado'
        if (maxFecha && fechaDate > maxFecha) return 'bloqueado'

        if (fechasSeleccionadas.includes(fechaStr)) {
            const ordenadas = [...fechasSeleccionadas].sort((a,b) => new Date(a)-new Date(b))
            const esUltima  = fechaStr === ordenadas[ordenadas.length - 1]
            if (esUltima && horasCompletadas) {
                return toleranciaAlcanzada ? 'ultimo-tolerancia' : 'ultimo-completo'
            }
            return 'seleccionado'
        }

        return 'disponible'
    }

    const estilosDia = {
        bloqueado:        'text-gray-200 cursor-not-allowed',
        disponible:       'text-gray-700 hover:bg-green-50 hover:text-green-700 cursor-pointer',
        seleccionado:     'bg-blue-500 text-white rounded-full cursor-pointer',
        'ultimo-completo':'bg-green-600 text-white rounded-full ring-2 ring-green-700 font-bold cursor-pointer',
        'ultimo-tolerancia':'bg-yellow-500 text-white rounded-full ring-2 ring-yellow-600 font-bold cursor-pointer',
    }

    // Celdas del calendario (blancos + días)
    const celdas = []
    for (let i = 0; i < primerDia; i++) celdas.push(null)
    for (let d = 1; d <= diasEnMes; d++) celdas.push(d)

    return (
        <div className="space-y-5">

            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Selecciona los días de formación
                </h3>
                {horasCompletadas && (
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        toleranciaAlcanzada
                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                            : 'bg-green-100 text-green-700 border border-green-200'
                    }`}>
                        {toleranciaAlcanzada ? '⚠ Con tolerancia' : '✓ Completado'}
                    </span>
                )}
            </div>

            {/* Calendario propio */}
            <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm max-w-md mx-auto">

                {/* Navegación mes */}
                <div className="flex items-center justify-between mb-4">
                    <button type="button" onClick={irMesAnterior}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <span className="text-sm font-semibold text-gray-800">
                        {MESES[mes]} {anio}
                    </span>
                    <button type="button" onClick={irMesSiguiente}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Cabecera días */}
                <div className="grid grid-cols-7 mb-2">
                    {DIAS.map(d => (
                        <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
                    ))}
                </div>

                {/* Días */}
                <div className="grid grid-cols-7 gap-y-1">
                    {celdas.map((dia, i) => (
                        <div key={i} className="flex items-center justify-center">
                            {dia ? (
                                <button
                                    type="button"
                                    onClick={() => handleClickDia(dia)}
                                    disabled={getDiaEstado(dia) === 'bloqueado'}
                                    className={`w-8 h-8 text-sm flex items-center justify-center transition-colors
                                        ${estilosDia[getDiaEstado(dia)]}`}
                                >
                                    {dia}
                                </button>
                            ) : <div className="w-8 h-8" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chips días seleccionados */}
            {fechasSeleccionadas.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
                        Días seleccionados ({fechasSeleccionadas.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {[...fechasSeleccionadas].sort((a,b) => new Date(a)-new Date(b))
                            .map((fecha, index, arr) => {
                                const [y,m,d] = fecha.split('-')
                                const obj     = new Date(y, m-1, d)
                                const esUltima = index === arr.length - 1
                                return (
                                    <span key={fecha} className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        esUltima && horasCompletadas
                                            ? toleranciaAlcanzada ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'
                                            : 'bg-blue-500 text-white'
                                    }`}>
                                        {obj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                        {esUltima && horasCompletadas && (toleranciaAlcanzada ? ' ⚠' : ' ✓')}
                                    </span>
                                )
                            })}
                    </div>
                </div>
            )}

            {horasCompletadas && (
                <div className={`p-3 rounded-xl text-center text-sm font-semibold border ${
                    toleranciaAlcanzada
                        ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                        : 'bg-green-50 border-green-200 text-green-800'
                }`}>
                    {toleranciaAlcanzada
                        ? '⚠ Tolerancia aplicada. No puedes agregar más días.'
                        : '✓ Horas completadas exactamente. No puedes agregar más días.'}
                </div>
            )}

        </div>
    )
}

export default SelectorCalendario
