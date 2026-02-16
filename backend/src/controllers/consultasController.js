import path from 'path'

import Solicitud from "../models/Solicitud.js"
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

export {
    consultarSolicitudInstructor,
    enviarSolicitud,
    verFichaCaracterizacion
}
