import { Router } from "express"
import {
    obtenerAreas,
    obtenerProgramasFormacion,
    obtenerProgramasEspeciales,
    obtenerMunicipios,
    obtenerTiposEmpresa,
    obtenerTiposEmpresaRegular
} from "../controllers/catalogosController.js"

import checkAuth from "../middlewares/checkAuth.js"

const router = Router()

router.get("/areas", checkAuth, obtenerAreas)
router.get("/programas-formacion/:areaId", checkAuth, obtenerProgramasFormacion)
router.get("/programas-especiales", checkAuth, obtenerProgramasEspeciales)
router.get("/municipios", checkAuth, obtenerMunicipios)
router.get("/tipos-empresa", checkAuth, obtenerTiposEmpresa)
router.get("/tipos-empresa-regular", checkAuth, obtenerTiposEmpresaRegular)


export default router
