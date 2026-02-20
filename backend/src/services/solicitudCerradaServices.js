import Solicitud from "../models/Solicitud.js"
import Empresa from "../models/Empresa.js"
import path from 'path'
import solicitudValidator from "../validators/solicitudValidator.js"
import empresaValidator from "../validators/empresaValidator.js"

import construirHorario from "../services/horarioServices.js"
import { generarDocumento } from '../services/wordServices.js'

import HttpErrors from "../helpers/httpErrors.js"

const solicitudCerradaService = async (data, session, tipoOferta, usuarioCreador, tipoSolicitud, cartaRoute) => {

    const {
        programaFormacion,
        programaEspecial,
        cupo,
        nombreEmpresa,
        nombreResponsable,
        emailEmpresa,
        nitEmpresa,
        fechaCreacionEmpresa,
        telefonoEmpresa,
        direccionEmpresa,
        nombreContactoEmpresa,
        numeroEmpleadosEmpresa,
        tipoEmpresa,
        municipio,
        direccionFormacion,
        subSectorEconomico,
        convenio,
        ambiente,
        fechaInicio,
        horaInicio,
        horaFin,
        fechasSeleccionadas,
        tipoInstructor
    } = data;

    // VALIDAR TODOS LOS CAMPOS INCLUYENDO LOS DEL HORARIO QUE TÚ ENVÍAS
    if (!tipoOferta || !cupo || !direccionFormacion || !subSectorEconomico || !convenio || !ambiente || !nombreEmpresa || !nombreResponsable || !emailEmpresa || !nitEmpresa || !tipoEmpresa || !programaFormacion || !programaEspecial || !municipio || !fechaInicio || !horaInicio || !horaFin || !fechasSeleccionadas || !fechaCreacionEmpresa || !telefonoEmpresa || !direccionEmpresa || !nombreContactoEmpresa || !numeroEmpleadosEmpresa) {
        throw new HttpErrors('Todos los campos son requeridos', 400)
    }


    // VALIDACIÓN SOLO PARA CAMPE SENA
    if (tipoSolicitud === "CampeSENA") {
        // Validar que se haya enviado tipoInstructor
        if (!tipoInstructor) {
            throw new HttpErrors("Debe indicar el tipo de instructor", 400);
        }

        // Validar que sea uno de los valores permitidos
        if (!["TECNICO", "EMPRESARIAL", "FULLPOPULAR"].includes(tipoInstructor)) {
            throw new HttpErrors("Tipo de instructor inválido", 400);
        }

        // Asignarlo a la solicitud
        // dataSolicitud.tipoInstructor = tipoInstructor;
    }


    // Guardar id tipo empresa en base a su tipo de solicitud
    let modelsTiposEmpresa
    let modelsProgramasEspeciales

    if (tipoSolicitud === "CampeSENA") {
        modelsProgramasEspeciales = 'ProgramasEspecialesCampesena'
    } else {
        modelsTiposEmpresa = "TipoEmpresaRegular"
        modelsProgramasEspeciales = 'ProgramasEspeciales'
    }

    // Verificaciones adicionales para la creación
    const { existeTipoEmpresa } = await empresaValidator(data, session, modelsTiposEmpresa)

    const crearEmpresa = await Empresa.create([{
        nombreEmpresa: nombreEmpresa,
        nombreResponsable: nombreResponsable,
        emailEmpresa: emailEmpresa,
        telefonoEmpresa: telefonoEmpresa,
        nitEmpresa: nitEmpresa,
        fechaCreacion: fechaCreacionEmpresa,
        direccionEmpresa: direccionEmpresa,
        nombreContactoEmpresa: nombreContactoEmpresa,
        tipoEmpresa: existeTipoEmpresa._id,
        modelsTiposEmpresa: modelsTiposEmpresa,
        numeroEmpleadosEmpresa: numeroEmpleadosEmpresa,
        cartaSolicitud: cartaRoute?.path || null,
    }], { session })


    // Verificaciones y Creación del horario
    const { programaExiste, existeProgramaEspecial, existeMunicipio } = await solicitudValidator(data, session, modelsProgramasEspeciales)

    const horario = construirHorario(programaExiste, {
        fechasSeleccionadas,
        horaInicio,
        fechaInicio,
        horaFin
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


    //Construcción dinámica de la solicitud
    const dataSolicitud = {
        tipoSolicitud,
        tipoOferta,
        cupo,
        direccionFormacion,
        subSectorEconomico,
        convenio,
        ambiente,
        usuarioSolicitante: usuarioCreador,
        empresaSolicitante: crearEmpresa[0]._id,
        municipio: existeMunicipio._id,
        programaFormacion: programaExiste._id,
        programaEspecial: existeProgramaEspecial._id,
        fechaInicio: horario.fechaInicio,
        fechaFin: horario.fechaFin,
        horaInicio: horario.horaInicio,
        horaFin: horario.horaFin,
        fechasSeleccionadas: horario.fechasSeleccionadas,
        meses: horario.meses
    }

    // Solo para CampeSENA
    if (tipoSolicitud === "CampeSENA") {
        dataSolicitud.tipoInstructor = tipoInstructor;
    }


    const nuevaSolicitud = await Solicitud.create(
        [dataSolicitud],
        { session }
    )


    await generarDocumento(nuevaSolicitud[0], session)

    return {
        nuevaSolicitud,
    }
}

export default solicitudCerradaService
