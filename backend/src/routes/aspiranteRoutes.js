import { Router } from 'express'
import upload from '../middlewares/uploadPDF.js'

import {
    registrarAspirante,
    actualizarAspirante,
    eliminarAspirante,
} from '../controllers/aspiranteController.js'

const router = Router()

router.put('/actualizar', actualizarAspirante)
router.delete('/eliminar', eliminarAspirante)


router.post('/preincripcion-aspirantes/:id', upload.single('pdf'), registrarAspirante)

export default router
