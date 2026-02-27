import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Alerta from './Alerta'
import clienteAxios from '../api/axios'

const FormularioRegister = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        rol: '',
        tipoIdentificacion: '',
        numeroIdentificacion: '',
        email: '',
        password: '',
        tipoContrato: '',
        numeroContrato: '',
        inicioContrato: '',
        finContrato: '',
        programaEspecial: '',
        modelosProgramasEspeciales: '',
        coordinadorAsignado: ''
    })

    const [roles, setRoles] = useState([])
    const [tiposIdentificacion, setTiposIdentificacion] = useState([])
    const [coordinadores, setCoordinadores] = useState([])
    const [programas, setProgramas] = useState([])
    const [alerta, setAlerta] = useState({})
    const [loading, setLoading] = useState(false)
    const [rolSeleccionado, setRolSeleccionado] = useState(null)
    const [cargandoProgramas, setCargandoProgramas] = useState(false)

    const navigate = useNavigate()

    // Cargar datos iniciales (roles y tipos de identificación)
    useEffect(() => {
        cargarDatosIniciales()
    }, [])

    // Cargar coordinadores cuando el rol sea INSTRUCTOR
    useEffect(() => {
        if (rolSeleccionado?.nombreRol === 'INSTRUCTOR') {
            cargarCoordinadores()
        }
    }, [rolSeleccionado])

    // Cargar programas cuando cambie el tipo seleccionado
    useEffect(() => {
        if (formData.modelosProgramasEspeciales) {
            const tipoParam = formData.modelosProgramasEspeciales === 'ProgramasEspeciales'
                ? 'regular'
                : 'campesena'
            cargarProgramasPorTipo(tipoParam)
        } else {
            setProgramas([])
        }
    }, [formData.modelosProgramasEspeciales])

    // Cragar datos para todos roles - tipos identificación
    const cargarDatosIniciales = async () => {
        try {
            const [rolesRes, tiposRes] = await Promise.all([
                clienteAxios.get('/catalogos/roles'),
                clienteAxios.get('/catalogos/tipos-identificacion')
            ])
            setRoles(rolesRes.data)
            setTiposIdentificacion(tiposRes.data)
        } catch (error) {
            console.error('Error cargando datos iniciales:', error)
        }
    }

    // Mostrar los coordinadores verificados
    const cargarCoordinadores = async () => {
        try {
            const { data } = await clienteAxios.get('/usuarios/verCoordinadores')
            setCoordinadores(data)
        } catch (error) {
            console.error('Error cargando coordinadores:', error)
        }
    }

    // Cargar los programas especiales en base al tipo de programa seleccioando por el usuario
    const cargarProgramasPorTipo = async (tipo) => {
        setCargandoProgramas(true)
        try {
            const { data } = await clienteAxios.get('/catalogos/programas-especiales', {
                params: { tipo }
            })
            setProgramas(data)
        } catch (error) {
            console.error('Error cargando programas:', error)
            setProgramas([])
        }finally{
            setCargandoProgramas(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Mostrar datos dependiendo del rol
        if (name === 'rol') {
            const rol = roles.find(r => r._id === value)
            setRolSeleccionado(rol)
            setFormData(prev => ({
                ...prev,
                coordinadorAsignado: '',
                programaEspecial: '',
                modelosProgramasEspeciales: ''
            }))
        }

        // cargar programas en base al tipo seleccionado
        if (name === 'modelosProgramasEspeciales') {
            setFormData(prev => ({
                ...prev,
                programaEspecial: ''
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data } = await clienteAxios.post('/usuarios/registrar', formData)
            setAlerta({
                msg: data?.msg,
                error: false,
            })

            setFormData({
                nombre: '',
                apellido: '',
                rol: '',
                tipoIdentificacion: '',
                numeroIdentificacion: '',
                email: '',
                password: '',
                tipoContrato: '',
                numeroContrato: '',
                inicioContrato: '',
                finContrato: '',
                programaEspecial: '',
                modelosProgramasEspeciales: '',
                coordinadorAsignado: ''
            })
            setRolSeleccionado(null)

            setTimeout(() => {
                navigate('/')
            }, 3000)
        } catch (error) {
            setAlerta({
                msg: error.response?.data?.msg || 'Error al registrar usuario',
                error: true
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">

            {/* Mensajes de alerta */}
            {alerta.msg && <Alerta alerta={alerta} />}

            {/* Sección 1: Información Personal */}
            <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-200">
                    <span className="w-1 h-5 bg-gradient-to-b from-green-600 to-emerald-500 rounded-full"></span>
                    Información Personal
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ej: Juan"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white placeholder:text-slate-400 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"

                        />
                    </div>

                    {/* Apellido */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Apellido <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            placeholder="Ej: Pérez"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white placeholder:text-slate-400 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"

                        />
                    </div>

                    {/* Rol */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Rol <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="rol"
                            value={formData.rol}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-700 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300 appearance-none cursor-pointer"

                        >
                            <option value="" disabled>Selecciona un rol</option>
                            {roles.map(rol => (
                                <option key={rol._id} value={rol._id}>
                                    {rol.nombreRol}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tipo de Identificación */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                            </svg>
                            Tipo de Identificación <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="tipoIdentificacion"
                            value={formData.tipoIdentificacion}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-700 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300 appearance-none cursor-pointer"

                        >
                            <option value="" disabled>Selecciona tipo</option>
                            {tiposIdentificacion.map(tipo => (
                                <option key={tipo._id} value={tipo._id}>
                                    {tipo.nombreTipoIdentificacion}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Número de Identificación */}
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                            </svg>
                            Número de Identificación <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="numeroIdentificacion"
                            value={formData.numeroIdentificacion}
                            onChange={handleChange}
                            placeholder="Ej: 1234567890"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white placeholder:text-slate-400 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"

                        />
                    </div>
                </div>
            </div>

            {/* Sección 2: Información de Contacto */}
            <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-200">
                    <span className="w-1 h-5 bg-gradient-to-b from-green-600 to-emerald-500 rounded-full"></span>
                    Información de Contacto
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Correo Electrónico <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ejemplo@correo.com"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white placeholder:text-slate-400 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"

                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Contraseña <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Mínimo 8 caracteres"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white placeholder:text-slate-400 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"
                        />
                    </div>
                </div>
            </div>

            {/* Sección 3: Información Contractual */}
            <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-200">
                    <span className="w-1 h-5 bg-gradient-to-b from-green-600 to-emerald-500 rounded-full"></span>
                    Información Contractual
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tipo de Contrato */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Tipo de Contrato <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="tipoContrato"
                            value={formData.tipoContrato}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-700 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"

                        >
                            <option value="" disabled>Selecciona tipo</option>
                            <option value="Contrato">Contrato</option>
                            <option value="Planta">Planta</option>
                        </select>
                    </div>

                    {/* Campos condicionales para CONTRATO */}
                    {formData.tipoContrato === 'Contrato' && (
                        <>
                            {/* Número de Contrato */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Número de Contrato <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="numeroContrato"
                                    value={formData.numeroContrato}
                                    onChange={handleChange}
                                    placeholder="Ej: CONT-2024-001"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white placeholder:text-slate-400 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"

                                />
                            </div>

                            {/* Inicio Contrato */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Inicio de Contrato <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="inicioContrato"
                                    value={formData.inicioContrato}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-700 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"

                                />
                            </div>

                            {/* Fin Contrato */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Fin de Contrato <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="finContrato"
                                    value={formData.finContrato}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-700 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"

                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Sección 4: Información Académica - Condicional por rol */}
            {rolSeleccionado?.nombreRol === 'INSTRUCTOR' && (
                <div>
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-200">
                        <span className="w-1 h-5 bg-gradient-to-b from-green-600 to-emerald-500 rounded-full"></span>
                        Asignación Académica
                    </h2>

                    <div className="grid grid-cols-1 gap-6">
                        {/* Coordinador Asignado */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Coordinador Asignado <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="coordinadorAsignado"
                                value={formData.coordinadorAsignado}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-700 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"

                            >
                                <option value="" disabled>Selecciona un coordinador</option>
                                {coordinadores.map(coord => (
                                    <option key={coord._id} value={coord._id}>
                                        {coord.nombre} {coord.apellido}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {rolSeleccionado?.nombreRol === 'COORDINADOR' && (
                <div>
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-200">
                        <span className="w-1 h-5 bg-gradient-to-b from-green-600 to-emerald-500 rounded-full"></span>
                        Programas Especiales
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tipo de Programa Especial */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                </svg>
                                Tipo de Programa Especial <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="modelosProgramasEspeciales"
                                value={formData.modelosProgramasEspeciales}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-700 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"

                            >
                                <option value="" disabled>Selecciona tipo</option>
                                <option value="ProgramasEspeciales">Programas Especiales</option>
                                <option value="ProgramasEspecialesCampesena">Programas Especiales CampeSENA</option>
                            </select>
                        </div>

                        {/* Programa Especial */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                Programa Especial <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="programaEspecial"
                                value={formData.programaEspecial}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-700 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"

                                disabled={!formData.modelosProgramasEspeciales || cargandoProgramas}
                            >
                                <option value="">
                                    {cargandoProgramas
                                        ? 'Cargando programas...'
                                        : 'Selecciona un programa'}
                                </option>
                                {programas.map(prog => (
                                    <option key={prog._id} value={prog._id}>
                                        {prog.programaEspecial}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Botones de acción */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-green-200 hover:shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Registrando...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Registrar Usuario
                        </>
                    )}
                </button>

                <div className="text-center text-sm text-slate-600">
                    ¿Ya tienes cuenta?{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="text-green-600 font-semibold hover:text-green-700 relative group bg-transparent border-none cursor-pointer"
                    >
                        Inicia Sesión
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </button>
                </div>
            </div>
        </form>
    )
}

export default FormularioRegister
