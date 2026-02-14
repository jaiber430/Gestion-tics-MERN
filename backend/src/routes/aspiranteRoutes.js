import { Router } from 'express'


import {
    registrarAspirante,
    actualizarAspirante,
    eliminarAspirante,
} from '../controllers/aspiranteController.js'

const router = Router()

router.put('/actualizar', actualizarAspirante)
router.delete('/eliminar', eliminarAspirante)
router.post('/preincripcion-aspirantes/:id', registrarAspirante)

export default router
