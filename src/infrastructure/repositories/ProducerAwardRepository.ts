import db from '../db/Database'
import { ProducerAward } from '../../domain/entities/ProducerAward'
import { IProducerAwardRepository } from '../../interfaces/repositories/IProducerAwardRepository'

export class ProducerAwardRepository implements IProducerAwardRepository {
  insertMany(awards: ProducerAward[]): void {
    const insert = db.prepare(`
      INSERT INTO producer_awards (year, title, studios, producer, winner)
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
    return db.prepare(`
      SELECT producer, year FROM producer_awards
      WHERE winner = 1
      ORDER BY producer, year
    `).all() as { producer: string; year: number }[]
  }
}
