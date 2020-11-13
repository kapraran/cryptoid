import { app } from './app'
import { PORT } from './../config'

let port = PORT

if (process.env.START_AS_PEER === 'true') {
  port = PORT + Math.floor(Math.random() * 1000)
}

export const server = app.listen(port, '0.0.0.0', () =>
  console.log(`Server started at ${port}`)
)
