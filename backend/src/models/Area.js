import mongoose from "mongoose";

const areaSchema = new mongoose.Schema({
    area: {
        type: String,
        uppercase: true,
    }
}, {
    timestamps: true
})

export default mongoose.model('Area', areaSchema)
