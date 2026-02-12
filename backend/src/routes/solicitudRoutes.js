import { Router } from 'express'

// ! MIDDLEWARES
import checkAuth from "../middlewares/checkAuth.js";
import permisosRol from "../middlewares/permisosRol.js";

// ! CONTROLLERS
import {
    tipoSolicitud,
    crearSolicitud
} from '../controllers/solicitudController.js'

const router = Router()

router.get('/tipo-solicitud', checkAuth, permisosRol('ADMINISTRADOR', 'INSTRUCTOR'), tipoSolicitud)
router.post('/crear-solicitud/:tipo', checkAuth, permisosRol('ADMINISTRADOR', 'INSTRUCTOR'), crearSolicitud)

export default router
