import mongoose from "mongoose";

const horarioSchema = new mongoose.Schema({
    fechaInicio: {
        type: Date,
        default: null,
    },
    fechaFin: {
        type: Date,
        default: null,
    },
    mes1: {
        type: String,
        required: true,
        trim: true
    },
    mes2: {
        type: String,
        required: true,
        trim: true
    },
    horas: {
        type: String,
        required: true
    },
    diasSemana:{
        type: String,
        required: true,
    },
},{
    timestamps: true
})

export default mongoose.model('Horario', horarioSchema)
