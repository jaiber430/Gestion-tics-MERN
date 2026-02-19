import mongoose from "mongoose";

const tecnicosSchema = new mongoose.Schema({
    nombreInstructorTecnico: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    emailIntructorTecnico: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true,
        // Farmato valido para el correo
        match: [/^\S+@\S+\.\S+$/,],
    },
    telefonoInstructorTecnico:{
        type: Number,
        required: true,
        trim: true,
        unique: true,
        minlength: 10,
    },
},{
    timestamps: true,
})

export default mongoose.model('InstructorTecnico', tecnicosSchema)
