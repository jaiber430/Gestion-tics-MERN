export const calcularDiasSemana = (fechasSeleccionadas = []) => {

    // Mapa número → sigla
    const mapaDias = {
        0: "DOM",
        1: "LUN",
        2: "MAR",
        3: "MIE",
        4: "JUE",
        5: "VIE",
        6: "SAB"
    }

    // Inicializamos todos en false
    const diasBooleanos = {
        LUN: false,
        MAR: false,
        MIE: false,
        JUE: false,
        VIE: false,
        SAB: false,
        DOM: false
    }

    fechasSeleccionadas.forEach(fechaStr => {

        // Crear fecha LOCAL para evitar problema UTC
        const fecha = new Date(fechaStr)

        const numeroDia = fecha.getDay()
        const sigla = mapaDias[numeroDia]

        diasBooleanos[sigla] = true
    })

    return diasBooleanos
}
