import { ProducerAward } from '../../domain/entities/ProducerAward'

export interface IProducerAwardRepository {
  insertMany(awards: ProducerAward[]): void
  getAllWinners(): { producer: string; year: number }[]
}
