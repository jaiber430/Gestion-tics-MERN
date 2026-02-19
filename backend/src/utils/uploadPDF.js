import multer from 'multer';
import { PDFDocument } from 'pdf-lib';
import path from 'path';
import fs from 'fs';


// ===============================
// 📂 CONFIGURACIÓN DE ALMACENAMIENTO
// ===============================
const storage = multer.diskStorage({

    // Crear carpeta según la solicitud
    destination: (req, file, cb) => {
        try {
            const { id } = req.params;

            const carpetaDestino = path.join(
                process.cwd(),
                'uploads',
                `solicitud-${id}`,
                'DocumentosAspirantes'
            );

            // Crear la carpeta si no existe
            fs.mkdirSync(carpetaDestino, { recursive: true });

            cb(null, carpetaDestino);

        } catch (error) {
            cb(error);
        }
    },

    // Nombre del archivo = numeroIdentificacion.pdf
    filename: (req, file, cb) => {
        const { numeroIdentificacion } = req.body;

        if (!numeroIdentificacion) {
            return cb(new Error('numeroIdentificacion es requerido'));
        }

        const nombreFinal = `${numeroIdentificacion}.pdf`;
        cb(null, nombreFinal);
    }
});


// ===============================
// 📄 SOLO PERMITIR PDFs
// ===============================
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos PDF'));
    }
};


// ===============================
// 🚀 CONFIGURACIÓN MULTER
// ===============================
const upload = multer({
    storage,
    fileFilter
});


// ===============================
// 🔗 FUNCIÓN PARA COMBINAR PDFs
// ===============================
const combinarPdfs = async (carpeta) => {
    try {
        const archivos = fs.readdirSync(carpeta);

        const pdfs = archivos.filter(
            archivo => archivo.endsWith('.pdf') && archivo !== 'combinado.pdf'
        );

        if (pdfs.length <= 1) return; // si hay uno o ninguno, no hace nada

        const pdfFinal = await PDFDocument.create();

        for (const nombre of pdfs) {
            const ruta = path.join(carpeta, nombre);
            const bytes = fs.readFileSync(ruta);

            const pdf = await PDFDocument.load(bytes);
            const paginas = await pdfFinal.copyPages(pdf, pdf.getPageIndices());

            paginas.forEach(p => pdfFinal.addPage(p));
        }

        const pdfBytes = await pdfFinal.save();

        fs.writeFileSync(path.join(carpeta, 'combinado.pdf'), pdfBytes);

        console.log('✅ PDF combinado actualizado');
    } catch (error) {
        console.error('❌ Error combinando PDFs:', error);
    }
};


// ===============================
// 📌 MIDDLEWARE PARA COMBINAR DESPUÉS DE SUBIR
// ===============================
export const combinarDespuesDeSubir = async (req, res, next) => {
    try {
        const { id } = req.params;

        const carpetaDestino = path.join(
            process.cwd(),
            'uploads',
            `solicitud-${id}`,
            'DocumentosAspirantes'
        );

        await combinarPdfs(carpetaDestino);

        next();
    } catch (error) {
        next(error);
    }
};

// EXPORTS

export default upload;