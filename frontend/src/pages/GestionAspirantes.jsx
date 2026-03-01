import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import clienteAxios from '../api/axios'
import Alerta from '../components/Alerta'

const GestionAspirantes = () => {

    const [dataOferta, setDataOferta] = useState([])
    const [porcentajes, setPorcentajes] = useState({})
    const [alerta, setAlerta] = useState({})

    useEffect(() => {
        const verOfertas = async () => {
            try {
                const { data } = await clienteAxios.get('/consultas/consultas-instructor')
                setDataOferta(data)

                // Por cada oferta, pedir sus preinscritos
                const porcentajesCalc = {}
                await Promise.all(data.map(async (oferta) => {
                    try {
                        const { data } = await clienteAxios.get(`/aspirantes/aspirantes/preinscritos/${oferta._id}`)
                        console.log(data)
                        const cupoTotal = oferta.cupo || 1
                        const total = data || 0
                        porcentajesCalc[oferta._id] = Math.min((total / cupoTotal) * 100, 100)
                    } catch {
                        porcentajesCalc[oferta._id] = 0
                    }
                }))

                setPorcentajes(porcentajesCalc)

            } catch (error) {
                console.log(error)
                setAlerta({ msg: 'Error cargando ofertas', error: true })
            }
        }
        verOfertas()
    }, [])

    const getBarraColor = (porcentaje) => {
        if (porcentaje <= 30) return 'bg-red-500'
        if (porcentaje <= 70) return 'bg-yellow-500'
        return 'bg-green-500'
    }

    const copiarAlPortapapeles = (id) => {
        const link = `${window.location.origin}/preinscripcion-aspirante/${id}`
        navigator.clipboard.writeText(link)
        setAlerta({
            msg: 'Link copiado correctamente',
            error: false
        })

        setTimeout(() => {
            setAlerta({})
        }, 3000)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
            <Header />

            <div className="max-w-7xl mx-auto px-6 py-12">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-green-600">
                        Gestión de Aspirantes
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Visualiza el progreso de inscripción de tus programas
                    </p>
                </div>

                {alerta.msg && <Alerta alerta={alerta} />}

                <div className="space-y-6">

                    {dataOferta.map((oferta, index) => {

                        const porcentaje = porcentajes[oferta._id] || 0
                        const cupoTotal = oferta.cupo || 1
                        const aspirantesActuales = Math.round((porcentaje / 100) * cupoTotal)

                        return (
                            <div
                                key={oferta._id}
                                className="group relative bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
                            >

                                {/* Barra lateral */}
                                <div className={`absolute left-0 top-0 bottom-0 w-2 ${oferta.revisado
                                    ? 'bg-gradient-to-b from-green-500 to-emerald-400'
                                    : 'bg-gradient-to-b from-yellow-500 to-amber-400'
                                    }`}></div>

                                <div className="pl-6 p-6">

                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-6">

                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-xl font-bold text-slate-800">
                                                    {oferta.tipoSolicitud}
                                                </h3>
                                                <span className="px-2 py-0.5 bg-slate-100 text-xs rounded-full">
                                                    #{index + 1}
                                                </span>
                                            </div>

                                            <p className="text-sm text-slate-500">
                                                {oferta.programaFormacion?.nombrePrograma} • {oferta.tipoOferta} • {oferta.departamento}
                                            </p>
                                        </div>

                                        <span className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${oferta.revisado
                                            ? 'bg-green-50 text-green-700 border border-green-200'
                                            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                            }`}>
                                            <span className={`w-2 h-2 rounded-full ${oferta.revisado ? 'bg-green-500' : 'bg-yellow-500'
                                                }`}></span>
                                            {oferta.revisado ? 'Revisado' : 'Pendiente de revisión'}
                                        </span>
                                    </div>

                                    {/* Card interna como tu imagen */}
                                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">

                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                                            {/* Programa */}
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                                                    Programa de formación
                                                </p>
                                                <h4 className="text-2xl font-bold text-slate-800">
                                                    {oferta.programaFormacion?.nombrePrograma}
                                                </h4>
                                                <p className="text-sm text-slate-600 mt-1">
                                                    Duración: <span className="font-semibold">
                                                        {oferta.programaFormacion?.horas || 0} horas
                                                    </span>
                                                </p>
                                            </div>

                                            {/* Progreso */}
                                            <div className="flex-1">

                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium text-slate-600">
                                                        Progreso de inscripción
                                                    </span>
                                                    <span className="text-sm font-bold text-slate-700">
                                                        {aspirantesActuales} / {cupoTotal} aspirantes
                                                    </span>
                                                </div>

                                                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${getBarraColor(porcentaje)} transition-all duration-500`}
                                                        style={{ width: `${porcentaje}%` }}
                                                    ></div>
                                                </div>

                                                <p className="text-xs text-right mt-1 text-slate-500">
                                                    {porcentaje.toFixed(1)}% completo
                                                </p>
                                            </div>

                                            {/* Botón copiar */}
                                            <div>
                                                <button
                                                    onClick={() => copiarAlPortapapeles(oferta._id)}
                                                    className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-lg shadow-md transition"
                                                >
                                                    Copiar link
                                                </button>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>
        </div>
    )
}

export default GestionAspirantes
