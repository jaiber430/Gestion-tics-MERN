import mongoose from "mongoose";

const rolesSchema = new mongoose.Schema({
    nombreRol: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
},{
    timestamps: true
})

export default mongoose.model('Roles', rolesSchema)
