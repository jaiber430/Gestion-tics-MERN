import React, { useEffect, useState } from 'react'
import HeaderCoordinador from '../components/HeaderCoordinador'
import clienteAxios from '../api/axios'
import RevisarSolicitudesCoordinador from '../components/RevisarSolicitudesCoordinador'

const Coordinador = () => {

    const [ofertas, setOfertas] = useState([])
    const [alerta, setAlerta] = useState({})

    useEffect(() => {
        const verSolicitudes = async () => {
            try {
                const [solicitudRes] = await Promise.all([
                    clienteAxios.get('/consultas/revision-coordinador')
                ])
                setOfertas(solicitudRes.data)
            } catch (error) {
                setAlerta({
                    msg: error?.response?.data?.msg,
                    error: true
                })
            }
        }
        verSolicitudes()
    }, [])

    // console.log(ofertas)
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
            <HeaderCoordinador />
            <div className="max-w-7xl mx-auto px-6 py-12">
                {ofertas.length > 0 ? (
                    <RevisarSolicitudesCoordinador ofertas={ofertas} />
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-12 text-center mt-15">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">No hay solicitudes</h3>
                        <p className="text-slate-500 text-sm">Las solicitudes aparecerán aquí cuando sean realizadas.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Coordinador
