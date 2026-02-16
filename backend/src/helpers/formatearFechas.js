export const formatearFechaInicio = (fecha) => {
    const nuevaFecha = new Date(fecha)
    nuevaFecha.setHours(0, 0, 0, 0)
    return nuevaFecha
}

export const formatearFechaFin = (fecha) => {
    const nuevaFecha = new Date(fecha)
    nuevaFecha.setHours(23, 59, 59, 999)
    return nuevaFecha
}

export const formatearFechaWord = (fecha) => {
    const nuevaFecha = new Date(fecha)

    const year = nuevaFecha.getFullYear()
    const month = String(nuevaFecha.getMonth() + 1).padStart(2, '0')
    const day = String(nuevaFecha.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}
