import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import clienteAxios from '../api/axios'
import Alerta from '../components/Alerta'

const campoBase = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"

const Campo = ({ label, icono, children }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icono} />
            </svg>
            {label} <span className="text-red-500">*</span>
        </label>
        {children}
    </div>
)

const ICONOS = {
    persona: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    doc:     "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2",
    tel:     "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    email:   "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    caract:  "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
    pdf:     "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
}

const FORM_INICIAL = {
    nombre: "", apellido: "", tipoIdentificacion: "",
    numeroIdentificacion: "", telefono: "", email: "",
    tipoCaracterizacion: "", pdf: null
}

const Preinscripcion = () => {
    const { id } = useParams()
    const [tiposDoc, setTiposDoc]                         = useState([])
    const [tiposCaracterizacion, setTiposCaracterizacion] = useState([])
    const [cargando, setCargando]                         = useState(false)
    const [alerta, setAlerta]                             = useState({})
    const [form, setForm]                                 = useState(FORM_INICIAL)

    const mostrarAlerta = (msg, error = false) => {
        setAlerta({ msg, error })
        setTimeout(() => setAlerta({}), 4000)
    }

    useEffect(() => {
        const cargarCatalogos = async () => {
            try {
                const [tiposRes, caractRes] = await Promise.all([
                    clienteAxios.get('/aspirantes'),
                    clienteAxios.get('/aspirantes/caracterizacion')
                ])
                console.log(caractRes)
                setTiposDoc(tiposRes.data)
                setTiposCaracterizacion(caractRes.data)
            } catch {
                mostrarAlerta("Error al cargar los datos del formulario", true)
            }
        }
        cargarCatalogos()
    }, [])

    const handleChange = (e) => {
        const { name, value, files } = e.target
        setForm(prev => ({ ...prev, [name]: files ? files[0] : value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setCargando(true)

        const formData = new FormData()
        Object.keys(form).forEach(key => {
            if (form[key] !== null && form[key] !== "") {
                formData.append(key, form[key])
            }
        })

        try {
            const { data } = await clienteAxios.post(`/aspirantes/preincripcion-aspirantes/${id}`, formData)
            mostrarAlerta(data?.msg || "¡Inscripción exitosa!")
            setTimeout(() => setForm(FORM_INICIAL), 4000)
        } catch (err) {
            mostrarAlerta(err.response?.data?.msg || "Error al registrar", true)
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                        Inscripción de Aspirante
                    </h1>
                    <p className="text-slate-500 text-sm">Completa todos los campos para finalizar tu inscripción</p>
                </div>

                {/* Formulario */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">

                    {alerta?.msg && <Alerta alerta={alerta} />}

                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">

                        {/* Nombre y Apellido */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Campo label="Nombre" icono={ICONOS.persona}>
                                <input name="nombre" value={form.nombre} onChange={handleChange}
                                    placeholder="Ej: Juan" className={campoBase} required />
                            </Campo>
                            <Campo label="Apellido" icono={ICONOS.persona}>
                                <input name="apellido" value={form.apellido} onChange={handleChange}
                                    placeholder="Ej: Pérez" className={campoBase} required />
                            </Campo>
                        </div>

                        {/* Tipo doc y Número */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Campo label="Tipo de Documento" icono={ICONOS.doc}>
                                <select name="tipoIdentificacion" value={form.tipoIdentificacion}
                                    onChange={handleChange} className={`${campoBase} cursor-pointer`} required>
                                    <option value="" disabled>Selecciona tipo</option>
                                    {tiposDoc.map(t => (
                                        <option key={t._id} value={t._id}>{t.nombreTipoIdentificacion}</option>
                                    ))}
                                </select>
                            </Campo>
                            <Campo label="Número de Documento" icono={ICONOS.doc}>
                                <input name="numeroIdentificacion" value={form.numeroIdentificacion}
                                    onChange={handleChange} placeholder="Ej: 1234567890"
                                    className={campoBase} required />
                            </Campo>
                        </div>

                        {/* Teléfono y Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Campo label="Teléfono" icono={ICONOS.tel}>
                                <input name="telefono" value={form.telefono} onChange={handleChange}
                                    placeholder="Ej: 3001234567" className={campoBase} required />
                            </Campo>
                            <Campo label="Email" icono={ICONOS.email}>
                                <input name="email" type="email" value={form.email} onChange={handleChange}
                                    placeholder="ejemplo@correo.com" className={`${campoBase} lowercase`} required />
                            </Campo>
                        </div>

                        {/* Tipo de Caracterización */}
                        <Campo label="Tipo de Caracterización" icono={ICONOS.caract}>
                            <select name="tipoCaracterizacion" value={form.tipoCaracterizacion}
                                onChange={handleChange} className={`${campoBase} cursor-pointer`} required>
                                <option value="" disabled>Selecciona tipo de caracterización</option>
                                {tiposCaracterizacion.map(t => (
                                    <option key={t._id} value={t._id}>{t.nombreCaracterizacion}</option>
                                ))}
                            </select>
                        </Campo>

                        {/* PDF */}
                        <Campo label="Documento (PDF)" icono={ICONOS.pdf}>
                            <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-6 bg-white/50 hover:border-green-400 transition-colors duration-300">
                                <input type="file" name="pdf" accept="application/pdf" onChange={handleChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
                                <div className="text-center pointer-events-none">
                                    <svg className="w-10 h-10 mx-auto text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="text-sm text-slate-600 font-medium">
                                        {form.pdf ? form.pdf.name : 'Haz clic o arrastra un archivo PDF aquí'}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">PDF hasta 10MB</p>
                                </div>
                            </div>
                        </Campo>

                        {/* Botón submit */}
                        <button type="submit" disabled={cargando}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-green-200 hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                            {cargando ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Preinscribirme
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Decorativos */}
                <div className="fixed -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-30 -z-10" />
                <div className="fixed -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-30 -z-10" />
            </div>
        </div>
    )
}

export default Preinscripcion
