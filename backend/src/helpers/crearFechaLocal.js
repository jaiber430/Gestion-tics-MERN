const crearFechaLocal = (fechaString) => {
    const [year, month, day] = fechaString.split("-").map(Number);
    return new Date(year, month - 1, day);
};

export default crearFechaLocal
