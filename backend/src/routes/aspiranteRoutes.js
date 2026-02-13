import { Router } from 'express'


import {
    registrarAspirante,
    actualizarAspirante,
    eliminarAspirante,
    contarAspirante
} from '../controllers/aspiranteController.js'

const router = Router()

router.post('/registrar', registrarAspirante)
router.put('/actualizar', actualizarAspirante)
router.delete('/eliminar', eliminarAspirante)
router.get('/contar', contarAspirante)

export default router
