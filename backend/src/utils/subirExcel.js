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
            "funcionario"
        )

        // Crear carpeta si no existe
        fs.mkdirSync(ruta, { recursive: true })

        cb(null, ruta)
    },

    filename: (req, file, cb) => {
        const { idSolicitud } = req.params
        const extension = path.extname(file.originalname)

        cb(null, `sofia-plus-${idSolicitud}${extension}`)
    }
})

const fileFilter = (req, file, cb) => {

    const tiposPermitidos = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel"
    ]

    if (!tiposPermitidos.includes(file.mimetype)) {
        return cb(new Error("Solo se permiten archivos Excel"), false)
    }

    cb(null, true)
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
})

export default upload
