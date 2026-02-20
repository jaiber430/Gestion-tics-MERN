import { Router } from "express"
import {
    obtenerAreas,
    obtenerProgramasFormacion,
    obtenerProgramasEspeciales,
    obtenerMunicipios,
    obtenerTiposEmpresa,
    obtenerTiposEmpresaRegular,
    obtenerRoles,
    obtenerTipoIdentificacion,
} from "../controllers/catalogosController.js"

import checkAuth from "../middlewares/checkAuth.js"

const router = Router()

router.get("/areas", checkAuth, obtenerAreas)
router.get("/programas-formacion/:areaId", checkAuth, obtenerProgramasFormacion)
router.get("/programas-especiales", obtenerProgramasEspeciales)
router.get('/roles', obtenerRoles),
router.get('/tipos-identificacion', obtenerTipoIdentificacion),
router.get("/municipios", checkAuth, obtenerMunicipios)
router.get("/tipos-empresa", checkAuth, obtenerTiposEmpresa)
router.get("/tipos-empresa-regular", checkAuth, obtenerTiposEmpresaRegular)


export default router
