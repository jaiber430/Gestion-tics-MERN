import mongoose from "mongoose";

const programasEspecialesCampesenaSchema = new mongoose.Schema({
    programaEspecialCampesena:{
        type: String,
        required: true,
        trim: true
    },
},{
    timestamps: true
})

export default mongoose.model('ProgramaEspecialCampesena', programasEspecialesCampesenaSchema)
