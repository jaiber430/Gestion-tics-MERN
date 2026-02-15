const ordenarFechas = (fechas) => {
    return fechas
        .map(f => {
            const [year, month, day] = f.split("-").map(Number);
            return new Date(year, month - 1, day);
        })
        .sort((a, b) => a - b);
};

const calcularMeses = (fechasSeleccionadas) => {

    if (!Array.isArray(fechasSeleccionadas)) {
        throw new Error("fechasSeleccionadas debe ser un array");
    }

    const mes1 = [];
    const mes2 = [];

    fechasSeleccionadas.forEach(fecha => {

        const [year, month, day] = fecha.split("-").map(Number);
        const fechaObj = new Date(year, month - 1, day); // evitar problema zona horaria

        const numeroMes = fechaObj.getMonth(); // 0-11

        if (numeroMes >= 0 && numeroMes <= 5) {
            mes1.push(fecha); // guardamos la fecha original
        } else {
            mes2.push(fecha);
        }

    });

    return {
        mes1: mes1.join(', '),
        mes2: mes2.join(', '),
    };
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
