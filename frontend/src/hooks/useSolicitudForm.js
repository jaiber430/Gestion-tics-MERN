import { useEffect, useCallback } from 'react'
import { useSolicitud } from '../context/SolicitudContext'
import clienteAxios from '../api/axios'

export const useSolicitudForm = () => {
    const {
        tipo,
        setAreas, setMunicipios, setProgramasEspeciales,
        setTiposEmpresa, setCargandoTiposEmpresa, setError, setLoading, setMensaje,
        formData,
        setHorasPorDia,
        setFechaFin, setHorasCompletadas, setToleranciaAlcanzada,
        fechasSeleccionadas, horasPorDia, programaFormacionSeleccionado,
        setHorasTotales, setMensajeHorario, horasTotales
    } = useSolicitud()

    // Calcular duración entre dos horas
    const calcularDuracion = useCallback((horaInicio, horaFin) => {
        if (!horaInicio || !horaFin) return 0

        const [hInicio, mInicio] = horaInicio.split(':').map(Number)
        const [hFin, mFin] = horaFin.split(':').map(Number)

        let minutosInicio = hInicio * 60 + mInicio
        let minutosFin = hFin * 60 + mFin

        if (minutosFin < minutosInicio) minutosFin += 24 * 60

        return (minutosFin - minutosInicio) / 60
    }, [])

    // Efecto: Calcular horas por día
    useEffect(() => {
        const duracion = calcularDuracion(formData.horaInicio, formData.horaFin)
        setHorasPorDia(duracion)
    }, [formData.horaInicio, formData.horaFin, calcularDuracion, setHorasPorDia])

    // Efecto: Calcular totales y validaciones
    useEffect(() => {
        if (!programaFormacionSeleccionado?.horas) {
            setHorasTotales(0)
            setMensajeHorario('Selecciona un programa de formación')
            setFechaFin('')
            setHorasCompletadas(false)
            setToleranciaAlcanzada(false)
            return
        }

        const horasRequeridas = programaFormacionSeleccionado.horas
        const horasMaximasPermitidas = horasRequeridas + horasPorDia
        const total = fechasSeleccionadas.length * horasPorDia

        setHorasTotales(total)

        if (fechasSeleccionadas.length > 0) {
            const fechasOrdenadas = [...fechasSeleccionadas].sort((a, b) => new Date(a) - new Date(b))
            const [year, month, day] = fechasOrdenadas[fechasOrdenadas.length - 1].split('-')
            setFechaFin(new Date(year, month - 1, day).toLocaleDateString('es-ES', {
                day: '2-digit', month: '2-digit', year: 'numeric'
            }))
        } else {
            setFechaFin('')
        }

        const completadasExactas = total === horasRequeridas
        const enTolerancia = total > horasRequeridas && total <= horasMaximasPermitidas
        const excedeTolerancia = total > horasMaximasPermitidas
        const faltanHoras = total < horasRequeridas

        setHorasCompletadas(completadasExactas || enTolerancia)
        setToleranciaAlcanzada(enTolerancia)

        if (fechasSeleccionadas.length === 0) {
            setMensajeHorario(`Selecciona los días. Requeridas: ${horasRequeridas}h (máx permitido: ${horasMaximasPermitidas}h)`)
        } else if (faltanHoras) {
            const faltan = horasRequeridas - total
            const diasNecesarios = Math.ceil(faltan / horasPorDia)
            setMensajeHorario(`Faltan ${faltan}h (${diasNecesarios} día${diasNecesarios !== 1 ? 's' : ''} más)`)
        } else if (completadasExactas) {
            setMensajeHorario("Horas completas exactas")
        } else if (enTolerancia) {
            const excede = total - horasRequeridas
            setMensajeHorario(`Completado con ${excede}h extra (dentro de tolerancia)`)
        } else if (excedeTolerancia) {
            const excede = total - horasRequeridas
            setMensajeHorario(`Excede por ${excede}h. Máximo permitido: ${horasMaximasPermitidas}h`)
        }
    }, [fechasSeleccionadas, horasPorDia, programaFormacionSeleccionado, setFechaFin, setHorasCompletadas, setHorasTotales, setMensajeHorario, setToleranciaAlcanzada])

    // Cargar catálogos iniciales
    useEffect(() => {
        const cargarCatalogos = async () => {
            try {
                const [areasRes, municipiosRes, especialesRes] = await Promise.all([
                    clienteAxios.get('/catalogos/areas'),
                    clienteAxios.get('/catalogos/municipios'),
                    clienteAxios.get(`/catalogos/programas-especiales?tipo=${tipo}`)
                ])

                setAreas(areasRes.data)
                setMunicipios(municipiosRes.data)
                setProgramasEspeciales(especialesRes.data)
            } catch (err) {
                console.error(err)
            }
        }

        cargarCatalogos()
    }, [tipo, setAreas, setMunicipios, setProgramasEspeciales])

    // Cargar tipos de empresa
    useEffect(() => {
        const cargarTiposEmpresa = async () => {
            setCargandoTiposEmpresa(true)
            try {
                const { data } = await clienteAxios.get('/catalogos/tipos-empresa-regular')
                setTiposEmpresa(data)
            } catch (err) {
                console.error('Error cargando tipos de empresa:', err)
                setError('Error al cargar los tipos de empresa')
            } finally {
                setCargandoTiposEmpresa(false)
            }
        }

        cargarTiposEmpresa()
    }, [setTiposEmpresa, setCargandoTiposEmpresa, setError])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!programaFormacionSeleccionado) {
            setError("Debe seleccionar un programa de formación")
            return false
        }

        if (fechasSeleccionadas.length === 0) {
            setError("Debe seleccionar al menos una fecha")
            return false
        }

        if (!formData.horaInicio || !formData.horaFin) {
            setError("Debe seleccionar hora de inicio y hora de fin")
            return false
        }

        const horasRequeridas = programaFormacionSeleccionado.horas
        const horasMaximasPermitidas = horasRequeridas + horasPorDia

        if (horasTotales < horasRequeridas || horasTotales > horasMaximasPermitidas) {
            setError(`Las horas deben estar entre ${horasRequeridas}h y ${horasMaximasPermitidas}h (máximo 1 día extra). Tienes ${horasTotales}h`)
            return false
        }

        const fechaInicioDate = new Date(formData.fechaInicio)
        const primeraFecha = new Date(fechasSeleccionadas[0])

        if (fechaInicioDate > primeraFecha) {
            setError("La fecha de inicio no puede ser mayor a la primera fecha para dictar el curso")
            return false
        }

        setLoading(true)
        setError(null)

        try {
            const fechasOrdenadas = [...fechasSeleccionadas].sort((a, b) => new Date(a) - new Date(b))
            const [yearFin, monthFin, dayFin] = fechasOrdenadas[fechasOrdenadas.length - 1].split('-').map(Number)
            const fechaFinDate = new Date(yearFin, monthFin - 1, dayFin)

            const formDataToSend = new FormData()

            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined && key !== "cartaSolicitud") {
                    formDataToSend.append(key, formData[key])
                }
            })

            if (formData.cartaSolicitud) {
                formDataToSend.append("cartaSolicitud", formData.cartaSolicitud)
            }

            fechasSeleccionadas.forEach(fecha => formDataToSend.append("fechasSeleccionadas", fecha))
            formDataToSend.append("fechaFin", fechaFinDate.toISOString())
            formDataToSend.append("tipoSolicitud", tipo === "campesena" ? "CampeSENA" : "Regular")

            const { data } = await clienteAxios.post(
                `/solicitudes/crear-solicitud/${tipo}`,
                formDataToSend
            )

            setMensaje(data.msg)
            return true

        } catch (err) {
            setError(err.response?.data?.msg || 'Error al crear solicitud')
            return false
        } finally {
            setLoading(false)
        }
    }

    return { handleSubmit }
}
