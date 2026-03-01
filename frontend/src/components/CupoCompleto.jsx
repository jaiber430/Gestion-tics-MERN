const CupoCompleto = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center p-10 bg-white rounded-3xl shadow-xl border border-slate-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Cupo Completo</h2>
            <p className="text-slate-500">El cupo para esta solicitud ya ha sido completado.</p>
        </div>
    </div>
)

export default CupoCompleto
