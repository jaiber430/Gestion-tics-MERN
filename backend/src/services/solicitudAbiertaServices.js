import HttpErrors from "../helpers/httpErrors.js"
import construirHorario from "../services/horarioServices.js"
import solicitudValidator from "../validators/solicitudValidator.js"
import empresaValidator from "../validators/empresaValidator.js"
import Solicitud from "../models/Solicitud.js"
import Empresa from "../models/Empresa.js"

const solicitudAbiertaService = async (data, session, tipoOferta, usuarioCreador) => {

    const tipoSolicitud = 'CampeSENA'

    const {programaFormacion, programaEspecial, cupo, nombreEmpresa, nombreResponsable, emailEmpresa, nitEmpresa, tipoEmpresa, cartaSolicitud, municipio, direccionFormacion, subSectorEconomico, convenio, ambiente, fechaInicio, horaInicio, horaFin, fechasSeleccionadas } = data

    // VALIDAR TODOS LOS CAMPOS INCLUYENDO LOS DEL HORARIO QUE TÚ ENVÍAS
    if (!tipoOferta || !cupo || !direccionFormacion || !subSectorEconomico || !convenio || !ambiente || !nombreEmpresa || !nombreResponsable || !emailEmpresa || !nitEmpresa || !tipoEmpresa || !cartaSolicitud || !programaFormacion || !programaEspecial || !municipio || !fechaInicio || !horaInicio || !horaFin || !fechasSeleccionadas) {
        throw new HttpErrors('Todos los campos son requeridos', 400)
    }

    // Verificaciones adicionales para la creación
    const { existeTipoEmpresa } = await empresaValidator(data, session)

    const crearEmpresa = await Empresa.create([{
        nombreEmpresa: nombreEmpresa,
        nombreResponsable: nombreResponsable,
        emailEmpresa: emailEmpresa,
        nitEmpresa: nitEmpresa,
        tipoEmpresa: existeTipoEmpresa._id,
        cartaSolicitud: cartaSolicitud
    }], { session })


    // Verificaciones y Creación del horario
    const { programaExiste, existeProgramaEspecial, existeMunicipio } = await solicitudValidator(data, session)

    const horario = construirHorario(programaExiste, {
        fechasSeleccionadas: fechasSeleccionadas,
        horaInicio: horaInicio,
        fechaInicio: fechaInicio,
        horaFin: horaFin
    }, { session });

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

    return {
        nuevaSolicitud,
    }
}

export default solicitudAbiertaService
