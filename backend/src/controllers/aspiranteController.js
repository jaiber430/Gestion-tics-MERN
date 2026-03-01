import mongoose from 'mongoose';


import HttpErrors from '../helpers/httpErrors.js'
import TiposIdentificacion from '../models/TiposIdentificacion.js'
import Aspirantes from '../models/Aspirantes.js'
import Solicitud from '../models/Solicitud.js'
import { actualizarExcelMasivo } from "../services/excelServices.js";
import Empresa from '../models/Empresa.js';
import Caracterizacion from '../models/Caracterizacion.js';


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

    const aspirante = await Aspirantes.findById(id)

    if (!aspirante) {
        throw new HttpErrors('El aspirante no existe', 404)
    }

    aspirante.nombre = nombre ?? aspirante.nombre
    aspirante.apellido = apellido ?? aspirante.apellido
    aspirante.tipoIdentificacion = tipoIdentificacion ?? aspirante.tipoIdentificacion
    aspirante.numeroIdentificacion = numeroIdentificacion ?? aspirante.numeroIdentificacion
    aspirante.telefono = telefono ?? aspirante.telefono
    aspirante.email = email ?? aspirante.email

    await aspirante.save()

    res.json({ msg: 'Aspirante actualizado correctamente' })
}

const eliminarAspirante = async (req, res) => {
    const { id } = req.params
    const aspirante = await Aspirantes.findById(id)
    if (!aspirante) {
        throw new HttpErrors('El aspirante no existe', 404)
    }
    await Aspirantes.findByIdAndDelete(id) 
    res.json({ mensaje: 'Aspirante eliminado correctamente' })
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
