import Usuarios from '../models/Usuarios.js'
import Roles from "../models/Roles.js"
import TiposIdentificacion from '../models/TiposIdentificacion.js'

import HttpErrors from '../helpers/httpErrors.js'

const registrarUsuario = async (req, res) => {
    const { nombre, apellido, rol, tipoIdentificacion, numeroIdentificacion, email, password, tipoContrato, numeroContrato } = req.body

    if (!nombre || !apellido || !rol || !tipoIdentificacion || !numeroIdentificacion || !email || !password || !tipoContrato) {
        throw new HttpErrors('Todos los datos son requeridos', 400)
    }

    const comprobarRol = await Roles.findById(rol)

    if (!comprobarRol) {
        throw new HttpErrors('El rol selecionado no existe', 404)
    }

    const comprobarTipoIdentificacion = await TiposIdentificacion.findById(tipoIdentificacion)

    if (!comprobarTipoIdentificacion) {
        throw new HttpErrors('El tipo de identificación no existe', 404)
    }

    const caracteresEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!caracteresEmail.test(email)) {
        throw new HttpErrors('El correo no es valido', 400)
    }

    if (password.length <= 7) {
        throw new HttpErrors('La contraseña es muy corta', 400)
    }

    if(tipoContrato !== 'Contrato' && tipoContrato !== 'Planta'){
        throw new HttpErrors('Contrato no valido', 400)
    }

    const nuevoUsuario = new Usuarios({
        nombre: nombre,
        apellido: apellido,
        rol: rol,
        tipoIdentificacion: tipoIdentificacion,
        numeroIdentificacion: numeroIdentificacion,
        email: email,
        password: password,
        tipoContrato: tipoContrato,
    })

    await nuevoUsuario.save()
    res.json(nuevoUsuario)
}

const iniciarSesion = async (req, res) => {
}

const olvidePassword = async (req, res) => {

}

const recuperarPassword = async (req, res) => {
}



export {
    iniciarSesion,
    registrarUsuario,
    olvidePassword,
    recuperarPassword
}
