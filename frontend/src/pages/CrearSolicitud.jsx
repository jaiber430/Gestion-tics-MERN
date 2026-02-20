import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import clienteAxios from '../api/axios'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const CrearSolicitud = () => {

    const { tipo } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [mensaje, setMensaje] = useState(null)
    const [error, setError] = useState(null)

    const [areas, setAreas] = useState([])
    const [programasFormacion, setProgramasFormacion] = useState([])
    const [programaFormacionSeleccionado, setProgramaFormacionSeleccionado] = useState(null)
    const [programasEspeciales, setProgramasEspeciales] = useState([])
    const [programaEspecialSeleccionado, setProgramaEspecialSeleccionado] = useState(null)
    const [municipios, setMunicipios] = useState([])

    // Estados para tipos de empresa
    const [tiposEmpresa, setTiposEmpresa] = useState([])
    const [tipoEmpresaSeleccionado, setTipoEmpresaSeleccionado] = useState(null)
    const [cargandoTiposEmpresa, setCargandoTiposEmpresa] = useState(false)

    const [fechasSeleccionadas, setFechasSeleccionadas] = useState([])

    const [horasPorDia, setHorasPorDia] = useState(0)
    const [horasTotales, setHorasTotales] = useState(0)
    const [mensajeHorario, setMensajeHorario] = useState('')
    const [fechaFin, setFechaFin] = useState('')

    const [mostrarCalendario, setMostrarCalendario] = useState(false)
    const [maxFecha, setMaxFecha] = useState(null)
    const [horasCompletadas, setHorasCompletadas] = useState(false)
    const [toleranciaAlcanzada, setToleranciaAlcanzada] = useState(false)

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

        // Datos de empresa (para oferta cerrada)
        nombreEmpresa: '',
        nombreResponsable: '',
        emailEmpresa: '',
        telefonoEmpresa: '',
        nitEmpresa: '',
        fechaCreacionEmpresa: '',
        direccionEmpresa: '',
        nombreContactoEmpresa: '',
        numeroEmpleadosEmpresa: '',
        tipoEmpresa: '', // ID del tipo de empresa seleccionado
        cartaSolicitud: null
    })

    // Calcular horas por día
    const calcularDuracion = (horaInicio, horaFin) => {
        if (!horaInicio || !horaFin) return 0

        const [hInicio, mInicio] = horaInicio.split(':').map(Number)
        const [hFin, mFin] = horaFin.split(':').map(Number)

        let minutosInicio = hInicio * 60 + mInicio
        let minutosFin = hFin * 60 + mFin

        if (minutosFin < minutosInicio) {
            minutosFin += 24 * 60
        }

        const duracionMinutos = minutosFin - minutosInicio
        const duracionHoras = duracionMinutos / 60

        return duracionHoras
    }

    useEffect(() => {
        const duracion = calcularDuracion(formData.horaInicio, formData.horaFin)
        setHorasPorDia(duracion)
    }, [formData.horaInicio, formData.horaFin])

    // Efecto para calcular horas totales y fecha fin
    useEffect(() => {
        if (!programaFormacionSeleccionado || !programaFormacionSeleccionado.horas) {
            setHorasTotales(0)
            setMensajeHorario('Selecciona un programa de formación')
            setFechaFin('')
            setHorasCompletadas(false)
            setToleranciaAlcanzada(false)
            return
        }

        const horasRequeridas = programaFormacionSeleccionado.horas
        const total = fechasSeleccionadas.length * horasPorDia
        setHorasTotales(total)

        // Calcular límites de tolerancia
        const horasMaximasPermitidas = horasRequeridas + horasPorDia // 1 día extra permitido

        // Calcular fecha fin
        if (fechasSeleccionadas.length > 0) {
            const fechasOrdenadas = [...fechasSeleccionadas].sort((a, b) => new Date(a) - new Date(b))
            const ultimaFecha = fechasOrdenadas[fechasOrdenadas.length - 1]
            const [year, month, day] = ultimaFecha.split('-')
            const fecha = new Date(year, month - 1, day)
            setFechaFin(fecha.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }))
        } else {
            setFechaFin('')
        }

        // Estados de validación
        const completadasExactas = total === horasRequeridas
        const enTolerancia = total > horasRequeridas && total <= horasMaximasPermitidas
        const excedeTolerancia = total > horasMaximasPermitidas
        const faltanHoras = total < horasRequeridas

        setHorasCompletadas(completadasExactas || enTolerancia)
        setToleranciaAlcanzada(enTolerancia)

        // Mensajes de validación
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
    }, [fechasSeleccionadas, horasPorDia, programaFormacionSeleccionado])

    // Cargar catálogos
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
    }, [tipo])

    // Cargar tipos de empresa cuando se selecciona oferta cerrada
    useEffect(() => {
        const cargarTiposEmpresa = async () => {
            setCargandoTiposEmpresa(true)
            try {
                const endpoint = '/catalogos/tipos-empresa-regular'
                const { data } = await clienteAxios.get(endpoint)
                setTiposEmpresa(data)
            } catch (err) {
                console.error('Error cargando tipos de empresa:', err)
                setError('Error al cargar los tipos de empresa')
            } finally {
                setCargandoTiposEmpresa(false)
            }
        }

        cargarTiposEmpresa()
    }, [])

    // Cargar programas por área
    useEffect(() => {
        if (!formData.area) {
            setProgramasFormacion([])
            setProgramaFormacionSeleccionado(null)
            return
        }

        const cargarProgramas = async () => {
            try {
                const { data } = await clienteAxios.get(
                    `/catalogos/programas-formacion/${formData.area}`
                )
                setProgramasFormacion(data)
                setProgramaFormacionSeleccionado(null)
                setFormData(prev => ({ ...prev, programaFormacion: '' }))
            } catch (err) {
                console.error(err)
            }
        }

        cargarProgramas()
    }, [formData.area])

    const handleSeleccionDia = (date) => {
        if (!horasPorDia || horasPorDia <= 0) {
            setError("Primero configura el horario de inicio y fin")
            return
        }

        if (!programaFormacionSeleccionado) {
            setError("Primero selecciona un programa de formación")
            return
        }

        const horasRequeridas = programaFormacionSeleccionado.horas
        const horasMaximasPermitidas = horasRequeridas + horasPorDia // Solo 1 día extra

        const fecha = new Date(date)
        const year = fecha.getFullYear()
        const month = String(fecha.getMonth() + 1).padStart(2, '0')
        const day = String(fecha.getDate()).padStart(2, '0')
        const fechaStr = `${year}-${month}-${day}`

        const yaSeleccionada = fechasSeleccionadas.includes(fechaStr)
        let nuevasFechas = [...fechasSeleccionadas]

        // Si quiere agregar nuevo día
        if (!yaSeleccionada) {
            const horasConNuevoDia = (nuevasFechas.length + 1) * horasPorDia

            // BLOQUEAR si excede el máximo permitido (1 día extra)
            if (horasConNuevoDia > horasMaximasPermitidas) {
                const horasActuales = nuevasFechas.length * horasPorDia
                setError(`No puedes agregar más días. Ya tienes ${horasActuales}h y el máximo permitido es ${horasMaximasPermitidas}h (${horasRequeridas}h + 1 día extra)`)
                return
            }
        }

        if (yaSeleccionada) {
            nuevasFechas = nuevasFechas.filter(f => f !== fechaStr)
        } else {
            nuevasFechas.push(fechaStr)
        }

        nuevasFechas.sort((a, b) => new Date(a) - new Date(b))
        setFechasSeleccionadas(nuevasFechas)
        setError(null)
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleProgramaChange = (e) => {
        const selectedId = e.target.value
        const selectedProgram = programasFormacion.find(p => p._id === selectedId)

        setFormData(prev => ({
            ...prev,
            programaFormacion: selectedId
        }))

        setProgramaFormacionSeleccionado(selectedProgram || null)
        setFechasSeleccionadas([])
        setFechaFin('')
        setHorasCompletadas(false)
        setToleranciaAlcanzada(false)
    }

    const handleProgramaEspecialChange = (e) => {
        const selectedId = e.target.value
        const selectedProgram = programasEspeciales.find(p => p._id === selectedId)

        setFormData(prev => ({
            ...prev,
            programaEspecial: selectedId
        }))

        setProgramaEspecialSeleccionado(selectedProgram || null)
    }

    const handleTipoEmpresaChange = (e) => {
        const selectedId = e.target.value
        const selectedTipo = tiposEmpresa.find(t => t._id === selectedId)

        setFormData(prev => ({
            ...prev,
            tipoEmpresa: selectedId
        }))

        setTipoEmpresaSeleccionado(selectedTipo || null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // --- Validaciones iniciales ---
        if (!programaFormacionSeleccionado) {
            setError("Debe seleccionar un programa de formación")
            return
        }

        if (fechasSeleccionadas.length === 0) {
            setError("Debe seleccionar al menos una fecha")
            return
        }

        if (!formData.horaInicio || !formData.horaFin) {
            setError("Debe seleccionar hora de inicio y hora de fin")
            return
        }

        const horasRequeridas = programaFormacionSeleccionado.horas
        const horasMaximasPermitidas = horasRequeridas + horasPorDia

        if (horasTotales < horasRequeridas || horasTotales > horasMaximasPermitidas) {
            setError(`Las horas deben estar entre ${horasRequeridas}h y ${horasMaximasPermitidas}h (máximo 1 día extra). Tienes ${horasTotales}h`)
            return
        }

        const fechaInicioDate = new Date(formData.fechaInicio)
        const primeraFecha = new Date(fechasSeleccionadas[0])

        if (fechaInicioDate > primeraFecha) {
            setError("La fecha de inicio no puede ser mayor a la primera fecha para dictar el curso")
            return
        }

        // --- Preparación para envío ---
        setLoading(true)
        setError(null)

        try {
            const fechasOrdenadas = [...fechasSeleccionadas].sort(
                (a, b) => new Date(a) - new Date(b)
            )
            const ultimaFecha = fechasOrdenadas[fechasOrdenadas.length - 1]
            const [yearFin, monthFin, dayFin] = ultimaFecha.split('-').map(Number)
            const fechaFinDate = new Date(yearFin, monthFin - 1, dayFin)

            // --- Crear FormData único ---
            const formDataToSend = new FormData()

            // Agregar campos del formulario excepto cartaSolicitud
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined && key !== "cartaSolicitud") {
                    formDataToSend.append(key, formData[key])
                }
            })

            // Agregar cartaSolicitud si existe
            if (formData.cartaSolicitud) {
                formDataToSend.append("cartaSolicitud", formData.cartaSolicitud)
            }

            // Agregar fechas y fechaFin
            fechasSeleccionadas.forEach(fecha => formDataToSend.append("fechasSeleccionadas", fecha))
            formDataToSend.append("fechaFin", fechaFinDate.toISOString())

            // Agregar tipoSolicitud basado en tipo
            formDataToSend.append("tipoSolicitud", tipo === "campesena" ? "CampeSENA" : "Regular")

            // --- Enviar datos al backend ---
            const { data } = await clienteAxios.post(
                `/solicitudes/crear-solicitud/${tipo}`,
                formDataToSend
            )

            setMensaje(data.msg)

            // Redirigir después de 2 segundos
            setTimeout(() => navigate('/instructor'), 2000)

        } catch (err) {
            setError(err.response?.data?.msg || 'Error al crear solicitud')
        } finally {
            setLoading(false)
        }
    }
    
    const tileDisabled = ({ date, view }) => {
        if (view === 'month') {
            const day = date.getDay()
        }
        return false
    }

    // Función para obtener el nombre del tipo de empresa según el modelo
    const getNombreTipoEmpresa = (tipo) => {
        if (!tipo) return 'No disponible'

        // Si es CampeSENA, usa tipoEmpresa
        if (this?.tipo === "campesena") {
            return tipo.tipoEmpresa || 'No disponible'
        }
        // Si es Regular, usa tipoEmpresaRegular
        return tipo.tipoEmpresaRegular || 'No disponible'
    }

    return (
        <div className="flex justify-center mt-10">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl">

                <button
                    onClick={() => navigate('/instructor')}
                    className="text-blue-600 mb-4 hover:underline"
                >
                    ← Volver
                </button>

                <h2 className="text-2xl font-bold mb-6">
                    Crear Solicitud {tipo === "campesena" ? "CampeSENA" : "Regular"}
                </h2>

                {mensaje && (
                    <div className="bg-green-100 border border-green-400 text-green-700 p-3 mb-4 rounded">
                        {mensaje}
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 p-3 mb-4 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

                    {/* SECCIÓN 1: DATOS BÁSICOS */}
                    <select
                        name="tipoOferta"
                        onChange={handleChange}
                        value={formData.tipoOferta}
                        className="p-2 border rounded"
                        required
                    >
                        <option value="">Tipo Oferta</option>
                        <option value="Abierta">Abierta</option>
                        <option value="Cerrada">Cerrada</option>
                    </select>

                    <input
                        name="cupo"
                        placeholder="Cupo"
                        onChange={handleChange}
                        value={formData.cupo}
                        className="p-2 border rounded"
                        type="number"
                        min="1"
                        required
                    />

                    <select
                        name="area"
                        onChange={handleChange}
                        value={formData.area}
                        className="p-2 border rounded"
                        required
                    >
                        <option value="">Seleccione Área</option>
                        {areas.map(a => (
                            <option key={a._id} value={a._id}>{a.area}</option>
                        ))}
                    </select>

                    <select
                        name="programaFormacion"
                        onChange={handleProgramaChange}
                        value={formData.programaFormacion}
                        className="p-2 border rounded"
                        required
                    >
                        <option value="">Programa Formación</option>
                        {programasFormacion.map(p => (
                            <option key={p._id} value={p._id}>
                                {p.nombrePrograma}
                            </option>
                        ))}
                    </select>

                    {/* DATOS ADICIONALES DEL PROGRAMA DE FORMACIÓN */}
                    {programaFormacionSeleccionado && (
                        <>
                            <div className="col-span-2 grid grid-cols-3 gap-4 mt-2 mb-2">
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase font-semibold mb-1">
                                        Código del Programa
                                    </label>
                                    <input
                                        type="text"
                                        value={programaFormacionSeleccionado.codigoPrograma || 'No disponible'}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase font-semibold mb-1">
                                        Versión
                                    </label>
                                    <input
                                        type="text"
                                        value={programaFormacionSeleccionado.versionPrograma || 'No disponible'}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase font-semibold mb-1">
                                        Modalidad
                                    </label>
                                    <input
                                        type="text"
                                        value={programaFormacionSeleccionado.modalidad || 'PRESENCIAL'}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-700"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <select
                        name="programaEspecial"
                        onChange={handleProgramaEspecialChange}
                        value={formData.programaEspecial}
                        className="p-2 border rounded"
                        required
                    >
                        <option value="">Programa Especial</option>
                        {programasEspeciales.map(p => (
                            <option key={p._id} value={p._id}>
                                {p.programaEspecial}
                            </option>
                        ))}
                    </select>

                    <select
                        name="municipio"
                        onChange={handleChange}
                        value={formData.municipio}
                        className="p-2 border rounded"
                        required
                    >
                        <option value="">Municipio</option>
                        {municipios.map(m => (
                            <option key={m._id} value={m._id}>{m.municipios}</option>
                        ))}
                    </select>

                    {/* SECCIÓN 3: HORARIO */}
                    <input
                        type="date"
                        name="fechaInicio"
                        onChange={(e) => {
                            handleChange(e)
                            const inicio = new Date(e.target.value)
                            const max = new Date(inicio)
                            max.setMonth(max.getMonth() + 4)
                            setMaxFecha(max)
                            setMostrarCalendario(true)
                        }}
                        value={formData.fechaInicio}
                        className="p-2 border rounded"
                        required
                    />

                    <input
                        type="time"
                        name="horaInicio"
                        onChange={handleChange}
                        value={formData.horaInicio}
                        className="p-2 border rounded"
                        required
                    />

                    <input
                        type="time"
                        name="horaFin"
                        onChange={handleChange}
                        value={formData.horaFin}
                        className="p-2 border rounded"
                        required
                    />

                    {/* SECCIÓN 4: FECHA FIN (READ ONLY) */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha de finalización del curso
                        </label>
                        <input
                            type="text"
                            value={fechaFin || 'Selecciona días en el calendario'}
                            readOnly
                            className={`w-full p-2 border rounded bg-gray-50 ${fechaFin ? 'border-green-500 text-green-700 font-semibold' : 'border-gray-300 text-gray-500'
                                }`}
                        />
                    </div>

                    {/* SECCIÓN 5: DATOS DE UBICACIÓN  */}
                    <input
                        name="direccionFormacion"
                        placeholder="Dirección de formación"
                        onChange={handleChange}
                        value={formData.direccionFormacion}
                        className="p-2 border rounded col-span-2"
                        required
                    />

                    <input
                        name="subSectorEconomico"
                        placeholder="Subsector económico"
                        onChange={handleChange}
                        value={formData.subSectorEconomico}
                        className="p-2 border rounded"
                        required
                    />

                    <input
                        name="convenio"
                        placeholder="Convenio"
                        onChange={handleChange}
                        value={formData.convenio}
                        className="p-2 border rounded"
                        required
                    />

                    <input
                        name="ambiente"
                        placeholder="Ambiente"
                        onChange={handleChange}
                        value={formData.ambiente}
                        className="p-2 border rounded"
                        required
                    />

                    {tipo === "campesena" && (
                        <select
                            name="tipoInstructor"
                            onChange={handleChange}
                            value={formData.tipoInstructor}
                            className="p-2 border rounded col-span-2"
                            required
                        >
                            <option value="">Tipo Instructor</option>
                            <option value="TECNICO">Técnico</option>
                            <option value="EMPRESARIAL">Empresarial</option>
                            <option value="FULLPOPULAR">Full Popular</option>
                        </select>
                    )}

                    {/*  DATOS DE EMPRESA (SOLO PARA OFERTA CERRADA) */}
                    {formData.tipoOferta === "Cerrada" && (
                        <div className="col-span-2 mt-4 border-t pt-4">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                Datos de la Empresa Solicitante
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    name="nombreEmpresa"
                                    placeholder="Nombre de la empresa"
                                    onChange={handleChange}
                                    value={formData.nombreEmpresa}
                                    className="p-2 border rounded"
                                    required
                                />
                                <input
                                    name="nitEmpresa"
                                    placeholder="NIT"
                                    onChange={handleChange}
                                    value={formData.nitEmpresa}
                                    className="p-2 border rounded"
                                    type="number"
                                    required
                                />
                                <input
                                    name="nombreResponsable"
                                    placeholder="Nombre del responsable"
                                    onChange={handleChange}
                                    value={formData.nombreResponsable}
                                    className="p-2 border rounded"
                                    required
                                />
                                <input
                                    name="emailEmpresa"
                                    placeholder="Email de la empresa"
                                    onChange={handleChange}
                                    value={formData.emailEmpresa}
                                    className="p-2 border rounded"
                                    type="email"
                                    required
                                />
                                <input
                                    name="telefonoEmpresa"
                                    placeholder="Teléfono"
                                    onChange={handleChange}
                                    value={formData.telefonoEmpresa}
                                    className="p-2 border rounded"
                                    type="number"
                                    required
                                />
                                <input
                                    name="fechaCreacionEmpresa"
                                    type="date"
                                    placeholder="Fecha de creación"
                                    onChange={handleChange}
                                    value={formData.fechaCreacionEmpresa}
                                    className="p-2 border rounded"
                                    required
                                />
                                <input
                                    name="direccionEmpresa"
                                    placeholder="Dirección de la empresa"
                                    onChange={handleChange}
                                    value={formData.direccionEmpresa}
                                    className="p-2 border rounded col-span-2"
                                    required
                                />
                                <input
                                    name="nombreContactoEmpresa"
                                    placeholder="Nombre del contacto"
                                    onChange={handleChange}
                                    value={formData.nombreContactoEmpresa}
                                    className="p-2 border rounded"
                                    required
                                />
                                <input
                                    name="numeroEmpleadosEmpresa"
                                    placeholder="Número de empleados"
                                    onChange={handleChange}
                                    value={formData.numeroEmpleadosEmpresa}
                                    className="p-2 border rounded"
                                    type="number"
                                    required
                                />

                                {/* Selector de tipo de empresa */}
                                <select
                                    name="tipoEmpresa"
                                    onChange={handleTipoEmpresaChange}
                                    value={formData.tipoEmpresa}
                                    className="p-2 border rounded col-span-2"
                                    required
                                    disabled={cargandoTiposEmpresa}
                                >
                                    <option value="">
                                        {cargandoTiposEmpresa
                                            ? 'Cargando tipos de empresa...'
                                            : 'Seleccione tipo de empresa'}
                                    </option>
                                    {tiposEmpresa.map(te => (
                                        <option key={te._id} value={te._id}>
                                            {te.tipoEmpresaRegular}
                                        </option>
                                    ))}
                                </select>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Carta de solicitud (PDF)
                                    </label>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                cartaSolicitud: e.target.files[0] // Guardamos el archivo
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* INFO DE HORAS CON TOLERANCIA */}
                    <div className="col-span-2 bg-gray-100 p-4 rounded mt-4">
                        <div className="grid grid-cols-4 gap-4 text-center">
                            <div className="bg-white p-2 rounded shadow-sm">
                                <p className="text-xs text-gray-500 uppercase font-semibold">Horas por día</p>
                                <p className="text-2xl font-bold text-blue-600">{horasPorDia || 0}</p>
                            </div>
                            <div className="bg-white p-2 rounded shadow-sm">
                                <p className="text-xs text-gray-500 uppercase font-semibold">Días seleccionados</p>
                                <p className="text-2xl font-bold text-blue-600">{fechasSeleccionadas.length}</p>
                            </div>
                            <div className="bg-white p-2 rounded shadow-sm">
                                <p className="text-xs text-gray-500 uppercase font-semibold">Total horas</p>
                                <p className={`text-2xl font-bold ${horasCompletadas && !toleranciaAlcanzada ? 'text-green-600' :
                                    toleranciaAlcanzada ? 'text-yellow-600' :
                                        horasTotales > (programaFormacionSeleccionado?.horas || 0) + (horasPorDia || 0) ? 'text-red-600' :
                                            'text-blue-600'
                                    }`}>
                                    {horasTotales}
                                </p>
                            </div>
                            <div className="bg-white p-2 rounded shadow-sm">
                                <p className="text-xs text-gray-500 uppercase font-semibold">Requeridas / Máx</p>
                                <p className="text-lg font-bold text-purple-600">
                                    {programaFormacionSeleccionado?.horas || 0} / {(programaFormacionSeleccionado?.horas || 0) + (horasPorDia || 0)}
                                </p>
                                <p className="text-xs text-gray-500">(+1 día extra)</p>
                            </div>
                        </div>

                        {programaFormacionSeleccionado && (
                            <div className="mt-3 text-center">
                                <p className="text-sm text-gray-700 font-medium">
                                    Programa: <span className="text-blue-800 font-bold">{programaFormacionSeleccionado.nombrePrograma}</span>
                                </p>
                            </div>
                        )}

                        {mensajeHorario && (
                            <div className={`mt-3 p-2 rounded text-center font-bold ${mensajeHorario.includes('completas') ? 'bg-green-200 text-green-800' :
                                mensajeHorario.includes('tolerancia') ? 'bg-yellow-200 text-yellow-800' :
                                    mensajeHorario.includes('Excede') ? 'bg-red-200 text-red-800' :
                                        'bg-blue-100 text-blue-800'
                                }`}>
                                {mensajeHorario}
                            </div>
                        )}
                    </div>

                    {/* CALENDARIO  */}
                    {mostrarCalendario && programaFormacionSeleccionado && (
                        <div className="col-span-2 mt-4">
                            <h3 className="font-semibold mb-2 flex items-center justify-between">
                                <span>Selecciona los días de formación:</span>
                                {horasCompletadas && (
                                    <span className={`text-sm px-2 py-1 rounded-full ${toleranciaAlcanzada ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {toleranciaAlcanzada ? 'Con tolerancia' : 'Completado'}
                                    </span>
                                )}
                            </h3>

                            <Calendar
                                onClickDay={handleSeleccionDia}
                                minDate={new Date(formData.fechaInicio)}
                                maxDate={maxFecha}
                                tileDisabled={tileDisabled}
                                tileClassName={({ date, view }) => {
                                    if (view === 'month') {
                                        const year = date.getFullYear()
                                        const month = String(date.getMonth() + 1).padStart(2, '0')
                                        const day = String(date.getDate()).padStart(2, '0')
                                        const fechaStr = `${year}-${month}-${day}`

                                        if (fechasSeleccionadas.includes(fechaStr)) {
                                            const fechasOrdenadas = [...fechasSeleccionadas].sort((a, b) => new Date(a) - new Date(b))
                                            const esUltima = fechaStr === fechasOrdenadas[fechasOrdenadas.length - 1]

                                            if (esUltima && horasCompletadas) {
                                                return toleranciaAlcanzada
                                                    ? "bg-yellow-500 text-white hover:bg-yellow-600 rounded-full font-bold border-2 border-yellow-700"
                                                    : "bg-green-600 text-white hover:bg-green-700 rounded-full font-bold border-2 border-green-800"
                                            }
                                            return "bg-blue-600 text-white hover:bg-blue-700 rounded-full"
                                        }

                                        // Bloquear visualmente si ya alcanzó el máximo permitido
                                        if (horasCompletadas && toleranciaAlcanzada) {
                                            return "opacity-40 cursor-not-allowed"
                                        }
                                    }
                                    return null
                                }}
                            />

                            {fechasSeleccionadas.length > 0 && (
                                <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                                    <p className="font-semibold text-blue-900 mb-2">
                                        Días seleccionados ({fechasSeleccionadas.length}):
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {[...fechasSeleccionadas]
                                            .sort((a, b) => new Date(a) - new Date(b))
                                            .map((fecha, index, array) => {
                                                const [year, month, day] = fecha.split('-')
                                                const fechaObj = new Date(year, month - 1, day)
                                                const esUltima = index === array.length - 1

                                                return (
                                                    <span
                                                        key={fecha}
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${esUltima && horasCompletadas
                                                            ? toleranciaAlcanzada
                                                                ? 'bg-yellow-500 text-white shadow-md'
                                                                : 'bg-green-500 text-white shadow-md'
                                                            : 'bg-blue-500 text-white'
                                                            }`}
                                                    >
                                                        {fechaObj.toLocaleDateString('es-ES', {
                                                            day: '2-digit',
                                                            month: 'short'
                                                        })}
                                                        {esUltima && horasCompletadas && (toleranciaAlcanzada ? ' *' : ' +')}
                                                    </span>
                                                )
                                            })}
                                    </div>
                                </div>
                            )}

                            {horasCompletadas && (
                                <div className={`mt-3 p-3 rounded text-center font-semibold ${toleranciaAlcanzada
                                    ? 'bg-yellow-100 border border-yellow-300 text-yellow-800'
                                    : 'bg-green-100 border border-green-300 text-green-800'
                                    }`}>
                                    {toleranciaAlcanzada
                                        ? 'Tolerancia aplicada (1 día extra). No puedes agregar más días.'
                                        : 'Horas completadas exactamente. No puedes agregar más días.'}
                                </div>
                            )}
                        </div>
                    )}

                    {!programaFormacionSeleccionado && mostrarCalendario && (
                        <div className="col-span-2 p-4 bg-yellow-50 border border-yellow-200 rounded text-center text-yellow-800">
                            Selecciona un programa de formación para poder elegir los días
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !horasCompletadas}
                        className={`col-span-2 py-3 rounded text-white font-bold text-lg transition-colors ${loading || !horasCompletadas
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
                            }`}
                    >
                        {loading ? "Creando solicitud..." :
                            !horasCompletadas ?
                                `Faltan ${Math.max(0, (programaFormacionSeleccionado?.horas || 0) - horasTotales)} horas` :
                                toleranciaAlcanzada ? "Crear Solicitud (con tolerancia)" : "Crear Solicitud"}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default CrearSolicitud
