import { Router, Request, Response, NextFunction } from 'express'
import { TokenService } from '../application/TokenService'

export class TokenController {
  constructor(private tokenService: TokenService) {}

  async getTokenInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { tokenId } = req.params
      const info = await this.tokenService.getTokenInfo(tokenId)
      res.json(info)
    } catch (err) {
      next(err)
    }
  }

  async getUserBalance(req: Request, res: Response, next: NextFunction) {
    try {
      const { tokenId, userId } = req.params
      const balance = await this.tokenService.getUserBalance(tokenId, userId)
      res.json({ tokenId, userId, balance })
    } catch (err) {
      next(err)
    }
  }

  get router(): Router {
    const router = Router()
    router.get('/:tokenId', this.getTokenInfo.bind(this))
    router.get('/:tokenId/balance/:userId', this.getUserBalance.bind(this))
    return router
  }
}
