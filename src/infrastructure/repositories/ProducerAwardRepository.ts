import db from '../db/Database'
import { ProducerAward } from '../../domain/entities/ProducerAward'
import { IProducerAwardRepository } from '../../interfaces/repositories/IProducerAwardRepository'

export class ProducerAwardRepository implements IProducerAwardRepository {
  insertMany(awards: ProducerAward[]): void {
    const insert = db.prepare(`
      INSERT INTO producer_awards (year, title, studios, producers, winner)
      VALUES (@year, @title, @studios, @producer, @winner)
    `)

    const insertMany = db.transaction((rows: ProducerAward[]) => {
      for (const row of rows) {
        for (const producer of row.producers) {
          insert.run({
            year: row.year,
            title: row.title,
            studios: row.studios,
            producer,
            winner: row.winner ? 1 : 0
          })
        }
      }
    })

    insertMany(awards)
  }

  getAllWinners(): { producer: string; year: number }[] {
    const rows = db.prepare('SELECT year, producers FROM producer_awards WHERE winner = 1').all() as { year: number; producers: string }[]

    const exploded: { producer: string; year: number }[] = []

    for (const row of rows) {
      const producers = row.producers
        .split(/,| and /)
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0)

      for (const producer of producers) {
        exploded.push({ producer, year: row.year })
      }
    }

    return exploded
  }
}
