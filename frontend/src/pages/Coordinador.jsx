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
        <div>
            <HeaderCoordinador />
            <div>
                {ofertas.length >= 0 ? <RevisarSolicitudesCoordinador ofertas={ofertas}/> : <p>No existen solicitudes</p>}
            </div>
        </div>
    )
}

export default Coordinador
