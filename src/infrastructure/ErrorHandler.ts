import { Express, Request, Response, NextFunction } from 'express'

export class ErrorHandler {
  static register(app: Express) {
    app.use((_req: Request, res: Response) => {
      res.status(404).json({ error: 'Not Found' })
    })

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error(err)
      res
        .status(err.status || 500)
        .json({ error: err.message || 'Internal Server Error' })
    })
  }
}