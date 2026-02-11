import { Router } from 'express'

import {
    iniciarSesion,
    registrarUsuario,
    recuperarPassword,
    profile
} from '../controllers/usuarioController.js'

import checkAuth from '../middlewares/checkAuth.js'
import permisosRol from '../middlewares/permisosRol.js'

const router = Router()

router.post('/', iniciarSesion)
router.post('/registrar', registrarUsuario)
router.put('/recuperar-password', recuperarPassword)
router.get('/profile', checkAuth, permisosRol('ADMINISTRADOR', 'INSTRUCTOR'),  profile)

export default router
