import mongoose from "mongoose"

import solicitudCerradaService from "../services/solicitudCerradaServices.js"
import solicitudAbiertaService from "../services/solicitudAbiertaservices.js"
import ProgramassEspecialesCampesena from "../models/ProgramassEspecialesCampesena.js"

const tipoSolicitud = async (req, res) => {
    const { solicitud } = req.params

    res.send('Hi', solicitud)
}

const crearSolicitud = async (req, res) => {
    const { tipo } = req.params
    const { tipoOferta } = req.body

    const tipoSolicitud = 'CampeSENA'
    // Iniciar Sesion para guardar cambios en varios modelos
    const session = await mongoose.startSession()
    if (tipo === 'campesena') {
        // Todas las operaciones correctas que usen el la sesion van a ser creadas
        try {
            session.startTransaction()
            // Pedir campos en base a la oferta
            if (tipoOferta === "Cerrada") {
                // Enviar datos reqeuridos para la solicitud Si es cerrada
                const { nuevaSolicitud } = await solicitudCerradaService(req.body, session, tipoOferta, req.usuario.id, tipoSolicitud)

                // Si todo sale bien guardar los cambios en modelos, etc
                await session.commitTransaction()
                // Finalizar la sesion
                session.endSession()

                // Devolver la respuesta + la solicitud que se creo
                res.json({
                    msg: "Solicitud creada con exito",
                    solicitud: nuevaSolicitud[0]
                })
            } else {
                const { nuevaSolicitud } = await solicitudAbiertaService(req.body, session, tipoOferta, req.usuario.id, tipoSolicitud)

                await session.commitTransaction()
                session.endSession()

                res.json({
                    msg: "Solicitud creada con exito",
                    solicitud: nuevaSolicitud[0]
                })
            }
        } catch (err) {
            // Si algo sale mal cancela todo (No guarda nada)
            await session.abortTransaction()
            // Finalizar sesión
            session.endSession()
            throw err
        }
        // Si la empresa es regular
    } else if (tipo === 'Regular') {
        // Todas las operaciones correctas que usen el la sesion van a ser creadas
        const session = await mongoose.startSession()

        try {
            session.startTransaction()
            // Tipo de solicitud en base al id de la url
            const tipoSolicitud = 'Regular'
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
                    empresaSolicitante: null,
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
            }
        } catch (err) {
            // Si algo sale mal cancela todo
            await session.abortTransaction()
            session.endSession()
            throw err
        }
    } else {
        throw new HttpErrors('URL no encontada', 404)
    }
}


const subir = async (req, res) => {

    await ProgramassEspecialesCampesena.create({
        programaEspecialCampesena: 'Probando ando'
    })
    res.send('Hi')
}
export {
    tipoSolicitud,
    crearSolicitud,
    subir
}
