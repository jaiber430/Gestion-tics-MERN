const ordenarFechas = (fechas) => {
    return fechas
        .map(f => {
            const [year, month, day] = f.split("-").map(Number);
            return new Date(year, month - 1, day);
        })
        .sort((a, b) => a - b);
};

const calcularMeses = (fechasSeleccionadas, horaInicio, horaFin) => {

    const mesesMap = {};

    fechasSeleccionadas.forEach(fecha => {

        const [year, month, day] = fecha.split("-").map(Number);
        const fechaObj = new Date(year, month - 1, day);

        const nombreMes = fechaObj
            .toLocaleString('es-ES', { month: 'long' })
            .toUpperCase();

        if (!mesesMap[nombreMes]) {
            mesesMap[nombreMes] = [];
        }

        mesesMap[nombreMes].push(day);
    });

    const horasPorDia = calcularDuracion(horaInicio, horaFin);

    return Object.keys(mesesMap).map(nombreMes => ({
        nombreMes,
        dias: mesesMap[nombreMes].sort((a, b) => a - b),
        horaInicio,
        horaFin,
        horasPorDia
    }));
};



function calcularDuracion(horaInicio, horaFin) {
    const [hInicio, mInicio] = horaInicio.split(':').map(Number);
    const [hFin, mFin] = horaFin.split(':').map(Number);

    let minutosInicio = hInicio * 60 + mInicio;
    let minutosFin = hFin * 60 + mFin;

    // Si la hora final es antes de la inicial, asumimos que es al día siguiente
    if (minutosFin < minutosInicio) {
        minutosFin += 24 * 60;
    }

    const duracionMinutos = minutosFin - minutosInicio;
    const duracionHoras = duracionMinutos / 60;

    return duracionHoras;
}

export {
    ordenarFechas,
    calcularMeses,
    calcularDuracion
}
