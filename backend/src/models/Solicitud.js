import mongoose from "mongoose";

const solicitudSchema = new mongoose.Schema({

    // ===============================
    // TIPO DE SOLICITUD
    // ===============================
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

    // ===============================
    // DATOS GENERALES
    // ===============================
    cupo: {
        type: Number,
        required: true,
        default: 25,
    },

    direccionFormacion: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
    },

    subSectorEconomico: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
    },

    convenio: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
    },

    ambiente: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
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

    // ===============================
    // RELACIONES
    // ===============================
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
        refPath: "modelosProgramasEspeciales",
    },

    modelosProgramasEspeciales: {
        type: String,
        enum: ['ProgramasEspeciales', 'ProgramaEspecialCampesena']
    },

    municipio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Municipios",
    },

    departamento: {
        type: String,
        default: "Cauca",
    },

    // ===============================
    // SOLO PARA CAMPE SENA
    // ===============================
    tipoInstructor: {
        type: String,
        enum: ['TECNICO', 'EMPRESARIAL', 'FULLPOPULAR'],
        required: function () {
            return this.tipoSolicitud === 'CampeSENA';
        }
    },

    // ===============================
    // FECHAS GENERALES
    // ===============================
    fechaInicio: {
        type: Date,
        default: null,
    },

    fechaFin: {
        type: Date,
        default: null,
    },

    horaInicio: {
        type: String,
    },

    horaFin: {
        type: String,
    },

    fechasSeleccionadas: [{
        type: Date,
    }],

    // ===============================
    // MESES CALCULADOS AUTOMÁTICAMENTE
    // ===============================
    meses: [
        {
            nombreMes: String,
            dias: [Number],
            horaInicio: String,
            horaFin: String,
            horasPorDia: Number
        }
    ],

}, {
    timestamps: true,
});

export default mongoose.model('Solicitud', solicitudSchema);
