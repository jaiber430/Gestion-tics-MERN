// hooks/useSolicitud.js
import { useState } from 'react'
import clienteAxios from '../../api/axios'

export const useSolicitud = (tipo, navigate) => {
    const [loading, setLoading] = useState(false)
    const [mensaje, setMensaje] = useState(null)
    const [error, setError] = useState(null)

    const enviarSolicitud = async (formData, fechasSeleccionadas, fechaFin) => {
        setLoading(true)
        setError(null)

        try {
            const fechasComoDate = fechasSeleccionadas.map(fecha => {
                const [year, month, day] = fecha.split('-').map(Number)
                return new Date(year, month - 1, day)
            })

            const dataToSend = {
                ...formData,
                fechasSeleccionadas: fechasComoDate,
                fechaFin: fechaFin,
                tipoSolicitud: tipo === "campesena" ? "CampeSENA" : "Regular"
            }

            const { data } = await clienteAxios.post(
                `/solicitudes/crear-solicitud/${tipo}`,
                dataToSend
            )

            setMensaje(data.msg)
            setTimeout(() => navigate('/instructor'), 2000)
            return { success: true, data }

        } catch (err) {
            setError(err.response?.data?.msg || 'Error al crear solicitud')
            return { success: false, error: err.response?.data?.msg }
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        mensaje,
        error,
        setError,
        enviarSolicitud
    }
}
