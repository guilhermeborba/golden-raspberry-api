import db from '../../infrastructure/db/Database'

interface IntervalResult {
  producer: string
  interval: number
  previousWin: number
  followingWin: number
}

interface IntervalResponse {
  min: IntervalResult[]
  max: IntervalResult[]
}

export class GetProducerIntervalsUseCase {
  execute(): IntervalResponse {
    const rows = db.prepare(`
        SELECT producer, year FROM producer_awards
        WHERE winner = 1
        ORDER BY producer, year
      `).all() as { producer: string; year: number }[]

      console.log('Total de vencedores encontrados:', rows.length)

        

    const producerMap = new Map<string, number[]>()

    for (const row of rows) {
      if (!producerMap.has(row.producer)) {
        producerMap.set(row.producer, [])
      }
      producerMap.get(row.producer)?.push(row.year)
    }

    const intervals: IntervalResult[] = []

    for (const [producer, years] of producerMap.entries()) {
      if (years.length < 2) continue

      for (let i = 1; i < years.length; i++) {
        intervals.push({
          producer,
          interval: years[i] - years[i - 1],
          previousWin: years[i - 1],
          followingWin: years[i]
        })
      }
    }

    const minInterval = Math.min(...intervals.map(i => i.interval))
    const maxInterval = Math.max(...intervals.map(i => i.interval))

    return {
      min: intervals.filter(i => i.interval === minInterval),
      max: intervals.filter(i => i.interval === maxInterval)
    }
  }
}
