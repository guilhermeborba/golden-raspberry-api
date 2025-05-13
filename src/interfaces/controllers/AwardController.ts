import { Request, Response } from 'express'
import { GetProducerIntervalsUseCase } from '../../application/usecases/GetProducerIntervalsUseCase'

export class AwardController {
  async getIntervals(req: Request, res: Response) {
    const useCase = new GetProducerIntervalsUseCase()
    const result = useCase.execute()
    return res.json(result)
  }
}
