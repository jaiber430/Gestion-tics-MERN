import { Router } from 'express'

import {
    crearPrograma,
    obtenerProgramas,
    actualizarPrograma,
    eliminarPrograma
    
}from '../controllers/programaController.js'

const router = Router()

router.get('/', obtenerProgramas)
router.post('/crear-programa/:area', crearPrograma)
router.put('/actualizar-programa/:id', actualizarPrograma)
router.delete('/eliminar-programa/:id', eliminarPrograma)


export default router