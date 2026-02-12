import { v4 as uuidv4 } from 'uuid'
import mongoose from 'mongoose'

import Usuarios from '../models/Usuarios.js'
import Roles from "../models/Roles.js"
import TiposIdentificacion from '../models/TiposIdentificacion.js'
import UsuarioAsignado from '../models/UsuarioAsignado.js'

import HttpErrors from '../helpers/httpErrors.js'
import generarJWT from '../helpers/generarJWT.js'
import { emailRecuperacion } from '../helpers/enviarEmailRecuperarPassword.js'
import { formatearFechaInicio, formatearFechaFin } from '../helpers/formatearFechas.js'

const registrarUsuario = async (req, res) => {
    // Obtener los datos del usuario
    const { nombre, apellido, rol, tipoIdentificacion, numeroIdentificacion, email, password, tipoContrato, numeroContrato, inicioContrato, finContrato, } = req.body

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
    if (tipoContrato === 'Contrato' && !numeroContrato || !inicioContrato || !finContrato) {
        throw new HttpErrors('El numero de contrato, su fecha inicio y fin son requeridos', 400)
    }

    const inicio = formatearFechaInicio(inicioContrato)
    const fin = formatearFechaFin(finContrato)

    if (inicio > fin) {
        throw new HttpErrors('La fecha de finalización no puede ser antes que la de inicio', 400)
    }

    // Comprobar si envia el numero de contrato
    if (numeroContrato) {
        // Comprobar que el numero de contrato no se repita
        const numeroContratoExiste = await Usuarios.findOne({ numeroContrato })
        if (numeroContratoExiste) {
            throw new HttpErrors('EL numero de contrato ya existe', 409)
        }
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
        throw new HttpErrors('El correo no ha sido encontrado', 404)
    }

    const generarPassword = uuidv4()
    const passwordActualizada = generarPassword.slice(0, 8)

    emailRecuperacion({
        email: existeEmail.email,
        passwordActualizada: passwordActualizada
    })

    existeEmail.password = passwordActualizada

    await existeEmail.save()
    res.send('Se ha enviado a su correo la nueva contraseña')
}

const comprobarCookies = async (req, res) => {
    res.send('Este usuario esta loguado y tiene el rol permitido')
}

const verUsuarios = async (req, res) => {
    const verUsuariosNoverificados = await Usuarios.find({
        // $or => Si cumple al menos una de todas las condiciones devuelve los datos
        $or: [
            // $ne => Obtener datos diferentes a la petición
            { verificado: { $ne: true } },
            { contratoActivo: { $ne: true } }
        ]
    })
    if (verUsuariosNoverificados <= 0) {
        res.json({
            msg: "No se encuantran usuarios para verificar"
        })
    } else {
        res.json(verUsuariosNoverificados)
    }
}

const verificarUsuarios = async (req, res) => {
    const { id } = req.params
    const { verificado, contratoActivo, usuarioCoordinador } = req.body

    // Todas las operaciones que usen la sesión pertenecera al mismo blocke de codigo
    const session = await mongoose.startSession()
    session.startTransaction()

    try {

        // Actualizar por medio del id el usuario
        const verificarUsuarioById = await Usuarios.findByIdAndUpdate(
            id,
            { verificado, contratoActivo },
            { new: true, session },
        )

        if (!verificarUsuarioById) {
            throw new HttpErrors('Usuario no encontrado', 404)
        }

        const verificarCoordinador = await Usuarios.findById(usuarioCoordinador).populate('rol').session(session)

        // Validar que el dato exista y sea coordinador
        if (!verificarCoordinador || verificarCoordinador.rol.nombreRol !== 'COORDINADOR') {
            throw new HttpErrors('El usuario no es coordinador', 400)
        }

        if (!verificarCoordinador.verificado || !verificarCoordinador.contratoActivo) {
            throw new HttpErrors('El coordinador aun no ha sido verificado', 400)
        }

        // Crear un nuevo dato en el modelo UsuarioAsignado
        await UsuarioAsignado.create([{
            usuarioInstructor: verificarUsuarioById._id,
            usuarioCoordinador: verificarCoordinador._id
        }], { session })

        // Si todo sale bien Guarda los datos
        await session.commitTransaction()
        // Finaliza la sesión
        session.endSession()

        res.json({
            msg: "Instructor verificado con exito y asignado al coordinador",
        })
    } catch (error) {
        // Si algo sale mal cancela todo
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

export {
    iniciarSesion,
    registrarUsuario,
    recuperarPassword,
    comprobarCookies,
    verUsuarios,
    verificarUsuarios
}
