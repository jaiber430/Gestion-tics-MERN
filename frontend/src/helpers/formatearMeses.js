// Función para formatear los meses en el formato solicitado
const formatearMeses = (meses) => {
    if (!meses || meses.length === 0) return null;

    return meses.map((mes, index) => {
        if (!mes || !mes.dias || mes.dias.length === 0) return null;

        // Ordenar los días
        const diasOrdenados = [...mes.dias].sort((a, b) => a - b);

        // Formatear la lista de días
        let diasFormateados = '';
        let i = 0;

        while (i < diasOrdenados.length) {
            let inicio = diasOrdenados[i];
            let fin = inicio;

            // Buscar secuencias consecutivas
            while (i + 1 < diasOrdenados.length && diasOrdenados[i + 1] === diasOrdenados[i] + 1) {
                fin = diasOrdenados[i + 1];
                i++;
            }

            if (diasFormateados) {
                diasFormateados += ', ';
            }

            if (inicio === fin) {
                diasFormateados += inicio;
            } else {
                diasFormateados += `${inicio}, ${fin}`;
            }

            i++;
        }

        // Añadir "Y" antes del último número si hay más de un elemento
        const ultimaComa = diasFormateados.lastIndexOf(', ');
        if (ultimaComa !== -1) {
            diasFormateados = diasFormateados.substring(0, ultimaComa) + ' Y ' + diasFormateados.substring(ultimaComa + 2);
        }

        return {
            ...mes,
            diasFormateados
        };
    }).filter(mes => mes !== null);
};

export default formatearMeses
