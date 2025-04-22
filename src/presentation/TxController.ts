import { Router, Request, Response, NextFunction } from 'express'
import { ITxService } from '../application/ITxService'

export class TxController {
  constructor(private tokenService: ITxService) {}
  async sendTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { signedTx } = req.body
      const txHash = await this.tokenService.sendSignedTransaction(signedTx)
      res.json({ txHash })
    } catch (err) {
      next(err)
    }
  }

  async getTxStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { txHash } = req.params
      const status = await this.tokenService.getTxStatus(txHash)
      res.json({ txHash, status })
    } catch (err) {
      next(err)
    }
  }

  async signTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { rawTx } = req.body
      const signedTx = await this.tokenService.signTransaction(rawTx)
      res.json({ signedTx })
    } catch (err) {
      next(err)
    }
  }

  /**
   * Returns configured router for registration
   */
  get router(): Router {
    const router = Router()
    router.get('/:txHash/status', this.getTxStatus.bind(this))
    router.post('/send', this.sendTransaction.bind(this))
    router.post('/debug/sign', this.signTransaction.bind(this))
    return router
  }
}
