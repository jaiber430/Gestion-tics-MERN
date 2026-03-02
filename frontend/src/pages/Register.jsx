import FormularioRegister from '../components/FormularioRegister'

const Register = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header con efecto de vidrio */}
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                        Registro de Usuario
                    </h1>
                    <p className="text-slate-600 flex items-center justify-center gap-2">
                        <span className="w-8 h-px bg-gradient-to-r from-transparent to-green-400"></span>
                        Completa todos los campos para crear tu cuenta
                        <span className="w-8 h-px bg-gradient-to-r from-green-400 to-transparent"></span>
                    </p>
                </div>

                {/* Formulario principal con glassmorphism */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
                    <FormularioRegister />
                </div>

                {/* Elementos decorativos */}
                <div className="fixed -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-30 -z-10"></div>
                <div className="fixed -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-30 -z-10"></div>
            </div>
        </div>
    )
}

export default Register
