import mongoose from "mongoose";

const tipoEmpresaRegularSchema = new mongoose.Schema({
    tipoEmpresa: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
    }
}, {
    timestamps: true,
})

export default mongoose.model('TipoEmpresaRegular', tipoEmpresaRegularSchema)
