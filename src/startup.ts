import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import { TokenRepo } from './infrastructure/TokenRepo'
import { ErrorHandler } from './infrastructure/ErrorHandler'
import { TokenService } from './application/TokenService'
import { TokenController } from './presentation/TokenController'
import { routes } from './routes'

export async function bootstrap() {
  const app = express()
  const tokenRepo = new TokenRepo()
  const tokenService = new TokenService(tokenRepo)
  const tokenController = new TokenController(tokenService)

  const swaggerSpec = swaggerJSDoc({
    definition: {
      openapi: '3.0.0',
      info: { title: 'Token API', version: '1.0.0' },
    },
    apis: ['./src/presentation/*.ts']
  })
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.use('/users', routes(tokenController))
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