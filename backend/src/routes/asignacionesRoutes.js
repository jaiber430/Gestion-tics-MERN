import { Router } from "express";

import checkAuth from "../middlewares/checkAuth.js";
import permisosRol from "../middlewares/permisosRol.js";
import {
    asignarUsuarios,
    verAsignaciones,
    verAsignacionesCoordinador,
    eliminarAsignacion,
    actualizarAsignacion,
} from '../controllers/asignacionController.js'

const router = Router()

router.post('/asignar-usuario', checkAuth, permisosRol('ADMINISTRADOR'), asignarUsuarios)
router.get('/asignaciones', checkAuth, permisosRol('ADMINISTRADOR'), verAsignaciones)
router.get('/asignaciones/coordinador', checkAuth, permisosRol('ADMINISTRADOR'), verAsignacionesCoordinador)
router.delete('/asignacion/:id', checkAuth, permisosRol('ADMINISTRADOR'), eliminarAsignacion)
router.put('/asignacion/:id', checkAuth, permisosRol('ADMINISTRADOR'), actualizarAsignacion)

export default router
