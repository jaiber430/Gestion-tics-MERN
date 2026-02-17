import mongoose from "mongoose"

import solicitudCerradaService from "../services/solicitudCerradaServices.js"
import solicitudAbiertaService from "../services/solicitudAbiertaservices.js"

import HttpErrors from "../helpers/httpErrors.js"

const tipoSolicitud = async (req, res) => {
    const { solicitud } = req.params

    res.send('Hi', solicitud)
}

const crearSolicitud = async (req, res) => {

    const { tipo } = req.params
    const { tipoOferta } = req.body

    if (!['campesena', 'regular'].includes(tipo)) {
        throw new HttpErrors('URL no encontrada', 404)
    }

    const session = await mongoose.startSession()

    try {
        await session.startTransaction()

        const tipoSolicitud = tipo === 'campesena'
            ? 'CampeSENA'
            : 'Regular'

        if (tipoOferta === "Cerrada" && !req.file) {
            throw new HttpErrors('No se envió ningún archivo PDF', 400)
        }

        const service = tipoOferta === "Cerrada"
            ? solicitudCerradaService
            : solicitudAbiertaService

        const { nuevaSolicitud } = await service(
            req.body,
            session,
            tipoOferta,
            req.usuario.id,
            tipoSolicitud,
            req.file
        )

        await session.commitTransaction()
        session.endSession()

        res.json({
            msg: "Solicitud creada con éxito",
            solicitud: nuevaSolicitud[0]
        })

    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        throw err
    }
}

export {
    tipoSolicitud,
    crearSolicitud,
}
