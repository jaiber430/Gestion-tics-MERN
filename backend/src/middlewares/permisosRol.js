import HttpErrors from "../helpers/httpErrors.js"

const permisosRol = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.usuario.rol.nombreRol)) {
            throw new HttpErrors('No tienes permisos', 403)
        }
        next()
    }
}

export default permisosRol
