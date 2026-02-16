import { Router } from "express";

import {
    consultarSolicitudInstructor,
    enviarSolicitud,
    verFichaCaracterizacion,
    consultarSolicitudCoordinador,
    revisarSolicitud,
    verFichaCaracterizacionCoordinador,
    verFormatoMasivo,
    verCartaSolicitud,
    verDocumentoAspirantes
} from '../controllers/consultasController.js'

import checkAuth from '../middlewares/checkAuth.js'
import permisosRol from '../middlewares/permisosRol.js'

const router = Router()

router.get('/consultas-instructor', checkAuth, permisosRol('INSTRUCTOR'), consultarSolicitudInstructor)
router.put('/consultas-instructor/:idSolicitud', checkAuth, permisosRol('INSTRUCTOR'), enviarSolicitud)
router.get('/consultas-instructor/verFichaCaracterizacion/:idSolicitud', checkAuth, permisosRol('INSTRUCTOR'), verFichaCaracterizacion)
router.get('/consultas-coordinador', checkAuth, permisosRol('COORDINADOR'), consultarSolicitudCoordinador)

router.put('/consultas-coordinador/:idSolicitud', checkAuth, permisosRol('COORDINADOR'), revisarSolicitud)
router.get('/consultas-coordinador/carta-solicitud/:idSolicitud', checkAuth, permisosRol('COORDINADOR'), verCartaSolicitud)
router.get('/consultas-coordinador/ver-ficha-caracterizacion/:idSolicitud', checkAuth, permisosRol('COORDINADOR'), verFichaCaracterizacionCoordinador)
router.get('/consultas-coordinador/ver-documento-combinado/:idSolicitud', checkAuth, permisosRol('COORDINADOR'), verDocumentoAspirantes)
router.get('/consultas-coordinador/ver-formato-inscripcion-masivo/:idSolicitud', checkAuth, permisosRol('COORDINADOR'), verFormatoMasivo)

router.post('/revision-funcionario', checkAuth, permisosRol('INSTRUCTOR'), consultarSolicitudInstructor)
router.post('/consultas-administrador', checkAuth, permisosRol('INSTRUCTOR'), consultarSolicitudInstructor)

export default router
