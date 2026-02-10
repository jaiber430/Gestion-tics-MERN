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
    // ! Referencia
    tipoIdentificacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TiposIdentificacion'
    },
    numeroIdentificacion: {
        type: Number,
        required: true,
        unique: true,
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
    password: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true
})

export default mongoose.model('Aspirantes', aspirantesSchema)
