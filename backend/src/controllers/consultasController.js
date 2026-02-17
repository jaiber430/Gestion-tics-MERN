import mongoose from 'mongoose'
import path from 'path'

import Solicitud from "../models/Solicitud.js"
import UsuarioAsignado from '../models/UsuarioAsignado.js'
import RevisionCoordinador from '../models/RevisionCoordinador.js'
import Ficha from "../models/Ficha.js"

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

const verSolicitudesFuncionario = async (req, res) => {

    const solicitudes = await Solicitud.find({ revisado: true })

    if (solicitudes.length === 0) {
        throw new HttpErrors(
            'No hay solicitudes revisadas por el instructor',
            404
        )
    }

    const solicitudesIds = solicitudes.map(s => s._id)

    const revisionesAprobadas = await RevisionCoordinador.find({
        solicitud: { $in: solicitudesIds },
        estado: true
    })
        .populate('usuarioSolicitante', 'nombre email')
        .populate('solicitud')

    if (revisionesAprobadas.length === 0) {
        throw new HttpErrors(
            'No hay solicitudes aprobadas por el coordinador',
            404
        )
    }

    res.status(200).json(revisionesAprobadas)
}

const revisarSolicitudFuncionario = async (req, res) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const { idSolicitud } = req.params
        const { estado, observacion, codigoFicha, codigoSolicitud } = req.body

        // Verificar que la solicitud exista y esté revisada
        const solicitud = await Solicitud.findOne({
            _id: idSolicitud,
            revisado: true
        }).session(session)

        if (!solicitud) {
            throw new HttpErrors('Solicitud no encontrada o no revisada', 404)
        }

        if (codigoFicha !== codigoSolicitud) {
            throw new HttpErrors('El codigo de ficha debe ser igual al codigo de solicitud', 400)
        }

        const estadosValidos = ['Creación', 'Creada', 'Lista de espera', 'Matriculada', 'Rechazada']

        if (!estadosValidos.includes(estado)) {
            throw new HttpErrors('Estado no válido', 400)
        }

        const updateSolicitud = await Solicitud.findOneAndUpdate(
            { _id: idSolicitud },
            { codigoSolicitud: codigoSolicitud },
            {
                new: true,
                upsert: true,
                session
            }
        )

        const estadosPermitidosCodigo = [
            'Creada',
            'Matriculada',
            'Rechazada'
        ]

        if (codigoFicha !== null && !estadosPermitidosCodigo.includes(estado) && codigoSolicitud !== null) {
            throw new HttpErrors('El código de ficha y código de solicitud solo pueden asignarse cuando el estado es Rechazado, creado o matriculado', 403)
        }

        // Objeto que puede cambiar
        const dataFicha = {
            solicitud: idSolicitud,
            estado,
            observacion,
            usuarioSolicitante: solicitud.usuarioSolicitante,
            fechaRevisonFicha: new Date()
        }

        if (codigoFicha !== undefined) {
            dataFicha.codigoFicha = codigoFicha
        }

        const fichaUpdate = await Ficha.findOneAndUpdate(
            { solicitud: idSolicitud },
            dataFicha,
            {
                new: true,
                upsert: true,
                session
            }
        )

        await session.commitTransaction()
        session.endSession()
        res.status(200).json({
            msg: "Revisión realizada correctamente",
            fichaUpdate
        })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
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
    const { idSolicitud } = req.params

    const solicitud = await Solicitud.findOne({
        _id: idSolicitud,
        revisado: true
    })

    if (!solicitud) {
        throw new HttpErrors('No existe la ficha de caracterización de la solicitud revisada', 404)
    }

    const solicitudRevisada = await RevisionCoordinador.findOne({
        solicitud: solicitud._id,
        estado: true
    })

    if (!solicitudRevisada) {
        throw new HttpErrors('La solicitud aun no ha sido aprovada por un coordinador', 403)
    }

    const nameFile = `ficha-${idSolicitud}.docx`

    const rutaCarta = path.join(
        process.cwd(), 'uploads', `solicitud-${idSolicitud}`, 'documents', nameFile
    )

    res.download(rutaCarta)
}

const descargarDocumentoAspirantes = async (req, res) => {
    const { idSolicitud } = req.params

    const solicitud = await Solicitud.findOne({
        _id: idSolicitud,
        revisado: true
    })

    if (!solicitud) {
        throw new HttpErrors('No existen los documentos de los aspirantes', 404)
    }

    const solicitudRevisada = await RevisionCoordinador.findOne({
        solicitud: solicitud._id,
        estado: true
    })

    if (!solicitudRevisada) {
        throw new HttpErrors('La solicitud aun no ha sido aprovada por un coordinador', 403)
    }

    const nameFile = `combinado.pdf`

    const rutaCarta = path.join(
        process.cwd(), 'uploads', `solicitud-${idSolicitud}`, 'DocumentoAspirantes', nameFile
    )

    res.download(rutaCarta)
}

const descargarFormatoMasivo = async (req, res) => {
    const { idSolicitud } = req.params

    const solicitud = await Solicitud.findOne({
        _id: idSolicitud,
        revisado: true
    })

    if (!solicitud) {
        throw new HttpErrors('No existe el formato de inscripción masivo de la solicitud revisada', 404)
    }

    const solicitudRevisada = await RevisionCoordinador.findOne({
        solicitud: solicitud._id,
        estado: true
    })

    if (!solicitudRevisada) {
        throw new HttpErrors('La solicitud aun no ha sido aprovada por un coordinador', 403)
    }

    const nameFile = `masivo-${idSolicitud}.xlsx`

    const rutaMasivo = path.join(
        process.cwd(), 'uploads', `solicitud-${idSolicitud}`, 'documents', nameFile
    )

    res.download(rutaMasivo)
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
    verSolicitudesFuncionario,
    revisarSolicitudFuncionario,
    descargarCartaSolicitud,
    descargarFichaCaracterizacion,
    descargarDocumentoAspirantes,
    descargarFormatoMasivo,
}
