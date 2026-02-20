import mongoose from "mongoose";

const areaSchema = new mongoose.Schema({
    area: {
        type: String,
        required: true,     // ← ahora es obligatorio
        uppercase: true,
        trim: true,         // ← elimina espacios basura
        unique: true   
    }
}, {
    timestamps: true
})

export default mongoose.model('Areas', areaSchema)
