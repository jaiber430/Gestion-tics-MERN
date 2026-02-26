import { useParams, useNavigate } from 'react-router-dom'
import { SolicitudProvider } from '../context/SolicitudContext'
import { useSolicitudForm } from '../hooks/useSolicitudForm'
import FormularioSolicitud from '../components/solicitud/FormularioSolicitud'

const CrearSolicitudContent = () => {
    const navigate = useNavigate()
    const { handleSubmit } = useSolicitudForm()
    const { tipo } = useParams()

    const onSubmit = async (e) => {
        const success = await handleSubmit(e)
        if (success) {
            setTimeout(() => navigate('/instructor'), 2000)
        }
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

                <FormularioSolicitud onSubmit={onSubmit} />
            </div>
        </div>
    )
}

const CrearSolicitud = () => {
    const { tipo } = useParams()

    return (
        <SolicitudProvider tipo={tipo}>
            <CrearSolicitudContent />
        </SolicitudProvider>
    )
}

export default CrearSolicitud
