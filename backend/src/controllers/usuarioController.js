import { v4 as uuidv4 } from 'uuid'
import mongoose, { model } from 'mongoose'

import Usuarios from '../models/Usuarios.js'
import Roles from "../models/Roles.js"
import TiposIdentificacion from '../models/TiposIdentificacion.js'
import ProgramasEspeciales from '../models/ProgramasEspeciales.js'
import ProgramasEspecialesCampesena from '../models/ProgramasEspecialesCampesena.js'

import HttpErrors from '../helpers/httpErrors.js'
import generarJWT from '../helpers/generarJWT.js'
import { emailRecuperacion } from '../helpers/enviarEmailRecuperarPassword.js'
import { formatearFechaInicio, formatearFechaFin } from '../helpers/formatearFechas.js'

const iniciarSesion = async (req, res) => {
    const { numeroIdentificacion, password } = req.body

    if ([numeroIdentificacion, password].includes('')) {
        throw new HttpErrors('Todas las credenciales son requeridas', 400)
    }

    const existeUsuario = await Usuarios.findOne({ numeroIdentificacion }).populate('rol')

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

    if (existeUsuario.tipoContrato === 'Contrato' && !existeUsuario.contratoActivo) {
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
        rol: existeUsuario.rol.nombreRol,
        numeroIdentificacion: existeUsuario.numeroIdentificacion,
        email: existeUsuario.email
    }

    res.send(usuarioLogueado)
}

const registrarUsuario = async (req, res) => {

    const {
        nombre,
        apellido,
        rol,
        tipoIdentificacion,
        numeroIdentificacion,
        email,
        password,
        tipoContrato,
        numeroContrato,
        inicioContrato,
        finContrato,
        programaEspecial,
        modelosProgramasEspeciales,
        coordinadorAsignado
    } = req.body

    console.log(req.body)

    if (!nombre || !apellido || !rol || !tipoIdentificacion || !numeroIdentificacion || !email || !password || !tipoContrato) {
        throw new HttpErrors('Todos los datos son requeridos', 400)
    }


    const comprobarRol = await Roles.findById(rol)

    if (!comprobarRol) {
        throw new HttpErrors('El rol selecionado no existe', 404)
    }


    // VALIDACIÓN INSTRUCTOR
    if (comprobarRol.nombreRol === "INSTRUCTOR") {

        if (!coordinadorAsignado) {
            throw new HttpErrors("Debe seleccionar un coordinador", 400)
        }

        const existeCoordinador = await Usuarios.findById(coordinadorAsignado)
            .populate("rol")

        if (!existeCoordinador) {
            throw new HttpErrors("El coordinador seleccionado no existe", 404)
        }

        if (existeCoordinador.rol.nombreRol !== "COORDINADOR") {
            throw new HttpErrors("El usuario seleccionado no es coordinador", 400)
        }
    }


    // Si NO es instructor → eliminar coordinadorAsignado
    if (comprobarRol.nombreRol !== "INSTRUCTOR") {
        delete req.body.coordinadorAsignado
    }


    // VALIDACIÓN COORDINADOR
    if (comprobarRol.nombreRol === "COORDINADOR") {

        const programasPermitidos = [
            "ProgramasEspeciales",
            "ProgramasEspecialesCampesena"
        ]

        if (!programasPermitidos.includes(modelosProgramasEspeciales)) {
            throw new HttpErrors('El programa especial no es valido', 400)
        }

        if (!programaEspecial || !modelosProgramasEspeciales) {
            throw new HttpErrors('El programa especial es requerido', 400)
        }

        if (modelosProgramasEspeciales === "ProgramasEspeciales") {

            const programaRegular =
                await ProgramasEspeciales.findById(programaEspecial)

            if (!programaRegular) {
                throw new HttpErrors(
                    'El programa especial regular no existe',
                    404
                )
            }

        } else {

            const programaRegular =
                await ProgramasEspecialesCampesena.findById(programaEspecial)

            if (!programaRegular) {
                throw new HttpErrors(
                    'El programa especial CampeSENA no existe',
                    404
                )
            }
        }
    }


    if (comprobarRol.nombreRol !== "COORDINADOR") {
        delete req.body.programaEspecial
        delete req.body.modelosProgramasEspeciales
    }


    const comprobarTipoIdentificacion =
        await TiposIdentificacion.findById(tipoIdentificacion)

    if (!comprobarTipoIdentificacion) {
        throw new HttpErrors('El tipo de identificación no existe', 404)
    }


    const existeUsuario = await Usuarios.findOne({
        $or: [
            { email },
            { numeroIdentificacion },
        ]
    })

    if (existeUsuario) {
        throw new HttpErrors('EL usuario ya existe', 409)
    }


    const caracteresEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!caracteresEmail.test(email)) {
        throw new HttpErrors('El correo no es valido', 400)
    }


    if (password.length <= 7) {
        throw new HttpErrors('La contraseña debe tener minimo 8 caracteres', 400)
    }


    if (tipoContrato !== 'Contrato' && tipoContrato !== 'Planta') {
        throw new HttpErrors('Contrato no valido', 400)
    }


    //VALIDACIÓN SOLO SI ES CONTRATO
    if (tipoContrato === 'Contrato') {

        if (!numeroContrato || !inicioContrato || !finContrato) {
            throw new HttpErrors(
                'El numero de contrato, su fecha inicio y fin son requeridos',
                400
            )
        }

        const inicio = formatearFechaInicio(inicioContrato)
        const fin = formatearFechaFin(finContrato)

        if (inicio > fin) {
            throw new HttpErrors(
                'La fecha de finalización no puede ser antes que la de inicio',
                400
            )
        }

        const numeroContratoExiste =
            await Usuarios.findOne({ numeroContrato })

        if (numeroContratoExiste) {
            throw new HttpErrors(
                'EL numero de contrato ya existe',
                409
            )
        }
    }


    await Usuarios.create(req.body)


    res.status(200).json({
        msg: "Te has registrado con exito espera la verificación de un administrador"
    })
}

const coordinadores = async (req, res) => {
    try {
        // Primero obtenemos el _id del rol 'COORDINADOR'
        const rolCoordinador = await Roles.findOne({ nombreRol: "COORDINADOR" });
        if (!rolCoordinador) {
            return res.status(404).json({ msg: "No existe el rol de coordinador" });
        }

        // Buscamos usuarios con ese rol, verificados y con contrato activo
        const coordinadoresEncontrados = await Usuarios.find({
            rol: rolCoordinador._id,
            verificado: true,
            contratoActivo: true
        })
            .select("nombre apellido") // Solo campos que quieras mostrar
            .populate("rol", "nombreRol"); // Popular el rol para mostrar el nombre

        res.json(coordinadoresEncontrados);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener coordinadores" });
    }
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
    res.json({ msg: 'Se ha enviado a su correo la nueva contraseña' })
}

const verUsuarios = async (req, res) => {
    const verUsuariosNoverificados = await Usuarios.find({
        // $or => Si cumple ambas condiciones
        $or: [
            // $ne => Obtener datos diferentes a la petición
            { verificado: { $ne: true } },
            { contratoActivo: { $ne: true } }
        ]
    })
        .populate('rol')
        .populate('tipoIdentificacion')
        .populate('programaEspecial')
    if (verUsuariosNoverificados.length === 0) {
        return res.json({
            msg: "No se encuantran usuarios para verificar"
        })
    }

    const verUsuarios = verUsuariosNoverificados.map(usuario => ({
        _id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        numeroIdentificacion: usuario.numeroIdentificacion,
        rol: usuario.rol.nombreRol,
        numeroContrato: usuario.numeroContrato ? usuario.numeroContrato : '',
        tipoPrograma: usuario.modelosProgramasEspeciales ? usuario.modelosProgramasEspeciales : "",
        nombrePrograma: usuario.programaEspecial?.programaEspecial ? usuario.programaEspecial?.programaEspecial : ""
    }))

    res.json(verUsuarios)
}

const verificarUsuarios = async (req, res) => {
    const { id } = req.params
    const { verificado } = req.body

    const usuarioExiste = await Usuarios.findById(id)

    if (!usuarioExiste) {
        throw new HttpErrors('Uusario a verificar no encontrado', 404)
    }

    usuarioExiste.verificado = verificado || usuarioExiste.verificado

    await usuarioExiste.save()
    res.json({ msg: 'Usuario verificado correctamente' })
}

const activarContrato = async (req, res) => {
    const { id } = req.params
    const { contratoActivo } = req.body

    const usuarioExiste = await Usuarios.findById(id)

    if (!usuarioExiste) {
        throw new HttpErrors('Uusario a verificar no encontrado', 404)
    }

    usuarioExiste.contratoActivo = contratoActivo || usuarioExiste.contratoActivo

    await usuarioExiste.save()
    res.json({ msg: 'Contrato activado correctamente' })
}

export {
    iniciarSesion,
    registrarUsuario,
    recuperarPassword,
    verUsuarios,
    verificarUsuarios,
    activarContrato,
    coordinadores,
}
