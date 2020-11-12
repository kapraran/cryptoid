import { app } from './app'
import { PORT } from './config'

export const server = app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server started at ${PORT}`)
)
