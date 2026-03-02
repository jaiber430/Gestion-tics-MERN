import { useEffect, useState } from 'react'
import HeaderFuncionario from './HeaderFuncionario'
import clienteAxios from '../api/axios'
import Alerta from './Alerta'
import { useParams } from 'react-router-dom'

const DetallesSolicitudes = () => {

    const params = useParams()

    const [solicitud, setSolicitud] = useState('')
    const [alerta, setAlerta] = useState({})

    useEffect(() => {
        const obtenerSolicitudes = async () => {
            try {
                const [solicitudRes] = await Promise.all([
                    clienteAxios.get(`/consultas/solicitudes-funcionario/${params.id}`)
                ])
                setSolicitud(solicitudRes.data)
            } catch (error) {
                setAlerta({
                    msg: error?.response?.data?.msg,
                    error: true
                })
                setTimeout(() => {
                    setAlerta({})
                }, 3000)
            }
        }
        obtenerSolicitudes()
    }, [])

    console.log(solicitud)

    return (
        <div>
            <HeaderFuncionario />
        </div>
    )
}

export default DetallesSolicitudes
