import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSolicitud } from '../context/SolicitudContext'
import clienteAxios from '../api/axios'

const useSolicitudBase = () => {
    const navigate = useNavigate()
    const {
        tipo, mostrarAlerta, setLoading,
        formData, setFormData,
        setAreas, setMunicipios, setProgramasEspeciales,
        setTiposEmpresa, setCargandoTiposEmpresa,
        fechasSeleccionadas,
        horasPorDia, setHorasPorDia,
        horasTotales, setHorasTotales,
        fechaFin, setFechaFin,
        setHorasCompletadas, setToleranciaAlcanzada, setMensajeHorario,
        programaFormacionSeleccionado,
        setProgramasFormacion, setProgramaFormacionSeleccionado,
    } = useSolicitud()

    // Calcular horas por día cuando cambian horaInicio/horaFin
    const calcularDuracion = useCallback((inicio, fin) => {
        if (!inicio || !fin) return 0
        const [h1, m1] = inicio.split(':').map(Number)
        const [h2, m2] = fin.split(':').map(Number)
        return (h2 * 60 + m2 - (h1 * 60 + m1)) / 60
    }, [])

    useEffect(() => {
        const horas = calcularDuracion(formData.horaInicio, formData.horaFin)
        setHorasPorDia(horas > 0 ? horas : 0)
    }, [formData.horaInicio, formData.horaFin, calcularDuracion, setHorasPorDia])

    // Calcular horas totales y estado al cambiar fechas o horas/día
    useEffect(() => {
        if (!programaFormacionSeleccionado || !horasPorDia) {
            setHorasTotales(0)
            setHorasCompletadas(false)
            setToleranciaAlcanzada(false)
            setMensajeHorario('')
            setFechaFin('')
            return
        }

        const horasRequeridas = programaFormacionSeleccionado.horas
        const horasMaximas = horasRequeridas + horasPorDia
        const total = fechasSeleccionadas.length * horasPorDia

        setHorasTotales(total)

        if (fechasSeleccionadas.length > 0) {
            const ordenadas = [...fechasSeleccionadas].sort((a, b) => new Date(a) - new Date(b))
            const ultima = ordenadas[ordenadas.length - 1]
            const [y, m, d] = ultima.split('-')
            setFechaFin(new Date(y, m - 1, d).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }))
        } else {
            setFechaFin('')
        }

        if (total === 0) {
            setHorasCompletadas(false)
            setToleranciaAlcanzada(false)
            setMensajeHorario('')
        } else if (total < horasRequeridas) {
            setHorasCompletadas(false)
            setToleranciaAlcanzada(false)
            setMensajeHorario(`Faltan ${horasRequeridas - total}h para completar el programa`)
        } else if (total === horasRequeridas) {
            setHorasCompletadas(true)
            setToleranciaAlcanzada(false)
            setMensajeHorario('✓ Horas completadas exactamente')
        } else if (total <= horasMaximas) {
            setHorasCompletadas(true)
            setToleranciaAlcanzada(true)
            setMensajeHorario(`Tolerancia aplicada: ${total}h de ${horasRequeridas}h requeridas (máx ${horasMaximas}h)`)
        } else {
            setHorasCompletadas(false)
            setToleranciaAlcanzada(false)
            setMensajeHorario(`Excede el máximo permitido de ${horasMaximas}h`)
        }
    }, [fechasSeleccionadas, horasPorDia, programaFormacionSeleccionado,
        setHorasTotales, setHorasCompletadas, setToleranciaAlcanzada,
        setMensajeHorario, setFechaFin])

    // Cargar catálogos al montar
    useEffect(() => {
        const cargarCatalogos = async () => {
            try {
                const [areasRes, municipiosRes, especilesRes] = await Promise.all([
                    clienteAxios.get('/catalogos/areas'),
                    clienteAxios.get('/catalogos/municipios'),
                    clienteAxios.get(`/catalogos/programas-especiales`, {
                        params: { tipo } // Esto envía ?tipo=campesena
                    })
                ])
                setAreas(areasRes.data)
                setMunicipios(municipiosRes.data)
                setProgramasEspeciales(especilesRes.data)
            } catch (err) {
                console.log(err)
                mostrarAlerta('Error al cargar catálogos', true)
            }
        }

        const cargarTiposEmpresa = async () => {
            if (tipo === 'campesena') return
            try {
                setCargandoTiposEmpresa(true)
                const { data } = await clienteAxios.get('/catalogos/tipos-empresa-regular')
                setTiposEmpresa(data)
            } catch {
                mostrarAlerta('Error al cargar tipos de empresa', true)
            } finally {
                setCargandoTiposEmpresa(false)
            }
        }

        cargarCatalogos()
        cargarTiposEmpresa()
    }, [tipo])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.horaInicio || !formData.horaFin) {
            mostrarAlerta('Configura el horario de inicio y fin', true); return
        }
        if (fechasSeleccionadas.length === 0) {
            mostrarAlerta('Selecciona al menos un día en el calendario', true); return
        }

        try {
            setLoading(true)
            const fd = new FormData()
            Object.keys(formData).forEach(key => {
                if (key !== 'cartaSolicitud' && formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
                    fd.append(key, formData[key])
                }
            })
            if (formData.cartaSolicitud) fd.append('cartaSolicitud', formData.cartaSolicitud)
            fechasSeleccionadas.forEach(f => fd.append('fechasSeleccionadas[]', f))

            await clienteAxios.post(`/solicitudes/crear-solicitud/${tipo}`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            mostrarAlerta('Solicitud creada exitosamente')
            setTimeout(() => navigate('/instructor'), 2000)
        } catch (err) {
            mostrarAlerta(err.response?.data?.msg || 'Error al crear la solicitud', true)
        } finally {
            setLoading(false)
        }
    }

    return { handleSubmit }
}

export default useSolicitudBase
