import TiposEmpresa from "../models/TiposEmpresa.js"
import Empresa from "../models/Empresa.js"
import TipoEmpresaRegular from "../models/TipoEmpresaRegular.js"

import HttpErrors from "../helpers/httpErrors.js"

const empresaValidator = async (data, session, modelsTiposEmpresa) => {

    const { tipoEmpresa, emailEmpresa, nitEmpresa, telefonoEmpresa } = data

    const modelosPermitidos = {
        TiposEmpresa,
        TipoEmpresaRegular
    }

    const ModeloTipoEmpresa = modelosPermitidos[modelsTiposEmpresa]

    if (!ModeloTipoEmpresa) {
        throw new HttpErrors('Tipo de empresa inválido', 400)
    }

    const existeTipoEmpresa = await ModeloTipoEmpresa
        .findById(tipoEmpresa)
        .session(session)

    if (!existeTipoEmpresa) {
        throw new HttpErrors('El tipo de empresa no existe', 404)
    }

    // Validar formato email
    const caracteresEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!caracteresEmail.test(emailEmpresa)) {
        throw new HttpErrors('El correo no es válido', 400)
    }

    // Validar NIT único
    const existeNit = await Empresa.findOne({ nitEmpresa }).session(session)

    if (existeNit) {
        throw new HttpErrors('El NIT ya está registrado', 400)
    }

    // Validar email único
    const existeEmail = await Empresa.findOne({ emailEmpresa }).session(session)

    if (existeEmail) {
        throw new HttpErrors('El email ya está registrado', 400)
    }

    // Validar teléfono único (si aplica)
    const existeTelefono = await Empresa.findOne({ telefonoEmpresa }).session(session)

    if (existeTelefono) {
        throw new HttpErrors('El teléfono ya está registrado', 400)
    }

    return {
        existeTipoEmpresa,
    }
}

export default empresaValidator
