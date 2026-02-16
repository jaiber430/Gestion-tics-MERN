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

const app = express()

app.use(json())
// Usar cookies para guardar el token
app.use(cookieParser())
// Permitir usar cookie en el frontend
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))



app.use(`${process.env.APIURL}usuarios`, asyncHandle(usuarioRoutes))
app.use(`${process.env.APIURL}solicitudes`, asyncHandle(solicitudRoutes))
app.use(`${process.env.APIURL}aspirantes`, asyncHandle(aspiranteRoutes))
app.use(`${process.env.APIURL}consultas`, asyncHandle(consultarRoutes))


app.use(errorMiddleware)

export default app
