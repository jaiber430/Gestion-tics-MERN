import mongoose from "mongoose";

const popularSchema = new mongoose.Schema({
    nombreInstructorEmpresarial: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    emailIntructorEmpresarial: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true,
        // Farmato valido para el correo
        match: [/^\S+@\S+\.\S+$/,],
    },
    telefonoInstructorEmpresarial: {
        type: Number,
        required: true,
        trim: true,
        unique: true,
        minlength: 10,
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
    mes3: {
        type: String,
        trim: true,
        required: false,
    },
    mes4: {
        type: String,
        required: false,
        trim: true
    },
    mes5: {
        type: String,
        trim: true,
        required: false,
    },
}, {
    timestamps: true,
})

export default mongoose.model('InstructorFullPopular', popularSchema)
