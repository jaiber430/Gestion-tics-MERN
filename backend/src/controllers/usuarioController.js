import { v4 as uuidv4 } from 'uuid'

import Usuarios from '../models/Usuarios.js'
import Roles from "../models/Roles.js"
import TiposIdentificacion from '../models/TiposIdentificacion.js'

import HttpErrors from '../helpers/httpErrors.js'
import generarJWT from '../helpers/generarJWT.js'
import { emailRecuperacion } from '../helpers/enviarEmail.js'

const registrarUsuario = async (req, res) => {
    // Obtener los datos del usuario
    const { nombre, apellido, rol, tipoIdentificacion, numeroIdentificacion, email, password, tipoContrato, numeroContrato } = req.body

    //  Comprobar que los campos no lleguen vacios (Solo los requeridos)
    if (!nombre || !apellido || !rol || !tipoIdentificacion || !numeroIdentificacion || !email || !password || !tipoContrato) {
        throw new HttpErrors('Todos los datos son requeridos', 400)
    }

    // Verificar que el rol exista
    const comprobarRol = await Roles.findById(rol)

    if (!comprobarRol) {
        throw new HttpErrors('El rol selecionado no existe', 404)
    }

    // Verificar que el tipo identificación exista
    const comprobarTipoIdentificacion = await TiposIdentificacion.findById(tipoIdentificacion)

    if (!comprobarTipoIdentificacion) {
        throw new HttpErrors('El tipo de identificación no existe', 404)
    }

    // Verificar que el correo y numero de identificación no existan (Evitar duplicados)
    const existeUsuario = await Usuarios.findOne({
        $or: [
            { email },
            { numeroIdentificacion },
        ]
    })

    if (existeUsuario) {
        throw new HttpErrors('EL usuario ya existe', 409)
    }

    // Verificar que el correo sea valido
    const caracteresEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!caracteresEmail.test(email)) {
        throw new HttpErrors('El correo no es valido', 400)
    }

    // Verificar que la contraseña tenga minimo 8 caracteres
    if (password.length <= 7) {
        throw new HttpErrors('La contraseña es muy corta', 400)
    }

    // Comprobar el contrato
    if (tipoContrato !== 'Contrato' && tipoContrato !== 'Planta') {
        throw new HttpErrors('Contrato no valido', 400)
    }

    // Verificar si al ser contrato se envia su numero
    if (tipoContrato === 'Contrato' && !numeroContrato) {
        throw new HttpErrors('El numero de contrato requerido', 400)
    }

    // Comprobar que el nnumero de contrato no se repita
    const numeroContratoExiste = await Usuarios.findOne({ numeroContrato })
    if (numeroContratoExiste) {
        throw new HttpErrors('EL numero de contrato ya existe', 409)
    }

    // Crear usuario
    await Usuarios.create(req.body)

    // Guardar datos que se desean visualizar
    const nuevoUsuario = ({
        nombre: nombre,
        apellido: apellido,
        rol: rol,
        tipoIdentificacion: tipoIdentificacion,
        numeroIdentificacion: numeroIdentificacion,
        email: email,
        tipoContrato: tipoContrato,
        numeroContrato: numeroContrato
    })

    res.status(200).json({
        msg: "Te has registrado con exito espera la verificación de un administrador"
    })
}

const iniciarSesion = async (req, res) => {
    const { numeroIdentificacion, password } = req.body

    const existeUsuario = await Usuarios.findOne({ numeroIdentificacion })

    if (!existeUsuario) {
        throw new HttpErrors('El usuario no existe registrate para usar el sistema', 404)
    }

    const passwordCorrecta = await existeUsuario.comprobarPassword(password)
    if (!passwordCorrecta) {
        throw new HttpErrors('Credenciales invalidas', 400)
    }

    if (!existeUsuario.verificado) {
        throw new HttpErrors('Tu cuenta aun no ha sido verificada', 409)
    }

    if (!existeUsuario.contratoActivo) {
        throw new HttpErrors('Usted no esta contratado por la entidad', 409)
    }

    const token = generarJWT(existeUsuario._id)

    // Crear cookie si todo es correcto
    res.cookie('token', token, {
        // No poder acceder al token usando JS
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        // 30d
        maxAge: 30 * 24 * 60 * 60 * 1000
    })


    const usuarioLogueado = {
        id: existeUsuario._id,
        nombre: existeUsuario.nombre,
        apellido: existeUsuario.apellido,
        rol: existeUsuario.rol,
        numeroIdentificacion: existeUsuario.numeroIdentificacion,
        email: existeUsuario.email
    }

    res.send(usuarioLogueado)
}

const recuperarPassword = async (req, res) => {
    const { email } = req.body

    const existeEmail = await Usuarios.findOne({ email })
    if (!existeEmail) {
        throw new HttpErrors('El correo no encontrado', 404)
    }

    const generarPassword = uuidv4()
    const passwordActualizada = generarPassword.slice(0, 8)

    emailRecuperacion({
        email: existeEmail.email,
        passwordActualizada: passwordActualizada
    })

    existeEmail.password = passwordActualizada


    await existeEmail.save()
    res.send('Contraseña actualizada')
}

const profile = async (req, res) => {
    res.send('Hola mundo')
}

export {
    iniciarSesion,
    registrarUsuario,
    recuperarPassword,
    profile
}
