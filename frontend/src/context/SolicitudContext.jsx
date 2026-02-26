import { createContext, useContext, useState, useCallback } from 'react'

const SolicitudContext = createContext()

export const useSolicitud = () => {
    const context = useContext(SolicitudContext)
    if (!context) throw new Error('useSolicitud debe usarse dentro de SolicitudProvider')
    return context
}

export const SolicitudProvider = ({ children, tipo }) => {
    // Estados de UI
    const [loading, setLoading] = useState(false)
    const [mensaje, setMensaje] = useState(null)
    const [error, setError] = useState(null)

    // Estados de catálogos
    const [areas, setAreas] = useState([])
    const [programasFormacion, setProgramasFormacion] = useState([])
    const [programaFormacionSeleccionado, setProgramaFormacionSeleccionado] = useState(null)
    const [programasEspeciales, setProgramasEspeciales] = useState([])
    const [programaEspecialSeleccionado, setProgramaEspecialSeleccionado] = useState(null)
    const [municipios, setMunicipios] = useState([])
    const [tiposEmpresa, setTiposEmpresa] = useState([])
    const [tipoEmpresaSeleccionado, setTipoEmpresaSeleccionado] = useState(null) // ✅ AGREGADO
    const [cargandoTiposEmpresa, setCargandoTiposEmpresa] = useState(false)

    // Estados de fechas y horas
    const [fechasSeleccionadas, setFechasSeleccionadas] = useState([])
    const [horasPorDia, setHorasPorDia] = useState(0)
    const [horasTotales, setHorasTotales] = useState(0)
    const [fechaFin, setFechaFin] = useState('')
    const [maxFecha, setMaxFecha] = useState(null)
    const [mostrarCalendario, setMostrarCalendario] = useState(false)
    const [horasCompletadas, setHorasCompletadas] = useState(false)
    const [toleranciaAlcanzada, setToleranciaAlcanzada] = useState(false)
    const [mensajeHorario, setMensajeHorario] = useState('')

    // FormData principal
    const [formData, setFormData] = useState({
        tipoOferta: '',
        area: '',
        programaFormacion: '',
        programaEspecial: '',
        cupo: '',
        municipio: '',
        direccionFormacion: '',
        subSectorEconomico: '',
        convenio: '',
        ambiente: '',
        fechaInicio: '',
        horaInicio: '',
        horaFin: '',
        tipoInstructor: '',
        nombreEmpresa: '',
        nombreResponsable: '',
        emailEmpresa: '',
        telefonoEmpresa: '',
        nitEmpresa: '',
        fechaCreacionEmpresa: '',
        direccionEmpresa: '',
        nombreContactoEmpresa: '',
        numeroEmpleadosEmpresa: '',
        tipoEmpresa: '',
        cartaSolicitud: null
    })

    const handleChange = useCallback((e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }, [])

    const setFieldValue = useCallback((name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }, [])

    const value = {
        // UI
        loading, setLoading,
        mensaje, setMensaje,
        error, setError,

        // Catálogos
        areas, setAreas,
        programasFormacion, setProgramasFormacion,
        programaFormacionSeleccionado, setProgramaFormacionSeleccionado,
        programasEspeciales, setProgramasEspeciales,
        programaEspecialSeleccionado, setProgramaEspecialSeleccionado,
        municipios, setMunicipios,
        tiposEmpresa, setTiposEmpresa,
        tipoEmpresaSeleccionado, setTipoEmpresaSeleccionado, // ✅ AGREGADO
        cargandoTiposEmpresa, setCargandoTiposEmpresa,

        // Fechas y horas
        fechasSeleccionadas, setFechasSeleccionadas,
        horasPorDia, setHorasPorDia,
        horasTotales, setHorasTotales,
        fechaFin, setFechaFin,
        maxFecha, setMaxFecha,
        mostrarCalendario, setMostrarCalendario,
        horasCompletadas, setHorasCompletadas,
        toleranciaAlcanzada, setToleranciaAlcanzada,
        mensajeHorario, setMensajeHorario,

        // Form
        formData,
        setFormData, // ✅ AGREGADO
        handleChange,
        setFieldValue,
        tipo
    }

    return (
        <SolicitudContext.Provider value={value}>
            {children}
        </SolicitudContext.Provider>
    )
}

export default SolicitudContext
