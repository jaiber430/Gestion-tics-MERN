import validarHorario from "../validators/horarioValidator.js";

import {
    ordenarFechas,
    calcularMeses,
    calcularDuracion
} from "../utils/horarioUtils.js";

import crearFechaLocal from "../helpers/crearFechaLocal.js";
import HttpErrors from "../helpers/httpErrors.js";

const construirHorario = (programa, data) => {

    const { fechasSeleccionadas, horaInicio, fechaInicio, } = data;
    validarHorario(fechasSeleccionadas);

    const fechasUnicas = [...new Set(fechasSeleccionadas)];

    const fechasOrdenadas = ordenarFechas(fechasUnicas);

    const fechaInicioDate = crearFechaLocal(fechaInicio);

    // LA FECHA FIN SE CALCULA AUTOMÁTICAMENTE como la última fecha seleccionada
    const fechaFin = fechasOrdenadas.at(-1);

    if (fechaInicioDate > fechasOrdenadas[0]) {
        throw new HttpErrors("La fecha de inicio no puede ser mayor a la primera fecha para dictar el curso", 400);
    }

    const { horaFin } = data;

    const meses = calcularMeses(
        fechasSeleccionadas,
        horaInicio,
        horaFin
    );


    // Calcular duración diaria y total
    const duracionHoras = calcularDuracion(horaInicio, horaFin);
    const cantidadDias = fechasOrdenadas.length;
    const duracionTotal = duracionHoras * cantidadDias;

    const horasPorDia = 10;

    const horasMaximasPermitidas = Number(programa.horas) + horasPorDia;

    // Validar duración total
    if (Number(duracionTotal) < programa.horas) {
        throw new HttpErrors(
            `La duración total del curso (${duracionTotal}h) es menor al mínimo de horas requeridas en el programa formación (${programa.horas}h)`,
            400
        );
    } else if (Number(duracionTotal) > horasMaximasPermitidas) {
        throw new HttpErrors(
            `La duración total del curso (${duracionTotal}h) excede el máximo permitido (${horasMaximasPermitidas}h, máximo 1 día extra)`,
            400
        );
    }


    return {
        fechasSeleccionadas: fechasOrdenadas,
        fechaInicio: fechaInicioDate,
        fechaFin,
        horaInicio,
        horaFin,
        meses
    };
};

export default construirHorario;
