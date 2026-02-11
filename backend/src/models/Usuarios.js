import mongoose from 'mongoose'

const usuarioSchema = new mongoose.Schema({
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
    rol: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roles'
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
    token: {
        type: String,
        default: null,
    },
    verificado: {
        type: Boolean,
        default: false,
    },
    tipoContrato: {
        type: String,
        enum: ['Contrato', 'Planta'],
        required: true,
    },
    finContrato: {
        type: Date,
        default: null,
    },
    contratoActivo: {
        type: Boolean,
        default: false
    },
    numeroContrato: {
        type: Number,
        required: false,
        default: null,
    }
}, {
    timestamps: true
})

export default mongoose.model('Usuarios', usuarioSchema)
