import path from 'path'

import Solicitud from "../models/Solicitud.js"
import UsuarioAsignado from '../models/UsuarioAsignado.js'
import RevisionCoordinador from '../models/RevisionCoordinador.js'

import HttpErrors from '../helpers/httpErrors.js'

const consultarSolicitudInstructor = async (req, res) => {
    const verSolicitudesInstructor = await Solicitud
        .find({ usuarioSolicitante: req.usuario.id })
        .select('tipoSolicitud')
        .populate({
            path: 'programaFormacion',
            select: 'nombrePrograma'
        })
        .populate('tipoOferta')
    res.json(verSolicitudesInstructor)
}

const enviarSolicitud = async (req, res) => {
    const { idSolicitud } = req.params

    const solicitud = await Solicitud.findOne({
        _id: idSolicitud,
        usuarioSolicitante: req.usuario.id
    })

    if (!solicitud) {
        throw new HttpErrors('No existe la ficha de caracterización', 404)
    }

    solicitud.revisado = true

    await solicitud.save()
    res.json({
        msg: 'Solicitud enviada espera la respuesta a tu solicitud'
    })
}

const verFichaCaracterizacion = async (req, res) => {
    const { idSolicitud } = req.params

    const solicitud = await Solicitud.findOne({
        _id: idSolicitud,
        usuarioSolicitante: req.usuario.id
    })

    if (!solicitud) {
        throw new HttpErrors('No existe la ficha de caracterización', 404)
    }

    const nameFile = `solicitud-${idSolicitud}.docx`

    const rutaFichaCaracterizacion = path.join(
        process.cwd(), 'src', 'uploads', `solicitud-${idSolicitud}`, 'documents', nameFile
    )

    res.sendFile(rutaFichaCaracterizacion)
}

const consultarSolicitudCoordinador = async (req, res) => {
    const verSolicitudes = await UsuarioAsignado
        .find({ usuarioCoordinador: req.usuario.id })
        .populate({
            path: 'usuarioInstructor',
            select: 'nombre apellido'
        })
        .lean()

    const verUsuarios = verSolicitudes
        .filter(usuarios => usuarios.usuarioInstructor)
        .map(usuario => usuario.usuarioInstructor._id)

    const solicitud = await Solicitud
        .find({
            usuarioSolicitante: { $in: verUsuarios },
            revisado: true
        })
        .select('tipoSolicitud')
        .populate({
            path: 'usuarioSolicitante',
            select: 'nombre apellido'
        })

    res.json(solicitud)
}

const revisarSolicitud = async (req, res) => {
    const { idSolicitud } = req.params
    const { estado, observacion } = req.body

    if (!observacion) {
        throw new HttpErrors('Todos los campos son requeridos', 400)
    }

    const existeSolicitud = await Solicitud.findById(idSolicitud)

    if (!existeSolicitud) {
        throw new HttpErrors('Solicitud no encontarda', 404)
    }

    if (!existeSolicitud.revisado) {
        throw new HttpErrors('la solicitud aun no ha sido aprovada por el instructor', 409)
    }

    const revisarSolicitud = new RevisionCoordinador({
        usuarioSolicitante: existeSolicitud.usuarioSolicitante,
        usuarioRevisador: req.usuario.id,
        solicitud: idSolicitud,
        estado: estado,
        observacion: observacion,
    })

    await revisarSolicitud.save()
    res.json({
        msg: 'Revisión realizada exitosamente'
    })
}

const verFichaCaracterizacionCoordinador = async (req, res) => {
    const { idSolicitud } = req.params

    const solicitud = await Solicitud.findOne({
        _id: idSolicitud,
    })

    if (!solicitud) {
        throw new HttpErrors('No existe la ficha de caracterización', 404)
    }

    const nameFile = `solicitud-${idSolicitud}.docx`

    const rutaFichaCaracterizacion = path.join(
        process.cwd(), 'src', 'uploads', `solicitud-${idSolicitud}`, 'documents', nameFile
    )

    res.sendFile(rutaFichaCaracterizacion)
}

const verFormatoMasivo = async (req, res) => {
    const { idSolicitud } = req.params

    const solicitud = await Solicitud.findOne({
        _id: idSolicitud,
    })

    if (!solicitud) {
        throw new HttpErrors('No existe la ficha de caracterización', 404)
    }

    const nameFile = `solicitud-${idSolicitud}.xlsx`

    const rutaFichaCaracterizacion = path.join(
        process.cwd(), 'src', 'uploads', `solicitud-${idSolicitud}`, 'documents', nameFile
    )

    res.sendFile(rutaFichaCaracterizacion)
}

export {
    consultarSolicitudInstructor,
    enviarSolicitud,
    verFichaCaracterizacion,
    consultarSolicitudCoordinador,
    revisarSolicitud,
    verFichaCaracterizacionCoordinador,
    verFormatoMasivo
}
