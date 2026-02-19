import HttpErrors from "../helpers/httpErrors.js"
import UsuarioAsignado from "../models/UsuarioAsignado.js"
import Usuarios from "../models/Usuarios.js"
import validarUsuarioPorRol from "../validators/usuarioValidatorRol.js"

const asignarUsuarios = async (req, res) => {
    const { usuarioInstructor, usuarioCoordinador } = req.body

    if (!usuarioCoordinador || !usuarioInstructor) {
        throw new HttpErrors('El coordinador y el usuario a asignar son requeridos', 400)
    }

    const checkCoordinador = await Usuarios.findById(usuarioCoordinador).populate('rol')

    await validarUsuarioPorRol(checkCoordinador, 'COORDINADOR')

    const checkInstructor = await Usuarios.findById(usuarioInstructor).populate('rol')

    await validarUsuarioPorRol(checkInstructor, 'INSTRUCTOR')

    const evitarDobleAsignacion = await UsuarioAsignado.findOne({
        usuarioCoordinador: usuarioCoordinador,
        usuarioInstructor: usuarioInstructor
    })

    if (evitarDobleAsignacion) {
        throw new HttpErrors('Este coordinador ya fue asignado a este instructor', 400)
    }

    await UsuarioAsignado.create({
        usuarioCoordinador: usuarioCoordinador,
        usuarioInstructor: usuarioInstructor
    })

    res.json({ msg: `Instructor ${checkInstructor.nombre} ${checkInstructor.apellido} asignado al Coordinador ${checkCoordinador.nombre} ${checkCoordinador.apellido}` })
}

const verAsignaciones = async (req, res) => {
    const verPersonalAsignado = await UsuarioAsignado.find()
        .populate('usuarioInstructor')
        .populate('usuarioCoordinador')

    if (verPersonalAsignado.length === 0) {
        return res.json({ msg: 'No hay usuarios asignados' })
    }

    // Al ser un arreglo sr itera sobre los elementos
    const usuarioInstructor = verPersonalAsignado.map(usuario => usuario.usuarioInstructor)
    const usuarioCoordinador = verPersonalAsignado.map(usuario => usuario.usuarioCoordinador)

    const usuariosAsignados = verPersonalAsignado.map(asignacion => ({
        nombreInstructor: `${asignacion.usuarioInstructor.nombre} ${asignacion.usuarioInstructor.apellido}`,
        nombreCoordinador: `${asignacion.usuarioCoordinador.nombre} ${asignacion.usuarioCoordinador.apellido}`,
        numeroContratoCoordinador: asignacion.usuarioCoordinador.numeroContrato ? asignacion.usuarioCoordinador.numeroContrato : '',
        numeroContratoInstructor: asignacion.usuarioInstructor.numeroContrato ? asignacion.usuarioInstructor.numeroContrato : '',
    }))

    res.json(usuariosAsignados)
}

const eliminarAsignacion = async (req, res) => {
    const { id } = req.params

    const existeAsignacion = await UsuarioAsignado.findByIdAndDelete(id)

    if (!existeAsignacion) {
        throw new HttpErrors()
    }

    res.json({ msg: 'Asignación de coordinador eliminada con exito' })
}

const actualizarAsignacion = async (req, res) => {
    const { id } = req.params
    const { usuarioInstructor, usuarioCoordinador } = req.body

    const obtenerdatosAsignacion = await UsuarioAsignado.findById(id)

    if (!obtenerdatosAsignacion) {
        throw new HttpErrors()
    }

    const verificarEstadosInstructor = await Usuarios.findById(usuarioInstructor).populate('rol')

    await validarUsuarioPorRol(verificarEstadosInstructor, 'INSTRUCTOR')

    const verificarEstadosCoordinador = await Usuarios.findById(usuarioCoordinador).populate('rol')

    await validarUsuarioPorRol(verificarEstadosCoordinador, 'COORDINADOR')

    obtenerdatosAsignacion.usuarioInstructor = verificarEstadosInstructor._id || obtenerdatosAsignacion.usuarioInstructor
    obtenerdatosAsignacion.usuarioCoordinador = verificarEstadosCoordinador._id || obtenerdatosAsignacion.usuarioCoordinador

    await obtenerdatosAsignacion.save()
    res.json({ msg: 'Actualización de asiganción exitosa' })

}

export {
    asignarUsuarios,
    verAsignaciones,
    eliminarAsignacion,
    actualizarAsignacion,
}
