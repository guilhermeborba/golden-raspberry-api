import express from 'express'
import { json } from 'body-parser'
import { router } from './interfaces/routes'

const app = express()
app.use(json())
app.use('/api', router)

export { app }
