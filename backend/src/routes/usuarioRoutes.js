import { Router } from 'express'

import {
    iniciarSesion
} from '../controllers/usuarioController.js'

const router = Router()

router.get('/', iniciarSesion)

export default router
