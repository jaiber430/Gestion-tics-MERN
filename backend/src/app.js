import express, { json } from 'express'
import 'dotenv/config'

import errorMiddleware from './middlewares/errorMiddleare.js'
import asyncHandle from './helpers/asyncHandler.js'

import usuarioRoutes from './routes/usuarioRoutes.js'

const app = express()

app.use(json())

app.use(`${process.env.APIURL}`, asyncHandle(usuarioRoutes))

app.use(errorMiddleware)

export default app
