import mongoose from "mongoose";

const aspirantesSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    apellido: {
        type: String,
        required: true,
        trim: true,
    },
    archivo: {
        // ruta o URL del PDF
        type: String,
        required: false
    },
    tipoIdentificacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TiposIdentificacion'
    },
    numeroIdentificacion: {
        type: Number,
        required: true,
        unique: true,
    },
    telefono: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        // Farmato valido para el correo
        match: [/^\S+@\S+\.\S+$/,],
    },
}, {
    timestamps: true
})

export default mongoose.model('Aspirantes', aspirantesSchema)
