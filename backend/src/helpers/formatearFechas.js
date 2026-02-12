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
