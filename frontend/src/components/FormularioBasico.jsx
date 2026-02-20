// components/FormularioBasico.jsx
import React from 'react'

const FormularioBasico = ({ formData, handleChange, areas, programasFormacion, programasEspeciales, municipios, tipo, handleProgramaChange }) => {
    return (
        <>
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

            <select
                name="programaEspecial"
                onChange={handleChange}
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
        </>
    )
}

export default FormularioBasico
