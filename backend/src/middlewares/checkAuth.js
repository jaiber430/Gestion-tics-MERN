import HttpErrors from "../helpers/httpErrors.js"
import jwt from 'jsonwebtoken'

import Usuarios from '../models/Usuarios.js'
import Roles from '../models/Roles.js'

const checkAuth = async (req, res, next) => {

    const token = req.cookie.token

    if (!token) {
        throw new HttpErrors('Accion no valida', 401)
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRETKEY)
        req.usuario = await Usuarios.findById(decoded.id)

        if (!req.usuario) {
            throw new HttpErrors('Usuario no encontrado', 403)
        }

        next()
    } catch (error) {
        throw new HttpErrors('Token no valido', 401)
    }
}

export default checkAuth
