import mongoose from 'mongoose'
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'
import ExcelJS from "exceljs";

import Solicitud from "../models/Solicitud.js"
import RevisionCoordinador from '../models/RevisionCoordinador.js'
import Ficha from '../models/Ficha.js'
import Aspirantes from '../models/Aspirantes.js'

import HttpErrors from '../helpers/httpErrors.js'
import generarCartaCoordinador from '../services/generarCartaCoordinador.js'
import Usuarios from '../models/Usuarios.js'
import Fichas from '../models/Ficha.js'

const execAsync = promisify(exec)

const consultarSolicitudInstructor = async (req, res) => {
    const verSolicitudesInstructor = await Solicitud
        .find({ usuarioSolicitante: req.usuario.id })
        .populate('empresaSolicitante')
        .populate({ path: 'programaEspecial', select: 'programaEspecial' })
        .populate({
            path: 'programaFormacion',
            select: 'nombrePrograma area',
            populate: { path: 'area', select: 'area' }
        })
        .select('-__v')

    // Obtener fichas de todas las solicitudes
    const ids = verSolicitudesInstructor.map(s => s._id)
    const fichas = await Ficha.find({ solicitud: { $in: ids } }).select('solicitud estado')

    // Adjuntar ficha a cada solicitud
    const respuesta = verSolicitudesInstructor.map(s => ({
        ...s.toObject(),
        ficha: fichas.find(f => f.solicitud.toString() === s._id.toString()) || null
    }))

    res.json(respuesta)
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

    if (!solicitud) throw new HttpErrors('No existe la ficha de caracterización', 404)

    const carpeta = path.join(process.cwd(), 'uploads', `solicitud-${idSolicitud}`, 'documents')
    const rutaDocx = path.join(carpeta, `ficha-${idSolicitud}.docx`)
    const rutaPdf = path.join(carpeta, `ficha-${idSolicitud}.pdf`)

    if (!fs.existsSync(rutaPdf)) {
        await execAsync(`"C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pdf --outdir "${carpeta}" "${rutaDocx}"`)
    }

    res.sendFile(rutaPdf)
}

const verFichaCaracterizacionCoordinador = async (req, res) => {
    const { idSolicitud } = req.params

    const solicitud = await Solicitud.findOne({
        _id: idSolicitud,
    })

    if (!solicitud) throw new HttpErrors('No existe la ficha de caracterización', 404)

    const carpeta = path.join(process.cwd(), 'uploads', `solicitud-${idSolicitud}`, 'documents')
    const rutaDocx = path.join(carpeta, `ficha-${idSolicitud}.docx`)
    const rutaPdf = path.join(carpeta, `ficha-${idSolicitud}.pdf`)

    if (!fs.existsSync(rutaPdf)) {
        await execAsync(`"C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pdf --outdir "${carpeta}" "${rutaDocx}"`)
    }

    res.sendFile(rutaPdf)
}


const consultarSolicitudCoordinador = async (req, res) => {
    try {
        const usuarios = await Usuarios.find({ coordinadorAsignado: req.usuario.id })
        console.log(usuarios)

        const dataInstructor = usuarios.map(u => u._id)
        // console.log(dataInstructor)

        const solicitudes = await Solicitud.find({
            usuarioSolicitante: { $in: dataInstructor },
            revisado: true,
        })
            .populate('programaFormacion')
            .populate('usuarioSolicitante')
            .populate('empresaSolicitante')

        console.log(solicitudes)

        res.json(solicitudes)
    } catch (error) {
        console.log(error)
    }
}

const verPdfAspirantes = async (req, res) => {
    const { idAspirante } = req.params

    const aspirante = await Aspirantes.findById(idAspirante)
    if (!aspirante) {
        throw new HttpErrors('El aspirante no existe', 404)
    }

    if (!aspirante.archivo) {
        throw new HttpErrors('El aspirante no tiene PDF registrado', 404)
    }

    if (!fs.existsSync(aspirante.archivo)) {
        throw new HttpErrors('El archivo no existe en el servidor', 404)
    }

    res.sendFile(path.resolve(aspirante.archivo))
}


const revisarSolicitud = async (req, res) => {
    const { idSolicitud } = req.params
    const { estado, observacion } = req.body

    const session = await mongoose.startSession()

    try {
        session.startTransaction()
        if (estado === false & !observacion) {
            throw new HttpErrors('Si rechazas una solicitud debes enviar una observación', 400)
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
                usuarioRevisador: req.usuario.id,
                solicitud: idSolicitud,
                estado,
                observacion
            },
            {
                new: true,      // devuelve el documento actualizado
                upsert: true    // si no existe lo crea
            }
        )

        if (estado === false) {
            existeSolicitud.revisado = false
        }

        await existeSolicitud.save({ session })
        await revision.save()
        await session.commitTransaction()
        session.endSession()
        res.json('Revisión realizada exitosamente')
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

// Backend - retorna todo el array no elemento por elemento
const obtenerRevisiones = async (req, res) => {
    const getRevisiones = await RevisionCoordinador.find()
    res.json(getRevisiones)  // retorna el array completo
}

const verFormatoMasivo = async (req, res) => {
    const { idSolicitud } = req.params

    const rutaExcel = path.join(
        process.cwd(),
        'uploads',
        `solicitud-${idSolicitud}`,
        'documents',
        'excel masivo',
        `masivo-${idSolicitud}.xlsx`
    )

    if (!fs.existsSync(rutaExcel)) {
        throw new HttpErrors('El excel no existe', 404)
    }

    // Leer el excel y convertir a HTML
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(rutaExcel)
    const worksheet = workbook.getWorksheet(1)

    // Construir tabla HTML
    let html = `
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            table { border-collapse: collapse; width: 100%; }
                            th { background-color: #16a34a; color: white; padding: 10px; text-align: left; }
                            td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }
                            tr:nth-child(even) { background-color: #f9fafb; }
                            tr:hover { background-color: #f0fdf4; }
                        </style>
                    </head>
                    <body>
                        <table>
                `

    worksheet.eachRow((row, rowNumber) => {
        html += '<tr>'
        row.eachCell({ includeEmpty: true }, (cell) => {
            if (rowNumber === 1) {
                html += `<th>${cell.value ?? ''}</th>`
            } else {
                html += `<td>${cell.value ?? ''}</td>`
            }
        })
        html += '</tr>'
    })

    html += `</table></body></html>`

    res.send(html)
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

    const rutaCombinado = path.join(
        process.cwd(), 'uploads', `solicitud-${idSolicitud}`, 'DocumentosAspirantes', nameFile
    )

    res.sendFile(rutaCombinado)
}

const verSolicitudesFuncionario = async (req, res) => {

    const solicitudes = await Solicitud.find({ revisado: true })

    if (solicitudes.length === 0) {
        throw new HttpErrors('No hay solicitudes revisadas por el instructor', 404)
    }

    const solicitudesIds = solicitudes.map(s => s._id)

    const revisionesAprobadas = await RevisionCoordinador.find({
        solicitud: { $in: solicitudesIds },
        estado: true
    })
        .populate('usuarioSolicitante', 'nombre email')
        .populate({
            path: 'solicitud',
            populate: [
                { path: 'usuarioSolicitante' },
                { path: 'empresaSolicitante' },
                { path: 'programaFormacion' },
                { path: 'municipio' }
            ]
        })

    if (revisionesAprobadas.length === 0) {
        throw new HttpErrors('No hay solicitudes aprobadas por el coordinador', 404)
    }

    // Filtrar solo las que NO tienen ficha aún
    const fichasExistentes = await Ficha.find({
        solicitud: { $in: solicitudesIds }
    }).select('solicitud')

    const idsConFicha = fichasExistentes.map(f => f.solicitud.toString())

    const sinFicha = revisionesAprobadas.filter(r =>
        !idsConFicha.includes(r.solicitud._id.toString())
    )

    if (sinFicha.length === 0) {
        throw new HttpErrors('No hay solicitudes pendientes de revisión', 404)
    }

    res.status(200).json(sinFicha)
}

const verMisRevisiones = async (req, res) => {
    const fichasRevisadas = await Ficha.find({ usuarioFuncionario: req.usuario.id })
    if (fichasRevisadas.length === 0) {
        throw new HttpErrors('Aún no has revisado solicitudes', 404)
    }

    const solicitudesIds = fichasRevisadas.map(f => f.solicitud)

    const revisionesAprobadas = await RevisionCoordinador.find({
        solicitud: { $in: solicitudesIds },
        estado: true
    })
        .populate('usuarioSolicitante', 'nombre email')
        .populate({
            path: 'solicitud',
            populate: [
                { path: 'usuarioSolicitante' },
                { path: 'empresaSolicitante' },
                { path: 'programaFormacion' },
                { path: 'municipio' }
            ]
        })

    res.status(200).json(revisionesAprobadas)
}

const verDetallesSolicitud = async (req, res) => {
    const { id } = req.params
    const solicitudes = await Solicitud.findOne({ _id: id, revisado: true })
    if (!solicitudes) {
        throw new HttpErrors('No hay solicitudes revisadas por el instructor', 404)
    }
    const solicitudesIds = [solicitudes._id]
    const revisionesAprobadas = await RevisionCoordinador.find({
        solicitud: { $in: solicitudesIds },
        estado: true
    })
        .populate('usuarioSolicitante', 'nombre email')
        .populate('usuarioRevisador')
        .populate({
            path: 'solicitud',
            populate: [
                { path: 'usuarioSolicitante' },
                { path: 'municipio' },
                { path: 'programaFormacion', populate: { path: 'area' } },
                { path: 'empresaSolicitante', populate: { path: 'tipoEmpresa', model: 'TipoEmpresaRegular' } },
            ]
        })

    if (revisionesAprobadas.length === 0) {
        throw new HttpErrors('No hay solicitudes aprobadas por el coordinador', 404)
    }

    // Populate manual de programaEspecial usando refPath
    await Promise.all(
        revisionesAprobadas.map(revision =>
            revision.solicitud.populate('programaEspecial')
        )
    )

    // Obtener ficha ligada a cada solicitud
    const fichas = await Ficha.find({
        solicitud: { $in: solicitudesIds }
    }).populate('usuarioSolicitante usuarioFuncionario')

    // Adjuntar ficha al objeto de respuesta
    const respuesta = revisionesAprobadas.map(revision => {
        const revisionObj = revision.toObject()
        const fichaEncontrada = fichas.find(f => f.solicitud.toString() === revision.solicitud._id.toString())

        return {
            ...revisionObj, // Esto envía toda la RevisionCoordinador
            ficha: fichaEncontrada ? fichaEncontrada.toObject() : null
        }
    })

    res.status(200).json(respuesta)
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

    const nameFile = `ficha-${idSolicitud}.pdf`

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
        process.cwd(), 'uploads', `solicitud-${idSolicitud}`, 'DocumentosAspirantes', nameFile
    )

    res.download(rutaCarta)
}

const descargarFormatoMasivo = async (req, res) => {
    const { idSolicitud } = req.params
    const solicitud = await Solicitud.findOne({ _id: idSolicitud, revisado: true })
    if (!solicitud) throw new HttpErrors('Solicitud no encontrada', 404)

    const solicitudRevisada = await RevisionCoordinador.findOne({
        solicitud: solicitud._id,
        estado: true
    })
    if (!solicitudRevisada) throw new HttpErrors('La solicitud no ha sido aprobada por el coordinador', 403)

    const nameFile = `masivo-${idSolicitud}.xlsx`
    const rutaExcel = path.join(process.cwd(), 'uploads', `solicitud-${idSolicitud}`, 'documents', 'excel masivo', nameFile)

    if (!fs.existsSync(rutaExcel)) throw new HttpErrors('No existe el archivo Excel', 404)

    // Cambiar excel a false después de descargar
    await Ficha.findOneAndUpdate(
        { solicitud: idSolicitud },
        {
            $set: { excel: false },
            $setOnInsert: { estado: 'LISTA DE ESPERA', solicitud: idSolicitud }  // solo al crear
        },
        { upsert: true }
    )

    res.download(rutaExcel, nameFile)
}

const revisarSolicitudFuncionario = async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.startTransaction()
        const { idSolicitud } = req.params
        const { estado, observacion, codigoFicha, codigoSolicitud } = req.body

        // Verificar que la solicitud exista y esté revisada
        const solicitud = await Solicitud.findOne({
            _id: idSolicitud,
            revisado: true
        }).session(session)
        if (!solicitud) throw new HttpErrors('Solicitud no encontrada o no revisada', 404)

        const estadosValidos = ['CREACIÓN', 'CREADA', 'LISTA DE ESPERA', 'MATRICULADA', 'RECHAZADA']
        if (!estadosValidos.includes(estado)) throw new HttpErrors('Estado no válido', 400)

        // Objeto base de ficha
        const dataFicha = {
            solicitud: idSolicitud,
            estado,
            usuarioFuncionario: req.usuario.id,
            usuarioSolicitante: solicitud.usuarioSolicitante,
            fechaRevisonFicha: new Date()
        }

        // Lógica por estado
        if (estado === 'CREACIÓN') {
            dataFicha.observacionCreacion = observacion
        }

        if (estado === 'CREADA') {
            if (!codigoFicha) throw new HttpErrors('El código de ficha es obligatorio cuando el estado es CREADA', 400)
            if (!codigoSolicitud) throw new HttpErrors('El código de solicitud es obligatorio cuando el estado es CREADA', 400)
            dataFicha.codigoFicha = codigoFicha
            await Solicitud.findOneAndUpdate(
                { _id: idSolicitud },
                { codigoSolicitud },
                { new: true, session }
            )
        }

        if (estado === 'LISTA DE ESPERA') {
            // Sin campos adicionales
        }

        if (estado === 'MATRICULADA') {
            if (!codigoFicha) throw new HttpErrors('El código de ficha es obligatorio cuando el estado es MATRICULADA', 400)
            if (!codigoSolicitud) throw new HttpErrors('El código de solicitud es obligatorio cuando el estado es MATRICULADA', 400)
            dataFicha.codigoFicha = codigoFicha
            await Solicitud.findOneAndUpdate(
                { _id: idSolicitud },
                { codigoSolicitud },
                { new: true, session }
            )
        }

        if (estado === 'RECHAZADA') {
            if (!observacion) throw new HttpErrors('La observación es obligatoria cuando el estado es RECHAZADA', 400)
            dataFicha.observacionRechazada = observacion
            await Solicitud.findByIdAndUpdate(
                idSolicitud,
                { revisado: false },
                { session }
            )
        }

        const fichaUpdate = await Ficha.findOneAndUpdate(
            { solicitud: idSolicitud },
            dataFicha,
            { new: true, upsert: true, session }
        )

        await session.commitTransaction()
        session.endSession()
        res.status(200).json({ msg: 'Revisión realizada correctamente', fichaUpdate })

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

const subirExcelSofiaPlus = async (req, res) => {
    const { idSolicitud } = req.params
    if (!req.file) throw new HttpErrors('No se envió ningún archivo', 400)
    await Ficha.findOneAndUpdate(
        { solicitud: idSolicitud },
        { excel: true }
    )
    res.status(200).json({ msg: 'Excel subido correctamente' })
}

const verFichas = async (req, res) => {
    const { idSolicitud } = req.params
    const ficha = await Ficha.findOne({ solicitud: idSolicitud })

    if (!ficha)
        return res.status(200).json({ excel: true })

    res.status(200).json({ excel: ficha.excel })

}

const obtenerEstadoFicha = async (req, res) => {
    const { idSolicitud } = req.params
    const ficha = await Ficha.findOne({ solicitud: idSolicitud })
    // Si no existe ficha retorna null — frontend maneja el default
    if (!ficha) return res.status(200).json(null)
    res.status(200).json(ficha)
}

// POR AHORA NO---------

// --- NUEVA FUNCIÓN PARA ASPIRANTES (PÚBLICA) ---
// const obtenerSolicitudPublica = async (req, res) => {
//     const { idSolicitud } = req.params;

//     try {
//         // Buscamos la solicitud por ID
//         // Hacemos populate de 'programaFormacion' para obtener el nombre y las horas
//         const solicitud = await Solicitud.findById(idSolicitud)
//             .populate({
//                 path: 'programaFormacion',
//                 select: 'nombrePrograma horas'
//             });

//         if (!solicitud) {
//             throw new HttpErrors('La solicitud de preinscripción no existe', 404);
//         }

//         // Retornamos la solicitud encontrada
//         res.json(solicitud);
//     } catch (error) {
//         // Si el ID no tiene el formato correcto de MongoDB o hay otro error
//         if (error.kind === 'ObjectId') {
//             throw new HttpErrors('ID de solicitud no válido', 400);
//         }
//         throw error;
//     }
// }


export {
    consultarSolicitudInstructor,
    enviarSolicitud,
    verFichaCaracterizacion,
    consultarSolicitudCoordinador,
    revisarSolicitud,
    verFormatoMasivo,
    verCartaSolicitud,
    verDocumentoAspirantes,
    verSolicitudesFuncionario,
    revisarSolicitudFuncionario,
    descargarCartaSolicitud,
    descargarFichaCaracterizacion,
    descargarDocumentoAspirantes,
    descargarFormatoMasivo,
    subirExcelSofiaPlus,
    verPdfAspirantes,
    verFichaCaracterizacionCoordinador,
    obtenerRevisiones,
    verDetallesSolicitud,
    verFichas,
    obtenerEstadoFicha,
    verMisRevisiones
}
