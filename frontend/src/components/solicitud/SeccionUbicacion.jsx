import { useSolicitud } from '../../context/SolicitudContext'

const SeccionUbicacion = () => {
    const { formData, handleChange } = useSolicitud()

    return (
        <>
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
        </>
    )
}

export default SeccionUbicacion
