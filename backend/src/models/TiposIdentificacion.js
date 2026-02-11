import mongoose from "mongoose";

const TiposIdentificacionSchema = new mongoose.Schema({
    nombreTipoIdentificacion: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
}, {
    timestamps: true
})

export default mongoose.model('TiposIdentificacion', TiposIdentificacionSchema)
