import { Router } from 'express'

// ! MIDDLEWARES
import checkAuth from "../middlewares/checkAuth.js";
import permisosRol from "../middlewares/permisosRol.js";
import uploadPDF from '../middlewares/subirCartaEmpresa.js';

// ! CONTROLLERS
import {
    tipoSolicitud,
    crearSolicitud,
    infoSolicitud,
    // Elimar despues
    crearEmpresa
} from '../controllers/solicitudController.js'

const router = Router()

router.get(
    '/tipo-solicitud',
    checkAuth,
    permisosRol('ADMINISTRADOR', 'INSTRUCTOR'),
    tipoSolicitud
)

// console.log(uploadPDF)
router.post(
    '/crear-solicitud/:tipo',
    checkAuth,
    permisosRol('ADMINISTRADOR', 'INSTRUCTOR'),
    uploadPDF.single('cartaSolicitud'),
    crearSolicitud
)

router.get('/info-solicitud/:id',
    checkAuth,
    permisosRol('ADMINISTRADOR', 'INSTRUCTOR'),
    infoSolicitud
)


// ELiminar despues
router.post('/', crearEmpresa)

export default router
