import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Asegurar que exista la carpeta temp
const carpetaTemp = 'temp';
if (!fs.existsSync(carpetaTemp)) {
    fs.mkdirSync(carpetaTemp, { recursive: true });
}

// Configuración del almacenamiento temporal
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, carpetaTemp); // siempre debe llamar cb
    },
    filename: (req, file, cb) => {
        const nombreUnico = Date.now() + path.extname(file.originalname);
        cb(null, nombreUnico); // siempre debe llamar cb
    }
});

// Validar que solo suban PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos PDF'));
    }
};

const upload = multer({
    storage,
    fileFilter
});

export default upload;
