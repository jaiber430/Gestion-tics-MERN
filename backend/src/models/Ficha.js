import mongoose from "mongoose";

const fichaSchema = new mongoose.Schema({
    codigoFicha: {
        type: Number,
        default: null,
    },
    solicitud: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Solicitud'
    },
    estado: {
        type: String,
        enum: ['Creación', 'Creada', 'Lista de espera', 'Matriculada', 'Rechazada'],
        required: true,
    },
    usuarioSolicitante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios',
    },
    usuarioFuncionario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios',
    },
    observacion: {
        type: String,
        trim: true,
        uppercase: true,
    },
    numeroInscritos:{
        type: Number,
        trim: true,
    },
    excel: {
        type: Boolean,
        default: false
    },
    fechaRevisonFicha: {
        type: Date,
        default: Date.now()
    },
}, {
    timestamps: true
})

export default mongoose.model('Ficha', fichaSchema)
