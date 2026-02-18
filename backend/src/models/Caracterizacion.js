import mongoose from "mongoose";

const caracterizacionSchema = new mongoose.Schema({
    caracterizacion:{
        type: String,
        uppercase: true,
    },
},{
    timestamps: true
})

export default mongoose.model('Caracterizacion', caracterizacionSchema)
