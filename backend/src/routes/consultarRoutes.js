import { Router } from "express";

import {
    consultarSolicitudInstructor,
    enviarSolicitud,
    verFichaCaracterizacion
} from '../controllers/consultasController.js'

import checkAuth from '../middlewares/checkAuth.js'
import permisosRol from '../middlewares/permisosRol.js'

const router = Router()

router.get('/consultas-instructor', checkAuth, permisosRol('INSTRUCTOR'), consultarSolicitudInstructor)
router.put('/consultas-instructor/:idSolicitud', checkAuth, permisosRol('INSTRUCTOR'), enviarSolicitud)
router.get('/consultas-instructor/verFichaCaracterizacion/:idSolicitud', checkAuth, permisosRol('INSTRUCTOR'), verFichaCaracterizacion)
router.post('/consultas-coordinador', checkAuth, permisosRol('INSTRUCTOR'), consultarSolicitudInstructor)
router.post('/revision-funcionario', checkAuth, permisosRol('INSTRUCTOR'), consultarSolicitudInstructor)
router.post('/consultas-administrador', checkAuth, permisosRol('INSTRUCTOR'), consultarSolicitudInstructor)

export default router
