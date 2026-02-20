import { Router } from 'express'

import {
    iniciarSesion,
    registrarUsuario,
    recuperarPassword,
    verUsuarios,
    verificarUsuarios,
    activarContrato,
    coordinadores
} from '../controllers/usuarioController.js'

import checkAuth from '../middlewares/checkAuth.js'
import permisosRol from '../middlewares/permisosRol.js'

const router = Router()

router.post('/login', iniciarSesion)

router.get('/verCoordinadores', coordinadores)

router.post('/registrar', registrarUsuario)

router.put('/recuperar-password', recuperarPassword)

router.get(
    '/ver-usuarios',
    checkAuth,
    permisosRol('ADMINISTRADOR'),
    verUsuarios
)

router.patch(
    '/verificar/:id',
    checkAuth,
    permisosRol('ADMINISTRADOR'),
    verificarUsuarios
)

router.patch(
    '/activar-contrato/:id',
    checkAuth,
    permisosRol('ADMINISTRADOR'),
    activarContrato
)


export default router
