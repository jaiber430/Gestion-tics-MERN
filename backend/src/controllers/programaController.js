import mongoose from "mongoose"

import HttpErrors from "../helpers/httpErrors.js"
import ProgramasFormacion from "../models/ProgramasFormacion.js"
import Area from "../models/Area.js"


const crearPrograma = async (req, res, next) => {
    try {

        const { area } = req.params
        const { codigoPrograma, nombrePrograma, versionPrograma, horas } = req.body

        // Validar ObjectId
        if (!mongoose.Types.ObjectId.isValid(area)) {
            throw new HttpErrors('El ID del área no es válido', 400);
        }

        const comprobarArea = await Area.findById(area)
        if (!comprobarArea) {
            throw new HttpErrors('El área no existe', 404)
        }

        // Validaciones
        if (!codigoPrograma || !nombrePrograma || !versionPrograma || horas === undefined) {
            throw new HttpErrors('Todos los datos son requeridos', 400)
        }

        // Validar duplicado solo por código
        const comprobarCodigoPrograma = await ProgramasFormacion.findOne({ codigoPrograma })
        if (comprobarCodigoPrograma) {
            throw new HttpErrors('El código del programa ya existe', 400)
        }

        // Crear programa
        const nuevoPrograma = new ProgramasFormacion({
            area: comprobarArea._id,
            codigoPrograma,
            nombrePrograma,
            versionPrograma,
            horas
        })


        // Validar que sea número
        if (typeof horas !== 'number') {
            throw new HttpErrors('Las horas deben ser numéricas', 400)
        }

        // Validar rango permitido
        if (horas < 10 || horas > 96) {
            throw new HttpErrors('El programa debe tener entre 10 y 96 horas', 400)
        }


        const programaGuardado = await nuevoPrograma.save()

        res.status(201).json(programaGuardado)

    } catch (error) {
        next(error)
    }
}


const obtenerProgramas = async (req, res, next) => {
    try {

        const programas = await ProgramasFormacion.find()
            .populate({
                path: 'area',
                select: 'area -_id'
            })
            .lean();

        const respuesta = programas.map(p => ({
            ...p,
            area: p.area.area
        }));

        res.json(respuesta);

    } catch (error) {
        next(error)
    }
}


const actualizarPrograma = async (req, res) => {

    const { id } = req.params
    const { codigoPrograma, nombrePrograma, versionPrograma, horas } = req.body

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new HttpErrors('El ID del programa no es válido', 400)
    }

    // Verificar que exista
    const programa = await ProgramasFormacion.findById(id)
    if (!programa) {
        throw new HttpErrors('El programa no existe', 404)
    }

    // Validar campos requeridos
    if (!codigoPrograma || !nombrePrograma || !versionPrograma || !horas) {
        throw new HttpErrors('Todos los datos son requeridos', 400)
    }

    // Verificar si están intentando usar un código que ya existe en OTRO programa
    const codigoExistente = await ProgramasFormacion.findOne({ codigoPrograma })

    if (codigoExistente && codigoExistente._id.toString() !== id) {
        throw new HttpErrors('Ya existe otro programa con ese código', 400)
    }

    //
    programa.codigoPrograma = codigoPrograma
    programa.nombrePrograma = nombrePrograma
    programa.versionPrograma = versionPrograma
    programa.horas = horas

    if (horas < 10 || horas > 96) {
    throw new HttpErrors('El programa debe tener entre 10 y 96 horas', 400)
    }


    const programaActualizado = await programa.save()

    res.json({
        msg: 'Programa actualizado correctamente'
    })
}


const eliminarPrograma = async (req, res) => {

    const { id } = req.params

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new HttpErrors('El ID del programa no es válido', 400)
    }

    // Buscar y eliminar
    const programaEliminado = await ProgramasFormacion.findByIdAndDelete(id)

    if (!programaEliminado) {
        throw new HttpErrors('El programa no existe', 404)
    }

    res.json({
        msg: 'Programa eliminado correctamente'
    })
}


export{
    crearPrograma,
    obtenerProgramas,
    actualizarPrograma,
    eliminarPrograma
}