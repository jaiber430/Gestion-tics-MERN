import clienteAxios from '../api/axios'

const VerFichaCaracterizacion = ({ id }) => {
    const handleClick = async () => {
        try {
            const response = await clienteAxios.get(
                `/consultas/consultas-instructor/${id}/ficha-caracterizacion`,
                { responseType: 'blob' }
            )
            const blob = new Blob([response.data], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            window.open(url, '_blank')
            setTimeout(() => window.URL.revokeObjectURL(url), 10000)
        } catch (error) {
            console.error('Error:', error)
        }
    }

    return (
        <button
            onClick={handleClick}
            className="px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 font-medium bg-blue-50 text-green-700 hover:bg-blue-100 border border-blue-200"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Ver Ficha Caracterización
        </button>
    )
}

export default VerFichaCaracterizacion
