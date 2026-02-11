import { Router } from 'express'

import {
    iniciarSesion,
    registrarUsuario,
    olvidePassword,
    recuperarPassword
} from '../controllers/usuarioController.js'

const router = Router()

router.post('/', iniciarSesion)
router.post('/registrar', registrarUsuario)
router.post('/olvide-password', olvidePassword)
router.post('/recuperar-password', recuperarPassword)

export default router
