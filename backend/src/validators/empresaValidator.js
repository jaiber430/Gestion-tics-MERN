import TiposEmpresa from "../models/TiposEmpresa.js"
import Empresa from "../models/Empresa.js"
import HttpErrors from "../helpers/httpErrors.js"

const empresaValidator = async (data, session) => {

    const { tipoEmpresa, emailEmpresa, nitEmpresa } = data

    const existeTipoEmpresa = await TiposEmpresa.findById(tipoEmpresa).session(session)
    if (!existeTipoEmpresa) {
        throw new HttpErrors('El tipo de empresa no existe', 404)
    }

    // Verificar que el correo sea valido
    const caracteresEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!caracteresEmail.test(emailEmpresa)) {
        throw new HttpErrors('El correo no es valido', 400)
    }

    const existeNit = await Empresa.findOne({ nitEmpresa }).session(session)
    if (existeNit) {
        throw new HttpErrors('El nit de la empresa ya existe', 400)
    }
    return {
        existeTipoEmpresa,
    }
}

export default empresaValidator
