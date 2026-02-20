import express, { json } from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import errorMiddleware from './middlewares/errorMiddleare.js'
import asyncHandle from './helpers/asyncHandler.js'

import usuarioRoutes from './routes/usuarioRoutes.js'
import solicitudRoutes from './routes/solicitudRoutes.js'
import aspiranteRoutes from './routes/aspiranteRoutes.js'
import consultarRoutes from './routes/consultarRoutes.js'
import catalogosRoutes from './routes/catalogoRoutes.js'
import programaRoutes from './routes/programaRoutes.js'

const app = express()

app.use(json())
// Usar cookies para guardar el token
app.use(cookieParser())
// Permitir usar cookie en el frontend
const allowedOrigins = process.env.FRONTEND_URL.split(',')

app.use(cors({
    origin: function (origin, callback) {

        // Permitir peticiones sin origin (como Postman)
        if (!origin) return callback(null, true)

        if (allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('No permitido por CORS'))
        }
    },
    credentials: true
}))

app.use(`${process.env.APIURL}usuarios`, asyncHandle(usuarioRoutes))
app.use(`${process.env.APIURL}catalogos`, catalogosRoutes)
app.use(`${process.env.APIURL}solicitudes`, asyncHandle(solicitudRoutes))
app.use(`${process.env.APIURL}aspirantes`, asyncHandle(aspiranteRoutes))
app.use(`${process.env.APIURL}consultas`, asyncHandle(consultarRoutes))
app.use(`${process.env.APIURL}programas`, asyncHandle(programaRoutes))



app.use(errorMiddleware)

export default app
