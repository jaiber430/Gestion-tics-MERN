import mongoose from "mongoose";

const areaSchema = new mongoose.Schema({
    area: {
        type: String,
    }
}, {
    timestamps: true
})

export default mongoose.model('Area', areaSchema)
