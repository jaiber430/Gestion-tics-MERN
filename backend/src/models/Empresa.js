import mongoose from "mongoose";

const empresaSchema = new mongoose.Schema({
    nombreEmpresa: {
        type: String,
        required: true,
        trim: true,
    },
    nombreResponsable: {
        type: String,
        required: true,
        trim: true,
    },
    emailEmpresa: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/,],
    },
    nitEmpresa: {
        type: Number,
        required: true,
        unique: true
    },
    tipoEmpresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TiposEmpresa'
    },
    cartaSolicitud: {
        // ruta o URL del PDF
        type: String,
        required: false
    },
}, {
    timestamps: true
})

export default mongoose.model('Empresa', empresaSchema)
