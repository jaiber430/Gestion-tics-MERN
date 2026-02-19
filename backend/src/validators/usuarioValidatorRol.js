const validarUsuarioPorRol = (usuario, rolEsperado) => {
    if (!usuario) {
        throw new HttpErrors(`${rolEsperado} no existe`, 404)
    }

    if (usuario.rol.nombreRol !== rolEsperado) {
        throw new HttpErrors(`El rol no es ${rolEsperado}`, 403)
    }

    if (!usuario.verificado) {
        throw new HttpErrors(`${rolEsperado} no verificado`, 403)
    }

    if (usuario.tipoContrato === 'Contrato' && !usuario.contratoActivo) {
        throw new HttpErrors('Contrato inactivo', 403)
    }
}

export default validarUsuarioPorRol
