import express from 'express'
import { json } from 'body-parser'
import { router } from './interfaces/routes'
import path from 'path'
import { CSVLoader } from './infrastructure/csv/CSVLoader'

const app = express()
app.use(json())

// Rotas da aplicação
app.use('/api', router)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

async function bootstrap() {
  const csvPath = path.resolve(__dirname, 'data', 'Movielist.csv')
  const awards = await CSVLoader.load(csvPath)
  console.log(`Total de registros carregados: ${awards.length}`)
  
  // Aqui futuramente vamos popular o banco ou armazenar isso em cache

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
  })
}

bootstrap()
