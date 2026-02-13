const ordenarFechas = (fechas) => {
    return fechas
        .map(f => {
            const [year, month, day] = f.split("-").map(Number);
            return new Date(year, month - 1, day);
        })
        .sort((a, b) => a - b);
};

const calcularMeses = (fechasSeleccionadas) => {

    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Obtener meses únicos de todas las fechas seleccionadas
    const mesesUnicos = [...new Set(fechasSeleccionadas.map(fecha => {
        const fechaObj = new Date(fecha);
        return fechaObj.getMonth();
    }))];

    // Separar meses del primer semestre (0-5) y segundo semestre (6-11)
    const mesesPrimerSemestre = mesesUnicos
        .filter(mes => mes >= 0 && mes <= 5)
        .sort((a, b) => a - b)
        .map(mes => meses[mes]);

    const mesesSegundoSemestre = mesesUnicos
        .filter(mes => mes >= 6 && mes <= 11)
        .sort((a, b) => a - b)
        .map(mes => meses[mes]);

    return {
        mes1: mesesPrimerSemestre.join(', '), // Array con meses de Enero a Junio que están en las fechas
        mes2: mesesSegundoSemestre.join(', ') // Array con meses de Julio a Diciembre que están en las fechas
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
