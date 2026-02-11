import { Router } from 'express'

import {
    iniciarSesion,
    registrarUsuario,
    olvidePassword,
    recuperarPassword,
    profile
} from '../controllers/usuarioController.js'

import checkAuth from '../middlewares/checkAuth.js'
import permisosRol from '../middlewares/permisosRol.js'

const router = Router()

router.post('/', iniciarSesion)
router.post('/registrar', registrarUsuario)
router.post('/olvide-password', olvidePassword)
router.post('/recuperar-password', recuperarPassword)
router.get('/profile', checkAuth, permisosRol('ADMINISTRADOR', 'INSTRUCTOR'),  profile)

export default router
