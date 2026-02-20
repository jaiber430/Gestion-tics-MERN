import fs from "fs"
import path from "path"
import PizZip from "pizzip"
import Docxtemplater from "docxtemplater"
import Usuarios from "../models/Usuarios.js"
import ProgramasFormacion from "../models/ProgramasFormacion.js"
import Municipios from "../models/Municipios.js"
import Empresa from "../models/Empresa.js"
import ProgramasEspeciales from "../models/ProgramasEspeciales.js"
import ProgramasEspecialesCampesena from "../models/ProgramasEspecialesCampesena.js"
import { calcularDiasSemana } from '../utils/calcularDiasSemana.js'
import generarProgramas from '../utils/programasEspeciales.js'
import { formatearFechaWord } from '../helpers/formatearFechas.js'

export const generarDocumento = async (data, session) => {

    const { usuarioSolicitante, programaFormacion, fechaInicio, fechaFin, cupo, municipio, direccionFormacion, empresaSolicitante, subSectorEconomico, convenio, ambiente, horaInicio, horaFin, fechasSeleccionadas, programaEspecial, tipoSolicitud, meses, _id
    } = data


    // ===============================
    // SELECCIONAR PLANTILLA
    // ===============================
    let nombrePlantilla = "plantilla.docx"

    if (tipoSolicitud === "CampeSENA") {
        nombrePlantilla = "campesena.docx"
    }

    const rutaFichaCaracterizacion = path.join(
        process.cwd(),
        'src',
        'templates',
        nombrePlantilla
    )

    const content = fs.readFileSync(rutaFichaCaracterizacion, "binary")


    // ===============================
    // FORMATEAR MESES PARA WORD
    // ===============================

    const formatearMesParaWord = (mes) => {

        if (!mes) return "";

        const diasTexto = mes.dias.join(", ");

        return `${mes.nombreMes}: ${diasTexto} de ${mes.horaInicio} a ${mes.horaFin} (${mes.horasPorDia} horas)`;
    };

    const mesesFormateados = meses?.map(formatearMesParaWord) || [];

    const mes1 = mesesFormateados[0] || "";
    const mes2 = mesesFormateados[1] || "";
    const mes3 = mesesFormateados[2] || "";
    const mes4 = mesesFormateados[3] || "";
    const mes5 = mesesFormateados[4] || "";


    // ===============================
    // MODELOS PROGRAMA ESPECIAL
    // ===============================
    let modelsProgramasEspeciales

    if (tipoSolicitud === "CampeSENA") {
        modelsProgramasEspeciales = 'ProgramasEspecialesCampesena'
    } else {
        modelsProgramasEspeciales = 'ProgramasEspeciales'
    }

    const ProgramasEspecialesPermitidos = {
        ProgramasEspeciales,
        ProgramasEspecialesCampesena
    }

    const existeModeloProgramaEspecial =
        ProgramasEspecialesPermitidos[modelsProgramasEspeciales]

    const buscarProgramaEspecial =
        await existeModeloProgramaEspecial.findById(programaEspecial)

    const programasWord =
        generarProgramas(buscarProgramaEspecial.programaEspecial)

    const diasSemana =
        calcularDiasSemana(fechasSeleccionadas)

    const dataProgramaFormacion =
        await ProgramasFormacion.findById(programaFormacion)

    const dataUser =
        await Usuarios.findById(usuarioSolicitante)

    const dataMunicipio =
        await Municipios.findById(municipio)

    const dataEmpresa =
        await Empresa.findById(empresaSolicitante).session(session)

    const fechaInicioFormateada =
        formatearFechaWord(fechaInicio)

    const fechaFinFormateada =
        formatearFechaWord(fechaFin)


    const zip = new PizZip(content)

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    })


    // ===============================
    // DATA RENDER
    // ===============================

    let dataRender = {
        codigoPrograma: dataProgramaFormacion.codigoPrograma,
        nombrePrograma: dataProgramaFormacion.nombrePrograma,
        versionPrograma: dataProgramaFormacion.versionPrograma,
        horas: dataProgramaFormacion.horas,
        fechaInicio: fechaInicioFormateada,
        fechaFin: fechaFinFormateada,
        cupo: cupo,
        municipio: dataMunicipio.municipios,
        direccionFormacion: direccionFormacion,
        nombre: dataUser.nombre,
        apellido: dataUser.apellido,
        numeroDoc: dataUser.numeroIdentificacion,
        email: dataUser.email,
        nombreEmpresa: dataEmpresa ? dataEmpresa.nombreEmpresa : '',
        subSectorEconomico: subSectorEconomico,
        ...programasWord,
        convenio: convenio,
        ambiente: ambiente,
        ...diasSemana,
        horaInicio: horaInicio,
        horaFin: horaFin,
        mes1,
        mes2,
        mes3: mes3 ? mes3 : '',
        mes4: mes4 ? mes4 : '',
        mes5: mes5 ? mes5 : ''
    }


    doc.render(dataRender)

    const buffer = doc.getZip().generate({
        type: "nodebuffer"
    })

    const carpetaDestino = path.join(
        process.cwd(),
        "src",
        "uploads",
        `solicitud-${_id}`,
        'documents'
    )

    if (!fs.existsSync(carpetaDestino)) {
        fs.mkdirSync(carpetaDestino, { recursive: true })
    }

    const nombreArchivo = `ficha-${_id}.docx`

    const rutaFinal = path.join(carpetaDestino, nombreArchivo)

    fs.writeFileSync(rutaFinal, buffer)
}
