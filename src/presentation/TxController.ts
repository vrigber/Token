import { Router, Request, Response, NextFunction } from 'express'
import { ITxService } from '../application/ITxService'

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Endpoints for sending, signing and querying Ethereum transactions
 */
export class TxController {
  constructor(private txService: ITxService) {}

  /**
   * @swagger
   * /transactions/send:
   *   post:
   *     tags: [Transactions]
   *     summary: Send a signed Ethereum transaction
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               signedTx:
   *                 type: string
   *                 description: Hex‑encoded signed transaction data
   *             required:
   *               - signedTx
   *     responses:
   *       200:
   *         description: Transaction submitted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 txHash:
   *                   type: string
   *                   description: Hash of the submitted transaction
   *               required:
   *                 - txHash
   *       500:
   *         description: Internal server error
   */
  async sendTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { signedTx } = req.body
      const txHash = await this.txService.sendSignedTransaction(signedTx)
      res.json({ txHash })
    } catch (err) {
      next(err)
    }
  }

  /**
   * @swagger
   * /transactions/{txHash}/status:
   *   get:
   *     tags: [Transactions]
   *     summary: Get status of a transaction
   *     parameters:
   *       - in: path
   *         name: txHash
   *         required: true
   *         schema:
   *           type: string
   *         description: Hash of the transaction to query
   *     responses:
   *       200:
   *         description: Transaction status retrieved
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 txHash:
   *                   type: string
   *                   description: Hash of the transaction
   *                 status:
   *                   type: string
   *                   description: Current status (e.g., pending, success, regected)
   *               required:
   *                 - txHash
   *                 - status
   *       500:
   *         description: Internal server error
   */
  async getTxStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { txHash } = req.params
      const status = await this.txService.getTxStatus(txHash)
      res.json({ txHash, status })
    } catch (err) {
      next(err)
    }
  }

  /**
   * @swagger
   * /transactions/debug/sign:
   *   post:
   *     tags: [Transactions]
   *     summary: Sign a raw Ethereum transaction (debug)
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TxDto'
   *     responses:
   *       200:
   *         description: Transaction signed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 signedTx:
   *                   type: string
   *                   description: Hex‑encoded signed transaction data
   *               required:
   *                 - signedTx
   *       500:
   *         description: Internal server error
   */
  async signTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { rawTx } = req.body
      const signedTx = await this.txService.signTransaction(rawTx)
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
