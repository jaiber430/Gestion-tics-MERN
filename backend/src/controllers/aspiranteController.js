import mongoose from 'mongoose';
import path from 'path'
import fs from 'fs'
import ExcelJS from "exceljs";

import HttpErrors from '../helpers/httpErrors.js'
import TiposIdentificacion from '../models/TiposIdentificacion.js'
import Aspirantes from '../models/Aspirantes.js'
import Solicitud from '../models/Solicitud.js'
import { actualizarExcelMasivo } from "../services/excelServices.js";
import Empresa from '../models/Empresa.js';
import Caracterizacion from '../models/Caracterizacion.js';
import { combinarPdfs } from '../utils/uploadPDF.js'

const registrarAspirante = async (req, res) => {

    const { id } = req.params

    const {
        nombre,
        apellido,
        tipoIdentificacion,
        numeroIdentificacion,
        tipoCaracterizacion,
        telefono,
        email
    } = req.body

    // Helper para limpiar el PDF si algo falla
    const limpiarPDF = () => {
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path)
        }
    }

    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        limpiarPDF()
        throw new HttpErrors('El ID de la solicitud no es válido', 400)
    }

    // Verificar que la solicitud existe
    const comprobarSolicitud = await Solicitud.findById(id)
    if (!comprobarSolicitud) {
        limpiarPDF()
        throw new HttpErrors('La solicitud no existe', 404)
    }

    // Validar que el link esté activo
    if (!comprobarSolicitud.linkPreinscripcion) {
        limpiarPDF()
        throw new HttpErrors('El link de preinscripción ya no está disponible', 400)
    }

    // Validaciones de campos requeridos
    if (!nombre || !apellido || !tipoIdentificacion || !numeroIdentificacion || !tipoCaracterizacion || !telefono || !email) {
        limpiarPDF()
        throw new HttpErrors('Todos los datos son requeridos', 400)
    }

    // Verificar si el cupo ya está lleno ANTES de guardar
    const contarAspirantes = await Aspirantes.countDocuments({ solicitud: comprobarSolicitud._id })
    if (contarAspirantes >= comprobarSolicitud.cupo) {
        limpiarPDF()
        throw new HttpErrors('La solicitud ya tiene el máximo de aspirantes permitidos', 400)
    }

    // Validar tipo de identificación
    const comprobarTipoIdentificacion = await TiposIdentificacion.findById(tipoIdentificacion)
    if (!comprobarTipoIdentificacion) {
        limpiarPDF()
        throw new HttpErrors('El tipo de identificación no existe', 404)
    }

    // Validar duplicado — número de identificación en esta solicitud
    const comprobarNumeroIdentificacion = await Aspirantes.findOne({
        numeroIdentificacion,
        solicitud: comprobarSolicitud._id
    })
    if (comprobarNumeroIdentificacion) {
        limpiarPDF()
        throw new HttpErrors('El numero de identificación ya está registrado en esta solicitud', 400)
    }

    // Validar que la caracterización existe
    const comprobarCaracterizacion = await Caracterizacion.findById(tipoCaracterizacion)
    if (!comprobarCaracterizacion) {
        limpiarPDF()
        throw new HttpErrors('La caracterización no existe', 404)
    }

    // Validar duplicado — teléfono en esta solicitud
    const comprobarTelefono = await Aspirantes.findOne({
        telefono,
        solicitud: comprobarSolicitud._id
    })
    if (comprobarTelefono) {
        limpiarPDF()
        throw new HttpErrors('El numero de telefono ya está registrado en esta solicitud', 400)
    }

    // Validar duplicado — email en esta solicitud
    const comprobarEmail = await Aspirantes.findOne({
        email,
        solicitud: comprobarSolicitud._id
    })
    if (comprobarEmail) {
        limpiarPDF()
        throw new HttpErrors('El correo ya está registrado en esta solicitud', 400)
    }

    // Validar formato de email
    const caracteresEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!caracteresEmail.test(email)) {
        limpiarPDF()
        throw new HttpErrors('El correo no es valido', 400)
    }

    // Validar que se haya subido el PDF
    if (!req.file) {
        throw new HttpErrors('Debe subir el documento PDF', 400)
    }

    try {

        // Multer ya guardó el archivo, usamos su ruta
        const rutaFinalPDF = req.file.path

        // Guardar aspirante en BD
        const nuevoAspirante = new Aspirantes({
            nombre,
            apellido,
            archivo: rutaFinalPDF,
            tipoIdentificacion,
            numeroIdentificacion,
            caracterizacion: comprobarCaracterizacion._id,
            telefono,
            email,
            solicitud: comprobarSolicitud._id
        })

        await nuevoAspirante.save()

        // Una sola consulta con populate para obtener datos completos
        const aspiranteCompleto = await Aspirantes.findById(nuevoAspirante._id)
            .populate('tipoIdentificacion')
            .populate('caracterizacion')

        // Traer empresa si existe en la solicitud
        let codigoEmpresa = ''
        if (comprobarSolicitud.empresaSolicitante) {
            const empresa = await Empresa.findById(comprobarSolicitud.empresaSolicitante)
            codigoEmpresa = empresa?.codigoEmpresa || ''
        }

        // Actualizar excel con el nuevo aspirante
        await actualizarExcelMasivo({
            solicitudId: comprobarSolicitud._id,
            tipoIdentificacion: aspiranteCompleto.tipoIdentificacion.nombreTipoIdentificacion,
            numeroIdentificacion: aspiranteCompleto.numeroIdentificacion,
            caracterizacion: aspiranteCompleto.caracterizacion.caracterizacion,
            codigoEmpresa
        })

        // Verificar si con este aspirante se llenó el cupo
        const conteoFinal = await Aspirantes.countDocuments({ solicitud: comprobarSolicitud._id })
        if (conteoFinal >= comprobarSolicitud.cupo) {
            // Desactivar link — ya no se pueden inscribir más
            comprobarSolicitud.linkPreinscripcion = false
            await comprobarSolicitud.save()
        }

        res.json({ msg: 'Te haz preinscrito satisfactoriamente' })

    } catch (error) {
        console.log(error)

        // Si algo falló después de que multer guardó el PDF, eliminarlo
        limpiarPDF()

        if (error instanceof HttpErrors) throw error
        throw new HttpErrors('Error al guardar el aspirante', 500)
    }
}


const actualizarAspirante = async (req, res) => {
    const { id } = req.params
    const { numeroIdentificacion, nombre, apellido, tipoIdentificacion, telefono, email } = req.body

    // Verificar que el aspirante existe
    const aspirante = await Aspirantes.findById(id)
        .populate('tipoIdentificacion')
        .populate('caracterizacion')
    if (!aspirante) {
        throw new HttpErrors('El aspirante no existe', 404)
    }

    const solicitudId = aspirante.solicitud
    const carpetaAspirantes = path.join(
        process.cwd(),
        'uploads',
        `solicitud-${solicitudId}`,
        'DocumentosAspirantes'
    )

    // ===============================
    // 1. SI CAMBIA NUMERO DE IDENTIFICACION — RENOMBRAR EL PDF
    // ===============================
    const numeroAnterior = aspirante.numeroIdentificacion
    const numeroNuevo = numeroIdentificacion ?? numeroAnterior

    if (String(numeroNuevo) !== String(numeroAnterior)) {
        const rutaAnterior = path.join(carpetaAspirantes, `${numeroAnterior}.pdf`)
        const rutaNueva = path.join(carpetaAspirantes, `${numeroNuevo}.pdf`)

        if (fs.existsSync(rutaAnterior)) {
            fs.renameSync(rutaAnterior, rutaNueva)
            aspirante.archivo = rutaNueva
        }

        // Eliminar el combinado anterior
        const rutaCombinado = path.join(carpetaAspirantes, 'combinado.pdf')
        if (fs.existsSync(rutaCombinado)) {
            fs.unlinkSync(rutaCombinado)
        }

        // Regenerar el combinado con el nuevo nombre
        await combinarPdfs(carpetaAspirantes)
    }
    // ===============================
    // 2. ACTUALIZAR CAMPOS
    // ===============================
    aspirante.nombre = nombre ?? aspirante.nombre
    aspirante.apellido = apellido ?? aspirante.apellido
    aspirante.tipoIdentificacion = tipoIdentificacion ?? aspirante.tipoIdentificacion
    aspirante.numeroIdentificacion = numeroNuevo
    aspirante.telefono = telefono ?? aspirante.telefono
    aspirante.email = email ?? aspirante.email

    await aspirante.save()

    // Volver a poblar después de guardar para tener datos actualizados
    const aspiranteActualizado = await Aspirantes.findById(id)
        .populate('tipoIdentificacion')
        .populate('caracterizacion')

    // ===============================
    // 3. ACTUALIZAR FILA EN EL EXCEL
    // ===============================
    const rutaExcel = path.join(
        process.cwd(),
        'uploads',
        `solicitud-${solicitudId}`,
        'documents',
        'excel masivo',
        `masivo-${solicitudId}.xlsx`
    )

    if (fs.existsSync(rutaExcel)) {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(rutaExcel)
        const worksheet = workbook.getWorksheet(1)

        // Buscar la fila por el numero de identificacion anterior
        let filaEncontrada = null
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return // saltar encabezado
            if (String(row.getCell('C').value) === String(numeroAnterior)) {
                filaEncontrada = rowNumber
            }
        })

        // Actualizar la fila encontrada con los nuevos datos
        if (filaEncontrada) {
            worksheet.getCell(`B${filaEncontrada}`).value = aspiranteActualizado.tipoIdentificacion?.nombreTipoIdentificacion || ''
            worksheet.getCell(`C${filaEncontrada}`).value = aspiranteActualizado.numeroIdentificacion
            worksheet.getCell(`E${filaEncontrada}`).value = aspiranteActualizado.caracterizacion?.caracterizacion || ''
            await workbook.xlsx.writeFile(rutaExcel)
            console.log(`Fila ${filaEncontrada} actualizada en el excel`)
        }
    }

    res.json({ msg: 'Aspirante actualizado correctamente' })
}

const eliminarAspirante = async (req, res) => {
    const { id } = req.params

    // Verificar que el aspirante existe
    const aspirante = await Aspirantes.findById(id)
    if (!aspirante) {
        throw new HttpErrors('El aspirante no existe', 404)
    }

    // Obtener la solicitud para construir las rutas
    const solicitudId = aspirante.solicitud
    const carpetaAspirantes = path.join(
        process.cwd(),
        'uploads',
        `solicitud-${solicitudId}`,
        'DocumentosAspirantes'
    )

    // ===============================
    // 1. ELIMINAR EL PDF DEL ASPIRANTE
    // ===============================
    if (aspirante.archivo && fs.existsSync(aspirante.archivo)) {
        fs.unlinkSync(aspirante.archivo)
        console.log(`PDF eliminado: ${aspirante.archivo}`)
    }

    // ===============================
    // 2. ELIMINAR EL COMBINADO (se regenerará sin este aspirante)
    // ===============================
    const rutaCombinado = path.join(carpetaAspirantes, 'combinado.pdf')
    if (fs.existsSync(rutaCombinado)) {
        fs.unlinkSync(rutaCombinado)
        console.log('PDF combinado eliminado')
    }

    // ===============================
    // 3. ELIMINAR DEL EXCEL MASIVO
    // ===============================
    const rutaExcel = path.join(
        process.cwd(),
        'uploads',
        `solicitud-${solicitudId}`,
        'documents',
        'excel masivo',
        `masivo-${solicitudId}.xlsx`
    )

    if (fs.existsSync(rutaExcel)) {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(rutaExcel)
        const worksheet = workbook.getWorksheet(1)

        // Buscar la fila que tenga el numeroIdentificacion del aspirante
        let filaEncontrada = null
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return // saltar encabezado
            if (String(row.getCell('C').value) === String(aspirante.numeroIdentificacion)) {
                filaEncontrada = rowNumber
            }
        })

        // Eliminar la fila encontrada
        if (filaEncontrada) {
            worksheet.spliceRows(filaEncontrada, 1)
            await workbook.xlsx.writeFile(rutaExcel)
            console.log(`Fila ${filaEncontrada} eliminada del excel`)
        }
    }

    // ===============================
    // 4. ELIMINAR DE LA BD
    // ===============================
    await Aspirantes.findByIdAndDelete(id)

    // Reactivar el link si había sido desactivado por cupo lleno
    await Solicitud.findByIdAndUpdate(solicitudId, { linkPreinscripcion: true })

    res.json({ msg: 'Aspirante eliminado correctamente' })
}

const contarAspirante = async (req, res) => {
    const cantidadAspirantes = await Aspirantes.countDocuments()
    res.json({ cantidad: cantidadAspirantes })
}



// NUEVA FUNCIÓN: Obtener los tipos de la base de datos
const obtenerTiposIdentificacion = async (req, res) => {
    try {
        const tipos = await TiposIdentificacion.find();
        res.json(tipos);
    } catch (error) {
        console.log(error);
        throw new HttpErrors("Error al obtener los tipos de identificación", 404);
    }
}

const obtenerTiposCaracterizacion = async (req, res) => {
    try {
        const tipos = await Caracterizacion.find();
        res.json(tipos);
    } catch (error) {
        console.log(error);
        throw new HttpErrors("Error al obtener los tipos de caracterización", 404);
    }
}

const preinscritos = async (req, res) => {
    const { id } = req.params

    const existeSolicitud = await Solicitud.findById(id)

    if (!existeSolicitud) {
        throw new HttpErrors('Solicitud no encontarda', 404)
    }

    const verAspirantesPreinscritos = await Aspirantes.countDocuments({ solicitud: id })
    // console.log(verAspirantesPreinscritos)

    res.json(verAspirantesPreinscritos)

}

const preinscritosAspirantes = async (req, res) => {
    const { id } = req.params

    const existeSolicitud = await Solicitud.findById(id)

    if (!existeSolicitud) {
        throw new HttpErrors('Solicitud no encontarda', 404)
    }

    const verAspirantesPreinscritos = await Aspirantes.find({ solicitud: id }).populate('tipoIdentificacion')
    // console.log(verAspirantesPreinscritos)

    res.json(verAspirantesPreinscritos)

}

export {
    registrarAspirante,
    actualizarAspirante,
    eliminarAspirante,
    preinscritos,
    contarAspirante,
    obtenerTiposIdentificacion,
    obtenerTiposCaracterizacion,
    preinscritosAspirantes
}
