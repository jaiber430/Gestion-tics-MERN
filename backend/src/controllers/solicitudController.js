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

    const tipoSolicitud = 'CampeSENA'
    // Iniciar Sesion para guardar cambios en varios modelos
    const session = await mongoose.startSession()
    if (tipo === 'campesena') {
        // Todas las operaciones correctas que usen el la sesion van a ser creadas
        try {
            session.startTransaction()
            // Pedir campos en base a la oferta
            if (tipoOferta === "Cerrada") {
                // Enviar datos reqeuridos para la solicitud Si es cerrada
                const { nuevaSolicitud } = await solicitudCerradaService(req.body, session, tipoOferta, req.usuario.id, tipoSolicitud)

                // Si todo sale bien guardar los cambios en modelos, etc
                await session.commitTransaction()
                // Finalizar la sesion
                session.endSession()

                // Devolver la respuesta + la solicitud que se creo
                res.json({
                    msg: "Solicitud creada con exito",
                    solicitud: nuevaSolicitud[0]
                })
            } else {
                const { nuevaSolicitud } = await solicitudAbiertaService(req.body, session, tipoOferta, req.usuario.id, tipoSolicitud)

                await session.commitTransaction()
                session.endSession()

                res.json({
                    msg: "Solicitud creada con exito",
                    solicitud: nuevaSolicitud[0]
                })
            }
        } catch (err) {
            // Si algo sale mal cancela todo (No guarda nada)
            await session.abortTransaction()
            // Finalizar sesión
            session.endSession()
            throw err
        }
        // Si la empresa es regular
    } else if (tipo === 'regular') {
        // Todas las operaciones correctas que usen el la sesion van a ser creadas
        const session = await mongoose.startSession()

        const tipoSolicitud = 'Regular'
        try {
            session.startTransaction()
            // Pedir campos en base a la oferta
            if (tipoOferta === "Abierta") {

                const { nuevaSolicitud } = await solicitudAbiertaService(req.body, session, tipoOferta, req.usuario.id, tipoSolicitud)

                await session.commitTransaction()
                session.endSession()

                res.json({
                    msg: "Solicitud creada con exito",
                    solicitud: nuevaSolicitud[0]
                })
            } else {

                const { nuevaSolicitud } = await solicitudCerradaService(req.body, session, tipoOferta, req.usuario.id, tipoSolicitud)

                await session.commitTransaction()
                session.endSession()

                res.json({
                    msg: "Solicitud creada con exito",
                    solicitud: nuevaSolicitud[0]
                })
            }
        } catch (err) {
            // Si algo sale mal cancela todo
            await session.abortTransaction()
            session.endSession()
            throw err
        }
    } else {
        throw new HttpErrors('URL no encontada', 404)
    }
}

export {
    tipoSolicitud,
    crearSolicitud,
}
