import { Router } from 'express'


import {
    registrarAspirante,
    actualizarAspirante,
    eliminarAspirante,
    contarAspirante
} from '../controllers/aspiranteController.js'

const router = Router()

router.put('/actualizar', actualizarAspirante)
router.delete('/eliminar', eliminarAspirante)
router.post('/prerincripcion-aspirantes/:id', registrarAspirante)

export default router
