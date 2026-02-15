const normalizarPrograma = (texto = "") => {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")           // quitar tildes
        .replace(/[^a-zA-Z0-9]/g, "_")            // símbolos → guion bajo
        .replace(/_+/g, "_")                      // EVITAR DOBLES: múltiples _ → uno solo
        .replace(/^_+|_+$/g, "")                  // quitar guiones al inicio/final
        .toUpperCase()
}

const generarProgramas = (programaSeleccionado) => {
    const resultado = {}

    const PROGRAMAS = [
        "CAMPESENA",
        "CAMPESENA RADIAL",
        "AULAS ABIERTAS",
        "PROGRAMA DE EMPRENDIMIENTO",
        "CATEDRA VIRTUAL DE PRODUCTIVIDAD",
        "PROGRAMA DE BILINGUISMO",
        "JOVENES RURALES SIN ALIANZAS",
        "TECNOACADEMIA",
        "AULA MOVIL",
        "AMBIENTES VIRTUALES DE APRENDIZAJE",
        "FULL POPULAR",
        "PROGRAMA JOVENES EN ACCION",
        "ALIANZAS ESTRATEGICAS",
        "FULL POPULAR- AULA MÓVIL"
    ]

    const programaNormalizado = normalizarPrograma(programaSeleccionado)

    PROGRAMAS.forEach(programa => {
        const claveLimpia = normalizarPrograma(programa)

        // Solo generar clave limpia (sin espacios, sin dobles guiones)
        resultado[claveLimpia] = claveLimpia === programaNormalizado
    })

    return resultado
}

export default generarProgramas
