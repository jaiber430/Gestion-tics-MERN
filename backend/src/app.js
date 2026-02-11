import express, { json } from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import errorMiddleware from './middlewares/errorMiddleare.js'
import asyncHandle from './helpers/asyncHandler.js'

import usuarioRoutes from './routes/usuarioRoutes.js'

const app = express()

app.use(json())
// Usar cookies para guardar el token
app.use(cookieParser())
// Permitir usar cookie en el frontend
app.use(cors({
    origin: process.env.FORNTEND,
    credentials: true
}))



app.use(`${process.env.APIURL}`, asyncHandle(usuarioRoutes))

app.use(errorMiddleware)

export default app
