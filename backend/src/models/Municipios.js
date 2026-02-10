import mongoose from "mongoose";

const municipiosSchema = new mongoose.Schema({
    municipios: {
        type: String,
        required: true
    },
},{
    timestamps: true
})

export default mongoose.model('Municipios', municipiosSchema)
