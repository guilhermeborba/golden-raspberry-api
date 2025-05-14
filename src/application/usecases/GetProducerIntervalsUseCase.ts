import { IProducerAwardRepository } from '../../interfaces/repositories/IProducerAwardRepository'

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
  constructor(private repo: IProducerAwardRepository) {}

  execute(): IntervalResponse {
    const rows = this.repo.getAllWinners()

    const producerMap = new Map<string, number[]>()
    for (const { producer, year } of rows) {
      if (!producerMap.has(producer)) {
        producerMap.set(producer, [])
      }
      producerMap.get(producer)!.push(year)
    }

    const minList: IntervalResult[] = []
    const maxList: IntervalResult[] = []
    let min = Infinity
    let max = -Infinity

    for (const [producer, years] of producerMap) {
      if (years.length < 2) continue

      const sortedYears = years.sort((a, b) => a - b)

      for (let i = 1; i < sortedYears.length; i++) {
        const interval = sortedYears[i] - sortedYears[i - 1]
        const data = {
          producer,
          interval,
          previousWin: sortedYears[i - 1],
          followingWin: sortedYears[i]
        }

        if (interval < min) {
          min = interval
          minList.length = 0
          minList.push(data)
        } else if (interval === min) {
          minList.push(data)
        }

        if (interval > max) {
          max = interval
          maxList.length = 0
          maxList.push(data)
        } else if (interval === max) {
          maxList.push(data)
        }
      }
    }

    return { min: minList, max: maxList }
  }
}
