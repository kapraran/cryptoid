import { PORT } from './../config';
import { app } from './app';

let port = PORT;

if (process.env.START_AS_PEER === 'true') {
  if (process.env.PEER_PORT) {
    port = parseInt(process.env.PEER_PORT.toString(), 10);
  } else {
    port = PORT + Math.floor(Math.random() * 1000);
  }
}

export const server = app.listen(port, '0.0.0.0', () =>
  console.log(`Server started at http://localhost:${port}/`)
);
