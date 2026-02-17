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
    verDocumentoAspirantes,
    revisarSolicituFuncionario,
    descargarCartaSolicitud,
    descargarFichaCaracterizacion,
    descargarDocumentoAspirantes,
    descargarFormatoMasivo,
} from '../controllers/consultasController.js'

import checkAuth from '../middlewares/checkAuth.js'
import permisosRol from '../middlewares/permisosRol.js'

const router = Router()

router.get('/consultas-instructor', checkAuth, permisosRol('INSTRUCTOR'), consultarSolicitudInstructor)
router.put('/consultas-instructor/:idSolicitud', checkAuth, permisosRol('INSTRUCTOR'), enviarSolicitud)
router.get('/consultas-instructor/verFichaCaracterizacion/:idSolicitud', checkAuth, permisosRol('INSTRUCTOR'), verFichaCaracterizacion)
router.get('/revision-coordinador', checkAuth, permisosRol('COORDINADOR'), consultarSolicitudCoordinador)

router.put('/revision-coordinador/:idSolicitud', checkAuth, permisosRol('COORDINADOR'), revisarSolicitud)
router.get('/revision-coordinador/carta-solicitud/:idSolicitud', checkAuth, permisosRol('COORDINADOR'), verCartaSolicitud)
router.get('/revision-coordinador/ver-ficha-caracterizacion/:idSolicitud', checkAuth, permisosRol('COORDINADOR'), verFichaCaracterizacionCoordinador)
router.get('/revision-coordinador/ver-documento-combinado/:idSolicitud', checkAuth, permisosRol('COORDINADOR'), verDocumentoAspirantes)
router.get('/revision-coordinador/ver-formato-inscripcion-masivo/:idSolicitud', checkAuth, permisosRol('COORDINADOR'), verFormatoMasivo)

router.put('/revision-funcionario/:idSolicitud', checkAuth, permisosRol('FUNCIONARIO'), revisarSolicituFuncionario)
router.get('/revision-funcionario/descargar-carta-solicitud/:idSolicitud', checkAuth, permisosRol('FUNCIONARIO'), descargarCartaSolicitud)
router.get('/revision-funcionario/descargar-ficha-caracterizacion/:idSolicitud', checkAuth, permisosRol('FUNCIONARIO'), descargarFichaCaracterizacion)
router.get('/revision-funcionario/descargar-documento-combinado/:idSolicitud', checkAuth, permisosRol('FUNCIONARIO'), descargarDocumentoAspirantes)
router.get('/revision-funcionario/descargar-formato-inscripcion-masivo/:idSolicitud', checkAuth, permisosRol('FUNCIONARIO'), descargarFormatoMasivo)

router.post('/revision-funcionario', checkAuth, permisosRol('INSTRUCTOR'), consultarSolicitudInstructor)
router.post('/consultas-administrador', checkAuth, permisosRol('INSTRUCTOR'), consultarSolicitudInstructor)

export default router
