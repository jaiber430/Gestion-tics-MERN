import mongoose from "mongoose";

const empresaSchema = new mongoose.Schema({
    nombreEmpresa: {
        type: String,
        trim: true,
        uppercase: true,
        required: true,
    },
    nombreResponsable: {
        type: String,
        trim: true,
        uppercase: true,
        required: true,
    },
    emailEmpresa: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/],
        required: true,
    },
    telefonoEmpresa: {
        type: Number,
        required: true,
        unique: true,
    },
    nitEmpresa: {
        type: Number,
        unique: true,
        required: true,
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
        ref: 'TipoEmpresaRegular', 
        required: true
    },
    numeroEmpleadosEmpresa: {
        type: Number,
        required: true,
        trim: true,
    },
    cartaSolicitud: {
        type: String, // ruta o URL del PDF
        required: false
    },
}, {
    timestamps: true
})

export default mongoose.model('Empresa', empresaSchema)