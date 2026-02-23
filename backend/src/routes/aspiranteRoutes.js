import { Router } from 'express'
import upload, { combinarDespuesDeSubir } from '../utils/uploadPDF.js'

import {
    registrarAspirante, 
    obtenerTiposIdentificacion,
    actualizarAspirante,
    eliminarAspirante,
} from '../controllers/aspiranteController.js'

const router = Router()

// 1. RUTA FALTANTE: Obtener tipos para el select (Pública)
// Esta ruta debe ir antes de las que tienen ":id"
router.get('/tipos', obtenerTiposIdentificacion);


router.put('/actualizar', actualizarAspirante)
router.delete('/eliminar', eliminarAspirante)
router.post('/preincripcion-aspirantes/:id', upload.single('pdf'), combinarDespuesDeSubir, registrarAspirante)

export default router
