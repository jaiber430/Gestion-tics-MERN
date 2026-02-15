import solicitudValidator from '../validators/solicitudValidator.js'
import HttpErrors from '../helpers/httpErrors.js'
import Solicitud from '../models/Solicitud.js'
import construirHorario from './horarioServices.js'

const solicitudAbiertaService = async (data, session, tipoOferta, usuarioCreador, tipoSolicitud) => {

    const { programaFormacion, programaEspecial, cupo, municipio, direccionFormacion, subSectorEconomico, convenio, ambiente, fechaInicio, horaInicio, horaFin, fechasSeleccionadas } = data

    if (!tipoOferta || !cupo || !direccionFormacion || !subSectorEconomico || !convenio || !ambiente || !programaFormacion || !programaEspecial || !municipio || !fechaInicio || !horaInicio || !fechasSeleccionadas) {
        throw new HttpErrors('Todos los campos son requeridos', 400)
    }

    // Guardar id tipo empresa en base a su tipo de solicitud
    let modelsProgramasEspeciales

    if (tipoSolicitud === "CampeSENA") {
        modelsProgramasEspeciales = 'ProgramasEspecialesCampesena'
    } else {
        modelsProgramasEspeciales = 'ProgramasEspeciales'
    }


    // Verificaciones y Creación del horario
    const { programaExiste, existeProgramaEspecial, existeMunicipio } = await solicitudValidator(data, session, modelsProgramasEspeciales)

    const horario = construirHorario(programaExiste, {
        fechasSeleccionadas: fechasSeleccionadas,
        horaInicio: horaInicio,
        fechaInicio: fechaInicio,
        horaFin: horaFin
    });

    const evitarTranslape = await Solicitud.findOne({
        direccionFormacion: direccionFormacion,
        ambiente: ambiente,
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
        usuarioSolicitante: usuarioCreador,
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

    return {
        nuevaSolicitud
    }
}

export default solicitudAbiertaService
