import path from 'path'
import { app } from '../../app'
import request from 'supertest'
import { createAwardsTable } from '../../infrastructure/db/migrations/createAwardsTable'
import { CSVLoader } from '../../infrastructure/csv/CSVLoader'
import { ProducerAwardRepository } from '../../infrastructure/repositories/ProducerAwardRepository'

beforeAll(async () => {
  createAwardsTable()
  const csvPath = path.resolve(__dirname, '../../data/movieList.csv')
  const awards = await CSVLoader.load(csvPath)
  const repo = new ProducerAwardRepository()
  repo.insertMany(awards)
})


describe('GET /api/producers/intervals', () => {
  it('should return producers with min and max win intervals', async () => {
    const res = await request(app).get('/api/producers/intervals')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('min')
    expect(res.body).toHaveProperty('max')

    expect(Array.isArray(res.body.min)).toBe(true)
    expect(Array.isArray(res.body.max)).toBe(true)

    if (res.body.min.length > 0) {
      expect(res.body.min[0]).toHaveProperty('producer')
      expect(res.body.min[0]).toHaveProperty('interval')
      expect(res.body.min[0]).toHaveProperty('previousWin')
      expect(res.body.min[0]).toHaveProperty('followingWin')
    }
  })
})
