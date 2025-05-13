import { Request, Response } from 'express'

export class AwardController {
  async getIntervals(req: Request, res: Response) {
    // Vamos implementar depois com o caso de uso real
    return res.json({ min: [], max: [] })
  }
}
