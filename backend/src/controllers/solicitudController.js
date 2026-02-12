import mongoose from "mongoose"
import HttpErrors from "../helpers/httpErrors.js"
import Solicitud from "../models/Solicitud.js"

const tipoSolicitud = async (req, res) => {
    const { solicitud } = req.params

    res.send('Hi', solicitud)
}

const crearSolicitud = async (req, res) => {
    const { tipo } = req.params

    // const { tipoOferta, cupo, direccionFormacion, subSectorEconomico, convenio, ambiente, nombreEmpresa, nombreResponsable, emailEmpresa, nitEmpresa, tipoEmpresa, cartaSolicitud, programaFormacion, programaEspecial, municipio, fechaInicio, mes1, mes2, horaInicio, horaFin, diasSemana } = req.body

    const { oferta } = req.body

    switch (tipo) {
        case "hoa":
            // Todas las operaciones correctas que usen el la sesion van a ser creadas
            const session = mongoose.startSession()
            session.startTransaction()

            try {
                // Tipo de solicitud en base al id de la url
                const tipoSolicitud = 'CampeSENA'

                // Pedir campos en base a la oferta
                if (tipoOferta !== "Abierta") {
                    // if (!tipoOferta || !cupo || !direccionFormacion || !subSectorEconomico || !convenio || !ambiente || !nombreEmpresa || !nombreResponsable || !emailEmpresa || !nitEmpresa || !tipoEmpresa || !cartaSolicitud || !programaFormacion || !programaEspecial || !municipio || !fechaInicio || !mes1 || !mes2 || !horaInicio || !horaFin || !diasSemana) {
                    //     throw new HttpErrors('Todos los campos son requeridos', 400)
                    // }
                }

                // if (!tipoOferta || !cupo || !direccionFormacion || !subSectorEconomico || !convenio || !ambiente || !programaFormacion || !programaEspecial || !municipio || !fechaInicio || !mes1 || !mes2 || !horaInicio || !horaFin || !diasSemana) {
                //     throw new HttpErrors('Todos los campos son requeridos', 400)
                // }

                // Verificar que el cupo no pase del maximo y que tenga el cupo minimo
                if (cupo < 25 || cupo > 30) {
                    throw new HttpErrors('Cupo no valido', 400)
                }

                const evitarTranslape = await Solicitud.findOne({})

            } catch (err) {
                res.send(err.message)
            }
            break;
        case "hoa2":
            res.send('Hello hoa2')
            break;

        default:
            // Si tratan de colocar un id no valido
            res.send('Default')
            break;
    }
}

export {
    tipoSolicitud,
    crearSolicitud
}
