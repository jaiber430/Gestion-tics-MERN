import mongoose from "mongoose";

const programasFormacionSchema = new mongoose.Schema({
    codigoPrograma: {
        type: Number,
        unique: true,
    },
    nombrePrograma: {
        type: String,
        uppercase: true,
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
        default: 'PRESENCIAL',
    },
    area: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Areas',
    },
}, {
    timestamps: true
})

export default mongoose.model('ProgramasFormacion', programasFormacionSchema)
