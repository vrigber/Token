import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import { ViemRepo } from './infrastructure/ViemRepo'
import { ErrorHandler } from './infrastructure/ErrorHandler'
import { TokenService } from './application/TokenService'
import { TokenController } from './presentation/TokenController'
import { TxService } from './application/TxService'
import { TxController } from './presentation/TxController'
import dotenv from "dotenv";
dotenv.config();

export async function bootstrap() {
  const app = express()
  
  const viemRepo = (process.env.RPC_URL && process.env.CHAIN_NAME)
    ? new ViemRepo(process.env.RPC_URL, process.env.CHAIN_NAME)
    : new ViemRepo()

  const tokenService = new TokenService(viemRepo)
  const txService = new TxService(viemRepo)
  const tokenController = new TokenController(tokenService)
  const txController = new TxController(txService)

  const swaggerSpec = swaggerJSDoc({
    definition: {
      openapi: '3.0.0',
      info: { title: 'Token API', version: '1.0.0' },
    },
    apis: ['./src/presentation/*.ts']
  })
  app.use(express.json())
  app.use('/token', tokenController.router)
  app.use('/tx', txController.router)
  app.use('/index', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  ErrorHandler.register(app)
  return app
}

bootstrap()
  .then(app => app.listen(3000, () => {
    console.log('API listening on http://localhost:3000')
  }))
  .catch(err => {
    console.error('Bootstrap error', err)
    process.exit(1)
  })