import { Router } from 'express'
import { AwardController } from './controllers/AwardController'

export const router = Router()

const controller = new AwardController()

router.get('/producers/intervals', async (req, res, next) => {
    try{
        await controller.getIntervals(req, res)
    } catch (err) {
        next (err)
    }
})