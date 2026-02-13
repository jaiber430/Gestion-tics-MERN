import ProgramasFomracion from '../models/ProgramasFormacion.js'
import ProgramasEspeciales from "../models/ProgramasEspeciales.js"
import Municipios from "../models/Municipios.js"
import Solicitud from '../models/Solicitud.js'

import HttpErrors from '../helpers/httpErrors.js'

const solicitudValidator = async (data, session) => {

    const { programaFormacion, programaEspecial, cupo, municipio } = data


    const programaExiste = await ProgramasFomracion.findById(programaFormacion).session(session)

    if (!programaExiste) {
        throw new HttpErrors('El programa selecionado no existe', 404)
    }

    // Verificar que el cupo no pase del maximo o que tenga el cupo minimo
    if (cupo < 25 || cupo > 30) {
        throw new HttpErrors('Cupo no valido', 400)
    }

    const existeProgramaEspecial = await ProgramasEspeciales.findById(programaEspecial).session(session)
    if (!existeProgramaEspecial) {
        throw new HttpErrors('Programa especial no encontrado', 404)
    }

    const existeMunicipio = await Municipios.findById(municipio).session(session)
    if (!existeMunicipio) {
        throw new HttpErrors('Municipio no encontrado', 404)
    }

    return {
        programaExiste,
        existeProgramaEspecial,
        existeMunicipio
    }
}

export default solicitudValidator
