import Solicitud from '../models/Solicitud.js'
import solicitudValidator from '../validators/solicitudValidator.js'
import construirHorario from './horarioServices.js'
import { generarDocumento } from './wordServices.js'
import HttpErrors from '../helpers/httpErrors.js'

const solicitudAbiertaService = async (data, session, tipoOferta, usuarioCreador, tipoSolicitud) => {

    const {
        programaFormacion,
        programaEspecial,
        cupo,
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

    // VALIDAR CAMPOS BASE
    if (!tipoOferta || !cupo || !direccionFormacion || !subSectorEconomico || !convenio || !ambiente || !programaFormacion || !programaEspecial || !municipio || !fechaInicio || !horaInicio || !horaFin || !fechasSeleccionadas) {
        throw new HttpErrors('Todos los campos base son requeridos', 400);
    }

    // VALIDACIÓN SOLO PARA CAMPE SENA
    if (tipoSolicitud === "CampeSENA") {
        if (!tipoInstructor) {
            throw new HttpErrors("Debe indicar el tipo de instructor", 400);
        }

        if (!["TECNICO", "EMPRESARIAL", "FULLPOPULAR"].includes(tipoInstructor)) {
            throw new HttpErrors("Tipo de instructor inválido", 400);
        }
    }

    // Guardar modelo correcto para programas especiales
    const modelsProgramasEspeciales = tipoSolicitud === "CampeSENA" ? 'ProgramasEspecialesCampesena' : 'ProgramasEspeciales';

    // Verificaciones y creación del horario
    const { programaExiste, existeProgramaEspecial, existeMunicipio } = await solicitudValidator(data, session, modelsProgramasEspeciales);

    const horario = construirHorario(programaExiste, {
        fechasSeleccionadas,
        horaInicio,
        fechaInicio,
        horaFin
    });

    // Evitar translape
    const evitarTranslape = await Solicitud.findOne({
        direccionFormacion,
        ambiente,
        municipio: existeMunicipio._id,
        fechaInicio: horario.fechaInicio,
        fechaFin: horario.fechaFin,
        horaInicio: horario.horaInicio,
        horaFin: horario.horaFin,
        fechasSeleccionadas: horario.fechasSeleccionadas
    }).session(session);

    if (evitarTranslape) {
        throw new HttpErrors('Ya se ha creado una solicitud en el horario y dirección', 403);
    }

    // Construcción base de la solicitud
    const dataSolicitud = {
        tipoSolicitud,
        tipoOferta,
        cupo,
        direccionFormacion,
        subSectorEconomico,
        convenio,
        ambiente,
        usuarioSolicitante: usuarioCreador,
        empresaSolicitante: null, // abierta no tiene empresa
        municipio: existeMunicipio._id,
        programaFormacion: programaExiste._id,
        programaEspecial: existeProgramaEspecial._id,
        fechaInicio: horario.fechaInicio,
        fechaFin: horario.fechaFin,
        horaInicio: horario.horaInicio,
        horaFin: horario.horaFin,
        fechasSeleccionadas: horario.fechasSeleccionadas,
        meses: horario.meses
    };

    // Solo para CampeSENA
    if (tipoSolicitud === "CampeSENA") {
        dataSolicitud.tipoInstructor = tipoInstructor;
    }

    const nuevaSolicitud = await Solicitud.create([dataSolicitud], { session });

    await generarDocumento(nuevaSolicitud[0], session);

    return { nuevaSolicitud };
}

export default solicitudAbiertaService;
