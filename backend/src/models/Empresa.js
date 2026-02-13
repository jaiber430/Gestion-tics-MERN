import mongoose from "mongoose";

const empresaSchema = new mongoose.Schema({
    nombreEmpresa: {
        type: String,
        trim: true,
    },
    nombreResponsable: {
        type: String,
        trim: true,
    },
    emailEmpresa: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/,],
    },
    nitEmpresa: {
        type: Number,
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
