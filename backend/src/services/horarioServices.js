import validarHorario from "../validators/horarioValidator.js";
import {
    ordenarFechas,
    calcularMeses,
    calcularDuracion
} from "../utils/horarioUtils.js";

import crearFechaLocal from "../helpers/crearFechaLocal.js";
import HttpErrors from "../helpers/httpErrors.js";

const construirHorario = (programa, data) => {

    const { fechasSeleccionadas, horaInicio, fechaInicio } = data;
    validarHorario(fechasSeleccionadas);

    const fechasUnicas = [...new Set(fechasSeleccionadas)];

    const fechasOrdenadas = ordenarFechas(fechasUnicas);

    const fechaInicioDate = crearFechaLocal(fechaInicio);;

    // LA FECHA FIN SE CALCULA AUTOMÁTICAMENTE como la última fecha seleccionada
    const fechaFin = fechasOrdenadas.at(-1);

    if (fechaInicioDate > fechasOrdenadas[0]) {
        throw new HttpErrors("La fecha de inicio no puede ser mayor a la primera fecha para dictar el curso", 400);
    }

    const { horaFin } = data;

    // Calcular duración diaria y total
    const duracionHoras = calcularDuracion(horaInicio, horaFin);
    const cantidadDias = fechasOrdenadas.length;
    const duracionTotal = duracionHoras * cantidadDias;

    // Validar duración total
    if (duracionTotal < programa.horas) {
        throw new HttpErrors(
            `Duración total (${duracionTotal}h) menor al mínimo requerido (${programa.horas}h)`,
            400
        );
    }


    return {
        fechasSeleccionadas: fechasOrdenadas,
        fechaInicio: fechaInicioDate,
        fechaFin,
        horaInicio,
        horaFin,
        mes1,
        mes2
    };
};

export default construirHorario;
