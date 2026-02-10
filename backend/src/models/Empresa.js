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
    // ! Referencia
    tipoEmpresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TiposEmpresa'
    }
},{
    timestamps: true
})

export default mongoose.model('Empresa', empresaSchema)
