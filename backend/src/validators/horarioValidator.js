import HttpErrors from "../helpers/httpErrors.js";

const validarHorario = (data) => {

    const fechasUnicas = [...new Set(data)];
    // console.log(fechasSeleccionadas)
    // console.log(fechasUnicas)

    if (fechasUnicas.length !== data.length) {
        throw new HttpErrors("Hay fechas duplicadas", 409);
    }

};

export default validarHorario;
