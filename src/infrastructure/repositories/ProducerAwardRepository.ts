import db from '../db/Database'
import { ProducerAward } from '../../domain/entities/ProducerAward'

export class ProducerAwardRepository {
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
}
