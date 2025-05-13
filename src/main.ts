import express from 'express'
import { json } from 'body-parser'
import { router } from './interfaces/routes'
import path from 'path'
import { CSVLoader } from './infrastructure/csv/CSVLoader'
import { createAwardsTable } from './infrastructure/db/migrations/createAwardsTable'
import { ProducerAwardRepository } from './infrastructure/repositories/ProducerAwardRepository'

const app = express()
app.use(json())

// Rotas da aplicação
app.use('/api', router)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

async function bootstrap() {
  createAwardsTable()
  const csvPath = path.resolve(__dirname, 'data', 'Movielist.csv')
  const awards = await CSVLoader.load(csvPath)

  const repo = new ProducerAwardRepository()
  repo.insertMany(awards)

  console.log(`Total de registros carregados: ${awards.length}`)
  console.log('Dados inseridos no banco em memória.')
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
  })
}

bootstrap()
