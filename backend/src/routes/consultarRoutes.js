import { Router } from "express"

import {
    // INSTRUCTOR
    consultarSolicitudInstructor,
    enviarSolicitud,
    verFichaCaracterizacion,

    // COORDINADOR
    consultarSolicitudCoordinador,
    revisarSolicitud,
    verFichaCaracterizacionCoordinador,
    verFormatoMasivo,
    verCartaSolicitud,
    verDocumentoAspirantes,

    // FUNCIONARIO
    verSolicitudesFuncionario,
    revisarSolicitudFuncionario,
    descargarCartaSolicitud,
    descargarFichaCaracterizacion,
    descargarDocumentoAspirantes,
    descargarFormatoMasivo,
    subirExcelSofiaPlus,

} from '../controllers/consultasController.js'

import upload from "../middlewares/subirExcel.js"
import checkAuth from '../middlewares/checkAuth.js'
import permisosRol from '../middlewares/permisosRol.js'

const router = Router()

// INSTRUCTOR

// Listar solicitudes
router.get(
    '/consultas-instructor',
    checkAuth,
    permisosRol('INSTRUCTOR'),
    consultarSolicitudInstructor
)

// Enviar solicitud
router.put(
    '/consultas-instructor/:idSolicitud',
    checkAuth,
    permisosRol('INSTRUCTOR'),
    enviarSolicitud
)

// Ver ficha de caracterización
router.get(
    '/consultas-instructor/:idSolicitud/ficha-caracterizacion',
    checkAuth,
    permisosRol('INSTRUCTOR'),
    verFichaCaracterizacion
)

// COORDINADOR

// Listar solicitudes
router.get(
    '/revision-coordinador',
    checkAuth,
    permisosRol('COORDINADOR'),
    consultarSolicitudCoordinador
)

// Revisar solicitud
router.put(
    '/revision-coordinador/:idSolicitud',
    checkAuth,
    permisosRol('COORDINADOR'),
    revisarSolicitud
)

// Ver documentos
router.get(
    '/revision-coordinador/:idSolicitud/carta-solicitud',
    checkAuth,
    permisosRol('COORDINADOR'),
    verCartaSolicitud
)

router.get(
    '/revision-coordinador/:idSolicitud/ficha-caracterizacion',
    checkAuth,
    permisosRol('COORDINADOR'),
    verFichaCaracterizacionCoordinador
)

router.get(
    '/revision-coordinador/:idSolicitud/documento-aspirantes',
    checkAuth,
    permisosRol('COORDINADOR'),
    verDocumentoAspirantes
)

router.get(
    '/revision-coordinador/:idSolicitud/formato-masivo',
    checkAuth,
    permisosRol('COORDINADOR'),
    verFormatoMasivo
)

// FUNCIONARIO

// Listar solicitudes
router.get(
    '/revision-funcionario',
    checkAuth,
    permisosRol('FUNCIONARIO'),
    verSolicitudesFuncionario
)

// Revisar solicitud
router.put(
    '/revision-funcionario/:idSolicitud',
    checkAuth,
    permisosRol('FUNCIONARIO'),
    revisarSolicitudFuncionario
)

// Descargar documentos
router.get(
    '/revision-funcionario/:idSolicitud/descargar-carta',
    checkAuth,
    permisosRol('FUNCIONARIO'),
    descargarCartaSolicitud
)

router.get(
    '/revision-funcionario/:idSolicitud/descargar-ficha',
    checkAuth,
    permisosRol('FUNCIONARIO'),
    descargarFichaCaracterizacion
)

router.get(
    '/revision-funcionario/:idSolicitud/descargar-documento',
    checkAuth,
    permisosRol('FUNCIONARIO'),
    descargarDocumentoAspirantes
)

router.get(
    '/revision-funcionario/:idSolicitud/descargar-formato',
    checkAuth,
    permisosRol('FUNCIONARIO'),
    descargarFormatoMasivo
)

router.post(
    '/revision-funcionario/subir-excel/:idSolicitud',
    checkAuth,
    permisosRol('FUNCIONARIO'),
    upload.single('archivo'),
    subirExcelSofiaPlus
)

export default router
