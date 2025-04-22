import { Router, Request, Response, NextFunction } from 'express'
import { ITokenService } from '../application/ITokenService'

/**
 * @openapi
 * components:
 *   schemas:
 *     TokenInfoDto:
 *       type: object
 *       properties:
 *         tokenId:
 *           type: string
 *           description: Contract address of the token
 *         name:
 *           type: string
 *           description: Name of the token
 *         symbol:
 *           type: string
 *           description: Symbol of the token
 *         decimals:
 *           type: integer
 *           description: Number of decimal places
 *         totalSupply:
 *           type: string
 *           description: Total token supply as string
 *       required:
 *         - tokenId
 *         - name
 *         - symbol
 *         - decimals
 *         - totalSupply
 *     UserBalanceDto:
 *       type: object
 *       properties:
 *         tokenId:
 *           type: string
 *           description: Contract address of the token
 *         userId:
 *           type: string
 *           description: Address of the user
 *         balance:
 *           type: string
 *           description: User's token balance as string
 *       required:
 *         - tokenId
 *         - userId
 *         - balance
 */

/**
 * Controller for token-related endpoints
 */
export class TokenController {
  constructor(private tokenService: ITokenService) { }

  /**
   * @openapi
   * /tokens/{tokenId}:
   *   get:
   *     tags:
   *       - Tokens
   *     summary: Get token information
   *     parameters:
   *       - in: path
   *         name: tokenId
   *         required: true
   *         schema:
   *           type: string
   *         description: ERC-20 contract address
   *     responses:
   *       '200':
   *         description: Token information retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TokenInfoDto'
   *       '400':
   *         description: Bad request
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
   * @openapi
   * /tokens/{tokenId}/balance/{userId}:
   *   get:
   *     tags:
   *       - Tokens
   *     summary: Get user token balance
   *     parameters:
   *       - in: path
   *         name: tokenId
   *         required: true
   *         schema:
   *           type: string
   *         description: ERC-20 contract address
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: Address of the user
   *     responses:
   *       '200':
   *         description: User balance retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserBalanceDto'
   *       '400':
   *         description: Bad request
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
   * @openapi
   * /tokens/{tokenId}/transfer:
   *   post:
   *     tags:
   *       - Tokens
   *     summary: Transfer tokens
   *     parameters:
   *       - in: path
   *         name: tokenId
   *         required: true
   *         schema:
   *           type: string
   *         description: ERC-20 contract address
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TransferRequestDto'
   *     responses:
   *       '200':
   *         description: Transaction submitted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TransferResponseDto'
   *       '400':
   *         description: Bad request
   */
  async transfer(req: Request, res: Response, next: NextFunction) {
    try {
      const { tokenId } = req.params
      const transferRequest = req.body
      const rawTx = await this.tokenService.transfer(tokenId, transferRequest)
      res.json({ rawTx })
    } catch (err) {
      next(err)
    }
  }

  async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      const approveRequest = req.body;
      const rawTx = await this.tokenService.approve(token, approveRequest);
      res.json({ rawTx });
    } catch (err) {
      next(err);
    }
  }

  async transferFrom(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      const transferFromRequest = req.body;
      const rawTx = await this.tokenService.transferFrom(token, transferFromRequest);
      res.json({ rawTx });
    } catch (err) {
      next(err);
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
    router.post('/:token/approve', this.approve.bind(this));
    router.post('/:token/transferFrom', this.transferFrom.bind(this));
    return router
  }
}
