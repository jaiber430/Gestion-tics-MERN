import { Router } from 'express'
import upload, { combinarDespuesDeSubir } from '../utils/uploadPDF.js'

import {
    registrarAspirante,
    actualizarAspirante,
    eliminarAspirante,
} from '../controllers/aspiranteController.js'

const router = Router()

router.put('/actualizar', actualizarAspirante)
router.delete('/eliminar', eliminarAspirante)


router.post('/preincripcion-aspirantes/:id', upload.single('pdf'), combinarDespuesDeSubir, registrarAspirante)

export default router
