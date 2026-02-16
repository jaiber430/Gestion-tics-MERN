import fs from "fs"
import path from "path"
import PizZip from "pizzip"
import Docxtemplater from "docxtemplater"

import Usuarios from "../models/Usuarios.js"
import ProgramasFormacion from "../models/ProgramasFormacion.js"
import Municipios from "../models/Municipios.js"
import Solicitud from "../models/Solicitud.js"

const generarCartaCoordinador = async (coordinador, instructor, solicitud, session) => {
    // Crear la ruta donde se encuntra la plantilla
    const rutaFichaCaracterizacion = path.join(process.cwd(), 'src', 'templates', 'plantillaCartaCoordinador.docx')
    // Leer el archivo encontrado
    const content = fs.readFileSync(rutaFichaCaracterizacion, "binary")

    const dataUser = await Usuarios.findById(instructor)
    const dataCoordinador = await Usuarios.findById(coordinador)
    const solicitudSend = await Solicitud.findById(solicitud)
    

    const zip = new PizZip(content)

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    })

    doc.render({
        nombreInstru: dataUser.nombre,
        apellidoInstru: dataUser.apellido,
        nombreCo: dataCoordinador.nombre,
        apellidoCo: dataCoordinador.apellido,
        convenio: solicitudSend.convenio,
        programaFormacion: solicitudSend.programaFormacion,
    }, { session })

    const buffer = doc.getZip().generate({
        type: "nodebuffer"
    }, { session })

    const carpetaDestino = path.join(process.cwd(), "src", "uploads", `solicitud-${_id}`, 'documents')
    if (!fs.existsSync(carpetaDestino)) {
        fs.mkdirSync(carpetaDestino, { recursive: true })
    }

    const nombreArchivo = `carta-${data._id}.docx`

    const rutaFinal = path.join(carpetaDestino, nombreArchivo)

    fs.writeFileSync(rutaFinal, buffer)
}

export default generarCartaCoordinador
