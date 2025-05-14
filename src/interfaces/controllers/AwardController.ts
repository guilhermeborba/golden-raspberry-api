import { Request, Response } from 'express'
import { GetProducerIntervalsUseCase } from '../../application/usecases/GetProducerIntervalsUseCase'
import { ProducerAwardRepository } from '../../infrastructure/repositories/ProducerAwardRepository'

export class AwardController {
  async getIntervals(req: Request, res: Response) {
    const repo = new ProducerAwardRepository()
    const useCase = new GetProducerIntervalsUseCase(repo)
    const result = useCase.execute()
    return res.json(result)
  }
}
