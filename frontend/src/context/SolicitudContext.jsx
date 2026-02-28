import { createContext, useContext, useState, useCallback } from 'react'

const SolicitudContext = createContext()

export const useSolicitud = () => {
    const ctx = useContext(SolicitudContext)
    if (!ctx) throw new Error('useSolicitud debe usarse dentro de SolicitudProvider')
    return ctx
}

export const SolicitudProvider = ({ children, tipo }) => {

    // UI
    const [loading, setLoading]   = useState(false)
    const [alerta, setAlerta]     = useState({})
    const mostrarAlerta = useCallback((msg, error = false) => {
        setAlerta({ msg, error })
        setTimeout(() => setAlerta({}), 4000)
    }, [])

    // Catálogos
    const [areas, setAreas]                                                     = useState([])
    const [programasFormacion, setProgramasFormacion]                           = useState([])
    const [programasEspeciales, setProgramasEspeciales]                         = useState([])
    const [municipios, setMunicipios]                                           = useState([])
    const [tiposEmpresa, setTiposEmpresa]                                       = useState([])
    const [cargandoTiposEmpresa, setCargandoTiposEmpresa]                       = useState(false)
    const [programaFormacionSeleccionado, setProgramaFormacionSeleccionado]     = useState(null)
    const [programaEspecialSeleccionado, setProgramaEspecialSeleccionado]       = useState(null)
    const [tipoEmpresaSeleccionado, setTipoEmpresaSeleccionado]                 = useState(null)

    // Horario
    const [fechasSeleccionadas, setFechasSeleccionadas] = useState([])
    const [horasPorDia, setHorasPorDia]                 = useState(0)
    const [horasTotales, setHorasTotales]               = useState(0)
    const [fechaFin, setFechaFin]                       = useState('')
    const [maxFecha, setMaxFecha]                       = useState(null)
    const [mostrarCalendario, setMostrarCalendario]     = useState(false)
    const [horasCompletadas, setHorasCompletadas]       = useState(false)
    const [toleranciaAlcanzada, setToleranciaAlcanzada] = useState(false)
    const [mensajeHorario, setMensajeHorario]           = useState('')

    // FormData
    const [formData, setFormData] = useState({
        tipoOferta: '', area: '', programaFormacion: '', programaEspecial: '',
        cupo: '', municipio: '', direccionFormacion: '', subSectorEconomico: '',
        convenio: '', ambiente: '', fechaInicio: '', horaInicio: '', horaFin: '',
        tipoInstructor: '', nombreEmpresa: '', nombreResponsable: '', emailEmpresa: '',
        telefonoEmpresa: '', nitEmpresa: '', fechaCreacionEmpresa: '', direccionEmpresa: '',
        nombreContactoEmpresa: '', numeroEmpleadosEmpresa: '', tipoEmpresa: '', cartaSolicitud: null
    })

    const handleChange = useCallback((e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }, [])

    const setFieldValue = useCallback((name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }, [])

    const resetEmpresa = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            nombreEmpresa: '', nombreResponsable: '', emailEmpresa: '',
            telefonoEmpresa: '', nitEmpresa: '', fechaCreacionEmpresa: '',
            direccionEmpresa: '', nombreContactoEmpresa: '', numeroEmpleadosEmpresa: '',
            tipoEmpresa: '', cartaSolicitud: null
        }))
        setTipoEmpresaSeleccionado(null)
    }, [])

    return (
        <SolicitudContext.Provider value={{
            tipo,
            loading, setLoading,
            alerta, mostrarAlerta,
            formData, setFormData, handleChange, setFieldValue, resetEmpresa,
            areas, setAreas,
            programasFormacion, setProgramasFormacion,
            programasEspeciales, setProgramasEspeciales,
            municipios, setMunicipios,
            tiposEmpresa, setTiposEmpresa,
            cargandoTiposEmpresa, setCargandoTiposEmpresa,
            programaFormacionSeleccionado, setProgramaFormacionSeleccionado,
            programaEspecialSeleccionado, setProgramaEspecialSeleccionado,
            tipoEmpresaSeleccionado, setTipoEmpresaSeleccionado,
            fechasSeleccionadas, setFechasSeleccionadas,
            horasPorDia, setHorasPorDia,
            horasTotales, setHorasTotales,
            fechaFin, setFechaFin,
            maxFecha, setMaxFecha,
            mostrarCalendario, setMostrarCalendario,
            horasCompletadas, setHorasCompletadas,
            toleranciaAlcanzada, setToleranciaAlcanzada,
            mensajeHorario, setMensajeHorario,
        }}>
            {children}
        </SolicitudContext.Provider>
    )
}

export default SolicitudContext
