// utils/horarioUtils.js

export const calcularDuracion = (horaInicio, horaFin) => {
    if (!horaInicio || !horaFin) return 0

    const [hInicio, mInicio] = horaInicio.split(':').map(Number)
    const [hFin, mFin] = horaFin.split(':').map(Number)

    let minutosInicio = hInicio * 60 + mInicio
    let minutosFin = hFin * 60 + mFin

    if (minutosFin < minutosInicio) {
        minutosFin += 24 * 60
    }

    const duracionMinutos = minutosFin - minutosInicio
    const duracionHoras = duracionMinutos / 60

    return duracionHoras
}

export const formatearFecha = (fechaStr) => {
    if (!fechaStr) return ''
    const [year, month, day] = fechaStr.split('-')
    const fecha = new Date(year, month - 1, day)
    return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

export const formatearFechaCorta = (fechaStr) => {
    if (!fechaStr) return ''
    const [year, month, day] = fechaStr.split('-')
    const fecha = new Date(year, month - 1, day)
    return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short'
    })
}

export const ordenarFechas = (fechas) => {
    return [...fechas].sort((a, b) => new Date(a) - new Date(b))
}
