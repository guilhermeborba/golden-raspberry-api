import { ProducerAward } from '../domain/entities/ProducerAward'

export function parseCsvLineToProducerAward(data: any): ProducerAward {
  return {
    year: parseInt(data.year),
    title: data.title.trim(),
    studios: data.studios.trim(),
    producers: data.producers.split(',').map((p: string) => p.trim()),
    winner: data.winner?.toLowerCase() === 'yes'
  }
}
