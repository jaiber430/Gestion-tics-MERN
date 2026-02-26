import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";

export const actualizarExcelMasivo = async ({
    solicitudId,
    tipoIdentificacion,
    caracterizacion,
    numeroIdentificacion,
    codigoEmpresa = ""
}) => {


    // 📂 Ruta: Backend/uploads/solicitud-id/documents/excel masivo
    const carpetaDestino = path.join(
        process.cwd(),
        "uploads",
        `solicitud-${solicitudId}`,
        "documents",
        "excel masivo"
    );

    // Crear carpeta si no existe
    if (!fs.existsSync(carpetaDestino)) {
        fs.mkdirSync(carpetaDestino, { recursive: true });
    }

    const rutaArchivo = path.join(
        carpetaDestino,
        `masivo-${solicitudId}.xlsx`
    );

    const workbook = new ExcelJS.Workbook();

    // 📄 Si ya existe el Excel → lo abrimos
    if (fs.existsSync(rutaArchivo)) {
        await workbook.xlsx.readFile(rutaArchivo);
    } else {
        // 📄 Si NO existe → usamos tu plantilla
        const plantilla = path.join(
            process.cwd(),
            "src",
            "templates",
            "masivoAspirantes.xlsx"
        );

        await workbook.xlsx.readFile(plantilla);
    }

    const worksheet = workbook.getWorksheet(1);

        // ============================================
        // 🔎 BUSCAR LA PRIMERA FILA REALMENTE VACÍA
        // (ignora filas fantasma con formato)
        // ============================================

        // Cambia el 2 si tu encabezado está en otra fila
    let fila = 2;

    while (worksheet.getCell(`B${fila}`).value) {
            fila++;
    }

        // ============================================
        // ✍️ ESCRIBIR LOS DATOS EN ESA FILA
        // ============================================

        worksheet.getCell(`A${fila}`).value = ""; // Resultado Registro
        worksheet.getCell(`B${fila}`).value = tipoIdentificacion;
        worksheet.getCell(`C${fila}`).value = numeroIdentificacion;
        worksheet.getCell(`D${fila}`).value = "";
        worksheet.getCell(`E${fila}`).value = caracterizacion; // Tipo población (pendiente)
        worksheet.getCell(`F${fila}`).value = codigoEmpresa;


    await workbook.xlsx.writeFile(rutaArchivo);
};
