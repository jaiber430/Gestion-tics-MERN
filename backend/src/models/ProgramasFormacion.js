import mongoose from "mongoose";

const programasFormacionSchema = new mongoose.Schema({
    codigoPrograma: {
        type: Number,
        unique: true,
    },
    nombrePrograma: {
        type: String,
    },
    versionPrograma: {
        type: String,
    },
    horas: {
        type: Number,
        required: true,
    },
    modalidad: {
        type: String,
        default: 'Presencial',
    },
    area: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Areas'
    }
}, {
    timestamps: true
})

export default mongoose.model('ProgramasFormacion', programasFormacionSchema)
