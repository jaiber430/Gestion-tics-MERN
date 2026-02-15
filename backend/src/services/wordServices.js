// import { calcularDiasSemana } from '../utils/calcularDiasSemana'
// const diasSemana = calcularDiasSemana(fechasSeleccionadas)
import fs from "fs"
import path from "path"
import PizZip from "pizzip"
import Docxtemplater from "docxtemplater"
import Usuarios from "../models/Usuarios.js"
import ProgramasFormacion from "../models/ProgramasFormacion.js"
import Municipios from "../models/Municipios.js"
import Empresa from "../models/Empresa.js"

export const generarDocumento = async (data) => {
    // Crear la ruta donde se encuntra la plantilla
    const rutaFichaCaracterizacion = path.join(process.cwd(), 'src', 'public', 'plantilla.docx')
    // Leer el archivo encontrado
    const content = fs.readFileSync(rutaFichaCaracterizacion, "binary")

    let empresaCreada = ''

    const { usuarioSolicitante, programaFormacion, fechaInicio, fechaFin, cupo, municipio, direccionFormacion, empresaSolicitante, subSectorEconomico, convenio, ambiente, horaInicio, horaFin, mes1, mes2 } = data

    const dataProgramaFormacion = await ProgramasFormacion.findById(programaFormacion)
    const dataUser = await Usuarios.findById(usuarioSolicitante)
    const dataMunicipio = await Municipios.findById(municipio)
    const dataEmpresa = await Empresa.findById(empresaSolicitante)

    const zip = new PizZip(content)

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    })

    doc.render({
        codigoPrograma: dataProgramaFormacion.codigoPrograma,
        nombrePrograma: dataProgramaFormacion.nombrePrograma,
        versionPrograma: dataProgramaFormacion.versionPrograma,
        horas: dataProgramaFormacion.horas,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        cupo: cupo,
        municipio: dataMunicipio.municipios,
        direccionFormacion: direccionFormacion,
        nombre: dataUser.nombre,
        apellido: dataUser.apellido,
        numeroDoc: dataUser.numeroIdentificacion,
        email: dataUser.email,
        nombreEmpresa: dataEmpresa ? dataEmpresa.nombreEmpresa : '',
        subSectorEconomico: subSectorEconomico,
        convenio: convenio,
        ambiente: ambiente,
        horaFin: horaFin,
        horaInicio: horaInicio,
        mes1: mes1,
        mes2: mes2,
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
