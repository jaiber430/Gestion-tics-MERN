import mongoose from "mongoose"
import fs from 'fs';
import path from 'path';

import solicitudCerradaService from "../services/solicitudCerradaServices.js"
import solicitudAbiertaService from "../services/solicitudAbiertaservices.js"

import HttpErrors from "../helpers/httpErrors.js"
import Empresa from "../models/Empresa.js"

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

        // console.log("FILE:", req.file)
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

        // --- Mover PDF de la carpeta del NIT a la carpeta final de la solicitud ---

        // Obtener la empresa asociada a la solicitud SOLO si es oferta cerrada
        if (nuevaSolicitud[0].tipoOferta === "Cerrada") {
            const empresa = await Empresa.findById(nuevaSolicitud[0].empresaSolicitante).session(session);

            if (!empresa) {
                throw new HttpErrors('Empresa no encontrada', 404);
            }

            if (req.file) {
                // Carpeta final de la solicitud
                const rutaDestino = path.join(
                    "uploads",
                    `solicitud-${nuevaSolicitud[0]._id}`,
                    "documents"
                );

                fs.mkdirSync(rutaDestino, { recursive: true });

                const extension = path.extname(req.file.originalname);
                const nombreArchivo = `carta-${nuevaSolicitud[0]._id}${extension}`;
                const rutaFinal = path.join(rutaDestino, nombreArchivo);

                // Mover archivo desde donde lo subió multer
                fs.renameSync(req.file.path, rutaFinal);

                // Actualizar la empresa con la ruta final del PDF
                empresa.cartaSolicitud = rutaFinal;
                await empresa.save({ session });
            }
        }

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

// TODO: Prubas subir datos en caso de error
const crearEmpresa = async (req, res) => {
    await Caracterizacion.create({
        nombreEmpresa: 'Probando',
        nombreResponsable: 'Hi',
        emailEmpresa: 'test@gmail.com',
        nitEmpresa: 3071104,
        tipoEmpresa: "698ec762559e1dce79141c69",
        cartaSolicitud: null
    })

    res.json({
        msg: 'Good'
    })
}

export {
    tipoSolicitud,
    crearSolicitud,
    // eliminar despues
    crearEmpresa
}
