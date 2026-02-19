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
    telefonoInstructorEmpresarial:{
        type: Number,
        required: true,
        trim: true,
        unique: true,
        minlength: 10,
    },
},{
    timestamps: true,
})

export default mongoose.model('InstructorFullPopular', popularSchema)
