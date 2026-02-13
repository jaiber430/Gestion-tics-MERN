import mongoose from "mongoose";

const solicitudSchema = new mongoose.Schema({
    tipoSolicitud: {
        type: String,
        enum: ['CampeSENA', 'Regular'],
        required: true,
    },
    tipoOferta: {
        type: String,
        enum: ['Abierta', 'Cerrada'],
        required: true,
    },
    codigoSolicitud: {
        type: Number,
        default: null,
    },
    cupo: {
        type: Number,
        required: true,
        default: 25,
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
        default: false
    },
    linkPreinscripcion: {
        type: Boolean,
        default: true
    },
    usuarioSolicitante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios',
    },
    empresaSolicitante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empresa',
        required: false,
    },
    programaFormacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProgramasFormacion",
    },
    programaEspecial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProgramasEspeciales",
    },
    departamento: {
        type: String,
        default: "Cauca",
    },
    municipio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Municipios",
    },
    // Zona del horario ☠️
    fechaInicio: {
        type: Date,
        default: null,
    },
    fechaFin: {
        type: Date,
        default: null,
        required: false,
    },
    mes1: {
        type: String,
        trim: true
    },
    mes2: {
        type: String,
        required: false,
        trim: true
    },
    horaInicio: {
        type: String,
        required: true
    },
    horaFin: {
        type: String,
        required: true
    },
    fechasSeleccionadas: [{
        type: Date,
        required: true,
    }],
    solicitud: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Solicitud'
    }
}, {
    timestamps: true,
})

export default mongoose.model('Solicitud', solicitudSchema)
