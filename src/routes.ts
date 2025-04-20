import { Router } from 'express'
import { TokenController } from './presentation/TokenController'

export function routes(tokenController: TokenController): Router {
  const router = Router()
  router.get('/:tokenId', tokenController.getTokenInfo.bind(tokenController))
  router.get('/:tokenId/balance/:userId', tokenController.getUserBalance.bind(tokenController))
  return router
}