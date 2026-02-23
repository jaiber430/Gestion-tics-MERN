import { Router } from 'express'
import upload, { combinarDespuesDeSubir } from '../utils/uploadPDF.js'

import {
    registrarAspirante, 
    obtenerTiposIdentificacion,
    actualizarAspirante,
    eliminarAspirante,
} from '../controllers/aspiranteController.js'

const router = Router()


router.get('/', obtenerTiposIdentificacion);
router.put('/actualizar', actualizarAspirante)
router.delete('/eliminar', eliminarAspirante)
router.post('/preincripcion-aspirantes/:id', upload.single('pdf'), combinarDespuesDeSubir, registrarAspirante)

export default router
