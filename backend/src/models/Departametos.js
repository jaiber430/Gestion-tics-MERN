import mongoose from "mongoose";

const departamentosSchema = new mongoose.Schema({
    departamento: {
        type: String,
        required: true
    },
},{
    timestamps: true
})

export default mongoose.model('Departamentos', departamentosSchema)
