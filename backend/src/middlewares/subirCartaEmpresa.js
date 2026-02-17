import multer from "multer"
import fs from "fs"
import path from "path"

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        const { idSolicitud } = req.params

        const ruta = path.join(
            "uploads",
            `solicitud-${idSolicitud}`,
            "documents",
        )

        fs.mkdirSync(ruta, { recursive: true })

        cb(null, ruta)
    },

    filename: (req, file, cb) => {

        const { idSolicitud } = req.params
        const extension = path.extname(file.originalname)

        cb(null, `carta-${idSolicitud}${extension}`)
    }
})

const fileFilter = (req, file, cb) => {

    const tipoPermitido = "application/pdf"

    if (file.mimetype !== tipoPermitido) {
        return cb(new Error("Solo se permiten archivos PDF"), false)
    }

    cb(null, true)
}

const uploadPDF = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
})

export default uploadPDF

