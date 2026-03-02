import { Router } from 'express'
import upload, { combinarDespuesDeSubir } from '../utils/uploadPDF.js'

import {
    registrarAspirante,
    obtenerTiposIdentificacion,
    obtenerTiposCaracterizacion,
    preinscritos,
    actualizarAspirante,
    eliminarAspirante,
    preinscritosAspirantes
} from '../controllers/aspiranteController.js'

const router = Router()


router.get('/', obtenerTiposIdentificacion)
router.get('/caracterizacion', obtenerTiposCaracterizacion)
router.get('/preinscritos/:id', preinscritos)
router.get('/preinscritos-aspirantes/:id', preinscritosAspirantes)
router.put('/actualizar/:id', actualizarAspirante)
router.delete('/eliminar/:id', eliminarAspirante)
router.put('/preincripcion-aspirantes/:id', upload.single('pdf'), combinarDespuesDeSubir, registrarAspirante)

export default router
