import mongoose from "mongoose"

import HttpErrors from "../helpers/httpErrors.js"
import construirHorario from "../services/horarioServices.js"
import solicitudValidator from "../validators/solicitudValidator.js"
import empresaValidator from "../validators/empresaValidator.js"


import Solicitud from "../models/Solicitud.js"
import Empresa from "../models/Empresa.js"
import ProgramasFormacion from "../models/ProgramasFormacion.js"
import Area from "../models/Area.js"
import TiposEmpresa from "../models/TiposEmpresa.js"
import Municipios from "../models/Municipios.js"
import ProgramasEspeciales from "../models/ProgramasEspeciales.js"

const tipoSolicitud = async (req, res) => {
    const { solicitud } = req.params

    res.send('Hi', solicitud)
}

const crearSolicitud = async (req, res) => {
    const { tipo } = req.params

    const { tipoOferta, programaFormacion, programaEspecial, cupo, nombreEmpresa, nombreResponsable, emailEmpresa, nitEmpresa, tipoEmpresa, cartaSolicitud, municipio, direccionFormacion, subSectorEconomico, convenio, ambiente, fechaInicio, horaInicio, horaFin, fechasSeleccionadas } = req.body

    if (tipo === 'hoa') {
        // Todas las operaciones correctas que usen el la sesion van a ser creadas
        const session = await mongoose.startSession()

        try {
            session.startTransaction()
            // Tipo de solicitud en base al id de la url
            const tipoSolicitud = 'CampeSENA'
            // Pedir campos en base a la oferta
            if (tipoOferta !== "Abierta") {
                // VALIDAR TODOS LOS CAMPOS INCLUYENDO LOS DEL HORARIO QUE TÚ ENVÍAS
                if (!tipoOferta || !cupo || !direccionFormacion || !subSectorEconomico || !convenio || !ambiente || !nombreEmpresa || !nombreResponsable || !emailEmpresa || !nitEmpresa || !tipoEmpresa || !cartaSolicitud || !programaFormacion || !programaEspecial || !municipio || !fechaInicio || !horaInicio || !horaFin || !fechasSeleccionadas) {
                    throw new HttpErrors('Todos los campos son requeridos', 400)
                }

                // Verificaciones adicionales para la creación
                const { existeTipoEmpresa } = await empresaValidator(req.body, session)

                const crearEmpresa = await Empresa.create([{
                    nombreEmpresa: nombreEmpresa,
                    nombreResponsable: nombreResponsable,
                    emailEmpresa: emailEmpresa,
                    nitEmpresa: nitEmpresa,
                    tipoEmpresa: existeTipoEmpresa._id,
                    cartaSolicitud: cartaSolicitud
                }], { session })

                // Verificaciones y Creación del horario
                const { programaExiste, existeProgramaEspecial, existeMunicipio } = await solicitudValidator(req.body, session)

                const horario = construirHorario(programaExiste, {
                    fechasSeleccionadas: req.body.fechasSeleccionadas,
                    horaInicio: req.body.horaInicio,
                    fechaInicio: req.body.fechaInicio,
                    horaFin: req.body.horaFin
                });

                const evitarTranslape = await Solicitud.findOne({
                    direccionFormacion: req.body.direccionFormacion,
                    ambiente: req.body.ambiente,
                    municipio: existeMunicipio._id,
                    fechaInicio: horario.fechaInicio,
                    fechaFin: horario.fechaFin,
                    horaInicio: horario.horaInicio,
                    horaFin: horario.horaFin,
                    fechasSeleccionadas: horario.fechasSeleccionadas
                }).session(session)

                if (evitarTranslape) {
                    throw new HttpErrors('Ya se ha creado una solicitud en el horario y dirección', 403)
                }

                const nuevaSolicitud = await Solicitud.create([{
                    tipoSolicitud: tipoSolicitud,
                    tipoOferta: tipoOferta,
                    cupo: cupo,
                    direccionFormacion: direccionFormacion,
                    subSectorEconomico: subSectorEconomico,
                    convenio: convenio,
                    ambiente: ambiente,
                    usuarioSolicitante: req.usuario.id,
                    empresaSolicitante: crearEmpresa[0]._id,
                    municipio: existeMunicipio._id,
                    programaFormacion: programaExiste._id,
                    programaEspecial: existeProgramaEspecial._id,
                    fechaInicio: horario.fechaInicio,
                    fechaFin: horario.fechaFin,
                    mes1: horario.mes1,
                    mes2: horario.mes2,
                    horaInicio: horario.horaInicio,
                    horaFin: horario.horaFin,
                    fechasSeleccionadas: horario.fechasSeleccionadas
                }], { session });

                await session.commitTransaction()
                session.endSession()

                res.json({
                    msg: "Solicitud creada con exito",
                    solicitud: nuevaSolicitud[0]
                })
            } else {
                if (!tipoOferta || !cupo || !direccionFormacion || !subSectorEconomico || !convenio || !ambiente || !programaFormacion || !programaEspecial || !municipio || !fechaInicio || !horaInicio || !fechasSeleccionadas) {
                    throw new HttpErrors('Todos los campos son requeridos', 400)
                }

                // Verificaciones adicionales para la creación
                const { programaExiste, existeProgramaEspecial, existeMunicipio } = solicitudValidator(req.body)

                const horario = construirHorario(programaExiste, req.body);

                const nuevaSolicitud = await Solicitud.create({
                    tipoSolicitud: tipoSolicitud,
                    tipoOferta: tipoOferta,
                    cupo: cupo,
                    direccionFormacion: direccionFormacion,
                    subSectorEconomico: subSectorEconomico,
                    convenio: convenio,
                    ambiente: ambiente,
                    usuarioSolicitante: req.usuario.id,
                    empresaSolicitante: null,
                    municipio: existeMunicipio,
                    programaFormacion: programaExiste,
                    programaEspecial: existeProgramaEspecial,
                    fechaInicio: horario.fechaInicio,
                    fechaFin: horario.fechaFin,
                    mes1: horario.mes1,
                    mes2: horario.mes2,
                    horaInicio: horario.horaInicio,
                    horaFin: horario.horaFin,
                    fechasSeleccionadas: horario.fechasSeleccionadas
                }, { session });

                await session.commitTransaction()
                session.endSession()

                res.json({
                    msg: "Solicitud creada con exito",
                    solicitud: nuevaSolicitud
                })
            }
        } catch (err) {
            // Si algo sale mal cancela todo
            await session.abortTransaction()
            session.endSession()
            throw err
        }
    } else if (tipo === 'Regular') {

    } else {
        throw new HttpErrors('URL no encontada', 404)
    }
}


const subir = async (req, res) => {
    await TiposEmpresa.create({
        tipoEmpresa: 'Public'
    })

    await Municipios.create({
        municipios: "Popayán"
    })

    await ProgramasEspeciales.create({
        programaEspecial: "Aula"
    })
    // const { area } = req.body

    // await Area.create({
    //     area: 'Probando'
    // })
    res.send('Hi')
}
export {
    tipoSolicitud,
    crearSolicitud,
    subir
}
