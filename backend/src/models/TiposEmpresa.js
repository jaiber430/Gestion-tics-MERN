import mongoose from "mongoose";

const tipoEmpresaSchema = new mongoose.Schema({
    tipoEmpresa: {
        type: String,
        required: true,
        trim: true,
    }
}, {
    timestamps: true,
})

export default mongoose.model('TipoEmpresa', tipoEmpresaSchema)
