import Area from "../models/Area.js"
import ProgramasFormacion from "../models/ProgramasFormacion.js"
import ProgramaEspecialCampesena from "../models/ProgramasEspecialesCampesena.js"
import ProgramasEspeciales from "../models/ProgramasEspeciales.js"
import Municipios from "../models/Municipios.js"
import TipoEmpresa from "../models/TiposEmpresa.js"
import TipoEmpresaRegular from "../models/TipoEmpresaRegular.js"
import Roles from "../models/Roles.js"
import TiposIdentificacion from "../models/TiposIdentificacion.js"

const obtenerTiposEmpresa = async (req, res) => {
    const tipos = await TipoEmpresa.find().select('_id tipoEmpresa')
    res.json(tipos)
}

const obtenerTiposEmpresaRegular = async (req, res) => {
        const tipos = await TipoEmpresaRegular.find().select('_id tipoEmpresaRegular')
        // console.log(tipos)
        res.json(tipos)
}

const obtenerAreas = async (req, res) => {
    const areas = await Area.find().select('_id area')
    res.json(areas)
}

const obtenerProgramasFormacion = async (req, res) => {
    const { areaId } = req.params

    const programas = await ProgramasFormacion
        .find({ area: areaId })
        .select('_id nombrePrograma horas codigoPrograma versionPrograma')

    res.json(programas)
}

const obtenerRoles = async (req, res) =>{
    const roles = await Roles.find().select('nombreRol')
    res.json(roles)
}

const obtenerTipoIdentificacion = async (req, res) =>{
    const tiposIdentificaciones = await TiposIdentificacion.find().select('nombreTipoIdentificacion')
    res.json(tiposIdentificaciones)
}

const obtenerProgramasEspeciales = async (req, res) => {

    const { tipo } = req.query

    let Model = tipo === "campesena"
        ? ProgramaEspecialCampesena
        : ProgramasEspeciales

    const programas = await Model.find().select('_id programaEspecial')

    res.json(programas)
}

const obtenerMunicipios = async (req, res) => {
    const municipios = await Municipios.find().select('_id municipios')
    res.json(municipios)
}

export {
    obtenerAreas,
    obtenerProgramasFormacion,
    obtenerProgramasEspeciales,
    obtenerMunicipios,
    obtenerTiposEmpresaRegular,
    obtenerTiposEmpresa,
    obtenerRoles,
    obtenerTipoIdentificacion,
}
