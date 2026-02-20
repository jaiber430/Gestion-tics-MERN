import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import clienteAxios from '../api/axios'

function Register() {
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
        modelosProgramasEspeciales: '', // Ahora será 'ProgramasEspeciales' o 'ProgramasEspecialesCampesena'
        coordinadorAsignado: ''
    })

    const [roles, setRoles] = useState([])
    const [tiposIdentificacion, setTiposIdentificacion] = useState([])
    const [coordinadores, setCoordinadores] = useState([])
    const [programas, setProgramas] = useState([])
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
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
            // Convertir el valor del frontend al parámetro que espera el backend
            const tipoParam = formData.modelosProgramasEspeciales === 'ProgramasEspeciales'
                ? 'regular'
                : 'campesena'
            cargarProgramasPorTipo(tipoParam)
        } else {
            setProgramas([])
        }
    }, [formData.modelosProgramasEspeciales])

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

    const cargarCoordinadores = async () => {
        try {
            const { data } = await clienteAxios.get('/usuarios/verCoordinadores')
            setCoordinadores(data)
        } catch (error) {
            console.error('Error cargando coordinadores:', error)
        }
    }

    const cargarProgramasPorTipo = async (tipo) => {
        setCargandoProgramas(true)
        try {
            // tipo puede ser 'regular' o 'campesena'
            const { data } = await clienteAxios.get('/catalogos/programas-especiales', {
                params: { tipo }
            })
            setProgramas(data)
        } catch (error) {
            console.error('Error cargando programas:', error)
            setProgramas([])
        } finally {
            setCargandoProgramas(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Si cambia el rol, actualizamos el rol seleccionado
        if (name === 'rol') {
            const rol = roles.find(r => r._id === value)
            setRolSeleccionado(rol)
            // Limpiar campos específicos
            setFormData(prev => ({
                ...prev,
                coordinadorAsignado: '',
                programaEspecial: '',
                modelosProgramasEspeciales: ''
            }))
        }

        // Si cambia el tipo de programa, limpiamos el programa seleccionado
        if (name === 'modelosProgramasEspeciales') {
            setFormData(prev => ({
                ...prev,
                programaEspecial: ''
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setLoading(true)

        try {
            // Aquí enviamos formData tal cual, con modelosProgramasEspeciales siendo
            // 'ProgramasEspeciales' o 'ProgramasEspecialesCampesena' (lo que espera el backend)
            await clienteAxios.post('/usuarios/registrar', formData)
            setSuccess('¡Registro exitoso! Espera la verificación de un administrador.')

            // Limpiar formulario
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

            // Redirigir al login después de 3 segundos
            setTimeout(() => {
                navigate('/login')
            }, 3000)
        } catch (error) {
            setError(error.response?.data?.msg || 'Error al registrar usuario')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">
                    Gestión Tics
                </h2>
                <p className="text-center text-slate-500 mb-6">
                    Registro de nuevo usuario
                </p>

                {error && (
                    <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 text-green-600 px-4 py-2 rounded-lg mb-4 text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition uppercase"
                                placeholder="Nombres"
                                required
                            />
                        </div>

                        {/* Apellido */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                Apellido *
                            </label>
                            <input
                                type="text"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition uppercase"
                                placeholder="Apellidos"
                                required
                            />
                        </div>

                        {/* Rol */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                Rol *
                            </label>
                            <select
                                name="rol"
                                value={formData.rol}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                required
                            >
                                <option value="">Seleccione un rol</option>
                                {roles.map(rol => (
                                    <option key={rol._id} value={rol._id}>
                                        {rol.nombreRol}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tipo Identificación */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                Tipo de Identificación *
                            </label>
                            <select
                                name="tipoIdentificacion"
                                value={formData.tipoIdentificacion}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                required
                            >
                                <option value="">Seleccione tipo</option>
                                {tiposIdentificacion.map(tipo => (
                                    <option key={tipo._id} value={tipo._id}>
                                        {tipo.nombreTipoIdentificacion}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Número Identificación */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                Número de Identificación *
                            </label>
                            <input
                                type="number"
                                name="numeroIdentificacion"
                                value={formData.numeroIdentificacion}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="123456789"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition lowercase"
                                placeholder="correo@ejemplo.com"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                Contraseña *
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Mínimo 8 caracteres"
                                required
                                minLength={8}
                            />
                        </div>

                        {/* Tipo Contrato */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                Tipo de Contrato *
                            </label>
                            <select
                                name="tipoContrato"
                                value={formData.tipoContrato}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                required
                            >
                                <option value="">Seleccione tipo</option>
                                <option value="Contrato">Contrato</option>
                                <option value="Planta">Planta</option>
                            </select>
                        </div>

                        {/* Campos condicionales para CONTRATO */}
                        {formData.tipoContrato === 'Contrato' && (
                            <>
                                {/* Número Contrato */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">
                                        Número de Contrato *
                                    </label>
                                    <input
                                        type="number"
                                        name="numeroContrato"
                                        value={formData.numeroContrato}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                        placeholder="Número de contrato"
                                        required
                                    />
                                </div>

                                {/* Fecha Inicio Contrato */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">
                                        Fecha Inicio Contrato *
                                    </label>
                                    <input
                                        type="date"
                                        name="inicioContrato"
                                        value={formData.inicioContrato}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                        required
                                    />
                                </div>

                                {/* Fecha Fin Contrato */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">
                                        Fecha Fin Contrato *
                                    </label>
                                    <input
                                        type="date"
                                        name="finContrato"
                                        value={formData.finContrato}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {/* Selector de Coordinador para INSTRUCTOR */}
                        {rolSeleccionado?.nombreRol === 'INSTRUCTOR' && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-600 mb-1">
                                    Coordinador Asignado *
                                </label>
                                <select
                                    name="coordinadorAsignado"
                                    value={formData.coordinadorAsignado}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                    required
                                >
                                    <option value="">Seleccione un coordinador</option>
                                    {coordinadores.map(coord => (
                                        <option key={coord._id} value={coord._id}>
                                            {coord.nombre} {coord.apellido}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Campos para COORDINADOR */}
                        {rolSeleccionado?.nombreRol === 'COORDINADOR' && (
                            <>
                                {/* Tipo de Programa Especial */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">
                                        Tipo de Programa Especial *
                                    </label>
                                    <select
                                        name="modelosProgramasEspeciales"
                                        value={formData.modelosProgramasEspeciales}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                        required
                                    >
                                        <option value="">Seleccione tipo</option>
                                        <option value="ProgramasEspeciales">Programas Especiales</option>
                                        <option value="ProgramasEspecialesCampesena">Programas Especiales CampeSENA</option>
                                    </select>
                                </div>

                                {/* Programa Especial */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">
                                        Programa Especial *
                                    </label>
                                    <select
                                        name="programaEspecial"
                                        value={formData.programaEspecial}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                        required
                                        disabled={!formData.modelosProgramasEspeciales || cargandoProgramas}
                                    >
                                        <option value="">
                                            {cargandoProgramas
                                                ? 'Cargando programas...'
                                                : 'Seleccione un programa'}
                                        </option>
                                        {programas.map(prog => (
                                            <option key={prog._id} value={prog._id}>
                                                {prog.programaEspecial}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Registrando...' : 'Registrarse'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="flex-1 bg-slate-600 text-white py-2 rounded-lg font-semibold hover:bg-slate-700 transition duration-300"
                        >
                            Volver al Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
