import mongoose from "mongoose";

const caracterizacionSchema = new mongoose.Schema({
    caracterizacion:{
        type: String,
    },
},{
    timestamps: true
})

export default mongoose.model('Caracterizacion', caracterizacionSchema)
