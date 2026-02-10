const errorMiddleware = (err, req, res, next) => {

    console.log(err.message)

    const message = err.message || 'Error en el servidor'
    const status = err.statusCode || 500

    res.status(status).json({
        msg: message
    })
}

export default errorMiddleware
