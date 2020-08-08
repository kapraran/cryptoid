import { app } from './app'

const port = 4000

export const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server started at ${port}`)
})
