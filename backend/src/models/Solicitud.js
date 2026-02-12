import mongoose from "mongoose";

const solicitudSchema = new mongoose.Schema({
    tipoOferta: {
        type: String,
        enum: ['Abierta', 'Cerrada'],
        required: true,
    },
    tipoSolicitud: {
        type: String,
        enum: ['CampeSENA', 'Regular'],
        required: true,
    },
    codigoSolicitud: {
        type: Number,
        default: null,
    },
    cupo: {
        type: Number,
        required: true,
    },
    direccionFormacion: {
        type: String,
        required: true,
        trim: true,
    },
    subSectorEconomico: {
        type: String,
        required: true,
        trim: true,
    },
    convenio: {
        type: String,
        required: true,
        trim: true
    },
    ambiente: {
        type: String,
        required: true,
        trim: true
    },
    fechaSolicitud: {
        type: Date,
        default: Date.now(),
    },
    revisado: {
        type: Boolean,
        default: true
    },
    linkPreinscripcion: {
        type: Boolean,
        default: true
    },
    // ! Relaciones
    usuarioSolicitante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios',
    },
    empresaSolicitante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empresa',
    },
    programaFormacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProgramasFormacion",
    },
    programaEspecial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProgramasEspeciales",
    },
    municipio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Municipios",
    },
    fechaInicio: {
        type: Date,
        default: null,
    },
    fechaFin: {
        type: Date,
        default: null,
    },
    mes1: {
        type: String,
        required: true,
        trim: true
    },
    mes2: {
        type: String,
        required: true,
        trim: true
    },
    horas: {
        type: String,
        required: true
    },
    diasSemana: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
})

export default mongoose.model('Solicitud', solicitudSchema)
