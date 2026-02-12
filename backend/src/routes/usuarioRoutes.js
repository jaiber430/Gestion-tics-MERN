import { Router } from 'express'

import {
    iniciarSesion,
    registrarUsuario,
    recuperarPassword,
    comprobarCookies,
    verificarUsuarios
} from '../controllers/usuarioController.js'

import checkAuth from '../middlewares/checkAuth.js'
import permisosRol from '../middlewares/permisosRol.js'

const router = Router()

router.post('/', iniciarSesion)
router.post('/registrar', registrarUsuario)
router.put('/recuperar-password', recuperarPassword)
router.get('/comprobarCookies', checkAuth, permisosRol('ADMINISTRADOR', 'INSTRUCTOR'),  comprobarCookies)
router.put('/verificacion-usuarios', checkAuth, permisosRol('ADMINISTRADOR'), verificarUsuarios)

export default router
