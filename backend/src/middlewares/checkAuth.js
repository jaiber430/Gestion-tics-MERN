import HttpErrors from "../helpers/httpErrors.js"
import jwt from 'jsonwebtoken'

import Usuarios from '../models/Usuarios.js'

const checkAuth = async (req, res, next) => {

    const token = req.cookies.token

    if (!token) {
        throw new HttpErrors('Accion no valida', 401)
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRETKEY)
        const usuario = await Usuarios.findById(decoded.id).populate('rol')

        if (!usuario) {
            throw new HttpErrors('Usuario no encontrado', 403)
        }

        req.usuario = usuario

        next()
    } catch (error) {
        throw new HttpErrors('Token no valido', 401)
    }
}

export default checkAuth
