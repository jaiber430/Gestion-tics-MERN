import mongoose from "mongoose";

const programasFormacionSchema = new mongoose.Schema({

    codigoPrograma: {
        type: Number,
        required: true,
        unique: true,
    },

    nombrePrograma: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
    },

    versionPrograma: {
        type: String,
        required: true,
        trim: true,
        default: '1'
    },

    horas: {
        type: Number,
        required: true,
        min: 10,
        max: 96
    },

    // Se deja fija, no editable
    modalidad: {
        type: String,
        default: 'PRESENCIAL',
        immutable: true, // evita que alguien la cambie después
    },

    area: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Area',
        ref: 'Areas',
        required: true,
    },

}, {
    timestamps: true
})

export default mongoose.model('ProgramasFormacion', programasFormacionSchema)




// import mongoose from "mongoose";

// const programasFormacionSchema = new mongoose.Schema({
//     codigoPrograma: {
//         type: Number,
//         unique: true,
//     },
//     nombrePrograma: {
//         type: String,
//         uppercase: true,
//     },
//     versionPrograma: {
//         type: String,
//     },
//     horas: {
//         type: Number,
//         required: true,
//     },
//     modalidad: {
//         type: String,
//         default: 'PRESENCIAL',
//     },
//     area: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Areas',
//     },
// }, {
//     timestamps: true
// })

// export default mongoose.model('ProgramasFormacion', programasFormacionSchema)
