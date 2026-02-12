import mongoose from "mongoose"

const tipoSolicitud = async (req, res) => {
    const { solicitud } = req.params

    res.send('Hi', solicitud)
}

const crearSolicitud = async (req, res) => {
    const { tipo } = req.params

    switch (tipo) {
        case "hoa":
            const session = mongoose.startSession()
            session.startTransaction()

            try {
                
            } catch (err) {
                res.send(err.message)
            }
            break;
        case "hoa2":
            res.send('Hello hoa2')
            break;

        default:
            // Si tratan de colocar un id no valido
            res.send('Default')
            break;
    }
}

export {
    tipoSolicitud,
    crearSolicitud
}
