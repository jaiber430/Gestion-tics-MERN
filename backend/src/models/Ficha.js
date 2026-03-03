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
        enum: ['CREACIÓN', 'CREADA', 'LISTA DE ESPERA', 'MATRICULADA', 'RECHAZADA'],
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
    // Observación solo en CREACIÓN y RECHAZADA
    observacionCreacion: {
        type: String,
        trim: true,
        uppercase: true,
        default: null
    },
    observacionRechazada: {
        type: String,
        trim: true,
        uppercase: true,
        default: null
    },
    excel: {
        type: Boolean,
        default: true  // true = puede descargar, false = debe subir
    },
    fechaRevisonFicha: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
})

export default mongoose.model('Ficha', fichaSchema)
