import { Router } from 'express'

import {
    iniciarSesion,
    registrarUsuario,
    recuperarPassword,
    comprobarCookies,
    verUsuarios,
    verificarUsuarios
} from '../controllers/usuarioController.js'

import checkAuth from '../middlewares/checkAuth.js'
import permisosRol from '../middlewares/permisosRol.js'

const router = Router()

router.post(
    '/',
    iniciarSesion
)
router.post(
    '/registrar',
    registrarUsuario
)
router.put(
    '/recuperar-password',
    recuperarPassword
)
router.get(
    '/comprobarCookies',
    checkAuth,
    permisosRol('ADMINISTRADOR', 'INSTRUCTOR', 'COORDINADOR', 'FUNCIONARIO', 'CURRICULAR'),
    comprobarCookies
)
router.get(
    '/verificacion-usuarios',
    checkAuth,
    permisosRol('ADMINISTRADOR'),
    verUsuarios
)
router.put(
    '/verificacion-usuarios/:id',
    checkAuth,
    permisosRol('ADMINISTRADOR'),
    verificarUsuarios
)

export default router
