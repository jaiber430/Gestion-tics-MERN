import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { nitEmpresa } = req.body; // usamos NIT de la empresa
        if (!nitEmpresa) return cb(new Error("No se envió el NIT de la empresa"), null);

        // Carpeta basada en el NIT
        const ruta = path.join("uploads", `empresa-${nitEmpresa}`, "documents");
        fs.mkdirSync(ruta, { recursive: true });

        cb(null, ruta);
    },

    filename: (req, file, cb) => {
        const { nitEmpresa } = req.body;
        const extension = path.extname(file.originalname);

        cb(null, `carta-${nitEmpresa}${extension}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
        return cb(new Error("Solo se permiten archivos PDF"), false);
    }
    cb(null, true);
};

const uploadPDF = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export default uploadPDF;