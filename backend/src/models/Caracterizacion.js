import mongoose from "mongoose";

const caracterizacionSchema = new mongoose.Schema({
    nombreCaracterizacion:{
        type: String,
        uppercase: true,
        required: true
    },
},{
    timestamps: true
})

export default mongoose.model('Caracterizacion', caracterizacionSchema)