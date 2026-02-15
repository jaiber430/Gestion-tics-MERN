// import { calcularDiasSemana } from '../utils/calcularDiasSemana'
// const diasSemana = calcularDiasSemana(fechasSeleccionadas)
import fs from "fs"
import path from "path"
import PizZip from "pizzip"
import Docxtemplater from "docxtemplater"
import Solicitud from '../models/Solicitud.js'
import Usuarios from "../models/Usuarios.js"

export const generarDocumento = async (data) => {
    const rutaFichaCaracterizacion = path.join(process.cwd(), 'src', 'public', 'plantilla.docx')
    const content = fs.readFileSync(rutaFichaCaracterizacion, "binary")

    const { usuarioSolicitante } = data

    const dataUser = await Usuarios.findById(usuarioSolicitante)

    const zip = new PizZip(content)

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    })

    doc.render({
        nombre: dataUser.nombre,
        apellido: dataUser.apellido,
        numeroDoc: dataUser.numeroIdentificacion,
        email: dataUser.email
    })

    const buffer = doc.getZip().generate({
        type: "nodebuffer"
    })

    const carpetaDestino = path.join(process.cwd(), "src", "uploads", "documents")
    if (!fs.existsSync(carpetaDestino)) {
        fs.mkdirSync(carpetaDestino, { recursive: true })
    }

    const nombreArchivo = `solicitud-${data._id}.docx`

    const rutaFinal = path.join(carpetaDestino, nombreArchivo)

    fs.writeFileSync(rutaFinal, buffer)
}
