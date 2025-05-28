import request from 'supertest'
import { app } from '../../app'
import { createAwardsTable } from '../../infrastructure/db/migrations/createAwardsTable'
import { ProducerAwardRepository } from '../../infrastructure/repositories/ProducerAwardRepository'
import { ProducerAward } from '../../domain/entities/ProducerAward'
import db from '../../infrastructure/db/Database'
import path from 'path'
import { CSVLoader } from '../../infrastructure/csv/CSVLoader'

describe('GET /api/producers/intervals - custom mock data', () => {
  beforeAll(() => {
    createAwardsTable()
    db.prepare('DELETE FROM producer_awards').run()

    const repo = new ProducerAwardRepository()

    const mockAwards: ProducerAward[] = [
      {
        year: 2000,
        title: 'Mock Movie A',
        studios: 'Studio A',
        producers: ['Producer A'],
        winner: true
      },
      {
        year: 2005,
        title: 'Mock Movie A2',
        studios: 'Studio A',
        producers: ['Producer A'],
        winner: true
      },
      {
        year: 1990,
        title: 'Mock Movie B',
        studios: 'Studio B',
        producers: ['Producer B'],
        winner: true
      },
      {
        year: 2005,
        title: 'Mock Movie B2',
        studios: 'Studio B',
        producers: ['Producer B'],
        winner: true
      }
    ]

    repo.insertMany(mockAwards)
  })

  it('should return expected min and max intervals', async () => {
    const res = await request(app).get('/api/producers/intervals')

    expect(res.status).toBe(200)
    expect(res.body.min).toEqual([
      {
        producer: 'Producer A',
        interval: 5,
        previousWin: 2000,
        followingWin: 2005
      }
    ])
    expect(res.body.max).toEqual([
      {
        producer: 'Producer B',
        interval: 15,
        previousWin: 1990,
        followingWin: 2005
      }
    ])
  })
})

describe('GET /api/producers/intervals - all producers with same interval', () => {
  beforeAll(() => {
    createAwardsTable()
    db.prepare('DELETE FROM producer_awards').run()

    const repo = new ProducerAwardRepository()

    const awards: ProducerAward[] = [
      { year: 1990, title: 'A', studios: 'S', producers: ['P1'], winner: true },
      { year: 1995, title: 'A2', studios: 'S', producers: ['P1'], winner: true },
      { year: 2000, title: 'B', studios: 'S', producers: ['P2'], winner: true },
      { year: 2005, title: 'B2', studios: 'S', producers: ['P2'], winner: true },
      { year: 2010, title: 'C', studios: 'S', producers: ['P3'], winner: true },
      { year: 2015, title: 'C2', studios: 'S', producers: ['P3'], winner: true }
    ]

    repo.insertMany(awards)
  })

  it('should return all producers as min and max when intervals are equal', async () => {
    const res = await request(app).get('/api/producers/intervals')
    expect(res.status).toBe(200)

    const minProducers = res.body.min.map((item: any) => item.producer)
    const maxProducers = res.body.max.map((item: any) => item.producer)

    expect(minProducers).toEqual(expect.arrayContaining(['P1', 'P2', 'P3']))
    expect(maxProducers).toEqual(expect.arrayContaining(['P1', 'P2', 'P3']))
  })
})

describe('GET /api/producers/intervals - single winner scenario', () => {
  beforeAll(() => {
    createAwardsTable()
    db.prepare('DELETE FROM producer_awards').run()

    const repo = new ProducerAwardRepository()

    const awards: ProducerAward[] = [
      { year: 2020, title: 'Lone Winner', studios: 'S', producers: ['Solo'], winner: true }
    ]

    repo.insertMany(awards)
  })

  it('should return empty min and max if only one producer has one win', async () => {
    const res = await request(app).get('/api/producers/intervals')
    expect(res.status).toBe(200)
    expect(res.body.min).toEqual([])
    expect(res.body.max).toEqual([])
  })
})

describe('GET /api/producers/intervals - no data in database', () => {
  beforeAll(() => {
    createAwardsTable()
    db.prepare('DELETE FROM producer_awards').run()
  })

  it('should return empty arrays for min and max if no winners are present', async () => {
    const res = await request(app).get('/api/producers/intervals')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ min: [], max: [] })
  })
})

describe('GET /api/producers/intervals - from original dataset', () => {
  beforeAll(async () => {
    createAwardsTable()
    db.prepare('DELETE FROM producer_awards').run()

    const csvPath = path.resolve(__dirname, '../../../src/data/Movielist.csv')
    const awards = await CSVLoader.load(csvPath)

    const repo = new ProducerAwardRepository()
    repo.insertMany(awards)
  })

  it('should return correct min and max intervals from real CSV data', async () => {
    const res = await request(app).get('/api/producers/intervals')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      min: [
        {
          producer: 'Joel Silver',
          interval: 1,
          previousWin: 1990,
          followingWin: 1991
        }
      ],
      max: [
        {
          producer: 'Matthew Vaughn',
          interval: 13,
          previousWin: 2002,
          followingWin: 2015
        }
      ]
    })
  })
})