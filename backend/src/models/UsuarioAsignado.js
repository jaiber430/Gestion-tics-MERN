import mongoose from "mongoose";

const usuarioAsignadoSchema = new mongoose.Schema({
    usuarioInstructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios',
    },
    usuarioCoordinador:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios',
    },
    fechaAsignacion:{
        type: Date,
        default: Date.now()
    }
},{
    timestamps: true
})

export default mongoose.model('UsuarioAsignado', usuarioAsignadoSchema)
