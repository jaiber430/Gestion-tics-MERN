import mongoose from "mongoose";

const programasEspecialesCampesenaSchema = new mongoose.Schema({
    programaEspecial:{
        type: String,
        required: true,
        trim: true
    },
},{
    timestamps: true
})

export default mongoose.model('ProgramaEspecialCampesena', programasEspecialesCampesenaSchema)
