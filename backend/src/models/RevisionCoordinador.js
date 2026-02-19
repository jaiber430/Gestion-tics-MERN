import mongoose from "mongoose";

const revisionCoordinadorSchema = new mongoose.Schema({
    usuarioSolicitante:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios'
    },
    usuarioRevisador:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios'
    },
    solicitud:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Solicitud'
    },
    estado:{
        type: Boolean,
        default: false,
    },
    observacion:{
        type: String,
        trim: true,
        uppercase: true,
        default: null,
    },
    fechaRevison:{
        type: Date,
        default: Date.now(),
    },
},{
    timestamps: true
})

export default mongoose.model('RevisionCoordinador', revisionCoordinadorSchema)
