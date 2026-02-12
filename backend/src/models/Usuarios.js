import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    apellido: {
        type: String,
        required: true,
        trim: true,
    },
    rol: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roles'
    },
    tipoIdentificacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TiposIdentificacion'
    },
    numeroIdentificacion: {
        type: Number,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        // Farmato valido para el correo
        match: [/^\S+@\S+\.\S+$/,],
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    token: {
        type: String,
        default: null,
    },
    verificado: {
        type: Boolean,
        default: false,
    },
    tipoContrato: {
        type: String,
        enum: ['Contrato', 'Planta'],
        required: true,
    },
    inicioContrato: {
        type: Date,
        default: null,
    },
    finContrato: {
        type: Date,
        default: null,
    },
    contratoActivo: {
        type: Boolean,
        default: false
    },
    numeroContrato: {
        type: Number,
        unique: true,
        sparse: true
    }
}, {
    timestamps: true
})

//  Encriptación de la contraseña
usuarioSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    return
})

usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password)
}

export default mongoose.model('Usuarios', usuarioSchema)
