import mongoose from 'mongoose'
import path from 'path'

import Solicitud from "../models/Solicitud.js"
import UsuarioAsignado from '../models/UsuarioAsignado.js'
import RevisionCoordinador from '../models/RevisionCoordinador.js'

import HttpErrors from '../helpers/httpErrors.js'
import generarCartaCoordinador from '../services/generarCartaCoordinador.js'

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
        .populate('tipoOferta')

    res.json(solicitud)
}

const revisarSolicitud = async (req, res) => {
    const { idSolicitud } = req.params
    const { estado, observacion } = req.body

    const session = await mongoose.startSession()

    try {
        session.startTransaction()
        if (!observacion) {
            throw new HttpErrors('Todos los campos son requeridos', 400)
        }

        const existeSolicitud = await Solicitud
            .findById(idSolicitud)

        if (!existeSolicitud) {
            throw new HttpErrors('Solicitud no encontarda', 404)
        }

        if (!existeSolicitud.revisado) {
            throw new HttpErrors('la solicitud aun no ha sido aprovada por el instructor', 409)
        }

        if (existeSolicitud.empresaSolicitante === null) {
            await generarCartaCoordinador(req.usuario.id, existeSolicitud.usuarioSolicitante, idSolicitud, session)
        }

        const revision = await RevisionCoordinador.findOneAndUpdate(
            { solicitud: idSolicitud }, // criterio de búsqueda
            {
                usuarioSolicitante: existeSolicitud.usuarioSolicitante,
                usuarioCoordinador: req.usuario.id,
                solicitud: idSolicitud,
                estado,
                observacion
            },
            {
                new: true,      // devuelve el documento actualizado
                upsert: true    // si no existe lo crea
            }
        )
        await revision.save()
        await session.commitTransaction()
        session.endSession()
        res.json({
            msg: 'Revisión realizada exitosamente'
        })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

const verFichaCaracterizacionCoordinador = async (req, res) => {
    const { idSolicitud } = req.params

    const solicitud = await Solicitud.findOne({
        _id: idSolicitud,
    })

    if (!solicitud) {
        throw new HttpErrors('No existe la ficha de caracterización', 404)
    }

    const nameFile = `ficha-${idSolicitud}.docx`

    const rutaFichaCaracterizacion = path.join(
        process.cwd(), 'uploads', `solicitud-${idSolicitud}`, 'documents', nameFile
    )

    res.sendFile(rutaFichaCaracterizacion)
}

const verFormatoMasivo = async (req, res) => {
    const { idSolicitud } = req.params

    const solicitud = await Solicitud.findOne({
        _id: idSolicitud,
    })

    if (!solicitud) {
        throw new HttpErrors('No existe el formato de aspirantes masivo', 404)
    }

    const nameFile = `masivo-${idSolicitud}.xlsx`

    const rutaMasivo = path.join(
        process.cwd(), 'uploads', `solicitud-${idSolicitud}`, 'documents', nameFile
    )

    res.sendFile(rutaMasivo)
}

const verCartaSolicitud = async (req, res) => {
    const { idSolicitud } = req.params

    const solicitud = await Solicitud.findOne({
        _id: idSolicitud,
    })

    if (!solicitud) {
        throw new HttpErrors('No existe la carta de solicitud', 404)
    }

    const nameFile = `carta-${idSolicitud}.pdf`

    const rutaCarta = path.join(
        process.cwd(), 'uploads', `solicitud-${idSolicitud}`, 'documents', nameFile
    )

    res.sendFile(rutaCarta)
}

const verDocumentoAspirantes = async (req, res) => {
    const { idSolicitud } = req.params

    const solicitud = await Solicitud.findOne({
        _id: idSolicitud,
    })

    if (!solicitud) {
        throw new HttpErrors('No existe la carta de solicitud', 404)
    }

    const nameFile = `combinado.pdf`

    const rutaCarta = path.join(
        process.cwd(), 'uploads', `solicitud-${idSolicitud}`, 'DocumentoAspirantes', nameFile
    )

    res.sendFile(rutaCarta)
}

const revisarSolicituFuncionario = async (req, res) => {

}

const descargarCartaSolicitud = async (req, res) => {
    const { idSolicitud } = req.params

    const solicitud = await Solicitud.findOne({
        _id: idSolicitud,
        revisado: true
    })

    if (!solicitud) {
        throw new HttpErrors('No existe la carta de solicitud revisada', 404)
    }

    const solicitudRevisada = await RevisionCoordinador.findOne({
        solicitud: solicitud._id,
        estado: true
    })

    if (!solicitudRevisada) {
        throw new HttpErrors('La solicitud aun no ha sido aprovada por un coordinador', 403)
    }

    if (solicitud.empresaSolicitante === null) {
        const nameFile = `carta-${idSolicitud}.docx`

        const rutaCarta = path.join(
            process.cwd(), 'uploads', `solicitud-${idSolicitud}`, 'documents', nameFile
        )

        return res.download(rutaCarta)
    }

    const nameFile = `carta-${idSolicitud}.pdf`

    const rutaCarta = path.join(
        process.cwd(), 'uploads', `solicitud-${idSolicitud}`, 'documents', nameFile
    )

    res.download(rutaCarta)
}

const descargarFichaCaracterizacion = async (req, res) => {

}

const descargarDocumentoAspirantes = async (req, res) => {

}

const descargarFormatoMasivo = async (req, res) => {

}

export {
    consultarSolicitudInstructor,
    enviarSolicitud,
    verFichaCaracterizacion,
    consultarSolicitudCoordinador,
    revisarSolicitud,
    verFichaCaracterizacionCoordinador,
    verFormatoMasivo,
    verCartaSolicitud,
    verDocumentoAspirantes,
    revisarSolicituFuncionario,
    descargarCartaSolicitud,
    descargarFichaCaracterizacion,
    descargarDocumentoAspirantes,
    descargarFormatoMasivo,
}
