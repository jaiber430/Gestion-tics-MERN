import mongoose from "mongoose";

const ProgramasEspecialesSchema = new mongoose.Schema({
    programaEspecial:{
        type: String,
        required: true,
        trim: true,
        uppercase: true,
    },
},{
    timestamps: true
})

export default mongoose.model('ProgramasEspeciales', ProgramasEspecialesSchema)
