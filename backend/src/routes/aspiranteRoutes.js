import { Router } from 'express'
import upload, { combinarDespuesDeSubir } from '../utils/uploadPDF.js'

import {
    registrarAspirante, 
    obtenerTiposIdentificacion, obtenerTiposCaracterizacion,
    actualizarAspirante,
    eliminarAspirante,
} from '../controllers/aspiranteController.js'

const router = Router()


router.get('/', obtenerTiposIdentificacion, obtenerTiposCaracterizacion)
router.put('/actualizar/:id', actualizarAspirante)
router.delete('/eliminar/:id', eliminarAspirante)
router.post('/preincripcion-aspirantes/:id', upload.single('pdf'), combinarDespuesDeSubir, registrarAspirante)

export default router
