import HttpErrors from '../helpers/httpErrors.js'
import TiposIdentificacion from '../models/TiposIdentificacion.js'
import Aspirantes from '../models/Aspirantes.js'
//import Cup from '../models/cup.js'

const registrarAspirante = async (req, res) => {
     // 1. Extraemos los datos, incluyendo la 'solicitudId' que viene del frontend
     const { nombre, apellido, archivo, tipoIdentificacion, numeroIdentificacion, telefono, email, solicitudId } = req.body
    
    // --- LÓGICA DINÁMICA DE CUPOS ---
     if (solicitudId) {
         // Buscamos si existe una configuración de límite para esta solicitud en Cup.js
         const configCupo = await Cup.findOne({ solicitud: solicitudId });

         if (configCupo) {
             // Contamos cuántos aspirantes tienen este ID dentro de su array de 'solicitud'
             const cantidadActual = await Aspirantes.countDocuments({ solicitud: solicitudId });

             if (cantidadActual >= configCupo.limite) {
                 throw new HttpErrors(`Cupos agotados. Esta solicitud solo permite ${configCupo.limite} registros.`, 400);
             }
         }
     }
     // --------------------------------
    
    // Validaciones de campos requeridos
    if (!nombre || !apellido || !tipoIdentificacion || !numeroIdentificacion || !telefono || !email) {
        throw new HttpErrors('Todos los datos son requeridos', 400)
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

    // Crear el nuevo aspirante
    const nuevoAspirante = new Aspirantes({
        nombre,
        apellido,
        archivo: null,
        tipoIdentificacion,
        numeroIdentificacion,
        telefono,
        email,
        solicitud: [solicitudId] // Guardamos el ID en el array que definiste
    })

    await nuevoAspirante.save()
    res.json(nuevoAspirante)
}

const actualizarAspirante = async (req, res) => {
    const { numeroIdentificacion, nombre, apellido, telefono } = req.body
    const aspirante = await Aspirantes.findOne({ numeroIdentificacion })
    
    if (!aspirante) {
        throw new HttpErrors('El aspirante no existe', 404)
    } else {
        aspirante.nombre = nombre || aspirante.nombre
        aspirante.apellido = apellido || aspirante.apellido
        aspirante.telefono = telefono || aspirante.telefono
        await aspirante.save()
    }

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

export {
    registrarAspirante,
    actualizarAspirante,
    eliminarAspirante,
    contarAspirante
}
