import mongoose from "mongoose";

const empresaSchema = new mongoose.Schema({
    nombreEmpresa: {
        type: String,
        trim: true,
        uppercase: true,
    },
    nombreResponsable: {
        type: String,
        trim: true,
        uppercase: true,
    },
    emailEmpresa: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/,],
    },
    telefonoEmpresa: {
        type: Number,
        required: true,
        trim: true,
        unique: true,
    },
    nitEmpresa: {
        type: Number,
        unique: true
    },
    fechaCreacion: {
        type: Date,
        required: true,
    },
    direccionEmpresa: {
        type: String,
        required: true,
    },
    nombreContactoEmpresa: {
        type: String,
        required: true,
        trim: true,
    },
    tipoEmpresa: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'modelsTiposEmpresa'
    },
    modelsTiposEmpresa: {
        type: String,
        enum: ['TiposEmpresa', 'TipoEmpresaRegular']
    },
    numeroEmpleadosEmpresa:{
        type: Number,
        required: true,
        trim: true,
    },
    cartaSolicitud: {
        // ruta o URL del PDF
        type: String,
        required: false
    },
}, {
    timestamps: true
})

export default mongoose.model('Empresa', empresaSchema)
