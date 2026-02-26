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

    const { nombre,
            apellido,
            tipoIdentificacion,
            numeroIdentificacion,
            caracterizacion,
            telefono,
            email
        } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new HttpErrors('El ID de la solicitud no es válido', 400);
    }

    const comprobarSolicitud = await Solicitud.findById(id)
    if (!comprobarSolicitud) {
        throw new HttpErrors('La solicitud no existe', 404)
    }

    // Validaciones de campos requeridos
    if (!nombre || !apellido || !tipoIdentificacion || !numeroIdentificacion || !caracterizacion || !telefono || !email) {
        throw new HttpErrors('Todos los datos son requeridos', 400)
    }

    const contarAspirantes = await Aspirantes.countDocuments({ solicitud: comprobarSolicitud._id })
    if (String(contarAspirantes) === String(comprobarSolicitud.cupo)) {
        throw new HttpErrors('La solicitud ya tiene el máximo de aspirantes permitidos', 400)
    }


    // Validar tipo de identificación
    const comprobarTipoIdentificacion = await TiposIdentificacion.findById(tipoIdentificacion)
    if (!comprobarTipoIdentificacion) {
        throw new HttpErrors('El tipo de identificación no existe', 404)
    }

    // Validar duplicados
    const comprobarNumeroIdentificacion = await Aspirantes.findOne({ numeroIdentificacion })
    if (comprobarNumeroIdentificacion) {
        throw new HttpErrors('El numero de identificación ya existe', 400)
    }

    const comprobarCaracterizacion = await Caracterizacion.findById(caracterizacion)
    if (!comprobarCaracterizacion) {
        throw new HttpErrors('La caracterización no existe', 404)
    }

    const comprobarTelefono = await Aspirantes.findOne({ telefono })
    if (comprobarTelefono) {
        throw new HttpErrors('El numero de telefono ya existe', 400)
    }

    const comprobarEmail = await Aspirantes.findOne({ email })
    if (comprobarEmail) {
        throw new HttpErrors('El correo ya existe', 400)
    }

    // Validar formato de email
    const caracteresEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!caracteresEmail.test(email)) {
        throw new HttpErrors('El correo no es valido', 400)
    }


    try {

        if (!req.file) {
            throw new HttpErrors('Debe subir el documento PDF', 400);
        }

        // Multer ya guardó el archivo, solo usamos su ruta
        const rutaFinalPDF = req.file.path;


        // guardar en BD
        const nuevoAspirante = new Aspirantes({
            nombre,
            apellido,
            archivo: rutaFinalPDF,
            tipoIdentificacion,
            numeroIdentificacion,
            caracterizacion,
            telefono,
            email,
            solicitud: comprobarSolicitud._id
        });

        await nuevoAspirante.save();

        // UNA sola consulta trae TODO
        const aspiranteCompleto = await Aspirantes.findById(nuevoAspirante._id)
        .populate("tipoIdentificacion")
        .populate("caracterizacion");
        


        // Traer empresa si existe en la solicitud
        let codigoEmpresa = "";

    if (comprobarSolicitud.empresaSolicitante) {
            const empresa = await Empresa.findById(comprobarSolicitud.empresaSolicitante);
            codigoEmpresa = empresa?.codigoEmpresa || "";
    }


        await actualizarExcelMasivo({
            solicitudId: comprobarSolicitud._id,
            tipoIdentificacion: aspiranteCompleto.tipoIdentificacion.nombreTipoIdentificacion,
            numeroIdentificacion: aspiranteCompleto.numeroIdentificacion,
            caracterizacion: aspiranteCompleto.caracterizacion.caracterizacion,
            codigoEmpresa: codigoEmpresa
        });


        res.json(nuevoAspirante);


    } catch (error) {


        console.log(error);
        throw new HttpErrors('Error al guardar el aspirante', 500);
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
    const { numeroIdentificacion } = req.body
    const aspirante = await Aspirantes.findOne({ numeroIdentificacion })
    if (!aspirante) {
        throw new HttpErrors('El aspirante no existe', 404)
    }
    await Aspirantes.deleteOne({ numeroIdentificacion })
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
        res.status(500).json({ msg: "Error al obtener los tipos de identificación" });
    }
}

const obtenerTiposCaracterizacion = async (req, res) => {
    try {
        const tipos = await Caracterizacion.find();
        res.json(tipos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al obtener los tipos de caracterización" });
    }
}

export {
    registrarAspirante,
    actualizarAspirante,
    eliminarAspirante,
    contarAspirante,
    obtenerTiposIdentificacion,
    obtenerTiposCaracterizacion
}