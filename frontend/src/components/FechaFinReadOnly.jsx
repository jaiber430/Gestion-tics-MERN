// components/FechaFinReadOnly.jsx
import React from 'react'

const FechaFinReadOnly = ({ fechaFin }) => {
    return (
        <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de finalización del curso
            </label>
            <input
                type="text"
                value={fechaFin || 'Selecciona días en el calendario'}
                readOnly
                className={`w-full p-2 border rounded bg-gray-50 ${
                    fechaFin ? 'border-green-500 text-green-700 font-semibold' : 'border-gray-300 text-gray-500'
                }`}
            />
        </div>
    )
}

export default FechaFinReadOnly
