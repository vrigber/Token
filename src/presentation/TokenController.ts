import { Router, Request, Response, NextFunction } from 'express'
import { ITokenService } from '../application/ITokenService'

/**
 * @swagger
 * tags:
 *   name: Tokens
 *   description: ERC‑20 token operations
 */
export class TokenController {
  constructor(private tokenService: ITokenService) {}

  /**
   * @swagger
   * /tokens/{token}:
   *   get:
   *     tags: [Tokens]
   *     summary: Get token information
   *     parameters:
   *       - in: path
   *         name: token
   *         required: true
   *         schema:
   *           type: string
   *         description: ERC‑20 contract address
   *     responses:
   *       200:
   *         description: Token information retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TokenInfoDto'
   *       500:
   *         description: Internal server error
   */
  async getTokenInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params
      const info = await this.tokenService.getTokenInfo(token)
      res.json(info)
    } catch (err) {
      next(err)
    }
  }

  /**
   * @swagger
   * /tokens/{token}/balance/{owner}:
   *   get:
   *     tags: [Tokens]
   *     summary: Get user token balance
   *     parameters:
   *       - in: path
   *         name: token
   *         required: true
   *         schema:
   *           type: string
   *         description: ERC‑20 contract address
   *       - in: path
   *         name: owner
   *         required: true
   *         schema:
   *           type: string
   *         description: Address of the user
   *     responses:
   *       200:
   *         description: User balance retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserBalanceDto'
   *       500:
   *         description: Internal server error
   */
  async getUserBalance(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, owner } = req.params
      const balance = await this.tokenService.getUserBalance(token, owner)
      res.json({ balance })
    } catch (err) {
      next(err)
    }
  }

  /**
   * @swagger
   * /tokens/{token}/allowance/{owner}/{spender}:
   *   get:
   *     tags: [Tokens]
   *     summary: Get allowance for spender
   *     parameters:
   *       - in: path
   *         name: token
   *         required: true
   *         schema:
   *           type: string
   *         description: ERC‑20 contract address
   *       - in: path
   *         name: owner
   *         required: true
   *         schema:
   *           type: string
   *         description: Address of the token owner
   *       - in: path
   *         name: spender
   *         required: true
   *         schema:
   *           type: string
   *         description: Address of the spender
   *     responses:
   *       200:
   *         description: Allowance retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 allowance:
   *                   type: string
   *                   description: Amount approved for spender
   *               required:
   *                 - allowance
   *       500:
   *         description: Internal server error
   */
  async getAllowance(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, owner, spender } = req.params
      const allowance = await this.tokenService.getAllowance(token, owner, spender)
      res.json({ allowance })
    } catch (err) {
      next(err)
    }
  }

  /**
   * @swagger
   * /tokens/{token}/transfer:
   *   post:
   *     tags: [Tokens]
   *     summary: Transfer tokens
   *     parameters:
   *       - in: path
   *         name: token
   *         required: true
   *         schema:
   *           type: string
   *         description: ERC‑20 contract address
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TransferRequestDto'
   *     responses:
   *       200:
   *         description: Transaction submitted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TxDto'
   *       500:
   *         description: Internal server error
   */
  async transfer(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params
      const transferRequest = req.body
      const rawTx = await this.tokenService.transfer(token, transferRequest)
      res.json({ rawTx })
    } catch (err) {
      next(err)
    }
  }

  /**
   * @swagger
   * /tokens/{token}/approve:
   *   post:
   *     tags: [Tokens]
   *     summary: Approve allowance
   *     parameters:
   *       - in: path
   *         name: token
   *         required: true
   *         schema:
   *           type: string
   *         description: ERC‑20 contract address
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ApproveRequestDto'
   *     responses:
   *       200:
   *         description: Transaction submitted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TxDto'
   *       500:
   *         description: Internal server error
   */
  async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params
      const approveRequest = req.body
      const rawTx = await this.tokenService.approve(token, approveRequest)
      res.json({ rawTx })
    } catch (err) {
      next(err)
    }
  }

  /**
   * @swagger
   * /tokens/{token}/transferFrom:
   *   post:
   *     tags: [Tokens]
   *     summary: Transfer tokens using allowance
   *     parameters:
   *       - in: path
   *         name: token
   *         required: true
   *         schema:
   *           type: string
   *         description: ERC‑20 contract address
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TransferFromRequestDto'
   *     responses:
   *       200:
   *         description: Transaction submitted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TxDto'
   *       500:
   *         description: Internal server error
   */
  async transferFrom(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params
      const transferFromRequest = req.body
      const rawTx = await this.tokenService.transferFrom(token, transferFromRequest)
      res.json({ rawTx })
    } catch (err) {
      next(err)
    }
  }

  /**
   * Returns configured router for registration
   */
  get router(): Router {
    const router = Router()
    router.get('/:token', this.getTokenInfo.bind(this))
    router.get('/:token/balance/:owner', this.getUserBalance.bind(this))
    router.get('/:token/allowance/:owner/:spender', this.getAllowance.bind(this))
    router.post('/:token/transfer', this.transfer.bind(this))
    router.post('/:token/approve', this.approve.bind(this))
    router.post('/:token/transferFrom', this.transferFrom.bind(this))
    return router
  }
}
