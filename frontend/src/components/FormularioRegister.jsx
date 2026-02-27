import { Link } from "react-router-dom"

const FormularioRegister = () => {

    

    return (
        <form className="space-y-8">
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
                            placeholder="Ej: Pérez"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white placeholder:text-slate-400 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"
                        />
                    </div>

                    {/* Rol (Select) */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Rol <span className="text-red-500">*</span>
                        </label>
                        <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-700 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300 appearance-none cursor-pointer">
                            <option value="" disabled selected>Selecciona un rol</option>
                            <option value="instructor">Instructor</option>
                        </select>
                    </div>

                    {/* Tipo de Identificación (Select) */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                            </svg>
                            Tipo de Identificación <span className="text-red-500">*</span>
                        </label>
                        <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-700 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300 appearance-none cursor-pointer">
                            <option value="" disabled selected>Selecciona tipo</option>
                            <option value="cc">Cédula de Ciudadanía</option>
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
                            type="text"
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
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white placeholder:text-slate-400 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"
                        />
                    </div>
                </div>
            </div>

            {/* Sección 3: Información Laboral/Contractual */}
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
                            Tipo de Contrato
                        </label>
                        <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-700 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300">
                            <option value="" disabled selected>Selecciona tipo</option>
                            <option value="Contrato">Contrato</option>
                            <option value="Planta">Planta</option>
                        </select>
                    </div>

                    {/* Número de Contrato */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Número de Contrato
                        </label>
                        <input
                            type="text"
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
                            Inicio de Contrato
                        </label>
                        <input
                            type="date"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-700 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"
                        />
                    </div>

                    {/* Fin Contrato */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Fin de Contrato
                        </label>
                        <input
                            type="date"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-700 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"
                        />
                    </div>
                </div>
            </div>

            {/* Sección 4: Información Académica */}
            <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-200">
                    <span className="w-1 h-5 bg-gradient-to-b from-green-600 to-emerald-500 rounded-full"></span>
                    Información Académica
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Programa Especial (Select) */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                            Programa Especial
                        </label>
                        <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-700 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300">
                            <option value="" disabled selected>Selecciona programa</option>
                            <option value="tic">Tecnología en TIC</option>
                        </select>
                    </div>

                    {/* Modelos Programas Especiales (Select) */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Modelo del Programa
                        </label>
                        <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-700 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300">
                            <option value="" disabled selected>Selecciona modelo</option>
                            <option value="presencial">Presencial</option>
                        </select>
                    </div>

                    {/* Coordinador Asignado (Select) */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Coordinador Asignado
                        </label>
                        <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-700 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300">
                            <option value="" disabled selected>Selecciona coordinador</option>
                            <option value="c1">María González</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-green-200 hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Registrar Usuario
                </button>

                <div className="text-center text-sm text-slate-600">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/" className="text-green-600 font-semibold hover:text-green-700 relative group">
                        Inicia Sesión
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </Link>
                </div>
            </div>
        </form>
    )
}

export default FormularioRegister
